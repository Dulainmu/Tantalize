
'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Ticket, ArrowLeftRight, History, User } from 'lucide-react';

export default function CommitteeLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path ? 'text-primary' : 'text-gray-400';

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            {/* Top Bar (Optional, maybe just Branding) */}
            <header className="p-4 flex justify-between items-center bg-gray-900/50 backdrop-blur sticky top-0 z-50">
                <span className="font-bold text-lg tracking-widest text-primary">TANTALIZE</span>
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                    <User size={16} />
                </div>
            </header>

            <main className="p-4">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex justify-around p-3 z-50 pb-safe">
                <Link href="/committee/dashboard" className={`flex flex-col items-center gap-1 ${isActive('/committee/dashboard')}`}>
                    <Home size={24} />
                    <span className="text-[10px]">Wallet</span>
                </Link>
                <Link href="/committee/inventory" className={`flex flex-col items-center gap-1 ${isActive('/committee/inventory')}`}>
                    <Ticket size={24} />
                    <span className="text-[10px]">Sell</span>
                </Link>
                <Link href="/committee/transfer" className={`flex flex-col items-center gap-1 ${isActive('/committee/transfer')}`}>
                    <ArrowLeftRight size={24} />
                    <span className="text-[10px]">Swap</span>
                </Link>
                <Link href="/committee/settlements" className={`flex flex-col items-center gap-1 ${isActive('/committee/settlements')}`}>
                    <History size={24} />
                    <span className="text-[10px]">History</span>
                </Link>
            </nav>
        </div>
    );
}
