'use client';
// DATA FLOW: system_bulk_import route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import type { AdminSystemBulkImportRowStatus, AdminSystemBulkImportStep } from '@/app/frontend_admin/admin_system/system_bulk_import/types/AdminSystemBulkImportTypes';
import { ADMIN_SYSTEM_BULK_IMPORT_PREVIEW_ROWS } from '@/app/frontend_admin/admin_system/system_bulk_import/mocks/scenarios/admin_system_bulk_import.scenarios';
import { ADMIN_SYSTEM_BULK_IMPORT_TEMPLATE_HEADERS } from '@/app/frontend_admin/admin_system/system_bulk_import/config/admin_system_bulk_import.url_config';
import { parseAdminSystemBulkImportCsv } from '@/app/frontend_admin/admin_system/system_bulk_import/utils/AdminSystemBulkImportUtils';
import type { AdminSystemBulkImportPreviewRow } from '@/app/frontend_admin/admin_system/system_bulk_import/types/AdminSystemBulkImportTypes';
export default function useAdminSystemBulkImportPage() {
  const t = useTranslations('ADMIN_SYSTEM_EXTRA');
  const isDemoMode = isFrontendDemoModeEnabled();
  const [step, setStep] = useState<AdminSystemBulkImportStep>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [uploadedPreviewRows, setUploadedPreviewRows] = useState<AdminSystemBulkImportPreviewRow[] | null>(null);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [filter, setFilter] = useAdminApplicationInfrastructureUrlQueryState<'all' | AdminSystemBulkImportRowStatus>('filter', 'all', { validValues: ['all', 'ok', 'error', 'warning'] });
  const [importAdminSystemProgress, setImportAdminSystemProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewRows = uploadedPreviewRows ?? (isDemoMode ? ADMIN_SYSTEM_BULK_IMPORT_PREVIEW_ROWS : []);
  const errorCount   = previewRows.filter(r => r.status === 'error').length;
  const warningCount = previewRows.filter(r => r.status === 'warning').length;
  const okCount      = previewRows.filter(r => r.status === 'ok').length;

  const filteredRows = filter === 'all' ? previewRows : previewRows.filter(r => r.status === filter);

  const handleFileSelect = (name: string) => {
    if (!isDemoMode) {
      toast.error(t('IMPORT_FILE_LIVE_BLOCKED'), { id: 'admin-system-import-live-blocked' });
      return;
    }
    setFileName(name);
    setUploadedPreviewRows(null);
    setStep('preview');
    toast.info(t('IMPORT_DEMO_PREVIEW_NOTICE'), { id: 'admin-system-import-demo-preview-notice' });
  };

  const handleFileUpload = async (file: File) => {
    if (!/\.csv$/i.test(file.name)) {
      toast.error(t('IMPORT_CSV_UNSUPPORTED'), { id: 'admin-system-import-csv-unsupported' });
      return;
    }
    setIsParsingFile(true);
    try {
      const parsed = parseAdminSystemBulkImportCsv(await file.text());
      if (parsed.errorCode) {
        setUploadedPreviewRows(null);
        setStep('upload');
        toast.error(t(parsed.errorCode), { id: 'admin-system-import-csv-parse-error' });
        return;
      }
      setFileName(file.name);
      setUploadedPreviewRows(parsed.rows);
      setFilter('all');
      setStep('preview');
      toast.info(t('IMPORT_LOCAL_PREVIEW_ONLY'), { id: 'admin-system-import-local-preview-only' });
    } catch {
      setUploadedPreviewRows(null);
      setStep('upload');
      toast.error(t('IMPORT_CSV_PARSE_FAILED'), { id: 'admin-system-import-csv-parse-failed' });
    } finally {
      setIsParsingFile(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) void handleFileUpload(file);
  };

  const handleImport = () => {
    toast.info(t('IMPORT_SUBMIT_BLOCKED'), { id: 'admin-system-import-submit-blocked' });
  };

  const handleReset = () => {
    setStep('upload');
    setFileName('');
    setUploadedPreviewRows(null);
    setImportAdminSystemProgress(0);
    setFilter('all');
  };

  const downloadTemplate = () => {
    const csv = [ADMIN_SYSTEM_BULK_IMPORT_TEMPLATE_HEADERS.join(','), 'Example Student,9000000000,example@example.com,Morning,S-01,Monthly,0,2026-01-01'].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'bulk_import_template.csv';
    anchor.hidden = true;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return {
    MOCK_PREVIEW: previewRows,
    isDemoMode,
    step,
    setStep,
    isDragging,
    setIsDragging,
    fileName,
    setFileName,
    isParsingFile,
    handleFileUpload,
    filter,
    setFilter,
    importAdminSystemProgress,
    setImportAdminSystemProgress,
    fileInputRef,
    errorCount,
    warningCount,
    okCount,
    filteredRows,
    handleFileSelect,
    handleDrop,
    handleImport,
    handleReset,
    downloadTemplate,
  } as const;
}
