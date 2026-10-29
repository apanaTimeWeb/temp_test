'use client';
// RESPONSIBILITY: Provide the page/orchestration entry component for the components feature. It does not own backend persistence or cross-feature business logic.
import { ManagerMembersDocumentVaultEmptyState } from '@/app/frontend_manager/manager_members/members_document_vault/components/ManagerMembersDocumentVaultEmptyState';
import { useTranslations } from 'next-intl';
import ManagerMembersDocumentVaultNativeTable, { type NativeCellParams } from '@/app/frontend_manager/manager_members/members_document_vault/components/manager_members_document_vault_table_parts/ManagerMembersDocumentVaultNativeTable';

import { FolderOpen, Search, FileText, Image as ImageIcon, File } from 'lucide-react';
import { MANAGER_DOCUMENTS_SAMPLE_RECORDS } from '@/app/frontend_manager/manager_members/members_document_vault/hooks/ManagerMembersDocumentVaultDemoRepository';
import { MANAGER_DOCUMENTS_CATEGORIES } from '@/app/frontend_manager/manager_members/members_document_vault/constants/ManagerMembersDocumentVaultConstants';
import { useManagerDocumentVaultFilters } from '@/app/frontend_manager/manager_members/members_document_vault/hooks/useManagerMembersDocumentVaultFilters';


export default function ManagerMembersDocumentVaultPage() {
  const tManagerUi = useTranslations('manager.manager_document_vault.ui');
  const { rowData, visibleRows, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, categoryCounts } = useManagerDocumentVaultFilters();

  // BLOCKED_BY_SUPPLIED_SCOPE: document storage/download/delete API contracts were not supplied.
  const getFileIcon = (type: string) => {
    if (type === 'PDF') return <FileText size={18} className="text-danger" />;
    if (type === 'Image') return <ImageIcon size={18} className="text-primary" />;
    return <File size={18} className="text-info" />;
  };

  const colDefs = [
    { 
      field: 'name', 
      headerName: tManagerUi('file_name'), 
      flex: 1,
      cellRenderer: (params: NativeCellParams<(typeof MANAGER_DOCUMENTS_SAMPLE_RECORDS)[number]>) => (
        <div className="flex items-center gap-3 h-full">
          {getFileIcon(params.data?.type ?? 'Document')}
          <span className="mgr-cell-name font-medium">{String(params.value ?? '')}</span>
        </div>
      )
    },
    { field: 'category', headerName: tManagerUi('category'), width: 150 },
    { field: 'size', headerName: tManagerUi('size'), width: 100 },
    { field: 'uploadedBy', headerName: tManagerUi('uploaded_by'), width: 160 },
    { field: 'date', headerName: tManagerUi('date'), width: 120 },
    {
      headerName: tManagerUi('actions'),
      width: 120,
      sortable: false,
      cellRenderer: (params: NativeCellParams<typeof MANAGER_DOCUMENTS_SAMPLE_RECORDS[number]>) => (
        <div className="flex gap-2 items-center h-full">
          <button type="button" disabled className="mgr-btn-ghost mgr-btn-sm cursor-not-allowed" title={tManagerUi('download_unavailable_the_source_files_download_contract_2a0e5a')} aria-label={tManagerUi('download_unavailable_for_document')}>
            {tManagerUi('download_unavailable')}
          </button>
          <button type="button" disabled className="mgr-btn-ghost mgr-btn-sm text-danger cursor-not-allowed" title={tManagerUi('delete_unavailable_no_verified_host_document_deletion_co_5d72da')} aria-label={tManagerUi('delete_unavailable_for_document')}>
            {tManagerUi('delete_unavailable')}
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="mgr-page">
      <div className="mgr-page-header">
        <div>
          <div className="mgr-breadcrumb">{tManagerUi('home_documents')}</div>
          <h1 className="mgr-page-title">{tManagerUi('document_vault')}</h1>
        </div>
        <div className="mgr-page-actions">
          <button type="button" disabled title={tManagerUi('upload_unavailable_no_verified_host_document_storage_con_afc538')} className="mgr-btn-primary cursor-not-allowed">
            <span>{tManagerUi('upload_unavailable')}</span>
          </button>
        </div>
      </div>
      <p className="mb-4 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status" data-testid="manager-documents-contract-warning">{tManagerUi('this_list_contains_sample_metadata_only_upload_download_eac538')}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" aria-label={tManagerUi('document_categories')}>
        {MANAGER_DOCUMENTS_CATEGORIES.map((category) => {
          const count = categoryCounts[category.key];
          const selected = selectedCategory === category.key;
          return (
            <button key={category.key} type="button"
              onClick={() => setSelectedCategory(selected ? null : category.key)}
              aria-pressed={selected}
              className={`mgr-card p-4 flex flex-col items-center justify-center border-2 motion-safe:transition-colors ${selected ? 'border-primary' : 'border-transparent hover:border-primary'}`}>
              <FolderOpen size={32} className={`${category.iconClass} mb-2`} aria-hidden="true" />
              <span className="font-medium text-primary">{tManagerUi(category.labelKey)}</span>
              <span className="text-xs text-secondary">{tManagerUi('sample_records_count', { count })}</span>
            </button>
          );
        })}
      </div>
      <div className="mgr-card p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="mgr-input-icon-wrap w-full max-w-sm">
            <Search size={16} className="mgr-input-icon" />
            <label htmlFor="manager-documents-search" className="sr-only">{tManagerUi('search_documents')}</label>
            <input
              id="manager-documents-search"
              type="search"
              placeholder={tManagerUi('search_documents')} 
              className="mgr-input mgr-input-with-icon"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        </div>

        {visibleRows.length === 0 ? (
          <ManagerMembersDocumentVaultEmptyState className="p-8 text-center text-secondary" testId="manager-document-vault-empty">{tManagerUi('no_sample_documents_match')}</ManagerMembersDocumentVaultEmptyState>
        ) : (
        <div className="mgr-table-wrapper h-96" aria-label={tManagerUi('sample_document_metadata')}>
          <ManagerMembersDocumentVaultNativeTable label={tManagerUi('sample_document_metadata')} getRowKey={(row) => row.id} rows={visibleRows} columns={colDefs} labels={{ previous: tManagerUi('previous_page'), next: tManagerUi('next_page'), range: (start, end, total) => tManagerUi('pagination_range', { start, end, total }) }} />
        </div>
        )}
      </div>
    </div>
  );
}
