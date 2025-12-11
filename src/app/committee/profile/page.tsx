'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, Lock, User, Save } from 'lucide-react';

export default function CommitteeProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Password Form State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/committee/login');
        } catch (e) {
            console.error('Logout failed', e);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            const data = await res.json();

            if (data.success) {
                setMessage('Password updated successfully!');
                setCurrentPassword('');
                setNewPassword('');
            } else {
                setError(data.message || 'Failed to update password');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 pb-24">
            <h1 className="text-2xl font-bold mb-6 text-primary">Profile</h1>

            {/* User Info Card */}
            <div className="bg-zinc-900 rounded-xl p-6 mb-6 flex items-center gap-4 border border-zinc-800">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold">
                    👤
                </div>
                <div>
                    <h2 className="text-xl font-bold">Committee Member</h2>
                    <p className="text-zinc-400 text-sm">Authorized Agent</p>
                </div>
            </div>

            {/* Change Password Section */}
            <div className="bg-zinc-900 rounded-xl p-6 mb-6 border border-zinc-800">
                <div className="flex items-center gap-2 mb-4 text-indigo-400">
                    <Lock size={20} />
                    <h3 className="font-bold">Change Password</h3>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase text-zinc-500 mb-1">Current Password</label>
                        <input
                            type="password"
                            className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none"
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase text-zinc-500 mb-1">New Password</label>
                        <input
                            type="password"
                            className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    {message && <p className="text-green-400 text-sm">{message}</p>}
                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : <><Save size={18} /> Update Password</>}
                    </button>
                </form>
            </div>

            {/* Sign Out Button */}
            <button
                onClick={handleLogout}
                className="w-full bg-red-900/20 text-red-400 border border-red-900/50 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-900/40 transition-all"
            >
                <LogOut size={20} />
                Sign Out
            </button>
        </div>
    );
}
