'use client';

import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { motion, AnimatePresence } from 'framer-motion';

export default function BinderPage() {
    const [scannedCode, setScannedCode] = useState<string | null>(null);
    const [manualSerial, setManualSerial] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean, message: string } | null>(null);
    const [pauseScanner, setPauseScanner] = useState(false);

    const handleScan = (code: string) => {
        if (code && !pauseScanner) {
            setScannedCode(code);
            setPauseScanner(true); // Stop scanning once we get a code
            // Optionally auto-focus the serial input here?
        }
    };

    const handleBind = async () => {
        if (!scannedCode || !manualSerial) return;
        setLoading(true);

        try {
            const res = await fetch('/api/admin/bind', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: scannedCode, serial: manualSerial })
            });
            const data = await res.json();

            setResult(data);
            if (data.success) {
                // Reset for next one
                setTimeout(() => {
                    setScannedCode(null);
                    setManualSerial('');
                    setResult(null);
                    setPauseScanner(false);
                }, 1500);
            }
        } catch (err) {
            setResult({ success: false, message: 'Network Error' });
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setScannedCode(null);
        setManualSerial('');
        setResult(null);
        setPauseScanner(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <span>🔗</span> Ticket Binder
            </h1>
            <p className="text-gray-400">Link physical QR stickers to their printed serial numbers.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Scanner */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center">
                    <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden border-2 border-zinc-700">
                        {!pauseScanner ? (
                            <Scanner
                                onScan={(res) => res[0] && handleScan(res[0].rawValue)}
                                components={{ finder: false }}
                            />
                        ) : (
                            <div className="flex bg-zinc-800 h-full items-center justify-center text-green-500 font-mono font-bold text-xl flex-col gap-2">
                                <div className="text-4xl">✅</div>
                                <div>CAPTURED</div>
                            </div>
                        )}

                        {/* Overlay */}
                        {!pauseScanner && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-48 h-48 border-2 border-yellow-500/50 rounded-lg relative">
                                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-yellow-500"></div>
                                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-yellow-500"></div>
                                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-yellow-500"></div>
                                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-yellow-500"></div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Scanned QR Code</p>
                        <p className={`text-xl font-mono font-bold ${scannedCode ? 'text-white' : 'text-zinc-600'}`}>
                            {scannedCode || 'Waiting...'}
                        </p>
                    </div>
                </div>

                {/* Right: Input & Action */}
                <div className="flex flex-col justify-center space-y-6">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                        <label className="block text-sm font-bold text-zinc-400">PHYSICAL SERIAL NUMBER</label>
                        <input
                            type="text"
                            value={manualSerial}
                            onChange={(e) => setManualSerial(e.target.value)}
                            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-4 text-2xl font-mono text-center focus:ring-2 focus:ring-yellow-500 outline-none"
                            placeholder="e.g. 0050"
                            autoFocus
                        />
                        <p className="text-xs text-zinc-500 text-center">Type the number printed on the ticket.</p>
                    </div>

                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`p-4 rounded-xl text-center font-bold ${result.success ? 'bg-green-900/50 text-green-400 border border-green-500/30' : 'bg-red-900/50 text-red-400 border border-red-500/30'}`}
                            >
                                {result.message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={handleBind}
                        disabled={!scannedCode || !manualSerial || loading}
                        className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 disabled:hover:bg-yellow-600 text-black font-bold text-xl rounded-xl shadow-lg transition-all active:scale-95"
                    >
                        {loading ? 'BINDING...' : 'BIND TICKETS 🔗'}
                    </button>

                    {(scannedCode || manualSerial) && (
                        <button onClick={reset} className="text-zinc-500 text-sm hover:text-white underline">
                            Clear / Reset
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
