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
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 relative overflow-hidden">

            {/* Header / Connection Status */}
            <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
                <span className="text-xs font-bold text-gray-500 tracking-widest">{gateType} GATE</span>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>

            <div className="w-full max-w-sm flex flex-col gap-6 relative z-0">

                {/* Mode Switcher */}
                <div className="flex bg-gray-900/80 p-1 rounded-xl border border-gray-800 backdrop-blur-sm">
                    <button
                        onClick={() => setScanMode('ENTRY')}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${scanMode === 'ENTRY'
                                ? 'bg-gradient-to-tr from-green-600 to-emerald-500 text-white shadow-lg'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        ENTRY MODE
                    </button>
                    <button
                        onClick={() => setScanMode('VERIFY')}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${scanMode === 'VERIFY'
                                ? 'bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        VERIFY ONLY
                    </button>
                </div>

                {/* Scanner Card */}
                <div className="aspect-square bg-gray-900 rounded-3xl overflow-hidden border-4 border-gray-800 relative shadow-2xl">
                    {!lastResult && (
                        <>
                            <Scanner
                                onScan={(result) => result[0] && handleScan(result[0].rawValue)}
                                components={{ finder: false }}
                                styles={{
                                    container: { height: '100%', width: '100%' },
                                    video: { objectFit: 'cover' }
                                }}
                            />

                            {/* Scanning Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className={`w-3/4 h-3/4 border-2 rounded-2xl ${scanMode === 'ENTRY' ? 'border-green-500/30' : 'border-blue-500/30'} relative`}>
                                    <div className="absolute inset-0 border-2 border-white/20 rounded-2xl scale-110" />
                                    <motion.div
                                        className={`absolute left-0 right-0 h-0.5 ${scanMode === 'ENTRY' ? 'bg-green-400' : 'bg-blue-400'} shadow-[0_0_15px_currentColor]`}
                                        animate={{ top: ['10%', '90%', '10%'] }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Result Overlay (In-Card) */}
                    <AnimatePresence>
                        {lastResult && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 ${(lastResult.status === 'GRANTED' || (scanMode === 'VERIFY' && lastResult.status === 'VALID'))
                                        ? 'bg-emerald-600'
                                        : (lastResult.status === 'USED' ? 'bg-red-600' : 'bg-gray-800')
                                    }`}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-md"
                                >
                                    {lastResult.status === 'GRANTED' || lastResult.status === 'VALID' ? '✓' : '✕'}
                                </motion.div>

                                <h2 className="text-3xl font-black uppercase tracking-tight mb-2">
                                    {lastResult.status === 'GRANTED' ? 'ACCESS GRANTED' : lastResult.status}
                                </h2>
                                <p className="text-white/80 font-medium mb-6 text-sm px-4 leading-relaxed">
                                    {lastResult.message}
                                </p>

                                <button
                                    onClick={resetScan}
                                    className="w-full bg-white text-black py-4 rounded-xl font-bold text-sm tracking-widest hover:scale-105 active:scale-95 transition-transform shadow-xl"
                                >
                                    SCAN NEXT
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <p className="text-center text-gray-500 text-xs">
                    Align QR code within the frame
                </p>
            </div>
        </div>
    );
}
