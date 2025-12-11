
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { getSession } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Handle ACCEPT / REJECT
export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });

    const { transferId, action } = await req.json(); // action: 'ACCEPT' | 'REJECT' | 'CANCEL'

    if (!['ACCEPT', 'REJECT', 'CANCEL'].includes(action)) {
        return NextResponse.json({ success: false, message: 'Invalid Action' }, { status: 400 });
    }

    try {
        const userId = session.sub as string;

        await prisma.$transaction(async (tx) => {
            const transfer = await tx.ticketTransfer.findUnique({
                where: { id: Number(transferId) },
                include: { tickets: true }
            });

            if (!transfer) throw new Error("Transfer not found");
            if (transfer.status !== 'PENDING') throw new Error("Transfer already processed");

            // Authorization Checks
            if (action === 'ACCEPT' || action === 'REJECT') {
                if (transfer.toAgentId !== userId) throw new Error("Not authorized to accept");
            } else if (action === 'CANCEL') {
                if (transfer.fromAgentId !== userId) throw new Error("Not authorized to cancel");
            }

            if (action === 'ACCEPT') {
                // 1. Move Ticket Ownership
                await tx.accessCode.updateMany({
                    where: { transferId: transfer.id },
                    data: {
                        assignedToId: transfer.toAgentId,
                        transferId: null, // Clear transfer link
                    }
                });

                // 2. Audit Log
                await tx.auditLog.create({
                    data: {
                        action: 'TRANSFER_ACCEPT',
                        entityId: String(transfer.id),
                        actorId: userId,
                        actorName: session.name || 'Agent',
                        details: JSON.stringify({ count: transfer.tickets.length, from: transfer.fromAgentId })
                    }
                });
            } else {
                // REJECT or CANCEL -> Release Tickets
                await tx.accessCode.updateMany({
                    where: { transferId: transfer.id },
                    data: { transferId: null }
                });
            }

            // Update Transfer Status
            const finalStatus = action === 'ACCEPT' ? 'ACCEPTED' : (action === 'REJECT' ? 'REJECTED' : 'CANCELLED');
            await tx.ticketTransfer.update({
                where: { id: transfer.id },
                data: { status: finalStatus }
            });
        });

        return NextResponse.json({ success: true });

    } catch (e: any) {
        return NextResponse.json({ success: false, message: e.message }, { status: 500 });
    }
}
