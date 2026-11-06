'use client';
// Responsibility: Own the Members Directory route's primary view and its cohesive screen-local child views.

import React, { useMemo, useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Activity, AlertTriangle, Armchair, ArrowLeft, CalendarClock, CheckCircle, CreditCard, DownloadCloud, FileText, IndianRupee, MessageSquare, RotateCcw, ShieldAlert, UserPlus, UserRound, Users, Building2 } from 'lucide-react';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { ALL_BRANCHES_ID } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBranchConstants';
import { toast } from 'sonner';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import type { AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import { ADMIN_MEMBERS_DOCUMENT_FIXTURES, ADMIN_MEMBERS_EXPORT_PLAN_OPTIONS, ADMIN_MEMBERS_EXPORT_STATUS_OPTIONS, ADMIN_MEMBERS_STATUS_VALUES } from '@/app/frontend_admin/admin_members/members_directory/config/admin_members_directory.url_config';
import { downloadAdminMembersDemoCsv, formatAdminMembersDate } from '@/app/frontend_admin/admin_members/members_directory/utils/AdminMembersDirectoryExportUtils';
import AdminMembersDirectoryMemberForm from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryMemberForm';
import AdminMembersMemberTable from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryMemberTable';
import AdminMembersDirectoryBulkWhatsAppModal from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryBulkWhatsAppModal';
import AdminMembersDirectoryDataToolsView from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryDataToolsView';
import AdminMembersDirectorySecondaryViews from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectorySecondaryViews';
import type { AdminMembersDirectoryDataToolsViewProps, AdminMembersDirectoryViewProps, AdminMembersDirectoryViewMAINDASHBOARDVIEWSSectionProps, AdminMembersExportStatusFilter } from '@/app/frontend_admin/admin_members/members_directory/types/AdminMembersDirectoryComponentTypes';

export default function AdminMembersDirectoryView({ model }: AdminMembersDirectoryViewProps) {
  const t = useTranslations('ADMIN_MEMBERS');
  const { activeTab, setActiveTab, viewingMember, setViewingMember, detailTab, setDetailTab, mainNav, detailNav, isDemoMode, dummyMembers, demoRenewals } = model;
  return (
    <div className="motion-safe:transition-opacity motion-safe:duration-base admin-shared-page-container" >
      {!isDemoMode && <p role="status" className="mb-4 rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('LIVE_RECORDS_UNAVAILABLE')}</p>}
      
      {/* HEADER */}
      <div className="admin-shared-toolbar" >
        {viewingMember && (
          <button type="button" data-testid="admin_members-AdminMembersDirectoryView-control-001" className="admin-btn-icon" aria-label={t('BACK_TO_LIST')} title={t('BACK_TO_LIST')} onClick={() => setViewingMember(null)}>
            <ArrowLeft size={18} strokeWidth={2} aria-hidden="true"/>
          </button>
        )}
        <div>
          <h1 className="admin-shared-page-title" >
            {viewingMember ? t('MEMBER_DETAIL_TITLE', { name: viewingMember.name }) : t('PAGE_TITLE')}
          </h1>
          <p className="admin-shared-page-subtitle" >
            {viewingMember ? t('MEMBER_DETAIL_SUMMARY', { id: viewingMember.id, status: t(viewingMember.status === 'Active' ? 'STATUS_ACTIVE' : viewingMember.status === 'Expired' ? 'STATUS_EXPIRED' : viewingMember.status === 'Suspended' ? 'STATUS_SUSPENDED' : viewingMember.status === 'Blocked' ? 'STATUS_BLOCKED' : 'STATUS_UNKNOWN') }) : t('PAGE_SUBTITLE')}
          </p>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      {isDemoMode && !viewingMember && (
        <section aria-label={t('DEMO_METRICS_NOTICE')} className="space-y-2">
        <p className="text-caption text-text-secondary" role="note">{t('DEMO_METRICS_NOTICE')}</p>
        <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6" >
          {[
            { label: t('KPI_TOTAL_MEMBERS'), value: String(dummyMembers.length), icon: Users, color: 'primary' },
            { label: t('KPI_ACTIVE_MEMBERS'), value: String(dummyMembers.filter((member) => member.status === 'Active').length), icon: CheckCircle, color: 'success' },
            { label: t('KPI_NEW_THIS_MONTH'), value: '—', icon: UserPlus, color: 'purple' },
            { label: t('KPI_PENDING_RENEWALS'), value: String(demoRenewals.filter((renewal) => !renewal.reminderRecorded).length), icon: AlertTriangle, color: 'danger' }
          ].map((kpi, i) => (
            <div key={kpi.label} className="admin-card motion-safe:hover:-translate-y-1 flex items-center gap-5 p-5 motion-safe:transition-transform motion-safe:duration-base" >
              <div className="flex h-16 w-16 items-center justify-center rounded-xl" data-admin-bg={kpi.color} data-admin-color={kpi.color}>
                {React.createElement(kpi.icon as React.ElementType, { size: 28 })}
              </div>
              <div>
                <div className="text-body font-semibold uppercase tracking-wide text-text-secondary" >{kpi.label}</div>
                <div className="mt-1 text-kpi font-extrabold text-text-primary" >{kpi.value}</div>
              </div>
            </div>
          ))}
        </div>
        </section>
      )}

      {/* TOP SCROLLABLE NAVIGATION TABS */}
      <div className="admin-card mb-6 flex gap-2 overflow-x-auto whitespace-nowrap p-2" >
        {!viewingMember ? (
          mainNav.map((item) => (
            <button type="button" data-testid={`admin_members-AdminMembersDirectoryView-main-tab-${item.id}`}
              key={item.id}
              aria-current={activeTab === item.id ? 'page' : undefined}
              aria-pressed={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
              className={`admin-tab-button ${activeTab === item.id ? "admin-tab-button-active" : ""}`}
            >
              <item.icon size={18} aria-hidden="true" className={activeTab === item.id ? "text-primary" : "text-text-secondary"} />
              {t(item.labelKey)}
            </button>
          ))
        ) : (
          detailNav.map((item) => (
            <button type="button" data-testid={`admin_members-AdminMembersDirectoryView-detail-tab-${item.id}`}
              key={item.id}
              aria-current={detailTab === item.id ? 'page' : undefined}
              aria-pressed={detailTab === item.id}
              onClick={() => setDetailTab(item.id)}
              className={`admin-tab-button ${detailTab === item.id ? "admin-tab-button-active" : ""}`}
            >
              <item.icon size={18} aria-hidden="true" className={detailTab === item.id ? "text-primary" : "text-text-secondary"} />
              {t(item.labelKey)}
            </button>
          ))
        )}
      </div>

      {/* CONTENT AREA */}
      <AdminMembersDirectoryViewMAINDASHBOARDVIEWSSection model={model} />
    </div>
  );
}

export function AdminMembersDirectoryViewMAINDASHBOARDVIEWSSection({ model }: AdminMembersDirectoryViewMAINDASHBOARDVIEWSSectionProps) {
  const t = useTranslations('ADMIN_MEMBERS');
  const locale = useLocale();
  const { activeTab, setActiveTab, viewingMember, dummyMembers, isDemoMode, handleAction, openMemberDetails } = model;
  const { branches, selectedBranchId, selectedBranch, setSelectedBranchId, isAllBranches } = useAdminBranch();
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [isBulkWhatsAppOpen, setIsBulkWhatsAppOpen] = useState(false);

  const branchFilteredMembers = useMemo(() => {
    if (isAllBranches || !selectedBranch) return dummyMembers;
    return dummyMembers.filter((m) =>
      m.branch ? m.branch.toLowerCase().includes(selectedBranch.name.toLowerCase()) : true
    );
  }, [isAllBranches, selectedBranch, dummyMembers]);

  const toggleSelectOne = (id: string) => {
    setSelectedMemberIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const toggleSelectAll = () => {
    const allIds = branchFilteredMembers.map((m) => m.id);
    setSelectedMemberIds((prev) => (prev.length === allIds.length ? [] : allIds));
  };
  const clearSelection = () => setSelectedMemberIds([]);

  const memberListConfig = {
    all: { titleKey: 'NAV_ALL_MEMBERS', filterStatus: undefined },
    active: { titleKey: 'NAV_ACTIVE', filterStatus: ADMIN_MEMBERS_STATUS_VALUES[0] },
    expired: { titleKey: 'NAV_EXPIRED', filterStatus: ADMIN_MEMBERS_STATUS_VALUES[1] },
    suspended: { titleKey: 'NAV_SUSPENDED', filterStatus: ADMIN_MEMBERS_STATUS_VALUES[2] },
    blocked: { titleKey: 'NAV_BLOCKED', filterStatus: ADMIN_MEMBERS_STATUS_VALUES[3] },
  }[activeTab as 'all' | 'active' | 'expired' | 'suspended' | 'blocked'];
  return <div className="admin-shared-stack" >
          
          {/* -------------------- MAIN DASHBOARD VIEWS -------------------- */}
          {!viewingMember && memberListConfig && (
            <section className="admin-card admin-shared-card-padding" aria-labelledby="admin-members-list-title" >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="admin-members-list-title" className="admin-shared-section-heading">{t(memberListConfig.titleKey)}</h2>
                <button type="button" className="admin-btn-ghost inline-flex min-h-11 items-center gap-2" onClick={() => setActiveTab('renewal')}>
                  <RotateCcw size={18} aria-hidden="true" />{t('NAV_RENEWAL')}
                </button>
              </div>

              {/* Multi-Branch Filter Pills */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-lg border border-border bg-surface-highlight p-2.5 my-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-text-secondary mr-1">
                    <Building2 size={13} className="text-primary shrink-0" />
                    Branch:
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedBranchId(ALL_BRANCHES_ID)}
                    className={`min-h-7 rounded-full px-2.5 py-0.5 text-xs font-medium motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isAllBranches
                        ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                        : 'bg-card text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    All Branches ({dummyMembers.length})
                  </button>
                  {branches.map((b) => {
                    const count = dummyMembers.filter((m) => m.branch?.toLowerCase().includes(b.name.toLowerCase())).length;
                    const isSelected = selectedBranchId === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBranchId(b.id)}
                        className={`min-h-7 rounded-full px-2.5 py-0.5 text-xs font-medium motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                          isSelected
                            ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                            : 'bg-card text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        {b.name} ({count})
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  {selectedMemberIds.length > 0 && (
                    <button type="button" onClick={clearSelection} className="text-xs text-text-secondary hover:text-text-primary underline px-1">
                      Clear ({selectedMemberIds.length})
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsBulkWhatsAppOpen(true)}
                    disabled={branchFilteredMembers.length === 0}
                    className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-success-bg bg-success-bg px-2.5 py-1 text-xs font-semibold text-success-text hover:bg-success hover:text-on-success transition-all disabled:opacity-50"
                  >
                    <MessageSquare size={13} /> Bulk WhatsApp
                    {selectedMemberIds.length > 0 && (
                      <span className="rounded-full bg-success text-on-success px-1.5 py-0.2 text-[10px] font-bold">
                        {selectedMemberIds.length}
                      </span>
                    )}
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

          {/* Bulk WhatsApp Modal */}
          <AdminMembersDirectoryBulkWhatsAppModal
            isOpen={isBulkWhatsAppOpen}
            onClose={() => setIsBulkWhatsAppOpen(false)}
            members={selectedMemberIds.length > 0 ? branchFilteredMembers.filter((m) => selectedMemberIds.includes(m.id)) : branchFilteredMembers}
          />

          {/* ADD MEMBER FORM */}
          <AdminMembersDirectoryMemberForm model={model} />

          {/* SECONDARY TAB VIEWS share the parent active-tab lifecycle. */}
          <AdminMembersDirectorySecondaryViews model={model} />
          {isDemoMode && !viewingMember && activeTab === 'export' && <AdminMembersDirectoryDataToolsView key={activeTab} mode="export" members={dummyMembers} />}
          {isDemoMode && !viewingMember && activeTab === 'documents' && <AdminMembersDirectoryDataToolsView key={activeTab} mode="documents" members={dummyMembers} />}

          {!isDemoMode && !viewingMember && ['categories', 'departments', 'renewal', 'import', 'export', 'documents'].includes(activeTab) && (
            <section className="admin-card p-5" role="status">
              <h2 className="text-lg font-semibold">{t('FEATURE_DATA_UNAVAILABLE')}</h2>
              <p className="mt-2 text-text-secondary">{t('FEATURE_DATA_UNAVAILABLE_DESCRIPTION')}</p>
            </section>
          )}

          {/* -------------------- DETAILED MEMBER VIEW -------------------- */}
          {model.viewingMember && (() => {
            const member = model.viewingMember;
            const detailLabels = { profile: t('DETAIL_PROFILE'), attendance: t('DETAIL_ATTENDANCE'), membership: t('DETAIL_MEMBERSHIP'), renewalHistory: t('DETAIL_RENEWAL_HISTORY'), paymentHistory: t('DETAIL_PAYMENT_HISTORY'), lostHistory: t('DETAIL_LOST_HISTORY'), activityHistory: t('DETAIL_ACTIVITY_HISTORY'), documents: t('DETAIL_DOCUMENTS') } as const;
            const status = t(({ Active: 'STATUS_ACTIVE', Expired: 'STATUS_EXPIRED', Suspended: 'STATUS_SUSPENDED', Blocked: 'STATUS_BLOCKED' } as const)[member.status] ?? 'STATUS_UNKNOWN');
            const expiryDate = formatAdminMembersDate(member.expiryDate, locale, t('UNKNOWN_DATE'));
            const unavailable = <p className="rounded-md border border-warning-bg bg-warning-bg p-4 text-warning-text" role="status">{t('DETAIL_API_UNAVAILABLE', { section: detailLabels[model.detailTab] ?? t('DETAIL_TAB_UNKNOWN') })}</p>;
            return <section className="admin-card mt-4 p-5"><div className="mb-5 flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-lg font-semibold">{member.name}</h2><p className="text-sm text-text-secondary">{member.id}</p></div><button type="button" className="admin-btn-ghost disabled:cursor-not-allowed disabled:opacity-50" disabled={!model.isDemoMode} title={!model.isDemoMode ? t('MEMBER_EDIT_UNAVAILABLE') : undefined} onClick={() => model.handleAction('EDIT', member)}>{t('ACTION_EDIT_MEMBER')}</button></div>
              {model.detailTab === 'profile' ? <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-start gap-3"><UserRound size={18} aria-hidden="true"/><div><p className="text-sm text-text-secondary">{t('DETAIL_CONTACT')}</p><p>{member.email}</p><p>{member.phone}</p></div></div>
                  <div className="flex items-start gap-3"><CreditCard size={18} aria-hidden="true"/><div><p className="text-sm text-text-secondary">{t('DETAIL_MEMBERSHIP')}</p><p>{member.plan}</p><p>{t('DETAIL_STATUS_PREFIX', { status })}</p><p>{t('DETAIL_EXPIRY_PREFIX', { expiry: expiryDate })}</p></div></div>
                  <div className="flex items-start gap-3"><Armchair size={18} aria-hidden="true"/><div><p className="text-sm text-text-secondary">Seat & Shift</p><p className="font-semibold text-text-primary text-sm">{member.seat ? `Seat: ${member.seat}` : 'Seat: Unassigned'}</p><p className="text-xs text-text-secondary">Shift: {member.shift || 'General'}</p><p className="text-xs text-text-secondary">Locker: {member.locker || '—'}</p></div></div>
                  <div className="flex items-start gap-3"><IndianRupee size={18} aria-hidden="true"/><div><p className="text-sm text-text-secondary">Fee Status</p><p className={member.feeStatus === 'Due' ? 'text-danger-text font-semibold text-sm' : 'text-success-text font-semibold text-sm'}>{member.feeStatus || 'Paid'}</p>{member.totalPaidMinor !== undefined && <p className="text-xs text-text-secondary">Paid: ₹{((member.totalPaidMinor || 0) / 100).toLocaleString('en-IN')}</p>}{member.dueFeeMinor !== undefined && member.dueFeeMinor > 0 && <p className="text-xs text-danger-text font-medium">Due: ₹{((member.dueFeeMinor || 0) / 100).toLocaleString('en-IN')}</p>}</div></div>
                  {member.branch && <div className="flex items-start gap-3"><Users size={18} aria-hidden="true"/><div><p className="text-sm text-text-secondary">Branch</p><p className="font-medium text-text-primary text-sm">{member.branch}</p></div></div>}
                </div>
                <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
                  {member.phone && (
                    <a
                      href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-btn-ghost inline-flex min-h-11 items-center gap-1.5 text-success-text hover:text-success-text"
                    >
                      <MessageSquare size={16} aria-hidden="true"/> WhatsApp
                    </a>
                  )}
                  {member.status === 'Active' && (
                    <button
                      type="button"
                      className="admin-btn-ghost inline-flex min-h-11 items-center gap-1.5 text-warning-text hover:text-warning-text"
                      onClick={() => toast.info(`Member status change requested for ${member.name}`)}
                    >
                      <ShieldAlert size={16} aria-hidden="true"/> Suspend
                    </button>
                  )}
                </div>
              </div>
              : model.detailTab === 'membership' ? <div className="flex items-start gap-3"><CalendarClock size={18} aria-hidden="true"/><div><h3 className="font-medium">{t('DETAIL_CURRENT_MEMBERSHIP')}</h3><p>{member.plan}</p><p>{t('DETAIL_STATUS_PREFIX', { status })}</p><p>{t('DETAIL_EXPIRY_PREFIX', { expiry: expiryDate })}</p></div></div>
              : model.detailTab === 'documents' ? <div className="flex items-start gap-3"><FileText size={18} aria-hidden="true"/><div><h3 className="font-medium">{t('DETAIL_MEMBER_DOCUMENTS')}</h3>{unavailable}</div></div>
              : model.detailTab === 'attendance' ? <div className="flex items-start gap-3"><Activity size={18} aria-hidden="true"/><div><h3 className="font-medium">{t('DETAIL_ATTENDANCE_HISTORY')}</h3>{unavailable}</div></div> : unavailable}
            </section>;
          })()}

      </div>;
}

export { AdminMembersDirectoryDataToolsView };
export type { AdminMembersDirectoryViewProps, AdminMembersDirectoryViewMAINDASHBOARDVIEWSSectionProps, AdminMembersDirectoryDataToolsViewProps };
