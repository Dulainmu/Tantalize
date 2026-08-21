import "dotenv/config";
import { PrismaClient, TicketStatus } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🔄 Resetting all tickets to IN_STOCK...');

    const result = await prisma.accessCode.updateMany({
        where: {}, // All records
        data: {
            status: TicketStatus.IN_STOCK,
            assignedToId: null,
            customerName: null,
            customerPhone: null,
            paymentSettled: false,
            soldAt: null,
            scannedAt: null,
            votedAt: null
        }
    });

    console.log(`✅ Successfully reset ${result.count} tickets.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
