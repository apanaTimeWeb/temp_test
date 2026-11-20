'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Sliders, QrCode, Armchair, Key, CreditCard, Calculator,
  FileText, MessageSquare, Sparkles, LifeBuoy, Users, Check,
  RotateCcw, ShieldCheck, ToggleLeft, ToggleRight
} from 'lucide-react';

interface ManagerModuleItem {
  id: string;
  name: string;
  group: string;
  description: string;
  icon: typeof Users;
  enabled: boolean;
  tier: 'Starter' | 'Pro' | 'Enterprise';
}

const DEFAULT_MANAGER_MODULES: ManagerModuleItem[] = [
  {
    id: 'attendance_daily',
    name: 'Daily Attendance Desk',
    group: 'Operations',
    description: 'Manual attendance registry per shift with check-in timestamps.',
    icon: Users,
    enabled: true,
    tier: 'Starter',
  },
  {
    id: 'attendance_qr_scanner',
    name: 'QR Scanner & Biometric Check-in',
    group: 'Operations',
    description: 'In-browser camera QR code verification for contactless student entry.',
    icon: QrCode,
    enabled: true,
    tier: 'Pro',
  },
  {
    id: 'seats_matrix',
    name: 'Visual Seats Matrix & Shifts',
    group: 'Facility',
    description: 'Interactive visual floor plan displaying occupied, vacant, and reserved seats.',
    icon: Armchair,
    enabled: true,
    tier: 'Starter',
  },
  {
    id: 'lockers_mgmt',
    name: 'Lockers Management Grid',
    group: 'Facility',
    description: 'Physical locker allocations, keys registry, and caution deposit tracking.',
    icon: Key,
    enabled: false,
    tier: 'Pro',
  },
  {
    id: 'finance_collect_fee',
    name: 'Fee Collection & Renewals Desk',
    group: 'Finance',
    description: 'Accept UPI, cash, card payments, process renewals, and calculate due fines.',
    icon: CreditCard,
    enabled: true,
    tier: 'Starter',
  },
  {
    id: 'accounts_settlement',
    name: 'Daily Cash Settlement Register',
    group: 'Accounts',
    description: 'End-of-day cash drawer tally and manager handover verification.',
    icon: Calculator,
    enabled: true,
    tier: 'Pro',
  },
  {
    id: 'accounts_expenses',
    name: 'Petty Cash & Branch Expenses',
    group: 'Accounts',
    description: 'Track branch operational expenses (WiFi, Electricity, Maintenance, Tea).',
    icon: FileText,
    enabled: true,
    tier: 'Pro',
  },
  {
    id: 'comm_whatsapp',
    name: 'WhatsApp Notices & Receipts',
    group: 'Communication',
    description: 'Automated WhatsApp fee receipts, expiry warnings, and shift reminders.',
    icon: MessageSquare,
    enabled: true,
    tier: 'Pro',
  },
  {
    id: 'crm_id_card',
    name: 'ID Card Generator with Barcode',
    group: 'CRM',
    description: '1-click printable student identification card generator.',
    icon: Sparkles,
    enabled: true,
    tier: 'Starter',
  },
  {
    id: 'comm_complaints',
    name: 'Student Complaints & Helpdesk',
    group: 'Support',
    description: 'Receive and resolve AC, Wi-Fi, and noise grievances directly from students.',
    icon: LifeBuoy,
    enabled: true,
    tier: 'Starter',
  },
];

export default function SuperadminUsersManagerFeatureMatrix() {
  const [modules, setModules] = useState<ManagerModuleItem[]>(DEFAULT_MANAGER_MODULES);

  const toggleModule = (id: string) => {
    setModules((current) =>
      current.map((item) => {
        if (item.id === id) {
          const next = !item.enabled;
          toast.message(`Manager Module "${item.name}" is now ${next ? 'ACTIVATED (Visible in Sidebar)' : 'DEACTIVATED (Hidden in Sidebar)'}`, {
            id: 'superadmin:manager-feature-toggle',
          });
          return { ...item, enabled: next };
        }
        return item;
      })
    );
  };

  const applyPreset = (preset: 'Starter' | 'Pro' | 'Enterprise') => {
    setModules((current) =>
      current.map((item) => {
        if (preset === 'Starter') {
          return { ...item, enabled: item.tier === 'Starter' };
        }
        if (preset === 'Pro') {
          return { ...item, enabled: item.tier === 'Starter' || item.tier === 'Pro' };
        }
        return { ...item, enabled: true };
      })
    );
    toast.success(`Applied ${preset} Plan default feature flags across Manager modules!`);
  };

  const activeCount = modules.filter((m) => m.enabled).length;

  return (
    <section className="overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-sm" aria-labelledby="manager-features-title">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Sliders size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="manager-features-title" className="text-base sm:text-lg font-bold text-slate-100">
                  Manager Panel Sidebar Modules Control Center
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {activeCount} of {modules.length} Modules Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Toggle which sidebar tabs and operational features are Active (ON) or Hidden (OFF) in the Manager panel.
              </p>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-medium">Plan Presets:</span>
            <button
              type="button"
              onClick={() => applyPreset('Starter')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 transition-all cursor-pointer"
            >
              Starter Defaults
            </button>
            <button
              type="button"
              onClick={() => applyPreset('Pro')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 transition-all cursor-pointer"
            >
              Pro Defaults
            </button>
            <button
              type="button"
              onClick={() => applyPreset('Enterprise')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-all cursor-pointer"
            >
              Enterprise (All ON)
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-5">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => toggleModule(mod.id)}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                  mod.enabled
                    ? 'border-indigo-500/40 bg-indigo-950/20 hover:border-indigo-400/60 shadow-xs'
                    : 'border-slate-800 bg-slate-900/40 opacity-60 hover:opacity-85'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl border shrink-0 transition-all ${
                      mod.enabled
                        ? 'border-indigo-500/40 bg-indigo-500/20 text-indigo-300'
                        : 'border-slate-700 bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-bold text-white">{mod.name}</h3>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {mod.group}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{mod.description}</p>
                  </div>
                </div>

                {/* Status Toggle Switch */}
                <div className="ml-3 shrink-0 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-all ${
                      mod.enabled
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${mod.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                    <span>{mod.enabled ? 'ACTIVE' : 'OFF'}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
