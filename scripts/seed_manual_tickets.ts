
import "dotenv/config";
import { PrismaClient, TicketStatus, TicketType } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { randomBytes } from 'crypto';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const TOTAL_TICKETS = 1500;
    console.log(`🚀 Generatng ${TOTAL_TICKETS} manual tickets (No QR/Serial)...`);

    const ticketsToInsert = [];

    // Use a Set to ensure local uniqueness before DB insert
    const codes = new Set();

    while (ticketsToInsert.length < TOTAL_TICKETS) {
        // Generate 8-char Hex string (Manual/Digital Only)
        // Matching format of python script: uuid.hex[:8].upper()
        const code = randomBytes(4).toString('hex').toUpperCase();

        if (!codes.has(code)) {
            codes.add(code);
            ticketsToInsert.push({
                code: code,
                serialNumber: null, // "Without qr code assigned" as requested
                type: TicketType.NORMAL,
                status: TicketStatus.IN_STOCK
            });
        }
    }

    console.log(`Prepared ${ticketsToInsert.length} unique tickets.`);
    console.log(`Inserting into database... (This might take a moment)`);

    // Bulk Insert
    const BATCH_SIZE = 100;
    let insertedCount = 0;

    for (let i = 0; i < ticketsToInsert.length; i += BATCH_SIZE) {
        const chunk = ticketsToInsert.slice(i, i + BATCH_SIZE);
        try {
            await prisma.accessCode.createMany({
                data: chunk,
                skipDuplicates: true // Skip if we accidentally hit an existing code in DB
            });
            insertedCount += chunk.length;
            process.stdout.write(`\r✅ Inserted ${insertedCount}/${TOTAL_TICKETS}`);
        } catch (e) {
            console.error(`\nError batch ${i}:`, e);
        }
    }

    console.log('\n\n✅ Manual Tickets Added Successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
