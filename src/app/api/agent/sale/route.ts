
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

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { ticketIds, customerName, customerMobile, paymentMode } = await req.json();

    if (!ticketIds || !Array.isArray(ticketIds) || ticketIds.length === 0) {
        return NextResponse.json({ success: false, message: 'No tickets selected' }, { status: 400 });
    }

    try {
        const userId = session.sub as string;
        const userName = session.name || 'Agent';

        // Transaction: Update all tickets to SOLD
        await prisma.$transaction(async (tx) => {
            // 1. Verify ownership and status
            const existingTickets = await tx.accessCode.findMany({
                where: {
                    id: { in: ticketIds },
                    assignedToId: userId,
                    status: 'ASSIGNED', // Can only sell ASSIGNED tickets
                    transferId: null // Cannot sell tickets that are pending transfer
                }
            });

            if (existingTickets.length !== ticketIds.length) {
                throw new Error("Some tickets are invalid or already sold.");
            }

            // 2. Update Tickets
            await tx.accessCode.updateMany({
                where: { id: { in: ticketIds } },
                data: {
                    status: 'SOLD',
                    ownerName: customerName || null,
                    customerMobile: customerMobile || null,
                    paymentMode: paymentMode || 'CASH',
                    updatedAt: new Date()
                }
            });

            // 3. Audit Log (Batch)
            await tx.auditLog.create({
                data: {
                    action: 'MARK_SOLD',
                    entityId: 'BATCH',
                    actorId: userId,
                    actorName: userName,
                    details: JSON.stringify({
                        count: ticketIds.length,
                        ticketIds: ticketIds, // Store IDs for traceability
                        customer: customerName,
                        total_value: ticketIds.length * 1500
                    })
                }
            });
        });

        return NextResponse.json({ success: true, count: ticketIds.length });

    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ success: false, message: e.message || 'Sale Failed' }, { status: 500 });
    }
}
