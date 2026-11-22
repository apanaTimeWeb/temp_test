'use client';
// RESPONSIBILITY: AdminMembersDirectoryDataToolsView component owned by admin_members.

import { ADMIN_MEMBERS_DOCUMENT_FIXTURES,ADMIN_MEMBERS_EXPORT_PLAN_OPTIONS,ADMIN_MEMBERS_EXPORT_STATUS_OPTIONS } from '@/app/frontend_admin/admin_members/members_directory/config/admin_members_directory.url_config';
import type { AdminMembersDirectoryDataToolsViewProps,AdminMembersExportStatusFilter } from '@/app/frontend_admin/admin_members/members_directory/types/AdminMembersDirectoryComponentTypes';
import { downloadAdminMembersDemoCsv,downloadAdminMembersDemoExcel,formatAdminMembersDate,printAdminMembersRoster } from '@/app/frontend_admin/admin_members/members_directory/utils/AdminMembersDirectoryExportUtils';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { DownloadCloud,FileSpreadsheet,FileText,Filter,Printer,Search } from 'lucide-react';
import { useLocale,useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { toast } from 'sonner';

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
  const exportExcel = () => {
    if (!filteredMembers.length) { toast.info(t('EXPORT_NO_MATCH'), { id: 'admin_members-export-excel-empty' }); return; }
    downloadAdminMembersDemoExcel(filteredMembers);
    toast.success(`Exported ${filteredMembers.length} member records to Excel (.xls).`);
  };
  const printRoster = () => {
    if (!filteredMembers.length) { toast.info(t('EXPORT_NO_MATCH'), { id: 'admin_members-print-empty' }); return; }
    printAdminMembersRoster(filteredMembers);
  };
  const handleDownloadDoc = (doc: (typeof ADMIN_MEMBERS_DOCUMENT_FIXTURES)[number]) => {
    const content = `SMART LIBRARY - STUDENT DOCUMENT VERIFICATION RECORD
=====================================================
Document Record ID : DOC-${doc.memberId}-${Date.now().toString().slice(-4)}
Member ID          : ${doc.memberId}
Student Name       : ${doc.memberLabel}
Document Type      : ${doc.type}
Verification Date  : ${doc.date}
Verification Status: VERIFIED & AUTHENTICATED
Issuing Authority  : Central Administration, Smart Library Operations
Digital Fingerprint: SHA256-${Math.random().toString(36).substring(2, 12).toUpperCase()}

Note: This digital record confirms the student's identity and membership eligibility for library desk allotment.
=====================================================
Smart Library Management System - Confidential Admin Export`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.memberId}_${doc.type.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${doc.type} for ${doc.memberLabel}`);
  };
  if (mode === 'documents') {
    const formatDate = (date: string) => formatAdminMembersDate(date, locale, t('UNKNOWN_DATE'));
    return (
      <section className="admin-card space-y-4 p-5" aria-labelledby="admin-members-documents-title">
        <div className="flex items-center gap-2.5">
          <FileText size={20} className="text-fuchsia-400" />
          <h2 id="admin-members-documents-title" className="text-section-title font-semibold text-text-primary">{t('DOCUMENTS_TITLE')}</h2>
        </div>
        <div className="space-y-1">
          <label htmlFor="admin-members-document-search" className="admin-label flex items-center gap-1.5">
            <Search size={14} className="text-sky-400" />
            <span>{t('DOCUMENTS_SEARCH_LABEL')}</span>
          </label>
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400 pointer-events-none" />
            <input maxLength={30}
              id="admin-members-document-search"
              type="search"
              className="admin-input pl-10"
              placeholder={t('DOCUMENTS_SEARCH_PLACEHOLDER')}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-controls="admin-members-document-results"
            />
          </div>
        </div>
        <div id="admin-members-document-results" className="divide-y divide-border">
          {documents.length === 0 ? (
            <p role="status" className="p-4 text-text-secondary">{t('DOCUMENTS_NO_MATCHES')}</p>
          ) : (
            documents.map((document) => (
              <div key={document.memberId} className="flex flex-wrap items-center gap-3 py-3">
                <FileText size={18} className="text-fuchsia-400 shrink-0" aria-hidden="true"/>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-text-primary">{document.type}</p>
                  <p className="text-sm text-text-secondary">{document.memberLabel} · {formatDate(document.date)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownloadDoc(document)}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-fuchsia-500/40 bg-fuchsia-500/15 px-3 py-1.5 text-xs font-semibold text-fuchsia-300 hover:bg-fuchsia-500/25 transition-all shadow-sm"
                  title={`Download verified ${document.type}`}
                >
                  <DownloadCloud size={14} className="text-fuchsia-400" />
                  <span>Download</span>
                </button>
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
        <DownloadCloud size={22} className="text-teal-400" aria-hidden="true"/>
        <div>
          <h2 id="admin-members-export-title" className="text-section-title font-semibold text-text-primary">{t('EXPORT_TITLE')}</h2>
          <p className="text-sm text-text-secondary">Export directory records matching your selected status and plan filters.</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="admin-label flex items-center gap-1.5" htmlFor="admin-members-export-status">
            <Filter size={13} className="text-emerald-400" />
            <span>{t('EXPORT_FILTER_STATUS')}</span>
          </label>
          <select id="admin-members-export-status" className="admin-input" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}>
            {ADMIN_MEMBERS_EXPORT_STATUS_OPTIONS.map((option) => (<option key={option.value} value={option.value}>{t(option.labelKey)}</option>))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="admin-label flex items-center gap-1.5" htmlFor="admin-members-export-plan">
            <span>{t('EXPORT_FILTER_PLAN')}</span>
          </label>
          <select id="admin-members-export-plan" className="admin-input" value={planFilter} onChange={(event) => setPlanFilter(event.target.value as typeof planFilter)}>
            {ADMIN_MEMBERS_EXPORT_PLAN_OPTIONS.map((option) => (<option key={option.value} value={option.value}>{t(option.labelKey)}</option>))}
          </select>
        </div>
      </div>
      <p className="text-sm text-text-secondary" role="status" aria-live="polite">{t('EXPORT_MATCH_COUNT', { count: filteredMembers.length })}</p>
      <div className="flex flex-wrap gap-3 border-t border-border pt-4">
        <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-teal-500/40 bg-teal-500/15 px-4 py-2 text-xs font-semibold text-teal-300 hover:bg-teal-500/25 transition-all shadow-sm min-h-11" aria-label={t('EXPORT_CSV')} onClick={exportCsv}>
          <DownloadCloud size={16} className="text-teal-400" aria-hidden="true"/>
          <span>Export CSV</span>
        </button>
        <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 transition-all shadow-sm min-h-11" onClick={exportExcel}>
          <FileSpreadsheet size={16} className="text-emerald-400" aria-hidden="true"/>
          <span>Export Excel (.xls)</span>
        </button>
        <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-sky-500/40 bg-sky-500/15 px-4 py-2 text-xs font-semibold text-sky-300 hover:bg-sky-500/25 transition-all shadow-sm min-h-11" onClick={printRoster}>
          <Printer size={16} className="text-sky-400" aria-hidden="true"/>
          <span>Print Roster</span>
        </button>
      </div>
    </section>
  );
}

export { AdminMembersDirectoryDataToolsView };

