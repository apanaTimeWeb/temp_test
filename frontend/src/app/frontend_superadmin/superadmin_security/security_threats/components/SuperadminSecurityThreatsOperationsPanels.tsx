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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-500/20 pb-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-rose-300 mb-1 flex items-center gap-2">
            <ShieldAlert size={20} className="text-rose-400" />
            <span>{tCopy("COPY.SUSPICIOUS_ACTIVITY_FAILED_LOGINS")}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">{tCopy("COPY.AUTOMATED_THREAT_DETECTION_LOGS")}</p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-md shadow-rose-600/30 transition-all active:scale-[0.98] cursor-pointer"
          type="button"
          onClick={handleExportLogs}
          data-testid="superadmin-security-security-operations-panels-export-sample-logs-csv-9"
        >
          <Download size={15} />
          <span>{tCopy("COPY.EXPORT_SAMPLE_LOGS_CSV")}</span>
        </button>
      </div>

      <div className="grid gap-3.5">
        {failedLogins.map((f) => (
          <div
            key={f.id}
            className="group relative rounded-2xl border border-rose-500/25 bg-gradient-to-b from-[#220918]/80 to-[#100618]/95 p-4 sm:p-5 backdrop-blur-md transition-all duration-200 hover:border-rose-500/50 hover:from-[#2e0c20]/90 hover:to-[#160822]/98 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-rose-500/40 bg-rose-500/20 text-rose-400 shadow-inner">
                <ShieldX size={22} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-100 font-mono flex items-center gap-2">
                  <span className="text-slate-100 group-hover:text-rose-200 transition-colors">{f.ip}</span>
                  <span className="text-[11px] font-semibold text-rose-300 bg-rose-500/20 px-2.5 py-0.5 rounded border border-rose-500/30 shadow-xs">
                    Flagged Source
                  </span>
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  {tCopy("COPY.ATTEMPTED_EMAIL")} <span className="text-slate-100 font-semibold">{f.user}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start sm:self-auto md:self-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-300 shadow-xs">
                <AlertTriangle size={12} className="text-rose-400" />
                <span>{tCopy(`COPY.${f.reason}`)}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/50">
                <Clock size={12} className="text-slate-400" />
                <span>{tCopy(`COPY.${f.time}`)}</span>
              </span>
            </div>
          </div>
        ))}
        {failedLogins.length === 0 && (
          <div className="rounded-2xl border border-dashed border-rose-500/30 bg-[#07091a]/50 p-8 text-center text-sm text-slate-400">
            No threat incidents detected.
          </div>
        )}
      </div>
    </div>
  );
}
