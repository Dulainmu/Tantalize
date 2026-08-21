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
    if (!session || (session.role !== 'TREASURER' && session.role !== 'SUPER_ADMIN')) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { agentId, amount, ticketIds } = await req.json();

        if (!agentId || !amount || !ticketIds || !Array.isArray(ticketIds)) {
            return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
        }

        const agent = await prisma.user.findUnique({ where: { id: agentId } });
        if (!agent) {
            return NextResponse.json({ success: false, message: 'Agent not found' }, { status: 404 });
        }

        // 1. Update Tickets to Settled
        const updateResult = await prisma.accessCode.updateMany({
            where: {
                id: { in: ticketIds },
                assignedToId: agentId,
                status: 'SOLD', // Must be sold first
                paymentSettled: false // Only settle unsettled ones
            },
            data: {
                paymentSettled: true
            }
        });

        if (updateResult.count === 0) {
            return NextResponse.json({ success: false, message: 'No eligible tickets to settle.' }, { status: 400 });
        }

        // 2. Audit Log
        await createAuditLog({
            action: 'FINANCE_SETTLE',
            entityId: agentId,
            actorId: session.id as string,
            actorName: session.name as string,
            details: {
                amountRef: amount,
                ticketCount: updateResult.count,
                ticketIds: ticketIds
            }
        });

        return NextResponse.json({
            success: true,
            message: `Successfully settled Rs. ${amount} for ${updateResult.count} tickets.`,
            count: updateResult.count
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
