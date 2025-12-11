
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { getSession } from '@/lib/auth';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const TICKET_PRICE = 1500;

export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session || session.role !== 'AGENT') {
        // Allow Super Admin to view specific agent wallet?
        // For now, minimal.
        if (session && session.role === 'SUPER_ADMIN') {
            // Admin viewing their own wallet? Or Debug? Let's just block non-agents or self-view.
            // If Admin wants to view Agent, they use Admin Dashboard.
            // This is for MOBILE APP login.
        } else {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }
    }

    try {
        const userId = session.sub as string;

        // 1. Stock Count (Assigned, Not Sold)
        const stockCount = await prisma.accessCode.count({
            where: {
                assignedToId: userId,
                status: 'ASSIGNED'
            }
        });

        // 2. Cash Liability (Sold/Scanned, Not Settled)
        const liabilityTickets = await prisma.accessCode.count({
            where: {
                assignedToId: userId,
                status: { in: ['SOLD', 'SCANNED'] },
                paymentSettled: false
            }
        });
        const cashLiability = liabilityTickets * TICKET_PRICE;

        // 3. Last Settlement Status
        const lastSettlement = await prisma.settlement.findFirst({
            where: { agentId: userId },
            orderBy: { timestamp: 'desc' },
            take: 1
        });

        // 4. Pending Transfers (Incoming)
        const pendingTransfers = await prisma.ticketTransfer.count({
            where: { toAgentId: userId, status: 'PENDING' }
        });

        return NextResponse.json({
            success: true,
            wallet: {
                stock: stockCount,
                liability: cashLiability,
                lastSettlement: lastSettlement ? {
                    date: lastSettlement.timestamp,
                    amount: lastSettlement.amount,
                    status: lastSettlement.status
                } : null,
                pendingTransfers
            }
        });

    } catch (e) {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
