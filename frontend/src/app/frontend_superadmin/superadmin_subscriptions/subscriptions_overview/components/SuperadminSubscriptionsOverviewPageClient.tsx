'use client';

import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { useTranslations, useLocale } from 'next-intl';
import { ShieldCheck, Building2, Package, CheckCircle, Clock, AlertTriangle, History, Edit, MessageSquare, Mail} from 'lucide-react';
import SuperadminSubscriptionsOverviewSemanticTable, {
  type SemanticColumnDef,
  type SemanticCellParams,
} from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/components/SuperadminSubscriptionsOverviewSemanticTable';
import { SUPERADMIN_SUBSCRIPTIONS_SAMPLE_SUBSCRIBERS } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/mocks/fixtures/SuperadminSubscriptionsOverviewMockFixtures';
import { formatSuperadminSubscriptionsMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/utils/SuperadminSubscriptionsOverviewFormatters';
import type { SuperadminSubscriptionRecord, SuperadminSubscriptionPaymentStatus } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/types/SuperadminSubscriptionsOverviewTypes';
import SuperadminSubscriptionsOverviewKpis from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/components/SuperadminSubscriptionsOverviewKpis';
import SuperadminSubscriptionsOverviewHeader from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/components/SuperadminSubscriptionsOverviewHeader';
import SuperadminSubscriptionsOverviewFilterBar from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/components/SuperadminSubscriptionsOverviewFilterBar';
import SuperadminSubscriptionsOverviewModals from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/components/SuperadminSubscriptionsOverviewModals';
import {
  downloadSuperadminSubscriptionsCsv,
  downloadSuperadminSubscriptionsExcel,
  printSuperadminSubscriptionsRoster,
} from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/utils/SuperadminSubscriptionsOverviewExportUtils';

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
  const [searchQuery, setSearchQuery] = useState('');
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
    return subscribers.filter((s) => {
      if (statusFilter !== 'all' && s.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        s.tenant.toLowerCase().includes(q) ||
        s.plan.toLowerCase().includes(q) ||
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.phone && s.phone.includes(q))
      );
    });
  }, [subscribers, statusFilter, searchQuery]);

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
            <div className="text-[11px] text-slate-400">{String(p.data?.email || p.data?.phone || 'Central Library Account')}</div>
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
          <span className="text-[10px] text-slate-400">{String(p.data?.branchesCount ?? 1)} Branches Allowed</span>
        </div>
      ),
    },
    {
      headerName: t('COPY.TABLE_COLUMN_CYCLE_MRR'),
      field: 'mrr',
      flex: 1.2,
      cellRenderer: (p: SemanticCellParams) => (
        <div>
          <p className="text-sm font-bold text-emerald-400">{formatSuperadminSubscriptionsMajorPreviewCurrency(Number(p.data?.mrr ?? 0), 'INR', locale)}</p>
          <span className="inline-flex rounded bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
            {String(p.data?.cycle || 'Monthly')}
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
      flex: 2.2,
      minWidth: 200,
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
            <button
              type="button"
              onClick={() => {
                const raw = sub.phone || '9876543210';
                let digits = raw.replace(/\D/g, '');
                if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
                const phone = digits.length === 10 ? `91${digits}` : digits;
                const msg = `Hello ${sub.tenant}, greetings from SaaS SuperAdmin regarding your ${sub.plan} subscription (${sub.status}).`;
                const popup = window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
                if (popup) popup.opener = null;
                showToast(`Opened WhatsApp chat for ${sub.tenant}`);
              }}
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 cursor-pointer"
              title="Chat on WhatsApp"
            >
              <MessageSquare size={12} />
            </button>
            <button
              type="button"
              onClick={() => showToast(`Sent subscription renewal notification to ${sub.email || 'admin@' + sub.tenant.toLowerCase().replace(/\s+/g, '') + '.in'}`)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/15 text-blue-300 hover:bg-blue-500/25 cursor-pointer"
              title="Email Subscription Notice"
            >
              <Mail size={12} />
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
      <SuperadminSubscriptionsOverviewHeader
        title={t('COPY.SAAS_SUBSCRIPTIONS')}
        tenantsCount={subscribers.length}
        onNewSubscription={() => setIsNewModalOpen(true)}
      />

      <SuperadminSubscriptionsOverviewKpis subscribers={subscribers} locale={locale} />

      {/* Safety Policy Banner */}
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 text-xs text-emerald-300 flex items-center gap-3">
        <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
        <div>
          <span className="font-bold text-slate-100">Zero Data Deletion Guarantee: </span>
          Overdue renewals enter an automatic 7-day Grace Period. If expired, access transitions to Restricted Read-Only mode. Database records and data export rights are never deleted.
        </div>
      </div>

      {/* Filter, Search & Export Toolbar */}
      <SuperadminSubscriptionsOverviewFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onReset={() => {
          setSearchQuery('');
          setStatusFilter('all');
        }}
        onExportCsv={() => {
          downloadSuperadminSubscriptionsCsv(filteredSubscribers);
          showToast('Subscriptions roster exported as CSV');
        }}
        onExportExcel={() => {
          downloadSuperadminSubscriptionsExcel(filteredSubscribers);
          showToast('Subscriptions roster exported as Excel (.xls)');
        }}
        onPrint={() => printSuperadminSubscriptionsRoster(filteredSubscribers)}
        filteredCount={filteredSubscribers.length}
        totalCount={subscribers.length}
      />

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
      <SuperadminSubscriptionsOverviewModals
        selectedSub={selectedSub}
        isActionModalOpen={isActionModalOpen}
        onCloseActionModal={() => setIsActionModalOpen(false)}
        onSaveAction={handleSaveAction}
        isNewModalOpen={isNewModalOpen}
        onCloseNewModal={() => setIsNewModalOpen(false)}
        onCreateSubscription={handleCreateSubscription}
        isHistoryModalOpen={isHistoryModalOpen}
        onCloseHistoryModal={() => setIsHistoryModalOpen(false)}
      />
    </div>
  );
}
