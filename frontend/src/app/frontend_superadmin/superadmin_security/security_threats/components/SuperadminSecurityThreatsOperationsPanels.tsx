'use client';
/** Responsibility: render only the Security Threats leaf's reachable Audit & Threats preview panel. */
/** Data-Flow: local sample failed-login fixture -> escaped React text rendering -> explicit sample-only CSV export. */
import { Download, ShieldAlert, ShieldX, Clock, AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminSecurityOperationsPanelsProps } from '@/app/frontend_superadmin/superadmin_security/security_threats/types/SuperadminSecurityThreatsOperationsPanelsComponentTypes';

/** Displays sample threat records. No policy, firewall, API-key, or session mutation is performed here. */
export default function SuperadminSecurityThreatsOperationsPanels({ failedLogins, handleExportLogs }: SuperadminSecurityOperationsPanelsProps) {
  const tCopy = useTranslations('SUPERADMIN_SECURITY');

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 motion-safe:animate-fade-in motion-reduce:animate-none space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-rose-300 mb-1 flex items-center gap-2">
            <ShieldAlert size={20} className="text-rose-400" />
            <span>{tCopy("COPY.SUSPICIOUS_ACTIVITY_FAILED_LOGINS")}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">{tCopy("COPY.AUTOMATED_THREAT_DETECTION_LOGS")}</p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs sm:text-sm font-semibold text-indigo-300 shadow-xs transition-all hover:bg-indigo-500/20 active:scale-95 cursor-pointer"
          type="button"
          onClick={handleExportLogs}
          data-testid="superadmin-security-security-operations-panels-export-sample-logs-csv-9"
        >
          <Download size={15} className="text-indigo-400" />
          <span>{tCopy("COPY.EXPORT_SAMPLE_LOGS_CSV")}</span>
        </button>
      </div>

      <div className="grid gap-3">
        {failedLogins.map((f) => (
          <div
            key={f.id}
            className="group relative rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 sm:p-5 backdrop-blur-md transition-all duration-200 hover:border-rose-500/50 hover:bg-rose-500/15 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-rose-500/40 bg-rose-500/20 text-rose-400 shadow-inner">
                <ShieldX size={22} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-100 font-mono flex items-center gap-2">
                  <span>{f.ip}</span>
                  <span className="text-xs font-normal text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">
                    Flagged Source
                  </span>
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  {tCopy("COPY.ATTEMPTED_EMAIL")} <span className="text-slate-100 font-semibold">{f.user}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 shrink-0 self-end md:self-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-300">
                <AlertTriangle size={12} className="text-rose-400" />
                <span>{tCopy(`COPY.${f.reason}`)}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                <Clock size={12} className="text-slate-400" />
                <span>{tCopy(`COPY.${f.time}`)}</span>
              </span>
            </div>
          </div>
        ))}
        {failedLogins.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center text-sm text-slate-400">
            No threat incidents detected.
          </div>
        )}
      </div>
    </div>
  );
}
