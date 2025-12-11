'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Save, X, Ticket, Wallet, CheckCircle } from 'lucide-react';

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    stats?: {
        totalAssigned: number;
        sold: number;
        inHand: number;
        walletBalance: number;
        totalSettled: number;
    };
};

export default function CommitteePage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Create Modal
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createFormData, setCreateFormData] = useState({ name: '', email: '', password: '', role: 'AGENT' });
    const [createStatus, setCreateStatus] = useState('');

    // Detail/Edit Modal
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [editFormData, setEditFormData] = useState({ name: '', email: '', role: '', password: '' });
    const [editStatus, setEditStatus] = useState('');

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

    const handleOpenDetail = async (user: User) => {
        setSelectedUser(user);
        setDetailLoading(true);
        setEditStatus('');
        // Initialize form with basic data first
        setEditFormData({ name: user.name, email: user.email, role: user.role, password: '' });

        try {
            const res = await fetch(`/api/admin/users/${user.id}`);
            const data = await res.json();
            if (data.success) {
                setSelectedUser(data.user); // Update with full stats
                setEditFormData(prev => ({ ...prev, name: data.user.name, email: data.user.email, role: data.user.role }));
            }
        } catch (e) {
            console.error("Failed to fetch details");
        } finally {
            setDetailLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateStatus('Creating...');

        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createFormData)
            });
            const data = await res.json();

            if (data.success) {
                setCreateStatus('Success!');
                setTimeout(() => {
                    setShowCreateModal(false);
                    setCreateFormData({ name: '', email: '', password: '', role: 'AGENT' });
                    setCreateStatus('');
                    fetchUsers();
                }, 1000);
            } else {
                setCreateStatus('Error: ' + data.message);
            }
        } catch (err) {
            setCreateStatus('Network Error');
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        setEditStatus('Updating...');

        try {
            const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editFormData)
            });
            const data = await res.json();

            if (data.success) {
                setEditStatus('Updated Successfully!');
                // Refresh list
                fetchUsers();
                // Close after brief delay
                setTimeout(() => {
                    setEditStatus('');
                }, 2000);
            } else {
                setEditStatus('Error: ' + data.message);
            }
        } catch (e) {
            setEditStatus('Network Error');
        }
    };

    return (
        <div>
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Committee Management</h1>
                    <p className="text-gray-400">Manage Members, View Sales, and Reset Passwords</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                >
                    + Add Member
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="text-zinc-500">Loading Members...</p>
                ) : users.map(user => (
                    <div key={user.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:bg-zinc-800/50 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-full flex items-center justify-center font-bold text-lg text-white">
                                {user.name.charAt(0)}
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'SUPER_ADMIN' ? 'bg-indigo-900 text-indigo-300' : 'bg-gray-800 text-gray-400'
                                }`}>
                                {user.role === 'AGENT' ? 'COMMITTEE MEMBER' : user.role}
                            </span>
                        </div>

                        <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{user.name}</h3>
                        <p className="text-zinc-500 text-sm mb-6">{user.email}</p>

                        <div className="pt-4 border-t border-zinc-800">
                            <button
                                onClick={() => handleOpenDetail(user)}
                                className="w-full bg-zinc-950 hover:bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-white px-4 py-2 rounded-lg transition-all font-medium flex items-center justify-center gap-2"
                            >
                                View Details & Manage
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-zinc-900 border border-zinc-700 p-8 rounded-2xl w-full max-w-md shadow-2xl relative"
                        >
                            <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X size={20} /></button>
                            <h2 className="text-2xl font-bold mb-6 text-white">Add New Member</h2>

                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Name</label>
                                    <input className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white" value={createFormData.name} onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })} required placeholder="Shehan" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Email</label>
                                    <input type="email" className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white" value={createFormData.email} onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })} required placeholder="shehan@tantalize.lk" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Password</label>
                                    <input className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white" value={createFormData.password} onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })} required placeholder="Secret123" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Role</label>
                                    <select className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white" value={createFormData.role} onChange={(e) => setCreateFormData({ ...createFormData, role: e.target.value })}>
                                        <option value="AGENT">Committee Member</option>
                                        <option value="SUPER_ADMIN">Super Admin</option>
                                        <option value="GATEKEEPER">Gatekeeper</option>
                                    </select>
                                </div>

                                {createStatus && <p className={`text-center text-sm font-bold ${createStatus.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>{createStatus}</p>}

                                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-xl font-bold text-white shadow-lg mt-4">Create User</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Detail / Edit Modal */}
            <AnimatePresence>
                {selectedUser && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900 z-10">
                                <div>
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-sm">
                                            {selectedUser.name.charAt(0)}
                                        </div>
                                        {selectedUser.name}
                                    </h2>
                                    <p className="text-zinc-500 text-sm ml-14">{selectedUser.email}</p>
                                </div>
                                <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white"><X size={24} /></button>
                            </div>

                            {/* Modal Content - Scrollable */}
                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                {detailLoading ? (
                                    <div className="flex flex-col items-center justify-center py-10 gap-4">
                                        <RefreshCw className="animate-spin text-indigo-500" size={32} />
                                        <p className="text-zinc-500">Loading Stats...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-center">
                                                <p className="text-zinc-500 text-xs uppercase font-bold mb-1">Assigned</p>
                                                <p className="text-2xl font-bold text-white">{selectedUser.stats?.totalAssigned || 0}</p>
                                            </div>
                                            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-center">
                                                <p className="text-zinc-500 text-xs uppercase font-bold mb-1">Sold</p>
                                                <p className="text-2xl font-bold text-green-400">{selectedUser.stats?.sold || 0}</p>
                                            </div>
                                            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-center">
                                                <p className="text-zinc-500 text-xs uppercase font-bold mb-1">In Stock</p>
                                                <p className="text-2xl font-bold text-yellow-400">{selectedUser.stats?.inHand || 0}</p>
                                            </div>
                                            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-center relative overflow-hidden">
                                                <div className="absolute inset-0 bg-indigo-500/10" />
                                                <p className="text-indigo-400 text-xs uppercase font-bold mb-1">Wallet Due</p>
                                                <p className="text-2xl font-bold text-indigo-300">
                                                    {selectedUser.stats?.walletBalance?.toLocaleString() || 0}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Edit Form */}
                                        <div className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800">
                                            <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
                                                <Save size={18} className="text-gray-400" />
                                                Edit Profile & Reset Password
                                            </h3>

                                            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Full Name</label>
                                                    <input className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white" value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Email</label>
                                                    <input className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white" value={editFormData.email} onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Role</label>
                                                    <select className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white" value={editFormData.role} onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}>
                                                        <option value="AGENT">Committee Member</option>
                                                        <option value="SUPER_ADMIN">Super Admin</option>
                                                        <option value="GATEKEEPER">Gatekeeper</option>
                                                    </select>
                                                </div>
                                                <div className="md:col-span-2 bg-red-900/10 border border-red-900/30 p-4 rounded-xl mt-2">
                                                    <label className="block text-xs font-bold text-red-400 uppercase mb-1">Reset Password (Override)</label>
                                                    <input
                                                        className="w-full bg-black border border-red-900/50 rounded-lg p-3 text-white placeholder-red-900/50 focus:border-red-500 outline-none transition-colors"
                                                        value={editFormData.password}
                                                        onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                                                        placeholder="Enter new password to reset..."
                                                    />
                                                    <p className="text-[10px] text-zinc-500 mt-2">Leave empty to keep current password.</p>
                                                </div>

                                                <div className="md:col-span-2 mt-4">
                                                    {editStatus && <p className={`text-center text-sm font-bold mb-3 ${editStatus.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>{editStatus}</p>}
                                                    <button type="submit" className="w-full bg-white text-black hover:bg-gray-200 py-3 rounded-xl font-bold shadow-lg transition-colors">
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
