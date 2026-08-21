import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createAuditLog } from '@/lib/audit';
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
                status: 'NOT_FOUND',
                message: 'Ticket Not Found'
            }, { status: 404 });
        }

        // 2. State Check
        // Status can be: 'IN_STOCK', 'ASSIGNED', 'SOLD', 'SCANNED', 'BANNED', 'INVALID'

        let resultStatus = 'VALID';
        let message = 'Ticket Valid';
        let allowEntry = false;
        let isWarning = false;

        // Check lifecycle status
        if (ticket.status === 'INVALID' || ticket.status === 'BANNED') {
            resultStatus = 'BANNED';
            message = 'Ticket Blocked/Banned';
            allowEntry = false;
        }
        else if (ticket.scannedAt !== null || ticket.status === 'SCANNED') {
            resultStatus = 'USED';
            message = `Already Scanned at ${ticket.scannedAt?.toLocaleTimeString()}`;
            allowEntry = false;
        }
        else if (ticket.status === 'IN_STOCK') {
            resultStatus = 'NOT_ISSUED';
            message = 'Ticket Not Issued (In Stock)';
            allowEntry = false;
        }
        else if (ticket.status === 'ASSIGNED') {
            // Ticket is with an agent but not marked sold.
            // Allow entry but WARN.
            resultStatus = 'WARNING';
            message = 'Unpaid/Unsold Ticket - Check with Agent';
            allowEntry = true;
            isWarning = true;
        }
        else if (ticket.status === 'SOLD') {
            // Perfect case
            resultStatus = 'VALID';
            message = 'Access Granted';
            allowEntry = true;
        }

        // 3. Action (depending on Mode)
        if (mode === 'ENTRY') {
            if (allowEntry) {
                // Update DB to mark as Entered
                const updated = await prisma.accessCode.update({
                    where: { id: ticket.id },
                    data: {
                        status: 'SCANNED',
                        scannedAt: new Date(),
                    }
                });

                // Log Entry
                await createAuditLog({
                    action: 'GATE_ENTRY',
                    entityId: ticket.id,
                    actorId: 'GATEKEEPER', // Or pass user ID if gatekeeper authentication is robust
                    actorName: 'Gatekeeper', // Placeholder until Gatekeeper Auth is fully session-based
                    details: { status: isWarning ? 'WARNING' : 'GRANTED', message }
                });

                return NextResponse.json({
                    success: true,
                    status: isWarning ? 'WARNING' : 'GRANTED',
                    ticket: updated,
                    message: isWarning ? message : 'Access Granted'
                });
            } else {
                // Entry Denied
                return NextResponse.json({
                    success: false,
                    status: resultStatus,
                    ticket: ticket,
                    message: message
                }, { status: 409 });
            }
        } else {
            // VERIFY Mode
            return NextResponse.json({
                success: true,
                status: resultStatus,
                ticket: ticket,
                message: message
            });
        }

    } catch (error) {
        console.error('Scan Error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
