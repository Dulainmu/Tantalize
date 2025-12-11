'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ResultsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/vote/stats');
            const data = await res.json();
            if (data.success) {
                setStats(data.stats);
            }
        } catch (e) { }
        setLoading(false);
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 15000); // Poll every 15s (matching cache)
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="min-h-screen bg-[#0f1229] flex items-center justify-center text-white">Loading Results...</div>;

    return (
        <div className="min-h-screen bg-[#0f1229] text-white p-4">
            <div className="max-w-6xl mx-auto py-12">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-amber-600 mb-2">
                        LIVE RESULTS
                    </h1>
                    <p className="text-gray-400 tracking-[0.5em]">KING & QUEEN 2025</p>
                    <div className="inline-block mt-4 px-4 py-1 bg-white/5 rounded-full text-xs text-gray-500">
                        Auto-refresh every 15s • Total Votes: {stats?.total || 0}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* Kings Column */}
                    <div>
                        <h2 className="text-3xl font-bold text-center mb-8 text-gold-400">👑 KINGS</h2>
                        <div className="space-y-6">
                            {stats?.kings.map((king: any, index: number) => (
                                <motion.div
                                    key={king.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white/5 bg-gradient-to-r from-white/5 to-transparent rounded-xl p-4 border border-white/5 relative overflow-hidden"
                                >
                                    {/* Progress Bar Background */}
                                    <div className="absolute top-0 left-0 bottom-0 bg-gold-500/10 z-0 transition-all duration-1000" style={{ width: `${king.percentage}%` }} />

                                    <div className="relative z-10 flex items-center gap-4">
                                        <div className="text-2xl font-bold text-gray-500 w-8">#{king.number}</div>
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-black/50 border border-white/10">
                                            {king.image ? <img src={king.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">🤴</div>}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg">{king.name}</h3>
                                            <p className="text-xs text-gray-400">{king.votes} votes</p>
                                        </div>
                                        <div className="text-2xl font-bold text-gold-400">{king.percentage}%</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Queens Column */}
                    <div>
                        <h2 className="text-3xl font-bold text-center mb-8 text-pink-400">👑 QUEENS</h2>
                        <div className="space-y-6">
                            {stats?.queens.map((queen: any, index: number) => (
                                <motion.div
                                    key={queen.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white/5 bg-gradient-to-r from-white/5 to-transparent rounded-xl p-4 border border-white/5 relative overflow-hidden"
                                >
                                    {/* Progress Bar Background */}
                                    <div className="absolute top-0 left-0 bottom-0 bg-pink-500/10 z-0 transition-all duration-1000" style={{ width: `${queen.percentage}%` }} />

                                    <div className="relative z-10 flex items-center gap-4">
                                        <div className="text-2xl font-bold text-gray-500 w-8">#{queen.number}</div>
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-black/50 border border-white/10">
                                            {queen.image ? <img src={queen.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">👸</div>}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg">{queen.name}</h3>
                                            <p className="text-xs text-gray-400">{queen.votes} votes</p>
                                        </div>
                                        <div className="text-2xl font-bold text-pink-400">{queen.percentage}%</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
