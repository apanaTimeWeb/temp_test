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
      className="group relative flex flex-col justify-between rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0c102b]/95 via-[#090d24]/95 to-[#050714]/95 p-5 shadow-xl backdrop-blur-md transition-all hover:border-indigo-500/40 hover:shadow-indigo-500/10"
      data-testid={`gateway-card-${gateway.id}`}
    >
      <div className="space-y-3.5">
        {/* Header: Icon, Name, Category, Environment */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-inner">
              <IconComponent size={20} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 leading-snug tracking-tight">
                {gateway.name}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-indigo-500/20">
                  {gateway.environment}
                </span>
                <span>•</span>
                <span className="capitalize">{gateway.category}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Clock size={10} /> {gateway.lastPing}
                </span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div>
            {gateway.status === 'connected' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                <CheckCircle2 size={12} /> Live
              </span>
            )}
            {gateway.status === 'test_mode' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300">
                Sandbox
              </span>
            )}
            {gateway.status === 'disconnected' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-[11px] font-semibold text-slate-400">
                Offline
              </span>
            )}
          </div>
        </div>

        {/* Credentials preview summary */}
        <div className="rounded-xl border border-indigo-500/20 bg-slate-950/80 p-3 text-xs font-mono space-y-1 shadow-inner">
          {Object.entries(gateway.credentialsMasked).map(([k, val]) => (
            <div key={k} className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-sans capitalize">{k}:</span>
              <span className="text-purple-300 tracking-wider font-semibold">{val}</span>
            </div>
          ))}
        </div>

        {/* Notes */}
        {gateway.notes && (
          <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
            {gateway.notes}
          </p>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-4 pt-3.5 border-t border-indigo-500/20 flex items-center justify-between gap-2">
        {/* Active Toggle Switch */}
        <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-200">
          <input
            type="checkbox"
            checked={gateway.isEnabled}
            disabled={isToggling}
            onChange={() => onToggle(gateway.id, gateway.isEnabled)}
            className="sr-only peer"
          />
          <div className="relative w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-indigo-500 peer-checked:to-purple-600" />
          <span className="text-[11px] text-slate-400 select-none">
            {gateway.isEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </label>

        {/* Action Buttons: Test Ping & Configure */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onTestPing(gateway.id)}
            disabled={isPinging || !gateway.isEnabled}
            className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-500/20 bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700/80 hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-20 justify-center shadow-xs"
            title="Send test ping request to verify provider connection"
          >
            {isPinging ? <Loader2 size={12} className="animate-spin text-indigo-400" /> : <Activity size={12} />}
            <span>Ping</span>
          </button>

          <button
            type="button"
            onClick={() => onConfigure(gateway)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-3 py-1.5 text-xs font-semibold text-white cursor-pointer transition-opacity min-w-24 justify-center shadow-md shadow-indigo-500/25"
          >
            <Settings size={13} />
            <span>Configure</span>
          </button>
        </div>
      </div>
    </div>
  );
};
