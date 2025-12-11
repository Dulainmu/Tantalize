import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { getSession } from '@/lib/auth';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Hardcoded Ticket Price for Revenue Calculation (or fetch from config if we had one)
const TICKET_PRICE = 1500;

export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'TREASURER')) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 1. Inventory Stats
        const totalTickets = await prisma.accessCode.count();
        const soldTickets = await prisma.accessCode.count({ where: { status: 'SOLD' } });
        const scannedTickets = await prisma.accessCode.count({ where: { status: 'SCANNED' } });

        // Total Sold Effective = Sold + Scanned (since Scanned tickets were sold)
        const totalSoldEffective = soldTickets + scannedTickets;

        const distinctAgents = await prisma.user.count({ where: { role: 'AGENT' } });

        // 2. Financial Stats (Revenue)
        const totalRevenue = totalSoldEffective * TICKET_PRICE;

        // Cash in Hand
        const settledCount = await prisma.accessCode.count({
            where: {
                OR: [{ status: 'SOLD' }, { status: 'SCANNED' }],
                paymentSettled: true
            }
        });
        const pendingCount = totalSoldEffective - settledCount;
        const cashPending = pendingCount * TICKET_PRICE;
        const cashCollected = settledCount * TICKET_PRICE;


        // 3. Velocity (Sold in last 60 mins)
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const boxOfficeVelocity = await prisma.auditLog.count({
            where: {
                action: 'MARK_SOLD',
                timestamp: { gte: oneHourAgo }
            }
        });

        // 4. Gate Live Count
        const liveGateCount = scannedTickets;

        return NextResponse.json({
            success: true,
            stats: {
                totalTickets,
                sold: totalSoldEffective,
                remaining: totalTickets - totalSoldEffective,
                agents: distinctAgents,
                revenue: {
                    total: totalRevenue,
                    collected: cashCollected,
                    pending: cashPending
                },
                velocity: boxOfficeVelocity, // Tickets/hr
                gate: {
                    entered: liveGateCount,
                    total: totalSoldEffective // Capacity vs Sold
                },
                health: 'OK'
            }
        });

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
