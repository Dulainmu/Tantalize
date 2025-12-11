
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

        const kingVotes = await prisma.vote.groupBy({
            by: ['kingId'],
            _count: { kingId: true }
        });

        const queenVotes = await prisma.vote.groupBy({
            by: ['queenId'],
            _count: { queenId: true }
        });

        // We also need candidate names to map IDs.
        // Since candidates change rarely, we could cache them too, or just fetch.
        const candidates = await prisma.candidate.findMany();
        const candidateMap = new Map(candidates.map(c => [c.id, c]));

        // Format Result
        // { id: 1, name: "John", votes: 120, percent: 30 }

        const totalVotes = await prisma.vote.count(); // Total Ballots cast

        const formatStats = (groups: any[], category: 'KING' | 'QUEEN') => {
            const list = candidates
                .filter(c => c.category === category)
                .map(c => {
                    const group = groups.find((g: any) => g[category === 'KING' ? 'kingId' : 'queenId'] === c.id);
                    const count = group ? group._count[category === 'KING' ? 'kingId' : 'queenId'] : 0;
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
            kings: formatStats(kingVotes, 'KING'),
            queens: formatStats(queenVotes, 'QUEEN'),
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
