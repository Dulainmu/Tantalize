'use client';

import React, { useState, useEffect } from 'react';
import AgentLiabilityTable from '@/components/treasurer/AgentLiabilityTable';

export default function TreasurerDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [agents, setAgents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshData = () => {
        fetch('/api/treasurer/stats')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setStats(data.stats);
                    setAgents(data.agents);
                }
                setLoading(false);
            });
    }

    useEffect(() => {
        refreshData();
    }, []);

    if (loading) return <div className="text-white p-8">Loading Vault...</div>;

    const formatLKR = (val: number) => {
        return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="min-h-screen bg-[#0f1229] text-white p-6 md:p-12">
            <h1 className="text-3xl font-bold mb-2 text-gold-400">Treasurer's Vault 💰</h1>
            <p className="text-gray-400 mb-8">Financial Command Center</p>

            {/* 1. Money Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">

                {/* Expected Revenue */}
                <div className="bg-[#1a1232]/50 border border-white/10 p-6 rounded-2xl">
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Total Expected</p>
                    <p className="text-2xl font-bold text-gray-300 mt-2">{formatLKR(stats?.expectedRevenue || 0)}</p>
                </div>

                {/* Collected Cash */}
                <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-2xl">
                    <p className="text-xs text-green-400 uppercase tracking-widest font-bold">Cash Collected (Safe)</p>
                    <p className="text-3xl font-black text-white mt-1">{formatLKR(stats?.collectedCash || 0)}</p>
                </div>

                {/* Pending Cash (Debt) */}
                <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-2xl">
                    <p className="text-xs text-red-400 uppercase tracking-widest font-bold">Pending (Agent Debt)</p>
                    <p className="text-3xl font-black text-red-500 mt-1">{formatLKR(stats?.pendingCash || 0)}</p>
                </div>

                {/* Unsold Value */}
                <div className="bg-[#1a1232]/50 border border-white/10 p-6 rounded-2xl opacity-50">
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Unsold Inventory</p>
                    <p className="text-2xl font-bold text-gray-400 mt-2">{formatLKR(stats?.unsoldValue || 0)}</p>
                </div>
            </div>

            {/* 2. Agent Liability */}
            <div className="bg-[#1a1232]/50 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="font-bold text-xl">Agent Liability List</h2>
                    <button onClick={refreshData} className="text-sm text-gold-400 hover:underline">Refresh</button>
                </div>

                <AgentLiabilityTable agents={agents} onSettle={refreshData} />
            </div>
        </div>
    );
}
