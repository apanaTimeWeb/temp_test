'use client';
// RESPONSIBILITY: Render the recovery fallback for errors in the components feature. It does not own backend persistence or cross-feature business logic.

// RESPONSIBILITY: Render the recovery fallback for errors in the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';
import type { ManagerMembersGroupAdmissionErrorFallbackProps } from '@/app/frontend_manager/manager_members/members_group_admission/types/ManagerMembersGroupAdmissionComponentTypes';
export type { ManagerMembersGroupAdmissionErrorFallbackProps };



export function ManagerMembersGroupAdmissionErrorFallback({ onRetry }: ManagerMembersGroupAdmissionErrorFallbackProps) {
  const tManagerErrors = useTranslations('manager.manager_group_admission.errors');

  return (
    <section className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-border bg-card p-8 text-center" role="alert">
      <h2 className="text-xl font-semibold text-danger">{tManagerErrors('MODULE_ERROR_TITLE')}</h2>
      <p className="max-w-prose text-secondary">{tManagerErrors('GENERIC_BODY')}</p>
      <button type="button" className="mgr-btn-primary min-h-11" onClick={onRetry}>
        {tManagerErrors('RETRY')}
      </button>
    </section>
  );
}
