'use client';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';
import ManagerMembersNewAdmissionAdmissionForm from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_forms/ManagerMembersNewAdmissionAdmissionForm';
import { ManagerMembersNewAdmissionErrorBoundary } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_states/ManagerMembersNewAdmissionErrorBoundary';
import type { ManagerMembersNewAdmissionMainProps } from '@/app/frontend_manager/manager_members/members_new_admission/types/ManagerMembersNewAdmissionMainTypes';
import { LibraryLoader } from '@/app/frontend_manager/components/ManagerLoader';

// RESPONSIBILITY: Preserve route query context for the manager members new admission feature.
// DATA FLOW: Next.js route page -> typed Main props -> feature client/view boundary.


export function ManagerMembersNewAdmissionMain(props: ManagerMembersNewAdmissionMainProps) {
  const t = useTranslations('manager.manager_new_admission.ui');
  return (
    <div
      data-route-view={props.view}
      data-route-id={props.id}
    >
      <ManagerMembersNewAdmissionErrorBoundary>
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-16" role="status">
              <LibraryLoader size="md" icon="user-check" variant="flip" />
            </div>
          }
        >
          <ManagerMembersNewAdmissionAdmissionForm />
        </Suspense>
      </ManagerMembersNewAdmissionErrorBoundary>
    </div>
  );
}
