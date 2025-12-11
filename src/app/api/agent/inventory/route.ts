
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

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'STOCK'; // STOCK | SOLD | ALL
    const search = searchParams.get('search') || '';

    try {
        const where: any = {
            assignedToId: session.sub as string
        };

        if (filter === 'STOCK') {
            where.status = 'ASSIGNED'; // Only tickets ready to sell
        } else if (filter === 'SOLD') {
            where.status = { in: ['SOLD', 'SCANNED'] };
        }

        if (search) {
            where.OR = [
                { serialNumber: { contains: search } },
                { code: { contains: search, mode: 'insensitive' } }
            ];
        }

        const tickets = await prisma.accessCode.findMany({
            where,
            orderBy: { serialNumber: 'asc' },
            take: 100 // Cap for mobile performance
        });

        return NextResponse.json({ success: true, tickets });
    } catch (e) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
