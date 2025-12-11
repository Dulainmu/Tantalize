
'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, AlertTriangle } from 'lucide-react';

interface WalletStats {
    stock: number;
    liability: number;
    lastSettlement: { date: string; amount: number; status: string } | null;
    pendingTransfers: number;
}

export default function CommitteeWallet() {
    const [stats, setStats] = useState<WalletStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/agent/wallet')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setStats(data.wallet);
                }
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Wallet...</div>;

    const liabilityColor = (stats?.liability || 0) > 50000 ? 'text-orange-500' : 'text-white';

    return (
        <div className="space-y-6">

            {/* Wallet Cards */}
            <div className="grid grid-cols-2 gap-4">
                {/* Stock Card */}
                <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 flex flex-col justify-between h-32">
                    <span className="text-gray-400 text-sm font-medium">TICKETS LEFT</span>
                    <span className="text-4xl font-bold text-white">{stats?.stock}</span>
                </div>

                {/* Liability Card */}
                <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 flex flex-col justify-between h-32 relative overflow-hidden">
                    <span className="text-gray-400 text-sm font-medium">CASH IN HAND</span>
                    <span className={`text-2xl font-bold ${liabilityColor}`}>
                        Rs. {(stats?.liability || 0).toLocaleString()}
                    </span>
                    {(stats?.liability || 0) > 50000 && (
                        <div className="absolute top-2 right-2 text-orange-500 animate-pulse">
                            <AlertTriangle size={16} />
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <Link href="/committee/inventory" className="block w-full">
                <div className="bg-primary hover:bg-primary/90 transition-all rounded-2xl p-4 flex items-center justify-center gap-2 h-16 shadow-lg shadow-primary/20">
                    <Plus size={24} className="text-white" />
                    <span className="text-white font-bold text-lg">RECORD SALE</span>
                </div>
            </Link>

            {/* Notifications */}
            {stats?.pendingTransfers ? (
                <Link href="/committee/transfer">
                    <div className="bg-blue-900/30 border border-blue-500/50 rounded-xl p-4 flex items-center justify-between">
                        <span className="text-blue-200 text-sm">You have pending ticket transfers</span>
                        <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">{stats.pendingTransfers}</span>
                    </div>
                </Link>
            ) : null}

            {/* Recent Settlement Status */}
            {stats?.lastSettlement && (
                <div className="mt-8">
                    <h3 className="text-gray-500 text-xs uppercase tracking-wider mb-2">Last Settlement</h3>
                    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">Rs. {stats.lastSettlement.amount.toLocaleString()}</span>
                            <span className="text-xs text-gray-400">{new Date(stats.lastSettlement.date).toLocaleDateString()}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded border ${stats.lastSettlement.status === 'CONFIRMED' ? 'border-green-500 text-green-500' : 'border-yellow-500 text-yellow-500'
                            }`}>
                            {stats.lastSettlement.status}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
