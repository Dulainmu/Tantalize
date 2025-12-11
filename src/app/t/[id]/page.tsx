import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { notFound } from 'next/navigation';
import VotingForm from '@/components/vote/VotingForm';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const dynamic = 'force-dynamic';

export default async function TicketPage({ params }: { params: { id: string } }) {
    // 1. Validate Ticket
    // The param 'id' is likely the 8-char Human ID or the full UUID?
    // The previous generation script used: `https://tantalize.lk/t/${unique_id}`
    // Where unique_id was `uuid.uuid4().hex[:8]`, which is the `code`.
    // So `params.id` == `code`.

    // We need to fetch by `code`.
    const ticket = await prisma.accessCode.findUnique({
        where: { code: params.id }
    });

    if (!ticket) {
        return notFound();
    }

    // 2. Fetch Global Settings (to check if voting is open)
    // We can pass this to the client component.
    const settings = await prisma.globalSettings.findUnique({ where: { id: 1 } });
    const isVotingOpen = settings?.isVotingOpen || false;

    // 3. Pass data to Client Component
    // We need the ticket's internal ID for the API call, but we shouldn't expose it if not needed?
    // Actually the API expects `ticketId` (UUID).
    // Let's pass the necessary info to the client form.

    return (
        <div className="min-h-screen bg-[#0f1229] text-white p-4">
            <div className="max-w-md mx-auto py-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-amber-600 mb-2">
                        TANTALIZE
                    </h1>
                    <p className="text-gray-400">King & Queen Voting 2025</p>
                </div>

                <div className="bg-[#1a1232]/50 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-xl">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Your Ticket</span>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${ticket.status === 'SOLD' || ticket.status === 'SCANNED' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {ticket.status}
                        </span>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-mono font-bold tracking-widest text-white">{ticket.code}</p>
                        {ticket.customerName && <p className="text-sm text-gray-400 mt-2">Hello, {ticket.customerName}</p>}
                    </div>
                </div>

                {/* The Voting Form */}
                <VotingForm
                    ticketId={ticket.id}
                    hasVoted={!!ticket.votedAt}
                    isVotingOpen={isVotingOpen}
                    ticketStatus={ticket.status}
                />
            </div>
        </div>
    );
}
