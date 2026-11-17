'use client';
/** Responsibility: Superadmin Finance Renewals Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminSubscriptionsOverviewMemberRenewalsPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import SuperadminFinanceRenewalsSemanticTable from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_renewals/components/SuperadminSubscriptionsOverviewMemberRenewalsSemanticTable';

import { useSuperadminSubscriptionsOverviewMemberRenewalsUrlFilter } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_renewals/hooks/useSuperadminSubscriptionsOverviewMemberRenewalsUrlFilter';

import { useTranslations, useLocale } from 'next-intl';
import type { SemanticCellParams } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_renewals/components/SuperadminSubscriptionsOverviewMemberRenewalsSemanticTable';
type ICellRendererParams = SemanticCellParams<Renewal>;
import { useState } from 'react';

import { toast } from 'sonner';
import { formatMajorUnitPreviewCurrency } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_renewals/utils/SuperadminSubscriptionsOverviewMemberRenewalsFormatters';
import { RefreshCw, Send } from 'lucide-react';
import { SUPERADMIN_FINANCE_SAMPLE_RENEWALS } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_renewals/mocks/fixtures/SuperadminSubscriptionsOverviewMemberRenewalsMockFixtures';
import { SUPERADMIN_FINANCE_RENEWAL_PLANS } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_renewals/constants/SuperadminSubscriptionsOverviewMemberRenewalsRenewalConstants';
import { SUPERADMIN_FINANCE_RENEWAL_FILTERS } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_renewals/constants/SuperadminSubscriptionsOverviewMemberRenewalsRenewalConstants';
import type { FilterType, Renewal } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_renewals/types/SuperadminSubscriptionsOverviewMemberRenewalsPageClientComponentTypes';






/** Derives a stable, non-index row identity for repeated interactive table controls. */
function getSuperadminInteractiveTestIdSuffix(value: unknown): string {
  const record = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  for (const field of ['id', 'uuid', 'recordId', 'userId', 'assetId', 'libraryId', 'planId', 'subscriptionId', 'transactionId', 'invoiceId', 'refundId', 'requestId', 'ruleId', 'messageId', 'noticeId', 'complaintId', 'entryId', 'backupId', 'enquiryId', 'studentId', 'memberId', 'branchId', 'scheduleId', 'logId', 'smartId', 'receiptNumber', 'ticketId', 'lockerId', 'seatNo', 'code', 'slug', 'key', 'name']) {
    const candidate = record[field];
    if (typeof candidate === 'string' || typeof candidate === 'number') return String(candidate);
  }
  return 'missing-domain-id';
}

/**
 * Renders the `superadmin_member_finance` view owned by `SuperadminSubscriptionsOverviewMemberRenewalsPageClient`.
 * Owns local UI state for `filter`, `allRenewals`, `renewDialog`, `renewPlanId`, `renewAmount`, `renewMode` and related form/selection state.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminSubscriptionsOverviewMemberRenewalsPageClient() {
  const tCopy = useTranslations('SUPERADMIN_FINANCE');
  const locale = useLocale();
  const [filter, setFilter] = useSuperadminSubscriptionsOverviewMemberRenewalsUrlFilter<FilterType>('renewalFilter', 'expiring_7');
  const [allRenewals] = useState(SUPERADMIN_FINANCE_SAMPLE_RENEWALS);
  const [renewDialog, setRenewDialog] = useState<{ id: number; name: string } | null>(null);
  const [renewPlanId, setRenewPlanId] = useState('');
  const [renewAmount, setRenewAmount] = useState('');
  const [renewMode, setRenewMode] = useState('cash');
  const [renewTxnId, setRenewTxnId] = useState('');

  const visible = allRenewals.filter((r) => {
    if (filter === 'expired')     return r.daysLeft < 0;
    if (filter === 'expiring_7')  return r.daysLeft >= 0 && r.daysLeft <= 7;
    if (filter === 'expiring_15') return r.daysLeft >= 0 && r.daysLeft <= 15;
    return true;
  });

  const totalDue = visible.reduce((sum, renewal) => sum + renewal.total, 0);

  const handleRemindAll = () => {
    toast.error(tCopy("COPY.WHATSAPP_REMINDERS_UNAVAILABLE"), { id: "superadmin_member_finance:SuperadminSubscriptionsOverviewMemberRenewalsPageClient:error:1" });
  };

  const handleRemind = (name: string) => {
    toast.error(tCopy("COPY.WHATSAPP_REMINDER_UNAVAILABLE"), { id: "superadmin_member_finance:SuperadminSubscriptionsOverviewMemberRenewalsPageClient:error:2" });
  };

  const openRenew = (r: Renewal) => {
    setRenewDialog({ id: r.id, name: r.studentName });
    setRenewPlanId(String(r.planId));
    setRenewAmount(String(r.total));
  };

  const handleRenew = () => {
    if (!renewDialog || !renewAmount) return;
    // Do not remove the sample row or imply a completed renewal without a verified payment API contract.
    toast.error(tCopy("COPY.RENEWAL_IS_UNAVAILABLE_BECAUSE_THE_SAMPLE_RECORDS_DO_NOT_SUPPLY_A__008DD4CE"), { id: "superadmin_member_finance:SuperadminSubscriptionsOverviewMemberRenewalsPageClient:error:3" });
  };

  const colDefs = [
    { field: 'studentName', headerName: tCopy("COPY.STUDENT"), flex: 1, minWidth: 150, cellRenderer: (p: ICellRendererParams) => <span className="font-semibold text-slate-100">{p.value}</span> },
    { field: 'smartId', headerName: tCopy("COPY.SMART_ID_2"), width: 120, cellRenderer: (p: ICellRendererParams) => <span className="font-mono text-xs text-indigo-400/80">{p.value}</span> },
    { field: 'shift', headerName: tCopy("COPY.SHIFT"), width: 110, cellRenderer: (p: ICellRendererParams) => <div className="h-full flex items-center"><span className="inline-flex rounded-md border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-xs font-medium text-slate-300">{p.value}</span></div> },
    { field: 'plan', headerName: tCopy("COPY.PLAN"), width: 110, cellRenderer: (p: ICellRendererParams) => <span className="text-sm text-slate-200">{p.value}</span> },
    { field: 'expiryDate', headerName: tCopy("COPY.TABLE_COLUMN_EXPIRY_DATE"), width: 120, cellRenderer: (p: ICellRendererParams) => <span className="text-xs text-slate-400">{p.value}</span> },
    { 
      field: 'daysLeft', 
      headerName: tCopy("COPY.DAYS_LEFT"), 
      width: 120,
      cellRenderer: (p: ICellRendererParams) => {
        const val = Number(p.value ?? 0);
        const badgeClass = val < 0 
          ? 'border-rose-500/30 bg-rose-500/15 text-rose-400' 
          : val <= 7 
          ? 'border-amber-500/30 bg-amber-500/15 text-amber-300' 
          : 'border-sky-500/30 bg-sky-500/15 text-sky-400';
        return (
          <div className="h-full flex items-center">
            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${badgeClass}`}>
              {val < 0 ? `${Math.abs(val)}d ago` : `${val}d left`}
            </span>
          </div>
        );
      }
    },
    { field: 'lastPaymentDate', headerName: tCopy("COPY.TABLE_COLUMN_LAST_PAYMENT"), width: 130, cellRenderer: (p: ICellRendererParams) => <span className="text-xs text-slate-400">{p.value}</span> },
    { 
      headerName: tCopy("COPY.DUE"), 
      width: 110,
      cellStyle: { textAlign: 'right', fontWeight: 600 },
      cellRenderer: (p: ICellRendererParams) => (
        <span className={Number(p.value ?? 0) > 0 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
          {tCopy('COPY.FINANCIAL_DETAIL_ONLY')}
        </span>
      )
    },
    {
      headerName: tCopy("COPY.ACTIONS"),
      width: 190,
      sortable: false,
      cellRenderer: (params: ICellRendererParams) => (
        <div className="flex items-center gap-2 h-full">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer"
            onClick={() => openRenew(params.data)}
            title={tCopy("COPY.RENEW_NOW")}
            data-testid={`superadmin-finance-finance-renewals-renew-now-1-${getSuperadminInteractiveTestIdSuffix(params.data)}`}
          >
            <RefreshCw size={12} className="text-emerald-400" />
            <span>{tCopy("COPY.RENEW")}</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition-all cursor-not-allowed opacity-50"
            onClick={() => handleRemind(params.data.studentName)}
            disabled
            title={tCopy("COPY.WHATSAPP_REMINDER_UNAVAILABLE")}
            data-testid={`superadmin-finance-finance-renewals-send-whatsapp-reminder-2-${getSuperadminInteractiveTestIdSuffix(params.data)}`}
          >
            <Send size={12} className="text-indigo-400" />
            <span>{tCopy("COPY.REMIND")}</span>
          </button>
        </div>
      )
    }
  ];

  const expiredCount = allRenewals.filter((r) => r.daysLeft < 0).length;
  const expiring7Count = allRenewals.filter((r) => r.daysLeft >= 0 && r.daysLeft <= 7).length;
  const expiring15Count = allRenewals.filter((r) => r.daysLeft >= 0 && r.daysLeft <= 15).length;

  return (
    <div className="w-full max-w-full min-w-0 space-y-6">
      {/* Hero Header Card */}
      <div className="rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 p-5 sm:p-6 shadow-md backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shadow-inner">
              <RefreshCw className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                  {tCopy("COPY.RENEWALS")}
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Renewals Engine Active
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300">
                  {visible.length} Pending Actions
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                {tCopy("COPY.SUBSCRIPTIONS_NEEDING_RENEWAL_ATTENTION")}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-semibold text-indigo-300 opacity-50 cursor-not-allowed transition-all"
            onClick={handleRemindAll}
            disabled
            title={tCopy("COPY.WHATSAPP_REMINDERS_UNAVAILABLE")}
            data-testid="superadmin-finance-finance-renewals-remind-all-3"
          >
            <Send size={13} className="text-indigo-400" />
            <span>{tCopy("COPY.REMIND_ALL")}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Expiring in 7 Days</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400">
              <RefreshCw className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">{expiring7Count}</div>
          <div className="mt-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-300 border border-amber-500/20">
              High Priority
            </span>
            <span className="text-[11px] text-slate-400">Action Required</span>
          </div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400" style={{ width: '60%' }} />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">Expiring in 15 Days</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/15 text-sky-400">
              <RefreshCw className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">{expiring15Count}</div>
          <div className="mt-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-md bg-sky-500/10 px-2 py-0.5 text-[11px] font-medium text-sky-300 border border-sky-500/20">
              Notice Sent
            </span>
            <span className="text-[11px] text-slate-400">Pipeline</span>
          </div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full bg-gradient-to-r from-sky-500 to-cyan-400" style={{ width: '45%' }} />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">Already Expired</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-400">
              <RefreshCw className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">{expiredCount}</div>
          <div className="mt-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-300 border border-rose-500/20">
              Suspension Warning
            </span>
            <span className="text-[11px] text-slate-400">Critical</span>
          </div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500" style={{ width: '25%' }} />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Total Renewal Value</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400">
              <RefreshCw className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">
            {formatMajorUnitPreviewCurrency(totalDue, 'INR', locale)}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300 border border-emerald-500/20">
              Recoverable
            </span>
            <span className="text-[11px] text-slate-400">Current Scope</span>
          </div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: '80%' }} />
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 border-b border-indigo-500/20 pb-2">
        {SUPERADMIN_FINANCE_RENEWAL_FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <button
              type="button"
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                active
                  ? 'border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 shadow-xs'
                  : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
              data-testid={`superadmin-finance-finance-renewals-set-filter-4-${String(f.value)}`}
            >
              <span>{f.emoji}</span>
              <span>{tCopy(f.labelKey)}</span>
            </button>
          );
        })}
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-indigo-500/20 bg-[#0c0f28]/95 shadow-md backdrop-blur-md overflow-hidden">
        <SuperadminFinanceRenewalsSemanticTable
          rowData={visible}
          columnDefs={colDefs}
          pagination={true}
          paginationPageSize={10}
        />
      </div>

      {renewDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-indigo-500/30 bg-[#0c0f28] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-emerald-400" />
                <span>{tCopy("COPY.RENEW_SUBSCRIPTION")} {renewDialog.name}</span>
              </h2>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-200 text-sm font-bold p-1 cursor-pointer"
                aria-label={tCopy("COPY.CLOSE")}
                onClick={() => setRenewDialog(null)}
                data-testid="superadmin-finance-finance-renewals-close-5"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1" htmlFor="superadmin-superadminfinancerenewalspageclient-202-select">
                  {tCopy("COPY.PLAN")}
                </label>
                <select
                  id="superadmin-superadminfinancerenewalspageclient-202-select"
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                  value={renewPlanId}
                  onChange={(e) => {
                    setRenewPlanId(e.target.value);
                    const selectedPlan = SUPERADMIN_FINANCE_RENEWAL_PLANS.find((p) => String(p.id) === e.target.value);
                    if (selectedPlan) {
                      setRenewAmount(String(selectedPlan.price));
                    }
                  }}
                  data-testid="superadmin-finance-finance-renewals-field-6"
                >
                  {SUPERADMIN_FINANCE_RENEWAL_PLANS.map((p) => (
                    <option key={p.id} value={String(p.id)}>{p.name} — {formatMajorUnitPreviewCurrency(p.price, 'INR', locale)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1" htmlFor="superadmin-superadminfinancerenewalspageclient-221-input">
                  {tCopy("COPY.AMOUNT")}
                </label>
                <input
                  id="superadmin-superadminfinancerenewalspageclient-221-input"
                  type="number"
                  min={0}
                  step="0.01"
                  inputMode="decimal"
                  aria-invalid={renewAmount !== '' && (!Number.isFinite(Number(renewAmount)) || Number(renewAmount) < 0)}
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                  value={renewAmount}
                  onChange={(e) => setRenewAmount(e.target.value)}
                  data-testid="superadmin-finance-finance-renewals-field-7"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1" htmlFor="superadmin-superadminfinancerenewalspageclient-225-select">
                  {tCopy("COPY.PAYMENT_MODE")}
                </label>
                <select
                  id="superadmin-superadminfinancerenewalspageclient-225-select"
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                  value={renewMode}
                  onChange={(e) => setRenewMode(e.target.value)}
                  data-testid="superadmin-finance-finance-renewals-cash-8"
                >
                  <option value="cash">{tCopy("COPY.CASH")}</option>
                  <option value="upi">{tCopy("COPY.UPI")}</option>
                  <option value="card">{tCopy("COPY.CARD")}</option>
                  <option value="bank">{tCopy("COPY.BANK_TRANSFER")}</option>
                </select>
              </div>
              {renewMode !== 'cash' && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1" htmlFor="superadmin-superadminfinancerenewalspageclient-235-input">
                    {tCopy("COPY.TRANSACTION_ID")}
                  </label>
                  <input
                    id="superadmin-superadminfinancerenewalspageclient-235-input"
                    className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
                    value={renewTxnId}
                    onChange={(e) => setRenewTxnId(e.target.value)}
                    placeholder={tCopy("COPY.ENTER_TRANSACTION_REFERENCE")}
                    data-testid="superadmin-finance-finance-renewals-enter-transaction-reference-9"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-indigo-500/20">
              <button
                type="button"
                className="inline-flex items-center rounded-xl border border-border/80 bg-card/80 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800/60 cursor-pointer"
                onClick={() => setRenewDialog(null)}
                data-testid="superadmin-finance-finance-renewals-cancel-10"
              >
                {tCopy("COPY.CANCEL")}
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-500/25 opacity-50 cursor-not-allowed"
                onClick={handleRenew}
                disabled
                title={tCopy("COPY.RENEWAL_IS_UNAVAILABLE_BECAUSE_THE_SAMPLE_RECORDS_DO_NOT_SUPPLY_A__008DD4CE")}
                data-testid="superadmin-finance-finance-renewals-renewing-11"
              >
                <RefreshCw size={12} />
                <span>{tCopy('COPY.CONFIRM_RENEWAL')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
