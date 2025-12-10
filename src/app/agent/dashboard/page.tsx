'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
type Ticket = {
    id: string;
    serialNumber: string;
    code: string;
    status: 'IN_STOCK' | 'ASSIGNED' | 'SOLD' | 'SCANNED';
    customerName?: string;
    paymentSettled: boolean;
};

type Stats = {
    total: number;
    sold: number;
    settled: number;
    cashInHand: number;
    ticketPrice: number;
};

export default function AgentDashboard() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'SOLD' | 'UNSOLD'>('ALL');

    // Sell Modal
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [sellStatus, setSellStatus] = useState('');

    useEffect(() => {
        fetchWallet();
    }, []);

    const fetchWallet = async () => {
        setLoading(true);
        const res = await fetch('/api/agent/wallet');
        const data = await res.json();

        if (data.success) {
            setTickets(data.tickets);
            setStats(data.stats);
        }
        setLoading(false);
    };

    const handleSell = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTicket) return;

        setSellStatus('Processing...');

        try {
            const res = await fetch('/api/agent/sell', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ticketId: selectedTicket.id,
                    customerName,
                    customerPhone
                })
            });
            const data = await res.json();

            if (data.success) {
                setSellStatus('Success! Ticket Sold.');
                setTimeout(() => {
                    setSelectedTicket(null);
                    setCustomerName('');
                    setCustomerPhone('');
                    setSellStatus('');
                    fetchWallet(); // Refresh
                }, 1500);
            } else {
                setSellStatus('Error: ' + data.message);
            }
        } catch (err) {
            setSellStatus('Network Error');
        }
    };

    const filteredTickets = tickets.filter(t => {
        if (filter === 'SOLD') return t.status === 'SOLD' || t.status === 'SCANNED';
        if (filter === 'UNSOLD') return t.status === 'ASSIGNED';
        return true;
    });

    return (
        <div className="pb-24">
            <h1 className="text-2xl font-bold mb-4">My Wallet</h1>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                        <p className="text-zinc-500 text-xs font-bold uppercase">Cash in Hand</p>
                        <p className="text-xl font-bold text-green-400">Rs. {stats.cashInHand.toLocaleString()}</p>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                        <p className="text-zinc-500 text-xs font-bold uppercase">Tickets Sold</p>
                        <p className="text-xl font-bold text-white">{stats.sold} <span className="text-zinc-500 text-sm">/ {stats.total}</span></p>
                    </div>
                </div>
            )}

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {['ALL', 'UNSOLD', 'SOLD'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${filter === f
                                ? 'bg-indigo-600 text-white'
                                : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                            }`}
                    >
                        {f === 'ALL' ? 'All Tickets' : f === 'UNSOLD' ? 'To Sell' : 'Sold History'}
                    </button>
                ))}
            </div>

            {/* Ticket List */}
            <div className="space-y-3">
                {loading ? (
                    <p className="text-center text-zinc-500 py-8">Loading Wallet...</p>
                ) : filteredTickets.length === 0 ? (
                    <p className="text-center text-zinc-500 py-8">No tickets found.</p>
                ) : filteredTickets.map(ticket => (
                    <div
                        key={ticket.id}
                        className={`p-4 rounded-xl border flex justify-between items-center ${ticket.status === 'ASSIGNED'
                                ? 'bg-zinc-900 border-zinc-800'
                                : 'bg-green-900/10 border-green-900/30'
                            }`}
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-indigo-400 font-bold">#{ticket.serialNumber}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${ticket.status === 'ASSIGNED' ? 'bg-zinc-800 text-zinc-400' : 'bg-green-500 text-black'
                                    }`}>
                                    {ticket.status}
                                </span>
                            </div>
                            <p className="text-xs text-zinc-500">
                                {ticket.customerName ? `Sold to: ${ticket.customerName}` : 'Available for Sale'}
                            </p>
                        </div>

                        {ticket.status === 'ASSIGNED' && (
                            <button
                                onClick={() => setSelectedTicket(ticket)}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-indigo-600/20"
                            >
                                SELL
                            </button>
                        )}
                        {(ticket.status === 'SOLD' || ticket.status === 'SCANNED') && (
                            <div className="text-right">
                                {ticket.paymentSettled ? (
                                    <span className="text-[10px] bg-blue-900/30 text-blue-400 px-2 py-1 rounded border border-blue-900/50">Settled</span>
                                ) : (
                                    <span className="text-[10px] bg-red-900/30 text-red-400 px-2 py-1 rounded border border-red-900/50">Unsettled</span>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Sell Modal */}
            <AnimatePresence>
                {selectedTicket && (
                    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-bold">Sell Ticket</h2>
                                    <p className="font-mono text-indigo-400">#{selectedTicket.serialNumber}</p>
                                </div>
                                <button onClick={() => setSelectedTicket(null)} className="p-2 bg-zinc-800 rounded-full">✕</button>
                            </div>

                            <form onSubmit={handleSell} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Customer Name</label>
                                    <input
                                        className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        placeholder="Enter name (Optional)"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white"
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value)}
                                        placeholder="077..."
                                    />
                                </div>

                                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 mb-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-zinc-500 text-sm">Amount to Collect</span>
                                        <span className="text-xl font-bold text-green-400">Rs. {stats?.ticketPrice.toLocaleString()}</span>
                                    </div>
                                    <p className="text-xs text-zinc-600 text-center mt-2">Make sure you receive cash before confirming.</p>
                                </div>

                                {sellStatus && (
                                    <p className={`text-center text-sm font-bold ${sellStatus.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                                        {sellStatus}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-600/20"
                                >
                                    Confirm Sale (Rs. {stats?.ticketPrice})
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
