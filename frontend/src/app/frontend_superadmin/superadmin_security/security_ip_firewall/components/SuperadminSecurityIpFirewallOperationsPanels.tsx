'use client';
/** Responsibility: Superadmin Security Operations Panels; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSecurityIpFirewallOperationsPanels formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { Ban, Trash2, Globe, Shield, Calendar, ShieldAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminSecurityOperationsPanelsProps } from '@/app/frontend_superadmin/superadmin_security/security_ip_firewall/types/SuperadminSecurityIpFirewallOperationsPanelsComponentTypes';

/**
 * Renders the `superadmin_security` view owned by `SuperadminSecurityIpFirewallOperationsPanels`.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminSecurityIpFirewallOperationsPanels({
  activeTab,
  newIp,
  setNewIp,
  ipRules,
}: SuperadminSecurityOperationsPanelsProps) {
  const tCopy = useTranslations('SUPERADMIN_SECURITY');

  return (
    <>
      {activeTab === 'IP Firewall' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 motion-safe:animate-fade-in motion-reduce:animate-none flex flex-col space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/80 pb-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 mb-1 flex items-center gap-2">
                <Globe size={20} className="text-rose-400" />
                <span>{tCopy("COPY.NETWORK_ACCESS_RULES")}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {tCopy("COPY.BLOCK_MALICIOUS_IPS_OR_RESTRICT_ADMIN_ACCESS_TO_SPECIFIC_OFFICE_NETWORKS")}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <input
                type="text"
                disabled
                aria-disabled="true"
                aria-label={tCopy("COPY.IP_ADDRESS_TO_BLOCK_SAMPLE_PREVIEW_ONLY")}
                placeholder={tCopy("COPY.IP_ADDRESS_E_G_192_168_1_1")}
                className="w-full sm:w-64 rounded-xl border border-indigo-500/25 bg-card/80 px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 opacity-60 cursor-not-allowed"
                value={newIp}
                onChange={(e) => setNewIp(e.target.value)}
                data-testid="superadmin-security-security-operations-panels-ip-address-to-block-sample-preview-only-1"
              />
              <button
                type="button"
                disabled
                title={tCopy("COPY.UNAVAILABLE_NO_VERIFIED_FIREWALL_API_CONTRACT_IS_SUPPLIED")}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/20 px-4 py-2 text-xs sm:text-sm font-semibold text-rose-300 opacity-60 cursor-not-allowed shadow-xs transition-all"
                data-testid="superadmin-security-security-operations-panels-unavailable-no-verified-firewall-api-contract-is-supplied-2"
              >
                <Ban size={15} />
                <span>{tCopy("COPY.BLOCK_IP")}</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/70 backdrop-blur-md overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead className="bg-slate-900/40 text-slate-400 border-b border-border/80">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">{tCopy("COPY.IP_CIDR")}</th>
                    <th className="py-3.5 px-4 font-semibold">{tCopy("COPY.RULE_TYPE")}</th>
                    <th className="py-3.5 px-4 font-semibold">{tCopy("COPY.REASON_NOTE")}</th>
                    <th className="py-3.5 px-4 font-semibold">{tCopy("COPY.DATE_ADDED")}</th>
                    <th className="py-3.5 px-4 font-semibold text-right">{tCopy("COPY.ACTION")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {ipRules.map((rule) => {
                    const isBlocked = rule.type === 'BLOCKED';
                    return (
                      <tr key={rule.id} className="transition-colors hover:bg-slate-800/30">
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-200">
                          <span className="bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
                            {rule.ip}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              isBlocked
                                ? 'border-rose-500/30 bg-rose-500/15 text-rose-300'
                                : 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${isBlocked ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                            {tCopy(isBlocked ? 'COPY.STATUS_BLOCKED' : 'COPY.STATUS_ALLOWED')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">{tCopy(`COPY.${rule.reason}`)}</td>
                        <td className="py-3.5 px-4 text-slate-400 text-xs">{rule.date}</td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            disabled
                            aria-label={tCopy("COPY.DELETE_IP_RULE_UNAVAILABLE_ARIA_LABEL", { ip: rule.ip })}
                            title={tCopy("COPY.UNAVAILABLE_NO_VERIFIED_FIREWALL_API_CONTRACT_IS_SUPPLIED")}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 opacity-60 cursor-not-allowed transition-all"
                            data-testid={`superadmin-security-security-operations-panels-delete-ip-rule-unavailable-aria-label-3-${String(rule.id)}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {ipRules.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No firewall rules configured.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
