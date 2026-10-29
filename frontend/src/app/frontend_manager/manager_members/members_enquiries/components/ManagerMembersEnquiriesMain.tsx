'use client';

import { useTranslations } from 'next-intl';

import type { ManagerMembersEnquiriesMainProps } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesMainTypes';
import { ManagerMembersEnquiriesClient } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_views/ManagerMembersEnquiriesClient';
import ManagerMembersEnquiriesAddPage from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_views/ManagerMembersEnquiriesAddPage';
import ManagerMembersEnquiriesDetailPage from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_views/ManagerMembersEnquiriesDetailPage';
import { ManagerMembersEnquiriesErrorBoundary } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_states/ManagerMembersEnquiriesErrorBoundary';

// RESPONSIBILITY: Preserve route query context for the manager members enquiries feature.
// DATA FLOW: Next.js route page -> typed Main props -> feature client/view.


const DEFAULT_VIEW = 'enquiries';

/** Canonical feature orchestrator. Sub-views are selected by URL query state, not duplicate route pages. */
export function ManagerMembersEnquiriesMain({ view: requestedView, id, name, phone, smartId }: ManagerMembersEnquiriesMainProps) {
  const view = requestedView ?? DEFAULT_VIEW;
  const t = useTranslations('manager.manager_enquiries.ui');
  switch (view) {
    case 'enquiries':
      return (
        <ManagerMembersEnquiriesErrorBoundary>
          <ManagerMembersEnquiriesClient />
        </ManagerMembersEnquiriesErrorBoundary>
      );
    case 'add':
      return <ManagerMembersEnquiriesAddPage view={requestedView} id={id} name={name} phone={phone} smartId={smartId} />;
    case 'detail':
      return id?.trim() ? <ManagerMembersEnquiriesDetailPage id={id} /> : <section role="alert" className="mgr-page mgr-error-state"><h1>{t('invalid_resource_title')}</h1><p>{t('invalid_resource_description')}</p></section>;
    default:
      return <section role="alert" className="mgr-page mgr-error-state"><h1>{t('invalid_view_title')}</h1><p>{t('invalid_view_description')}</p></section>;
  }
}
