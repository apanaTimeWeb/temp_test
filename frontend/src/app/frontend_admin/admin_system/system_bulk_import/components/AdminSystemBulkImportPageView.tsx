// RESPONSIBILITY: AdminSystemBulkImportPageView component owned by admin_system; responsibility folder: admin_system_components_views.
'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveButton';
import { FileSpreadsheet, ChevronRight, Download } from 'lucide-react';
import { ADMIN_SYSTEM_BULK_IMPORT_STEPS } from '@/app/frontend_admin/admin_system/system_bulk_import/config/admin_system_bulk_import.url_config';
import type useBulkImportPage from '@/app/frontend_admin/admin_system/system_bulk_import/hooks/useAdminSystemBulkImportPage';
import AdminSystemBulkImportPageViewSummarySection from '@/app/frontend_admin/admin_system/system_bulk_import/components/AdminSystemBulkImportPageViewSummarySection';

import AdminSystemBulkImportUploadSection from '@/app/frontend_admin/admin_system/system_bulk_import/components/AdminSystemBulkImportUploadSection';
import AdminSystemBulkImportProgressSection from '@/app/frontend_admin/admin_system/system_bulk_import/components/AdminSystemBulkImportProgressSection';
import AdminSystemBulkImportCompletionSection from '@/app/frontend_admin/admin_system/system_bulk_import/components/AdminSystemBulkImportCompletionSection';
import type { AdminSystemBulkImportPageViewProps } from '@/app/frontend_admin/admin_system/system_bulk_import/types/AdminSystemBulkImportTypes';


export default function AdminSystemBulkImportPageView({ model }: AdminSystemBulkImportPageViewProps) {
  const t = useTranslations('ADMIN_SYSTEM_EXTRA');
  const { isDemoMode, step, downloadTemplate } = model;
  return (
    <div>
      {!isDemoMode && <p role="status" className="mb-4 rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('IMPORT_LIVE_UNAVAILABLE')}</p>}
      {isDemoMode && <p role="status" className="mb-4 rounded-md border border-info-bg bg-info-bg p-3 text-info-text">{t('IMPORT_DEMO_NOTICE')}</p>}
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-text-secondary text-xs font-medium tracking-wide mb-1">
          <span>{t('BREADCRUMB_SYSTEM')}</span><ChevronRight size={18} strokeWidth={2} /><span>{t('BULK_IMPORT')}</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-page-title font-bold text-text-primary flex items-center gap-3">
              <FileSpreadsheet size={18} strokeWidth={2} className="text-primary" />
              {t('BULK_STUDENT_IMPORT')}
            </h1>
            <p className="text-text-secondary mt-1 text-sm">
              {t('BULK_IMPORT_DESCRIPTION')}
            </p>
          </div>
          <Button data-testid="admin_system-AdminSystemBulkImportPageView-control-001" id="download-template-btn" variant="ghost" onClick={downloadTemplate}>
            <Download size={18} strokeWidth={2} /> {t('DOWNLOAD_TEMPLATE')}
          </Button>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0 mb-8">
        {ADMIN_SYSTEM_BULK_IMPORT_STEPS.map((s, i, arr) => {
          const stepOrder = ADMIN_SYSTEM_BULK_IMPORT_STEPS.map(({ id }) => id);
          const currentIdx = stepOrder.indexOf(step);
          const thisIdx    = stepOrder.indexOf(s.id);
          const isActive   = s.id === step;
          const isDone     = currentIdx > thisIdx;

          return (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold border-2 motion-safe:transition-all motion-safe:duration-base ${
                  isDone    ? 'bg-primary border-primary text-on-primary' :
                  isActive  ? 'border-primary text-primary bg-primary-subtle' :
                              'border-border text-text-secondary'
                }`}>
                  {isDone ? '✓' : s.number}
                </div>
                <span className={`text-xs font-medium whitespace-nowrap ${isActive ? 'text-primary' : 'text-text-secondary'}`}>{t(s.labelKey)}</span>
              </div>
              {i < arr.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 motion-safe:transition-colors motion-safe:duration-base ${isDone ? 'bg-primary' : 'bg-border'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── STEP 1: UPLOAD ── */}
      <AdminSystemBulkImportUploadSection model={model} />

      {/* ── STEP 2: PREVIEW ── */}
      <AdminSystemBulkImportPageViewSummarySection model={model} />

      {/* ── STEP 3: IMPORTING ── */}
      <AdminSystemBulkImportProgressSection model={model} />

      {/* ── STEP 4: DONE ── */}
      <AdminSystemBulkImportCompletionSection model={model} />
    </div>
  );
}


export type { AdminSystemBulkImportPageViewProps };
