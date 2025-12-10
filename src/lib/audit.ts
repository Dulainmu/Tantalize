import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Initialize dedicated Prisma client for logging if needed, or reuse from request context
// For a library helper, we'll instantiate one to be safe, though passing transaction context is better for consistency.
// Ideally, we accept a prisma client instance.

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type AuditAction =
    | 'ASSIGN_BATCH'
    | 'MARK_SOLD'
    | 'TRANSFER'
    | 'GATE_ENTRY'
    | 'GATE_DENY'
    | 'FINANCE_SETTLE';

interface LogParams {
    action: AuditAction;
    entityId: string; // Ticket ID or Agent ID
    actorId: string;
    actorName: string;
    details?: object | string;
}

export async function createAuditLog({ action, entityId, actorId, actorName, details }: LogParams) {
    try {
        await prisma.auditLog.create({
            data: {
                action,
                entityId,
                actorId,
                actorName,
                details: typeof details === 'object' ? JSON.stringify(details) : details
            }
        });
    } catch (error) {
        console.error('Failed to create audit log:', error);
        // Don't throw, we don't want to break the main flow if logging fails
    }
}
