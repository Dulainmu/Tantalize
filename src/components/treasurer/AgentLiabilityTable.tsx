'use client';

import React, { useState } from 'react';
import SettleModal from './SettleModal';

export default function AgentLiabilityTable({ agents, onSettle }: any) {
    const [selectedAgent, setSelectedAgent] = useState<any>(null);

    const formatLKR = (val: number) => {
        return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-[#1a1232] text-xs uppercase text-gray-400">
                    <tr>
                        <th className="p-4">Agent Name</th>
                        <th className="p-4 text-center">Assigned</th>
                        <th className="p-4 text-center">Sold (Unsettled)</th>
                        <th className="p-4 text-right">Cash Owed</th>
                        <th className="p-4">Last Payment</th>
                        <th className="p-4">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {agents.map((agent: any) => (
                        <tr key={agent.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-medium">{agent.name}</td>
                            <td className="p-4 text-center text-gray-400">{agent.assigned}</td>
                            <td className="p-4 text-center font-bold text-white">{agent.soldUnsettled}</td>
                            <td className={`p-4 text-right font-bold ${agent.cashOwed > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                {formatLKR(agent.cashOwed)}
                            </td>
                            <td className="p-4 text-xs text-gray-500">
                                {agent.lastPayment ? new Date(agent.lastPayment).toLocaleDateString() : '-'}
                            </td>
                            <td className="p-4">
                                {agent.cashOwed > 0 ? (
                                    <button
                                        onClick={() => setSelectedAgent(agent)}
                                        className="bg-gold-500 hover:bg-gold-400 text-black px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-gold-500/20"
                                    >
                                        COLLECT
                                    </button>
                                ) : (
                                    <div className="flex items-center text-green-500 gap-1 text-sm font-bold">
                                        <span>✔</span> Settled
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal */}
            {selectedAgent && (
                <SettleModal
                    agent={selectedAgent}
                    onClose={() => setSelectedAgent(null)}
                    onSuccess={() => {
                        setSelectedAgent(null);
                        onSettle();
                    }}
                />
            )}
        </div>
    );
}
