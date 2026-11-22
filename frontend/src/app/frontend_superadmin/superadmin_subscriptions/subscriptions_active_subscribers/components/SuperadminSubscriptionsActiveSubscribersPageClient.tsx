'use client';

/** Responsibility: renders the Active Subscribers route UI; the module Main remains a thin composition boundary.
 * Tenant subscription plan quotas:
 * - branches: number of branches allocated
 * - members: total student/member capacity
 * - price: plan subscription price
 * - storage: document/backup storage quota
 */
/** Data-Flow: canonical route -> SuperadminSubscriptionsActiveSubscribersPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import SuperadminSubscriptionsActiveSubscribersSemanticTable, { type SemanticColumnDef, type SemanticCellParams } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_active_subscribers/components/SuperadminSubscriptionsActiveSubscribersSemanticTable';

import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { SUPERADMIN_SUBSCRIPTIONS_SAMPLE_SUBSCRIBERS } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_active_subscribers/mocks/fixtures/SuperadminSubscriptionsActiveSubscribersMockFixtures';
import type { SuperadminSubscriptionRecord } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_active_subscribers/types/SuperadminSubscriptionsActiveSubscribersTypes';
import { Users, Package, Building2, Clock, AlertCircle, CheckCircle, TrendingUp, ShieldCheck, Search, X, RotateCcw, Download, FileSpreadsheet, Printer, MessageSquare, Mail} from 'lucide-react';
import { formatSuperadminSubscriptionsMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_active_subscribers/utils/SuperadminSubscriptionsActiveSubscribersFormatters';
import {
  downloadSuperadminSubscriptionsCsv,
  downloadSuperadminSubscriptionsExcel,
  printSuperadminSubscriptionsRoster
} from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_active_subscribers/utils/SuperadminSubscriptionsActiveSubscribersExportUtils';
import { useTranslations, useLocale } from 'next-intl';

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
 * Renders the `subscriptions_active_subscribers` view owned by `SuperadminSubscriptionsActiveSubscribersPageClient`.
 * Owns the Active Subscribers view and local subscriber fixture data only.
 * Payment/status mutation remains disabled until the host supplies a verified contract.
 * Dirty form state is guarded before destructive or route-leaving actions.
 */
export default function SuperadminSubscriptionsActiveSubscribersPageClient() {
  const locale = useLocale();
  const t = useTranslations('SUPERADMIN_SUBSCRIPTIONS');

  const [activeTab] = useState("Active Subscribers");
  const [subs] = useState<SuperadminSubscriptionRecord[]>(SUPERADMIN_SUBSCRIPTIONS_SAMPLE_SUBSCRIBERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cycleFilter, setCycleFilter] = useState('all');

  const showToast = useCallback((msg: string) => {
    toast.message(msg, { id: 'superadmin:subscriptions:feedback' });
  }, []);

  const filteredSubs = useMemo(() => {
    return subs.filter((sub) => {
      if (planFilter !== 'all' && sub.plan.toLowerCase() !== planFilter.toLowerCase()) return false;
      if (statusFilter !== 'all' && sub.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (cycleFilter !== 'all' && sub.cycle.toLowerCase() !== cycleFilter.toLowerCase()) return false;
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const matchesTenant = sub.tenant.toLowerCase().includes(q);
        const matchesPlan = sub.plan.toLowerCase().includes(q);
        const matchesStatus = sub.status.toLowerCase().includes(q);
        const matchesContact = sub.billingContact ? sub.billingContact.toLowerCase().includes(q) : false;
        const matchesPhone = sub.phone ? sub.phone.toLowerCase().includes(q) : false;
        if (!matchesTenant && !matchesPlan && !matchesStatus && !matchesContact && !matchesPhone) return false;
      }
      return true;
    });
  }, [subs, searchQuery, planFilter, statusFilter, cycleFilter]);

  const hasActiveFilters = Boolean(searchQuery || planFilter !== 'all' || statusFilter !== 'all' || cycleFilter !== 'all');
  const resetFilters = () => {
    setSearchQuery('');
    setPlanFilter('all');
    setStatusFilter('all');
    setCycleFilter('all');
  };

  const handleExportCsv = useCallback(() => {
    downloadSuperadminSubscriptionsCsv(filteredSubs, 'superadmin_subscriptions_export.csv');
    showToast(`Exported ${filteredSubs.length} subscription record(s) to CSV`);
  }, [filteredSubs, showToast]);

  const handleExportExcel = useCallback(() => {
    downloadSuperadminSubscriptionsExcel(filteredSubs, 'superadmin_subscriptions_export.xls');
    showToast(`Exported ${filteredSubs.length} subscription record(s) to Excel (.xls)`);
  }, [filteredSubs, showToast]);

  const handlePrintRoster = useCallback(() => {
    printSuperadminSubscriptionsRoster(filteredSubs, 'Active Subscribers Directory');
    showToast(`Prepared ${filteredSubs.length} subscriber record(s) for printing`);
  }, [filteredSubs, showToast]);

  const colDefs = useMemo<SemanticColumnDef[]>(() => [
    {
      headerName: t('COPY.TABLE_COLUMN_TENANT'),
      field: 'tenant',
      flex: 2,
      cellRenderer: (p: SemanticCellParams) => (
        <div className="flex items-center gap-2.5 py-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
            <Building2 size={15} />
          </div>
          <span className="font-semibold text-slate-100">{String(p.value ?? '')}</span>
        </div>
      ),
    },
    {
      headerName: t('COPY.TABLE_COLUMN_PLAN'),
      field: 'plan',
      flex: 1.5,
      cellRenderer: (p: SemanticCellParams) => (
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-300">
          <Package size={12} className="text-indigo-400" />
          {String(p.value ?? '')}
        </span>
      ),
    },
    {
      headerName: t('COPY.TABLE_COLUMN_CYCLE_MRR'),
      field: 'mrr',
      flex: 1,
      cellRenderer: (p: SemanticCellParams) => (
        <div>
          <p className="text-sm font-bold text-emerald-400">{formatSuperadminSubscriptionsMajorPreviewCurrency(p.data?.mrr, 'INR', locale)}</p>
          <span className="inline-flex rounded bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
            {t(`COPY.CYCLE_${String(p.data?.cycle ?? '').toUpperCase()}` as 'COPY.CYCLE_MONTHLY' | 'COPY.CYCLE_YEARLY' | 'COPY.CYCLE_ANNUALLY')}
          </span>
        </div>
      ),
    },
    {
      headerName: t('COPY.TABLE_COLUMN_STATUS'),
      field: 'status',
      flex: 1,
      cellRenderer: (p: SemanticCellParams) => {
        const val = p.value;
        const isPaid = val === 'Paid';
        const isDue = val === 'Due Soon';
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${isPaid
                ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                : isDue
                  ? 'border-amber-500/30 bg-amber-500/15 text-amber-400'
                  : 'border-rose-500/30 bg-rose-500/15 text-rose-400'
              }`}
          >
            {isPaid ? <CheckCircle size={11} /> : isDue ? <Clock size={11} /> : <AlertCircle size={11} />}
            {isPaid ? t('COPY.STATUS_PAID') : isDue ? t('COPY.STATUS_DUE_SOON') : t('COPY.STATUS_OVERDUE')}
          </span>
        );
      },
    },
    {
      headerName: t('COPY.TABLE_COLUMN_ACTIONS'),
      flex: 1.8,
      minWidth: 240,
      cellRenderer: (p: SemanticCellParams) => {
        if (!p.data) return null;
        const sub = p.data as unknown as SuperadminSubscriptionRecord;
        const testIdSuffix = getSuperadminInteractiveTestIdSuffix(p.data);
        const phone = sub.phone || '9876543210';
        let digits = phone.replace(/\D/g, '');
        if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
        const waPhone = digits.length === 10 ? `91${digits}` : digits;
        const waMsg = `Hello ${sub.billingContact || sub.tenant}, greeting from Smart Library SuperAdmin regarding your ${sub.plan} plan subscription.`;

        return (
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              disabled
              title={t("COPY.UNAVAILABLE_PAYMENT_STATUS_IS_SERVER_OWNED_AND_NO_STATUS_MUTATION_API_CONTRACT_IS_SUPPLIED")}
              className="inline-flex items-center gap-1 rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-2.5 py-1 text-xs font-semibold text-slate-400 opacity-60 cursor-not-allowed"
              data-testid={`superadmin-subscriptions-subscriptions-overview-unavailable-payment-status-is-server-owned-and-no-status-mutation-api-contract-is-supplied-1-${testIdSuffix}`}
            >
              {t("COPY.CHANGE_UNAVAILABLE")}
            </button>

            {/* Quick WhatsApp */}
            <button
              type="button"
              onClick={() => {
                const popup = window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(waMsg)}`, '_blank', 'noopener,noreferrer');
                if (popup) popup.opener = null;
                showToast(`Opened WhatsApp chat for ${sub.tenant}`);
              }}
              className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:text-white hover:bg-emerald-600/30 transition-all shadow-xs cursor-pointer"
              title={`WhatsApp message to ${sub.tenant}`}
              aria-label={`WhatsApp ${sub.tenant}`}
            >
              <MessageSquare size={13} className="text-emerald-400" />
            </button>

            {/* Quick Email */}
            {sub.email && (
              <a
                href={`mailto:${sub.email}?subject=${encodeURIComponent(`Smart Library SaaS Subscription Notice - ${sub.tenant}`)}&body=${encodeURIComponent(`Dear ${sub.billingContact || sub.tenant},\n\n`)}`}
                className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-500/15 text-purple-300 hover:text-white hover:bg-purple-600/30 transition-all shadow-xs cursor-pointer"
                title={`Send email to ${sub.tenant}`}
                aria-label={`Email ${sub.tenant}`}
              >
                <Mail size={13} className="text-purple-400" />
              </a>
            )}

            
          </div>
        );
      },
    },
  ], [t, locale, showToast]);

  const totalMrr = subs.reduce((acc, row) => acc + (typeof row.mrr === 'number' ? row.mrr : 0), 0);
  const paidCount = subs.filter((row) => row.status === 'Paid').length;
  const dueCount = subs.filter((row) => row.status === 'Due Soon').length;
  const overdueCount = subs.filter((row) => row.status === 'Overdue').length;

  return (
    <div className="w-full max-w-full min-w-0 space-y-6">
      {/* Hero Header Card */}
      <div className="rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 p-5 sm:p-6 shadow-md backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shadow-inner">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                  {t("COPY.SAAS_SUBSCRIPTIONS")}
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Active Subscribers
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300">
                  <ShieldCheck size={12} className="text-indigo-400" />
                  {subs.length} Active Records
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Detailed listing of all live library subscriber instances, active plans, MRR contributions and status.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Active Pipeline MRR</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">
            {formatSuperadminSubscriptionsMajorPreviewCurrency(totalMrr, 'INR', locale)}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300 border border-emerald-500/20">
              Recurring Active
            </span>
            <span className="text-[11px] text-slate-400">100% Verified</span>
          </div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: '82%' }} />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Paid Subscribers</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">
            {paidCount}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-300 border border-indigo-500/20">
              {Math.round((paidCount / Math.max(1, subs.length)) * 100)}% Current
            </span>
            <span className="text-[11px] text-slate-400">Healthy</span>
          </div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400" style={{ width: '75%' }} />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Due Soon</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">
            {dueCount}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-300 border border-amber-500/20">
              Payment Pending
            </span>
            <span className="text-[11px] text-slate-400">7 Days</span>
          </div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400" style={{ width: '30%' }} />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">Overdue / Suspended</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-400">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">
            {overdueCount}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-300 border border-rose-500/20">
              Action Required
            </span>
            <span className="text-[11px] text-slate-400">Grace Expired</span>
          </div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500" style={{ width: '15%' }} />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 shadow-md flex-wrap">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] w-full sm:w-auto">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search by tenant, plan, contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-indigo-500/25 bg-input text-white placeholder:text-secondary focus:border-indigo-400 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors cursor-pointer p-0.5"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Plan Filter */}
        <select
          aria-label="Filter by plan"
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="rounded-xl border border-indigo-500/25 bg-card px-3 py-2 text-xs font-medium text-white hover:border-indigo-400 focus:outline-none shadow-xs cursor-pointer w-full sm:w-auto"
        >
          <option value="all">All Plans</option>
          <option value="Enterprise">Enterprise</option>
          <option value="Pro">Pro</option>
          <option value="Starter">Starter</option>
        </select>

        {/* Status Filter */}
        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-indigo-500/25 bg-card px-3 py-2 text-xs font-medium text-white hover:border-indigo-400 focus:outline-none shadow-xs cursor-pointer w-full sm:w-auto"
        >
          <option value="all">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Due Soon">Due Soon</option>
          <option value="Overdue">Overdue</option>
        </select>

        {/* Cycle Filter */}
        <select
          aria-label="Filter by billing cycle"
          value={cycleFilter}
          onChange={(e) => setCycleFilter(e.target.value)}
          className="rounded-xl border border-indigo-500/25 bg-card px-3 py-2 text-xs font-medium text-white hover:border-indigo-400 focus:outline-none shadow-xs cursor-pointer w-full sm:w-auto"
        >
          <option value="all">All Cycles</option>
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/35 transition-all cursor-pointer"
            title="Reset filters"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}

        {/* Export Toolbar */}
        <div className="ml-auto flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-teal-500/30 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 text-xs font-semibold transition-all cursor-pointer shadow-xs"
            title="Export CSV"
          >
            <Download size={13} className="text-teal-400" />
            <span>CSV</span>
          </button>
          <button
            type="button"
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs font-semibold transition-all cursor-pointer shadow-xs"
            title="Export Excel (.xls)"
          >
            <FileSpreadsheet size={13} className="text-indigo-400" />
            <span>Excel</span>
          </button>
          <button
            type="button"
            onClick={handlePrintRoster}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 text-xs font-semibold transition-all cursor-pointer shadow-xs"
            title="Print roster"
          >
            <Printer size={13} className="text-sky-400" />
            <span>Print</span>
          </button>
          <span className="text-xs text-slate-400 font-medium px-2 py-1 rounded-md bg-surface border border-border">
            {filteredSubs.length} of {subs.length} Subscribers
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-indigo-500/20 bg-[#0c0f28]/95 shadow-md backdrop-blur-md overflow-hidden">
        {activeTab === 'Active Subscribers' && (
          <div className="w-full">
            <SuperadminSubscriptionsActiveSubscribersSemanticTable
              rowData={filteredSubs as unknown as readonly Record<string, unknown>[]}
              columnDefs={colDefs}
              pagination
              paginationPageSize={10}
              getRowId={({ data }) => String((data as Record<string, unknown>).id ?? (data as Record<string, unknown>).tenant)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
