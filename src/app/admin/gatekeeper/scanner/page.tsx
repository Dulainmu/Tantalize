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

    const handleMasterAuth = async (data: string) => {
        try {
            const res = await fetch('/api/gatekeeper/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: data })
            });
            const json = await res.json();
            if (json.success) {
                setGateType(json.type);
                setAuthorized(true);
            }
        } catch (e) {
            console.error("Auth Fail");
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

    // Manual Input State
    const [showManualInput, setShowManualInput] = useState(false);
    const [manualCode, setManualCode] = useState('');

    const handleManualSubmit = async () => {
        if (!manualCode) return;
        setShowManualInput(false);
        await handleScan(manualCode);
        setManualCode('');
    };

    // Login Screen
    if (!authorized) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] bg-black text-white p-4">
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

            </div>
        );
    }

    // Main UI
    return (
        <div className="flex flex-col items-center min-h-[calc(100vh-64px)] overflow-hidden relative max-w-md mx-auto">

            {/* Header / Connection Status */}
            <div className="flex w-full items-center justify-between mb-4">
                <h2 className="font-bold text-xl">{gateType} GATE</h2>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-gray-500 uppercase">Live</span>
                </div>
            </div>

            <div className="w-full flex-1 flex flex-col gap-4 relative z-0">

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
                <div className="aspect-[4/5] bg-gray-900 rounded-3xl overflow-hidden border-4 border-gray-800 relative shadow-2xl flex-shrink-0">
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
                                <div className={`w-64 h-64 border-2 rounded-2xl ${scanMode === 'ENTRY' ? 'border-green-500/50' : 'border-blue-500/50'} relative`}>
                                    <div className="absolute inset-0 border-2 border-white/20 rounded-2xl scale-110" />
                                    <motion.div
                                        className={`absolute left-0 right-0 h-0.5 ${scanMode === 'ENTRY' ? 'bg-green-400' : 'bg-blue-400'} shadow-[0_0_20px_currentColor]`}
                                        animate={{ top: ['10%', '90%', '10%'] }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                                    />
                                </div>
                            </div>

                            {/* Manual Input Trigger */}
                            <div className="absolute bottom-6 right-6 z-30">
                                <button
                                    onClick={() => setShowManualInput(true)}
                                    className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-white/20 active:scale-95 transition-all"
                                >
                                    ⌨️
                                </button>
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
                                className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 transition-colors duration-300
                                    ${(lastResult.status === 'GRANTED' || (scanMode === 'VERIFY' && lastResult.status === 'VALID')) ? 'bg-emerald-600' : ''}
                                    ${lastResult.status === 'WARNING' ? 'bg-amber-500 text-black' : ''}
                                    ${(lastResult.status === 'USED' || lastResult.status === 'INVALID') ? 'bg-red-600' : ''}
                                `}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 backdrop-blur-md shadow-lg ${lastResult.status === 'WARNING' ? 'bg-black/20 text-black' : 'bg-white/20 text-white'}`}
                                >
                                    <span className="text-4xl font-bold">
                                        {lastResult.status === 'GRANTED' || lastResult.status === 'VALID' ? '✓' : ''}
                                        {lastResult.status === 'WARNING' ? '!' : ''}
                                        {lastResult.status === 'USED' || lastResult.status === 'INVALID' ? '✕' : ''}
                                    </span>
                                </motion.div>

                                <h2 className={`text-3xl font-black uppercase tracking-tight mb-2 ${lastResult.status === 'WARNING' ? 'text-black' : 'text-white'}`}>
                                    {lastResult.status === 'GRANTED' ? 'ACCESS GRANTED' : ''}
                                    {lastResult.status === 'WARNING' ? 'UNPAID' : ''}
                                    {lastResult.status === 'USED' ? 'USED' : ''}
                                    {lastResult.status === 'INVALID' ? 'INVALID' : ''}
                                    {lastResult.status === 'VALID' ? 'VALID' : ''}
                                </h2>
                                <p className={`font-medium mb-8 text-sm px-4 leading-relaxed ${lastResult.status === 'WARNING' ? 'text-black/80' : 'text-white/80'}`}>
                                    {lastResult.message}
                                </p>

                                <button
                                    onClick={resetScan}
                                    className={`w-full py-4 rounded-xl font-bold text-lg tracking-widest hover:scale-105 active:scale-95 transition-transform shadow-xl
                                        ${lastResult.status === 'WARNING' ? 'bg-black text-white' : 'bg-white text-black'}
                                    `}
                                >
                                    SCAN NEXT
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Manual Input Modal */}
            <AnimatePresence>
                {showManualInput && (
                    <motion.div
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '100%' }}
                        className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col p-6"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-white">Manual Entry</h2>
                            <button onClick={() => setShowManualInput(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
                        </div>

                        <div className="flex-1 flex flex-col justify-center space-y-6">
                            <input
                                type="text"
                                value={manualCode}
                                onChange={(e) => setManualCode(e.target.value)}
                                placeholder="Enter Code or Serial..."
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-center text-2xl text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                autoFocus
                            />
                            <p className="text-center text-gray-500 text-sm">Type the ticket code (e.g. 1A2B3C) or Serial (e.g. 0050)</p>

                            <button
                                onClick={handleManualSubmit}
                                disabled={!manualCode}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg text-lg"
                            >
                                VERIFY
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
