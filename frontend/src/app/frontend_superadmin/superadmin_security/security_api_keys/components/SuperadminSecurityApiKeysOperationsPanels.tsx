'use client';
/** Responsibility: render the API Keys preview list only; no sibling security workflow state is accepted. */
/** Data-Flow: redacted API-key sample fixtures -> accessible read-only key preview; write actions remain disabled without an approved host contract. */
import { Ban, Eye, Key, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminSecurityOperationsPanelsProps } from '@/app/frontend_superadmin/superadmin_security/security_api_keys/types/SuperadminSecurityApiKeysOperationsPanelsComponentTypes';

export default function SuperadminSecurityApiKeysOperationsPanels({ apiKeys }: SuperadminSecurityOperationsPanelsProps) {
  const tCopy = useTranslations('SUPERADMIN_SECURITY');
  return (
    <div className="flex-1 overflow-y-auto p-6 motion-safe:animate-fade-in motion-reduce:animate-none">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-primary mb-1">{tCopy("COPY.DEVELOPER_API_KEYS")}</h2>
          <p className="text-sm text-secondary">{tCopy("COPY.MANAGE_SECRET_KEYS_USED_FOR_THIRD_PARTY_INTEGRATIONS_BIOMETRICS_SMS_PAYMENT_WEBHOOKS")}</p>
        </div>
        <button type="button" className="sa-btn-primary" disabled title={tCopy("COPY.UNAVAILABLE_NO_API_KEY_ISSUANCE_CONTRACT_IS_SUPPLIED")} data-testid="superadmin-security-security-operations-panels-unavailable-no-api-key-issuance-contract-is-supplied-4">
          <Plus size={16} aria-hidden="true" /> {tCopy("COPY.GENERATE_NEW_KEY_UNAVAILABLE")}
        </button>
      </div>

      <div className="grid gap-4">
        {apiKeys.map((key) => (
          <div key={key.id} className="p-4 bg-surface-hover border border-border rounded-xl flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-info-bg flex items-center justify-center text-info border border-border">
                <Key size={18} aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                  {key.name}
                  <span className="text-xs bg-success-bg text-success px-1.5 py-0.5 rounded uppercase">{tCopy(`COPY.${key.status}`)}</span>
                </h4>
                <div className="flex items-center gap-3 mt-1">
                  <code className="text-xs text-info font-mono bg-floating px-2 py-0.5 rounded">{key.prefix}</code>
                  <span className="text-xs text-secondary">{tCopy("COPY.LAST_USED")} {tCopy(`COPY.${key.lastUsed}`)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button type="button" disabled className="sa-btn-ghost sa-btn-ghost--sm" title={tCopy("COPY.UNAVAILABLE_NO_SECURE_SECRET_REVEAL_FLOW_IS_SUPPLIED")} data-testid={`superadmin-security-security-operations-panels-unavailable-no-secure-secret-reveal-flow-is-supplied-5-${String(key.id)}`}>
                <Eye size={14} aria-hidden="true" /> {tCopy("COPY.REVEAL_UNAVAILABLE")}
              </button>
              <button type="button" disabled className="sa-btn-ghost sa-btn-ghost--danger text-xs" title={tCopy("COPY.UNAVAILABLE_NO_API_KEY_REVOCATION_CONTRACT_IS_SUPPLIED")} data-testid={`superadmin-security-security-operations-panels-unavailable-no-api-key-revocation-contract-is-supplied-6-${String(key.id)}`}>
                <Ban size={14} aria-hidden="true" /> {tCopy("COPY.REVOKE_UNAVAILABLE")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
