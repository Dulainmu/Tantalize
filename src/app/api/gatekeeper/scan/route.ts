import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Initialize Prisma with Adapter (Robust for Serverless/Edge/Direct)
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { code, mode } = body; // mode: 'ENTRY' or 'VERIFY'

        if (!code) {
            return NextResponse.json({ success: false, message: 'No code provided' }, { status: 400 });
        }

        // 1. Find the Ticket
        // The 'code' from QR is the 'magicLink' (full URL) OR the 'code' (ID) depending on what was scanned.
        // Our QR generation used "QR_Link_URL" which is "https://tantalize.lk/t/XXXXXXXX".
        // Gatekeeper might scan the FULL URL. We should extract the ID if possible, or search by magicLink.

        // Logic: If Code contains '/t/', extract the last part.
        let searchCode = code;
        if (code.includes('/t/')) {
            const parts = code.split('/t/');
            searchCode = parts[parts.length - 1]; // "FE5A34AB"
        }

        // Search by 'code' (Human Readable ID) since unique_id was used for code AND URL end
        const ticket = await prisma.accessCode.findUnique({
            where: { code: searchCode },
        });

        if (!ticket) {
            return NextResponse.json({
                success: false,
                status: 'INVALID',
                message: 'Invalid Ticket'
            }, { status: 404 });
        }

        // 2. State Check
        // Status can be: 'NORMAL', 'VIP', 'SCANNED', 'INVALID'
        // Also check 'scannedAt' timestamp for robustness

        let resultStatus = 'VALID';
        let message = 'Ticket Valid';

        if (ticket.status === 'INVALID') {
            resultStatus = 'INVALID';
            message = 'Ticket Blocked/Invalid';
        } else if (ticket.scannedAt !== null || ticket.status === 'SCANNED') {
            resultStatus = 'USED';
            message = `Already Scanned at ${ticket.scannedAt?.toLocaleTimeString()}`;
        }

        // 3. Action (depending on Mode)
        if (mode === 'ENTRY') {
            if (resultStatus === 'VALID') {
                // Update DB to mark as Entered
                const updated = await prisma.accessCode.update({
                    where: { id: ticket.id },
                    data: {
                        status: 'SCANNED',
                        scannedAt: new Date(),
                    }
                });
                return NextResponse.json({
                    success: true,
                    status: 'GRANTED',
                    ticket: updated,
                    message: 'Access Granted'
                });
            } else {
                // Entry Denied
                return NextResponse.json({
                    success: false,
                    status: resultStatus, // USED or INVALID
                    ticket: ticket,
                    message: message
                }, { status: 409 }); // 409 Conflict
            }
        } else {
            // VERIFY Mode (Read Only)
            return NextResponse.json({
                success: true,
                status: resultStatus, // VALID, USED, or INVALID
                ticket: ticket,
                message: message
            });
        }

    } catch (error) {
        console.error('Scan Error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
