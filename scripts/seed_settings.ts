
import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding Global Settings...');

    // Use Raw SQL to bypass potentical Prisma Client generation lag in this env
    await prisma.$executeRawUnsafe(`
        INSERT INTO "GlobalSettings" ("id", "isSystemLockdown", "isVotingOpen", "isResultsPublic", "updatedAt")
        VALUES (1, false, false, false, NOW())
        ON CONFLICT ("id") DO NOTHING;
    `);

    console.log('✅ Global Settings Seeded.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
