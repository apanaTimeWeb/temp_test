// components/SuperadminIntegrationsOverviewApiKeyCard.tsx
// RESPONSIBILITY: Display single API key details, status badge, IP allowlist, and rotate/revoke actions.
// DATA FLOW: ApiKeyItem -> SuperadminIntegrationsOverviewApiKeyCard -> rotate/revoke callbacks.
'use client';

import { CheckCircle2, Copy, Key, Lock, RotateCcw, Trash2 } from 'lucide-react';
import React from 'react';
import type { ApiKeyItem } from '../types/superadmin_integrations_overview.types';

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
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/20 p-4 text-xs">
      <div className="space-y-1.5 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-foreground text-xs">{apiKeyItem.name}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold flex items-center gap-1 ${
              apiKeyItem.status === 'active'
                ? 'bg-success-bg text-success-text'
                : 'bg-danger-bg text-danger-text'
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
          <span className="text-[11px] text-muted-foreground">Scope: {apiKeyItem.roleScope}</span>
          <span className="text-[11px] text-muted-foreground font-mono">
            Limit: {apiKeyItem.rateLimitRpm} RPM
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-purple-400">
          <Key size={12} className="text-muted-foreground" />
          <span>{apiKeyItem.maskedKey}</span>
          <button
            type="button"
            onClick={() => onCopy(apiKeyItem.maskedKey, apiKeyItem.id)}
            className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            title="Copy Key Prefix"
          >
            <Copy size={11} />
          </button>
          {copiedId === apiKeyItem.id && (
            <span className="text-success-text font-sans text-[10px]">Copied!</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-[10px] text-muted-foreground pt-0.5">
          <span>Last used: {apiKeyItem.lastUsedAt}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Lock size={10} />
            <span>IP Allowlist:</span>
            {apiKeyItem.ipAllowlist.length === 0 ? (
              <span className="font-mono text-warning-text">0.0.0.0/0 (Open)</span>
            ) : (
              apiKeyItem.ipAllowlist.map((ip) => (
                <span
                  key={ip}
                  className="rounded bg-muted px-1.5 py-0.2 font-mono text-foreground"
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
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
        >
          <RotateCcw size={11} /> Rotate Secret
        </button>
        <button
          type="button"
          onClick={handleRevokeClick}
          className="inline-flex items-center gap-1 rounded-lg border border-danger/30 text-danger-text px-2.5 py-1 text-[11px] font-medium hover:bg-danger/10 cursor-pointer transition-colors"
        >
          <Trash2 size={11} /> Revoke
        </button>
      </div>
    </div>
  );
};
