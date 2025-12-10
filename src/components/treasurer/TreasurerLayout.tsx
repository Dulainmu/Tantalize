'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

type TreasurerLayoutProps = {
    children: ReactNode;
    userName?: string;
    userRole?: string;
};

const navItems = [
    { href: '/treasurer/dashboard', label: 'Treasury', icon: '💰' },
    // { href: '/treasurer/reports', label: 'Reports', icon: '📊' }, // Future
];

export default function TreasurerLayout({ children, userName = 'Treasurer', userRole = 'TREASURER' }: TreasurerLayoutProps) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-[#051105] text-white flex">
            {/* Sidebar */}
            <aside className="w-64 fixed left-0 top-0 bottom-0 bg-gradient-to-b from-[#0f2e15]/90 to-[#051105] border-r border-emerald-500/20 backdrop-blur-xl z-50 flex flex-col">
                {/* Brand */}
                <div className="p-6 border-b border-emerald-500/20">
                    <Link href="/treasurer/dashboard" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-black font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                            $
                        </div>
                        <div>
                            <h1 className="font-bold text-lg text-emerald-400">Tantalize</h1>
                            <p className="text-xs text-gray-500 uppercase tracking-widest">Finance Dept</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                        ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/10 border border-emerald-500/30 text-emerald-400'
                                        : 'hover:bg-white/5 text-gray-400 hover:text-white'
                                    }`}
                            >
                                <span className={`text-lg ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                                    {item.icon}
                                </span>
                                <span className="font-medium">{item.label}</span>
                                {isActive && (
                                    <motion.div
                                        className="ml-auto w-2 h-2 rounded-full bg-emerald-500"
                                        layoutId="activeIndicator"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-emerald-500/20">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-sm">
                            {userName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{userName}</p>
                            <p className="text-xs text-gray-500 uppercase">{userRole}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64">
                {/* Top Bar */}
                <header className="sticky top-0 z-40 bg-[#051105]/80 backdrop-blur-xl border-b border-emerald-500/20 px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-emerald-500/50 font-mono text-sm">SECURE TERMINAL</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs text-emerald-500 uppercase tracking-wider">Connected</span>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
