'use client';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { MANAGER_MEMBERS_DIRECTORY_ROUTES } from '@/app/frontend_manager/manager_members/members_directory/config/manager_members_directory.url_config';
import { displayValue } from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryDisplayValue';
import { formatManagerMemberDirectoryCalendarDate } from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryDateFormatting';

import { Search } from 'lucide-react';
import { maskManagerMemberPhone } from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryPrivacy';
import { ManagerMembersDirectoryEmptyState } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_states/ManagerMembersDirectoryEmptyState';
import { ManagerMembersDirectorySupportingSections } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectorySupportingSections';
import { ManagerMembersDirectoryKpiSection } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryKpiSection';
import { ManagerMembersDirectoryHeader } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryHeader';
import { MANAGER_MEMBERS_STATUS_BADGES, MANAGER_MEMBERS_TABS } from '@/app/frontend_manager/manager_members/members_directory/constants/ManagerMembersDirectoryConstants';
import { useManagerMemberDirectoryPageState } from '@/app/frontend_manager/manager_members/members_directory/hooks/useManagerMembersDirectoryPageState';
import { ManagerMembersDirectoryProfileSection } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryProfileSection';
import type { ManagerMembersDirectoryRouteQueryProps } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryComponentTypes';

export default function ManagerMembersDirectoryPage(_routeQuery: ManagerMembersDirectoryRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_member_directory.ui');
  const locale = useLocale();
  const { activeTab, setActiveTab, searchQuery, setSearchQuery, profileSearch, setProfileSearch, members, filteredMembers, profileMember } = useManagerMemberDirectoryPageState(_routeQuery);
  const editIntent = _routeQuery.view === 'edit';
  const tabDestinations: Partial<Record<(typeof MANAGER_MEMBERS_TABS)[number]['name'], string>> = {
    'Add Member': MANAGER_MEMBERS_DIRECTORY_ROUTES.newAdmission,
    'Membership Renewal': MANAGER_MEMBERS_DIRECTORY_ROUTES.membershipRenewal,
  };

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const totalRows = filteredMembers.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginatedMembers = filteredMembers.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  return (
    <div className="mgr-page-animate relative pb-12"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
      data-route-name={_routeQuery.name}
      data-route-phone={_routeQuery.phone}
      data-route-smart-id={_routeQuery.smartId}
      data-route-seat={_routeQuery.seat}>
      <ManagerMembersDirectoryHeader />
      <p role="status" data-testid="manager-members-demo-mode-banner" className="mb-5 rounded-xl border border-warning bg-warning-bg px-4 py-3 text-sm text-warning">
        {tManagerUi('demo_mode_existing_members_are_sample_records_new_member_014d0f')}
      </p>

      <ManagerMembersDirectoryKpiSection
        totalMembers={members.length}
        activeMembers={members.filter(m => m.status === 'Active').length}
        expiredMembers={members.filter(m => m.status === 'Expired').length}
        suspendedMembers={members.filter(m => m.status === 'Suspended').length}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Sidebar Tabs */}
        <div className="xl:col-span-3 space-y-2">
          {MANAGER_MEMBERS_TABS.map(tab => {
            const isActive = activeTab === tab.name;
            const commonClassName = `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold motion-safe:transition-all ${
              isActive ? 'bg-primary text-on-primary shadow-card' : 'text-secondary hover:bg-card hover:text-primary'
            }`;
            const destination = tabDestinations[tab.name];
            if (destination) {
              return (
                <Link key={tab.name} href={destination} className={commonClassName}>
                  <tab.icon size={18} aria-hidden="true" className="opacity-70" />
                  {tManagerUi(tab.labelKey)}
                </Link>
              );
            }
            return (
              <button key={tab.name} type="button" onClick={() => { setActiveTab(tab.name); setPage(0); }} aria-pressed={isActive} className={commonClassName}>
                <tab.icon size={18} aria-hidden="true" className={isActive ? 'text-primary' : 'opacity-70'} />
                {tManagerUi(tab.labelKey)}
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="xl:col-span-9 mgr-card p-6 min-h-96">
          
          {/* GRIDS (All, Active, Expired, Suspended) */}
          {['All Members', 'Active Members', 'Expired Members', 'Suspended Members'].includes(activeTab) && (
            <div className="motion-safe:transition-all motion-safe:duration-base h-full flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-border pb-4">
                <h2 className="text-xl font-bold text-primary">{tManagerUi(MANAGER_MEMBERS_TABS.find((tab) => tab.name === activeTab)?.labelKey ?? 'tab_all_members')}</h2>
                <div className="relative w-full sm:w-64">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                  <label htmlFor="manager-members-search" className="sr-only">{tManagerUi('search_by_name_or_id')}</label>
                  <input id="manager-members-search" type="text" className="mgr-input pl-9" placeholder={tManagerUi('search_by_name_or_id')} 
                    value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(0); }}
                  />
                </div>
              </div>
              <div className="flex-1 w-full overflow-x-auto">
                {filteredMembers.length === 0 ? (
                  <ManagerMembersDirectoryEmptyState />
                ) : (
                  <>
                    <table className="mgr-table w-full">
                      <thead>
                        <tr className="border-b border-border bg-surface-highlight text-xs uppercase text-secondary font-semibold">
                          <th scope="col" className="px-3 py-3">{tManagerUi('member_id_7a88b2')}</th>
                          <th scope="col" className="px-3 py-3">{tManagerUi('name')}</th>
                          <th scope="col" className="px-3 py-3">{tManagerUi('phone')}</th>
                          <th scope="col" className="px-3 py-3">{tManagerUi('plan')}</th>
                          <th scope="col" className="px-3 py-3">{tManagerUi('status')}</th>
                          <th scope="col" className="px-3 py-3">{tManagerUi('expiry_date')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedMembers.map((member) => {
                          const badge = MANAGER_MEMBERS_STATUS_BADGES[member.status];
                          return (
                            <tr
                              key={member.id}
                              onClick={() => {
                                setProfileSearch(member.id);
                                setActiveTab('Member Profile');
                              }}
                              className="border-b border-border last:border-0 hover:bg-surface-hover even:bg-surface-zebra/30 h-12 cursor-pointer transition-colors group"
                              title={`Click to view profile of ${member.name} (${member.id})`}
                            >
                              <td className="px-3 py-3 align-middle"><span className="font-mono text-primary font-semibold group-hover:underline">{member.id}</span></td>
                              <td className="px-3 py-3 align-middle font-bold text-primary group-hover:text-primary-hover">{member.name}</td>
                              <td className="px-3 py-3 align-middle">{maskManagerMemberPhone(member.phone)}</td>
                              <td className="px-3 py-3 align-middle"><span className="mgr-badge mgr-badge--info">{member.type}</span></td>
                              <td className="px-3 py-3 align-middle"><span className={`mgr-badge ${badge?.className ?? 'mgr-badge--neutral'}`}>{badge ? tManagerUi(badge.labelKey) : tManagerUi('status_unknown')}</span></td>
                              <td className="px-3 py-3 align-middle">{formatManagerMemberDirectoryCalendarDate(displayValue(member.expiryDate), locale)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-3 py-3 text-sm text-secondary">
                      <span>
                        Showing {startItem}–{endItem} of {totalRows} results
                      </span>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <label htmlFor="rows-per-page-members-directory" className="text-xs text-secondary whitespace-nowrap">
                            Rows per page:
                          </label>
                          <select
                            id="rows-per-page-members-directory"
                            value={pageSize}
                            onChange={(e) => {
                              setPageSize(Number(e.target.value));
                              setPage(0);
                            }}
                            className="rounded border border-border bg-surface px-2 py-1 text-xs text-primary"
                          >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="mgr-btn-ghost mgr-btn-sm"
                            disabled={effectivePage <= 0}
                            onClick={() => setPage((current) => Math.max(0, current - 1))}
                          >
                            Previous
                          </button>
                          <span className="text-xs text-secondary px-1">
                            Page {effectivePage + 1} of {pageCount}
                          </span>
                          <button
                            type="button"
                            className="mgr-btn-ghost mgr-btn-sm"
                            disabled={effectivePage >= pageCount - 1}
                            onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* MEMBER PROFILE */}
          {activeTab === 'Member Profile' && (
            <>
            {editIntent && <p className="mb-4 rounded-xl border border-warning bg-warning-bg px-4 py-3 text-sm text-warning" role="status" data-testid="manager-members-edit-contract-notice">{tManagerUi('profile_edit_unavailable_host_contract_not_supplied')}</p>}
            <ManagerMembersDirectoryProfileSection
              searchValue={profileSearch}
              onSearchChange={setProfileSearch}
              member={profileMember}
            />
            </>
          )}

          <ManagerMembersDirectorySupportingSections activeTab={activeTab} />

        </div>
      </div>
    </div>
  );
}
