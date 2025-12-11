'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function GateManagerPage() {
    const [stats, setStats] = useState<any>(null);
    const [liveFeed, setLiveFeed] = useState<any[]>([]);
    const [forceId, setForceId] = useState('');
    const [feedback, setFeedback] = useState<string | null>(null);

    // Initial Fetch
    useEffect(() => {
        // Fetch Live Feed
        fetchFeed();
        // Poll every 5s
        const interval = setInterval(fetchFeed, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchFeed = async () => {
        try {
            // We need a new API for this: /api/admin/gate/feed
            const res = await fetch('/api/admin/gate/feed');
            const data = await res.json();
            if (data.success) {
                setLiveFeed(data.feed);
                setStats(data.stats);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleForceCheckIn = async () => {
        if (!forceId) return;
        setFeedback('Processing...');
        try {
            // Reuse scan API or special force endpoint? Reuse Scan with special mode?
            // "Force Check-in" is basically "Scan by ID".
            // Let's use the Scan API with ENTRY mode. It checks ID by default.
            const res = await fetch('/api/gatekeeper/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: forceId, mode: 'ENTRY' })
            });
            const data = await res.json();
            if (data.success) {
                setFeedback(`✅ Success: ${data.message} (${data.status})`);
                fetchFeed(); // Refresh feed
                setForceId('');
            } else {
                setFeedback(`❌ Error: ${data.message}`);
            }
        } catch (e) {
            setFeedback('❌ Network Error');
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Gate Management</h1>
                    <p className="text-gray-400">Security Control & Live Access Logs</p>
                </div>
                <Link href="/admin/gatekeeper/scanner" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors">
                    <span className="text-xl">📱</span> Launch Scanner
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Col: Stats & Tools */}
                <div className="space-y-8">
                    {/* Live Count Card */}
                    <div className="bg-[#1a1232]/50 p-6 rounded-2xl border border-white/10">
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Inside Venue</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold text-white">{stats?.inside || 0}</span>
                            <span className="text-gray-500">/ {stats?.total || 1500}</span>
                        </div>
                        <div className="mt-4 h-2 bg-black rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${(stats?.inside / (stats?.total || 1)) * 100}%` }} />
                        </div>
                    </div>

                    {/* Force Check-in */}
                    <div className="bg-[#1a1232]/50 p-6 rounded-2xl border border-white/10">
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Force Check-in</h3>
                        <div className="flex flex-col gap-4">
                            <p className="text-xs text-gray-400">Manually grant entry by Ticket ID or Serial if scanner fails entirely.</p>
                            <input
                                type="text"
                                value={forceId}
                                onChange={(e) => setForceId(e.target.value)}
                                className="bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white font-mono"
                                placeholder="Enter ID (e.g. FE45A2)"
                            />
                            <button
                                onClick={handleForceCheckIn}
                                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors"
                            >
                                Grant Entry
                            </button>
                            {feedback && <p className="text-sm font-medium text-white bg-white/10 p-2 rounded">{feedback}</p>}
                        </div>
                    </div>
                </div>

                {/* Right Col: Live Feed */}
                <div className="lg:col-span-2 bg-[#1a1232]/50 p-6 rounded-2xl border border-white/10 h-[600px] flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Live Entry Log</h3>
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {liveFeed.length === 0 ? (
                            <p className="text-center text-gray-500 mt-20">No entries yet...</p>
                        ) : (
                            liveFeed.map((log) => (
                                <div key={log.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-lg">
                                            ✓
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">{log.ticketCode}</p>
                                            <p className="text-xs text-gray-400">Serial: {log.serial || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-mono text-gray-300">{new Date(log.timestamp).toLocaleTimeString()}</p>
                                        <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
