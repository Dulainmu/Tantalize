
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { getSession } from '@/lib/auth';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });

    try {
        const userId = session.sub as string;

        const history = await prisma.settlement.findMany({
            where: { agentId: userId },
            orderBy: { timestamp: 'desc' },
            take: 20
        });

        return NextResponse.json({ success: true, history });

    } catch (e) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });

    // Request a settlement for ALL currently pending cash
    // OR select a specific amount? 
    // Usually simpler: "I have transferred 50,000 to Bank. Here is slip. Settle me."
    // Treasurer accepts. Linked to tickets? Or just reducing liability?
    // Current Model: Settlement is closely linked to Tickets. `tickets AccessCode[]`.
    // So Agent says: "I am paying for THESE tickets."

    // Simplification for App:
    // Agent selects "Unsettled Tickets" -> "Pay via Bank Transfer" -> Upload Slip -> "Request Settle".

    const { ticketIds, proofImage } = await req.json(); // proofImage is Base64 or URL

    try {
        const userId = session.sub as string;

        await prisma.$transaction(async (tx) => {
            // Find Tickets
            const tickets = await tx.accessCode.findMany({
                where: {
                    id: { in: ticketIds },
                    assignedToId: userId,
                    paymentSettled: false,
                    OR: [{ status: 'SOLD' }, { status: 'SCANNED' }]
                }
            });

            if (tickets.length !== ticketIds.length) {
                throw new Error("Invalid ticket selection.");
            }

            const totalAmount = tickets.length * 1500; // Hardcoded or fetch price

            // Create Settlement
            const settlement = await tx.settlement.create({
                data: {
                    agentId: userId,
                    amount: totalAmount,
                    status: 'PENDING',
                    proofImage: proofImage || null
                    // TreasurerId is null initially
                }
            });

            // Update Tickets to link to this settlement (but not marked settled yet?)
            // If we link them, they are effectively "Pending Settlement".
            await tx.accessCode.updateMany({
                where: { id: { in: ticketIds } },
                data: { settlementId: settlement.id }
            });
        });

        return NextResponse.json({ success: true });

    } catch (e: any) {
        return NextResponse.json({ success: false, message: e.message }, { status: 500 });
    }
}
