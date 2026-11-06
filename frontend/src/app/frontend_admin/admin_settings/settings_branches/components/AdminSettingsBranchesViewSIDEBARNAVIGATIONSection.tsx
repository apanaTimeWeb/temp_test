'use client';
import type {
  AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionProps,
  AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionMAINDASHBOARDVIEWSSectionProps,
  AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionMAINDASHBOARDVIEWSSectionCreateNewBranchSectionProps,
} from '@/app/frontend_admin/admin_settings/settings_branches/types/AdminSettingsBranchesComponentTypes';
import { useTranslations } from 'next-intl';

import { Users, Building2, MapPin, Mail, Phone, ArrowDown, ArrowUp, ArrowUpDown, Search } from 'lucide-react';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';
import AdminBranchesListViews from '@/app/frontend_admin/admin_settings/settings_branches/components/AdminSettingsBranchesListViews';
import AdminSettingsBranchesHolidaysSection from '@/app/frontend_admin/admin_settings/settings_branches/components/AdminSettingsBranchesHolidaysSection';
import { AdminSettingsBranchesCreateBranchSection } from '@/app/frontend_admin/admin_settings/settings_branches/components/AdminSettingsBranchesCreateBranchSection';
import { useMemo, useState } from 'react';

// Responsibility: AdminSettingsBranchesViewSIDEBARNAVIGATIONSection component owned by admin_branches; responsibility folder: admin_settings_branches_view_sections.

// RESPONSIBILITY: Renders the feature-owned branch navigation and composes the selected branch view.

export default function AdminSettingsBranchesViewSIDEBARNAVIGATIONSection({ model }: AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionProps) {
  const t = useTranslations('ADMIN_BRANCHES');
  const { activeTab, setActiveTab, viewingBranch, detailTab, setDetailTab, mainNav, detailNav } = model;
  return (
    <div className="admin-shared-flex-wrap-row">
      <nav className="admin-card flex-1 basis-64 p-4 flex flex-col gap-2 md:sticky md:top-6" aria-label={t('PAGE_TITLE')}>
        {!viewingBranch ? mainNav.map((item) => (
          <button
            type="button"
            key={item.id}
            aria-current={activeTab === item.id ? 'page' : undefined}
            onClick={() => setActiveTab(item.id)}
            className={`admin-tab-button admin-tab-button-branch ${activeTab === item.id ? 'admin-tab-button-active' : ''}`}
          >
            <item.icon size={18} aria-hidden="true" className={activeTab === item.id ? 'text-primary' : 'text-text-secondary'} />
            {t(`NAV_MAIN_${item.id.toUpperCase()}`)}
          </button>
        )) : (
          <>
            <div className="px-4 py-2 text-xs font-bold uppercase text-text-disabled">{t('DETAIL_NAV_HEADING')}</div>
            {detailNav.map((item) => (
              <button
                type="button"
                key={item.id}
                aria-current={detailTab === item.id ? 'page' : undefined}
                onClick={() => setDetailTab(item.id)}
                className={`admin-tab-button admin-tab-button-branch ${detailTab === item.id ? 'admin-tab-button-active' : ''}`}
              >
                <item.icon size={18} aria-hidden="true" className={detailTab === item.id ? 'text-primary' : 'text-text-secondary'} />
                {t(`NAV_DETAIL_${item.id.toUpperCase()}`)}
              </button>
            ))}
          </>
        )}
      </nav>
      <AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionMAINDASHBOARDVIEWSSection model={model} />
    </div>
  );
}

export type { AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionProps };

// Responsibility: AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionMAINDASHBOARDVIEWSSection component owned by admin_branches; responsibility folder: admin_settings_branches_view_sidebarnavigationsection_sections.

// RESPONSIBILITY: Routes the selected branch navigation state to focused feature-owned view sections.

export function AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionMAINDASHBOARDVIEWSSection({ model }: AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionMAINDASHBOARDVIEWSSectionProps) {
  const t = useTranslations('ADMIN_BRANCHES');
  const { activeTab, viewingBranch, setViewingBranch, detailTab } = model;
  const contractNotice = (titleKey: 'DETAIL_OVERVIEW' | 'DETAIL_USERS' | 'DETAIL_RESERVATIONS' | 'DETAIL_REPORTS' | 'DETAIL_AUDIT' | 'DETAIL_SETTINGS' | 'GLOBAL_SETTINGS' | 'GLOBAL_USAGE' | 'COMPARISON_REPORTS', descriptionKey: 'DETAIL_REQUIRED' | 'GLOBAL_SETTINGS_REQUIRED' | 'GLOBAL_USAGE_REQUIRED' | 'REPORTS_REQUIRED') => (
    <section className="admin-card p-5" role="status">
      <h2 className="font-semibold text-text-primary">{t(titleKey)}</h2>
      <p className="mt-2 text-text-secondary">{t(descriptionKey)}</p>
    </section>
  );

  type ManagerSortField = 'name' | 'manager' | 'status';
  const [managerSortField, setManagerSortField] = useState<ManagerSortField | null>(null);
  const [managerSortDirection, setManagerSortDirection] = useState<'asc' | 'desc'>('asc');
  const [managerSearchQuery, setManagerSearchQuery] = useState('');
  const [managerPage, setManagerPage] = useState(0);
  const [managerPageSize, setManagerPageSize] = useState(10);

  const toggleManagerSort = (field: ManagerSortField) => {
    setManagerPage(0);
    if (managerSortField === field) {
      setManagerSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setManagerSortField(field);
      setManagerSortDirection('asc');
    }
  };

  const filteredBranches = useMemo(() => {
    if (!managerSearchQuery.trim()) return model.branches;
    const q = managerSearchQuery.toLowerCase().trim();
    return model.branches.filter(
      (b) => b.name.toLowerCase().includes(q) || (b.manager && b.manager.toLowerCase().includes(q))
    );
  }, [model.branches, managerSearchQuery]);

  const sortedBranches = useMemo(() => {
    if (!managerSortField) return filteredBranches;
    return [...filteredBranches].sort((a, b) => {
      const aVal = String(a[managerSortField] || '');
      const bVal = String(b[managerSortField] || '');
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      return managerSortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredBranches, managerSortField, managerSortDirection]);

  const paginatedBranches = useMemo(() => {
    return sortedBranches.slice(managerPage * managerPageSize, (managerPage + 1) * managerPageSize);
  }, [sortedBranches, managerPage, managerPageSize]);

  const renderManagerSortableHeader = (field: ManagerSortField, label: string) => {
    const isActive = managerSortField === field;
    return (
      <th
        scope="col"
        aria-sort={isActive ? (managerSortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
        className="p-3 whitespace-nowrap text-left"
      >
        <button
          type="button"
          onClick={() => toggleManagerSort(field)}
          className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1"
          aria-label={`${label}, sort ${isActive ? (managerSortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            managerSortDirection === 'asc' ? (
              <ArrowUp className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
            ) : (
              <ArrowDown className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown className="text-text-secondary opacity-40 group-hover:opacity-100 transition-opacity shrink-0" size={14} aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  return (
    <div className="space-y-4">
      {!viewingBranch && <AdminBranchesListViews model={model} />}
      <AdminSettingsBranchesCreateBranchSection model={model} />
      {!viewingBranch && activeTab === 'managers' && (
        <section className="admin-card p-5">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Users size={20} strokeWidth={2} />
              <div>
                <h2>{t('BRANCH_MANAGERS')}</h2>
                <p className="text-sm text-text-secondary">{t('MANAGER_INFO_CONTRACT')}</p>
              </div>
            </div>
            <div className="relative min-w-[220px] max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                value={managerSearchQuery}
                onChange={(e) => {
                  setManagerSearchQuery(e.target.value);
                  setManagerPage(0);
                }}
                placeholder="Search managers or branches..."
                className="w-full rounded-lg border border-border bg-card py-1.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          {sortedBranches.length === 0 ? (
            <p className="rounded-md border border-border p-4 text-text-secondary" role="status">
              {managerSearchQuery.trim() ? 'No branch managers found matching search criteria.' : t('NO_LIVE_MANAGERS')}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="h-12 bg-surface-highlight uppercase text-xs text-text-secondary font-semibold border-b border-border">
                    {renderManagerSortableHeader('name', t('TABLE_BRANCH'))}
                    {renderManagerSortableHeader('manager', t('TABLE_MANAGER'))}
                    {renderManagerSortableHeader('status', t('TABLE_STATUS'))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedBranches.map((branch) => (
                    <tr key={branch.id} className="h-12 border-b border-border text-text-primary motion-safe:transition-colors hover:bg-surface-hover even:bg-surface-zebra">
                      <th scope="row" className="p-3 font-medium text-text-primary">{branch.name}</th>
                      <td className="p-3">{branch.manager || t('NOT_PROVIDED')}</td>
                      <td className="p-3">{t(branch.status === 'Active' ? 'STATUS_ACTIVE' : branch.status === 'Suspended' ? 'STATUS_SUSPENDED' : 'STATUS_ARCHIVED')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <AdminTablePagination
                page={managerPage}
                pageSize={managerPageSize}
                totalCount={sortedBranches.length}
                onPageChange={setManagerPage}
                onPageSizeChange={(newSize) => {
                  setManagerPageSize(newSize);
                  setManagerPage(0);
                }}
              />
            </div>
          )}
        </section>
      )}
      {viewingBranch && detailTab === 'members' && (
        <section className="admin-card p-5">
          <div className="mb-3 flex items-center gap-3">
            <Users size={20} strokeWidth={2} />
            <div>
              <h2>{t('BRANCH_MEMBERS')}</h2>
              <p className="text-sm text-text-secondary">{t('BRANCH_MEMBER_CONTRACT', { name: viewingBranch.name })}</p>
            </div>
          </div>
          <p className="rounded-md border border-warning-bg bg-warning-bg p-4 text-warning-text" role="status">{t('MEMBER_ROSTER_UNAVAILABLE')}</p>
        </section>
      )}
      {viewingBranch && detailTab === 'overview' && (
        <section className="admin-card grid gap-4 p-6 sm:grid-cols-2">
          <div className="sm:col-span-2 flex items-center gap-3">
            <Building2 size={18} strokeWidth={2} />
            <div>
              <h2>{viewingBranch.name}</h2>
              <p className="text-text-secondary">{viewingBranch.code}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={18} strokeWidth={2} />
            <div>
              <span className="block text-caption text-text-secondary">{t('FIELD_ADDRESS_LABEL')}</span>
              <span>{viewingBranch.address}</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone size={18} strokeWidth={2} />
            <div>
              <span className="block text-caption text-text-secondary">{t('FIELD_PHONE_LABEL')}</span>
              <span>{viewingBranch.phone}</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail size={18} strokeWidth={2} />
            <div>
              <span className="block text-caption text-text-secondary">{t('FIELD_EMAIL_LABEL')}</span>
              <span>{viewingBranch.email}</span>
            </div>
          </div>
          <div>
            <span className="text-text-secondary">{t('LABEL_MANAGER')}</span>
            <p>{viewingBranch.manager}</p>
          </div>
        </section>
      )}
      {viewingBranch && !['overview', 'members'].includes(detailTab) && contractNotice(`DETAIL_${detailTab.toUpperCase()}` as 'DETAIL_USERS' | 'DETAIL_RESERVATIONS' | 'DETAIL_REPORTS' | 'DETAIL_AUDIT' | 'DETAIL_SETTINGS', 'DETAIL_REQUIRED')}
      {!viewingBranch && activeTab === 'settings' && contractNotice('GLOBAL_SETTINGS', 'GLOBAL_SETTINGS_REQUIRED')}
      {!viewingBranch && activeTab === 'usage' && contractNotice('GLOBAL_USAGE', 'GLOBAL_USAGE_REQUIRED')}
      {!viewingBranch && activeTab === 'reports' && contractNotice('COMPARISON_REPORTS', 'REPORTS_REQUIRED')}
      {!viewingBranch && activeTab === 'holidays' && <AdminSettingsBranchesHolidaysSection isDemoMode={model.isDemoMode} />}
      {viewingBranch && <button type="button" className="mb-4 admin-btn-ghost" onClick={() => setViewingBranch(null)}>{t('BACK_TO_BRANCHES')}</button>}
    </div>
  );
}

export type { AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionMAINDASHBOARDVIEWSSectionProps };

// Re-export for compatibility
export { AdminSettingsBranchesCreateBranchSection as AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionMAINDASHBOARDVIEWSSectionCreateNewBranchSection };
export type { AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionMAINDASHBOARDVIEWSSectionCreateNewBranchSectionProps };
