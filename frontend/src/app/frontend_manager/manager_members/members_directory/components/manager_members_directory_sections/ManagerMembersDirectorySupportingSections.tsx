'use client';
// RESPONSIBILITY: Render the members directory supporting sections section of the components feature. It does not own backend persistence or cross-feature business logic.
// RESPONSIBILITY: Render the members directory supporting sections section of the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';

import { History, Search } from 'lucide-react';
import type { ManagerMembersDirectorySupportingSectionsProps } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryComponentTypes';
export type { ManagerMembersDirectorySupportingSectionsProps };




export function ManagerMembersDirectorySupportingSections({ activeTab }: ManagerMembersDirectorySupportingSectionsProps) {
  const tManagerUi = useTranslations('manager.manager_member_directory.ui');
  return (
    <>
      {activeTab === 'Member History' && (
        <div className="motion-safe:transition-all motion-safe:duration-base text-center p-12">
          <History size={64} className="mx-auto text-primary mb-6" />
          <h2 className="text-2xl font-bold text-primary mb-2">{tManagerUi('audit_activity_history')}</h2>
          <p className="text-secondary mb-6 max-w-md mx-auto">{tManagerUi('track_member_check_ins_plan_upgrades_and_profile_modific_144875')}</p>
          <button type="button" className="mgr-btn-secondary" disabled aria-describedby="manager-members-history-unavailable">
            <Search size={16} className="mr-2 inline" /> {tManagerUi('search_logs_unavailable')}
          </button>
          <p id="manager-members-history-unavailable" role="status" className="mt-3 text-sm text-warning">{tManagerUi('member_history_search_is_unavailable_until_the_host_read_be3084')}</p>
        </div>
      )}
    </>
  );
}
