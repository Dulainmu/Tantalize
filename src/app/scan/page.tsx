
'use client';

import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileScanPage() {
    const [authorized, setAuthorized] = useState(false);
    const [gateType, setGateType] = useState<'NORMAL' | 'VIP'>('NORMAL');

    // Scan State
    const [scanMode, setScanMode] = useState<'ENTRY' | 'VERIFY'>('ENTRY');
    const [lastResult, setLastResult] = useState<any>(null);
    const [isScanning, setIsScanning] = useState(true);

    const handleMasterAuth = (data: string) => {
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

            if (window.navigator && window.navigator.vibrate) {
                if (data.status === 'GRANTED' || (scanMode === 'VERIFY' && data.status === 'VALID')) {
                    window.navigator.vibrate(200); 
                } else {
                    window.navigator.vibrate([100, 50, 100]); 
                }
            }

        } catch (err) {
            console.error("Scan Failed", err);
            setLastResult({ success: false, status: 'ERROR', message: 'Network Error' });
        }
    };

    const resetScan = () => {
        setLastResult(null);
        setIsScanning(true);
    };

    // Login (Master Badge)
    if (!authorized) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-6">
                <div className="w-full max-w-sm aspect-square bg-gray-900 rounded-2xl overflow-hidden border border-gray-700 relative mb-6 relative">
                    <Scanner
                        onScan={(result) => result[0] && handleMasterAuth(result[0].rawValue)}
                        components={{ audio: false }}
                    />
                    <div className="absolute inset-0 border-2 border-blue-500/30 rounded-2xl pointer-events-none" />
                </div>
                <p className="text-gray-400 text-center text-sm">Scan Master QR to Unlock</p>
                <button onClick={() => { setGateType('NORMAL'); setAuthorized(true); }} className="mt-8 px-4 py-2 border border-gray-800 rounded opacity-20 hover:opacity-100 text-xs text-gray-600">
                    DEV BYPASS
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center min-h-[calc(100vh-4rem)] p-4 gap-4">
            
            {/* Status Bar */}
            <div className="w-full max-w-md flex items-center justify-between px-2">
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-bold tracking-wider">CURRENT GATE</span>
                    <span className="text-xl font-black text-white tracking-tight">{gateType}</span>
                </div>
                <div className="flex gap-2">
                     <button
                        onClick={() => setScanMode('ENTRY')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${scanMode === 'ENTRY' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400'}`}
                    >
                        ENTRY
                    </button>
                    <button
                        onClick={() => setScanMode('VERIFY')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${scanMode === 'VERIFY' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}
                    >
                        VERIFY
                    </button>
                </div>
            </div>

            {/* Scanner Area */}
            <div className="w-full max-w-md aspect-square bg-gray-900 rounded-3xl overflow-hidden border-2 border-gray-800 relative shadow-2xl">
                 {!lastResult && (
                    <div className="w-full h-full relative">
                        <Scanner
                            onScan={(result) => result[0] && handleScan(result[0].rawValue)}
                            components={{ finder: false, audio: false }}
                            styles={{ container: { width: '100%', height: '100%' } }}
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                             <div className={`w-64 h-64 border-2 rounded-2xl ${scanMode === 'ENTRY' ? 'border-green-500/50' : 'border-blue-500/50'}`} />
                        </div>
                         <motion.div
                            className={`absolute left-0 right-0 h-0.5 ${scanMode === 'ENTRY' ? 'bg-green-400' : 'bg-blue-400'} shadow-[0_0_15px_currentColor] z-10`}
                            animate={{ top: ['10%', '90%', '10%'] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </div>
                 )}

                 {/* Result Overlay */}
                <AnimatePresence>
                    {lastResult && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20
                                ${(lastResult.status === 'GRANTED' || (scanMode === 'VERIFY' && lastResult.status === 'VALID')) ? 'bg-emerald-600' : ''}
                                ${lastResult.status === 'WARNING' || lastResult.status === 'NOT_ISSUED' ? 'bg-amber-500' : ''}
                                ${(lastResult.status === 'USED' || lastResult.status === 'BANNED' || lastResult.status === 'NOT_FOUND' || lastResult.status === 'INVALID' || lastResult.status === 'ERROR') ? 'bg-red-600' : ''}
                            `}
                        >
                            <h2 className={`text-4xl font-black uppercase leading-none mb-2 ${['WARNING', 'NOT_ISSUED'].includes(lastResult.status) ? 'text-black' : 'text-white'}`}>
                                {lastResult.status === 'GRANTED' ? 'GO' : ''}
                                {lastResult.status === 'VALID' ? 'VALID' : ''}
                                {lastResult.status === 'USED' ? 'USED' : ''}
                                {lastResult.status === 'BANNED' ? 'BANNED' : ''}
                                {lastResult.status === 'NOT_FOUND' ? 'INVALID' : ''}
                                {lastResult.status === 'WARNING' ? 'UNPAID' : ''}
                            </h2>
                             <p className={`font-medium mb-8 text-lg ${['WARNING', 'NOT_ISSUED'].includes(lastResult.status) ? 'text-black/80' : 'text-white/80'}`}>
                                {lastResult.message || lastResult.status}
                            </p>

                            <button
                                onClick={resetScan}
                                className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg shadow-lg active:scale-95 transition-transform"
                            >
                                SCAN NEXT
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <p className="text-center text-gray-500 text-xs mt-4">
                Keep screen bright for best performance
            </p>
        </div>
    );
}
