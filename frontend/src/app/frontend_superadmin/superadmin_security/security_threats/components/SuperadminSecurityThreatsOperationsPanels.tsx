'use client';
/** Responsibility: render only the Security Threats leaf's reachable Audit & Threats preview panel. */
/** Data-Flow: local sample failed-login fixture -> escaped React text rendering -> explicit sample-only CSV export. */
import { Download, ShieldAlert, ShieldX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminSecurityOperationsPanelsProps } from '@/app/frontend_superadmin/superadmin_security/security_threats/types/SuperadminSecurityThreatsOperationsPanelsComponentTypes';

/** Displays sample threat records. No policy, firewall, API-key, or session mutation is performed here. */
export default function SuperadminSecurityThreatsOperationsPanels({ failedLogins, handleExportLogs }: SuperadminSecurityOperationsPanelsProps) {
  const tCopy = useTranslations('SUPERADMIN_SECURITY');
  return (
          <div className="flex-1 overflow-y-auto p-6 motion-safe:animate-fade-in motion-reduce:animate-none">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-danger mb-1 flex items-center gap-2"><ShieldAlert size={20}/> {tCopy("COPY.SUSPICIOUS_ACTIVITY_FAILED_LOGINS")}</h2>
                <p className="text-sm text-danger">{tCopy("COPY.AUTOMATED_THREAT_DETECTION_LOGS")}</p>
              </div>
              <button className="sa-btn-ghost" type="button" onClick={handleExportLogs} data-testid="superadmin-security-security-operations-panels-export-sample-logs-csv-9"><Download size={16} className="mr-1 inline"/> {tCopy("COPY.EXPORT_SAMPLE_LOGS_CSV")}</button>
            </div>
            
            <div className="grid gap-3">
              {failedLogins.map(f => (
                <div key={f.id} className="p-4 bg-danger-bg border border-border rounded-xl flex items-center justify-between relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-danger-bg"></div>
                  <div className="flex items-center gap-4 pl-2">
                    <div className="p-2 bg-danger-bg rounded-lg text-danger">
                      <ShieldX size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-danger font-mono">{f.ip}</h4>
                      <p className="text-xs text-danger mt-1">{tCopy("COPY.ATTEMPTED_EMAIL")} <span className="text-secondary">{f.user}</span></p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-danger font-bold bg-danger-bg px-2 py-0.5 rounded border border-border">{tCopy(`COPY.${f.reason}`)}</span>
                    <span className="text-xs text-secondary mt-1">{tCopy(`COPY.${f.time}`)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
  );
}
