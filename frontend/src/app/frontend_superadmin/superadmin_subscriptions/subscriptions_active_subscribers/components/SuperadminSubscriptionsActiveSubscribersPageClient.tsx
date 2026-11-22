'use client';

/** Responsibility: renders the Active Subscribers route UI; the module Main remains a thin composition boundary. */
import SuperadminSubscriptionsActiveSubscribersSemanticTable, { type SemanticColumnDef, type SemanticCellParams } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_active_subscribers/components/SuperadminSubscriptionsActiveSubscribersSemanticTable';
import SuperadminSubscriptionsActiveSubscribersKpis from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_active_subscribers/components/SuperadminSubscriptionsActiveSubscribersKpis';
import SuperadminSubscriptionsActiveSubscribersFilterToolbar from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_active_subscribers/components/SuperadminSubscriptionsActiveSubscribersFilterToolbar';

import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { SUPERADMIN_SUBSCRIPTIONS_SAMPLE_SUBSCRIBERS } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_active_subscribers/mocks/fixtures/SuperadminSubscriptionsActiveSubscribersMockFixtures';
import type { SuperadminSubscriptionRecord } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_active_subscribers/types/SuperadminSubscriptionsActiveSubscribersTypes';
import { Users, Package, Building2, ShieldCheck, MessageSquare, Mail } from 'lucide-react';
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

export default function SuperadminSubscriptionsActiveSubscribersPageClient() {
  const locale = useLocale();
  const t = useTranslations('SUPERADMIN_SUBSCRIPTIONS');

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
      flex: 1.4,
      cellRenderer: (params: SemanticCellParams) => (
        <div className="flex items-center gap-2">
          <Building2 size={15} className="text-indigo-400 shrink-0" />
          <div className="min-w-0">
            <span className="font-bold text-slate-100 truncate block">{String(params.value ?? '')}</span>
            {Boolean(params.data?.billingContact) && (
              <span className="text-[11px] text-slate-400 truncate block">
                {String(params.data.billingContact)} {params.data.phone ? `(${String(params.data.phone)})` : ''}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      headerName: t('COPY.TABLE_COLUMN_PLAN'),
      field: 'plan',
      flex: 1.1,
      cellRenderer: (params: SemanticCellParams) => (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-xs font-semibold text-indigo-300">
          <Package size={12} />
          <span>{String(params.value ?? '')}</span>
        </span>
      ),
    },
    {
      headerName: t('COPY.TABLE_COLUMN_STATUS'),
      field: 'status',
      flex: 1,
      cellRenderer: (params: SemanticCellParams) => {
        const val = String(params.value ?? '');
        const isPaid = val === 'Paid';
        const isOverdue = val === 'Overdue';
        const cls = isPaid ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400' : isOverdue ? 'border-rose-500/30 bg-rose-500/15 text-rose-400' : 'border-amber-500/30 bg-amber-500/15 text-amber-400';
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${cls}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isPaid ? 'bg-emerald-400' : isOverdue ? 'bg-rose-400' : 'bg-amber-400'}`} />
            <span>{val}</span>
          </span>
        );
      },
    },
    {
      headerName: t('COPY.TABLE_COLUMN_CYCLE'),
      field: 'cycle',
      flex: 0.9,
      cellClass: () => 'text-slate-300 font-medium text-xs',
    },
    {
      headerName: t('COPY.TABLE_COLUMN_MRR'),
      field: 'mrr',
      flex: 1,
      cellRenderer: (params: SemanticCellParams) => (
        <span className="font-mono text-xs font-bold text-emerald-400">
          {formatSuperadminSubscriptionsMajorPreviewCurrency(Number(params.value ?? 0), 'INR', locale)}
        </span>
      ),
    },
    {
      headerName: t('COPY.TABLE_COLUMN_RENEWAL'),
      field: 'renewal',
      flex: 1,
      cellClass: () => 'text-slate-400 font-mono text-xs',
    },
    {
      headerName: t('COPY.TABLE_COLUMN_ACTIONS'),
      flex: 1.5,
      minWidth: 160,
      cellRenderer: (params: SemanticCellParams) => {
        const testIdSuffix = getSuperadminInteractiveTestIdSuffix(params.data);
        const sub = params.data as unknown as SuperadminSubscriptionRecord;
        if (!sub) return null;
        const rawPhone = sub.phone || '9876543210';
        const digits = rawPhone.replace(/\D/g, '');
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

            {/* Quick WhatsApp (Free Web) */}
            <button
              type="button"
              onClick={() => {
                const popup = window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(waMsg)}`, '_blank', 'noopener,noreferrer');
                if (popup) popup.opener = null;
                showToast(`Opened WhatsApp chat for ${sub.tenant} (Zero API Cost)`);
              }}
              className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:text-white hover:bg-emerald-600/30 transition-all shadow-xs cursor-pointer"
              title={`WhatsApp message to ${sub.tenant} (Free Web)`}
              aria-label={`WhatsApp ${sub.tenant}`}
            >
              <MessageSquare size={13} className="text-emerald-400" />
            </button>

            {/* Quick Email (Free Client) */}
            {sub.email && (
              <a
                href={`mailto:${sub.email}?subject=${encodeURIComponent(`Smart Library SaaS Subscription Notice - ${sub.tenant}`)}&body=${encodeURIComponent(`Dear ${sub.billingContact || sub.tenant},\n\n`)}`}
                className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-500/15 text-purple-300 hover:text-white hover:bg-purple-600/30 transition-all shadow-xs cursor-pointer"
                title={`Send email to ${sub.tenant} (Free Client)`}
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

      {/* Cost Protection Banner */}
      <div className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-2 text-xs font-medium text-indigo-300">
        <ShieldCheck className="h-4 w-4 text-indigo-400 shrink-0" />
        <span><strong>Provider Cost Protection Active:</strong> Zero API cost for subscriber contact. WhatsApp Web click-to-chat and native email client are used for follow-ups and renewal reminders.</span>
      </div>

      {/* KPI Cards Grid */}
      <SuperadminSubscriptionsActiveSubscribersKpis subs={subs} locale={locale} />

      {/* Search & Filter Toolbar */}
      <SuperadminSubscriptionsActiveSubscribersFilterToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        planFilter={planFilter}
        setPlanFilter={setPlanFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        cycleFilter={cycleFilter}
        setCycleFilter={setCycleFilter}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={resetFilters}
        onExportCsv={handleExportCsv}
        onExportExcel={handleExportExcel}
        onPrintRoster={handlePrintRoster}
      />

      {/* Semantic Subscribers Table */}
      <SuperadminSubscriptionsActiveSubscribersSemanticTable
        rowData={filteredSubs as unknown as readonly Record<string, unknown>[]}
        columnDefs={colDefs}
        pagination={true}
        paginationPageSize={10}
      />
    </div>
  );
}
