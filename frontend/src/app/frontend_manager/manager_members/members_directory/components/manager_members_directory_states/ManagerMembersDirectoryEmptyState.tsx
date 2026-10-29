'use client';
// RESPONSIBILITY: Render the empty-state presentation for the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';

export function ManagerMembersDirectoryEmptyState() {
  const tManagerUi = useTranslations('manager.manager_member_directory.ui');
  return <div className="mgr-empty-state p-6 text-center" role="status" data-testid="manager-members-empty-state" aria-live="polite"><h3 className="mgr-section-title">{tManagerUi('no_members_match_the_current_filters')}</h3></div>;
}
