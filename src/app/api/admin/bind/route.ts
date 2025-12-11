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
    if (!session || session.role !== 'SUPER_ADMIN') {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { code, serial } = await req.json();

        if (!code || !serial) {
            return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
        }

        // 1. Find the ticket belonging to the Scanned QR (Ticket A)
        const ticketA = await prisma.accessCode.findUnique({
            where: { code: code }
        });

        if (!ticketA) {
            return NextResponse.json({ success: false, message: 'QR Code not found in system' }, { status: 404 });
        }

        // 2. Find the ticket that currently owns the physical Serial (Ticket B)
        // If it doesn't exist, we just update Ticket A.
        const ticketB = await prisma.accessCode.findFirst({
            where: { serialNumber: serial }
        });

        // Transaction to ensure atomicity
        await prisma.$transaction(async (tx) => {
            // Case 1: Swap Needed (Ticket B exists)
            if (ticketB && ticketB.id !== ticketA.id) {
                // Give Ticket B the old serial of Ticket A (or a temp one? No, just swap)
                // Actually, simply swapping serials might result in a unique constraint violation if we do it directly.
                // But serialNumber is NOT unique in schema? Let's check schema.
                // accessCode.serialNumber is String, NOT marked @unique in provided snippet initially, but logic implies it should be.
                // Re-reading schema lines from previous edits...
                // model AccessCode { ... serialNumber String ... } -> It is NOT @unique in schema. 
                // So we can just update.

                // Update Ticket B to Ticket A's serial
                await tx.accessCode.update({
                    where: { id: ticketB.id },
                    data: { serialNumber: ticketA.serialNumber }
                });
            }

            // Update Ticket A to the NEW Serial (The one we typed)
            await tx.accessCode.update({
                where: { id: ticketA.id },
                data: { serialNumber: serial }
            });
        });

        // Audit Log
        await createAuditLog({
            action: 'BIND_SWAP',
            entityId: ticketA.id,
            actorId: session.id as string,
            actorName: session.name as string,
            details: {
                qrCode: code,
                newSerial: serial,
                swappedWith: ticketB ? ticketB.id : 'NONE'
            }
        });

        return NextResponse.json({
            success: true,
            message: `Bound QR ${code} to Serial ${serial}`,
            swapped: !!ticketB
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
