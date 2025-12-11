
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { unstable_cache } from 'next/cache';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const dynamic = 'force-dynamic'; // Prevent static caching of the endpoint itself if needed, but we cache data

// GET /api/vote/candidates
// Public endpoint to get list. 
// We use unstable_cache for the DATA, not the route.
const getCandidates = unstable_cache(
    async () => {
        const candidates = await prisma.candidate.findMany({
            orderBy: { id: 'asc' } // Or by seeded order
        });

        // Group by category
        return {
            bands: candidates.filter(c => c.category === 'BAND'),
            soloSinging: candidates.filter(c => c.category === 'SOLO_SINGING'),
            groupSinging: candidates.filter(c => c.category === 'GROUP_SINGING'),
            soloDancing: candidates.filter(c => c.category === 'SOLO_DANCING'),
            groupDancing: candidates.filter(c => c.category === 'GROUP_DANCING'),
        };
    },
    ['candidates-list'],
    { revalidate: 3600 } // Cache for 1 hour, or until revalidated
);

export async function GET(req: NextRequest) {
    try {
        const candidates = await getCandidates();
        return NextResponse.json({ success: true, candidates });
    } catch (e) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
