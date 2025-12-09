'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { motion, AnimatePresence } from 'framer-motion';

// Build Trigger: Audio prop verified removed.

export default function GatekeeperPage() {
    const [authorized, setAuthorized] = useState(false);
    const [gateType, setGateType] = useState<'NORMAL' | 'VIP'>('NORMAL');

    // Scan State
    const [scanMode, setScanMode] = useState<'ENTRY' | 'VERIFY'>('ENTRY');
    const [lastResult, setLastResult] = useState<any>(null);
    const [isScanning, setIsScanning] = useState(true);
    const [errorVibration, setErrorVibration] = useState(false);

    // Sound Effects (Ref to hold audio objects if we add them)

    const handleMasterAuth = (data: string) => {
        // Determine if it's a master code
        // Hardcoded for now, but should be checked against server or config
        if (data === 'MASTER_GATE_NORMAL') {
            setGateType('NORMAL');
            setAuthorized(true);
        } else if (data === 'MASTER_GATE_VIP') {
            setGateType('VIP');
            setAuthorized(true);
        }
    };

    const handleScan = async (decodedText: string) => {
        if (!isScanning) return;

        // Prevent double scans
        setIsScanning(false);

        try {
            const response = await fetch('/api/gatekeeper/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: decodedText,
                    mode: scanMode
                })
            });

            const data = await response.json();
            setLastResult(data);

            // Haptic Feedback (if on mobile)
            if (window.navigator && window.navigator.vibrate) {
                if (data.status === 'GRANTED' || (scanMode === 'VERIFY' && data.status === 'VALID')) {
                    window.navigator.vibrate(200); // Success
                } else {
                    window.navigator.vibrate([100, 50, 100]); // Error (Double buzz)
                }
            }

        } catch (err) {
            console.error("Scan Failed", err);
            setLastResult({ success: false, status: 'ERROR', message: 'Network Error' });
        }

        // Auto-resume scanning after delay if success, manual resume if error?
        // User prefers "One-Touch" speed. 
        // We typically show the result, then user taps to close or it auto-closes.
    };

    const resetScan = () => {
        setLastResult(null);
        setIsScanning(true);
    };

    // Login Screen
    if (!authorized) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
                <h1 className="text-3xl font-bold mb-8">GATEKEEPER</h1>
                <div className="w-full max-w-sm aspect-square bg-gray-900 rounded-2xl overflow-hidden border-2 border-gray-700 relative">
                    <Scanner
                        onScan={(result) => result[0] && handleMasterAuth(result[0].rawValue)}
                        components={{}}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-64 h-64 border-2 border-blue-500/50 rounded-xl" />
                    </div>
                </div>
                <p className="mt-8 text-gray-400 text-center">Scan Master QR to Unlock</p>

                {/* Dev Bypass Button */}
                <button onClick={() => { setGateType('NORMAL'); setAuthorized(true); }} className="mt-8 px-4 py-2 border border-gray-800 rounded opacity-30 hover:opacity-100 text-xs">
                    DEV BYPASS
                </button>
            </div>
        );
    }

    // Main UI
    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800">
                <div>
                    <h2 className="font-bold text-lg">{gateType} GATE</h2>
                    <div className="flex gap-2 text-xs">
                        <button
                            onClick={() => setScanMode('ENTRY')}
                            className={`px-2 py-1 rounded ${scanMode === 'ENTRY' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400'}`}
                        >
                            ENTRY MODE
                        </button>
                        <button
                            onClick={() => setScanMode('VERIFY')}
                            className={`px-2 py-1 rounded ${scanMode === 'VERIFY' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}
                        >
                            VERIFY ONLY
                        </button>
                    </div>
                </div>
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" title="Online" />
            </div>

            {/* Camera Area */}
            <div className="flex-1 relative bg-black flex flex-col">
                {!lastResult && (
                    <div className="flex-1 relative overflow-hidden">
                        <Scanner
                            onScan={(result) => result[0] && handleScan(result[0].rawValue)}
                            components={{ finder: false }}
                            styles={{ container: { height: '100%' } }}
                        />

                        {/* Custom Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className={`w-64 h-64 border-4 rounded-3xl ${scanMode === 'ENTRY' ? 'border-green-500/50' : 'border-blue-500/50'} relative`}>
                                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white -mt-1 -ml-1" />
                                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-white -mt-1 -mr-1" />
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-white -mb-1 -ml-1" />
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white -mb-1 -mr-1" />

                                {/* Scanning Line */}
                                <motion.div
                                    className={`absolute left-0 right-0 h-1 ${scanMode === 'ENTRY' ? 'bg-green-500' : 'bg-blue-500'} shadow-[0_0_10px_currentColor]`}
                                    animate={{ top: ['0%', '100%', '0%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Result Overlay */}
                <AnimatePresence>
                    {lastResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            className={`absolute inset-0 flex flex-col items-center justify-center p-8 z-50 ${(lastResult.status === 'GRANTED' || (scanMode === 'VERIFY' && lastResult.status === 'VALID'))
                                ? 'bg-green-600'
                                : (lastResult.status === 'USED' ? 'bg-red-600' : 'bg-gray-800')
                                }`}
                        >
                            <h1 className="text-6xl font-black mb-4 uppercase tracking-tighter">
                                {lastResult.status === 'GRANTED' ? 'WELCOME' : lastResult.status}
                            </h1>
                            <p className="text-2xl font-medium opacity-90 mb-8">{lastResult.message}</p>

                            <div className="bg-black/20 p-4 rounded-xl w-full max-w-xs mb-8">
                                <div className="flex justify-between mb-2">
                                    <span className="opacity-60">ID</span>
                                    <span className="font-mono">{lastResult.ticket?.code || '---'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="opacity-60">Type</span>
                                    <span className="font-mono">{lastResult.ticket?.status || 'UNKNOWN'}</span>
                                </div>
                            </div>

                            <button
                                onClick={resetScan}
                                className="bg-white text-black px-12 py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform"
                            >
                                SCAN NEXT
                            </button>

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
