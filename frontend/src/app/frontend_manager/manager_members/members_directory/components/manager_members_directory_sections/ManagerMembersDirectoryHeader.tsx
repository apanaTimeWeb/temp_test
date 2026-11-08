// RESPONSIBILITY: Render the components header and its navigation context. It does not own backend persistence or cross-feature business logic.

import { useTranslations } from 'next-intl';
import { Users } from 'lucide-react';

export function ManagerMembersDirectoryHeader() {
  const tManagerUi = useTranslations('manager.manager_member_directory.ui');
  return (
<div className="flex flex-col gap-1 mb-8">
        <nav aria-label="Breadcrumb">
          <ol className="mgr-breadcrumb flex items-center gap-1.5 list-none p-0 m-0 text-xs text-secondary">
            <li><span>{tManagerUi('members')}</span></li>
            <li aria-hidden="true" className="select-none">/</li>
            <li aria-current="page"><span className="text-primary font-medium">{tManagerUi('directory')}</span></li>
          </ol>
        </nav>
        <h1 className="mgr-page-title flex items-center gap-3 mt-2">
          <Users className="text-primary" size={28} /> {tManagerUi('members_management')}
        </h1>
        <p className="text-sm text-secondary">{tManagerUi('complete_member_counter_handling_profiles_and_administra_1f1741')}</p>
      </div>
  );
}
