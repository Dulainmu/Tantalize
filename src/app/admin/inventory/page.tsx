'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
type Ticket = {
    id: string;
    serialNumber: string;
    code: string;
    status: 'IN_STOCK' | 'ASSIGNED' | 'SOLD' | 'SCANNED' | 'BANNED';
    assignedTo?: { name: string };
    customerName?: string;
};

type User = {
    id: string;
    name: string;
    email: string;
};

export default function InventoryPage() {
    // State
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Filters
    const [filterStatus, setFilterStatus] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Assign Mode
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [assignStart, setAssignStart] = useState('');
    const [assignEnd, setAssignEnd] = useState('');
    const [selectedAgent, setSelectedAgent] = useState('');
    const [assignStatus, setAssignStatus] = useState('');

    useEffect(() => {
        fetchUsers();
        fetchTickets();
    }, [page, filterStatus]);

    const fetchUsers = async () => {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        if (data.success) setUsers(data.users);
    };

    const fetchTickets = async () => {
        setLoading(true);
        const params = new URLSearchParams({
            page: page.toString(),
            status: filterStatus,
            search: searchQuery
        });

        const res = await fetch(`/api/admin/inventory?${params}`);
        const data = await res.json();

        if (data.success) {
            setTickets(data.tickets);
            setTotalPages(data.pages);
        }
        setLoading(false);
    };

    const handleAssign = async (e: React.FormEvent) => {
        e.preventDefault();
        setAssignStatus('Assigning...');

        try {
            const res = await fetch('/api/admin/inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startSerial: assignStart,
                    endSerial: assignEnd,
                    agentId: selectedAgent
                })
            });
            const data = await res.json();
            if (data.success) {
                setAssignStatus(`Success! ${data.count} tickets assigned.`);
                setTimeout(() => {
                    setShowAssignModal(false);
                    setAssignStatus('');
                    fetchTickets(); // Refresh
                }, 1500);
            } else {
                setAssignStatus('Error: ' + data.message);
            }
        } catch (err) {
            setAssignStatus('Network Error');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Master Inventory</h1>
                    <p className="text-zinc-500">Manage {1500} Total Tickets</p>
                </div>
                <button
                    onClick={() => setShowAssignModal(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                >
                    📦 Batch Assign
                </button>
            </header>

            {/* Filters */}
            <div className="flex gap-4 mb-6 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                <input
                    type="text"
                    placeholder="Search Serial, Code..."
                    className="bg-black border border-zinc-700 rounded-lg px-4 py-2 w-64 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchTickets()}
                />
                <select
                    className="bg-black border border-zinc-700 rounded-lg px-4 py-2 outline-none"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    <option value="IN_STOCK">In Stock (Unassigned)</option>
                    <option value="ASSIGNED">Assigned (With Agent)</option>
                    <option value="SOLD">Sold</option>
                    <option value="SCANNED">Scanned (Used)</option>
                </select>
                <button onClick={fetchTickets} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg">
                    Refresh
                </button>
            </div>

            {/* Table */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-zinc-950 text-zinc-400 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Serial</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Assigned To</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">ID Code</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-zinc-500">Loading Inventory...</td></tr>
                        ) : tickets.map((t) => (
                            <tr key={t.id} className="hover:bg-zinc-800/50 transition-colors">
                                <td className="px-6 py-4 font-mono text-blue-400 font-bold">#{t.serialNumber}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${t.status === 'IN_STOCK' ? 'bg-zinc-700 text-zinc-300' :
                                            t.status === 'ASSIGNED' ? 'bg-purple-900 text-purple-200' :
                                                t.status === 'SOLD' ? 'bg-green-900 text-green-200' :
                                                    t.status === 'SCANNED' ? 'bg-blue-900 text-blue-200' :
                                                        'bg-red-900 text-red-200'
                                        }`}>
                                        {t.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-zinc-300">{t.assignedTo?.name || '-'}</td>
                                <td className="px-6 py-4 text-zinc-400">{t.customerName || '-'}</td>
                                <td className="px-6 py-4 font-mono text-xs opacity-50">{t.code}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex justify-between items-center text-sm text-zinc-500">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="hover:text-white disabled:opacity-50">Previous</button>
                    <span>Page {page} of {totalPages}</span>
                    <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="hover:text-white disabled:opacity-50">Next</button>
                </div>
            </div>

            {/* Assign Modal */}
            <AnimatePresence>
                {showAssignModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-zinc-900 border border-zinc-700 p-8 rounded-2xl w-full max-w-md shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold mb-6">Batch Assign Tickets</h2>

                            <form onSubmit={handleAssign} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Start Serial</label>
                                        <input
                                            placeholder="0001"
                                            className="w-full bg-black border border-zinc-700 rounded-lg p-3 font-mono"
                                            value={assignStart}
                                            onChange={(e) => setAssignStart(e.target.value)}
                                            maxLength={4}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">End Serial</label>
                                        <input
                                            placeholder="0050"
                                            className="w-full bg-black border border-zinc-700 rounded-lg p-3 font-mono"
                                            value={assignEnd}
                                            onChange={(e) => setAssignEnd(e.target.value)}
                                            maxLength={4}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Assign To Agent</label>
                                    <select
                                        className="w-full bg-black border border-zinc-700 rounded-lg p-3"
                                        value={selectedAgent}
                                        onChange={(e) => setSelectedAgent(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Agent...</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                        ))}
                                    </select>
                                </div>

                                {assignStatus && (
                                    <p className={`text-center text-sm font-bold ${assignStatus.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                                        {assignStatus}
                                    </p>
                                )}

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowAssignModal(false)}
                                        className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-xl font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold text-white shadow-lg"
                                    >
                                        Assign Tickets
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
