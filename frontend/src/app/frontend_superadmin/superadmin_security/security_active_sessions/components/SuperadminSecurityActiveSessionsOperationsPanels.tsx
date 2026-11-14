'use client';
/** Responsibility: Superadmin Security Operations Panels; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSecurityActiveSessionsOperationsPanels formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { Ban, Download, Eye, Key, Plus, ShieldAlert, ShieldX, Smartphone, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminSecurityOperationsPanelsProps } from '@/app/frontend_superadmin/superadmin_security/security_active_sessions/types/SuperadminSecurityActiveSessionsOperationsPanelsComponentTypes';


/**
 * Renders the `superadmin_security` view owned by `SuperadminSecurityActiveSessionsOperationsPanels`.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminSecurityActiveSessionsOperationsPanels({ activeTab, newIp, setNewIp, ipRules, apiKeys, sessions, failedLogins, handleAddIp, handleForceLogout, handleExportLogs, showToast }: SuperadminSecurityOperationsPanelsProps) {
  const tCopy = useTranslations('SUPERADMIN_SECURITY');
  return (
    <>
        

        

        {activeTab === 'Active Sessions' && (
          <div className="flex-1 overflow-y-auto p-6 motion-safe:animate-fade-in motion-reduce:animate-none">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-primary mb-1">{tCopy("COPY.GLOBAL_ACTIVE_SESSIONS")}</h2>
                <p className="text-sm text-secondary">{tCopy("COPY.MONITOR_REAL_TIME_LOGINS_ACROSS_THE_ENTIRE_LIBRARY_OS_PLATFORM")}</p>
              </div>
              <button type="button" disabled className="sa-btn-secondary opacity-60 cursor-not-allowed" title={tCopy("COPY.UNAVAILABLE_NO_SESSION_MANAGEMENT_API_CONTRACT_IS_SUPPLIED")} data-testid="superadmin-security-security-operations-panels-unavailable-no-session-management-api-contract-is-supplied-7">{tCopy("COPY.TERMINATE_ALL_SESSIONS_UNAVAILABLE")}</button>
            </div>
            
            <div className="grid gap-3">
              {sessions.map(s => (
                <div key={s.id} className="p-4 bg-surface-hover border border-border rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Smartphone className="text-info" size={24} />
                    <div>
                      <h4 className="text-sm font-bold text-primary">{s.user} <span className="text-disabled font-normal">{tCopy("COPY.VIA")}</span> {s.ip}</h4>
                      <p className="text-xs text-secondary mt-1">{tCopy(`COPY.${s.device}`)} • {tCopy(`COPY.${s.location}`)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-success font-bold bg-success-bg px-2 py-1 rounded">{tCopy(`COPY.${s.time}`)}</span>
                    <button type="button" disabled title={tCopy("COPY.UNAVAILABLE_NO_VERIFIED_SESSION_MANAGEMENT_API_CONTRACT_IS_SUPPLIED")} className="sa-btn-ghost sa-btn-ghost--danger text-xs px-3" data-testid={`superadmin-security-security-operations-panels-unavailable-no-verified-session-management-api-contract-is-supplied-8-${String(s.id)}`}>{tCopy("COPY.FORCE_LOGOUT_UNAVAILABLE")}</button>
                  </div>
                </div>
              ))}
              {sessions.length === 0 && <p className="text-secondary text-sm">{tCopy("COPY.NO_ACTIVE_SESSIONS_FOUND")}</p>}
            </div>
          </div>
        )}

        

    </>
  );
}
