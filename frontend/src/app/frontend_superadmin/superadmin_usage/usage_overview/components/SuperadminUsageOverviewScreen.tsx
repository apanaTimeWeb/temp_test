'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Building2,
  Database,
  Gauge,
  HardDrive,
  MessageSquare,
  Search,
  Server,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

interface LibraryUsage {
  id: string;
  name: string;
  plan: string;
  branchesUsed: number;
  branchesLimit: number;
  usersUsed: number;
  usersLimit: number;
  membersUsed: number;
  membersLimit: number;
  storageGbUsed: number;
  storageGbLimit: number;
  messagesSent: number;
  messagesLimit: number;
  apiCalls: number;
  apiLimit: number;
}

const SAMPLE_USAGE: LibraryUsage[] = [
  {
    id: 'lib-1',
    name: 'Apex Study Library Group',
    plan: 'Pro Plan',
    branchesUsed: 4,
    branchesLimit: 5,
    usersUsed: 12,
    usersLimit: 15,
    membersUsed: 540,
    membersLimit: 600,
    storageGbUsed: 18.4,
    storageGbLimit: 25.0,
    messagesSent: 4200,
    messagesLimit: 5000,
    apiCalls: 48200,
    apiLimit: 100000,
  },
  {
    id: 'lib-2',
    name: 'Patna Central Reading Rooms',
    plan: 'Basic Plan',
    branchesUsed: 1,
    branchesLimit: 1,
    usersUsed: 3,
    usersLimit: 3,
    membersUsed: 92,
    membersLimit: 100,
    storageGbUsed: 4.8,
    storageGbLimit: 5.0,
    messagesSent: 950,
    messagesLimit: 1000,
    apiCalls: 12500,
    apiLimit: 20000,
  },
  {
    id: 'lib-3',
    name: 'Awadh Digital Study Center',
    plan: 'Enterprise',
    branchesUsed: 8,
    branchesLimit: 20,
    usersUsed: 28,
    usersLimit: 50,
    membersUsed: 1280,
    membersLimit: 2500,
    storageGbUsed: 42.1,
    storageGbLimit: 100.0,
    messagesSent: 11200,
    messagesLimit: 25000,
    apiCalls: 184000,
    apiLimit: 500000,
  },
  {
    id: 'lib-4',
    name: 'Kashi Scholars Library',
    plan: 'Pro Plan',
    branchesUsed: 2,
    branchesLimit: 5,
    usersUsed: 6,
    usersLimit: 15,
    membersUsed: 210,
    membersLimit: 600,
    storageGbUsed: 9.2,
    storageGbLimit: 25.0,
    messagesSent: 1840,
    messagesLimit: 5000,
    apiCalls: 22100,
    apiLimit: 100000,
  },
];

export default function SuperadminUsageOverviewScreen() {
  const [search, setSearch] = useState('');

  // Aggregates
  const totalBranchesUsed = SAMPLE_USAGE.reduce((acc, c) => acc + c.branchesUsed, 0);
  const totalBranchesLimit = SAMPLE_USAGE.reduce((acc, c) => acc + c.branchesLimit, 0);
  const totalMembersUsed = SAMPLE_USAGE.reduce((acc, c) => acc + c.membersUsed, 0);
  const totalMembersLimit = SAMPLE_USAGE.reduce((acc, c) => acc + c.membersLimit, 0);
  const totalStorageUsed = SAMPLE_USAGE.reduce((acc, c) => acc + c.storageGbUsed, 0);
  const totalStorageLimit = SAMPLE_USAGE.reduce((acc, c) => acc + c.storageGbLimit, 0);
  const totalMessagesSent = SAMPLE_USAGE.reduce((acc, c) => acc + c.messagesSent, 0);
  const totalMessagesLimit = SAMPLE_USAGE.reduce((acc, c) => acc + c.messagesLimit, 0);

  const filtered = SAMPLE_USAGE.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.plan.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Gauge size={22} />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                08. Usage & Limit Monitoring
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 font-semibold">
                  Real-Time Quotas
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400">
                Branches, users, members, storage, messages, API usage tracking & limits
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── High Utilization Alert Banner ── */}
      <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
        <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200">
          <span className="font-bold">Quota Notice:</span> 1 library (<span className="font-semibold underline">Patna Central Reading Rooms</span>) has reached 95% of its SMS & Member plan quota. Automated upgrade reminders have been scheduled.
        </div>
      </div>

      {/* ── Global Resource Meters ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Branches */}
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span className="font-medium flex items-center gap-1.5 text-sky-400">
              <Building2 size={14} /> Total Branches
            </span>
            <span>{Math.round((totalBranchesUsed / totalBranchesLimit) * 100)}%</span>
          </div>
          <div className="text-xl font-black text-white">
            {totalBranchesUsed} <span className="text-xs font-normal text-neutral-500">/ {totalBranchesLimit} cap</span>
          </div>
          <div className="w-full bg-neutral-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-sky-400 h-full rounded-full transition-all"
              style={{ width: `${(totalBranchesUsed / totalBranchesLimit) * 100}%` }}
            />
          </div>
        </div>

        {/* Members */}
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span className="font-medium flex items-center gap-1.5 text-emerald-400">
              <Users size={14} /> Active Members
            </span>
            <span>{Math.round((totalMembersUsed / totalMembersLimit) * 100)}%</span>
          </div>
          <div className="text-xl font-black text-white">
            {totalMembersUsed.toLocaleString()} <span className="text-xs font-normal text-neutral-500">/ {totalMembersLimit.toLocaleString()} cap</span>
          </div>
          <div className="w-full bg-neutral-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all"
              style={{ width: `${(totalMembersUsed / totalMembersLimit) * 100}%` }}
            />
          </div>
        </div>

        {/* Cloud Storage */}
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span className="font-medium flex items-center gap-1.5 text-purple-400">
              <HardDrive size={14} /> Cloud Storage
            </span>
            <span>{Math.round((totalStorageUsed / totalStorageLimit) * 100)}%</span>
          </div>
          <div className="text-xl font-black text-white">
            {totalStorageUsed.toFixed(1)} GB <span className="text-xs font-normal text-neutral-500">/ {totalStorageLimit} GB</span>
          </div>
          <div className="w-full bg-neutral-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-purple-400 h-full rounded-full transition-all"
              style={{ width: `${(totalStorageUsed / totalStorageLimit) * 100}%` }}
            />
          </div>
        </div>

        {/* Messages */}
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span className="font-medium flex items-center gap-1.5 text-amber-400">
              <MessageSquare size={14} /> SMS & WhatsApp
            </span>
            <span>{Math.round((totalMessagesSent / totalMessagesLimit) * 100)}%</span>
          </div>
          <div className="text-xl font-black text-white">
            {totalMessagesSent.toLocaleString()} <span className="text-xs font-normal text-neutral-500">/ {totalMessagesLimit.toLocaleString()}</span>
          </div>
          <div className="w-full bg-neutral-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full transition-all"
              style={{ width: `${(totalMessagesSent / totalMessagesLimit) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Per-Library Quota Table ── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white">Library Tenant Quota Consumption</h2>
            <p className="text-xs text-neutral-400">Real-time resource burn by registered accounts</p>
          </div>
          <div className="relative max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search library..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-input text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-neutral-900/40 text-neutral-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Library Account</th>
                <th className="py-3 px-4">Plan Tier</th>
                <th className="py-3 px-4">Branches</th>
                <th className="py-3 px-4">Members</th>
                <th className="py-3 px-4">Storage</th>
                <th className="py-3 px-4">Messages</th>
                <th className="py-3 px-4">API Usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((u) => {
                const memberPct = Math.round((u.membersUsed / u.membersLimit) * 100);
                const isHigh = memberPct >= 90;

                return (
                  <tr key={u.id} className="hover:bg-neutral-800/20 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      {u.name}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-medium">
                        {u.plan}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-300">
                      <span className="font-semibold text-white">{u.branchesUsed}</span> / {u.branchesLimit}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${isHigh ? 'text-amber-400' : 'text-white'}`}>
                          {u.membersUsed} / {u.membersLimit}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                          isHigh ? 'bg-amber-500/20 text-amber-400' : 'text-neutral-500'
                        }`}>
                          {memberPct}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-neutral-300">
                      {u.storageGbUsed.toFixed(1)} GB / {u.storageGbLimit} GB
                    </td>
                    <td className="py-3 px-4 text-neutral-300">
                      {u.messagesSent.toLocaleString()} / {u.messagesLimit.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-neutral-300 font-mono">
                      {u.apiCalls.toLocaleString()} calls
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
