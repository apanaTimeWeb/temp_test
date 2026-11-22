'use client';

/** Responsibility: renders the Active Subscribers route UI; the module Main remains a thin composition boundary.
 * Tenant subscription plan quotas:
 * - branches: number of branches allocated
 * - members: total student/member capacity
 * - price: plan subscription price
 * - storage: document/backup storage quota
 * - name, plan, mrr, status, tenant
 */
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
  const record = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  for (const field of ['id', 'uuid', 'recordId', 'userId', 'subscriberId', 'key', 'name']) {
    const candidate = record[field];
    if (typeof candidate === 'string' || typeof candidate === 'number') return String(candidate);
  }
  return 'missing-domain-id';
}

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
    toast.message(msg, { id: 'superadmin:superadmin_subscriptions:ActiveSubscribers:feedback' });
  }, []);

  const handleExportCsv = () => {
    downloadSuperadminSubscriptionsCsv(filteredSubs);
    showToast('Subscribers roster exported as CSV');
  };

  const handleExportExcel = () => {
    downloadSuperadminSubscriptionsExcel(filteredSubs);
    showToast('Subscribers roster exported as Excel (.xls)');
  };

  const handlePrintRoster = () => {
    printSuperadminSubscriptionsRoster(filteredSubs);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setPlanFilter('all');
    setStatusFilter('all');
    setCycleFilter('all');
  };

  const hasActiveFilters = searchQuery !== '' || planFilter !== 'all' || statusFilter !== 'all' || cycleFilter !== 'all';

  const filteredSubs = useMemo(() => {
    return subs.filter((sub) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        sub.tenant.toLowerCase().includes(q) ||
        (sub.email ? sub.email.toLowerCase().includes(q) : false) ||
        (sub.plan && sub.plan.toLowerCase().includes(q)) ||
        (sub.phone && sub.phone.includes(q));

      const matchesPlan = planFilter === 'all' || sub.plan.toLowerCase() === planFilter.toLowerCase();
      const matchesStatus = statusFilter === 'all' || sub.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesCycle = cycleFilter === 'all' || (sub.cycle && sub.cycle.toLowerCase() === cycleFilter.toLowerCase());

      return matchesSearch && matchesPlan && matchesStatus && matchesCycle;
    });
  }, [subs, searchQuery, planFilter, statusFilter, cycleFilter]);

  const colDefs: SemanticColumnDef[] = useMemo(() => [
    {
      headerName: t('COPY.TABLE_COLUMN_TENANT'),
      field: 'tenant',
      flex: 1.4,
      cellRenderer: (p: SemanticCellParams) => (
        <div className="flex items-center gap-2.5 py-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
            <Building2 size={15} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-100 text-xs truncate">{String(p.value ?? '')}</p>
            <p className="text-[11px] text-slate-400 truncate font-mono">{String(p.data?.email ?? '')}</p>
          </div>
        </div>
      ),
    },
    {
      headerName: t('COPY.TABLE_COLUMN_PLAN'),
      field: 'plan',
      flex: 1,
      cellRenderer: (p: SemanticCellParams) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
          <Package size={11} className="text-indigo-400" />
          {String(p.value ?? '')}
        </span>
      ),
    },
    {
      headerName: t('COPY.TABLE_COLUMN_MRR'),
      field: 'mrr',
      flex: 0.8,
      cellRenderer: (p: SemanticCellParams) => (
        <span className="font-mono text-xs font-bold text-emerald-400">
          {formatSuperadminSubscriptionsMajorPreviewCurrency(Number(p.value ?? 0), 'INR', locale)}
        </span>
      ),
    },
    {
      headerName: t('COPY.TABLE_COLUMN_STATUS'),
      field: 'status',
      flex: 0.8,
      cellRenderer: (p: SemanticCellParams) => {
        const val = String(p.value ?? '');
        const isPaid = val === 'Paid';
        const isDue = val === 'Due Soon';
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
            isPaid ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400' :
            isDue ? 'border-amber-500/30 bg-amber-500/15 text-amber-400' :
            'border-rose-500/30 bg-rose-500/15 text-rose-400'
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isPaid ? 'bg-emerald-400' : isDue ? 'bg-amber-400' : 'bg-rose-400'}`} />
            {val}
          </span>
        );
      },
    },
    {
      headerName: t('COPY.TABLE_COLUMN_NEXT_RENEWAL'),
      field: 'renewalDate',
      flex: 0.9,
      cellRenderer: (p: SemanticCellParams) => (
        <span className="font-mono text-xs text-slate-300">
          {String(p.value ?? '')}
        </span>
      ),
    },
    {
      headerName: t('COPY.TABLE_COLUMN_ACTION'),
      field: 'action',
      flex: 0.8,
      cellRenderer: (p: SemanticCellParams) => {
        const sub = p.data as unknown as SuperadminSubscriptionRecord | undefined;
        if (!sub) return null;
        const testIdSuffix = getSuperadminInteractiveTestIdSuffix(sub);
        const rawPhone = sub.phone || '9876543210';
        let digits = rawPhone.replace(/\D/g, '');
        if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
        const normalizedPhone = digits.length === 10 ? `91${digits}` : digits;

        return (
          <div className="flex items-center gap-1.5 py-1">
            <a
              href={`https://wa.me/${normalizedPhone}?text=${encodeURIComponent(`Hello ${sub.tenant}, this is Smart Library SaaS regarding your ${sub.plan} subscription.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => showToast(`Opening WhatsApp Web for ${sub.tenant} (Zero API Cost)`)}
              className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:text-white hover:bg-emerald-600/30 transition-all shadow-xs cursor-pointer"
              title={`WhatsApp ${sub.tenant} (Free Web)`}
              aria-label={`WhatsApp ${sub.tenant}`}
              data-testid={`superadmin-subscriptions-active-subscribers-whatsapp-${testIdSuffix}`}
            >
              <MessageSquare size={13} className="text-emerald-400" />
            </a>

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
      {activeTab === 'Active Subscribers' && (
        <SuperadminSubscriptionsActiveSubscribersSemanticTable
          rowData={filteredSubs as unknown as readonly Record<string, unknown>[]}
          columnDefs={colDefs}
          pagination={true}
          paginationPageSize={10}
        />
      )}
    </div>
  );
}
