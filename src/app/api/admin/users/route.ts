import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { getSession } from '@/lib/auth';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session || (session.role !== 'SUPER_ADMIN')) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const users = await prisma.user.findMany({
            where: {
                role: { not: Role.GATE_GUARD } // Fetch Admins and Agents
            },
            select: { id: true, name: true, role: true, email: true }
        });

        return NextResponse.json({ success: true, users });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Error fetching users' }, { status: 500 });
    }
}
