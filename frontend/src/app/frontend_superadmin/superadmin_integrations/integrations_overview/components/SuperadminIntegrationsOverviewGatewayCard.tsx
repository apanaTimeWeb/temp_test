// components/SuperadminIntegrationsOverviewGatewayCard.tsx
// RESPONSIBILITY: Render a single provider card with status, toggle, ping test, and config trigger.
// DATA FLOW: GatewayItem -> SuperadminIntegrationsOverviewGatewayCard -> mutation triggers.
'use client';

import {
  Activity,
  CheckCircle2,
  Clock,
  CreditCard,
  HardDrive,
  KeyRound,
  Loader2,
  MessageSquare,
  QrCode,
  Radio,
  Settings,
  ShieldAlert,
} from 'lucide-react';
import React from 'react';
import type { IntegrationGatewayItem } from '../types/superadmin_integrations_overview.types';

interface SuperadminIntegrationsOverviewGatewayCardProps {
  gateway: IntegrationGatewayItem;
  onConfigure: (gw: IntegrationGatewayItem) => void;
  onToggle: (id: string, currentEnabled: boolean) => void;
  onTestPing: (id: string) => void;
  isToggling?: boolean;
  isPinging?: boolean;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  payment: CreditCard,
  messaging: MessageSquare,
  email: KeyRound,
  storage: HardDrive,
  hardware: QrCode,
  biometric: Radio,
};

export const SuperadminIntegrationsOverviewGatewayCard: React.FC<
  SuperadminIntegrationsOverviewGatewayCardProps
> = ({ gateway, onConfigure, onToggle, onTestPing, isToggling = false, isPinging = false }) => {
  const IconComponent = CATEGORY_ICONS[gateway.category] || Activity;

  return (
    <div
      className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all hover:border-purple-400/40 hover:shadow-card"
      data-testid={`gateway-card-${gateway.id}`}
    >
      <div className="space-y-3.5">
        {/* Header: Icon, Name, Category, Environment */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-bg text-purple-text shadow-xs">
              <IconComponent size={20} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground leading-snug tracking-tight">
                {gateway.name}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="font-semibold uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded-md bg-muted/70 text-foreground">
                  {gateway.environment}
                </span>
                <span>•</span>
                <span className="capitalize">{gateway.category}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-[10px]">
                  <Clock size={10} /> {gateway.lastPing}
                </span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div>
            {gateway.status === 'connected' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-success-bg px-2.5 py-0.5 text-[11px] font-semibold text-success-text">
                <CheckCircle2 size={12} /> Live
              </span>
            )}
            {gateway.status === 'test_mode' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-warning-bg px-2.5 py-0.5 text-[11px] font-semibold text-warning-text">
                Sandbox
              </span>
            )}
            {gateway.status === 'disconnected' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                Offline
              </span>
            )}
          </div>
        </div>

        {/* Credentials preview summary */}
        <div className="rounded-xl border border-border/60 bg-muted/30 p-2.5 text-xs font-mono space-y-1">
          {Object.entries(gateway.credentialsMasked).map(([k, val]) => (
            <div key={k} className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground font-sans capitalize">{k}:</span>
              <span className="text-foreground tracking-wider">{val}</span>
            </div>
          ))}
        </div>

        {/* Notes */}
        {gateway.notes && (
          <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
            {gateway.notes}
          </p>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-4 pt-3.5 border-t border-border/70 flex items-center justify-between gap-2">
        {/* Active Toggle Switch */}
        <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground">
          <input
            type="checkbox"
            checked={gateway.isEnabled}
            disabled={isToggling}
            onChange={() => onToggle(gateway.id, gateway.isEnabled)}
            className="sr-only peer"
          />
          <div className="relative w-8 h-4 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-600" />
          <span className="text-[11px] text-muted-foreground select-none">
            {gateway.isEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </label>

        {/* Action Buttons: Test Ping & Configure */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onTestPing(gateway.id)}
            disabled={isPinging || !gateway.isEnabled}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-20 justify-center"
            title="Send test ping request to verify provider connection"
          >
            {isPinging ? <Loader2 size={12} className="animate-spin" /> : <Activity size={12} />}
            <span>Ping</span>
          </button>

          <button
            type="button"
            onClick={() => onConfigure(gateway)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-on-primary hover:opacity-90 cursor-pointer transition-opacity min-w-24 justify-center shadow-xs"
          >
            <Settings size={13} />
            <span>Configure</span>
          </button>
        </div>
      </div>
    </div>
  );
};
