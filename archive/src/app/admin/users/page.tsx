'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    _count?: { assignedTickets: number }; // Future optimization
};

export default function CommitteePage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Create Modal
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'AGENT' });
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        if (data.success) setUsers(data.users);
        setLoading(false);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Creating...');

        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success) {
                setStatus('Success!');
                setTimeout(() => {
                    setShowModal(false);
                    setFormData({ name: '', email: '', password: '', role: 'AGENT' });
                    setStatus('');
                    fetchUsers();
                }, 1000);
            } else {
                setStatus('Error: ' + data.message);
            }
        } catch (err) {
            setStatus('Network Error');
        }
    };

    return (
        <div>
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Committee Management</h1>
                    <p className="text-gray-400">Manage Agents & Finance Settlement</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                >
                    + Add Member
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="text-zinc-500">Loading Members...</p>
                ) : users.map(user => (
                    <div key={user.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:bg-zinc-800/50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-full flex items-center justify-center font-bold text-lg">
                                {user.name.charAt(0)}
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'SUPER_ADMIN' ? 'bg-indigo-900 text-indigo-300' : 'bg-gray-800 text-gray-400'
                                }`}>
                                {user.role}
                            </span>
                        </div>

                        <h3 className="font-bold text-lg">{user.name}</h3>
                        <p className="text-zinc-500 text-sm mb-6">{user.email}</p>

                        <div className="flex justify-between items-center border-t border-zinc-800 pt-4">
                            <div className="text-center">
                                <p className="text-xs text-zinc-500 uppercase font-bold">Wallet</p>
                                {/* We'll hook up real counts later */}
                                <p className="text-xl font-bold text-white">-</p>
                            </div>

                            <button className="text-sm bg-zinc-950 hover:bg-black border border-zinc-700 px-4 py-2 rounded-lg transition-colors">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-zinc-900 border border-zinc-700 p-8 rounded-2xl w-full max-w-md shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold mb-6">Add New Member</h2>

                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Name</label>
                                    <input
                                        className="w-full bg-black border border-zinc-700 rounded-lg p-3"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        placeholder="Shehan"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full bg-black border border-zinc-700 rounded-lg p-3"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        placeholder="shehan@tantalize.lk"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Password</label>
                                    <input
                                        className="w-full bg-black border border-zinc-700 rounded-lg p-3"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        placeholder="Secret123"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Role</label>
                                    <select
                                        className="w-full bg-black border border-zinc-700 rounded-lg p-3"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="AGENT">Agent (Member)</option>
                                        <option value="SUPER_ADMIN">Super Admin</option>
                                        <option value="GATE_GUARD">Gate Guard</option>
                                    </select>
                                </div>

                                {status && (
                                    <p className={`text-center text-sm font-bold ${status.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                                        {status}
                                    </p>
                                )}

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-xl font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-purple-600 hover:bg-purple-500 py-3 rounded-xl font-bold text-white shadow-lg"
                                    >
                                        Create User
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
