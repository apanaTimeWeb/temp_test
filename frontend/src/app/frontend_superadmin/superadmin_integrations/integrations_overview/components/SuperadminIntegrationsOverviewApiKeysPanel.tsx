// components/SuperadminIntegrationsOverviewApiKeysPanel.tsx
// RESPONSIBILITY: Primary container orchestrating API keys list, key generator modal, secret display modal, and rate limit form.
// DATA FLOW: ApiKeys & RateLimits -> SuperadminIntegrationsOverviewApiKeysPanel -> child components.
'use client';

import { Key, Plus } from 'lucide-react';
import React, { useState } from 'react';
import type {
  ApiKeyCreatePayload,
  ApiKeyCreatedResult,
  ApiKeyItem,
  RateLimitPolicy,
} from '@/app/frontend_superadmin/superadmin_integrations/integrations_overview/types/superadmin_integrations_overview.types';
import { SuperadminIntegrationsOverviewApiKeyCard } from '@/app/frontend_superadmin/superadmin_integrations/integrations_overview/components/SuperadminIntegrationsOverviewApiKeyCard';
import { SuperadminIntegrationsOverviewApiKeyGenerateModal } from '@/app/frontend_superadmin/superadmin_integrations/integrations_overview/components/SuperadminIntegrationsOverviewApiKeyGenerateModal';
import { SuperadminIntegrationsOverviewApiKeySecretModal } from '@/app/frontend_superadmin/superadmin_integrations/integrations_overview/components/SuperadminIntegrationsOverviewApiKeySecretModal';
import { SuperadminIntegrationsOverviewRateLimitForm } from '@/app/frontend_superadmin/superadmin_integrations/integrations_overview/components/SuperadminIntegrationsOverviewRateLimitForm';

interface SuperadminIntegrationsOverviewApiKeysPanelProps {
  apiKeys: ApiKeyItem[];
  rateLimits?: RateLimitPolicy | null;
  newKeyResult: ApiKeyCreatedResult | null;
  onClearNewKeyResult: () => void;
  onCreateKey: (payload: ApiKeyCreatePayload) => void;
  onRotateKey: (id: string) => void;
  onRevokeKey: (id: string) => void;
  onSaveRateLimits: (payload: RateLimitPolicy) => void;
  onConfirmRevoke: (message: string) => Promise<boolean>;
  isGenerating?: boolean;
  isSavingLimits?: boolean;
}

export const SuperadminIntegrationsOverviewApiKeysPanel: React.FC<
  SuperadminIntegrationsOverviewApiKeysPanelProps
> = ({
  apiKeys,
  rateLimits,
  newKeyResult,
  onClearNewKeyResult,
  onCreateKey,
  onRotateKey,
  onRevokeKey,
  onSaveRateLimits,
  onConfirmRevoke,
  isGenerating = false,
  isSavingLimits = false,
}) => {
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6" data-testid="superadmin-apikeys-panel">
      {/* ── Section 1: Active API Keys ── */}
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0c102b]/95 via-[#090d24]/95 to-[#050714]/95 p-5 space-y-4 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-500/20">
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Key size={16} className="text-purple-400" />
              Machine & Platform API Keys
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Keys are securely stored as hashed credentials. Secret keys can be rotated or revoked with immediate effect.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsGenerateModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-3.5 py-1.5 text-xs font-semibold text-white cursor-pointer transition-opacity min-w-32 justify-center shadow-md shadow-indigo-500/25"
          >
            <Plus size={14} /> Generate API Key
          </button>
        </div>

        <div className="space-y-3">
          {apiKeys.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No API keys generated yet.
            </p>
          ) : (
            apiKeys.map((k) => (
              <SuperadminIntegrationsOverviewApiKeyCard
                key={k.id}
                apiKeyItem={k}
                onRotateKey={onRotateKey}
                onRevokeKey={onRevokeKey}
                onConfirmRevoke={onConfirmRevoke}
                copiedId={copiedId}
                onCopy={handleCopy}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Section 2: Rate Limits & IP Firewall ── */}
      <SuperadminIntegrationsOverviewRateLimitForm
        rateLimits={rateLimits}
        onSaveRateLimits={onSaveRateLimits}
        isSavingLimits={isSavingLimits}
      />

      {/* ── Modals ── */}
      <SuperadminIntegrationsOverviewApiKeyGenerateModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onCreateKey={onCreateKey}
        isGenerating={isGenerating}
      />

      <SuperadminIntegrationsOverviewApiKeySecretModal
        newKeyResult={newKeyResult}
        onClose={onClearNewKeyResult}
      />
    </div>
  );
};
