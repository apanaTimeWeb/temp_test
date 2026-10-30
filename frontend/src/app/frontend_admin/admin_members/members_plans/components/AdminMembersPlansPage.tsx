import { useCallback, useState } from 'react';
import { CheckCircle, Pencil, Plus, Trash2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import toast from 'sonner';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { useAdminPlans } from '@/app/frontend_admin/admin_members/members_plans/hooks/useAdminMembersPlansMain';
import type { AdminPlansPlan, AdminPlansFormValues } from '@/app/frontend_admin/admin_members/members_plans/schemas/AdminMembersPlansSchema';
import { ADMIN_PLANS_STATUS_VALUES } from '@/app/frontend_admin/admin_members/members_plans/config/admin_members_plans.url_config';
import AdminPlansFormDialog from '@/app/frontend_admin/admin_members/members_plans/components/AdminMembersPlansFormDialog';
import AdminPlansDeleteDialog from '@/app/frontend_admin/admin_members/members_plans/components/AdminMembersPlansDeleteDialog';

import type { AdminPlansEmptyStateProps } from '@/app/frontend_admin/admin_members/members_plans/types/AdminMembersPlansComponentTypes';

// RESPONSIBILITY: Owns the admin membership-plans page composition and local demo-only actions.
'use client';












/** Formats prices only when the source record explicitly declares currency and unit. */
export function formatAdminPlansPrice(amount: number, currencyCode: string | undefined, amountUnit: 'minor' | 'major' | undefined, locale: string): string {
  if (!currencyCode || !/^[A-Z]{3}$/.test(currencyCode) || amountUnit === undefined || !Number.isFinite(amount) || amount < 0) return '—';
  const resolvedLocale = locale === 'hi' ? 'hi-IN' : locale === 'en' ? 'en-IN' : locale;
  const formatter = new Intl.NumberFormat(resolvedLocale, { style: 'currency', currency: currencyCode });
  const fractionDigits = formatter.resolvedOptions().maximumFractionDigits ?? 2;
  if (amountUnit === 'minor' && !Number.isSafeInteger(amount)) return '—';
  const major = amountUnit === 'minor' ? amount / (10 ** fractionDigits) : amount;
  return formatter.format(major);
}

/** Performs an immutable insert-or-replace in page-local demo state. */
export function upsertAdminPlansDemoPlan(plans: readonly AdminPlansPlan[], nextPlan: AdminPlansPlan): AdminPlansPlan[] {
  const exists = plans.some((plan) => plan.id === nextPlan.id);
  return exists ? plans.map((plan) => plan.id === nextPlan.id ? nextPlan : plan) : [nextPlan, ...plans];
}

/** Removes only the requested plan from page-local demo state. */
export function removeAdminPlansDemoPlan(plans: readonly AdminPlansPlan[], planId: string): AdminPlansPlan[] {
  return plans.filter((plan) => plan.id !== planId);
}

export default function AdminPlansPage() {
  const t = useTranslations('ADMIN_PLANS');
  const locale = useLocale();
  const isDemoMode = isFrontendDemoModeEnabled();
  const plansQuery = useAdminPlans(!isDemoMode);
  const [demoPlans, setDemoPlans] = useState<AdminPlansPlan[]>([]);
  const plans: AdminPlansPlan[] = isDemoMode ? demoPlans : plansQuery.data ?? [];
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
    <div className="pb-10" >
      {!isDemoMode && <p role="status" className="mb-4 rounded-lg border border-warning-bg bg-warning-bg p-4 text-warning-text">{t('PERSISTENCE_BLOCKED')}</p>}
      <div className="admin-page-header admin-shared-section-divider">
        <div>
          <p className="admin-breadcrumb">{t('BREADCRUMB')}</p>
          <h1 className="admin-page-title">{t('PAGE_TITLE')}</h1>
          <p className="admin-page-subtitle">{t('PAGE_SUBTITLE')}</p>
        </div>
        <div className="admin-page-actions">
          <button type="button" data-testid="admin_plans-AdminMembersPlansMain-control-001" className="admin-btn-primary disabled:cursor-not-allowed disabled:opacity-60" onClick={handleCreate} disabled={!isDemoMode} title={!isDemoMode ? t('PERSISTENCE_BLOCKED') : undefined}>
            <Plus size={18} strokeWidth={2} /> {t('CREATE_PLAN')}
          </button>
        </div>
      </div>
      {!isDemoMode && plansQuery.isError ? (
        <div role="alert" className="rounded-lg border border-border bg-card p-6 text-danger-text">
          {t('LOAD_ERROR')}
          <button type="button" className="ml-3 rounded border border-border px-3 py-2 text-primary" onClick={() => window.location.reload()}>{t('RETRY')}</button>
        </div>
      ) : null}
      {!isDemoMode && plansQuery.isPending ? <div role="status" className="rounded-lg border border-border bg-card p-8 text-center text-text-secondary">{t('LOADING')}</div> : null}
      {(isDemoMode || (!plansQuery.isPending && !plansQuery.isError)) && plans.length === 0 ? <div role="status" className="rounded-lg border border-border bg-card p-8 text-center text-text-secondary">{t('EMPTY')}</div> : null}
      {(isDemoMode || (!plansQuery.isPending && !plansQuery.isError)) && plans.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
          {plans.map((plan) => {
            const localizedStatus = plan.status === ADMIN_PLANS_STATUS_VALUES[0]
              ? t('STATUS_ACTIVE')
              : plan.status === ADMIN_PLANS_STATUS_VALUES[1]
                ? t('STATUS_INACTIVE')
                : t('STATUS_UNKNOWN');
            return (
              <div key={plan.id} className="admin-plan-card" data-admin-inactive={plan.status === ADMIN_PLANS_STATUS_VALUES[1] ? 'true' : 'false'}>
                <div className="admin-shared-row-between">
                  <div><h3 className="admin-shared-card-title">{plan.name}</h3></div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span data-testid={`admin_plans-AdminMembersPlansMain-plan-status-${plan.id}`} aria-label={`${plan.name} ${t('STATUS_SUFFIX')}: ${localizedStatus}`} className={`admin-badge ${plan.status === ADMIN_PLANS_STATUS_VALUES[0] ? 'admin-badge-success' : plan.status === ADMIN_PLANS_STATUS_VALUES[1] ? 'admin-badge-danger' : 'admin-badge-neutral'} admin-shared-interactive-cursor`}>
                      {localizedStatus}
                    </span>
                  </div>
                </div>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-3xl font-extrabold leading-none text-text-primary" aria-label={t('PRICE')}>{formatAdminPlansPrice(plan.price, plan.currencyCode, plan.amountUnit, locale)}</span>
                  <span className="ml-1 text-ui text-text-secondary">/ {t('DURATION_DAYS', { count: plan.durationDays })}</span>
                </div>
                <div><span data-testid="admin_plans-AdminMembersPlansMain-state-004" className="admin-badge admin-badge-info">👥 {plan.subscribers} {t('ACTIVE_SUBSCRIBERS')}</span></div>
                <div className="border-t border-border pt-3">
                  <p className="mb-2 text-badge font-semibold uppercase tracking-[0.07em] text-text-secondary">{t('FEATURES')}</p>
                  <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                    {plan.features.map((feature) => <li key={feature} className="flex items-start gap-1.5 text-ui text-text-primary"><CheckCircle size={18} className="mt-0.5 shrink-0 text-success-text" strokeWidth={2} /><span>{feature}</span></li>)}
                  </ul>
                </div>
                <div className="flex justify-end gap-1.5 border-t border-border pt-3">
                  <button type="button" data-testid={`admin_plans-AdminMembersPlansMain-edit-${plan.id}`} aria-label={`${t('EDIT')} ${plan.name}`} className="admin-btn-icon disabled:cursor-not-allowed disabled:opacity-60 text-info-text" onClick={() => handleEdit(plan)} disabled={!isDemoMode} title={!isDemoMode ? t('PERSISTENCE_BLOCKED') : t('EDIT')}><Pencil size={18} strokeWidth={2} /></button>
                  <button type="button" data-testid={`admin_plans-AdminMembersPlansMain-delete-${plan.id}`} aria-label={`${t('DELETE')} ${plan.name}`} className="admin-btn-icon disabled:cursor-not-allowed disabled:opacity-60 admin-shared-text-danger" onClick={() => setDeleteId(plan.id)} disabled={!isDemoMode} title={!isDemoMode ? t('DELETE_BLOCKED') : t('DELETE')}><Trash2 size={18} strokeWidth={2} /></button>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
      <AdminPlansFormDialog open={showForm} editingPlan={editingPlan} onClose={closeForm} onValidated={handleValidatePlan} />
      <AdminPlansDeleteDialog open={deleteId !== null} planName={planToDelete?.name ?? ''} onClose={closeDeleteDialog} onConfirm={handleDelete} />
    </div>
  );
}

// Responsibility: AdminPlansEmptyState component owned by admin_plans; responsibility folder: admin_plans_empty_state.
'use client';





// RESPONSIBILITY: Standardized empty state component for lists/tables in the admin_plans module.
// DATA FLOW: Parent -> AdminPlansEmptyState -> DOM

export function AdminPlansEmptyState({ title, description }: AdminPlansEmptyStateProps) {
  const t = useTranslations('ADMIN_PLANS');
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center text-text-secondary border border-dashed rounded-lg">
      <p className="font-medium text-text-primary">{title ?? t('EMPTY_STATE_TITLE')}</p>
      <p className="text-sm mt-1">{description ?? t('EMPTY_STATE_DESCRIPTION')}</p>
    </div>
  );
}
