'use client';

import React, { useState, useEffect } from 'react';

export default function SettleModal({ agent, onClose, onSuccess }: any) {
    const [tickets, setTickets] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Fetch Unsettled Tickets for this Agent
    useEffect(() => {
        // We need a quick API to fetch specific ticket IDs.
        // For now, let's assume we can fetch data. 
        // We'll create a transient API approach or use the inventory query.
        // Or simpler: Just render the IDs if we had them.

        // Let's call /api/admin/inventory?agentId=XYZ&status=SOLD&settled=false
        // But we don't have that tailored endpoint yet.
        // Let's mock fetching or assume a new server action?
        // Actually, let's create a quick API fetch inside existing route or new one.
        // For speed, let's Assume the LIABILITY list sends tickets? No too heavy.
        // Let's fetch from a new endpoint: /api/finance/agent-debt/[id]

        fetch(`/api/admin/inventory?agentId=${agent.id}&status=SOLD&paymentSettled=false`)
            .then(res => res.json())
            .then(data => {
                if (data.tickets) {
                    setTickets(data.tickets);
                    // Auto-select all by default
                    const allIds = new Set(data.tickets.map((t: any) => t.id));
                    setSelectedIds(allIds as any);
                }
                setLoading(false);
            });
    }, [agent.id]);

    const toggleId = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const totalSelected = selectedIds.size * 1500;

    const handleSettle = async () => {
        if (selectedIds.size === 0) return;
        setSubmitting(true);
        try {
            const res = await fetch('/api/finance/settle', {
                method: 'POST',
                body: JSON.stringify({
                    agentId: agent.id,
                    amount: totalSelected,
                    ticketIds: Array.from(selectedIds)
                })
            });
            const data = await res.json();
            if (data.success) {
                onSuccess();
            } else {
                alert(data.message);
            }
        } catch (e) {
            alert('Error settling');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-[#1a1232] border border-white/20 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-white">Collect from {agent.name.split(' ')[0]}</h3>
                        <p className="text-sm text-gray-400">Select tickets to settle</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[50vh] overflow-y-auto">
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading Debt...</div>
                    ) : tickets.length === 0 ? (
                        <div className="text-center py-8 text-green-400 font-bold">Nothing to settle!</div>
                    ) : (
                        <div className="space-y-2">
                            {tickets.map(t => (
                                <div
                                    key={t.id}
                                    onClick={() => toggleId(t.id)}
                                    className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer transition-all ${selectedIds.has(t.id)
                                            ? 'bg-gold-500/10 border-gold-500/50'
                                            : 'bg-white/5 border-transparent hover:bg-white/10'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedIds.has(t.id) ? 'bg-gold-500 border-gold-500' : 'border-gray-500'
                                            }`}>
                                            {selectedIds.has(t.id) && <span className="text-black text-xs">✓</span>}
                                        </div>
                                        <div>
                                            <p className="font-mono font-bold text-white">{t.serialNumber || 'No Serial'}</p>
                                            <p className="text-xs text-gray-400">{t.code}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-300">Rs. 1500</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-black/20">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-400">Total Selected</span>
                        <span className="text-2xl font-bold text-gold-400">LKR {totalSelected.toLocaleString()}</span>
                    </div>
                    <button
                        onClick={handleSettle}
                        disabled={selectedIds.size === 0 || submitting}
                        className={`w-full py-3 rounded-xl font-bold text-lg ${submitting ? 'bg-gray-600' : 'bg-gold-500 hover:bg-gold-400 text-black'
                            }`}
                    >
                        {submitting ? 'Processing...' : 'CONFIRM & SETTLE'}
                    </button>
                </div>
            </div>
        </div>
    );
}
