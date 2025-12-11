
'use client';
import React, { useEffect, useState } from 'react';
import { ArrowRight, Check, X, User } from 'lucide-react';

export default function CommitteeTransfer() {
    const [tab, setTab] = useState<'SEND' | 'INBOX'>('INBOX');
    const [incoming, setIncoming] = useState<any[]>([]);
    const [outgoing, setOutgoing] = useState<any[]>([]);
    const [colleagues, setColleagues] = useState<any[]>([]);

    // Send Form
    const [selectedAgent, setSelectedAgent] = useState('');
    const [ticketRange, setTicketRange] = useState({ start: '', end: '' });
    // Ideally we select specific tickets from a list, like Inventory.
    // For simplicity, let's allow selecting "Ticket IDs" via a multi-select modal or just "Input IDs/Scan".
    // Better UX: "Select from Inventory" to initiate transfer.
    // But here, let's just reuse the "Select IDs" concept?
    // Actually, the "Inventory" page is for selling.
    // Let's add a "Transfer Mode" to Inventory? Or re-fetch inventory here.
    const [inventory, setInventory] = useState<any[]>([]);
    const [selectedTickets, setSelectedTickets] = useState<string[]>([]);

    useEffect(() => {
        fetchData();
        fetchColleagues();
        if (tab === 'SEND') fetchStock();
    }, [tab]);

    const fetchData = () => {
        fetch('/api/agent/transfer')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setIncoming(data.incoming);
                    setOutgoing(data.outgoing);
                }
            });
    };

    const fetchColleagues = () => {
        fetch('/api/agent/directory')
            .then(res => res.json())
            .then(data => { if (data.success) setColleagues(data.colleagues); });
    };

    const fetchStock = () => {
        fetch('/api/agent/inventory?filter=STOCK')
            .then(res => res.json())
            .then(data => { if (data.success) setInventory(data.tickets); });
    };

    const handleAction = async (id: string, action: 'ACCEPT' | 'REJECT' | 'CANCEL') => {
        if (!confirm(`${action} this transfer?`)) return;

        await fetch(`/api/agent/transfer/action`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transferId: id, action })
        });
        fetchData();
    };

    const handleSend = async () => {
        if (!selectedAgent || selectedTickets.length === 0) return alert('Select Agent and Tickets');

        const res = await fetch('/api/agent/transfer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toAgentId: selectedAgent, ticketIds: selectedTickets })
        });
        const json = await res.json();
        if (json.success) {
            alert('Transfer Sent via Request!');
            setSelectedTickets([]);
            setTab('INBOX'); // Go to see outgoing status
            fetchData();
        } else {
            alert(json.message);
        }
    };

    const toggleTicket = (id: string) => {
        if (selectedTickets.includes(id)) setSelectedTickets(selectedTickets.filter(x => x !== id));
        else setSelectedTickets([...selectedTickets, id]);
    };

    return (
        <div className="pb-20 space-y-6">
            <h1 className="text-2xl font-bold text-white">Transfers</h1>

            {/* Tabs */}
            <div className="flex bg-gray-900 p-1 rounded-xl">
                <button
                    onClick={() => setTab('INBOX')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'INBOX' ? 'bg-gray-800 text-white shadow' : 'text-gray-400'}`}
                >
                    Inbox / History
                </button>
                <button
                    onClick={() => setTab('SEND')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'SEND' ? 'bg-primary text-white shadow' : 'text-gray-400'}`}
                >
                    Send Tickets
                </button>
            </div>

            {tab === 'INBOX' && (
                <div className="space-y-6">
                    {/* Incoming */}
                    <div>
                        <h3 className="text-gray-400 text-xs uppercase font-bold mb-2">Incoming Requests</h3>
                        {incoming.length === 0 ? <p className="text-gray-600 text-sm italic">No inputs.</p> :
                            incoming.map((t: any) => (
                                <div key={t.id} className="bg-gray-900 border border-gray-800 p-4 rounded-xl mb-2">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <User size={16} className="text-primary" />
                                            <span className="font-bold text-white">{t.fromAgent.name}</span>
                                        </div>
                                        <span className="text-xs bg-yellow-900/50 text-yellow-500 px-2 py-1 rounded">PENDING</span>
                                    </div>
                                    <div className="text-sm text-gray-400 mb-3">
                                        Sending {t.tickets.length} tickets.
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleAction(t.id, 'ACCEPT')} className="flex-1 bg-green-600 py-2 rounded-lg text-white text-xs font-bold flex justify-center gap-1 items-center">
                                            <Check size={14} /> ACCEPT
                                        </button>
                                        <button onClick={() => handleAction(t.id, 'REJECT')} className="flex-1 bg-red-900/50 py-2 rounded-lg text-red-400 text-xs font-bold flex justify-center gap-1 items-center">
                                            <X size={14} /> REJECT
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* Outgoing */}
                    <div>
                        <h3 className="text-gray-400 text-xs uppercase font-bold mb-2">Outgoing Pending</h3>
                        {outgoing.length === 0 ? <p className="text-gray-600 text-sm italic">No pending outputs.</p> :
                            outgoing.map((t: any) => (
                                <div key={t.id} className="bg-gray-900 border border-gray-800 p-4 rounded-xl mb-2 opacity-75">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">To: <span className="font-bold text-white">{t.toAgent.name}</span></span>
                                        <button onClick={() => handleAction(t.id, 'CANCEL')} className="text-xs text-red-500 underline">Cancel</button>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">{t.tickets.length} tickets waiting acceptance.</div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {tab === 'SEND' && (
                <div className="space-y-4">
                    {/* 1. Select Colleague */}
                    <div>
                        <label className="text-gray-400 text-xs block mb-1">RECIPIENT</label>
                        <select
                            className="w-full bg-gray-900 border border-gray-800 p-3 rounded-lg text-white"
                            onChange={(e) => setSelectedAgent(e.target.value)}
                            value={selectedAgent}
                        >
                            <option value="">Select Committee Member...</option>
                            {colleagues.map((c: any) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* 2. Select Tickets */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-gray-400 text-xs">SELECT TICKETS TO SEND ({selectedTickets.length})</label>
                            <button onClick={() => setSelectedTickets(inventory.map(t => t.id))} className="text-xs text-primary">Select All</button>
                        </div>
                        <div className="h-64 overflow-y-auto space-y-1 bg-black/20 p-2 rounded-xl border border-gray-800">
                            {inventory.length === 0 ? <div className="text-gray-500 text-center py-4">No Stock Available</div> :
                                inventory.map((t: any) => (
                                    <div
                                        key={t.id}
                                        onClick={() => toggleTicket(t.id)}
                                        className={`p-3 rounded-lg flex justify-between items-center cursor-pointer ${selectedTickets.includes(t.id) ? 'bg-primary/20 border border-primary' : 'bg-gray-900 border border-gray-800'}`}
                                    >
                                        <span className="font-mono text-white text-sm">{t.code}</span>
                                        {selectedTickets.includes(t.id) && <Check size={14} className="text-white" />}
                                    </div>
                                ))}
                        </div>
                    </div>

                    <button
                        onClick={handleSend}
                        className="w-full bg-primary text-white font-bold py-4 rounded-xl mt-4 disabled:opacity-50"
                        disabled={!selectedAgent || selectedTickets.length === 0}
                    >
                        SEND REQUEST
                    </button>
                </div>
            )}
        </div>
    );
}
