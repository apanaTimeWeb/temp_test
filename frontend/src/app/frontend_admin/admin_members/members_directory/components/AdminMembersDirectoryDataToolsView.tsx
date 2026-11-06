'use client';
// RESPONSIBILITY: AdminMembersDirectoryDataToolsView component owned by admin_members.

import { useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { DownloadCloud, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { ADMIN_MEMBERS_DOCUMENT_FIXTURES, ADMIN_MEMBERS_EXPORT_PLAN_OPTIONS, ADMIN_MEMBERS_EXPORT_STATUS_OPTIONS } from '@/app/frontend_admin/admin_members/members_directory/config/admin_members_directory.url_config';
import { downloadAdminMembersDemoCsv, formatAdminMembersDate } from '@/app/frontend_admin/admin_members/members_directory/utils/AdminMembersDirectoryExportUtils';
import type { AdminMembersDirectoryDataToolsViewProps, AdminMembersExportStatusFilter } from '@/app/frontend_admin/admin_members/members_directory/types/AdminMembersDirectoryComponentTypes';

export default function AdminMembersDirectoryDataToolsView({ mode, members }: AdminMembersDirectoryDataToolsViewProps) {
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
    return (
      <section className="admin-card space-y-4 p-5" aria-labelledby="admin-members-documents-title">
        <h2 id="admin-members-documents-title" className="text-section-title font-semibold text-text-primary">{t('DOCUMENTS_TITLE')}</h2>
        <div className="space-y-1">
          <label htmlFor="admin-members-document-search" className="admin-label">{t('DOCUMENTS_SEARCH_LABEL')}</label>
          <input id="admin-members-document-search" type="search" className="admin-input" placeholder={t('DOCUMENTS_SEARCH_PLACEHOLDER')} value={search} onChange={(event) => setSearch(event.target.value)} aria-controls="admin-members-document-results"/>
        </div>
        <div id="admin-members-document-results" className="divide-y divide-border">
          {documents.length === 0 ? (
            <p role="status" className="p-4 text-text-secondary">{t('DOCUMENTS_NO_MATCHES')}</p>
          ) : (
            documents.map((document) => (
              <div key={document.memberId} className="flex flex-wrap items-center gap-3 py-3">
                <FileText size={18} className="text-purple-text" aria-hidden="true"/>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-text-primary">{document.type}</p>
                  <p className="text-sm text-text-secondary">{document.memberLabel} · {formatDate(document.date)}</p>
                </div>
                <button type="button" className="admin-btn-ghost min-h-11" disabled title={t('DOCUMENTS_DOWNLOAD_CONTRACT_MISSING')}>{t('DOCUMENTS_DOWNLOAD_UNAVAILABLE')}</button>
              </div>
            ))
          )}
        </div>
        <p className="text-sm text-warning-text" role="status">{t('DOCUMENTS_SAMPLE_NOTICE')}</p>
      </section>
    );
  }
  return (
    <section className="admin-card space-y-5 p-5" aria-labelledby="admin-members-export-title">
      <div className="flex items-center gap-3">
        <DownloadCloud size={20} className="text-success-text" aria-hidden="true"/>
        <div>
          <h2 id="admin-members-export-title" className="text-section-title font-semibold text-text-primary">{t('EXPORT_TITLE')}</h2>
          <p className="text-sm text-text-secondary">{t('EXPORT_DESCRIPTION')}</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="admin-label" htmlFor="admin-members-export-status">{t('EXPORT_FILTER_STATUS')}</label>
          <select id="admin-members-export-status" className="admin-input" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}>
            {ADMIN_MEMBERS_EXPORT_STATUS_OPTIONS.map((option) => (<option key={option.value} value={option.value}>{t(option.labelKey)}</option>))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="admin-label" htmlFor="admin-members-export-plan">{t('EXPORT_FILTER_PLAN')}</label>
          <select id="admin-members-export-plan" className="admin-input" value={planFilter} onChange={(event) => setPlanFilter(event.target.value as typeof planFilter)}>
            {ADMIN_MEMBERS_EXPORT_PLAN_OPTIONS.map((option) => (<option key={option.value} value={option.value}>{t(option.labelKey)}</option>))}
          </select>
        </div>
      </div>
      <p className="text-sm text-text-secondary" role="status" aria-live="polite">{t('EXPORT_MATCH_COUNT', { count: filteredMembers.length })}</p>
      <div className="flex flex-wrap gap-3 border-t border-border pt-4">
        <button type="button" className="admin-btn-primary min-h-11" onClick={exportCsv}><FileText size={18} aria-hidden="true"/> {t('EXPORT_CSV')}</button>
        <button type="button" className="admin-btn-ghost min-h-11" disabled title={t('EXPORT_XLSX_CONTRACT_MISSING')}><FileText size={18} aria-hidden="true"/> {t('EXPORT_XLSX_UNAVAILABLE')}</button>
      </div>
    </section>
  );
}

export { AdminMembersDirectoryDataToolsView };

