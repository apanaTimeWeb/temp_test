// RESPONSIBILITY: Render the components header and its navigation context. It does not own backend persistence or cross-feature business logic.

import '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_styles/ManagerMembersDirectoryStyles.css';
import { MANAGER_MEMBERS_DIRECTORY_ROUTES } from '@/app/frontend_manager/manager_members/members_directory/config/manager_members_directory.url_config';
import { Download,UserPlus,Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export interface ManagerMembersDirectoryHeaderProps {
  onExportCsv?: () => void;
}

export function ManagerMembersDirectoryHeader({
  onExportCsv,
}: ManagerMembersDirectoryHeaderProps) {
  const tManagerUi = useTranslations('manager.manager_member_directory.ui');

  return (
    <div className="w-full max-w-full min-w-0 rounded-2xl border border-indigo-500/25 md-surface-panel p-5 sm:p-6 shadow-md motion-safe:transition-all mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left: Titles & Meta Chips */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
              Active Directory
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <Users className="text-indigo-400" size={26} />
              {tManagerUi('members_management')}
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-slate-400">
            {tManagerUi('complete_member_counter_handling_profiles_and_administra_1f1741')}
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center flex-wrap gap-2.5 sm:self-start lg:self-center">
          {onExportCsv && (
            <button
              type="button"
              onClick={onExportCsv}
              title="Export filtered directory to CSV"
              className="inline-flex items-center gap-1.5 min-h-11 px-3.5 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-xs font-semibold text-indigo-300 hover:text-white hover:bg-indigo-600/30 hover:border-indigo-400 motion-safe:transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Download size={14} className="text-indigo-400" />
              <span>Export CSV</span>
            </button>
          )}

          <Link
            href={MANAGER_MEMBERS_DIRECTORY_ROUTES.newAdmission}
            className="inline-flex items-center gap-1.5 min-h-11 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-950/50 motion-safe:transition-all hover:scale-[1.02] cursor-pointer"
          >
            <UserPlus size={15} />
            <span>New Admission</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
