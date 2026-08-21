import "dotenv/config";
import { PrismaClient, Role } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const email = 'admin@tantalize.lk';
    const password = 'admin'; // In production, hash this! For prototype, plain text or simple hash. 
    // Ideally use bcrypt. But for now I'll store it as is and we can add hashing in the API logic.

    // Check if exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        console.log('Admin user already exists.');
        return;
    }

    await prisma.user.create({
        data: {
            name: 'Super Admin',
            email,
            password, // TODO: Implement hashing in Auth API
            role: Role.SUPER_ADMIN
        }
    });

    console.log(`✅ Created Super Admin: ${email} / ${password}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
