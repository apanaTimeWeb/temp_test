'use client';
// RESPONSIBILITY: AdminSystemBulkImportPageViewSummarySection component owned by admin_system; responsibility folder: admin_system_bulk_import_page_view_sections.

import { useTranslations } from 'next-intl';
import Card from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import CardHeader from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardHeader';
import CardTitle from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardTitle';
import CardDescription from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardDescription';
import CardContent from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardContent';
import CardFooter from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardFooter';
import { Button } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveButton';
import { AdminSystemBadge } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveBadge';
import { Upload, XCircle, RefreshCw } from 'lucide-react';
import { ADMIN_SYSTEM_BULK_IMPORT_STATUS_CONFIG as STATUS_CONFIG } from '@/app/frontend_admin/admin_system/system_bulk_import/config/admin_system_bulk_import.url_config';
import type useBulkImportPage from '@/app/frontend_admin/admin_system/system_bulk_import/hooks/useAdminSystemBulkImportPage';
import { maskSensitiveEmail as maskAdminSystemEmail, maskSensitivePhone as maskAdminSystemPhone } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_utils/AdminApplicationInfrastructureMaskSensitiveContact';
import type { AdminSystemBulkImportPageViewSummarySectionProps } from '@/app/frontend_admin/admin_system/system_bulk_import/types/AdminSystemBulkImportTypes';


/**
 * Renders the preview-stage validation summary for bulk-import rows. Dependencies: the owning Admin System import hook model. Edge cases: error rows must be identified clearly and must not be represented as imported.
 */
export default function AdminSystemBulkImportPageViewSummarySection({ model }: AdminSystemBulkImportPageViewSummarySectionProps) {
  const t = useTranslations('ADMIN_SYSTEM_EXTRA');
  const issueLabel = (issue?: string) => {
    switch (issue) {
      case 'IMPORT_ROW_NAME_REQUIRED': return t('IMPORT_ROW_NAME_REQUIRED');
      case 'IMPORT_ROW_PHONE_REQUIRED': return t('IMPORT_ROW_PHONE_REQUIRED');
      case 'IMPORT_ROW_SHIFT_REQUIRED': return t('IMPORT_ROW_SHIFT_REQUIRED');
      case 'IMPORT_ROW_EMAIL_OPTIONAL': return t('IMPORT_ROW_EMAIL_OPTIONAL');
      case undefined: return '—';
      default: return t('IMPORT_ISSUE_UNKNOWN');
    }
  };
  const { MOCK_PREVIEW, step, fileName, filter, setFilter, errorCount, warningCount, okCount, filteredRows, handleReset } = model;
  return (<> {step === 'preview' && (
        <div className="space-y-5">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-card border border-border text-center">
              <p className="text-2xl font-bold text-text-primary">{MOCK_PREVIEW.length}</p>
              <p className="text-xs text-text-secondary mt-1">{t('TOTAL_ROWS')}</p>
            </div>
            <div className="p-4 rounded-2xl bg-success-bg border border-success-text text-center">
              <p className="text-2xl font-bold text-success-text">{okCount}</p>
              <p className="text-xs text-text-secondary mt-1">{t('READY_TO_IMPORT')}</p>
            </div>
            <div className="p-4 rounded-2xl bg-surface-highlight border border-border text-center">
              <p className="text-2xl font-bold text-text-secondary">{warningCount}</p>
              <p className="text-xs text-text-secondary mt-1">{t('WARNINGS')}</p>
            </div>
            <div data-testid="admin_system-AdminSystemBulkImportPageViewSummarySection-state-001" className="p-4 rounded-2xl bg-danger-bg border border-danger text-center">
              <p data-testid="admin_system-AdminSystemBulkImportPageViewSummarySection-state-002" className="text-2xl font-bold text-danger-text">{errorCount}</p>
              <p className="text-xs text-text-secondary mt-1">{t('ERRORS_MUST_FIX')}</p>
            </div>
          </div>

          {errorCount > 0 && (
            <div data-testid="admin_system-AdminSystemBulkImportPageViewSummarySection-state-003" className="flex items-start gap-3 p-4 rounded-xl bg-danger-bg border border-danger">
              <XCircle size={18} strokeWidth={2} className="text-danger-text shrink-0 mt-0.5" />
              <div>
                <p data-testid="admin_system-AdminSystemBulkImportPageViewSummarySection-state-004" className="text-sm font-semibold text-danger-text">{errorCount} {t('IMPORT_ROWS_HAVE_ERRORS')}</p>
                <p className="text-xs text-text-secondary mt-0.5">{t('FIX_FILE_ISSUES')}</p>
              </div>
            </div>
          )}

          {/* Preview Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('DATA_PREVIEW')} {fileName}</CardTitle>
                  <CardDescription>{t('REVIEW_EACH_ROW')}</CardDescription>
                </div>
                {/* Filter buttons */}
                <div className="flex flex-wrap gap-2" role="group" aria-label={t('FILTER_IMPORT_BY_STATUS')}>
                  {(['all', 'ok', 'warning', 'error'] as const).map(f => (
                    <button type="button" data-testid={`admin_system-bulk-import-filter-${f}`}
                      key={f}
                      aria-pressed={filter === f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium motion-safe:transition-all motion-safe:duration-base ${
                        filter === f
                          ? 'bg-primary text-on-primary'
                          : 'bg-card text-text-secondary hover:text-primary'
                      }`}
                    >
                      {f === 'all' ? `${t('FILTER_ALL')} (${MOCK_PREVIEW.length})` :
                       f === 'ok'  ? `✅ ${t('FILTER_OK')} (${okCount})` :
                       f === 'warning' ? `⚠️ ${t('FILTER_WARNING')} (${warningCount})` :
                       `❌ ${t('FILTER_ERROR')} (${errorCount})`}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 md:hidden" aria-label={t('IMPORT_PREVIEW_ROWS')}>
                {filteredRows.map(row => {
                  const cfg = STATUS_CONFIG[row.status];
                  const Icon = cfg.icon;
                  return (
                    <article key={row.row} className="rounded-lg border border-border bg-card p-4" aria-label={t('IMPORT_PREVIEW_ROW_ARIA', { row: row.row })}>
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-text-primary">{t('ROW_NUMBER')}{row.row}: {row.name || t('NAME_MISSING')}</h3>
                        <AdminSystemBadge variant={cfg.variant}><Icon size={16} strokeWidth={2} /> {t(row.status === 'ok' ? 'IMPORT_STATUS_OK' : row.status === 'warning' ? 'IMPORT_STATUS_WARNING' : 'IMPORT_STATUS_ERROR')}</AdminSystemBadge>
                      </div>
                      <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                        <div><dt className="text-text-secondary">{t('PHONE')}</dt><dd className="break-words text-text-primary">{row.phone ? maskAdminSystemPhone(row.phone) : t('MISSING')}</dd></div>
                        <div><dt className="text-text-secondary">{t('EMAIL')}</dt><dd className="break-words text-text-primary">{row.email ? maskAdminSystemEmail(row.email) : '—'}</dd></div>
                        <div><dt className="text-text-secondary">{t('SHIFT')}</dt><dd className="text-text-primary">{row.shift}</dd></div>
                        <div><dt className="text-text-secondary">{t('SEAT')}</dt><dd className="text-text-primary">{row.seat || t('IMPORT_AUTO')}</dd></div>
                        <div className="sm:col-span-2"><dt className="text-text-secondary">{t('ISSUE')}</dt><dd className="text-text-primary">{issueLabel(row.issue)}</dd></div>
                      </dl>
                    </article>
                  );
                })}
              </div>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="h-12 bg-surface-highlight uppercase text-xs text-text-secondary font-semibold border-b border-border">
                      <th className="p-3">{t('ROW')}</th>
                      <th className="p-3">{t('NAME')}</th>
                      <th className="p-3">{t('PHONE')}</th>
                      <th className="p-3">{t('EMAIL')}</th>
                      <th className="p-3">{t('SHIFT')}</th>
                      <th className="p-3">{t('SEAT')}</th>
                      <th className="p-3">{t('STATUS')}</th>
                      <th className="p-3">{t('ISSUE')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map(row => {
                      const cfg = STATUS_CONFIG[row.status];
                      const Icon = cfg.icon;
                      return (
                        <tr key={row.row} className={`h-12 border-b border-border text-text-primary motion-safe:transition-colors hover:bg-surface-hover even:bg-surface-zebra/30 ${
                          row.status === 'error' ? 'bg-danger-bg/40' :
                          row.status === 'warning' ? 'bg-surface-highlight' : ''
                        }`}>
                          <td className="p-3 font-mono text-xs text-text-secondary">#{row.row}</td>
                          <td className="p-3 font-medium text-text-primary text-xs">{row.name || <span className="text-danger-text text-xs italic">{t('MISSING')}</span>}</td>
                          <td className="p-3 text-text-secondary text-xs">{row.phone ? maskAdminSystemPhone(row.phone) : <span className="text-danger-text text-xs italic">{t('MISSING')}</span>}</td>
                          <td className="p-3 text-text-secondary text-xs">{row.email ? maskAdminSystemEmail(row.email) : <span className="text-text-secondary text-xs">—</span>}</td>
                          <td className="p-3 text-text-primary">{row.shift}</td>
                          <td className="p-3 font-mono text-xs text-text-primary">{row.seat || <span className="text-text-secondary text-xs">{t('IMPORT_AUTO')}</span>}</td>
                          <td className="p-3">
                            <AdminSystemBadge variant={cfg.variant}>
                              <Icon size={18} strokeWidth={2} /> {t(row.status === 'ok' ? 'IMPORT_STATUS_OK' : row.status === 'warning' ? 'IMPORT_STATUS_WARNING' : 'IMPORT_STATUS_ERROR')}
                            </AdminSystemBadge>
                          </td>
                          <td className="p-3 text-xs text-text-secondary">{issueLabel(row.issue)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Button data-testid="admin_system-AdminSystemBulkImportPageViewSummarySection-control-011" id="start-import-btn" variant="primary" disabled title={t('IMPORT_SUBMIT_BLOCKED')}>
                <Upload size={18} strokeWidth={2} /> {t('IMPORT')} {okCount} {t('VALID_ROWS')}
              </Button>
              <Button data-testid="admin_system-AdminSystemBulkImportPageViewSummarySection-control-012" id="reupload-btn" variant="ghost" onClick={handleReset}>
                <RefreshCw size={18} strokeWidth={2} /> {t('REUPLOAD_FILE')}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )} </>);
}


export type { AdminSystemBulkImportPageViewSummarySectionProps };
