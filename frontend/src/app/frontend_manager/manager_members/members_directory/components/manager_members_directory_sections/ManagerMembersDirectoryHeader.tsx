// RESPONSIBILITY: Render the components header and its navigation context. It does not own backend persistence or cross-feature business logic.

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Users, UserPlus, Download } from 'lucide-react';
import { MANAGER_MEMBERS_DIRECTORY_ROUTES } from '@/app/frontend_manager/manager_members/members_directory/config/manager_members_directory.url_config';

export interface ManagerMembersDirectoryHeaderProps {
  totalCount?: number;
  timeHorizonLabel?: string;
  onExportCsv?: () => void;
}

export function ManagerMembersDirectoryHeader({
  totalCount,
  timeHorizonLabel,
  onExportCsv,
}: ManagerMembersDirectoryHeaderProps) {
  const tManagerUi = useTranslations('manager.manager_member_directory.ui');

  return (
    <div className="w-full max-w-full min-w-0 rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 p-5 sm:p-6 shadow-md transition-all mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left: Titles & Meta Chips */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active Directory
            </span>
          </div>

          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <Users className="text-indigo-400" size={26} />
              {tManagerUi('members_management')}
            </h1>
            {totalCount !== undefined && (
              <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-bold">
                {totalCount} Members{timeHorizonLabel ? ` • ${timeHorizonLabel}` : ''}
              </span>
            )}
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
            className="inline-flex items-center gap-1.5 min-h-11 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-md shadow-indigo-950/50 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <UserPlus size={15} />
            <span>New Admission</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
