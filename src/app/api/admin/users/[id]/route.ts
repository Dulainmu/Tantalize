import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, TicketStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { getSession } from '@/lib/auth';
import { hashSync } from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// GET: Fetch Single User Details with Stats
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { assignedTickets: true }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        // Calculate Specific Ticket Stats
        const soldCount = await prisma.accessCode.count({
            where: { assignedToId: id, status: TicketStatus.SOLD }
        });

        const inStockCount = await prisma.accessCode.count({
            where: { assignedToId: id, status: TicketStatus.ASSIGNED } // "ASSIGNED" to agent means "IN_STOCK" for them
        });

        // Calculate Wallet (Cash in Hand)
        // Logic: Total Value of SOLD tickets - Total SETTLED amount
        const TICKET_PRICE = 1500;
        const totalSalesValue = soldCount * TICKET_PRICE;

        const settlements = await prisma.settlement.findMany({
            where: { agentId: id, status: 'CONFIRMED' }
        });
        const totalSettled = settlements.reduce((sum: number, s: { amount: number }) => sum + s.amount, 0);

        const walletBalance = totalSalesValue - totalSettled;

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                stats: {
                    totalAssigned: user._count.assignedTickets,
                    sold: soldCount,
                    inHand: inStockCount,
                    walletBalance: walletBalance,
                    totalSettled: totalSettled
                }
            }
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

// PUT: Update User (Edit Profile / Reset Password)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { name, email, role, password } = await req.json();

    try {
        const dataToUpdate: any = { name, email, role };

        // Only update password if provided
        if (password && password.length >= 6) {
            dataToUpdate.password = hashSync(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: dataToUpdate
        });

        return NextResponse.json({ success: true, message: 'User updated successfully' });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Update Failed' }, { status: 500 });
    }
}
