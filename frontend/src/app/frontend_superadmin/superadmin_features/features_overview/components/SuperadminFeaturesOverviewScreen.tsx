'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Building2,
  CheckCircle,
  HelpCircle,
  Layers,
  MessageSquare,
  RefreshCw,
  Search,
  ShieldAlert,
  Sliders,
  Users,
  Wallet,
} from 'lucide-react';

interface ModuleConfig {
  id: string;
  name: string;
  category: 'core' | 'operations' | 'finance' | 'engagement';
  icon: typeof BookOpen;
  description: string;
  enabledGlobal: boolean;
  minPlanTier: 'basic' | 'pro' | 'enterprise';
  dependencies: string[];
}

const MODULES_REGISTRY: ModuleConfig[] = [
  {
    id: 'mod_books',
    name: 'Books & Inventory Catalog',
    category: 'core',
    icon: BookOpen,
    description: 'Physical & digital cataloging, ISBN lookup, author indexing, issue & return management',
    enabledGlobal: true,
    minPlanTier: 'basic',
    dependencies: [],
  },
  {
    id: 'mod_members',
    name: 'Members & Student Profiles',
    category: 'core',
    icon: Users,
    description: 'Student registration, smart digital ID cards, KYC verification, shift allocations',
    enabledGlobal: true,
    minPlanTier: 'basic',
    dependencies: [],
  },
  {
    id: 'mod_seats',
    name: 'Seats, Shifts & Lockers Matrix',
    category: 'operations',
    icon: Layers,
    description: 'Interactive visual grid of seats, hourly shifts (morning/evening/full-day), locker assignments',
    enabledGlobal: true,
    minPlanTier: 'basic',
    dependencies: ['mod_members'],
  },
  {
    id: 'mod_finance',
    name: 'Finance & Fee Collection',
    category: 'finance',
    icon: Wallet,
    description: 'Automated recurring fee collection, payment receipts, late fee policies, security deposits',
    enabledGlobal: true,
    minPlanTier: 'pro',
    dependencies: ['mod_members'],
  },
  {
    id: 'mod_accounts',
    name: 'Accounting & Daily Settlement',
    category: 'finance',
    icon: Wallet,
    description: 'Day-end cash drawer settlement, expense categorization, branch P&L summaries',
    enabledGlobal: true,
    minPlanTier: 'pro',
    dependencies: ['mod_finance'],
  },
  {
    id: 'mod_communication',
    name: 'Communication & WhatsApp Alerts',
    category: 'engagement',
    icon: MessageSquare,
    description: 'Automated SMS, WhatsApp payment reminders, shift expiry notices, holiday broadcasts',
    enabledGlobal: true,
    minPlanTier: 'pro',
    dependencies: [],
  },
];

export default function SuperadminFeaturesOverviewScreen() {
  const [selectedTenant, setSelectedTenant] = useState<string>('global');
  const [moduleStates, setModuleStates] = useState<Record<string, boolean>>({
    mod_books: true,
    mod_members: true,
    mod_seats: true,
    mod_finance: true,
    mod_accounts: true,
    mod_communication: true,
  });
  const [search, setSearch] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const toggleModule = (id: string) => {
    setModuleStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const filtered = MODULES_REGISTRY.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <Sliders size={22} />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                07. Feature & Module Control
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 font-semibold">
                  Platform Core
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400">
                Books, Members, Seats, Finance, Accounts, Communication jaise modules enable/disable
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isSaved && (
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle size={14} /> Module changes saved!
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-medium text-sm transition-colors shadow-sm"
          >
            Apply Module Changes
          </button>
        </div>
      </div>

      {/* ── Tenant Selector Bar ── */}
      <div className="p-4 rounded-xl border border-border bg-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Building2 size={18} className="text-teal-400 shrink-0" />
          <div>
            <div className="text-xs text-neutral-400 font-medium">Select Scope for Module Toggles:</div>
            <select
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
              className="mt-1 px-3 py-1.5 text-sm font-semibold rounded-lg border border-border bg-input text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="global">🌐 Platform-Wide Defaults (All Libraries)</option>
              <option value="lib-1">Apex Study Library Group (Pro Tier)</option>
              <option value="lib-2">Patna Central Reading Rooms (Basic Tier)</option>
              <option value="lib-3">Awadh Digital Study Center (Enterprise Tier)</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-neutral-400 max-w-sm">
          💡 Modules disabled globally cannot be accessed by any Library Admin. Tenant-level toggles override platform defaults.
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="max-w-md">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search modules..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-input text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* ── Modules Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((mod) => {
          const Icon = mod.icon;
          const isEnabled = moduleStates[mod.id] ?? true;

          return (
            <div
              key={mod.id}
              className={`p-5 rounded-xl border transition-all ${
                isEnabled
                  ? 'border-border bg-card shadow-sm'
                  : 'border-neutral-800 bg-neutral-900/30 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`p-2.5 rounded-lg shrink-0 ${
                      isEnabled ? 'bg-teal-500/15 text-teal-400' : 'bg-neutral-800 text-neutral-500'
                    }`}
                  >
                    <Icon size={20} />
                  </span>
                  <div>
                    <h3 className="font-bold text-white text-sm">{mod.name}</h3>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">
                      Tier: {mod.minPlanTier}
                    </span>
                  </div>
                </div>

                {/* Switch toggle */}
                <button
                  type="button"
                  onClick={() => toggleModule(mod.id)}
                  aria-pressed={isEnabled}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isEnabled ? 'bg-teal-500' : 'bg-neutral-700'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <p className="text-xs text-neutral-400 mt-3 line-clamp-2 leading-relaxed">
                {mod.description}
              </p>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60 text-xs">
                <span className="text-neutral-500">Status</span>
                <span
                  className={`font-semibold ${
                    isEnabled ? 'text-emerald-400' : 'text-neutral-500'
                  }`}
                >
                  {isEnabled ? '● Active & Enabled' : '○ Disabled'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
