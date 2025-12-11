
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { getSession } from '@/lib/auth';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session || (session.role !== 'TREASURER' && session.role !== 'SUPER_ADMIN')) {
        return NextResponse.json({ success: false }, { status: 401 });
    }

    try {
        const { settlementId } = await req.json();

        // 1. Check if recent (10 mins)
        const settlement = await prisma.settlement.findUnique({ where: { id: settlementId } });
        if (!settlement) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });

        const now = new Date();
        const diff = (now.getTime() - new Date(settlement.timestamp).getTime()) / 1000 / 60; // minutes

        if (diff > 10) {
            return NextResponse.json({ success: false, message: 'Undo window expired (10 mins)' }, { status: 400 });
        }

        // 2. Revert Transaction
        await prisma.$transaction(async (tx) => {
            // Unlink Tickets
            await tx.accessCode.updateMany({
                where: { settlementId: settlementId },
                data: { paymentSettled: false, settlementId: null }
            });

            // Delete Settlement
            await tx.settlement.delete({ where: { id: settlementId } });

            // Log
            await tx.auditLog.create({
                data: {
                    action: 'FINANCE_UNDO',
                    actorId: session.sub as string,
                    actorName: (session.name as string) || 'Treasurer',
                    entityId: String(settlementId), // The ID of the settlement we just deleted
                    details: JSON.stringify({ settlementId, amount: settlement.amount })
                }
            });
        });

        return NextResponse.json({ success: true });

    } catch (e) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
