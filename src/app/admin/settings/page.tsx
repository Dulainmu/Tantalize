'use client';

import React, { useState, useEffect } from 'react';

export default function SettingsPage() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                if (data.success) setSettings(data.settings);
                setLoading(false);
            });
    }, []);

    const toggleSetting = async (key: string, value: boolean) => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [key]: value })
            });
            const data = await res.json();
            if (data.success) {
                setSettings(data.settings);
            }
        } catch (e) {
            alert('Failed to update');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Settings & Emergency</h1>
            <p className="text-gray-400 mb-8">Global controls for the Tantalize System.</p>

            <div className="grid gap-6">

                {/* System Lockdown */}
                <div className={`p-6 rounded-2xl border transition-all ${settings?.isSystemLockdown ? 'bg-red-900/20 border-red-500' : 'bg-[#1a1232]/50 border-white/10'}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-xl flex items-center gap-2">
                                🚨 System Lockdown
                                {settings?.isSystemLockdown && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">ACTIVE</span>}
                            </h3>
                            <p className="text-gray-400 text-sm mt-1">If enabled, **ALL** scanning, selling, and transfers will be blocked. Use only in extreme emergency.</p>
                        </div>
                        <button
                            onClick={() => toggleSetting('isSystemLockdown', !settings?.isSystemLockdown)}
                            className={`px-6 py-3 rounded-xl font-bold transition-all ${settings?.isSystemLockdown ? 'bg-red-500 hover:bg-red-400 text-white' : 'bg-white/10 hover:bg-white/20 text-gray-300'}`}
                        >
                            {settings?.isSystemLockdown ? 'DISABLE LOCKDOWN' : 'ENABLE LOCKDOWN'}
                        </button>
                    </div>
                </div>

                {/* Voting Control (Placeholder for Phase 6) */}
                <div className="bg-[#1a1232]/50 p-6 rounded-2xl border border-white/10 opacity-70">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-xl">🗳️ Voting Engine</h3>
                            <p className="text-gray-400 text-sm mt-1">Controls for the King & Queen voting system.</p>
                        </div>
                        <div className="flex gap-2">
                            <button disabled className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed">Open Voting</button>
                            <button disabled className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed">Public Results</button>
                        </div>
                    </div>
                    <p className="text-xs text-yellow-500 mt-2">Coming in Phase 5.</p>
                </div>

                {/* Data Export */}
                <div className="bg-[#1a1232]/50 p-6 rounded-2xl border border-white/10">
                    <h3 className="font-bold text-xl mb-4">📦 Data Export</h3>
                    <div className="flex gap-4">
                        <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2">
                            <span>⬇️</span> Download Tickets CSV
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-bold flex items-center gap-2">
                            <span>⬇️</span> Download Audit Logs
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
