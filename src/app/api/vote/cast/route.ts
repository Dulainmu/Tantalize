
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { isSystemLocked } from '@/lib/settings';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(req: NextRequest) {
    try {
        const { ticketId, votes } = await req.json();
        // votes: { bandId, soloSingingId, groupSingingId, soloDancingId, groupDancingId }

        if (!ticketId || !votes) {
            return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
        }

        // 1. Security Checks
        if (await isSystemLocked()) {
            return NextResponse.json({ success: false, message: 'Voting is temporarily suspended.' }, { status: 503 });
        }

        const settings = await prisma.globalSettings.findUnique({ where: { id: 1 } });
        if (!settings?.isVotingOpen) {
            return NextResponse.json({ success: false, message: 'Voting is currently CLOSED.' }, { status: 403 });
        }

        // 2. Ticket Validation
        const ticket = await prisma.accessCode.findUnique({ where: { id: ticketId } });

        if (!ticket) {
            return NextResponse.json({ success: false, message: 'Invalid Ticket' }, { status: 404 });
        }

        if (ticket.votedAt) {
            return NextResponse.json({ success: false, message: 'Vote already cast for this ticket.' }, { status: 409 });
        }

        if (ticket.status !== 'SOLD' && ticket.status !== 'SCANNED') {
            return NextResponse.json({ success: false, message: 'Ticket must be SOLD to vote.' }, { status: 403 });
        }

        // 3. Transaction
        await prisma.$transaction(async (tx) => {
            // Create Vote Ballot
            await tx.vote.create({
                data: {
                    accessCodeId: ticket.id,
                    bandId: votes.bandId ? Number(votes.bandId) : null,
                    soloSingingId: votes.soloSingingId ? Number(votes.soloSingingId) : null,
                    groupSingingId: votes.groupSingingId ? Number(votes.groupSingingId) : null,
                    soloDancingId: votes.soloDancingId ? Number(votes.soloDancingId) : null,
                    groupDancingId: votes.groupDancingId ? Number(votes.groupDancingId) : null,
                }
            });

            // Mark Ticket as Voted
            await tx.accessCode.update({
                where: { id: ticket.id },
                data: { votedAt: new Date() }
            });
        });

        return NextResponse.json({ success: true, message: 'Votes Cast Successfully!' });

    } catch (error) {
        console.error('Vote Error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
