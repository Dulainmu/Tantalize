
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

        // Incoming Pending (Action Needed)
        const pendingIncoming = await prisma.ticketTransfer.findMany({
            where: {
                toAgentId: userId,
                status: 'PENDING'
            },
            include: { fromAgent: { select: { name: true } }, tickets: { select: { code: true } } }
        });

        // Outgoing Pending (Waiting for them)
        const pendingOutgoing = await prisma.ticketTransfer.findMany({
            where: {
                fromAgentId: userId,
                status: 'PENDING'
            },
            include: { toAgent: { select: { name: true } }, tickets: { select: { code: true } } }
        });

        return NextResponse.json({
            success: true,
            incoming: pendingIncoming,
            outgoing: pendingOutgoing
        });
    } catch (e) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });

    const { toAgentId, ticketIds } = await req.json();

    if (!toAgentId || !ticketIds || ticketIds.length === 0) {
        return NextResponse.json({ success: false, message: 'Invalid Data' }, { status: 400 });
    }

    try {
        const fromAgentId = session.sub as string;

        await prisma.$transaction(async (tx) => {
            // 1. Verify Ticket Ownership
            const count = await tx.accessCode.count({
                where: {
                    id: { in: ticketIds },
                    assignedToId: fromAgentId,
                    status: 'ASSIGNED',
                    transferId: null // Ensure not already in a pending transfer
                }
            });

            if (count !== ticketIds.length) {
                throw new Error("Invalid ticket selection or tickets already in transfer.");
            }

            // 2. Create Transfer Record
            const transfer = await tx.ticketTransfer.create({
                data: {
                    fromAgentId,
                    toAgentId,
                    status: 'PENDING'
                }
            });

            // 3. Link Tickets to Transfer (This locks them logic-wise if we check transferId)
            await tx.accessCode.updateMany({
                where: { id: { in: ticketIds } },
                data: { transferId: transfer.id }
            });
        });

        return NextResponse.json({ success: true });

    } catch (e: any) {
        return NextResponse.json({ success: false, message: e.message }, { status: 500 });
    }
}
