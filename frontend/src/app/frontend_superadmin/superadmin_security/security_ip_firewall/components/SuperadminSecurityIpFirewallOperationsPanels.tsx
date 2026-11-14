'use client';
/** Responsibility: Superadmin Security Operations Panels; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSecurityIpFirewallOperationsPanels formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { Ban, Download, Eye, Key, Plus, ShieldAlert, ShieldX, Smartphone, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminSecurityOperationsPanelsProps } from '@/app/frontend_superadmin/superadmin_security/security_ip_firewall/types/SuperadminSecurityIpFirewallOperationsPanelsComponentTypes';


/**
 * Renders the `superadmin_security` view owned by `SuperadminSecurityIpFirewallOperationsPanels`.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminSecurityIpFirewallOperationsPanels({ activeTab, newIp, setNewIp, ipRules, apiKeys, sessions, failedLogins, handleAddIp, handleForceLogout, handleExportLogs, showToast }: SuperadminSecurityOperationsPanelsProps) {
  const tCopy = useTranslations('SUPERADMIN_SECURITY');
  return (
    <>
        {activeTab === 'IP Firewall' && (
          <div className="flex-1 overflow-y-auto p-6 motion-safe:animate-fade-in motion-reduce:animate-none flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-primary mb-1">{tCopy("COPY.NETWORK_ACCESS_RULES")}</h2>
                <p className="text-sm text-secondary">{tCopy("COPY.BLOCK_MALICIOUS_IPS_OR_RESTRICT_ADMIN_ACCESS_TO_SPECIFIC_OFFICE_NETWORKS")}</p>
              </div>
              <div className="flex gap-2">
                <input type="text" disabled aria-disabled="true" aria-label={tCopy("COPY.IP_ADDRESS_TO_BLOCK_SAMPLE_PREVIEW_ONLY")} placeholder={tCopy("COPY.IP_ADDRESS_E_G_192_168_1_1")} className="sa-input w-64" value={newIp} onChange={e => setNewIp(e.target.value)}  data-testid="superadmin-security-security-operations-panels-ip-address-to-block-sample-preview-only-1"/>
                <button type="button" disabled title={tCopy("COPY.UNAVAILABLE_NO_VERIFIED_FIREWALL_API_CONTRACT_IS_SUPPLIED")} className="sa-btn-primary bg-danger text-on-danger border-none hover:bg-danger hover:text-on-danger" data-testid="superadmin-security-security-operations-panels-unavailable-no-verified-firewall-api-contract-is-supplied-2"><Ban size={16} /> {tCopy("COPY.BLOCK_IP")}</button>
              </div>
            </div>

            <div className="flex-1 border border-border rounded-xl overflow-hidden bg-floating">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-hover text-secondary">
                  <tr>
                    <th className="py-3 px-4 font-semibold border-b border-border">{tCopy("COPY.IP_CIDR")}</th>
                    <th className="py-3 px-4 font-semibold border-b border-border">{tCopy("COPY.RULE_TYPE")}</th>
                    <th className="py-3 px-4 font-semibold border-b border-border">{tCopy("COPY.REASON_NOTE")}</th>
                    <th className="py-3 px-4 font-semibold border-b border-border">{tCopy("COPY.DATE_ADDED")}</th>
                    <th className="py-3 px-4 font-semibold border-b border-border">{tCopy("COPY.ACTION")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ipRules.map(rule => (
                    <tr key={rule.id} className="hover:bg-surface-hover">
                      <td className="py-3 px-4 font-mono text-primary">{rule.ip}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${rule.type === 'BLOCKED' ? 'bg-danger-bg text-danger border border-border' : 'bg-success-bg text-success border border-border'}`}>
                          {tCopy(rule.type === 'BLOCKED' ? 'COPY.STATUS_BLOCKED' : 'COPY.STATUS_ALLOWED')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-secondary">{tCopy(`COPY.${rule.reason}`)}</td>
                      <td className="py-3 px-4 text-secondary">{rule.date}</td>
                      <td className="py-3 px-4">
                        <button type="button" disabled aria-label={tCopy("COPY.DELETE_IP_RULE_UNAVAILABLE_ARIA_LABEL", { ip: rule.ip })} title={tCopy("COPY.UNAVAILABLE_NO_VERIFIED_FIREWALL_API_CONTRACT_IS_SUPPLIED")} className="text-danger hover:text-danger" data-testid={`superadmin-security-security-operations-panels-delete-ip-rule-unavailable-aria-label-3-${String(rule.id)}`}><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        

        

        

    </>
  );
}
