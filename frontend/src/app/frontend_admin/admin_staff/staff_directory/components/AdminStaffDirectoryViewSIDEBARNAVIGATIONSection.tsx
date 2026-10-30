'use client';
import { useTranslations } from 'next-intl';
import useAdminStaffDirectory from '@/app/frontend_admin/admin_staff/staff_directory/hooks/useAdminStaffDirectory';
import type { AdminStaffDirectoryViewSIDEBARNAVIGATIONSectionProps, AdminStaffDirectoryViewSIDEBARNAVIGATIONSectionMAINLISTVIEWSSectionProps, AdminStaffDirectoryManagerTableProps } from '@/app/frontend_admin/admin_staff/staff_directory/types/AdminStaffDirectoryComponentTypes';
import AdminStaffDirectoryCreateManagerForm from '@/app/frontend_admin/admin_staff/staff_directory/components/AdminStaffDirectoryCreateManagerForm';
import AdminStaffDirectoryAuditSection from '@/app/frontend_admin/admin_staff/staff_directory/components/AdminStaffDirectoryAuditSection';
import AdminStaffDirectoryDetailLogsSection from '@/app/frontend_admin/admin_staff/staff_directory/components/AdminStaffDirectoryDetailLogsSection';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { useMemo } from 'react';
import { Eye, MoreVertical } from 'lucide-react';
import type { AdminStaffDirectoryManager, AdminStaffDirectoryTab } from '@/app/frontend_admin/admin_staff/staff_directory/schemas/AdminStaffDirectorySchema';
import { ADMIN_STAFF_DIRECTORY_STATUS_BADGE_CLASSES } from '@/app/frontend_admin/admin_staff/staff_directory/config/admin_staff_directory.url_config';
import { maskAdminStaffDirectoryEmail, maskAdminStaffDirectoryPhone, getAdminStaffDirectoryLastActiveLabel } from '@/app/frontend_admin/admin_staff/staff_directory/utils/AdminStaffDirectoryDisplayUtils';

// RESPONSIBILITY: AdminStaffDirectoryViewSIDEBARNAVIGATIONSection component owned by admin_staff_directory; responsibility folder: admin_staff_directory_view_sections.

/** Owns primary navigation buttons; the selected view is delegated to the feature's section orchestrator. */
export default function AdminStaffDirectoryViewSIDEBARNAVIGATIONSection({ model }: AdminStaffDirectoryViewSIDEBARNAVIGATIONSectionProps) {
  const t = useTranslations('ADMIN_STAFF_DIRECTORY');
  const { activeTab, setActiveTab, viewingManager, navItems } = model;

  return (
    <div>
      {!viewingManager && <nav aria-label={t('NAVIGATION_LABEL')} className="admin-card flex flex-wrap gap-2">
        {navItems.map((item) => (
          <button type="button" data-testid={`admin_staff_directory-AdminStaffDirectoryViewSIDEBARNAVIGATIONSection-navigation-${item.id}`} key={item.id}
            aria-current={activeTab === item.id ? 'page' : undefined} aria-pressed={activeTab === item.id}
            onClick={() => setActiveTab(item.id)} className={`admin-tab-button min-h-11 ${activeTab === item.id ? 'admin-tab-button-active' : ''}`}>
            <item.icon size={18} className={activeTab === item.id ? 'text-primary' : 'text-text-secondary'} />
            {t(item.labelKey)}
          </button>
        ))}
      </nav>}
      <AdminStaffDirectoryViewSIDEBARNAVIGATIONSectionMAINLISTVIEWSSection model={model} />
    </div>
  );
}

export type { AdminStaffDirectoryViewSIDEBARNAVIGATIONSectionProps };

// RESPONSIBILITY: AdminStaffDirectoryViewSIDEBARNAVIGATIONSectionMAINLISTVIEWSSection component owned by admin_staff_directory; responsibility folder: admin_staff_directory_view_sidebarnavigationsection_sections.

/** Route-level composition only; list, audit, form and selected-manager detail visual sections are independently owned. */
export function AdminStaffDirectoryViewSIDEBARNAVIGATIONSectionMAINLISTVIEWSSection({ model }: AdminStaffDirectoryViewSIDEBARNAVIGATIONSectionMAINLISTVIEWSSectionProps) {
  const t = useTranslations('ADMIN_STAFF_DIRECTORY');
  const { activeTab, viewingManager, managerDetailTab, setManagerDetailTab, dummyManagers, isDemoMode, handleAddManager, openManagerDetails } = model;
  const listTab = activeTab === 'all' || activeTab === 'active' || activeTab === 'suspended' || activeTab === 'deactivated' ? activeTab : null;
  const auditTab = activeTab === 'sessions' || activeTab === 'history' || activeTab === 'activity' ? activeTab : null;

  return (
    <div>
      {!viewingManager && listTab && <AdminStaffDirectoryManagerTable tab={listTab} managers={dummyManagers} onSelectManager={openManagerDetails} />}

      {!viewingManager && activeTab === 'add' && !isDemoMode && (
        <section className="admin-card p-5" role="status" aria-labelledby="admin-staff-users-create-blocked-title">
          <h2 id="admin-staff-users-create-blocked-title" className="text-lg font-semibold text-text-primary">{t('ADD_BLOCKED_TITLE')}</h2>
          <p className="mt-2 text-text-secondary">{t('ADD_BLOCKED_DESCRIPTION')}</p>
        </section>
      )}
      {!viewingManager && activeTab === 'add' && isDemoMode && <AdminStaffDirectoryCreateManagerForm onCreate={handleAddManager} canCreate={model.isDemoMode} />}

      {!viewingManager && auditTab && (isDemoMode
        ? <AdminStaffDirectoryAuditSection tab={auditTab} />
        : <section className="admin-card p-5" role="status"><h2 className="text-lg font-semibold text-text-primary">{t('AUDIT_UNAVAILABLE_TITLE')}</h2><p className="mt-2 text-text-secondary">{t('AUDIT_UNAVAILABLE_DESCRIPTION')}</p></section>)}

      {!isDemoMode && viewingManager && managerDetailTab !== 'overview' && <div className="admin-card mt-4 p-4 text-warning-text" role="status">{t('DETAIL_HISTORY_BLOCKED')}</div>}
      {viewingManager && <AdminStaffDirectoryDetailLogsSection model={model} onBack={() => setManagerDetailTab('overview')} />}
    </div>
  );
}

export type { AdminStaffDirectoryViewSIDEBARNAVIGATIONSectionMAINLISTVIEWSSectionProps };

// RESPONSIBILITY: AdminStaffDirectoryManagerTable component owned by admin_staff_directory; responsibility folder: admin_staff_directory_components_tables.

/** Renders one manager status table; unsupported row actions remain disabled until their API behavior is verified. */
export function AdminStaffDirectoryManagerTable({ managers, filterStatus, tab, onSelectManager }: AdminStaffDirectoryManagerTableProps) {
  const t = useTranslations('ADMIN_STAFF_DIRECTORY');
  const [page, setPage] = useAdminApplicationInfrastructureUrlQueryState<number>('page', 0);
  const pageSize = 10;
  const tabTitleKey = { all: 'PANEL_ALL', active: 'PANEL_ACTIVE', suspended: 'PANEL_SUSPENDED', deactivated: 'PANEL_DEACTIVATED' } as const;
  const tabFilterStatus: Partial<Record<NonNullable<typeof tab>, AdminStaffDirectoryManager['status']>> = { active: 'Active', suspended: 'Suspended', deactivated: 'Deactivated' };
  const effectiveFilterStatus = filterStatus ?? (tab ? tabFilterStatus[tab] : undefined);
  const filteredManagers = useMemo(() => managers.filter((manager) => !effectiveFilterStatus || manager.status === effectiveFilterStatus), [effectiveFilterStatus, managers]);
  const pageCount = Math.max(1, Math.ceil(filteredManagers.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const visibleManagers = filteredManagers.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const tableContent = filteredManagers.length === 0 ? <p className="p-6 text-text-secondary" role="status">{t('NO_RECORDS')}</p> : (
    <div>
      <div className="space-y-3 p-3 md:hidden">
        {visibleManagers.map((manager) => (
          <article key={manager.id} className="rounded-lg border border-border p-4">
            <div className="flex items-start justify-between gap-3"><div className="min-w-0"><button type="button" className="break-words font-semibold text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => onSelectManager(manager)}>{manager.name}</button><p className="text-xs text-text-secondary">@{manager.username}</p></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${ADMIN_STAFF_DIRECTORY_STATUS_BADGE_CLASSES[manager.status]}`}>{({ Active: t('STATUS_ACTIVE'), Suspended: t('STATUS_SUSPENDED'), Deactivated: t('STATUS_DEACTIVATED') } as const)[manager.status]}</span></div>
            <dl className="mt-3 grid grid-cols-1 gap-2 text-sm"><div><dt className="text-text-secondary">{t('TABLE_CONTACT')}</dt><dd className="break-words">{maskAdminStaffDirectoryEmail(manager.email)} · {maskAdminStaffDirectoryPhone(manager.phone)}</dd></div><div><dt className="text-text-secondary">{t('TABLE_BRANCH')}</dt><dd>{manager.branch}</dd></div><div><dt className="text-text-secondary">{t('TABLE_LAST_ACTIVE')}</dt><dd>{getAdminStaffDirectoryLastActiveLabel(manager.lastActive, t)}</dd></div></dl>
            <div className="mt-3 flex gap-2"><button type="button" className="min-h-11 rounded-md border border-border px-3" onClick={() => onSelectManager(manager)}>{t('VIEW_MANAGER', { name: manager.name })}</button><button type="button" disabled aria-describedby={`admin-staff-users-row-actions-help-mobile-${manager.id}`} className="min-h-11 rounded-md px-3 text-text-disabled">{t('TABLE_ACTIONS')}</button></div><p id={`admin-staff-users-row-actions-help-mobile-${manager.id}`} className="mt-1 text-xs text-text-secondary">{t('ROW_ACTIONS_BLOCKED')}</p>
          </article>
        ))}
      </div>
      <div className="hidden overflow-x-auto md:block">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="h-12 bg-surface-highlight uppercase text-xs text-text-secondary font-semibold border-b border-border">
            <th scope="col" className="px-4 py-3">{t('TABLE_MANAGER')}</th>
            <th scope="col" className="px-4 py-3">{t('TABLE_CONTACT')}</th>
            <th scope="col" className="px-4 py-3">{t('TABLE_BRANCH')}</th>
            <th scope="col" className="px-4 py-3">{t('TABLE_LAST_ACTIVE')}</th>
            <th scope="col" className="px-4 py-3">{t('TABLE_STATUS')}</th>
            <th scope="col" className="px-4 py-3 text-right">{t('TABLE_ACTIONS')}</th>
          </tr>
        </thead>
        <tbody>{visibleManagers.map((manager) => (
          <tr key={manager.id} className="h-12 border-b border-border text-text-primary motion-safe:transition-colors hover:bg-surface-hover even:bg-surface-zebra/30">
            <th scope="row" className="px-4 py-3 font-medium text-text-primary">
              <button type="button" className="underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => onSelectManager(manager)}>{manager.name}</button>
              <span className="block text-xs font-normal text-text-secondary">@{manager.username}</span>
            </th>
            <td className="px-4 py-3"><span className="block">{maskAdminStaffDirectoryEmail(manager.email)}</span><span className="text-text-secondary">{maskAdminStaffDirectoryPhone(manager.phone)}</span></td>
            <td className="px-4 py-3">{manager.branch}</td>
            <td className="px-4 py-3">{getAdminStaffDirectoryLastActiveLabel(manager.lastActive, t)}</td>
            <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ADMIN_STAFF_DIRECTORY_STATUS_BADGE_CLASSES[manager.status]}`}>{({ Active: t('STATUS_ACTIVE'), Suspended: t('STATUS_SUSPENDED'), Deactivated: t('STATUS_DEACTIVATED') } as const)[manager.status]}</span></td>
            <td className="px-4 py-3"><div className="flex justify-end gap-1">
              <button type="button" aria-label={t('VIEW_MANAGER', { name: manager.name })} className="min-h-11 min-w-11 rounded-md hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => onSelectManager(manager)}><Eye size={18} strokeWidth={2}/></button>
              <button type="button" aria-label={t('ROW_ACTIONS', { name: manager.name })} title={t('ROW_ACTIONS_BLOCKED')} disabled aria-describedby="admin-staff-users-row-actions-help" className="min-h-11 min-w-11 cursor-not-allowed rounded-md text-text-disabled"><MoreVertical size={18} strokeWidth={2}/></button>
            </div></td>
          </tr>
        ))}</tbody>
      </table>
      </div>
      <p id="admin-staff-users-row-actions-help" className="sr-only">{t('ROW_ACTIONS_BLOCKED')}</p>
      {filteredManagers.length > 0 && <div className="flex min-h-11 items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-text-secondary">
        <span>{t('SHOWING_RANGE', { start: currentPage * pageSize + 1, end: Math.min((currentPage + 1) * pageSize, filteredManagers.length), count: filteredManagers.length })}</span>
        <div className="flex items-center gap-3">
          <span>Page {currentPage + 1} of {pageCount}</span>
          <div className="flex gap-2">
            <button type="button" className="min-h-11 rounded-md border border-border px-3 disabled:text-text-disabled" disabled={currentPage === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>{t('PREVIOUS')}</button>
            <button type="button" className="min-h-11 rounded-md border border-border px-3 disabled:text-text-disabled" disabled={currentPage >= pageCount - 1} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}>{t('NEXT')}</button>
          </div>
        </div>
      </div>}
    </div>
  );
  return tab ? <section className="admin-card"><h2 className="p-4 text-lg font-semibold text-text-primary">{t(tabTitleKey[tab])}</h2>{tableContent}</section> : tableContent;
}

export type { AdminStaffDirectoryManagerTableProps };
