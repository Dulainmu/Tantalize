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
    if (!session || session.role !== 'AGENT') {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { ticketId, customerName, customerPhone } = await req.json();

        if (!ticketId) {
            return NextResponse.json({ success: false, message: 'Missing Ticket ID' }, { status: 400 });
        }

        // Verify ownership and status
        const ticket = await prisma.accessCode.findUnique({
            where: { id: ticketId }
        });

        if (!ticket) {
            return NextResponse.json({ success: false, message: 'Ticket not found' }, { status: 404 });
        }

        if (ticket.assignedToId !== session.id) {
            return NextResponse.json({ success: false, message: 'Not your ticket' }, { status: 403 });
        }

        if (ticket.status !== 'ASSIGNED') {
            return NextResponse.json({ success: false, message: 'Ticket cannot be sold (wrong status)' }, { status: 400 });
        }

        // Mark as SOLD
        const updated = await prisma.accessCode.update({
            where: { id: ticketId },
            data: {
                status: 'SOLD',
                soldAt: new Date(),
                customerName: customerName || null,
                customerPhone: customerPhone || null
            }
        });

        // Log it
        await createAuditLog({
            action: 'MARK_SOLD',
            entityId: ticketId,
            actorId: session.id as string,
            actorName: session.name as string,
            details: { customerName, customerPhone }
        });

        return NextResponse.json({ success: true, ticket: updated });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
