
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function isSystemLocked(): Promise<boolean> {
    try {
        const settings = await prisma.globalSettings.findUnique({ where: { id: 1 } });
        return settings?.isSystemLockdown || false;
    } catch (e) {
        console.error("Failed to check lock status", e);
        return false; // Fail open or closed? detailed in SOP. Fail open for robustness?
        // If DB is down, we probably can't check anyway. 
        // Default to false to avoid bricking system on minor error.
    }
}
