'use client';
/** Responsibility: render the API Keys preview list only; no sibling security workflow state is accepted. */
/** Data-Flow: redacted API-key sample fixtures -> accessible read-only key preview; write actions remain disabled without an approved host contract. */
import { Ban, Eye, Key, Plus, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminSecurityOperationsPanelsProps } from '@/app/frontend_superadmin/superadmin_security/security_api_keys/types/SuperadminSecurityApiKeysOperationsPanelsComponentTypes';

export default function SuperadminSecurityApiKeysOperationsPanels({ apiKeys }: SuperadminSecurityOperationsPanelsProps) {
  const tCopy = useTranslations('SUPERADMIN_SECURITY');

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 motion-safe:animate-fade-in motion-reduce:animate-none space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-100 mb-1 flex items-center gap-2">
            <Key size={20} className="text-indigo-400" />
            <span>{tCopy("COPY.DEVELOPER_API_KEYS")}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {tCopy("COPY.MANAGE_SECRET_KEYS_USED_FOR_THIRD_PARTY_INTEGRATIONS_BIOMETRICS_SMS_PAYMENT_WEBHOOKS")}
          </p>
        </div>
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-500/25 opacity-60 cursor-not-allowed"
          title={tCopy("COPY.UNAVAILABLE_NO_API_KEY_ISSUANCE_CONTRACT_IS_SUPPLIED")}
          data-testid="superadmin-security-security-operations-panels-unavailable-no-api-key-issuance-contract-is-supplied-4"
        >
          <Plus size={16} aria-hidden="true" />
          <span>{tCopy("COPY.GENERATE_NEW_KEY_UNAVAILABLE")}</span>
        </button>
      </div>

      <div className="grid gap-3">
        {apiKeys.map((key) => {
          const isActive = key.status === 'ACTIVE';
          return (
            <div
              key={key.id}
              className="group relative rounded-2xl border border-border/80 bg-card/70 p-4 sm:p-5 backdrop-blur-md transition-all duration-200 hover:border-indigo-500/30 hover:bg-card flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shadow-inner">
                  <Key size={20} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-100 flex flex-wrap items-center gap-2">
                    <span>{key.name}</span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                        isActive
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          : 'border-slate-700 bg-slate-800 text-slate-400'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                      {tCopy(`COPY.${key.status}`)}
                    </span>
                  </h4>
                  <div className="flex flex-wrap items-center gap-2.5 mt-1 text-xs">
                    <code className="text-xs text-indigo-300 font-mono bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
                      {key.prefix}
                    </code>
                    <span className="text-slate-400">
                      {tCopy("COPY.LAST_USED")} <span className="text-slate-300">{tCopy(`COPY.${key.lastUsed}`)}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card/80 px-3 py-1.5 text-xs font-semibold text-slate-400 opacity-60 cursor-not-allowed transition-all"
                  title={tCopy("COPY.UNAVAILABLE_NO_SECURE_SECRET_REVEAL_FLOW_IS_SUPPLIED")}
                  data-testid={`superadmin-security-security-operations-panels-unavailable-no-secure-secret-reveal-flow-is-supplied-5-${String(key.id)}`}
                >
                  <Eye size={13} aria-hidden="true" />
                  <span>{tCopy("COPY.REVEAL_UNAVAILABLE")}</span>
                </button>
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 opacity-60 cursor-not-allowed transition-all"
                  title={tCopy("COPY.UNAVAILABLE_NO_API_KEY_REVOCATION_CONTRACT_IS_SUPPLIED")}
                  data-testid={`superadmin-security-security-operations-panels-unavailable-no-api-key-revocation-contract-is-supplied-6-${String(key.id)}`}
                >
                  <Ban size={13} aria-hidden="true" />
                  <span>{tCopy("COPY.REVOKE_UNAVAILABLE")}</span>
                </button>
              </div>
            </div>
          );
        })}
        {apiKeys.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center text-sm text-slate-400">
            No API keys found.
          </div>
        )}
      </div>
    </div>
  );
}
