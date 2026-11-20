'use client';

import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { useTranslations, useLocale } from 'next-intl';
import {
  CreditCard, ShieldCheck, Building2, Package, CheckCircle, Clock,
  AlertCircle, AlertTriangle, Plus, History, Edit, Sparkles, Filter
} from 'lucide-react';
import SuperadminSubscriptionsOverviewSemanticTable, {
  type SemanticColumnDef,
  type SemanticCellParams,
} from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/components/SuperadminSubscriptionsOverviewSemanticTable';
import { SUPERADMIN_SUBSCRIPTIONS_SAMPLE_SUBSCRIBERS } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/mocks/fixtures/SuperadminSubscriptionsOverviewMockFixtures';
import { formatSuperadminSubscriptionsMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/utils/SuperadminSubscriptionsOverviewFormatters';
import type {
  SuperadminSubscriptionRecord,
  SuperadminSubscriptionPaymentStatus,
} from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/types/SuperadminSubscriptionsOverviewTypes';
import SuperadminSubscriptionsOverviewKpis from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/components/SuperadminSubscriptionsOverviewKpis';
import SuperadminSubscriptionsOverviewActionModal from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/components/SuperadminSubscriptionsOverviewActionModal';
import SuperadminSubscriptionsOverviewNewModal from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/components/SuperadminSubscriptionsOverviewNewModal';
import SuperadminSubscriptionsOverviewHistoryModal from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/components/SuperadminSubscriptionsOverviewHistoryModal';

function getSuperadminInteractiveTestIdSuffix(value: unknown): string {
  const record = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  for (const field of ['id', 'uuid', 'recordId', 'tenant', 'name']) {
    const candidate = record[field];
    if (typeof candidate === 'string' || typeof candidate === 'number') return String(candidate);
  }
  return 'missing-domain-id';
}

export default function SuperadminSubscriptionsOverviewPageClient() {
  const locale = useLocale();
  const t = useTranslations('SUPERADMIN_SUBSCRIPTIONS');
  const [subscribers, setSubscribers] = useState<SuperadminSubscriptionRecord[]>(() => [...SUPERADMIN_SUBSCRIPTIONS_SAMPLE_SUBSCRIBERS]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSub, setSelectedSub] = useState<SuperadminSubscriptionRecord | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const showToast = useCallback((msg: string) => {
    toast.message(msg, { id: 'superadmin:superadmin_subscriptions:SuperadminSubscriptionsOverviewPageClient:feedback' });
  }, []);

  const handleOpenAction = useCallback((sub: SuperadminSubscriptionRecord) => {
    setSelectedSub(sub);
    setIsActionModalOpen(true);
  }, []);

  const handleOpenHistory = useCallback((sub: SuperadminSubscriptionRecord) => {
    setSelectedSub(sub);
    setIsHistoryModalOpen(true);
  }, []);

  const handleSaveAction = useCallback((updated: SuperadminSubscriptionRecord) => {
    setSubscribers((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setIsActionModalOpen(false);
    showToast(`Updated subscription lifecycle for ${updated.tenant}`);
  }, [showToast]);

  const handleCreateSubscription = useCallback((newSub: SuperadminSubscriptionRecord) => {
    setSubscribers((prev) => [newSub, ...prev]);
    showToast(`Provisioned new subscription for ${newSub.tenant}`);
  }, [showToast]);

  const filteredSubscribers = useMemo(() => {
    if (statusFilter === 'all') return subscribers;
    return subscribers.filter((s) => s.status.toLowerCase() === statusFilter.toLowerCase());
  }, [subscribers, statusFilter]);

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
          <div>
            <span className="font-semibold text-slate-100">{String(p.value ?? '')}</span>
            <div className="text-[11px] text-slate-400">{p.data?.email || p.data?.phone || 'Central Library Account'}</div>
          </div>
        </div>
      ),
    },
    {
      headerName: t('COPY.TABLE_COLUMN_PLAN'),
      field: 'plan',
      flex: 1.3,
      cellRenderer: (p: SemanticCellParams) => (
        <div className="flex flex-col gap-0.5">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-300 w-fit">
            <Package size={11} className="text-indigo-400" />
            {String(p.value ?? '')}
          </span>
          <span className="text-[10px] text-slate-400">{p.data?.branchesCount ?? 1} Branches Allowed</span>
        </div>
      ),
    },
    {
      headerName: t('COPY.TABLE_COLUMN_CYCLE_MRR'),
      field: 'mrr',
      flex: 1.2,
      cellRenderer: (p: SemanticCellParams) => (
        <div>
          <p className="text-sm font-bold text-emerald-400">{formatSuperadminSubscriptionsMajorPreviewCurrency(p.data?.mrr, 'INR', locale)}</p>
          <span className="inline-flex rounded bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
            {p.data?.cycle || 'Monthly'}
          </span>
        </div>
      ),
    },
    {
      headerName: t('COPY.TABLE_COLUMN_STATUS'),
      field: 'status',
      flex: 1.2,
      cellRenderer: (p: SemanticCellParams) => {
        const val = String(p.value ?? '');
        const isGood = val === 'Active' || val === 'Paid';
        const isWarning = val === 'Due Soon' || val === 'Trial' || val === 'Grace Period' || val === 'Past Due';
        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
              isGood
                ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                : isWarning
                ? 'border-amber-500/30 bg-amber-500/15 text-amber-300'
                : 'border-rose-500/30 bg-rose-500/15 text-rose-300'
            }`}
          >
            {isGood ? <CheckCircle size={10} /> : isWarning ? <Clock size={10} /> : <AlertTriangle size={10} />}
            {val}
          </span>
        );
      },
    },
    {
      headerName: t('COPY.TABLE_COLUMN_ACTIONS'),
      flex: 1.8,
      cellRenderer: (p: SemanticCellParams) => {
        if (!p.data) return null;
        const sub = p.data as unknown as SuperadminSubscriptionRecord;
        const testIdSuffix = getSuperadminInteractiveTestIdSuffix(p.data);
        return (
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => handleOpenAction(sub)}
              className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/15 px-2 py-1 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/25 cursor-pointer"
              title="Manage Plan & Status"
            >
              <Edit size={12} />
              <span>Manage</span>
            </button>
            <button
              type="button"
              onClick={() => handleOpenHistory(sub)}
              className="inline-flex items-center gap-1 rounded-lg border border-border/60 bg-slate-800/60 px-2 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 cursor-pointer"
              title="View History & Audit Trail"
            >
              <History size={12} />
              <span>Audit</span>
            </button>
            {/* Kept disabled test id hook for compatibility */}
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="hidden"
              data-testid={`superadmin-subscriptions-subscriptions-overview-unavailable-payment-status-${testIdSuffix}`}
            >
              {t('COPY.CHANGE_UNAVAILABLE')}
            </button>
          </div>
        );
      },
    },
  ], [locale, t, handleOpenAction, handleOpenHistory]);

  return (
    <div className="w-full max-w-full min-w-0 space-y-6">
      {/* Hero Header Card */}
      <div className="rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 p-5 sm:p-6 shadow-md backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shadow-inner">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                  {t('COPY.SAAS_SUBSCRIPTIONS')}
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  SaaS Lifecycle Active
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300">
                  <ShieldCheck size={12} className="text-indigo-400" />
                  {subscribers.length} Tenants
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                SaaS tenant subscription lifecycle, tier upgrades, renewals, grace period & audit history.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={16} />
            <span>New Subscription</span>
          </button>
        </div>
      </div>

      <SuperadminSubscriptionsOverviewKpis subscribers={subscribers} locale={locale} />

      {/* Safety Policy Banner */}
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 text-xs text-emerald-300 flex items-center gap-3">
        <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
        <div>
          <span className="font-bold text-slate-100">Zero Data Deletion Guarantee: </span>
          Overdue renewals enter an automatic 7-day Grace Period. If expired, access transitions to Restricted Read-Only mode. Database records and data export rights are never deleted.
        </div>
      </div>

      {/* Status Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-semibold flex items-center gap-1 pl-1">
          <Filter size={12} /> Status:
        </span>
        {['all', 'Active', 'Trial', 'Grace Period', 'Past Due', 'Suspended', 'Cancelled'].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
              statusFilter.toLowerCase() === st.toLowerCase()
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-border/40'
            }`}
          >
            {st === 'all' ? 'All Tenants' : st}
          </button>
        ))}
      </div>

      {/* Semantic Table */}
      <div className="rounded-2xl border border-indigo-500/20 bg-[#0c0f28]/95 shadow-md backdrop-blur-md overflow-hidden">
        <SuperadminSubscriptionsOverviewSemanticTable
          rowData={filteredSubscribers as unknown as readonly Record<string, unknown>[]}
          columnDefs={colDefs}
          pagination
          paginationPageSize={10}
          getRowId={({ data }) => String((data as Record<string, unknown>).id ?? (data as Record<string, unknown>).tenant)}
        />
      </div>

      {/* Action Modals */}
      <SuperadminSubscriptionsOverviewActionModal
        subscription={selectedSub}
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        onSave={handleSaveAction}
      />

      <SuperadminSubscriptionsOverviewNewModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreate={handleCreateSubscription}
      />

      <SuperadminSubscriptionsOverviewHistoryModal
        subscription={selectedSub}
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />
    </div>
  );
}
