'use client';

import { redirect } from 'next/navigation';
// import { getSession } from '@/lib/auth'; // getSession is server-only usually? 
// If getSession uses cookies() it must be server component or API.
// To use hooks, this must be Client.
// We can fetch session via API or just trust the layout to have redirected if no auth (AdminLayout protected).
// For the dashboard content itself, we can skip session prop for now or pass it from layout. 
// But AdminDashboard was server.
// Let's refactor. The "Stats" fetch happens client side in useEffect.
// So this file becomes 'use client'.
// We remove getSession call here (handled by Layout or API).

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {

    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats');
                const data = await res.json();
                if (data.success) {
                    setStats(data.stats);
                }
            } catch (error) {
                console.error("Failed to fetch stats");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div>
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Command Center</h1>
                    <p className="text-gray-400">Live Event Telemetry</p>
                </div>
                {stats && (
                    <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        SYSTEM HEALTH: {stats.health}
                    </div>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                {/* 1. Revenue Card */}
                <div className="bg-gradient-to-br from-[#1a1232]/80 to-[#0f1229] p-6 rounded-2xl border border-white/10 backdrop-blur-xl">
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Total Revenue</h3>
                    <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-amber-500">
                        {loading ? '...' : formatCurrency(stats?.revenue.total || 0)}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs">
                        <span className="text-green-400">Collected: {loading ? '-' : formatCurrency(stats?.revenue.collected)}</span>
                        <span className="text-amber-500">Pending: {stats ? ((stats.revenue.pending / stats.revenue.total) * 100).toFixed(0) : 0}%</span>
                    </div>
                    {stats && (
                        <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden flex">
                            <div className="h-full bg-green-500" style={{ width: `${(stats.revenue.collected / stats.revenue.total) * 100}%` }} />
                            <div className="h-full bg-amber-500" style={{ width: `${(stats.revenue.pending / stats.revenue.total) * 100}%` }} />
                        </div>
                    )}
                </div>

                {/* 2. Ticket Velocity */}
                <div className="bg-gradient-to-br from-[#1a1232]/80 to-[#0f1229] p-6 rounded-2xl border border-white/10 backdrop-blur-xl">
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Sales Velocity</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-white">
                            {loading ? '...' : stats?.velocity}
                        </p>
                        <span className="text-sm text-gray-500">tickets / hr</span>
                    </div>
                    <p className="mt-4 text-xs text-blue-400">
                        {loading ? '...' : `${stats?.sold} sold total`}
                    </p>
                    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: stats ? `${(stats.sold / stats.totalTickets) * 100}%` : '0%' }} />
                    </div>
                </div>

                {/* 3. Live Gate Counter */}
                <div className="bg-gradient-to-br from-[#1a1232]/80 to-[#0f1229] p-6 rounded-2xl border border-white/10 backdrop-blur-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <span className="text-6xl">🚪</span>
                    </div>
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Gate Count</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-white">
                            {loading ? '...' : stats?.gate.entered}
                        </p>
                        <span className="text-sm text-gray-500">/ {loading ? '...' : stats?.gate.total}</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <Link href="/admin/gatekeeper" className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors">
                            Launch Scanner →
                        </Link>
                    </div>
                </div>

                {/* 4. Active Agents */}
                <div className="bg-gradient-to-br from-[#1a1232]/80 to-[#0f1229] p-6 rounded-2xl border border-white/10 backdrop-blur-xl">
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Sales Force</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-white">
                            {loading ? '...' : stats?.agents}
                        </p>
                        <span className="text-sm text-gray-500">Active Agents</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <Link href="/admin/users" className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors">
                            Manage Team →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Feature Grid - Reorganized */}
            <h2 className="text-xl font-bold mb-4 text-gray-300">Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/admin/inventory" className="group bg-gradient-to-br from-[#1a1232]/60 to-[#0f1229]/80 hover:from-[#1a1232] hover:to-[#0f1229] transition-all p-6 rounded-2xl border border-white/10 hover:border-gold-500/30">
                    <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        📦
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-white">Master Inventory</h3>
                    <p className="text-gray-500 text-sm">Assign batches, ban tickets, view full database.</p>
                </Link>

                <Link href="/admin/users" className="group bg-gradient-to-br from-[#1a1232]/60 to-[#0f1229]/80 hover:from-[#1a1232] hover:to-[#0f1229] transition-all p-6 rounded-2xl border border-white/10 hover:border-gold-500/30">
                    <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        👥
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-white">HR & Agents</h3>
                    <p className="text-gray-500 text-sm">Manage committee members and view sales performance.</p>
                </Link>

                <Link href="/treasurer/dashboard" className="group bg-gradient-to-br from-[#1a1232]/60 to-[#0f1229]/80 hover:from-[#1a1232] hover:to-[#0f1229] transition-all p-6 rounded-2xl border border-white/10 hover:border-gold-500/30">
                    <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        💰
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-white">Finance & Settlement</h3>
                    <p className="text-gray-500 text-sm">Debt tracker, cash settlement, and financial audit.</p>
                </Link>

                <Link href="/admin/binder" className="group bg-gradient-to-br from-[#1a1232]/60 to-[#0f1229]/80 hover:from-[#1a1232] hover:to-[#0f1229] transition-all p-6 rounded-2xl border border-white/10 hover:border-gold-500/30">
                    <div className="w-12 h-12 bg-orange-500/20 text-orange-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        🔗
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-white">Ticket Binder</h3>
                    <p className="text-gray-500 text-sm">Fix mismatches by linking QRs to physical serial numbers.</p>
                </Link>

                <Link href="/admin/gatekeeper" className="group bg-gradient-to-br from-[#1a1232]/60 to-[#0f1229]/80 hover:from-[#1a1232] hover:to-[#0f1229] transition-all p-6 rounded-2xl border border-white/10 hover:border-gold-500/30">
                    <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        🚪
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-white">Gate & Access</h3>
                    <p className="text-gray-500 text-sm">Launch Scanner, View Live Entry Feed.</p>
                </Link>

                <Link href="/admin/audit" className="group bg-gradient-to-br from-[#1a1232]/60 to-[#0f1229]/80 hover:from-[#1a1232] hover:to-[#0f1229] transition-all p-6 rounded-2xl border border-white/10 hover:border-gold-500/30">
                    <div className="w-12 h-12 bg-gray-500/20 text-gray-300 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        🛡️
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-white">Audit Logs</h3>
                    <p className="text-gray-500 text-sm">Security trace of all system actions.</p>
                </Link>
            </div>
        </div>
    );
}

