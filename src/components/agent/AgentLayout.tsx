'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

type AgentLayoutProps = {
    children: ReactNode;
    userName?: string;
};

export default function AgentLayoutClient({ children, userName = 'Agent' }: AgentLayoutProps) {
    return (
        <div className="min-h-screen bg-black text-white pb-20"> {/* pb-20 for bottom nav */}
            {/* Top Bar */}
            <header className="sticky top-0 z-40 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs uppercase">
                        {userName.charAt(0)}
                    </div>
                    <span className="font-bold text-sm">{userName}</span>
                </div>
                <div className="text-xs font-mono text-zinc-500 uppercase">
                    Agent Portal
                </div>
            </header>

            {/* Content */}
            <main className="p-4">
                {children}
            </main>

            {/* Bottom Nav (Mobile App Style) */}
            <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-xl border-t border-zinc-800 flex justify-around p-3 z-50 safe-area-bottom">
                <Link href="/agent/dashboard" className="flex flex-col items-center gap-1 text-indigo-400">
                    <span className="text-xl">👛</span>
                    <span className="text-[10px] font-bold uppercase">My Wallet</span>
                </Link>
                {/* Future: Profile or Scan if Agents need to verify something */}
                <button className="flex flex-col items-center gap-1 text-zinc-600" onClick={() => alert('Feature coming soon')}>
                    <span className="text-xl">⚙️</span>
                    <span className="text-[10px] font-bold uppercase">Settings</span>
                </button>
            </nav>
        </div>
    );
}
