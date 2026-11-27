'use client';

import AdminStaffDirectoryAuditSection from '@/app/frontend_admin/admin_staff/staff_directory/components/AdminStaffDirectoryAuditSection';
import AdminStaffDirectoryCreateManagerForm from '@/app/frontend_admin/admin_staff/staff_directory/components/AdminStaffDirectoryCreateManagerForm';
import AdminStaffDirectoryDetailLogsSection from '@/app/frontend_admin/admin_staff/staff_directory/components/AdminStaffDirectoryDetailLogsSection';
import { AdminStaffDirectoryKpiGrid } from '@/app/frontend_admin/admin_staff/staff_directory/components/AdminStaffDirectoryKpiGrid';
import {
  AdminStaffDirectoryManagerTable,
  type AdminStaffDirectoryManagerTableProps,
} from '@/app/frontend_admin/admin_staff/staff_directory/components/AdminStaffDirectoryManagerTable';
import type {
  AdminStaffDirectoryViewSIDEBARNAVIGATIONSectionMAINLISTVIEWSSectionProps,
  AdminStaffDirectoryViewSIDEBARNAVIGATIONSectionProps,
} from '@/app/frontend_admin/admin_staff/staff_directory/types/AdminStaffDirectoryComponentTypes';
import { useTranslations } from 'next-intl';

export { AdminStaffDirectoryManagerTable };
export type { AdminStaffDirectoryManagerTableProps };

/** Owns primary navigation buttons; the selected view is delegated to the feature's section orchestrator. */
export default function AdminStaffDirectoryViewSIDEBARNAVIGATIONSection({ model }: AdminStaffDirectoryViewSIDEBARNAVIGATIONSectionProps) {
  const t = useTranslations('ADMIN_STAFF_DIRECTORY');
  const { activeTab, setActiveTab, viewingManager, navItems, managerCounts } = model;

  return (
    <div className="space-y-6">
      {!viewingManager && (
        <>
          <AdminStaffDirectoryKpiGrid managerCounts={managerCounts} />

          <nav aria-label={t('NAVIGATION_LABEL')} className="admin-card flex flex-wrap gap-2">
            {navItems.map((item) => (
              <button
                type="button"
                data-testid={`admin_staff_directory-AdminStaffDirectoryViewSIDEBARNAVIGATIONSection-navigation-${item.id}`}
                key={item.id}
                aria-current={activeTab === item.id ? 'page' : undefined}
                aria-pressed={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
                className={`admin-tab-button min-h-11 ${activeTab === item.id ? 'admin-tab-button-active' : ''}`}
              >
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md motion-safe:transition-transform ${activeTab === item.id ? 'bg-info-bg text-primary-text shadow-xs' : 'bg-surface text-text-secondary'}`}>
                  <item.icon size={15} aria-hidden="true" />
                </span>
                {t(item.labelKey)}
              </button>
            ))}
          </nav>
        </>
      )}
      <AdminStaffDirectoryViewSIDEBARNAVIGATIONSectionMAINLISTVIEWSSection model={model} />
    </div>
  );
}

export type { AdminStaffDirectoryViewSIDEBARNAVIGATIONSectionProps };

/** Route-level composition only; list, audit, form and selected-manager detail visual sections are independently owned. */
export function AdminStaffDirectoryViewSIDEBARNAVIGATIONSectionMAINLISTVIEWSSection({ model }: AdminStaffDirectoryViewSIDEBARNAVIGATIONSectionMAINLISTVIEWSSectionProps) {
  const t = useTranslations('ADMIN_STAFF_DIRECTORY');
  const { activeTab, viewingManager, managerDetailTab, setManagerDetailTab, dummyManagers, isDemoMode, handleAddManager, openManagerDetails } = model;
  const listTab = activeTab === 'all' || activeTab === 'staff' || activeTab === 'active' || activeTab === 'suspended' || activeTab === 'deactivated' ? activeTab : null;
  const auditTab = activeTab === 'sessions' || activeTab === 'history' || activeTab === 'activity' ? activeTab : null;

  return (
    <div>
      {!viewingManager && listTab && <AdminStaffDirectoryManagerTable tab={listTab} managers={dummyManagers} onSelectManager={openManagerDetails} onUpdateStatus={model.handleUpdateManagerStatus} />}

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
