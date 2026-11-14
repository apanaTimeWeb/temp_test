/** Responsibility: Superadmin Support Tickets Kpi Cards; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSupportTicketsOverviewKpiCards formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { Clock, Flag, MessageSquare } from 'lucide-react';
import type { SuperadminSupportTicketsKpiCardsProps } from '@/app/frontend_superadmin/superadmin_support/support_tickets/types/SuperadminSupportTicketsOverviewTypes';
import { useTranslations } from 'next-intl';

/**
 * Performs the superadmin support tickets overview kpi cards operation within support tickets; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSupportTicketsKpiCardsProps.
 */
export default function SuperadminSupportTicketsOverviewKpiCards({ openCount, slaBreachCount, avgResponse }: SuperadminSupportTicketsKpiCardsProps) {
  const t = useTranslations('SUPERADMIN_SUPPORT_TICKETS');
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" aria-label={t("COPY.SAMPLE_SUPPORT_TICKET_METRICS")}>
      <div className="sa-card relative overflow-hidden group">
        <div className="absolute inset-0 bg-danger-bg opacity-0 group-hover:opacity-100 motion-safe:transition-opacity motion-reduce:transition-none" />
        <div className="flex justify-between items-start relative z-10">
          <div><p className="text-sm font-medium text-secondary mb-1">{t("COPY.SAMPLE_OPEN_TICKETS")}</p><h3 className="text-3xl font-bold text-primary">{openCount}</h3></div>
          <div className="p-3 bg-surface-hover rounded-xl border border-border"><MessageSquare size={20} className="text-danger" aria-hidden="true" /></div>
        </div>
      </div>
      <div className="sa-card relative overflow-hidden group">
        <div className="absolute inset-0 bg-warning-bg opacity-0 group-hover:opacity-100 motion-safe:transition-opacity motion-reduce:transition-none" />
        <div className="flex justify-between items-start relative z-10">
          <div><p className="text-sm font-medium text-secondary mb-1">{t("COPY.SAMPLE_SLA_BREACHES")}</p><h3 className="text-3xl font-bold text-primary">{slaBreachCount}</h3></div>
          <div className="p-3 bg-surface-hover rounded-xl border border-border"><Flag size={20} className="text-warning" aria-hidden="true" /></div>
        </div>
      </div>
      <div className="sa-card relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary-subtle opacity-0 group-hover:opacity-100 motion-safe:transition-opacity motion-reduce:transition-none" />
        <div className="flex justify-between items-start relative z-10">
          <div><p className="text-sm font-medium text-secondary mb-1">{t("COPY.SAMPLE_AVG_RESPONSE_TIME")}</p><h3 className="text-3xl font-bold text-primary">{avgResponse}</h3></div>
          <div className="p-3 bg-surface-hover rounded-xl border border-border"><Clock size={20} className="text-info" aria-hidden="true" /></div>
        </div>
      </div>
    </section>
  );
}
