
import "dotenv/config";
import { PrismaClient, TicketStatus, TicketType } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const TOTAL_TICKETS = 1500;
    console.log(`🚀 Seeding ${TOTAL_TICKETS} tickets with Serial Numbers ONLY (0001-1500)...`);

    console.log('Clearing existing tickets...');
    await prisma.accessCode.deleteMany({}); // Wipe as requested

    const ticketsToInsert = [];

    for (let i = 1; i <= TOTAL_TICKETS; i++) {
        // Format manual serial number, e.g. "0001", "0050", "1500"
        const serialNumber = i.toString().padStart(4, '0');

        ticketsToInsert.push({
            code: null, // No QR code yet (Binder will assign)
            serialNumber: serialNumber,
            type: TicketType.NORMAL,
            status: TicketStatus.IN_STOCK
        });
    }

    console.log(`Prepared ${ticketsToInsert.length} serial tickets.`);
    console.log(`Inserting into database...`);

    // Bulk Insert
    const BATCH_SIZE = 100;
    let insertedCount = 0;

    for (let i = 0; i < ticketsToInsert.length; i += BATCH_SIZE) {
        const chunk = ticketsToInsert.slice(i, i + BATCH_SIZE);
        try {
            await prisma.accessCode.createMany({
                data: chunk,
                skipDuplicates: true
            });
            insertedCount += chunk.length;
            process.stdout.write(`\r✅ Inserted ${insertedCount}/${TOTAL_TICKETS}`);
        } catch (e) {
            console.error(`\nError batch ${i}:`, e);
        }
    }

    console.log('\n\n✅ Serial Tickets Added Successfully! (Ready for Binder)');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
