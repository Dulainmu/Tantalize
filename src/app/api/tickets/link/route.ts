
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// GET: List Agents (Simple dropdown data)
export async function GET(req: NextRequest) {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true },
            orderBy: { name: 'asc' }
        });
        return NextResponse.json({ success: true, users });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Error fetching agents' }, { status: 500 });
    }
}

// POST: Link & Assign
export async function POST(req: NextRequest) {
    try {
        const { code, serialNumber, assignedToId } = await req.json();

        if (!code) {
            return NextResponse.json({ success: false, message: 'Missing Ticket Code' }, { status: 400 });
        }

        // Find Ticket
        const ticket = await prisma.accessCode.findFirst({
            where: {
                OR: [
                    { code: { equals: code, mode: 'insensitive' } },
                    { magicLink: { contains: code, mode: 'insensitive' } } // Fallback for full URL
                ]
            }
        });

        if (!ticket) {
            return NextResponse.json({ success: false, message: 'Ticket Not Found' }, { status: 404 });
        }

        // Update Data
        const updateData: any = {};
        if (serialNumber) updateData.serialNumber = serialNumber;
        if (assignedToId) {
            updateData.assignedToId = assignedToId === '' ? null : assignedToId;
            updateData.status = 'ASSIGNED'; // Auto-mark assigned
        } else if (assignedToId === '') {
             updateData.assignedToId = null;
             // Don't reset status if we just clearing agent? Or reset to IN_STOCK?
             // Let's safe default to IN_STOCK if clearing agent AND it wasn't sold/used.
             if (ticket.status === 'ASSIGNED') updateData.status = 'IN_STOCK';
        }

        const updated = await prisma.accessCode.update({
            where: { id: ticket.id },
            data: updateData
        });

        return NextResponse.json({ success: true, ticket: updated });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
