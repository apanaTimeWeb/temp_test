'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Download } from 'lucide-react';
import { MANAGER_MEMBERS_TABS } from '@/app/frontend_manager/manager_members/members_directory/constants/ManagerMembersDirectoryConstants';
import type { ManagerMembersDirectoryRecord, ManagerMembersDirectoryTab } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';

export interface ManagerMembersDirectoryStatusTabsProps {
  activeTab: ManagerMembersDirectoryTab;
  onSelectTab: (tab: ManagerMembersDirectoryTab) => void;
  members: ManagerMembersDirectoryRecord[];
  onExportCsv: () => void;
}

export function ManagerMembersDirectoryStatusTabs({
  activeTab,
  onSelectTab,
  members,
  onExportCsv,
}: ManagerMembersDirectoryStatusTabsProps) {
  const tManagerUi = useTranslations('manager.manager_member_directory.ui');

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 border-b border-border pb-4">
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-surface-highlight rounded-xl border border-border">
        {MANAGER_MEMBERS_TABS.map((tab) => {
          const isActive = activeTab === tab.name;
          const count =
            tab.name === 'All Members'
              ? members.length
              : tab.name === 'Active Members'
                ? members.filter((m) => m.status === 'Active').length
                : tab.name === 'Expired Members'
                  ? members.filter((m) => m.status === 'Expired').length
                  : members.filter((m) => m.status === 'Suspended').length;

          return (
            <button
              key={tab.name}
              type="button"
              onClick={() => onSelectTab(tab.name)}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-card text-primary shadow-xs border border-border'
                  : 'text-secondary hover:text-primary hover:bg-card'
              }`}
            >
              <tab.icon size={15} aria-hidden="true" className={isActive ? 'text-primary' : 'opacity-70'} />
              <span>{tManagerUi(tab.labelKey)}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-primary-subtle text-primary' : 'bg-surface text-secondary'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onExportCsv}
          className="mgr-btn-outline flex items-center gap-1.5 text-xs font-semibold py-2 px-3.5 rounded-lg border border-border bg-card hover:bg-surface-highlight transition-colors cursor-pointer"
          title="Export Filtered Students List as CSV"
        >
          <Download size={14} />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
}
export default ManagerMembersDirectoryStatusTabs;

