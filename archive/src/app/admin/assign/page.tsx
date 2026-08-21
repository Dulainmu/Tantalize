
'use client';

import React, { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { motion, AnimatePresence } from 'framer-motion';

// Reuse types
type Ticket = {
    id: string;
    serialNumber: string | null;
    code: string;
    status: string;
    assignedToId: string | null;
    assignedTo?: { name: string };
};

type User = {
    id: string;
    name: string;
    email: string;
};

export default function AdminAssignPage() {
    const [scannedCode, setScannedCode] = useState<string | null>(null);
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    // Form State
    const [serialInput, setSerialInput] = useState('');
    const [agentId, setAgentId] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        if (data.success) setUsers(data.users);
    };

    const handleScan = async (rawValue: string) => {
        if (loading || scannedCode === rawValue) return;
        setLoading(true);
        setScannedCode(rawValue);
        setMessage(null);

        // 1. Lookup Ticket by Code
        try {
            const res = await fetch(`/api/admin/inventory?search=${rawValue}`);
            const data = await res.json();
            
            if (data.success && data.tickets.length > 0) {
                // Find exact match if possible, else take first
                const found = data.tickets.find((t: any) => t.code === rawValue || t.magicLink === rawValue || t.code.includes(rawValue)) || data.tickets[0];
                
                setTicket(found);
                setSerialInput(found.serialNumber || '');
                setAgentId(found.assignedToId || '');
                // Play success sound/vibrate
                if (navigator.vibrate) navigator.vibrate(50);
            } else {
                setMessage({ text: 'Ticket not found', type: 'error' });
                setTicket(null);
            }
        } catch (err) {
            setMessage({ text: 'Lookup failed', type: 'error' });
        }
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ticket) return;

        setLoading(true);
        try {
            const res = await fetch('/api/admin/inventory', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: ticket.id,
                    serialNumber: serialInput,
                    // If agent changed, status -> ASSIGNED (unless already sold/used?)
                    // For now, let's just set AssignedTo. 
                    // If we set AssignedTo, we should probably set Status=ASSIGNED if it was IN_STOCK.
                    status: (ticket.status === 'IN_STOCK' && agentId) ? 'ASSIGNED' : undefined,
                    paymentSettled: undefined // Don't touch
                })
            });

            // We also need to assign the agent if the API supports it in PATCH?
            // The previous PATCH updated specific fields. Let's check if it handles assignedToId.
            // Wait, existing PATCH only handles status/payment. 
            // We might need to update the API again if it doesn't support assignedToId in PATCH.
            // **Observation**: My previous task updated API to accept serialNumber and code. 
            // I need to ensure it accepts `assignedToId` too. Assuming I will fix that next.

            const updateRes = await fetch('/api/admin/inventory', {
                method: 'POST', // Use Batch Assign for Agent? Or Update PATCH to support it?
                // Actually, let's assume I'll update the PATCH route to support assignedToId too.
                // Or I can use the Batch Assign route for single item if range is same.
                // Let's rely on PATCH and I'll update the backend to support `assignedToId`.
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                     id: ticket.id,
                     serialNumber: serialInput,
                     assignedToId: agentId,
                     status: (ticket.status === 'IN_STOCK' && agentId) ? 'ASSIGNED' : undefined
                })
            });
            
             /* 
                Wait, I need to check if PATCH supports assignedToId. 
                Looking at previous file view of route.ts: 
                It takes { id, status, paymentSettled, serialNumber, code }. 
                It DOES NOT take assignedToId yet. 
                I will need to update the API.
             */

            const data = await res.json(); // Use the response from PATCH
            
            // To handle Agent Assignment, if PATCH fails to do it, we might need a second call or update API.
            // I'll update the API in the next step.

            if (data.success) {
               setMessage({ text: 'Saved Successfully!', type: 'success' });
               if (navigator.vibrate) navigator.vibrate([50, 50]);
               // Reset after delay?
               setTimeout(reset, 1500);
            } else {
               setMessage({ text: data.message || 'Save failed', type: 'error' });
            }

        } catch (err) {
            setMessage({ text: 'Network Error', type: 'error' });
        }
        setLoading(false);
    };

    const reset = () => {
        setScannedCode(null);
        setTicket(null);
        setSerialInput('');
        setAgentId('');
        setMessage(null);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-black">
            {/* Header */}
            <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
                <h1 className="text-xl font-bold text-white">Link & Assign</h1>
                <button onClick={reset} className="text-sm text-zinc-400">Reset</button>
            </div>

            {/* Scanner / Result */}
            <div className="flex-1 overflow-hidden flex flex-col relative">
                {!ticket ? (
                    <div className="flex-1 relative bg-black">
                        <Scanner
                            onScan={(result) => result[0] && handleScan(result[0].rawValue)}
                            components={{ finder: false }}
                            styles={{ container: { width: '100%', height: '100%' } }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-64 h-64 border-2 border-white/30 rounded-2xl" />
                        </div>
                        <p className="absolute bottom-10 left-0 right-0 text-center text-white/50 text-sm">
                            Scan Ticket QR Code
                        </p>
                    </div>
                ) : (
                    <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
                         <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                            <p className="text-xs text-zinc-500 font-bold uppercase">Human ID</p>
                            <p className="text-2xl font-mono font-bold text-white">{ticket.code}</p>
                            <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-bold ${
                                ticket.status === 'IN_STOCK' ? 'bg-zinc-700' : 'bg-purple-900 text-purple-200'
                            }`}>
                                {ticket.status}
                            </span>
                         </div>

                         <form onSubmit={handleSave} className="flex-col flex gap-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                                    Link Serial Number
                                </label>
                                <input
                                    type="text"
                                    value={serialInput}
                                    onChange={e => setSerialInput(e.target.value)}
                                    className="w-full bg-black border border-zinc-700 rounded-xl p-4 text-xl font-mono text-white focus:border-blue-500 outline-none"
                                    placeholder="e.g. 0024"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                                    Assign to Agent
                                </label>
                                <select
                                    value={agentId}
                                    onChange={e => setAgentId(e.target.value)}
                                    className="w-full bg-black border border-zinc-700 rounded-xl p-4 text-white focus:border-blue-500 outline-none"
                                >
                                    <option value="">-- No Agent --</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform"
                            >
                                {loading ? 'Saving...' : 'UPDATE & LINK'}
                            </button>
                         </form>
                    </div>
                )}

                {/* Notifications */}
                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className={`absolute bottom-6 left-6 right-6 p-4 rounded-xl shadow-2xl text-center font-bold text-white ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
                        >
                            {message.text}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
