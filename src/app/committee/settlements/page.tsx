
'use client';
import React, { useEffect, useState } from 'react';

export default function CommitteeSettlements() {
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/agent/settlements')
            .then(res => res.json())
            .then(data => { if (data.success) setHistory(data.history); });
    }, []);

    // Helper to calculate total?
    // We can also add a "Create Settlement" button here, 
    // but the workflow usually starts from "Inventory" -> "Mark Sold" or "Wallet"
    // Actually, Settlement is paying the Treasurer.
    // The previous flow in Admin Dashboard was: Treasurer selects Agent and clicks "Settle".
    // Does the Agent initiate it?
    // According to Phase 7 Plan: "Request settlement (Cash/Bank)".
    // So yes, Agent can say "I deposited 50k".
    // I will add a simple button "Notify Payment" which opens a modal?
    // For now, let's just stick to "View History" and maybe a placeholder "Request" if time permits.
    // Given scope, viewing settled history is the most important "Confidence" builder.

    return (
        <div className="pb-20 space-y-6">
            <h1 className="text-2xl font-bold text-white">Settlement History</h1>
            <p className="text-gray-400 text-sm">Records of your payments to the Treasury.</p>

            <div className="space-y-3">
                {history.length === 0 ? <p className="text-gray-600 italic">No settlements found.</p> :
                    history.map((s: any) => (
                        <div key={s.id} className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex justify-between items-center">
                            <div>
                                <div className="text-white font-bold text-lg">Rs. {s.amount.toLocaleString()}</div>
                                <div className="text-xs text-gray-500">{new Date(s.timestamp).toLocaleDateString()} at {new Date(s.timestamp).toLocaleTimeString()}</div>
                            </div>
                            <div className={`text-xs font-bold px-2 py-1 rounded ${s.status === 'CONFIRMED' ? 'bg-green-900/50 text-green-500' :
                                    s.status === 'PENDING' ? 'bg-yellow-900/50 text-yellow-500' : 'bg-red-900/50 text-red-500'
                                }`}>
                                {s.status}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
