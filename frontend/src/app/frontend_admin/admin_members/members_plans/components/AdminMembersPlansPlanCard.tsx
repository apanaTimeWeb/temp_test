'use client';

import { ADMIN_PLANS_STATUS_VALUES } from '@/app/frontend_admin/admin_members/members_plans/config/admin_members_plans.url_config';
import type { AdminPlansPlan } from '@/app/frontend_admin/admin_members/members_plans/schemas/AdminMembersPlansSchema';
import { formatAdminPlansPrice } from '@/app/frontend_admin/admin_members/members_plans/utils/adminMembersPlansExports';
import { Building2, CheckCircle, Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AdminMembersPlansPlanCardProps {
  plan: AdminPlansPlan;
  locale: string;
  isDemoMode: boolean;
  onEdit: (plan: AdminPlansPlan) => void;
  onDelete: (planId: string) => void;
}

export function AdminMembersPlansPlanCard({
  plan,
  locale,
  isDemoMode,
  onEdit,
  onDelete,
}: AdminMembersPlansPlanCardProps) {
  const t = useTranslations('ADMIN_PLANS');
  const localizedStatus =
    plan.status === ADMIN_PLANS_STATUS_VALUES[0]
      ? t('STATUS_ACTIVE')
      : plan.status === ADMIN_PLANS_STATUS_VALUES[1]
        ? t('STATUS_INACTIVE')
        : t('STATUS_UNKNOWN');
  const isActive = plan.status === ADMIN_PLANS_STATUS_VALUES[0];
  const branchBadgeClass =
    !plan.branchApplicability || plan.branchApplicability === 'All Branches'
      ? 'border-info bg-info-bg text-info-text'
      : plan.branchApplicability.includes('Downtown')
        ? 'border-success bg-success-bg text-success-text'
        : plan.branchApplicability.includes('Westside')
          ? 'border-warning bg-warning-bg text-warning-text'
          : 'border-border-focus bg-primary-subtle text-primary';

  return (
    <div
      className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:-translate-y-1 hover:border-border-focus"
      data-admin-inactive={plan.status === ADMIN_PLANS_STATUS_VALUES[1] ? 'true' : 'false'}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-text-primary tracking-tight leading-snug">{plan.name}</h3>
          <span
            data-testid={`admin_plans-AdminMembersPlansMain-plan-status-${plan.id}`}
            aria-label={`${plan.name} ${t('STATUS_SUFFIX')}: ${localizedStatus}`}
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
              isActive ? 'border-success bg-success-bg text-success-text' : 'border-danger bg-danger-bg text-danger-text'
            }`}
          >
            {localizedStatus}
          </span>
        </div>

        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-text-primary" aria-label={t('PRICE')}>
            {formatAdminPlansPrice(plan.price, plan.currencyCode, plan.amountUnit, locale)}
          </span>
          <span className="text-xs text-text-secondary">/ {t('DURATION_DAYS', { count: plan.durationDays })}</span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span
            data-testid="admin_plans-AdminMembersPlansMain-state-004"
            className="inline-flex items-center gap-1 rounded-full border border-border-focus bg-primary-subtle px-2.5 py-0.5 text-[11px] font-medium text-primary"
          >
            👥 {plan.subscribers} {t('ACTIVE_SUBSCRIBERS')}
          </span>
          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${branchBadgeClass}`}>
            <Building2 size={11} className="shrink-0" aria-hidden="true" />
            <span>{plan.branchApplicability || 'All Branches'}</span>
          </span>
        </div>

        <div className="mt-4 border-t border-border pt-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">{t('FEATURES')}</p>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-xs text-text-primary">
                <CheckCircle size={14} className="mt-0.5 shrink-0 text-success-text" strokeWidth={2} aria-hidden="true" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-1.5 border-t border-border pt-3">
        <button
          type="button"
          data-testid={`admin_plans-AdminMembersPlansMain-edit-${plan.id}`}
          aria-label={`${t('EDIT')} ${plan.name}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-highlight text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => onEdit(plan)}
          disabled={!isDemoMode}
          title={!isDemoMode ? t('PERSISTENCE_BLOCKED') : t('EDIT')}
        >
          <Pencil size={15} strokeWidth={2} aria-hidden="true" />
        </button>
        <button
          type="button"
          data-testid={`admin_plans-AdminMembersPlansMain-delete-${plan.id}`}
          aria-label={`${t('DELETE')} ${plan.name}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-highlight text-danger-text hover:bg-danger-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => onDelete(plan.id)}
          disabled={!isDemoMode}
          title={!isDemoMode ? t('DELETE_BLOCKED') : t('DELETE')}
        >
          <Trash2 size={15} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
