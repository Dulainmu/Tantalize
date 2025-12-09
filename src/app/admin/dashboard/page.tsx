import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Link from 'next/link';

export default async function AdminDashboard() {
    const session = await getSession();

    if (!session) {
        redirect('/admin/login');
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Top Bar */}
            <div className="border-b border-zinc-800 p-4 flex justify-between items-center bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
                <h1 className="font-bold text-xl tracking-tight">Tantalize <span className="text-purple-500">Brain</span></h1>
                <div className="flex items-center gap-4">
                    <span className="text-zinc-400 text-sm">Welcome, {session.name as string}</span>
                    <div className="px-3 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full border border-purple-500/20 font-mono uppercase">
                        {session.role as string}
                    </div>
                </div>
            </div>

            <div className="p-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                        <h3 className="text-zinc-500 text-sm font-medium mb-1">Total Inventory</h3>
                        <p className="text-4xl font-bold">1,500</p>
                        <div className="mt-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-full" />
                        </div>
                    </div>

                    <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                        <h3 className="text-zinc-500 text-sm font-medium mb-1">Sold / Distributed</h3>
                        <p className="text-4xl font-bold">0</p>
                        <div className="mt-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-0" />
                        </div>
                    </div>

                    <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                        <h3 className="text-zinc-500 text-sm font-medium mb-1">Cash in Hand</h3>
                        <p className="text-4xl font-bold text-green-400">Rs. 0</p>
                    </div>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link href="/admin/inventory" className="group bg-zinc-900 hover:bg-zinc-800 transition-colors p-6 rounded-2xl border border-zinc-800">
                        <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            📦
                        </div>
                        <h3 className="font-bold text-lg mb-2">Master Inventory</h3>
                        <p className="text-zinc-500 text-sm">View all 1500 tickets, assign batches to agents, and check status.</p>
                    </Link>

                    <Link href="/admin/users" className="group bg-zinc-900 hover:bg-zinc-800 transition-colors p-6 rounded-2xl border border-zinc-800">
                        <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            👥
                        </div>
                        <h3 className="font-bold text-lg mb-2">Committee</h3>
                        <p className="text-zinc-500 text-sm">Manage agents, view their wallets, and settle collected cash.</p>
                    </Link>

                    <Link href="/admin/gatekeeper" className="group bg-zinc-900 hover:bg-zinc-800 transition-colors p-6 rounded-2xl border border-zinc-800">
                        <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            👁️
                        </div>
                        <h3 className="font-bold text-lg mb-2">Gatekeeper</h3>
                        <p className="text-zinc-500 text-sm">Launch the scanner app for entry management.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
