import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, TicketStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { getSession } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// GET: Fetch Inventory
export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as TicketStatus | null;
    const assignedToId = searchParams.get('assignedToId');
    const search = searchParams.get('search');

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 50;
    const skip = (page - 1) * limit;

    try {
        const where: any = {};

        if (status && status !== 'IN_STOCK') where.status = status;
        // Special handling for IN_STOCK (Show tickets that are NOT sold/banned/scanned ?) 
        // Actually, IN_STOCK is a specific status enum value.
        if (status === 'IN_STOCK') where.status = 'IN_STOCK';

        if (assignedToId) where.assignedToId = assignedToId;

        if (search) {
            where.OR = [
                { serialNumber: { contains: search } },
                { code: { contains: search, mode: 'insensitive' } },
                { customerName: { contains: search, mode: 'insensitive' } }
            ];
        }

        const [tickets, total] = await Promise.all([
            prisma.accessCode.findMany({
                where,
                include: { assignedTo: { select: { name: true } } },
                orderBy: { serialNumber: 'asc' },
                take: limit,
                skip
            }),
            prisma.accessCode.count({ where })
        ]);

        return NextResponse.json({ success: true, tickets, total, pages: Math.ceil(total / limit) });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Error' }, { status: 500 });
    }
}

// POST: Batch Assign
export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { startSerial, endSerial, agentId } = await req.json();

        if (!startSerial || !endSerial || !agentId) {
            return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
        }

        // Validate range logic
        // Assuming serials are strings "0001", but comparable as strings if fixed length.
        // Better to check if they exist first.

        const updated = await prisma.accessCode.updateMany({
            where: {
                serialNumber: {
                    gte: startSerial,
                    lte: endSerial
                },
                status: 'IN_STOCK' // Only assign unassigned tickets? Or allow Re-assign?
                // For simplicity, allow re-assigning ANY ticket that isn't SOLD/USED.
                // status: { in: ['IN_STOCK', 'ASSIGNED'] }
            },
            data: {
                assignedToId: agentId,
                status: 'ASSIGNED'
            }
        });

        return NextResponse.json({
            success: true,
            message: `Successfully assigned ${updated.count} tickets to agent.`,
            count: updated.count
        });

        return NextResponse.json({
            success: true,
            message: `Successfully assigned ${updated.count} tickets to agent.`,
            count: updated.count
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

// PATCH: Update Single Ticket
export async function PATCH(req: NextRequest) {
    const session = await getSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id, status, paymentSettled, serialNumber, code, assignedToId } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, message: 'Missing Ticket ID' }, { status: 400 });
        }

        const updateData: any = {};
        if (status) updateData.status = status;
        if (paymentSettled !== undefined) updateData.paymentSettled = paymentSettled;
        if (serialNumber) updateData.serialNumber = serialNumber;
        if (code) updateData.code = code;
        if (assignedToId !== undefined) {
             updateData.assignedToId = assignedToId === '' ? null : assignedToId;
        }

        // If marking as IN_STOCK, should we clear assignment? 
        if (status === 'IN_STOCK') {
            if (!assignedToId) updateData.assignedToId = null; // Only clear if not explicitly setting new agent
            updateData.paymentSettled = false;
            updateData.scannedAt = null; // Reset scan time
        }

        // If manually setting to ASSIGNED or SOLD, ensure it's not marked as scanned
        if (status === 'ASSIGNED' || status === 'SOLD') {
            updateData.scannedAt = null;
        }

        if (status === 'SOLD') {
            updateData.soldAt = new Date();
        }

        const updated = await prisma.accessCode.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({ success: true, ticket: updated });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
