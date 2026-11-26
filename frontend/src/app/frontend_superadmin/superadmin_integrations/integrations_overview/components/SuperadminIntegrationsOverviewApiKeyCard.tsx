// components/SuperadminIntegrationsOverviewApiKeyCard.tsx
// RESPONSIBILITY: Display single API key details, status badge, IP allowlist, and rotate/revoke actions.
// DATA FLOW: ApiKeyItem -> SuperadminIntegrationsOverviewApiKeyCard -> rotate/revoke callbacks.
'use client';

import { CheckCircle2, Copy, Key, Lock, RotateCcw, Trash2 } from 'lucide-react';
import React from 'react';
import type { ApiKeyItem } from '@/app/frontend_superadmin/superadmin_integrations/integrations_overview/types/superadmin_integrations_overview.types';

interface SuperadminIntegrationsOverviewApiKeyCardProps {
  apiKeyItem: ApiKeyItem;
  onRotateKey: (id: string) => void;
  onRevokeKey: (id: string) => void;
  onConfirmRevoke: (message: string) => Promise<boolean>;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
}

export const SuperadminIntegrationsOverviewApiKeyCard: React.FC<
  SuperadminIntegrationsOverviewApiKeyCardProps
> = ({
  apiKeyItem,
  onRotateKey,
  onRevokeKey,
  onConfirmRevoke,
  copiedId,
  onCopy,
}) => {
  const handleRevokeClick = async () => {
    const ok = await onConfirmRevoke(
      `Are you sure you want to permanently revoke API Key "${apiKeyItem.name}" (${apiKeyItem.prefix})? Any active daemons or clients using this key will immediately receive HTTP 401 Unauthorized.`
    );
    if (ok) {
      onRevokeKey(apiKeyItem.id);
    }
  };

  const handleRotateClick = async () => {
    const ok = await onConfirmRevoke(
      `Rotate secret for API Key "${apiKeyItem.name}"? The existing secret key will immediately be invalidated and a replacement secret will be generated.`
    );
    if (ok) {
      onRotateKey(apiKeyItem.id);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-xl border border-indigo-500/20 bg-slate-950/70 p-4 text-xs shadow-inner">
      <div className="space-y-1.5 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-100 text-xs">{apiKeyItem.name}</span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold flex items-center gap-1 border ${
              apiKeyItem.status === 'active'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
            }`}
          >
            {apiKeyItem.status === 'active' ? (
              <>
                <CheckCircle2 size={10} /> Active
              </>
            ) : (
              'Revoked'
            )}
          </span>
          <span className="text-[11px] text-slate-400">Scope: {apiKeyItem.roleScope}</span>
          <span className="text-[11px] text-slate-400 font-mono">
            Limit: {apiKeyItem.rateLimitRpm} RPM
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-purple-300">
          <Key size={12} className="text-slate-400 shrink-0" />
          <span className="font-semibold">{apiKeyItem.maskedKey}</span>
          <button
            type="button"
            onClick={() => onCopy(apiKeyItem.maskedKey, apiKeyItem.id)}
            className="text-slate-400 hover:text-slate-100 cursor-pointer transition-colors p-0.5"
            title="Copy Key Prefix"
          >
            <Copy size={11} />
          </button>
          {copiedId === apiKeyItem.id && (
            <span className="text-emerald-400 font-sans text-[10px] font-semibold">Copied!</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5 flex-wrap">
          <span>Last used: {apiKeyItem.lastUsedAt}</span>
          <span>•</span>
          <div className="flex items-center gap-1 flex-wrap">
            <Lock size={10} className="text-indigo-400" />
            <span>IP Allowlist:</span>
            {apiKeyItem.ipAllowlist.length === 0 ? (
              <span className="font-mono text-amber-300">0.0.0.0/0 (Open)</span>
            ) : (
              apiKeyItem.ipAllowlist.map((ip) => (
                <span
                  key={ip}
                  className="rounded bg-slate-900 border border-indigo-500/20 px-1.5 py-0.2 font-mono text-slate-300"
                >
                  {ip}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0">
        <button
          type="button"
          onClick={handleRotateClick}
          className="inline-flex items-center gap-1 rounded-xl border border-indigo-500/20 bg-slate-800/80 px-2.5 py-1 text-[11px] font-medium text-slate-200 hover:bg-slate-700/80 hover:text-white cursor-pointer transition-colors shadow-xs"
        >
          <RotateCcw size={11} /> Rotate Secret
        </button>
        <button
          type="button"
          onClick={handleRevokeClick}
          className="inline-flex items-center gap-1 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 px-2.5 py-1 text-[11px] font-medium hover:bg-rose-500/20 cursor-pointer transition-colors shadow-xs"
        >
          <Trash2 size={11} /> Revoke
        </button>
      </div>
    </div>
  );
};
