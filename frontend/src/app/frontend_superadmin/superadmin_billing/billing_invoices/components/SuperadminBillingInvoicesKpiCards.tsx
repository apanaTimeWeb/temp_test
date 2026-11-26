/** Responsibility: SuperadminBillingInvoicesKpiCards; module-owned presentation component for billing_overview. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminBillingInvoicesKpiCards formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
'use client';

import { useLocale, useTranslations } from 'next-intl';
import { AlertCircle, CheckCircle, CreditCard, TrendingUp, ArrowUpRight } from 'lucide-react';
import { SUPERADMIN_BILLING_SAMPLE_OVERVIEW_KPIS } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/mocks/fixtures/SuperadminBillingInvoicesSampleMockFixtures';
import { FormatCurrency } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/utils/SuperadminBillingInvoicesFormatters';

/** Renders billing's illustrative KPI cards with Cyber-Luxury styling from minor-unit preview fixtures. */
export default function SuperadminBillingInvoicesKpiCards() {
  const tCopy = useTranslations('SUPERADMIN_BILLING');
  const locale = useLocale();
  const { lifetimeCollectionsMinor, overduePaymentsMinor, nextPayoutMinor, currencyCode } = SUPERADMIN_BILLING_SAMPLE_OVERVIEW_KPIS;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-6">
      {/* 1. Lifetime Collections */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/40 via-[#0a0d24] to-[#060812] p-5 shadow-xl backdrop-blur-md hover:border-emerald-500/40 motion-safe:transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            {tCopy('COPY.SAMPLE_SAAS_REVENUE')}
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shadow-inner">
            <TrendingUp size={18} />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight font-mono">
          {FormatCurrency(lifetimeCollectionsMinor, currencyCode, locale)}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle size={12} /> {tCopy('COPY.ILLUSTRATIVE_LIFETIME_COLLECTIONS')}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">99.4% Success Rate</span>
        </div>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: '92%' }} />
        </div>
      </div>

      {/* 2. Pending / Overdue Invoices */}
      <div className="relative overflow-hidden rounded-2xl border border-rose-500/25 bg-gradient-to-br from-rose-950/40 via-[#0a0d24] to-[#060812] p-5 shadow-xl backdrop-blur-md hover:border-rose-500/40 motion-safe:transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
            {tCopy('COPY.SAMPLE_PENDING_INVOICES')}
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-400 shadow-inner">
            <AlertCircle size={18} />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-rose-400 tracking-tight font-mono">
          {FormatCurrency(overduePaymentsMinor, currencyCode, locale)}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 text-rose-400 font-semibold bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
            <AlertCircle size={12} /> {tCopy('COPY.ILLUSTRATIVE_OVERDUE_PAYMENTS')}
          </span>
          <span className="text-[11px] text-amber-300 font-medium">Dunning Active</span>
        </div>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-gradient-to-r from-rose-500 to-amber-500" style={{ width: '18%' }} />
        </div>
      </div>

      {/* 3. Next Automated Payout */}
      <div className="relative overflow-hidden rounded-2xl border border-sky-500/25 bg-gradient-to-br from-sky-950/40 via-[#0a0d24] to-[#060812] p-5 shadow-xl backdrop-blur-md hover:border-sky-500/40 motion-safe:transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
            {tCopy('COPY.SAMPLE_NEXT_PAYOUT')}
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/15 text-sky-400 shadow-inner">
            <CreditCard size={18} />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-sky-300 tracking-tight font-mono">
          {FormatCurrency(nextPayoutMinor, currencyCode, locale)}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 text-sky-400 font-semibold bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">
            <CreditCard size={12} /> {tCopy('COPY.ILLUSTRATIVE_DATE_1_NOV')}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">Scheduled Batch</span>
        </div>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-gradient-to-r from-sky-500 to-indigo-500" style={{ width: '64%' }} />
        </div>
      </div>
    </div>
  );
}
