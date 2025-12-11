
import "dotenv/config";
import { PrismaClient, Role } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const email = 'agent@tantalize.lk';
    const plainPassword = 'agent';
    const password = hashSync(plainPassword, 10);

    // Create or Update Agent
    await prisma.user.upsert({
        where: { email },
        update: {
            password,
            role: Role.AGENT
        },
        create: {
            name: 'Bond, James Bond',
            email,
            password,
            role: Role.AGENT
        }
    });

    console.log(`✅ Created Committee Agent: ${email} / ${plainPassword}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
