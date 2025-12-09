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
    for (let i = 0; i < ticketsToInsert.length; i += BATCH_SIZE) {
        const batch = ticketsToInsert.slice(i, i + BATCH_SIZE);

        // createMany is supported with adapter
        await prisma.accessCode.createMany({
            data: batch,
            skipDuplicates: true,
        });
        console.log(`Inserted batch ${i} to ${i + batch.length}`);
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
