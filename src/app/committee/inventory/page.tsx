
'use client';
import React, { useEffect, useState } from 'react';
import { Search, Filter, ScanLine } from 'lucide-react';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';

export default function CommitteeInventory() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<string[]>([]);
    const [showScanner, setShowScanner] = useState(false);
    const [showSellModal, setShowSellModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // Sell Form
    const [customerName, setCustomerName] = useState('');
    const [customerMobile, setCustomerMobile] = useState('');
    const [paymentMode, setPaymentMode] = useState('CASH');

    const fetchTickets = () => {
        setLoading(true);
        fetch(`/api/agent/inventory?search=${search}&filter=STOCK`)
            .then(res => res.json())
            .then(data => {
                if (data.success) setTickets(data.tickets);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchTickets();
    }, [search]);

    const toggleSelect = (id: string) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(s => s !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    const handleScan = (detected: IDetectedBarcode[]) => {
        if (detected.length > 0) {
            const val = detected[0].rawValue;
            // Value could be URL or ID. Assume ID or parse it.
            // If URL like https://tantalize.lk/t/A7X9-B2 -> Extract A7X9-B2
            const parts = val.split('/');
            const code = parts[parts.length - 1];

            setSearch(code); // Trigger search
            setShowScanner(false);
        }
    };

    const handleSell = async () => {
        if (!confirm(`Sell ${selected.length} tickets?`)) return;

        const res = await fetch('/api/agent/sale', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ticketIds: selected,
                customerName,
                customerMobile,
                paymentMode
            })
        });
        const json = await res.json();
        if (json.success) {
            alert('Sold Successfully!');
            setSelected([]);
            setShowSellModal(false);
            fetchTickets();
        } else {
            alert('Failed: ' + json.message);
        }
    };

    return (
        <div className="pb-20 space-y-4">
            {/* Header / Search */}
            <div className="flex gap-2">
                <div className="flex-1 bg-gray-900 border border-gray-800 rounded-lg flex items-center px-3 h-12">
                    <Search className="text-gray-500 mr-2" size={20} />
                    <input
                        className="bg-transparent text-white w-full outline-none"
                        placeholder="Search or Scan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setShowScanner(!showScanner)}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center border border-gray-800 ${showScanner ? 'bg-primary text-white' : 'bg-gray-900 text-gray-400'}`}
                >
                    <ScanLine size={24} />
                </button>
            </div>

            {/* Scanner View */}
            {showScanner && (
                <div className="rounded-xl overflow-hidden border border-gray-700 h-64 bg-black relative">
                    <Scanner onScan={handleScan} />
                    <button
                        onClick={() => setShowScanner(false)}
                        className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full z-10"
                    >
                        X
                    </button>
                </div>
            )}

            {/* Ticket List */}
            <div className="space-y-2">
                {loading ? <div className="text-center text-gray-500 py-10">Loading...</div> :
                    tickets.length === 0 ? <div className="text-center text-gray-500 py-10">No tickets found</div> :
                        tickets.map(t => (
                            <div
                                key={t.id}
                                onClick={() => toggleSelect(t.id)}
                                className={`p-4 rounded-xl border flex justify-between items-center transition-all ${selected.includes(t.id)
                                        ? 'bg-primary/20 border-primary'
                                        : 'bg-gray-900 border-gray-800'
                                    }`}
                            >
                                <div>
                                    <span className="block text-xl font-mono font-bold text-white tracking-widest">{t.code}</span>
                                    <span className="text-xs text-gray-400">SN: {t.serialNumber}</span>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected.includes(t.id) ? 'border-primary bg-primary' : 'border-gray-600'
                                    }`}>
                                    {selected.includes(t.id) && <span className="text-white text-xs">✓</span>}
                                </div>
                            </div>
                        ))}
            </div>

            {/* Floating Action Button (If selection > 0) */}
            {selected.length > 0 && (
                <button
                    onClick={() => setShowSellModal(true)}
                    className="fixed bottom-24 right-4 left-4 bg-primary text-white font-bold py-4 rounded-xl shadow-2xl flex justify-between px-6 z-40"
                >
                    <span>SELL {selected.length} SELECTED</span>
                    <span>→</span>
                </button>
            )}

            {/* Sell Modal */}
            {showSellModal && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-end justify-center">
                    <div className="bg-gray-900 w-full rounded-t-2xl p-6 space-y-4 border-t border-gray-800">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-bold text-white">Confirm Sale</h2>
                            <button onClick={() => setShowSellModal(false)} className="text-gray-400">Close</button>
                        </div>

                        <div className="space-y-3">
                            <input
                                className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white"
                                placeholder="Customer Name (Optional)"
                                value={customerName}
                                onChange={e => setCustomerName(e.target.value)}
                            />
                            <input
                                className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white"
                                placeholder="Mobile Number (Optional)"
                                value={customerMobile}
                                type="tel"
                                onChange={e => setCustomerMobile(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPaymentMode('CASH')}
                                    className={`flex-1 p-3 rounded border font-medium ${paymentMode === 'CASH' ? 'bg-white text-black border-white' : 'bg-gray-800 text-gray-400 border-gray-700'}`}
                                >
                                    CASH
                                </button>
                                <button
                                    onClick={() => setPaymentMode('BANK_TRANSFER')}
                                    className={`flex-1 p-3 rounded border font-medium ${paymentMode === 'BANK_TRANSFER' ? 'bg-white text-black border-white' : 'bg-gray-800 text-gray-400 border-gray-700'}`}
                                >
                                    BANK
                                </button>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={handleSell}
                                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl"
                            >
                                CONFIRM SALE (Rs. {(selected.length * 1500).toLocaleString()})
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
