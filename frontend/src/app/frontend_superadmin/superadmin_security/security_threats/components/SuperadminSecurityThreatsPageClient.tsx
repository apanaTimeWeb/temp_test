'use client';
import SuperadminSecurityAuditThreatsEmptyState from '@/app/frontend_superadmin/superadmin_security/security_threats/components/SuperadminSecurityThreatsEmptyState';
import { toast } from 'sonner';
/** Responsibility: renders the Security Threats leaf and its Audit & Threats preview only. */
/** Data-Flow: canonical route -> SuperadminSecurityThreatsPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { SUPERADMIN_SECURITY_FAILED_LOGINS } from '@/app/frontend_superadmin/superadmin_security/security_threats/mocks/fixtures/SuperadminSecurityThreatsPreviewMockFixtures';
import SuperadminSecurityThreatsOperationsPanels from '@/app/frontend_superadmin/superadmin_security/security_threats/components/SuperadminSecurityThreatsOperationsPanels';
import { ShieldAlert, AlertCircle, ShieldX, Activity, Flame, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_SECURITY_OVERVIEW_PAGE_CLIENT_FIELDS } from '@/app/frontend_superadmin/superadmin_security/security_threats/constants/SuperadminSecurityThreatsStaticConstants';

/**
 * Renders the `superadmin_security` view owned by `SuperadminSecurityThreatsPageClient`.
 * Owns sample threat rows and preview CSV export.
 */
export default function SuperadminSecurityThreatsPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SECURITY');
  const securityRows: (typeof SUPERADMIN_SECURITY_FAILED_LOGINS)[number][] = [...SUPERADMIN_SECURITY_FAILED_LOGINS];
  const activeTab = 'Audit & Threats';
  const showToast = (msg: string) => {
    toast.message(msg, { id: 'superadmin:superadmin_security:SuperadminSecurityThreatsPageClient:feedback' });
  };

  const handleExportLogs = () => {
    const cell = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const csv = [
      [tCopy('COPY.SAMPLE_SECURITY_LOG_CLASSIFICATION'), ...Array(SUPERADMIN_SECURITY_OVERVIEW_PAGE_CLIENT_FIELDS.length - 1).fill('')].map(cell).join(','),
      SUPERADMIN_SECURITY_OVERVIEW_PAGE_CLIENT_FIELDS.map(cell).join(','),
      ...SUPERADMIN_SECURITY_FAILED_LOGINS.map((row) => SUPERADMIN_SECURITY_OVERVIEW_PAGE_CLIENT_FIELDS.map((field) => cell(row[field])).join(',')),
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'superadmin_sample_security_logs_preview.csv';
    anchor.click();
    URL.revokeObjectURL(url);
    showToast(tCopy("COPY.DOWNLOADED_A_SAMPLE_SECURITY_LOG_PREVIEW_ONLY_NO_LIVE_AUDIT_DATA_WAS_EXPORTED"));
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 pb-12">
      {securityRows.length === 0 && <SuperadminSecurityAuditThreatsEmptyState filtered />}

      {/* Notice Callout */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200 backdrop-blur-md" role="status">
        <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-400" aria-hidden="true" />
        <p className="min-w-0 flex-1 leading-relaxed">
          {tCopy("COPY.SECURITY_POLICIES_SESSIONS_API_KEY_PREFIXES_FIREWALL_RULES_AND_THREAT_ROWS_ARE_SAMPLE_PREVIEW_DATA_THIS_SCREEN_DOES_NOT_ENFORCE_POLICIES_OR_TERMINATE_SESSIONS_WITHOUT_VERIFIED_HOST_SECURITY_API_CONTRACTS")}
        </p>
      </div>

      {/* Hero Header */}
      <div className="rounded-2xl border border-rose-500/25 bg-gradient-to-br from-rose-950/70 via-[#160714] to-[#060810] p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-400 shadow-inner">
                <ShieldX size={24} aria-hidden="true" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                Threat Radar & Security Anomalies
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-ping" />
                Live Incident Detection
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Automated real-time anomaly detection, zero-day threat telemetry, and edge-intercepted authentication anomalies across all cluster ingress points.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-300">
              <AlertCircle size={15} className="text-rose-400" aria-hidden="true" />
              <span>{tCopy("COPY.CRITICAL_ZONE_SUPERADMIN_ONLY")}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-2 text-xs font-bold text-indigo-300">
              <ShieldAlert size={15} className="text-indigo-400" aria-hidden="true" />
              <span>{SUPERADMIN_SECURITY_FAILED_LOGINS.length} Incidents Flagged</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-rose-500/20 bg-gradient-to-b from-[#220a14]/80 to-[#0a0d24]/95 p-5 shadow-xl backdrop-blur-md hover:border-rose-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Flagged Incidents</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-400 shadow-inner">
              <ShieldAlert size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-400 tabular-nums">{SUPERADMIN_SECURITY_FAILED_LOGINS.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Suspicious authentication alerts</div>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-[#241306]/80 to-[#0a0d24]/95 p-5 shadow-xl backdrop-blur-md hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Brute-Force Detections</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400 shadow-inner">
              <Flame size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-400 tabular-nums">100%</div>
          <div className="text-[11px] text-slate-400 mt-1">Rate-limited & quarantined</div>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-[#06201a]/80 to-[#0a0d24]/95 p-5 shadow-xl backdrop-blur-md hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">WAF Edge Filtering</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shadow-inner">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 tabular-nums">Active</div>
          <div className="text-[11px] text-slate-400 mt-1">Zero malicious bypass</div>
        </div>

        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-b from-[#1b0d2d]/80 to-[#0a0d24]/95 p-5 shadow-xl backdrop-blur-md hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monitored Clusters</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/15 text-purple-400 shadow-inner">
              <Activity size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-purple-400 tabular-nums">All Edges</div>
          <div className="text-[11px] text-slate-400 mt-1">Real-time syslog ingestion</div>
        </div>
      </div>

      {/* Content */}
      <div
        className="rounded-2xl border border-rose-500/20 bg-gradient-to-b from-[#140816]/90 via-[#0c0618]/95 to-[#060814] shadow-2xl overflow-hidden backdrop-blur-xl min-h-[420px] flex flex-col"
        aria-label="Threat Radar and Anomalies"
        tabIndex={0}
      >
        <SuperadminSecurityThreatsOperationsPanels failedLogins={SUPERADMIN_SECURITY_FAILED_LOGINS} handleExportLogs={handleExportLogs} />
      </div>
    </div>
  );
}
