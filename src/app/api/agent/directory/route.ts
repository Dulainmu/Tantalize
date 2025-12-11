
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { getSession } from '@/lib/auth';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });

    try {
        const userId = session.sub as string;

        // Fetch all agents except self
        const colleagues = await prisma.user.findMany({
            where: {
                role: 'AGENT',
                id: { not: userId }
            },
            select: {
                id: true,
                name: true
            },
            orderBy: { name: 'asc' }
        });

        return NextResponse.json({ success: true, colleagues });

    } catch (e) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
