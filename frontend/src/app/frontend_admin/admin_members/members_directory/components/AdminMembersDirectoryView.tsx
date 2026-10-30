// Responsibility: Own the Members Directory route's primary view and its cohesive screen-local child views.
'use client';

import React, { useMemo, useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Activity, AlertTriangle, ArrowLeft, CalendarClock, CheckCircle, CreditCard, DownloadCloud, FileText, RotateCcw, UserPlus, UserRound, Users } from 'lucide-react';
import toast from 'sonner';
import useAdminApplicationInfrastructureUrlQueryState from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import type { AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import { ADMIN_MEMBERS_DOCUMENT_FIXTURES, ADMIN_MEMBERS_EXPORT_PLAN_OPTIONS, ADMIN_MEMBERS_EXPORT_STATUS_OPTIONS, ADMIN_MEMBERS_STATUS_VALUES } from '@/app/frontend_admin/admin_members/members_directory/config/admin_members_directory.url_config';
import { downloadAdminMembersDemoCsv, formatAdminMembersDate } from '@/app/frontend_admin/admin_members/members_directory/utils/AdminMembersDirectoryExportUtils';
import AdminMembersDirectoryMemberForm from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryMemberForm';
import AdminMembersMemberTable from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryMemberTable';
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
              <AdminMembersMemberTable members={dummyMembers} filterStatus={memberListConfig.filterStatus} onSelectMember={openMemberDetails} onAction={handleAction} canMutate={isDemoMode}/>
            </section>
          )}

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
              {model.detailTab === 'profile' ? <div className="grid gap-4 sm:grid-cols-2"><div className="flex items-start gap-3"><UserRound size={18} aria-hidden="true"/><div><p className="text-sm text-text-secondary">{t('DETAIL_CONTACT')}</p><p>{member.email}</p><p>{member.phone}</p></div></div><div className="flex items-start gap-3"><CreditCard size={18} aria-hidden="true"/><div><p className="text-sm text-text-secondary">{t('DETAIL_MEMBERSHIP')}</p><p>{member.plan}</p><p>{t('DETAIL_STATUS_PREFIX', { status })}</p><p>{t('DETAIL_EXPIRY_PREFIX', { expiry: expiryDate })}</p></div></div></div>
              : model.detailTab === 'membership' ? <div className="flex items-start gap-3"><CalendarClock size={18} aria-hidden="true"/><div><h3 className="font-medium">{t('DETAIL_CURRENT_MEMBERSHIP')}</h3><p>{member.plan}</p><p>{t('DETAIL_STATUS_PREFIX', { status })}</p><p>{t('DETAIL_EXPIRY_PREFIX', { expiry: expiryDate })}</p></div></div>
              : model.detailTab === 'documents' ? <div className="flex items-start gap-3"><FileText size={18} aria-hidden="true"/><div><h3 className="font-medium">{t('DETAIL_MEMBER_DOCUMENTS')}</h3>{unavailable}</div></div>
              : model.detailTab === 'attendance' ? <div className="flex items-start gap-3"><Activity size={18} aria-hidden="true"/><div><h3 className="font-medium">{t('DETAIL_ATTENDANCE_HISTORY')}</h3>{unavailable}</div></div> : unavailable}
            </section>;
          })()}

      </div>;
}

export function AdminMembersDirectoryDataToolsView({ mode, members }: AdminMembersDirectoryDataToolsViewProps) {
  const t = useTranslations('ADMIN_MEMBERS');
  const locale = useLocale();
  const [search, setSearch] = useAdminApplicationInfrastructureUrlQueryState<string>('search', '');
  const [statusFilter, setStatusFilter] = useAdminApplicationInfrastructureUrlQueryState<AdminMembersExportStatusFilter>('statusFilter', 'all', { validValues: ['all', 'Active', 'Expired', 'Suspended', 'Blocked'] });
  const [planFilter, setPlanFilter] = useAdminApplicationInfrastructureUrlQueryState<'all' | 'Premium' | 'Standard'>('planFilter', 'all', { validValues: ['all', 'Premium', 'Standard'] });
  const documents = useMemo(() => ADMIN_MEMBERS_DOCUMENT_FIXTURES.filter((document) => `${document.memberId} ${document.memberLabel}`.toLowerCase().includes(search.trim().toLowerCase())), [search]);
  const filteredMembers = useMemo(() => members.filter((member) => (statusFilter === 'all' || member.status === statusFilter) && (planFilter === 'all' || member.plan.toLowerCase().includes(planFilter.toLowerCase()))), [members, planFilter, statusFilter]);
  const exportCsv = () => {
    if (!filteredMembers.length) { toast.info(t('EXPORT_NO_MATCH'), { id: 'admin_members-members_directory-components-AdminMembersDirectoryExportPanel-toast-31-1' }); return; }
    downloadAdminMembersDemoCsv(filteredMembers);
    toast.success(t('EXPORT_SUCCESS', { count: filteredMembers.length }), { id: 'admin_members-members_directory-components-AdminMembersDirectoryExportPanel-toast-35-2' });
  };
  if (mode === 'documents') {
    const formatDate = (date: string) => formatAdminMembersDate(date, locale, t('UNKNOWN_DATE'));
    return <section className="admin-card space-y-4 p-5" aria-labelledby="admin-members-documents-title"><h2 id="admin-members-documents-title" className="text-section-title font-semibold text-text-primary">{t('DOCUMENTS_TITLE')}</h2><div className="space-y-1"><label htmlFor="admin-members-document-search" className="admin-label">{t('DOCUMENTS_SEARCH_LABEL')}</label><input id="admin-members-document-search" type="search" className="admin-input" placeholder={t('DOCUMENTS_SEARCH_PLACEHOLDER')} value={search} onChange={(event) => setSearch(event.target.value)} aria-controls="admin-members-document-results"/></div><div id="admin-members-document-results" className="divide-y divide-border">{documents.length === 0 ? <p role="status" className="p-4 text-text-secondary">{t('DOCUMENTS_NO_MATCHES')}</p> : documents.map((document) => <div key={document.memberId} className="flex flex-wrap items-center gap-3 py-3"><FileText size={18} className="text-purple-text" aria-hidden="true"/><div className="min-w-0 flex-1"><p className="font-medium text-text-primary">{document.type}</p><p className="text-sm text-text-secondary">{document.memberLabel} · {formatDate(document.date)}</p></div><button type="button" className="admin-btn-ghost min-h-11" disabled title={t('DOCUMENTS_DOWNLOAD_CONTRACT_MISSING')}>{t('DOCUMENTS_DOWNLOAD_UNAVAILABLE')}</button></div>)}</div><p className="text-sm text-warning-text" role="status">{t('DOCUMENTS_SAMPLE_NOTICE')}</p></section>;
  }
  return <section className="admin-card space-y-5 p-5" aria-labelledby="admin-members-export-title"><div className="flex items-center gap-3"><DownloadCloud size={20} className="text-success-text" aria-hidden="true"/><div><h2 id="admin-members-export-title" className="text-section-title font-semibold text-text-primary">{t('EXPORT_TITLE')}</h2><p className="text-sm text-text-secondary">{t('EXPORT_DESCRIPTION')}</p></div></div><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-1"><label className="admin-label" htmlFor="admin-members-export-status">{t('EXPORT_FILTER_STATUS')}</label><select id="admin-members-export-status" className="admin-input" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}>{ADMIN_MEMBERS_EXPORT_STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{t(option.labelKey)}</option>)}</select></div><div className="space-y-1"><label className="admin-label" htmlFor="admin-members-export-plan">{t('EXPORT_FILTER_PLAN')}</label><select id="admin-members-export-plan" className="admin-input" value={planFilter} onChange={(event) => setPlanFilter(event.target.value as typeof planFilter)}>{ADMIN_MEMBERS_EXPORT_PLAN_OPTIONS.map((option) => <option key={option.value} value={option.value}>{t(option.labelKey)}</option>)}</select></div></div><p className="text-sm text-text-secondary" role="status" aria-live="polite">{t('EXPORT_MATCH_COUNT', { count: filteredMembers.length })}</p><div className="flex flex-wrap gap-3 border-t border-border pt-4"><button type="button" className="admin-btn-primary min-h-11" onClick={exportCsv}><FileText size={18} aria-hidden="true"/> {t('EXPORT_CSV')}</button><button type="button" className="admin-btn-ghost min-h-11" disabled title={t('EXPORT_XLSX_CONTRACT_MISSING')}><FileText size={18} aria-hidden="true"/> {t('EXPORT_XLSX_UNAVAILABLE')}</button></div></section>;
}

export type { AdminMembersDirectoryViewProps, AdminMembersDirectoryViewMAINDASHBOARDVIEWSSectionProps, AdminMembersDirectoryDataToolsViewProps };
