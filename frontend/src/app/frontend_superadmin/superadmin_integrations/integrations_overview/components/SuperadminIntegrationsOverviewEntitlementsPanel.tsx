// components/SuperadminIntegrationsOverviewEntitlementsPanel.tsx
// RESPONSIBILITY: Matrix allowing SuperAdmin to enable or disable integrations per plan tier with tactile server-health style mini toggle switches.
// DATA FLOW: PlanEntitlements array -> SuperadminIntegrationsOverviewEntitlementsPanel -> onToggle.
'use client';

import {
  CreditCard,
  HardDrive,
  KeyRound,
  MessageSquare,
  QrCode,
  Radio,
  ShieldCheck,
} from 'lucide-react';
import React from 'react';
import type { PlanEntitlementItem } from '../types/superadmin_integrations_overview.types';

interface SuperadminIntegrationsOverviewEntitlementsPanelProps {
  entitlements: PlanEntitlementItem[];
  onToggleEntitlement: (planId: string, providerKey: string, enabled: boolean) => void;
  isUpdating?: boolean;
}

interface ProviderMeta {
  key: string;
  label: string;
  icon: React.ElementType;
}

const PROVIDER_COLUMNS: readonly ProviderMeta[] = [
  { key: 'razorpay', label: 'Razorpay', icon: CreditCard },
  { key: 'stripe', label: 'Stripe', icon: CreditCard },
  { key: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
  { key: 'msg91', label: 'SMS Gateway', icon: MessageSquare },
  { key: 'smtp', label: 'Custom SMTP', icon: KeyRound },
  { key: 's3', label: 'Cloud S3', icon: HardDrive },
  { key: 'barcode', label: 'Barcode/QR', icon: QrCode },
  { key: 'biometric', label: 'Biometrics', icon: Radio },
] as const;

export const SuperadminIntegrationsOverviewEntitlementsPanel: React.FC<
  SuperadminIntegrationsOverviewEntitlementsPanelProps
> = ({ entitlements, onToggleEntitlement, isUpdating = false }) => {
  const getTierBadgeClass = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'enterprise':
        return 'border-amber-500/30 bg-amber-500/15 text-amber-300';
      case 'growth':
      case 'pro':
        return 'border-purple-500/30 bg-purple-500/15 text-purple-300';
      case 'starter':
        return 'border-cyan-500/30 bg-cyan-500/15 text-cyan-300';
      default:
        return 'border-slate-700 bg-slate-800/80 text-slate-300';
    }
  };

  return (
    <div className="space-y-4" data-testid="superadmin-entitlements-panel">
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0c102b]/95 via-[#090d24]/95 to-[#050714]/95 p-4 sm:p-6 space-y-5 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-purple-500/10 blur-2xl" />

        {/* Panel Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-500/20 relative z-10">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-inner shrink-0">
              <ShieldCheck size={20} strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                Integration Feature Entitlements per Plan Tier
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Define which third-party gateways and hardware capabilities are accessible to each subscription tier.
              </p>
            </div>
          </div>

          {/* Telemetry Status Legend (matching Server & Health style) */}
          <div className="flex items-center gap-3 self-start sm:self-auto text-[10px] font-mono font-semibold tracking-wider uppercase select-none">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ACTIVE (ON)</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-700 bg-slate-800/80 text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
              <span>DISABLED</span>
            </div>
          </div>
        </div>

        {/* ── Fully Responsive Unified Cyber Matrix with Server-Health Tactile Mini Switches ── */}
        <div className="rounded-xl border border-indigo-500/20 overflow-hidden shadow-inner bg-slate-950/60">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-xs min-w-[720px]">
              <thead className="bg-slate-950/90 border-b border-indigo-500/20 font-semibold text-slate-300">
                <tr>
                  <th className="px-4 sm:px-5 py-3.5 sticky left-0 bg-[#0c102b] z-10 shadow-[2px_0_5px_rgba(0,0,0,0.4)] whitespace-nowrap min-w-[190px]">
                    Subscription Tier
                  </th>
                  {PROVIDER_COLUMNS.map((col) => {
                    const Icon = col.icon;
                    return (
                      <th key={col.key} className="px-3 py-3.5 text-center whitespace-nowrap min-w-[95px]">
                        <div className="flex items-center justify-center gap-1.5">
                          <Icon size={12} className="text-purple-400 shrink-0" />
                          <span>{col.label}</span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-500/10">
                {entitlements.map((plan) => (
                  <tr key={plan.planId} className="hover:bg-indigo-950/30 transition-colors">
                    <td className="px-4 sm:px-5 py-4 sticky left-0 bg-[#0c102b] z-10 shadow-[2px_0_5px_rgba(0,0,0,0.4)] whitespace-nowrap">
                      <div className="font-semibold text-slate-100 text-xs">{plan.planName}</div>
                      <span className={`inline-block mt-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded-md border ${getTierBadgeClass(plan.tier)}`}>
                        {plan.tier} Tier
                      </span>
                    </td>
                    {PROVIDER_COLUMNS.map((col) => {
                      const isAllowed = plan.allowedProviders[col.key] ?? false;
                      return (
                        <td key={col.key} className="px-3 py-4 text-center align-middle whitespace-nowrap">
                          <div className="flex flex-col items-center justify-center gap-1">
                            {/* Server & Health Tactile Mini Slider Switch with Power Icon ⏻ */}
                            <button
                              type="button"
                              role="switch"
                              aria-checked={isAllowed}
                              aria-label={`Toggle ${col.label} for ${plan.planName}`}
                              aria-pressed={isAllowed}
                              onClick={() => onToggleEntitlement(plan.planId, col.key, !isAllowed)}
                              disabled={isUpdating}
                              className={`premium-switch relative flex items-center w-[50px] h-[26px] p-[2px] rounded-full border-0 cursor-pointer box-border transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed ${
                                isAllowed
                                  ? 'is-armed bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.45),inset_0_1px_2px_rgba(0,0,0,0.25)]'
                                  : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] border border-slate-700/80 hover:border-slate-600'
                              }`}
                              title={`Toggle ${col.label} for ${plan.planName}`}
                            >
                              {/* Recessed internal circuit track glow */}
                              <div
                                className={`pointer-events-none absolute inset-x-2 top-1/2 -translate-y-1/2 h-1 rounded-full transition-all duration-300 ${
                                  isAllowed
                                    ? 'bg-gradient-to-r from-emerald-400 to-teal-300 opacity-60 shadow-[0_0_6px_rgba(16,185,129,0.8)]'
                                    : 'bg-slate-950/80 opacity-40'
                                }`}
                              />

                              {/* Tactile White Chrome Knob with Power Icon ⏻ */}
                              <span
                                aria-hidden="true"
                                className={`switch-knob relative z-10 flex items-center justify-center w-[22px] h-[22px] min-w-[22px] min-h-[22px] rounded-full bg-white transition-transform duration-300 ease-out select-none shadow-[0_2px_6px_rgba(0,0,0,0.5),0_1px_2px_rgba(255,255,255,0.8)_inset] ${
                                  isAllowed
                                    ? 'translate-x-[24px] text-emerald-600'
                                    : 'translate-x-0 text-slate-800'
                                }`}
                              >
                                <span className="text-[10px] leading-none select-none font-bold drop-shadow-xs">⏻</span>
                              </span>
                            </button>

                            {/* Status Micro-Hint */}
                            <span
                              className={`font-mono text-[9px] font-extrabold uppercase tracking-wider select-none transition-colors ${
                                isAllowed ? 'text-emerald-400' : 'text-slate-500'
                              }`}
                            >
                              {isAllowed ? 'ON' : 'OFF'}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
