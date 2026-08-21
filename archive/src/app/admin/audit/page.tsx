'use client';

import React, { useState, useEffect } from 'react';

type AuditLog = {
    id: string;
    action: string;
    entityId: string;
    actorName: string;
    timestamp: string;
    details: any;
};

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/audit') // need to create this
            .then(res => res.json())
            .then(data => {
                if (data.success) setLogs(data.logs);
                setLoading(false);
            });
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">System Audit Logs</h1>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-800 text-zinc-400">
                        <tr>
                            <th className="p-4">Time</th>
                            <th className="p-4">Actor</th>
                            <th className="p-4">Action</th>
                            <th className="p-4">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {logs.map(log => (
                            <tr key={log.id} className="hover:bg-zinc-800/50">
                                <td className="p-4 text-zinc-500 font-mono text-xs">
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="p-4 font-bold">{log.actorName}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${log.action.includes('SETTLE') ? 'bg-green-900 text-green-400' :
                                            log.action.includes('ASSIGN') ? 'bg-blue-900 text-blue-400' :
                                                log.action.includes('SOLD') ? 'bg-indigo-900 text-indigo-400' :
                                                    'bg-zinc-800 text-zinc-400'
                                        }`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="p-4 text-zinc-400 truncate max-w-xs" title={JSON.stringify(log.details)}>
                                    {JSON.stringify(log.details)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
