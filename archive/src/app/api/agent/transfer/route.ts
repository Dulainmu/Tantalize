import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { getSession } from '@/lib/auth';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session || session.role !== 'AGENT') {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { ticketIds, toAgentId } = await req.json();

        if (!ticketIds || !toAgentId || !Array.isArray(ticketIds)) {
            return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
        }

        // Verify recipient exists and is an Agent
        const recipient = await prisma.user.findUnique({ where: { id: toAgentId } });
        if (!recipient || recipient.role !== 'AGENT') {
            return NextResponse.json({ success: false, message: 'Invalid recipient' }, { status: 400 });
        }

        // Verify ownership of all tickets
        const count = await prisma.accessCode.count({
            where: {
                id: { in: ticketIds },
                assignedToId: session.id as string,
                status: 'ASSIGNED' // Can only transfer unsold assigned tickets
            }
        });

        if (count !== ticketIds.length) {
            return NextResponse.json({ success: false, message: 'One or more tickets cannot be transferred (not yours or already sold)' }, { status: 400 });
        }

        // Perform Transfer
        await prisma.accessCode.updateMany({
            where: { id: { in: ticketIds } },
            data: {
                assignedToId: toAgentId
            }
        });

        return NextResponse.json({ success: true, message: `Transferred ${count} tickets to ${recipient.name}` });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
