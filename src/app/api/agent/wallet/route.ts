import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { getSession } from '@/lib/auth';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const TICKET_PRICE = 1500; // Rs. 1500 per ticket

export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session || (session.role !== 'AGENT' && session.role !== 'SUPER_ADMIN')) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const userId = session.id as string;

        // Fetch all tickets assigned to this agent
        const tickets = await prisma.accessCode.findMany({
            where: { assignedToId: userId },
            orderBy: { serialNumber: 'asc' },
            select: {
                id: true,
                serialNumber: true,
                code: true,
                status: true,
                customerName: true,
                paymentSettled: true
            }
        });

        // Calculate Stats
        const total = tickets.length;
        const sold = tickets.filter(t => t.status === 'SOLD' || t.status === 'SCANNED').length;
        const settled = tickets.filter(t => t.paymentSettled).length;

        // Cash in Hand logic:
        // Cash in Hand = (Sold - Settled) * Price
        // Assuming settled tickets means cash was handed over.
        // If a ticket is SOLD but not settled, agent has the cash.
        const soldUnsettled = tickets.filter(t => (t.status === 'SOLD' || t.status === 'SCANNED') && !t.paymentSettled).length;
        const cashInHand = soldUnsettled * TICKET_PRICE;

        return NextResponse.json({
            success: true,
            stats: {
                total,
                sold,
                settled,
                cashInHand,
                ticketPrice: TICKET_PRICE
            },
            tickets
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
