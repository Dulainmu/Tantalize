import "dotenv/config";
import { PrismaClient, TicketStatus, TicketType } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const csvPath = path.join(process.cwd(), 'tantalize_tickets.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');

    // Split by newline and remove empty lines
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');

    // Remove header row
    const dataRows = lines.slice(1);

    console.log(`Found ${dataRows.length} tickets to import.`);

    const ticketsToInsert = [];

    for (const line of dataRows) {
        // CSV format: Serial_Number,Human_Readable_ID,QR_Link_URL,Ticket_Status
        // Example: 0001,146AB186,https://tantalize.lk/t/146AB186,NORMAL
        const columns = line.split(',');

        if (columns.length < 3) continue;

        const serialNumber = columns[0].trim();
        const code = columns[1].trim();
        const magicLink = columns[2].trim();

        const typeString = columns[3]?.trim().toUpperCase() || 'NORMAL';

        ticketsToInsert.push({
            serialNumber,
            code,
            magicLink,
            type: typeString === 'VIP' ? TicketType.VIP : TicketType.NORMAL,
            status: TicketStatus.IN_STOCK
        });
    }

    console.log(`Prepared ${ticketsToInsert.length} records. Inserting in batches...`);

    const BATCH_SIZE = 100;
    console.log('Clearing existing tickets...');
    await prisma.accessCode.deleteMany({}); // Dangerous but requested ("Forget the old QR")

    console.log('Seeding new tickets...');
    // We use create instead of createMany to handle potential individual errors better if needed,
    // but creating 1500 one by one is slow. createMany is better.

    // Optimization: Bulk Insert
    // Note: prisma.accessCode.createMany is not available in some adapters or versions if schema isn't compatible, 
    // but here it should be fine.

    // We already have the array 'ticketsToInsert'.
    if (ticketsToInsert.length > 0) {
        // Chunk it to avoid parameter limit issues
        const chunkSize = 100;
        for (let i = 0; i < ticketsToInsert.length; i += chunkSize) {
            const chunk = ticketsToInsert.slice(i, i + chunkSize);
            await prisma.accessCode.createMany({
                data: chunk,
                skipDuplicates: true // Just in case
            });
            console.log(`inserted batch ${i} - ${i + chunk.length}`);
        }
    }
    console.log('✅ Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
