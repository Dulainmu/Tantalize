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
    const email = 'admin@tantalize.lk';
    const plainPassword = 'admin';
    const password = hashSync(plainPassword, 10);


    await prisma.user.upsert({
        where: { email },
        update: { password },
        create: {
            name: 'Super Admin',
            email,
            password,
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
