'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
type AgentFinance = {
    id: string;
    name: string;
    role: string;
    pendingCount: number;
    pendingAmount: number;
    settledCount: number;
    settledAmount: number;
    ticketIds: string[];
};

// Reuse component or build inline
export default function TreasurerDashboard() {
    const [agents, setAgents] = useState<AgentFinance[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAgent, setSelectedAgent] = useState<AgentFinance | null>(null);

    // Settlement State
    const [settling, setSettling] = useState(false);
    const [settleResult, setSettleResult] = useState('');

    useEffect(() => {
        fetchFinanceData();
    }, []);

    const fetchFinanceData = async () => {
        setLoading(true);
        // We can reuse /api/admin/users but maybe we need a specific stats endpoint
        // For speed, let's update /api/admin/users to return finance stats if requested? 
        // Or create a new one. Let's assume we create /api/treasurer/stats

        // Actually, let's just make a new endpoint to keep things clean: /api/treasurer/stats
        const res = await fetch('/api/treasurer/stats');
        const data = await res.json();

        if (data.success) {
            setAgents(data.agents);
        }
        setLoading(false);
    };

    const handleSettle = async () => {
        if (!selectedAgent) return;
        setSettling(true);

        try {
            const res = await fetch('/api/finance/settle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    agentId: selectedAgent.id,
                    amount: selectedAgent.pendingAmount,
                    ticketIds: selectedAgent.ticketIds // Wait, expected API logic?
                    // The API /api/finance/settle takes ticketIds. 
                    // Our current stats endpoint needs to return those IDs or we need to fetch them.
                    // Let's modify the flow: "Settle All Pending" is the button.
                })
            });
            // Correction: Previous API implementation for /api/finance/settle expects ticketIds.
            // I need to ensure /api/treasurer/stats returns eligible ticket IDs for each agent.
            // Or change /api/finance/settle to accept "settleAll: true".

            // Let's stick to passing IDs. I will update the stats API to include them.

            const data = await res.json();
            if (data.success) {
                setSettleResult(`✅ Settled Rs. ${selectedAgent.pendingAmount.toLocaleString()}`);
                setTimeout(() => {
                    setSelectedAgent(null);
                    setSettleResult('');
                    fetchFinanceData();
                }, 2000);
            } else {
                setSettleResult(`❌ ${data.message}`);
            }
        } catch (err) {
            setSettleResult('❌ Network Error');
        } finally {
            setSettling(false);
        }
    };

    // Calculate Grand Total
    const totalPending = agents.reduce((acc, a) => acc + a.pendingAmount, 0);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Finance Overview</h1>
            <p className="text-emerald-500/60 mb-8">Cash Inflow Management</p>

            {/* Global Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-emerald-900/10 border border-emerald-500/20 p-6 rounded-2xl">
                    <h3 className="text-emerald-500 text-sm font-bold uppercase mb-2">Total Pending Collection</h3>
                    <p className="text-4xl font-bold">Rs. {totalPending.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-2">Cash currently held by agents</p>
                </div>
                <div className="bg-emerald-900/10 border border-emerald-500/20 p-6 rounded-2xl">
                    <h3 className="text-emerald-500 text-sm font-bold uppercase mb-2">Agents with Cash</h3>
                    <p className="text-4xl font-bold">{agents.filter(a => a.pendingAmount > 0).length}</p>
                    <p className="text-xs text-gray-500 mt-2">Active collectors</p>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-4">Agent Collections</h2>
            <div className="bg-[#0f2e15]/50 border border-emerald-500/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-emerald-900/20 text-emerald-500 text-xs uppercase font-bold">
                        <tr>
                            <th className="p-4">Agent Name</th>
                            <th className="p-4">Tickets Sold</th>
                            <th className="p-4">Pending Cash</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-500/10">
                        {agents.map(agent => (
                            <tr key={agent.id} className="hover:bg-emerald-500/5 transition-colors">
                                <td className="p-4 font-bold">{agent.name}</td>
                                <td className="p-4">
                                    {agent.pendingCount} <span className="text-gray-600 text-xs">/ {agent.pendingCount + agent.settledCount} Total</span>
                                </td>
                                <td className="p-4 text-emerald-400 font-mono">
                                    {agent.pendingAmount > 0 ? `Rs. ${agent.pendingAmount.toLocaleString()}` : '-'}
                                </td>
                                <td className="p-4 text-right">
                                    {agent.pendingAmount > 0 && (
                                        <button
                                            onClick={() => setSelectedAgent(agent)}
                                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-emerald-600/20"
                                        >
                                            Collect
                                        </button>
                                    )}
                                    {agent.pendingAmount === 0 && (
                                        <span className="text-white/20 text-xs italic">Settled</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Settle Modal */}
            <AnimatePresence>
                {selectedAgent && (
                    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#0a1f0a] border border-emerald-500/30 w-full max-w-md p-8 rounded-2xl shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold mb-1">Confirm Settlement</h2>
                            <p className="text-gray-400 text-sm mb-6">Verify cash receipt from agent.</p>

                            <div className="bg-emerald-900/20 p-4 rounded-xl border border-emerald-500/20 mb-6 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Agent:</span>
                                    <span className="font-bold">{selectedAgent.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Tickets to Settle:</span>
                                    <span className="font-bold">{selectedAgent.pendingCount}</span>
                                </div>
                                <div className="h-px bg-emerald-500/20 my-2" />
                                <div className="flex justify-between text-lg">
                                    <span className="text-emerald-500">Total Cash:</span>
                                    <span className="font-bold font-mono">Rs. {selectedAgent.pendingAmount.toLocaleString()}</span>
                                </div>
                            </div>

                            {settleResult && (
                                <div className="mb-4 p-3 bg-white/5 rounded-lg text-center font-bold">
                                    <p>{settleResult}</p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSelectedAgent(null)}
                                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSettle}
                                    disabled={settling || !!settleResult}
                                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {settling ? 'Processing...' : 'Confirm Receipt'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
