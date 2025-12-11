
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { unstable_cache } from 'next/cache';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Cache this function for 15 seconds
const getCachedStats = unstable_cache(
    async () => {
        // Count all votes
        // We can do this efficiently by aggregating on 'kingId' and 'queenId' in the Vote table.
        // But Prisma GroupBy is easy.

        // Helper to get stats for a category
        const getCategoryStats = async (field: 'bandId' | 'soloSingingId' | 'groupSingingId' | 'soloDancingId' | 'groupDancingId') => {
            const groups = await prisma.vote.groupBy({
                by: [field],
                _count: { [field]: true }
            });

            // Map candidate IDs to counts
            const counts: Record<number, number> = {};
            groups.forEach(g => {
                if (g[field]) counts[g[field] as number] = g._count[field];
            });
            return counts;
        };

        const [bands, soloSinging, groupSinging, soloDancing, groupDancing] = await Promise.all([
            getCategoryStats('bandId'),
            getCategoryStats('soloSingingId'),
            getCategoryStats('groupSingingId'),
            getCategoryStats('soloDancingId'),
            getCategoryStats('groupDancingId')
        ]);

        const candidates = await prisma.candidate.findMany();
        const candidateMap = new Map(candidates.map(c => [c.id, c]));

        // Format Result
        // { id: 1, name: "John", votes: 120, percent: 30 }

        const totalVotes = await prisma.vote.count(); // Total Ballots cast

        const formatStats = (categoryCounts: Record<number, number>, category: 'BAND' | 'SOLO_SINGING' | 'GROUP_SINGING' | 'SOLO_DANCING' | 'GROUP_DANCING') => {
            const list = candidates
                .filter(c => c.category === category)
                .map(c => {
                    const count = categoryCounts[c.id] || 0;
                    return {
                        id: c.id,
                        name: c.name,
                        number: c.number,
                        image: c.image,
                        votes: count,
                        percentage: totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : 0
                    };
                });
            return list.sort((a, b) => b.votes - a.votes);
        };

        return {
            bands: formatStats(bands, 'BAND'),
            soloSinging: formatStats(soloSinging, 'SOLO_SINGING'),
            groupSinging: formatStats(groupSinging, 'GROUP_SINGING'),
            soloDancing: formatStats(soloDancing, 'SOLO_DANCING'),
            groupDancing: formatStats(groupDancing, 'GROUP_DANCING'),
            total: totalVotes,
            timestamp: Date.now()
        };
    },
    ['voting-stats'], // Cache Key
    { revalidate: 15 } // Config: 15 seconds validity
);

export async function GET(req: NextRequest) {
    try {
        const stats = await getCachedStats();
        return NextResponse.json({ success: true, stats });
    } catch (e) {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
