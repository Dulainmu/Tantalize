
import "dotenv/config";
import { PrismaClient, Role } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🗑️  Wiping all Committee Members (Agents)...');

    // 1. Unassign all tickets currently assigned to Agents
    console.log('- Unassigning tickets...');
    await prisma.accessCode.updateMany({
        where: {
            assignedTo: {
                role: Role.AGENT
            }
        },
        data: {
            assignedToId: null,
            status: 'IN_STOCK' // Reset status to IN_STOCK if they were assigned
        }
    });

    // 2. Delete related Ticket Transfers
    console.log('- Deleting ticket transfers...');
    await prisma.ticketTransfer.deleteMany({
        where: {
            OR: [
                { fromAgent: { role: Role.AGENT } },
                { toAgent: { role: Role.AGENT } }
            ]
        }
    });

    // 3. Delete Settlements
    console.log('- Deleting settlements...');
    await prisma.settlement.deleteMany({
        where: {
            agent: { role: Role.AGENT }
        }
    });

    // 4. Delete the Users
    console.log('- Deleting users...');
    const result = await prisma.user.deleteMany({
        where: {
            role: Role.AGENT
        }
    });

    console.log(`✅ Successfully removed ${result.count} committee members.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
