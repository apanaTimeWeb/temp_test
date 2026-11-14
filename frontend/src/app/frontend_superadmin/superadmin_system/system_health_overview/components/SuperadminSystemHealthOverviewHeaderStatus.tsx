/** Responsibility: Superadmin System Health Header Status; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSystemHealthOverviewHeaderStatus formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { Activity, RefreshCw, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * Performs the superadmin system health overview header status operation within system health overview; inputs and outputs follow the declared TypeScript contract.
 */
export default function SuperadminSystemHealthOverviewHeaderStatus() {
  const t = useTranslations('SUPERADMIN_SYSTEM_HEALTH');
  return (
    <>
      <p className="sa-preview-notice" role="status">{t("COPY.EVERY_HEALTH_METRIC_ON_THIS_PAGE_IS_SAMPLE_DATA_REFRESH_AND_LIVE_TELEMETRY_CHECKS_ARE_UNAVAILABLE_WITHOUT_THE_HOST_MONITORING_INTEGRATION")}</p>
      <header className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb"><span>{t("COPY.LIBRARY_OS")}</span><span aria-hidden="true">/</span><span>{t("COPY.SUPER_ADMIN")}</span><span aria-hidden="true">/</span><span>{t("COPY.SYSTEM_HEALTH")}</span></div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title flex items-center gap-3"><Activity className="text-success drop-shadow-none" size={28} aria-hidden="true" /> {t("COPY.SYSTEM_HEALTH_TELEMETRY")}</h1>
          <button type="button" className="sa-btn-secondary" disabled title={t("COPY.LIVE_TELEMETRY_INTEGRATION_IS_NOT_INCLUDED_IN_THIS_SOURCE_ARCHIVE")} data-testid="superadmin-system-health-system-health-header-status-live-telemetry-integration-is-not-included-in-this-source-archive-1"><RefreshCw size={16} className="text-secondary" aria-hidden="true" /> {t("COPY.LIVE_TELEMETRY_UNAVAILABLE")}</button>
        </div>
      </header>
      <section className="bg-success-bg border border-border rounded-2xl p-6 mb-8 flex items-center justify-between relative overflow-hidden group" aria-labelledby="superadmin-system-health-status-title">
        <div className="absolute top-0 right-0 w-64 h-64 bg-success-bg rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" aria-hidden="true" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-full bg-success-bg flex items-center justify-center border border-border"><ShieldCheck size={32} className="text-success" aria-hidden="true" /></div>
          <div><h2 id="superadmin-system-health-status-title" className="text-2xl font-bold text-success">{t("COPY.SAMPLE_TELEMETRY_NOT_CONNECTED")}</h2><p className="text-sm text-success mt-1">{t("COPY.ILLUSTRATIVE_VALUES_ONLY_NO_LIVE_HEALTH_UPTIME_OR_THIRD_PARTY_API_SOURCE_IS_CONNECTED_IN_THIS_ARCHIVE")}</p></div>
        </div>
        <div className="text-right relative z-10"><p className="text-sm font-semibold text-secondary uppercase tracking-wider mb-1">{t("COPY.GLOBAL_UPTIME_30_DAYS")}</p><div className="text-4xl font-extrabold text-primary tracking-tight">—</div></div>
      </section>
    </>
  );
}
