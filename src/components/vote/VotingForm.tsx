'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
    { key: 'bands', label: '🎸 Best Band', color: 'text-purple-400', border: 'border-purple-500', shadow: 'shadow-purple-500/30' },
    { key: 'soloSinging', label: '🎤 Solo Singing', color: 'text-blue-400', border: 'border-blue-500', shadow: 'shadow-blue-500/30' },
    { key: 'groupSinging', label: '🎶 Group Singing', color: 'text-cyan-400', border: 'border-cyan-500', shadow: 'shadow-cyan-500/30' },
    { key: 'soloDancing', label: '💃 Solo Dancing', color: 'text-pink-400', border: 'border-pink-500', shadow: 'shadow-pink-500/30' },
    { key: 'groupDancing', label: '👯 Group Dancing', color: 'text-orange-400', border: 'border-orange-500', shadow: 'shadow-orange-500/30' },
];

export default function VotingForm({ ticketId, hasVoted, isVotingOpen, ticketStatus }: any) {
    // State
    const [candidates, setCandidates] = useState<any>(null);
    const [votes, setVotes] = useState<any>({});

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(hasVoted);
    const [error, setError] = useState<string | null>(null);

    // Fetch Candidates
    useEffect(() => {
        fetch('/api/vote/candidates')
            .then(res => res.json())
            .then(data => {
                if (data.success) setCandidates(data.candidates);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleSelect = (categoryKey: string, id: number) => {
        setVotes((prev: any) => ({ ...prev, [categoryKey + 'Id']: id })); // Construct API key: bandId, soloSingingId etc.
    };

    const isComplete = () => {
        // Check if all categories with candidates have a selection
        if (!candidates) return false;
        // Logic: If a category has candidates, a vote must be cast? Or optional?
        // Usually optional. But let's assume they want to vote for at least one?
        // Let's make it so they can submit whatever they want, provided at least ONE vote is there.
        return Object.keys(votes).length > 0;
    };

    // Submit Vote
    const handleVote = async () => {
        if (!isComplete()) return;
        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch('/api/vote/cast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketId, votes })
            });

            const data = await res.json();

            if (data.success) {
                setSuccess(true);
            } else {
                setError(data.message);
            }
        } catch (e) {
            setError('Network Error');
        } finally {
            setSubmitting(false);
        }
    };

    // --- Render States ---

    if (loading) return <div className="text-center text-gray-500 animate-pulse">Loading Finalists...</div>;

    if (success) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-white mb-2">Votes Cast!</h2>
                <p className="text-gray-400">Thank you for voting.</p>
                <div className="mt-8">
                    <a href="/vote/results" className="text-gold-400 hover:text-gold-300 underline font-bold">View Live Results &rarr;</a>
                </div>
            </motion.div>
        );
    }

    if (!isVotingOpen) {
        return (
            <div className="text-center py-12 bg-[#1a1232]/50 rounded-2xl border border-white/10">
                <div className="text-4xl mb-4">🔒</div>
                <h2 className="text-xl font-bold text-white">Voting is Closed</h2>
                <p className="text-gray-400 text-sm mt-2">The voting lines are currently suspended.</p>
            </div>
        );
    }

    if (ticketStatus !== 'SOLD' && ticketStatus !== 'SCANNED' && ticketStatus !== 'USED' && ticketStatus !== 'ASSIGNED') {
        if (ticketStatus === 'ASSIGNED') {
            return (
                <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-center">
                    <p className="text-yellow-400 font-bold mb-2">Ticket Not Active</p>
                    <p className="text-sm text-gray-400">Your ticket has been assigned but not marked as SOLD. Please contact your agent to activate voting.</p>
                </div>
            );
        }
        return (
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                <p className="text-red-400 font-bold">Ticket Invalid for Voting ({ticketStatus})</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">

            {CATEGORIES.map(cat => {
                const items = candidates?.[cat.key] || [];
                if (items.length === 0) return null;

                const selectedId = votes[cat.key + 'Id'];

                return (
                    <section key={cat.key}>
                        <h3 className={`text-xl font-bold text-center mb-6 uppercase tracking-widest ${cat.color}`}>{cat.label}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {items.map((c: any) => (
                                <div
                                    key={c.id}
                                    onClick={() => handleSelect(cat.key, c.id)}
                                    className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all relative ${selectedId === c.id ? `${cat.border} ${cat.shadow} bg-white/10` : 'border-transparent bg-white/5 hover:bg-white/10'}`}
                                >
                                    <div className="aspect-[3/4] bg-black/50 relative">
                                        {c.image ? (
                                            <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-4xl opacity-50">👤</div>
                                        )}
                                        {c.institute && <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded">
                                            {c.institute}
                                        </div>}
                                    </div>
                                    <div className="p-3 text-center">
                                        <p className="font-bold text-sm text-white truncate">{c.name}</p>
                                    </div>
                                    {selectedId === c.id && (
                                        <div className="absolute inset-0 border-4 border-current opacity-20 animate-pulse pointer-events-none" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                );
            })}

            {/* Submit Button */}
            <div className="pt-8 pb-20">
                {error && <p className="text-red-400 text-center mb-4 text-sm bg-red-500/10 p-2 rounded">{error}</p>}

                <button
                    onClick={handleVote}
                    disabled={!isComplete() || submitting}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${(!isComplete()) ? 'bg-gray-700 text-gray-500 cursor-not-allowed' :
                            submitting ? 'bg-yellow-600 text-white cursor-wait' :
                                'bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-black shadow-lg shadow-gold-500/20'
                        }`}
                >
                    {submitting ? 'Submitting Votes...' : 'CAST VOTES'}
                </button>
            </div>
        </div>
    );
}
