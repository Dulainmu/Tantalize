import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET(req: NextRequest) {
    try {
        // 1. Get Live Feed (Last 50 entries)
        // We look for 'SCANNED' status or AuditLogs with action 'GATE_ENTRY'
        // AuditLogs are better because they have timestamps and are immutable.
        // Also 'SCANNED' status only shows *latest* scan if we allowed multiple?
        // But AuditLog has 'GATE_ENTRY'. Let's fetch from AuditLog.

        const logs = await prisma.auditLog.findMany({
            where: { action: 'GATE_ENTRY' },
            orderBy: { timestamp: 'desc' },
            take: 50
        });

        // Resolve ticket details (Code/Serial)
        // AuditLog.entityId is the Ticket ID.
        // We can fetch ticket details efficiently.
        // Or if AuditLog details JSON has info?
        // Let's just fetch AuditLogs and map them. Ideally populate?
        // Prisma doesn't support relation on AuditLog.entityId (String).

        // We can do a second query to get tickets.
        const ticketIds = logs.map(l => l.entityId);
        const tickets = await prisma.accessCode.findMany({
            where: { id: { in: ticketIds } },
            select: { id: true, code: true, serialNumber: true }
        });

        const ticketMap = new Map(tickets.map(t => [t.id, t]));

        const feed = logs.map(log => {
            const ticket = ticketMap.get(log.entityId);
            return {
                id: log.id,
                ticketCode: ticket?.code || 'UNKNOWN',
                serial: ticket?.serialNumber || '?',
                timestamp: log.timestamp,
                actor: log.actorName
            };
        });

        // 2. Get Stats
        const total = await prisma.accessCode.count(); // Total Inventory
        // Inside count: Status SCANNED or USED?
        // Our 'scan' API sets status to 'SCANNED'.
        // Schema enum had 'SCANNED'.
        // Let's count 'SCANNED'.
        const inside = await prisma.accessCode.count({ where: { status: 'SCANNED' } });

        return NextResponse.json({
            success: true,
            feed,
            stats: {
                total,
                inside
            }
        });

    } catch (error) {
        console.error('Gate Feed Error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
