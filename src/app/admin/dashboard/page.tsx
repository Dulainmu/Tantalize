import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Link from 'next/link';

export default async function AdminDashboard() {
    const session = await getSession();

    if (!session) {
        redirect('/admin/login');
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back, {session.name as string}</h1>
            <p className="text-gray-400 mb-8">Manage your event from the Command Center.</p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-[#1a1232]/80 to-[#0f1229] p-6 rounded-2xl border border-white/10 backdrop-blur-xl">
                    <h3 className="text-gray-400 text-sm font-medium mb-1">Total Inventory</h3>
                    <p className="text-4xl font-bold text-white">1,500</p>
                    <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 w-full" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#1a1232]/80 to-[#0f1229] p-6 rounded-2xl border border-white/10 backdrop-blur-xl">
                    <h3 className="text-gray-400 text-sm font-medium mb-1">Sold / Distributed</h3>
                    <p className="text-4xl font-bold text-white">0</p>
                    <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500 w-0" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#1a1232]/80 to-[#0f1229] p-6 rounded-2xl border border-white/10 backdrop-blur-xl">
                    <h3 className="text-gray-400 text-sm font-medium mb-1">Cash in Hand</h3>
                    <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-amber-500">Rs. 0</p>
                </div>
            </div>

            {/* Feature Grid */}
            <h2 className="text-xl font-bold mb-4 text-gray-300">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/admin/inventory" className="group bg-gradient-to-br from-[#1a1232]/60 to-[#0f1229]/80 hover:from-[#1a1232] hover:to-[#0f1229] transition-all p-6 rounded-2xl border border-white/10 hover:border-gold-500/30">
                    <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        📦
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-white">Master Inventory</h3>
                    <p className="text-gray-500 text-sm">View all 1500 tickets, assign batches to agents, and check status.</p>
                </Link>

                <Link href="/admin/users" className="group bg-gradient-to-br from-[#1a1232]/60 to-[#0f1229]/80 hover:from-[#1a1232] hover:to-[#0f1229] transition-all p-6 rounded-2xl border border-white/10 hover:border-gold-500/30">
                    <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        👥
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-white">Committee</h3>
                    <p className="text-gray-500 text-sm">Manage agents, view their wallets, and settle collected cash.</p>
                </Link>

                <Link href="/admin/gatekeeper" className="group bg-gradient-to-br from-[#1a1232]/60 to-[#0f1229]/80 hover:from-[#1a1232] hover:to-[#0f1229] transition-all p-6 rounded-2xl border border-white/10 hover:border-gold-500/30">
                    <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        🚪
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-white">Gatekeeper</h3>
                    <p className="text-gray-500 text-sm">Launch the scanner app for entry management.</p>
                </Link>
            </div>
        </div>
    );
}

