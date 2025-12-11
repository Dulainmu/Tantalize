
import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { compareSync, hashSync } from 'bcryptjs';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const email = 'admin@tantalize.lk';
    const password = 'admin';

    console.log(`🔍 Checking Login for: ${email}`);

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.error("❌ User NOT FOUND in database.");
        return;
    }

    console.log(`✅ User found: ${user.name} (${user.role})`);
    console.log(`🔐 Stored Hash: ${user.password}`);

    const isMatch = compareSync(password, user.password);

    if (isMatch) {
        console.log("✅ Password MATCHES! Authentication logic is correct.");
    } else {
        console.error("❌ Password DOES NOT MATCH.");
        console.log("Testing hash generation:");
        const newHash = hashSync(password, 10);
        console.log(`New Hash for 'admin': ${newHash}`);
        console.log(`Compare New Hash: ${compareSync(password, newHash)}`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
