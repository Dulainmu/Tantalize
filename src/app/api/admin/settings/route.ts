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
    // Return current settings
    const settings = await prisma.globalSettings.findUnique({ where: { id: 1 } });
    return NextResponse.json({ success: true, settings });
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { isSystemLockdown, isVotingOpen, isResultsPublic } = body;

        const updated = await prisma.globalSettings.update({
            where: { id: 1 },
            data: {
                // Update only if provided
                ...(isSystemLockdown !== undefined && { isSystemLockdown }),
                ...(isVotingOpen !== undefined && { isVotingOpen }),
                ...(isResultsPublic !== undefined && { isResultsPublic }),
            }
        });

        return NextResponse.json({ success: true, settings: updated });
    } catch (e) {
        return NextResponse.json({ success: false, message: 'Update Failed' }, { status: 500 });
    }
}
