import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { getSession } from '@/lib/auth';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const TICKET_PRICE = 1500; // Rs. 1500

export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session || (session.role !== 'TREASURER' && session.role !== 'SUPER_ADMIN')) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Fetch all agents
        const agents = await prisma.user.findMany({
            where: { role: 'AGENT' },
            select: { id: true, name: true, role: true }
        });

        // For each agent, calculate stats
        // Optimized: We could do a groupBy query on AccessCode, but looping agents is fine for N < 100.

        const stats = await Promise.all(agents.map(async (agent) => {
            const tickets = await prisma.accessCode.findMany({
                where: { assignedToId: agent.id },
                select: { id: true, status: true, paymentSettled: true }
            });

            const pendingTickets = tickets.filter(t => (t.status === 'SOLD' || t.status === 'SCANNED') && !t.paymentSettled);
            const pendingCount = pendingTickets.length;
            const pendingAmount = pendingCount * TICKET_PRICE;

            const settledCount = tickets.filter(t => t.paymentSettled).length;
            const settledAmount = settledCount * TICKET_PRICE;

            return {
                id: agent.id,
                name: agent.name,
                role: agent.role,
                pendingCount,
                pendingAmount,
                settledCount,
                settledAmount,
                ticketIds: pendingTickets.map(t => t.id) // Needed for bulk settlement
            };
        }));

        return NextResponse.json({ success: true, agents: stats });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
