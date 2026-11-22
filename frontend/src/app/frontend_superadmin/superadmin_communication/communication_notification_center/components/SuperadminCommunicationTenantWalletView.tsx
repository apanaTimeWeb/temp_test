'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Wallet, Plus, RefreshCw, Send, CheckCircle2, AlertTriangle,
  ArrowUpRight, ShieldCheck, MessageSquare, Zap, Search, Download
} from 'lucide-react';

interface TenantWallet {
  id: string;
  tenant: string;
  plan: string;
  balance: number;
  waCredits: number;
  smsCredits: number;
  monthlySpend: number;
  status: 'Healthy' | 'Low' | 'Critical';
}

const SAMPLE_WALLETS: TenantWallet[] = [
  { id: '1', tenant: 'City Central Library', plan: 'Enterprise', balance: 4250, waCredits: 17000, smsCredits: 8500, monthlySpend: 2450, status: 'Healthy' },
  { id: '2', tenant: 'Apex Knowledge Hub', plan: 'Professional', balance: 1850, waCredits: 7400, smsCredits: 3200, monthlySpend: 1100, status: 'Healthy' },
  { id: '3', tenant: 'Nalanda Digital Reading Room', plan: 'Starter', balance: 140, waCredits: 560, smsCredits: 120, monthlySpend: 820, status: 'Low' },
  { id: '4', tenant: 'Pinnacle Study Spaces', plan: 'Professional', balance: 45, waCredits: 180, smsCredits: 0, monthlySpend: 650, status: 'Critical' },
  { id: '5', tenant: 'Saraswati Reading Lounge', plan: 'Starter', balance: 950, waCredits: 3800, smsCredits: 1500, monthlySpend: 420, status: 'Healthy' },
];

export function SuperadminCommunicationTenantWalletView() {
  const [wallets, setWallets] = useState<TenantWallet[]>(SAMPLE_WALLETS);
  const [search, setSearch] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<TenantWallet | null>(null);
  const [topUpAmount, setTopUpAmount] = useState<number>(1000);

  const filtered = wallets.filter((w) =>
    w.tenant.toLowerCase().includes(search.toLowerCase()) || w.plan.toLowerCase().includes(search.toLowerCase())
  );

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWallet) return;
    const additionalWa = Math.floor(topUpAmount / 0.25);
    setWallets((prev) =>
      prev.map((w) =>
        w.id === selectedWallet.id
          ? {
              ...w,
              balance: w.balance + topUpAmount,
              waCredits: w.waCredits + additionalWa,
              status: 'Healthy',
            }
          : w
      )
    );
    toast.success(`Credited ₹${topUpAmount} (${additionalWa} WhatsApp messages) to ${selectedWallet.tenant}`);
    setSelectedWallet(null);
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-[#0c1033]/80 to-[#080b22]/95 backdrop-blur-md">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Prepaid Pool</div>
          <div className="text-2xl font-extrabold text-indigo-300 font-mono">₹48,250</div>
          <div className="text-[10px] text-slate-400 mt-1">Tenant wallet balances held in escrow</div>
        </div>

        <div className="p-4 rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-[#06201a]/80 to-[#080b22]/95 backdrop-blur-md">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">WhatsApp Credits Available</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">1,93,000</div>
          <div className="text-[10px] text-slate-400 mt-1">@ ₹0.25 per outgoing utility message</div>
        </div>

        <div className="p-4 rounded-2xl border border-amber-500/20 bg-gradient-to-b from-[#241705]/80 to-[#080b22]/95 backdrop-blur-md">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Daily Message Burn Rate</div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">₹1,205 / day</div>
          <div className="text-[10px] text-slate-400 mt-1">4,821 WhatsApp + 1,240 SMS sent today</div>
        </div>

        <div className="p-4 rounded-2xl border border-rose-500/20 bg-gradient-to-b from-[#220a14]/80 to-[#080b22]/95 backdrop-blur-md">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Low Balance Alerts (&lt; ₹200)</div>
          <div className="text-2xl font-extrabold text-rose-400 font-mono">2 Libraries</div>
          <div className="text-[10px] text-rose-300 mt-1">Auto-recharge prompt dispatched</div>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-indigo-500/25 bg-[#090d29]/95 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-indigo-500/20 bg-[#06081a]/95 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Wallet size={18} className="text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Tenant Messaging Wallets & Auto-Recharge Status</h3>
          </div>
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input maxLength={100}
              type="search"
              placeholder="Filter by library name or plan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-indigo-500/30 bg-[#060818] text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-indigo-500/15 bg-[#060818] text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="p-3.5">Tenant Library</th>
                <th className="p-3.5">Plan Tier</th>
                <th className="p-3.5 text-right">Wallet Balance</th>
                <th className="p-3.5 text-right">WhatsApp Credits</th>
                <th className="p-3.5 text-right">SMS Credits</th>
                <th className="p-3.5 text-right">Monthly Burn</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-500/10 text-slate-300">
              {filtered.map((w) => (
                <tr key={w.id} className="hover:bg-indigo-500/10 transition-colors">
                  <td className="p-3.5 font-bold text-slate-100">{w.tenant}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      {w.plan}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-emerald-400 text-sm">
                    ₹{w.balance.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-right font-mono text-slate-200">
                    {w.waCredits.toLocaleString('en-IN')} msgs
                  </td>
                  <td className="p-3.5 text-right font-mono text-slate-400">
                    {w.smsCredits.toLocaleString('en-IN')} msgs
                  </td>
                  <td className="p-3.5 text-right font-mono text-slate-400">
                    ₹{w.monthlySpend.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      w.status === 'Healthy'
                        ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                        : w.status === 'Low'
                        ? 'border-amber-500/30 bg-amber-500/15 text-amber-400'
                        : 'border-rose-500/30 bg-rose-500/15 text-rose-400'
                    }`}>
                      {w.status === 'Healthy' ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
                      <span>{w.status}</span>
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedWallet(w)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-[11px] font-bold shadow-md cursor-pointer transition-all active:scale-95"
                    >
                      <Plus size={11} /> Top-Up Wallet
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top-up Modal */}
      {selectedWallet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-[#0c0f2f] to-[#07091c] p-6 shadow-2xl text-slate-200">
            <div className="flex items-center gap-2 mb-4 border-b border-indigo-500/20 pb-3">
              <Wallet className="text-emerald-400" size={20} />
              <div>
                <h3 className="text-base font-bold text-white">Top-Up WhatsApp & SMS Credits</h3>
                <p className="text-xs text-slate-400">{selectedWallet.tenant}</p>
              </div>
            </div>

            <form onSubmit={handleTopUp} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 grid grid-cols-2 gap-2 text-slate-300">
                <div>
                  <span className="text-slate-400 block text-[10px]">Current Balance:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">₹{selectedWallet.balance}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Current WhatsApp Credits:</span>
                  <span className="font-mono font-semibold text-white">{selectedWallet.waCredits} msgs</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">Select Top-Up Package</label>
                <div className="grid grid-cols-3 gap-2">
                  {[500, 1000, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopUpAmount(amt)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        topUpAmount === amt
                          ? 'border-emerald-400 bg-emerald-500/20 text-white font-bold'
                          : 'border-indigo-500/20 bg-[#060818] text-slate-300 hover:border-indigo-500/40'
                      }`}
                    >
                      <div className="font-mono text-sm">₹{amt}</div>
                      <div className="text-[10px] text-slate-400">{Math.floor(amt / 0.25)} msgs</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-indigo-500/20">
                <button
                  type="button"
                  onClick={() => setSelectedWallet(null)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold cursor-pointer"
                >
                  Confirm Recharge (₹{topUpAmount})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
