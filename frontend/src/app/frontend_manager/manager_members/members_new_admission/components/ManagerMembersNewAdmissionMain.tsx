'use client';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';
import ManagerMembersNewAdmissionAdmissionForm from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_forms/ManagerMembersNewAdmissionAdmissionForm.tsx';
import { ManagerMembersNewAdmissionErrorBoundary } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_states/ManagerMembersNewAdmissionErrorBoundary.tsx';
import type { ManagerMembersNewAdmissionMainProps } from '@/app/frontend_manager/manager_members/members_new_admission/types/ManagerMembersNewAdmissionMainTypes';

// RESPONSIBILITY: Preserve route query context for the manager members new admission feature.
// DATA FLOW: Next.js route page -> typed Main props -> feature client/view boundary.


export function ManagerMembersNewAdmissionMain(props: ManagerMembersNewAdmissionMainProps) {
  const t = useTranslations('manager.manager_new_admission.ui');
  return (
    <div
      data-route-view={props.view}
      data-route-id={props.id}
      data-route-name={props.name}
      data-route-phone={props.phone}
      data-route-smart-id={props.smartId}
    >
      <ManagerMembersNewAdmissionErrorBoundary><Suspense fallback={<div>{t('loading_form')}</div>}><ManagerMembersNewAdmissionAdmissionForm /></Suspense></ManagerMembersNewAdmissionErrorBoundary>
    </div>
  );
}
