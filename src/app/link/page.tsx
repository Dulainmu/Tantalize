
'use client';

import React, { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

export default function CommitteeLinkPage() {
    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');

    // App State
    const [users, setUsers] = useState<any[]>([]);
    const [scannedCode, setScannedCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    // Form State
    const [serialInput, setSerialInput] = useState('');
    const [agentId, setAgentId] = useState('');
    const [currentTicket, setCurrentTicket] = useState<any>(null);

    useEffect(() => {
        if (isAuthenticated) {
            fetchAgents();
        }
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.toLowerCase() === 'ticket' && password.toLowerCase() === 'ticket') {
            setIsAuthenticated(true);
        } else {
            setAuthError('Invalid Credentials');
            // Shake effect could go here
        }
    };

    const fetchAgents = async () => {
        try {
            const res = await fetch('/api/tickets/link');
            const data = await res.json();
            if (data.success) setUsers(data.users);
        } catch (e) {
            console.error("Failed to load agents");
        }
    };

    const handleScan = async (rawValue: string) => {
        if (loading || scannedCode === rawValue) return;
        setLoading(true);
        setScannedCode(rawValue);
        setMessage(null);

        // For this flow, we just assume the Code is valid and let the user Input details.
        // We verify the code exists by trying to 'Get' it or just by Posting. 
        // To show current details (Serial/Agent), we ideally want to fetch it.
        // Let's quick-fetch. Since we don't have a GET /id endpoint in new route, 
        // we can assume the user is establishing the link. 
        // BUT, showing existing data is better. 
        // Let's use the ADMIN lookup endpoint? No, we want separation.
        // I'll update the logic: "Blind" scan -> Fill form -> Submit.
        // Actually, getting feedback is critical. I'll invoke the POST with just 'code' to lookup? 
        // Or adding a Lookup param to GET? 
        
        // Let's try to lookup using the Admin API? No that's secured.
        // I will trust the user input and the feedback from the POST. 
        // Wait, if I scan, I want to see if it's already linked.
        // I'll update the POST to return data if I send *only* code? 
        // No, keep it simple. User scans, types Serial, Selects Agent, Hits Save.
        // If it exists, it overwrites.
        
        setCurrentTicket({ code: rawValue }); // Temporary holder
        setSerialInput(''); // Reset for new entry
        setAgentId('');
        
        if (navigator.vibrate) navigator.vibrate(50);
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!scannedCode) return;
        
        setLoading(true);

        try {
            const res = await fetch('/api/tickets/link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: scannedCode,
                    serialNumber: serialInput,
                    assignedToId: agentId
                })
            });
            const data = await res.json();

            if (data.success) {
                setMessage({ text: 'LINKED SUCCESSFULLY', type: 'success' });
                if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
                setTimeout(reset, 1500);
            } else {
                setMessage({ text: data.message || 'Error', type: 'error' });
                if (navigator.vibrate) navigator.vibrate(200);
            }

        } catch (err) {
            setMessage({ text: 'Network Error', type: 'error' });
        }
        setLoading(false);
    };

    const reset = () => {
        setScannedCode(null);
        setCurrentTicket(null);
        setSerialInput('');
        setAgentId('');
        setMessage(null);
    };

    // --- RENDER ---

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white">
                <div className="w-full max-w-sm">
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-900 mb-4">
                            <Lock className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h1 className="text-2xl font-bold">Committee Access</h1>
                        <p className="text-gray-400 mt-2">Link & Assign Tool</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-600" />
                                <input 
                                    type="text" 
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Enter username"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-600" />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Enter password"
                                />
                            </div>
                        </div>

                        {authError && (
                            <p className="text-red-500 text-sm font-bold text-center">{authError}</p>
                        )}

                        <button 
                            type="submit"
                            className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                        >
                            Access Tool <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh)] bg-black text-white">
            {/* Header */}
            <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center z-10">
                <h1 className="font-bold text-indigo-400">Linker</h1>
                <button onClick={reset} className="text-xs bg-zinc-800 px-3 py-1.5 rounded-lg font-bold">Reset</button>
            </div>

            {/* Content */}
            <div className="flex-1 relative flex flex-col">
                {!scannedCode ? (
                    <div className="flex-1 relative bg-black">
                         <Scanner
                            onScan={(result) => result[0] && handleScan(result[0].rawValue)}
                            components={{ finder: false, audio: false }}
                            styles={{ container: { width: '100%', height: '100%' } }}
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-64 h-64 border-2 border-indigo-500/50 rounded-2xl relative">
                                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-indigo-500 -mt-1 -ml-1 rounded-tl" />
                                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-indigo-500 -mt-1 -mr-1 rounded-tr" />
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-indigo-500 -mb-1 -ml-1 rounded-bl" />
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-indigo-500 -mb-1 -mr-1 rounded-br" />
                            </div>
                        </div>
                        <p className="absolute bottom-12 w-full text-center text-white/50 text-sm font-medium">
                            Scan Ticket ID
                        </p>
                    </div>
                ) : (
                    <div className="flex-1 p-6 flex flex-col overflow-y-auto">
                        <div className="mb-6 text-center">
                            <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Ticket ID</p>
                            <h2 className="text-4xl font-mono font-black text-indigo-400 break-all">{scannedCode}</h2>
                        </div>

                        <form onSubmit={handleSave} className="flex-col flex gap-6">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">
                                    Link Serial Number
                                </label>
                                <input
                                    type="text"
                                    value={serialInput}
                                    onChange={e => setSerialInput(e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-xl font-mono text-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder-zinc-700"
                                    placeholder="0001"
                                    autoFocus
                                    pattern="[0-9]*"
                                    inputMode="numeric"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">
                                    Assign to Comittee Member
                                </label>
                                <select
                                    value={agentId}
                                    onChange={e => setAgentId(e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                                >
                                    <option value="">Select Member...</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`mt-4 w-full font-bold py-5 rounded-xl shadow-lg active:scale-95 transition-all text-xl
                                    ${loading ? 'bg-zinc-800 text-zinc-500' : 'bg-white text-black'}
                                `}
                            >
                                {loading ? 'SAVING...' : 'CONFIRM LINK'}
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {/* Notification Toast */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className={`fixed bottom-0 left-0 right-0 p-6 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50 flex items-center justify-center gap-3
                            ${message.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}
                        `}
                    >
                        {message.type === 'success' ? <CheckCircle className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                        <span className="text-xl font-black uppercase">{message.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
