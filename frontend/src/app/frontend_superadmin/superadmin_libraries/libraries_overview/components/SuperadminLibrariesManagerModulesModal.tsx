'use client';

import React, { useState } from 'react';
import {
  X, Sliders, CheckCircle, AlertTriangle, ShieldCheck,
  QrCode, Armchair, Key, CreditCard, Calculator, MessageSquare,
  FileText, Users, LifeBuoy, Sparkles, Check
} from 'lucide-react';
import type { SuperadminLibrariesLibrary } from '../types/SuperadminLibrariesOverviewTypes';

interface SuperadminLibrariesManagerModulesModalProps {
  lib: SuperadminLibrariesLibrary;
  onClose: () => void;
  onSaveModules: (tenantId: string, modules: Record<string, boolean>) => void;
}

interface ModuleDefinition {
  key: string;
  name: string;
  description: string;
  icon: typeof QrCode;
  category: string;
  defaultOn?: boolean;
}

const MANAGER_MODULES_CATALOG: ModuleDefinition[] = [
  {
    key: 'attendance',
    name: 'Daily Attendance Desk',
    description: 'Manual and automated student attendance tracking per shift.',
    icon: Users,
    category: 'Operations',
    defaultOn: true,
  },
  {
    key: 'qr_scanner',
    name: 'QR Scanner & Biometric Check-in',
    description: 'In-browser camera scanner for student entry & exit verification.',
    icon: QrCode,
    category: 'Operations',
    defaultOn: true,
  },
  {
    key: 'seats_matrix',
    name: 'Visual Seats Matrix & Shifts',
    description: 'Live interactive floor grid with real-time seat availability colors.',
    icon: Armchair,
    category: 'Facility',
    defaultOn: true,
  },
  {
    key: 'lockers',
    name: 'Lockers Management Grid',
    description: 'Locker allocations, physical keys registry, and deposit tracking.',
    icon: Key,
    category: 'Facility',
    defaultOn: false,
  },
  {
    key: 'fee_collection',
    name: 'Fee Collection & Renewals',
    description: 'Accept UPI, Cash, Card, record late fines, and process plan renewals.',
    icon: CreditCard,
    category: 'Finance',
    defaultOn: true,
  },
  {
    key: 'daily_settlement',
    name: 'Daily Cash Settlement Register',
    description: 'End-of-day cash drawer tally and handover verification.',
    icon: Calculator,
    category: 'Finance',
    defaultOn: true,
  },
  {
    key: 'expenses',
    name: 'Petty Cash & Expenses Tracker',
    description: 'Track branch utilities, maintenance, chai, and cleaning vouchers.',
    icon: FileText,
    category: 'Finance',
    defaultOn: true,
  },
  {
    key: 'whatsapp',
    name: 'WhatsApp Notices & Receipts',
    description: 'Automated fee receipts, expiry warnings, and welcome messages via WhatsApp API.',
    icon: MessageSquare,
    category: 'Communication',
    defaultOn: true,
  },
  {
    key: 'id_card',
    name: 'ID Card Generator with Barcode',
    description: '1-click customizable student identification card rendering and printing.',
    icon: Sparkles,
    category: 'CRM',
    defaultOn: true,
  },
  {
    key: 'complaints',
    name: 'Student Complaints & Helpdesk',
    description: 'Receive and resolve AC, Wi-Fi, and noise grievances directly from students.',
    icon: LifeBuoy,
    category: 'Support',
    defaultOn: true,
  },
];

export default function SuperadminLibrariesManagerModulesModal({
  lib,
  onClose,
  onSaveModules,
}: SuperadminLibrariesManagerModulesModalProps) {
  const [modules, setModules] = useState<Record<string, boolean>>(() => {
    if (lib.managerModules) return { ...lib.managerModules };
    const initial: Record<string, boolean> = {};
    MANAGER_MODULES_CATALOG.forEach((m) => {
      initial[m.key] = m.defaultOn ?? true;
    });
    return initial;
  });

  const toggleModule = (key: string) => {
    setModules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const applyPreset = (preset: 'starter' | 'pro' | 'enterprise') => {
    if (preset === 'starter') {
      // Basic core desk only
      setModules({
        attendance: true,
        qr_scanner: false,
        seats_matrix: true,
        lockers: false,
        fee_collection: true,
        daily_settlement: false,
        expenses: false,
        whatsapp: false,
        id_card: true,
        complaints: false,
      });
    } else if (preset === 'pro') {
      // Pro suite with WhatsApp & Settlement
      setModules({
        attendance: true,
        qr_scanner: true,
        seats_matrix: true,
        lockers: false,
        fee_collection: true,
        daily_settlement: true,
        expenses: true,
        whatsapp: true,
        id_card: true,
        complaints: true,
      });
    } else {
      // Enterprise: all ON
      const allOn: Record<string, boolean> = {};
      MANAGER_MODULES_CATALOG.forEach((m) => {
        allOn[m.key] = true;
      });
      setModules(allOn);
    }
  };

  const activeCount = Object.values(modules).filter(Boolean).length;

  const handleSave = () => {
    onSaveModules(lib.id, modules);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modules-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-indigo-500/30 bg-[#0a0d22] text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-indigo-500/20 bg-gradient-to-r from-indigo-950/60 via-[#0a0d22] to-[#0c0f28]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Sliders size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="modules-modal-title" className="text-base sm:text-lg font-bold text-white">
                  Manager Sidebar Modules
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {activeCount} of {MANAGER_MODULES_CATALOG.length} Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure visible sidebar features for <strong className="text-slate-200">{lib.name}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            title="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Presets Bar */}
        <div className="px-4 py-2.5 bg-indigo-500/5 border-b border-indigo-500/20 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400">Quick Plan Presets:</span>
          <button
            type="button"
            onClick={() => applyPreset('starter')}
            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 cursor-pointer transition-all"
          >
            Starter Tier
          </button>
          <button
            type="button"
            onClick={() => applyPreset('pro')}
            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 cursor-pointer transition-all"
          >
            Pro Tier
          </button>
          <button
            type="button"
            onClick={() => applyPreset('enterprise')}
            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 cursor-pointer transition-all"
          >
            Enterprise Suite (All ON)
          </button>
        </div>

        {/* Modules List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5">
          {MANAGER_MODULES_CATALOG.map((mod) => {
            const isEnabled = !!modules[mod.key];
            const Icon = mod.icon;
            return (
              <div
                key={mod.key}
                onClick={() => toggleModule(mod.key)}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isEnabled
                    ? 'border-indigo-500/40 bg-indigo-950/20 hover:border-indigo-400/60'
                    : 'border-slate-800 bg-slate-900/40 opacity-60 hover:opacity-80'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl border shrink-0 transition-all ${
                      isEnabled
                        ? 'border-indigo-500/40 bg-indigo-500/20 text-indigo-300'
                        : 'border-slate-700 bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-white">{mod.name}</h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {mod.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{mod.description}</p>
                  </div>
                </div>

                {/* Toggle Pill */}
                <div className="ml-4 shrink-0">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                      isEnabled
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}
                    />
                    <span>{isEnabled ? 'ACTIVE' : 'OFF'}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-indigo-500/20 bg-slate-900/60 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Disabled modules are automatically hidden in the Manager Panel sidebar.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md active:scale-95 cursor-pointer"
            >
              Save Module Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
