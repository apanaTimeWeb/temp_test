/** Responsibility: Superadmin Support Tickets Kpi Cards; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSupportTicketsOverviewKpiCards formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { Clock, Flag, MessageSquare, Zap, Ticket } from 'lucide-react';
import type { SuperadminSupportTicketsKpiCardsProps } from '@/app/frontend_superadmin/superadmin_support/support_tickets/types/SuperadminSupportTicketsOverviewTypes';
import { useTranslations } from 'next-intl';

/**
 * Performs the superadmin support tickets overview kpi cards operation within support tickets; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSupportTicketsKpiCardsProps.
 */
export default function SuperadminSupportTicketsOverviewKpiCards({
  openCount,
  slaBreachCount,
  avgResponse,
  totalCount,
}: SuperadminSupportTicketsKpiCardsProps) {
  const t = useTranslations('SUPERADMIN_SUPPORT_TICKETS');
  const computedTotal = totalCount ?? (openCount + 12);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" aria-label={t("COPY.SAMPLE_SUPPORT_TICKET_METRICS")}>
      {/* 1. Total Helpdesk Tickets - Indigo */}
      <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-[#0c0f2a]/95 via-[#090d24]/90 to-[#141a45]/80 p-5 shadow-lg shadow-indigo-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-500/45 hover:shadow-xl hover:shadow-indigo-950/50">
        <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-indigo-500/10 blur-2xl transition-all duration-500 group-hover:bg-indigo-500/20" />
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Tickets
          </span>
          <div className="p-2.5 rounded-xl border shrink-0 transition-transform duration-200 group-hover:scale-110 shadow-md shadow-indigo-500/20 bg-indigo-500/20 border-indigo-500/40 text-indigo-400">
            <Ticket size={18} strokeWidth={2.3} />
          </div>
        </div>
        <p className="mt-3 text-3xl font-bold tracking-tight text-indigo-300">{computedTotal}</p>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-indigo-300 bg-indigo-500/10 border-indigo-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> All Categories & Branches
          </span>
        </div>
      </div>

      {/* 2. Open Tickets - Rose */}
      <div className="group relative overflow-hidden rounded-2xl border border-rose-500/25 bg-gradient-to-br from-[#1c0810]/95 via-[#1c0810]/90 to-[#2c0c1a]/80 p-5 shadow-lg shadow-rose-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-rose-500/45 hover:shadow-xl hover:shadow-rose-950/40">
        <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-rose-500/10 blur-2xl transition-all duration-500 group-hover:bg-rose-500/20" />
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {t("COPY.SAMPLE_OPEN_TICKETS")}
          </span>
          <div className="p-2.5 rounded-xl border shrink-0 transition-transform duration-200 group-hover:scale-110 shadow-md shadow-rose-500/20 bg-rose-500/20 border-rose-500/40 text-rose-400">
            <MessageSquare size={18} strokeWidth={2.3} />
          </div>
        </div>
        <p className="mt-3 text-3xl font-bold tracking-tight text-rose-400">{openCount}</p>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-rose-300 bg-rose-500/10 border-rose-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" /> Awaiting Resolution
          </span>
        </div>
      </div>

      {/* 3. SLA Breaches - Amber */}
      <div className="group relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 p-5 shadow-lg shadow-amber-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-amber-500/45 hover:shadow-xl hover:shadow-amber-950/40">
        <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-amber-500/10 blur-2xl transition-all duration-500 group-hover:bg-amber-500/20" />
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {t("COPY.SAMPLE_SLA_BREACHES")}
          </span>
          <div className="p-2.5 rounded-xl border shrink-0 transition-transform duration-200 group-hover:scale-110 shadow-md shadow-amber-500/20 bg-amber-500/20 border-amber-500/40 text-amber-400">
            <Flag size={18} strokeWidth={2.3} />
          </div>
        </div>
        <p className="mt-3 text-3xl font-bold tracking-tight text-amber-400">{slaBreachCount}</p>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-amber-300 bg-amber-500/10 border-amber-500/25">
            <span className={`w-1.5 h-1.5 rounded-full ${slaBreachCount > 0 ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
            {slaBreachCount > 0 ? 'Urgent Action Required' : 'All SLAs Intact'}
          </span>
        </div>
      </div>

      {/* 4. Avg Response - Cyan */}
      <div className="group relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-[#081822]/95 via-[#081822]/90 to-[#0d2636]/80 p-5 shadow-lg shadow-cyan-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-cyan-500/45 hover:shadow-xl hover:shadow-cyan-950/40">
        <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-cyan-500/10 blur-2xl transition-all duration-500 group-hover:bg-cyan-500/20" />
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {t("COPY.SAMPLE_AVG_RESPONSE_TIME")}
          </span>
          <div className="p-2.5 rounded-xl border shrink-0 transition-transform duration-200 group-hover:scale-110 shadow-md shadow-cyan-500/20 bg-cyan-500/20 border-cyan-500/40 text-cyan-400">
            <Clock size={18} strokeWidth={2.3} />
          </div>
        </div>
        <p className="mt-3 text-3xl font-bold tracking-tight text-cyan-400">{avgResponse}</p>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-cyan-300 bg-cyan-500/10 border-cyan-500/25">
            <Zap size={11} className="text-cyan-400" /> 24/7 Priority Support Desk
          </span>
        </div>
      </div>
    </section>
  );
}
