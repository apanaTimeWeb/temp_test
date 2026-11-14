'use client';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_system/system_backup_overview/config/superadmin_backup_overview.url_config.ts';
import SuperadminBackupOverviewCreateFlowEmptyState from '@/app/frontend_superadmin/superadmin_system/system_backup_overview/components/SuperadminBackupOverviewCreateFlowEmptyState';
/** Responsibility: renders the superadmin_backup overview route UI; the module Main remains a thin composition boundary. */
/** Data-Flow: canonical route -> SuperadminBackupOverviewCreateFlowPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { useSuperadminBackupOverviewCreateFlowState } from '@/app/frontend_superadmin/superadmin_system/system_backup_overview/hooks/useSuperadminBackupOverviewCreateFlowState';
import { Database } from 'lucide-react';
import { SUPERADMIN_BACKUP_SAMPLE_HISTORY } from '@/app/frontend_superadmin/superadmin_system/system_backup_overview/mocks/fixtures/SuperadminBackupOverviewCreateFlowSampleMockFixtures';
import SuperadminBackupOverviewCreateFlowCreatePanel from '@/app/frontend_superadmin/superadmin_system/system_backup_overview/components/SuperadminBackupOverviewCreateFlowCreatePanel';
import SuperadminBackupOverviewCreateFlowHistoryPanel from '@/app/frontend_superadmin/superadmin_system/system_backup_overview/components/SuperadminBackupOverviewCreateFlowHistoryPanel';
import SuperadminBackupOverviewCreateFlowRestorePanel from '@/app/frontend_superadmin/superadmin_system/system_backup_overview/components/SuperadminBackupOverviewCreateFlowRestorePanel';
import SuperadminBackupOverviewCreateFlowSchedulePanel from '@/app/frontend_superadmin/superadmin_system/system_backup_overview/components/SuperadminBackupOverviewCreateFlowSchedulePanel';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_BACKUP_TABS } from '@/app/frontend_superadmin/superadmin_system/system_backup_overview/constants/SuperadminBackupOverviewCreateFlowConstants';
/**
 * Renders the backup overview page content and coordinates its local interaction state, validation, and accessible controls.
 */
export default function SuperadminBackupOverviewCreateFlowPageClient() {
  const tCopy = useTranslations('SUPERADMIN_BACKUP');
  
  const navigateToWorkflow = (key: string) => {
    const routes: Record<string, string> = {
    "create": SUPERADMIN_NAVIGATION_ROUTES.backup_overview__create,
    "history": SUPERADMIN_NAVIGATION_ROUTES.backup_history,
    "restore": SUPERADMIN_NAVIGATION_ROUTES.backup_history__restore,
    "schedule": SUPERADMIN_NAVIGATION_ROUTES.backup_schedules
    };
    const route = routes[key];
    if (route) { const target = new URL(route, window.location.origin); const query = new URLSearchParams(window.location.search); query.delete('view'); query.forEach((value, key) => { if (!target.searchParams.has(key)) target.searchParams.append(key, value); }); window.location.assign(target.pathname + target.search + target.hash); }
  };
const { activeTab, setActiveTab, showPreviewNotice } = useSuperadminBackupOverviewCreateFlowState('create');

  return (
    <div className="sa-page-animate pb-12 relative">
      {(SUPERADMIN_BACKUP_SAMPLE_HISTORY.length === 0) && <SuperadminBackupOverviewCreateFlowEmptyState filtered />}

      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb"><span>{tCopy("COPY.LIBRARY_OS")}</span><span>/</span><span>{tCopy("COPY.SUPER_ADMIN")}</span><span>/</span><span>{tCopy("COPY.BACKUP_RESTORE")}</span></div>
        <div className="flex items-center justify-between mt-2"><h1 className="sa-page-title flex items-center gap-3"><Database className="text-success" size={28} aria-hidden="true" />{tCopy("COPY.DISASTER_RECOVERY_BACKUPS")}</h1></div>
      </div>
      <p className="mb-5 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy("COPY.SAMPLE_BACKUP_METADATA_ONLY_REAL_BACKUP_CREATION_DOWNLOAD_RESTORE_AND_SCHEDULING_ARE_UNAVAILABLE_BECAUSE_NO_APPROVED_BACKEND_CONTRACTS_ARE_SUPPLIED")}</p>

      <div className="flex items-center gap-2 mb-6 border-b border-border pb-2 overflow-x-auto hide-scrollbar" role="navigation" aria-label={tCopy("COPY.BACKUP_AND_RESTORE_SECTIONS")}>
        {SUPERADMIN_BACKUP_TABS.map(({ id, labelKey, icon: Icon }, index) => (
          <button
            type="button"
            key={id}
            id={`superadmin-backup-tab-${id}`}
            aria-current={activeTab === id ? 'page' : undefined}
            aria-controls="superadmin-backup-tabpanel"
            onClick={() => setActiveTab(id)}
            
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold motion-safe:transition-all motion-reduce:transition-none whitespace-nowrap ${activeTab === id ? 'bg-success-bg text-primary border border-border shadow-card' : 'text-secondary hover:bg-surface-hover hover:text-primary'}`}
           data-testid={`superadmin-backup-backup-overview-set-active-tab-1-${String(id)}`}>
            <Icon size={16} aria-hidden="true" />{tCopy(labelKey)}
          </button>
        ))}
      </div>

      <div id="superadmin-backup-tabpanel"  aria-labelledby={`superadmin-backup-tab-${activeTab}`} tabIndex={0} className="sa-card p-0 min-h-125 flex flex-col border border-border overflow-hidden">
        {activeTab === 'create' && <SuperadminBackupOverviewCreateFlowCreatePanel />}
        {activeTab === 'history' && <SuperadminBackupOverviewCreateFlowHistoryPanel records={SUPERADMIN_BACKUP_SAMPLE_HISTORY} />}
        {activeTab === 'restore' && <SuperadminBackupOverviewCreateFlowRestorePanel />}
        {activeTab === 'schedule' && <SuperadminBackupOverviewCreateFlowSchedulePanel onPreviewNotice={showPreviewNotice} />}
      </div>
    </div>
  );
}
