'use client';
// Responsibility: Own the Members Directory route's primary view and its cohesive screen-local child views.

import AdminMembersDirectoryBulkImportModal from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryBulkImportModal';
import AdminMembersDirectoryBulkWhatsAppModal from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryBulkWhatsAppModal';
import AdminMembersDirectoryDataToolsView from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryDataToolsView';
import { AdminMembersDirectoryKpiGrid } from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryKpiGrid';
import { AdminMembersDirectoryMemberDetailCard } from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryMemberDetailCard';
import AdminMembersDirectoryMemberForm from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryMemberForm';
import AdminMembersMemberTable from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryMemberTable';
import AdminMembersDirectorySecondaryViews from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectorySecondaryViews';
import { ADMIN_MEMBERS_STATUS_VALUES } from '@/app/frontend_admin/admin_members/members_directory/config/admin_members_directory.url_config';
import type { AdminMembersDetailTab } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import type {
  AdminMembersDirectoryDataToolsViewProps,
  AdminMembersDirectoryViewMAINDASHBOARDVIEWSSectionProps,
  AdminMembersDirectoryViewProps,
} from '@/app/frontend_admin/admin_members/members_directory/types/AdminMembersDirectoryComponentTypes';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { ArrowLeft, MessageSquare, RotateCcw, Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

const TAB_ICON_COLORS: Record<string, string> = {
  all: 'text-info-text',
  categories: 'text-purple',
  departments: 'text-primary',
  active: 'text-success-text',
  expired: 'text-danger-text',
  suspended: 'text-warning-text',
  blocked: 'text-danger-text',
  import: 'text-info-text',
  export: 'text-success-text',
  documents: 'text-purple',
  plans: 'text-primary',
  renewal: 'text-warning-text',
  profile: 'text-info-text',
  attendance: 'text-success-text',
  membership: 'text-purple',
  renewalHistory: 'text-warning-text',
  paymentHistory: 'text-success-text',
  lostHistory: 'text-danger-text',
  activityHistory: 'text-primary',
};

const VALID_DETAIL_TABS: readonly AdminMembersDetailTab[] = [
  'profile', 'attendance', 'membership', 'renewalHistory', 'paymentHistory', 'lostHistory', 'activityHistory', 'documents',
];

export default function AdminMembersDirectoryView({ model }: AdminMembersDirectoryViewProps) {
  const t = useTranslations('ADMIN_MEMBERS');
  const { activeTab, setActiveTab, viewingMember, setViewingMember, detailTab, setDetailTab, mainNav, detailNav, isDemoMode, dummyMembers, demoRenewals } = model;

  return (
    <div className="w-full space-y-6 text-text-primary">
      {!isDemoMode && <p role="status" className="mb-4 rounded-xl border border-warning bg-warning-bg p-3 text-warning-text">{t('LIVE_RECORDS_UNAVAILABLE')}</p>}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          {viewingMember && (
            <button
              type="button"
              data-testid="admin_members-AdminMembersDirectoryView-control-001"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors"
              aria-label={t('BACK_TO_LIST')}
              title={t('BACK_TO_LIST')}
              onClick={() => setViewingMember(null)}
            >
              <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
                {viewingMember ? t('MEMBER_DETAIL_TITLE', { name: viewingMember.name }) : t('PAGE_TITLE')}
              </h1>
              {!viewingMember && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-success bg-success-bg px-2.5 py-0.5 text-[11px] font-semibold text-success-text">
                  <span className="h-1.5 w-1.5 rounded-full bg-success motion-safe:animate-pulse" />
                  Live Directory
                </span>
              )}
            </div>
            <p className="mt-1 text-xs sm:text-sm text-text-secondary">
              {viewingMember
                ? t('MEMBER_DETAIL_SUMMARY', {
                    id: viewingMember.id,
                    status: t(
                      viewingMember.status === 'Active' ? 'STATUS_ACTIVE'
                        : viewingMember.status === 'Expired' ? 'STATUS_EXPIRED'
                        : viewingMember.status === 'Suspended' ? 'STATUS_SUSPENDED'
                        : viewingMember.status === 'Blocked' ? 'STATUS_BLOCKED'
                        : 'STATUS_UNKNOWN',
                    ),
                  })
                : t('PAGE_SUBTITLE')}
            </p>
          </div>
        </div>
      </div>

      {isDemoMode && !viewingMember && <AdminMembersDirectoryKpiGrid dummyMembers={dummyMembers} demoRenewals={demoRenewals} />}

      <div className="rounded-2xl border border-border bg-card p-1.5 flex gap-1.5 overflow-x-auto whitespace-nowrap shadow-card">
        {!viewingMember ? (
          mainNav.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                type="button"
                data-testid={`admin_members-AdminMembersDirectoryView-main-tab-${item.id}`}
                key={item.id}
                aria-current={isActive ? 'page' : undefined}
                aria-pressed={isActive}
                onClick={() => setActiveTab(item.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold motion-safe:transition-colors ${
                  isActive ? 'bg-primary text-on-primary shadow-card' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                }`}
              >
                <item.icon size={16} aria-hidden="true" className={`${isActive ? 'text-on-primary' : (TAB_ICON_COLORS[item.id] || 'text-primary')} shrink-0`} />
                <span>{t(item.labelKey)}</span>
              </button>
            );
          })
        ) : (
          detailNav.map((item) => {
            const isActive = detailTab === item.id;
            return (
              <button
                type="button"
                data-testid={`admin_members-AdminMembersDirectoryView-detail-tab-${item.id}`}
                key={item.id}
                aria-current={isActive ? 'page' : undefined}
                aria-pressed={isActive}
                onClick={() => setDetailTab(item.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold motion-safe:transition-colors ${
                  isActive ? 'bg-primary text-on-primary shadow-card' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                }`}
              >
                <item.icon size={16} aria-hidden="true" className={`${isActive ? 'text-on-primary' : (TAB_ICON_COLORS[item.id] || 'text-primary')} shrink-0`} />
                <span>{t(item.labelKey)}</span>
              </button>
            );
          })
        )}
      </div>

      <AdminMembersDirectoryViewMAINDASHBOARDVIEWSSection model={model} />
    </div>
  );
}

export function AdminMembersDirectoryViewMAINDASHBOARDVIEWSSection({ model }: AdminMembersDirectoryViewMAINDASHBOARDVIEWSSectionProps) {
  const t = useTranslations('ADMIN_MEMBERS');
  const { activeTab, setActiveTab, viewingMember, dummyMembers, isDemoMode, handleAction, openMemberDetails, handleBulkAddMembers } = model;
  const { selectedBranch, isAllBranches } = useAdminBranch();
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [isBulkWhatsAppOpen, setIsBulkWhatsAppOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  const branchFilteredMembers = useMemo(() => {
    if (isAllBranches || !selectedBranch) return dummyMembers;
    const branchNameLower = selectedBranch.name.toLowerCase().trim();
    return dummyMembers.filter((m) =>
      m.branch ? m.branch.toLowerCase().trim() === branchNameLower || m.branch.toLowerCase().includes(branchNameLower) : false,
    );
  }, [isAllBranches, selectedBranch, dummyMembers]);

  const toggleSelectOne = (id: string) => {
    setSelectedMemberIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const toggleSelectAll = () => {
    const allIds = branchFilteredMembers.map((m) => m.id);
    setSelectedMemberIds((prev) => (prev.length === allIds.length ? [] : allIds));
  };

  const memberListConfig = {
    all: { titleKey: 'NAV_ALL_MEMBERS', filterStatus: undefined },
    active: { titleKey: 'NAV_ACTIVE', filterStatus: ADMIN_MEMBERS_STATUS_VALUES[0] },
    expired: { titleKey: 'NAV_EXPIRED', filterStatus: ADMIN_MEMBERS_STATUS_VALUES[1] },
    suspended: { titleKey: 'NAV_SUSPENDED', filterStatus: ADMIN_MEMBERS_STATUS_VALUES[2] },
    blocked: { titleKey: 'NAV_BLOCKED', filterStatus: ADMIN_MEMBERS_STATUS_VALUES[3] },
  }[activeTab as 'all' | 'active' | 'expired' | 'suspended' | 'blocked'];

  return (
    <div className="space-y-6">
      {!viewingMember && memberListConfig && (
        <section className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card space-y-4" aria-labelledby="admin-members-list-title">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="admin-members-list-title" className="text-base sm:text-lg font-bold text-text-primary tracking-tight">{t(memberListConfig.titleKey)}</h2>
            <div className="flex flex-wrap items-center gap-2.5">
              <button type="button" onClick={() => setIsBulkImportOpen(true)} className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-border-focus bg-primary-subtle px-3.5 py-1.5 text-xs font-semibold text-primary hover:opacity-90 motion-safe:transition-opacity shadow-card" title={t('BULK_IMPORT_CSV_TITLE')}>
                <Upload size={14} aria-hidden="true" /> {t('BULK_IMPORT_CSV')}
              </button>
              <button type="button" onClick={() => setIsBulkWhatsAppOpen(true)} disabled={branchFilteredMembers.length === 0} className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-success bg-success-bg px-3.5 py-1.5 text-xs font-semibold text-success-text hover:opacity-90 motion-safe:transition-opacity disabled:opacity-40 shadow-card">
                <MessageSquare size={14} aria-hidden="true" /> {t('BULK_WHATSAPP_COUNT', { count: selectedMemberIds.length > 0 ? selectedMemberIds.length : branchFilteredMembers.length })}
              </button>
              <button type="button" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-warning bg-warning-bg px-3.5 py-1.5 text-xs font-semibold text-warning-text hover:opacity-90 motion-safe:transition-opacity shadow-card" onClick={() => setActiveTab('renewal')}>
                <RotateCcw size={15} aria-hidden="true" /> <span>{t('NAV_RENEWAL')}</span>
              </button>
            </div>
          </div>

          <AdminMembersMemberTable
            members={branchFilteredMembers}
            filterStatus={memberListConfig.filterStatus}
            onSelectMember={openMemberDetails}
            onAction={handleAction}
            canMutate={isDemoMode}
            selectedIds={selectedMemberIds}
            onToggleSelectOne={toggleSelectOne}
            onToggleSelectAll={toggleSelectAll}
          />
        </section>
      )}

      <AdminMembersDirectoryBulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onImport={(newMembers) => handleBulkAddMembers(newMembers)}
        defaultBranch={selectedBranch?.name || 'Main Branch'}
      />

      <AdminMembersDirectoryBulkWhatsAppModal
        isOpen={isBulkWhatsAppOpen}
        onClose={() => setIsBulkWhatsAppOpen(false)}
        members={selectedMemberIds.length > 0 ? branchFilteredMembers.filter((m) => selectedMemberIds.includes(m.id)) : branchFilteredMembers}
      />

      <AdminMembersDirectoryMemberForm model={model} />
      <AdminMembersDirectorySecondaryViews model={model} />
      {isDemoMode && !viewingMember && activeTab === 'export' && <AdminMembersDirectoryDataToolsView key={activeTab} mode="export" members={dummyMembers} />}
      {isDemoMode && !viewingMember && activeTab === 'documents' && <AdminMembersDirectoryDataToolsView key={activeTab} mode="documents" members={dummyMembers} />}

      {!isDemoMode && !viewingMember && ['categories', 'departments', 'renewal', 'import', 'export', 'documents'].includes(activeTab) && (
        <section className="rounded-2xl border border-border bg-card p-5" role="status">
          <h2 className="text-lg font-semibold text-text-primary">{t('FEATURE_DATA_UNAVAILABLE')}</h2>
          <p className="mt-2 text-text-secondary">{t('FEATURE_DATA_UNAVAILABLE_DESCRIPTION')}</p>
        </section>
      )}

      {model.viewingMember && (
        <AdminMembersDirectoryMemberDetailCard
          key={model.viewingMember.id}
          member={model.viewingMember}
          detailTab={model.detailTab}
          isDemoMode={isDemoMode}
          onSelectTab={(tab) => {
            const matched = VALID_DETAIL_TABS.find((candidate) => candidate === tab);
            if (matched) model.setDetailTab(matched);
          }}
        />
      )}
    </div>
  );
}

export { AdminMembersDirectoryDataToolsView };
export type { AdminMembersDirectoryDataToolsViewProps, AdminMembersDirectoryViewMAINDASHBOARDVIEWSSectionProps, AdminMembersDirectoryViewProps };
