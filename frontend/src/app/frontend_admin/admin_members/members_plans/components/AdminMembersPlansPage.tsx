'use client';

import AdminPlansDeleteDialog from '@/app/frontend_admin/admin_members/members_plans/components/AdminMembersPlansDeleteDialog';
import AdminPlansFormDialog from '@/app/frontend_admin/admin_members/members_plans/components/AdminMembersPlansFormDialog';
import { AdminMembersPlansKpiGrid } from '@/app/frontend_admin/admin_members/members_plans/components/AdminMembersPlansKpiGrid';
import { AdminMembersPlansPlanCard } from '@/app/frontend_admin/admin_members/members_plans/components/AdminMembersPlansPlanCard';
import { AdminMembersPlansPricingRuleSettings } from '@/app/frontend_admin/admin_members/members_plans/components/AdminMembersPlansPricingRuleSettings';
import { ADMIN_PLANS_STATUS_VALUES } from '@/app/frontend_admin/admin_members/members_plans/config/admin_members_plans.url_config';
import { useAdminPlans } from '@/app/frontend_admin/admin_members/members_plans/hooks/useAdminMembersPlansMain';
import type { AdminPlansFormValues, AdminPlansPlan } from '@/app/frontend_admin/admin_members/members_plans/schemas/AdminMembersPlansSchema';
import type { AdminPlansEmptyStateProps } from '@/app/frontend_admin/admin_members/members_plans/types/AdminMembersPlansComponentTypes';
import {
  exportPlansCsv,
  exportPlansExcel,
  formatAdminPlansPrice,
  printPlansCatalogHtml,
  removeAdminPlansDemoPlan,
  upsertAdminPlansDemoPlan,
} from '@/app/frontend_admin/admin_members/members_plans/utils/adminMembersPlansExports';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { Download, FileSpreadsheet, Plus, Printer, Search } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

export { formatAdminPlansPrice, upsertAdminPlansDemoPlan, removeAdminPlansDemoPlan };

const DEFAULT_DEMO_PLANS: AdminPlansPlan[] = [
  {
    id: 'demo-plan-1',
    name: 'Full Day Dedicated Desk',
    price: 6500,
    currencyCode: 'INR',
    amountUnit: 'major',
    duration: 'Monthly',
    durationDays: 30,
    features: ['Reserved personal desk & ergonomic chair', 'High-speed Wi-Fi & power socket', 'Free tea/coffee & locker included'],
    status: 'Active',
    subscribers: 28,
    branchApplicability: 'Downtown Central',
  },
  {
    id: 'demo-plan-2',
    name: 'Flexi Shift Half Day',
    price: 3800,
    currencyCode: 'INR',
    amountUnit: 'major',
    duration: 'Monthly',
    durationDays: 30,
    features: ['6-hour flexible access morning or evening', 'High-speed Wi-Fi & silent zone', 'Cafeteria access'],
    status: 'Active',
    subscribers: 42,
    branchApplicability: 'All Branches',
  },
  {
    id: 'demo-plan-3',
    name: 'Night Owl Special',
    price: 3200,
    currencyCode: 'INR',
    amountUnit: 'major',
    duration: 'Monthly',
    durationDays: 30,
    features: ['10 PM to 6 AM uninterrupted access', 'Dedicated charging slot', 'Security & CCTV guarded'],
    status: 'Active',
    subscribers: 15,
    branchApplicability: 'Westside Branch',
  },
  {
    id: 'demo-plan-4',
    name: 'Weekend Warrior Pass',
    price: 1800,
    currencyCode: 'INR',
    amountUnit: 'major',
    duration: 'Monthly',
    durationDays: 30,
    features: ['Saturday & Sunday unlimited access', 'High-speed Wi-Fi', 'Discussion room credits'],
    status: 'Active',
    subscribers: 19,
    branchApplicability: 'North Hub',
  },
];

export default function AdminPlansPage() {
  const t = useTranslations('ADMIN_PLANS');
  const locale = useLocale();
  const isDemoMode = isFrontendDemoModeEnabled();
  const { selectedBranch, isAllBranches } = useAdminBranch();
  const plansQuery = useAdminPlans(!isDemoMode);
  const [demoPlans, setDemoPlans] = useState<AdminPlansPlan[]>(() => (isDemoMode ? [...DEFAULT_DEMO_PLANS] : []));
  const plans: AdminPlansPlan[] = isDemoMode ? demoPlans : plansQuery.data ?? [];
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');

  const visiblePlans = useMemo(
    () =>
      plans.filter((plan) => {
        if (!isAllBranches && selectedBranch && plan.branchApplicability && plan.branchApplicability !== 'All Branches') {
          const bName = plan.branchApplicability.toLowerCase();
          const sName = selectedBranch.name.toLowerCase();
          if (!bName.includes(sName) && !sName.includes(bName)) return false;
        }
        if (statusFilter !== 'all' && plan.status !== statusFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matches =
            plan.name.toLowerCase().includes(q) ||
            plan.duration.toLowerCase().includes(q) ||
            String(plan.price).includes(q) ||
            plan.features.some((f) => f.toLowerCase().includes(q)) ||
            (plan.branchApplicability?.toLowerCase().includes(q) ?? false);
          if (!matches) return false;
        }
        return true;
      }),
    [plans, selectedBranch, isAllBranches, statusFilter, searchQuery],
  );

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const editingPlan = editingId === null ? null : plans.find((plan) => plan.id === editingId) ?? null;
  const planToDelete = deleteId === null ? null : plans.find((plan) => plan.id === deleteId) ?? null;

  const closeForm = useCallback(() => setShowForm(false), []);
  const closeDeleteDialog = useCallback(() => setDeleteId(null), []);
  const handleCreate = () => { if (!isDemoMode) return; setEditingId(null); setShowForm(true); };
  const handleEdit = (plan: AdminPlansPlan) => { if (!isDemoMode) return; setEditingId(plan.id); setShowForm(true); };

  const handleValidatePlan = (values: AdminPlansFormValues) => {
    if (!isDemoMode) { toast.info(t('PERSISTENCE_BLOCKED'), { id: 'admin_members-members_plans-components-AdminMembersPlansPage-toast-35-1' }); return; }
    const editing = editingId !== null;
    const nextPlan: AdminPlansPlan = {
      id: editingId ?? `demo-plan-${Date.now()}`,
      name: values.name.trim(),
      price: Number(values.price),
      currencyCode: 'INR',
      amountUnit: 'major',
      duration: values.duration.trim(),
      durationDays: Number(values.durationDays),
      features: values.features.split('\n').map((feature) => feature.trim()).filter(Boolean),
      status: editingPlan?.status ?? ADMIN_PLANS_STATUS_VALUES[0],
      subscribers: editingPlan?.subscribers ?? 0,
      branchApplicability: values.branchApplicability || 'All Branches',
      morningRate: values.morningRate?.trim() || undefined,
      afternoonRate: values.afternoonRate?.trim() || undefined,
      eveningRate: values.eveningRate?.trim() || undefined,
      nightRate: values.nightRate?.trim() || undefined,
      fullDayRate: values.fullDayRate?.trim() || undefined,
      multiShiftDiscount: values.multiShiftDiscount?.trim() || undefined,
    };
    setDemoPlans((current) => upsertAdminPlansDemoPlan(current, nextPlan));
    toast.success(t(editing ? 'DEMO_PLAN_UPDATED' : 'DEMO_PLAN_CREATED', { name: nextPlan.name }), { id: 'admin_members-members_plans-components-AdminMembersPlansPage-toast-48-2' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = () => {
    if (!isDemoMode || !deleteId) { if (!isDemoMode) toast.info(t('DELETE_BLOCKED'), { id: 'admin_members-members_plans-components-AdminMembersPlansPage-toast-53-3' }); return; }
    setDemoPlans((current) => removeAdminPlansDemoPlan(current, deleteId));
    toast.success(t('DEMO_PLAN_DELETED', { name: planToDelete?.name ?? '' }), { id: 'admin_members-members_plans-components-AdminMembersPlansPage-toast-55-4' });
    setDeleteId(null);
  };

  return (
    <div className="w-full space-y-6 text-text-primary pb-10">
      {!isDemoMode && <p role="status" className="mb-4 rounded-xl border border-warning bg-warning-bg p-4 text-warning-text">{t('PERSISTENCE_BLOCKED')}</p>}

      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">{t('PAGE_TITLE')}</h1>
            <p className="text-xs sm:text-sm text-text-secondary">{t('PAGE_SUBTITLE')}</p>
          </div>
          <button
            type="button"
            data-testid="admin_plans-AdminMembersPlansMain-control-001"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-on-primary shadow-card hover:bg-primary-hover motion-safe:transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            onClick={handleCreate}
            disabled={!isDemoMode}
            title={!isDemoMode ? t('PERSISTENCE_BLOCKED') : undefined}
          >
            <Plus size={16} strokeWidth={2} aria-hidden="true" />
            <span>{t('CREATE_PLAN')}</span>
          </button>
        </div>
      </div>

      <AdminMembersPlansKpiGrid plans={visiblePlans} />

      <AdminMembersPlansPricingRuleSettings />

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-3 shadow-card">
        <div className="relative min-w-[260px] max-w-sm flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" aria-hidden="true" />
          <input
            maxLength={100}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plans by name, feature, duration, or branch..."
            className="w-full rounded-xl border border-border bg-input py-2 pl-9 pr-3 text-xs text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-border bg-surface-highlight p-1">
            {(['all', 'Active', 'Inactive'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold motion-safe:transition-colors ${
                  statusFilter === status ? 'bg-primary text-on-primary shadow-card' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                }`}
              >
                {status === 'all' ? 'All Plans' : status}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => exportPlansCsv(visiblePlans)} disabled={visiblePlans.length === 0} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-info bg-info-bg px-3 py-1.5 text-xs font-medium text-info-text hover:opacity-90 motion-safe:transition-opacity disabled:cursor-not-allowed disabled:opacity-40" title="Export Plans to CSV">
              <Download size={14} strokeWidth={2} aria-hidden="true" /><span>CSV</span>
            </button>
            <button type="button" onClick={() => exportPlansExcel(visiblePlans)} disabled={visiblePlans.length === 0} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-success bg-success-bg px-3 py-1.5 text-xs font-medium text-success-text hover:opacity-90 motion-safe:transition-opacity disabled:cursor-not-allowed disabled:opacity-40" title="Export Plans to Excel (.xls)">
              <FileSpreadsheet size={14} strokeWidth={2} aria-hidden="true" /><span>Excel</span>
            </button>
            <button type="button" onClick={() => printPlansCatalogHtml(visiblePlans, selectedBranch?.name)} disabled={visiblePlans.length === 0} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-border-focus bg-primary-subtle px-3 py-1.5 text-xs font-medium text-primary hover:opacity-90 motion-safe:transition-opacity disabled:cursor-not-allowed disabled:opacity-40" title="Print Plans Roster">
              <Printer size={14} strokeWidth={2} aria-hidden="true" /><span>Print</span>
            </button>
          </div>
        </div>
      </div>

      {!isDemoMode && plansQuery.isError ? (
        <div role="alert" className="rounded-2xl border border-danger bg-danger-bg p-6 text-danger-text">
          {t('LOAD_ERROR')}
          <button type="button" className="ml-3 rounded-xl border border-danger px-3 py-1.5 text-xs font-semibold text-danger-text hover:opacity-90" onClick={() => { void plansQuery.refetch(); }}>
            {t('RETRY')}
          </button>
        </div>
      ) : null}
      {!isDemoMode && plansQuery.isPending ? <div role="status" className="rounded-2xl border border-border bg-card p-8 text-center text-text-secondary">{t('LOADING')}</div> : null}
      {(isDemoMode || (!plansQuery.isPending && !plansQuery.isError)) && visiblePlans.length === 0 ? <div role="status" className="rounded-2xl border border-border bg-card p-8 text-center text-text-secondary">{t('EMPTY')}</div> : null}
      {(isDemoMode || (!plansQuery.isPending && !plansQuery.isError)) && visiblePlans.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {visiblePlans.map((plan) => (
            <AdminMembersPlansPlanCard key={plan.id} plan={plan} locale={locale} isDemoMode={isDemoMode} onEdit={handleEdit} onDelete={setDeleteId} />
          ))}
        </div>
      ) : null}

      <AdminPlansFormDialog open={showForm} editingPlan={editingPlan} onClose={closeForm} onValidated={handleValidatePlan} />
      <AdminPlansDeleteDialog open={deleteId !== null} planName={planToDelete?.name ?? ''} onClose={closeDeleteDialog} onConfirm={handleDelete} />
    </div>
  );
}

/** Standardized empty state component for lists/tables in the admin_plans module. */
export function AdminPlansEmptyState({ title, description }: AdminPlansEmptyStateProps) {
  const t = useTranslations('ADMIN_PLANS');
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center text-text-secondary border border-dashed border-border rounded-lg">
      <p className="font-medium text-text-primary">{title ?? t('EMPTY_STATE_TITLE')}</p>
      <p className="text-sm mt-1">{description ?? t('EMPTY_STATE_DESCRIPTION')}</p>
    </div>
  );
}
