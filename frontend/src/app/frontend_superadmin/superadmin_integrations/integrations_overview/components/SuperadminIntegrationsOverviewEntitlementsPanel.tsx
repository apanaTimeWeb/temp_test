// components/SuperadminIntegrationsOverviewEntitlementsPanel.tsx
// RESPONSIBILITY: Matrix allowing SuperAdmin to enable or disable integrations per plan tier with mini toggle switches.
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
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0c102b]/95 via-[#090d24]/95 to-[#050714]/95 p-4 sm:p-6 space-y-4 shadow-xl backdrop-blur-md relative overflow-hidden">
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

          <div className="flex items-center gap-2.5 self-start sm:self-auto text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 shadow-xs shadow-indigo-500/50" />
              Enabled
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-600" />
              Disabled
            </span>
          </div>
        </div>

        {/* ── Fully Responsive Unified Cyber Matrix with Mini Toggle Switches ── */}
        <div className="rounded-xl border border-indigo-500/20 overflow-hidden shadow-inner bg-slate-950/60">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-xs min-w-[680px]">
              <thead className="bg-slate-950/90 border-b border-indigo-500/20 font-semibold text-slate-300">
                <tr>
                  <th className="px-4 sm:px-5 py-3.5 sticky left-0 bg-[#0c102b] z-10 shadow-[2px_0_5px_rgba(0,0,0,0.4)] whitespace-nowrap min-w-[180px]">
                    Subscription Tier
                  </th>
                  {PROVIDER_COLUMNS.map((col) => {
                    const Icon = col.icon;
                    return (
                      <th key={col.key} className="px-3 py-3.5 text-center whitespace-nowrap min-w-[85px]">
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
                    <td className="px-4 sm:px-5 py-3.5 sticky left-0 bg-[#0c102b] z-10 shadow-[2px_0_5px_rgba(0,0,0,0.4)] whitespace-nowrap">
                      <div className="font-semibold text-slate-100 text-xs">{plan.planName}</div>
                      <span className={`inline-block mt-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded-md border ${getTierBadgeClass(plan.tier)}`}>
                        {plan.tier} Tier
                      </span>
                    </td>
                    {PROVIDER_COLUMNS.map((col) => {
                      const isAllowed = plan.allowedProviders[col.key] ?? false;
                      return (
                        <td key={col.key} className="px-3 py-3.5 text-center align-middle whitespace-nowrap">
                          <div className="flex items-center justify-center">
                            <button
                              type="button"
                              role="switch"
                              aria-checked={isAllowed}
                              aria-label={`Toggle ${col.label} for ${plan.planName}`}
                              onClick={() => onToggleEntitlement(plan.planId, col.key, !isAllowed)}
                              disabled={isUpdating}
                              className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                                isAllowed
                                  ? 'border-indigo-400/50 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-xs shadow-indigo-500/50'
                                  : 'border-indigo-500/20 bg-slate-800/90'
                              }`}
                              title={`Toggle ${col.label} for ${plan.planName}`}
                            >
                              <span
                                aria-hidden="true"
                                className={`pointer-events-none inline-block h-3 w-3 transform rounded-full shadow-sm transition duration-200 ease-in-out mt-[1px] ml-[1px] ${
                                  isAllowed
                                    ? 'translate-x-4 bg-white'
                                    : 'translate-x-0 bg-slate-400'
                                }`}
                              />
                            </button>
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
