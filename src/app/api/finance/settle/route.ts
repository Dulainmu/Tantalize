
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
    // Treasurer Auth Check
    const session = await getSession();
    if (!session || (session.role !== 'TREASURER' && session.role !== 'SUPER_ADMIN')) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { agentId, amount, ticketIds } = await req.json(); // Option A (Ticket IDs) or Option B (Just Amount?)
        // The prompt says: Option A (Select Tickets) OR Option B (Lazy Wrapper)
        // Ideally we want Option A for data integrity. 
        // If Option B is used, we need to auto-select tickets? 
        // Let's stick to Option A first: The UI selects the tickets.

        if (!agentId || !ticketIds || ticketIds.length === 0) {
            return NextResponse.json({ success: false, message: 'No tickets selected' }, { status: 400 });
        }

        // Transaction
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Settlement Record
            const settlement = await tx.settlement.create({
                data: {
                    agentId,
                    treasurerId: session.sub as string,
                    amount: Number(amount)
                }
            });

            // 2. Mark Tickets as Settled
            await tx.accessCode.updateMany({
                where: { id: { in: ticketIds } },
                data: {
                    paymentSettled: true,
                    settlementId: settlement.id
                }
            });

            // 3. Log Audit
            await tx.auditLog.create({
                data: {
                    action: 'FINANCE_SETTLE',
                    actorId: session.sub as string,
                    actorName: (session.name as string) || 'Treasurer',
                    entityId: String(settlement.id), // Settlement ID
                    details: JSON.stringify({ agentId, amount, count: ticketIds.length })
                }
            });

            return settlement;
        });

        return NextResponse.json({ success: true, settlement: result });

    } catch (error) {
        console.error('Settle Error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
