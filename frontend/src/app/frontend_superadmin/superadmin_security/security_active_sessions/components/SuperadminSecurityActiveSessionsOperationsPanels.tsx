'use client';
/** Responsibility: Superadmin Security Operations Panels; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSecurityActiveSessionsOperationsPanels formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { Smartphone, Globe, ShieldAlert, Ban, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminSecurityOperationsPanelsProps } from '@/app/frontend_superadmin/superadmin_security/security_active_sessions/types/SuperadminSecurityActiveSessionsOperationsPanelsComponentTypes';

/**
 * Renders the `superadmin_security` view owned by `SuperadminSecurityActiveSessionsOperationsPanels`.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminSecurityActiveSessionsOperationsPanels({
  activeTab,
  sessions,
}: SuperadminSecurityOperationsPanelsProps) {
  const tCopy = useTranslations('SUPERADMIN_SECURITY');

  return (
    <>
      {activeTab === 'Active Sessions' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 motion-safe:animate-fade-in motion-reduce:animate-none space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 mb-1">{tCopy("COPY.GLOBAL_ACTIVE_SESSIONS")}</h2>
              <p className="text-xs sm:text-sm text-slate-400">{tCopy("COPY.MONITOR_REAL_TIME_LOGINS_ACROSS_THE_ENTIRE_LIBRARY_OS_PLATFORM")}</p>
            </div>
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/20 px-4 py-2 text-xs sm:text-sm font-semibold text-rose-300 opacity-60 cursor-not-allowed shadow-xs transition-all"
              title={tCopy("COPY.UNAVAILABLE_NO_SESSION_MANAGEMENT_API_CONTRACT_IS_SUPPLIED")}
              data-testid="superadmin-security-security-operations-panels-unavailable-no-session-management-api-contract-is-supplied-7"
            >
              <Ban size={15} className="text-rose-400" />
              <span>{tCopy("COPY.TERMINATE_ALL_SESSIONS_UNAVAILABLE")}</span>
            </button>
          </div>

          <div className="grid gap-3">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="group relative rounded-2xl border border-border/80 bg-card/70 p-4 sm:p-5 backdrop-blur-md transition-all duration-200 hover:border-indigo-500/30 hover:bg-card flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/15 text-sky-400 shadow-inner">
                    <Smartphone size={22} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-100 truncate flex items-center gap-2">
                      <span>{s.user}</span>
                      <span className="text-xs font-normal text-slate-400">{tCopy("COPY.VIA")}</span>
                      <span className="font-mono text-xs text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{s.ip}</span>
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
                      <span className="text-slate-300">{tCopy(`COPY.${s.device}`)}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 text-slate-400">
                        <Globe size={12} className="text-sky-400" />
                        {tCopy(`COPY.${s.location}`)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                    <Clock size={12} className="text-emerald-400" />
                    <span>{tCopy(`COPY.${s.time}`)}</span>
                  </span>
                  <button
                    type="button"
                    disabled
                    title={tCopy("COPY.UNAVAILABLE_NO_VERIFIED_SESSION_MANAGEMENT_API_CONTRACT_IS_SUPPLIED")}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 opacity-60 cursor-not-allowed transition-all"
                    data-testid={`superadmin-security-security-operations-panels-unavailable-no-verified-session-management-api-contract-is-supplied-8-${String(s.id)}`}
                  >
                    <ShieldAlert size={13} className="text-rose-400" />
                    <span>{tCopy("COPY.FORCE_LOGOUT_UNAVAILABLE")}</span>
                  </button>
                </div>
              </div>
            ))}
            {sessions.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center text-sm text-slate-400">
                {tCopy("COPY.NO_ACTIVE_SESSIONS_FOUND")}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
