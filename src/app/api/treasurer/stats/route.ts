
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const TICKET_PRICE = 1500;

export async function GET(req: NextRequest) {
    try {
        // 1. Overview Stats
        const totalTickets = await prisma.accessCode.count();
        const expectedRevenue = totalTickets * TICKET_PRICE;

        // Collected: Sum of all Settlements
        const settlements = await prisma.settlement.aggregate({
            _sum: { amount: true }
        });
        const collectedCash = settlements._sum.amount || 0;

        // Pending: Tickets SOLD/USED but NOT Settled
        // Note: Used tickets are also considered financial liabilities if not settled.
        const pendingTicketsCount = await prisma.accessCode.count({
            where: {
                status: { in: ['SOLD', 'SCANNED'] },
                paymentSettled: false
            }
        });
        const pendingCash = pendingTicketsCount * TICKET_PRICE;

        // Unsold: In Stock or Assigned (but not sold)
        // Actually, ASSIGNED tickets are "Unsold" financially.
        const unsoldCount = await prisma.accessCode.count({
            where: { status: { in: ['IN_STOCK', 'ASSIGNED'] } }
        });
        const unsoldValue = unsoldCount * TICKET_PRICE;


        // 2. Agent Liability List
        // We need agents who have SOLD tickets that are not settled.
        // Also show their total assigned.

        // Find all users who are AGENTs
        const agents = await prisma.user.findMany({
            where: { role: 'AGENT' },
            select: { id: true, name: true }
        });

        const liabilityList = await Promise.all(agents.map(async (agent) => {
            const assigned = await prisma.accessCode.count({ where: { assignedToId: agent.id } });

            const soldUnsettled = await prisma.accessCode.count({
                where: {
                    assignedToId: agent.id,
                    status: { in: ['SOLD', 'SCANNED'] }, // Include scanned just in case logic slipped
                    paymentSettled: false
                }
            });

            // Calculate Last Payment
            const lastSettlement = await prisma.settlement.findFirst({
                where: { agentId: agent.id },
                orderBy: { timestamp: 'desc' }
            });

            return {
                id: agent.id,
                name: agent.name,
                assigned,
                soldUnsettled, // This is the debt source
                cashOwed: soldUnsettled * TICKET_PRICE,
                lastPayment: lastSettlement ? lastSettlement.timestamp : null
            };
        }));

        // Sort by Debt (High to Low)
        liabilityList.sort((a, b) => b.cashOwed - a.cashOwed);

        return NextResponse.json({
            success: true,
            stats: {
                expectedRevenue,
                collectedCash,
                pendingCash,
                unsoldValue
            },
            agents: liabilityList
        });

    } catch (error) {
        console.error('Treasurer Stats Error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
