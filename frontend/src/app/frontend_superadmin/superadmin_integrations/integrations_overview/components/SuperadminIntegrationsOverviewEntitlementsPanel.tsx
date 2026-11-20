// components/SuperadminIntegrationsOverviewEntitlementsPanel.tsx
// RESPONSIBILITY: Matrix allowing SuperAdmin to enable or disable integrations per plan tier.
// DATA FLOW: PlanEntitlements array -> SuperadminIntegrationsOverviewEntitlementsPanel -> onToggle.
'use client';

import { Check, Loader2, ShieldCheck, X } from 'lucide-react';
import React from 'react';
import type { PlanEntitlementItem } from '../types/superadmin_integrations_overview.types';

interface SuperadminIntegrationsOverviewEntitlementsPanelProps {
  entitlements: PlanEntitlementItem[];
  onToggleEntitlement: (planId: string, providerKey: string, enabled: boolean) => void;
  isUpdating?: boolean;
}

const PROVIDER_COLUMNS = [
  { key: 'razorpay', label: 'Razorpay' },
  { key: 'stripe', label: 'Stripe' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'msg91', label: 'SMS Gateway' },
  { key: 'smtp', label: 'Custom SMTP' },
  { key: 's3', label: 'Cloud S3' },
  { key: 'barcode', label: 'Barcode/QR' },
  { key: 'biometric', label: 'Biometrics' },
] as const;

export const SuperadminIntegrationsOverviewEntitlementsPanel: React.FC<
  SuperadminIntegrationsOverviewEntitlementsPanelProps
> = ({ entitlements, onToggleEntitlement, isUpdating = false }) => {
  return (
    <div className="space-y-4" data-testid="superadmin-entitlements-panel">
      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-border/80">
          <div>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <ShieldCheck size={16} className="text-purple-400" />
              Integration Feature Entitlements per Plan Tier
            </h2>
            <p className="text-xs text-muted-foreground">
              Define which third-party gateways and hardware capabilities are accessible to each subscription tier.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border/70 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border/70 font-semibold text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Subscription Tier</th>
                  {PROVIDER_COLUMNS.map((col) => (
                    <th key={col.key} className="px-3 py-3 text-center">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {entitlements.map((plan) => (
                  <tr key={plan.planId} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-foreground text-xs">{plan.planName}</div>
                      <span className="text-[10px] text-muted-foreground uppercase font-mono">{plan.tier} Tier</span>
                    </td>
                    {PROVIDER_COLUMNS.map((col) => {
                      const isAllowed = plan.allowedProviders[col.key] ?? false;
                      return (
                        <td key={col.key} className="px-3 py-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => onToggleEntitlement(plan.planId, col.key, !isAllowed)}
                            disabled={isUpdating}
                            className={`inline-flex h-6 w-6 items-center justify-center rounded-lg transition-colors cursor-pointer ${
                              isAllowed
                                ? 'bg-success-bg text-success-text hover:bg-success-bg/80'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                            title={`Toggle ${col.label} for ${plan.planName}`}
                          >
                            {isAllowed ? <Check size={13} strokeWidth={2.5} /> : <X size={13} strokeWidth={2} />}
                          </button>
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
