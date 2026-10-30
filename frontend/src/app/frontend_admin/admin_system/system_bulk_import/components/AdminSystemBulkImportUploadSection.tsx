// RESPONSIBILITY: AdminSystemBulkImportUploadSection component owned by admin_system; responsibility folder: admin_system_bulk_import_page_view_sections.
import { useTranslations } from 'next-intl';
import Card from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import CardHeader from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardHeader';
import CardTitle from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardTitle';
import CardDescription from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardDescription';
import CardContent from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardContent';
import { AdminSystemBadge } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveBadge';
import { Upload } from 'lucide-react';
import type useBulkImportPage from '@/app/frontend_admin/admin_system/system_bulk_import/hooks/useAdminSystemBulkImportPage';
import { ADMIN_SYSTEM_BULK_IMPORT_INSTRUCTION_ROWS } from '@/app/frontend_admin/admin_system/system_bulk_import/config/admin_system_bulk_import.url_config';
import type { AdminSystemBulkImportUploadSectionProps } from '@/app/frontend_admin/admin_system/system_bulk_import/types/AdminSystemBulkImportTypes';


export default function AdminSystemBulkImportUploadSection({ model }: AdminSystemBulkImportUploadSectionProps) {
  const t = useTranslations('ADMIN_SYSTEM_EXTRA');
  const { isDragging, setIsDragging, fileInputRef, handleFileUpload, handleDrop, step, isParsingFile, fileName, isDemoMode } = model;
  return (
    <>
      {step === 'upload' && (
              <div className="space-y-5">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('UPLOAD_FILE')}</CardTitle>
                    <CardDescription>{t('ACCEPTED_FORMATS')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div role="button" tabIndex={!isDemoMode || isParsingFile ? -1 : 0} aria-disabled={!isDemoMode || isParsingFile} aria-busy={isParsingFile} data-testid="admin_system-AdminSystemBulkImportPageView-control-002"
                      id="bulk-drop-zone"
                      aria-label={t('CHOOSE_IMPORT_FILE_ARIA')}
                      aria-describedby="bulk-drop-zone-description"
                      onDragOver={e => { if (!isDemoMode) return; e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(event) => { if (!isDemoMode) { event.preventDefault(); return; } handleDrop(event); }}
                      onClick={() => { if (isDemoMode && !isParsingFile) fileInputRef.current?.click(); }}
                      onKeyDown={event => {
                        if (isDemoMode && !isParsingFile && (event.key === 'Enter' || event.key === ' ')) {
                          event.preventDefault();
                          fileInputRef.current?.click();
                        }
                      }}
                      className={`min-h-11 w-full text-left text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page flex flex-col items-center justify-center gap-4 p-6 sm:p-16 rounded-2xl border-2 border-dashed ${!isDemoMode ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} motion-safe:transition-all motion-safe:duration-base ${
                        isDragging
                          ? 'border-primary bg-primary-subtle scale-100'
                          : 'border-border hover:border-border hover:bg-surface-hover'
                      }`}
                    >
                      <div className={`h-20 w-20 rounded-2xl flex items-center justify-center text-4xl motion-safe:transition-all motion-safe:duration-base ${
                        isDragging ? 'bg-primary-subtle' : 'bg-card'
                      }`}>
                        {isDragging ? '📂' : '📁'}
                      </div>
                      <div className="text-center">
                        <p id="bulk-drop-zone-description" className="text-base font-semibold text-text-primary">
                          {isDragging ? t('DROP_FILE_HERE') : t('DRAG_DROP_FILE_HERE')}
                        </p>
                        <p className="text-sm text-text-secondary mt-1 text-text-primary font-medium">{t('OR')} <span className="text-primary font-medium">{t('BROWSE_TO_UPLOAD')}</span></p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-text-secondary">
                        <span className="px-2 py-1 rounded-lg bg-card">.csv</span>
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      disabled={!isDemoMode}
                      accept=".csv,text/csv"
                      className="hidden"
                      onChange={e => { const file = e.target.files?.[0]; if (file) void handleFileUpload(file); e.currentTarget.value = ''; }}
                    />
                    {isParsingFile && <p role="status" aria-live="polite" className="mt-3 text-sm text-text-secondary">{t('IMPORT_PARSING_CSV')}</p>}
                    {!isParsingFile && fileName && <p role="status" className="mt-3 text-sm text-text-secondary">{t('IMPORT_SELECTED_FILE', { fileName })}</p>}
                  </CardContent>
                </Card>

                {/* Instructions */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('FILE_FORMAT_INSTRUCTIONS')}</CardTitle>
                    <CardDescription>{t('FILE_STRUCTURE_DESCRIPTION')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="h-12 bg-surface-highlight uppercase text-xs text-text-secondary font-semibold border-b border-border">
                            <th className="p-3">{t('COLUMN')}</th>
                            <th className="p-3">{t('REQUIRED')}</th>
                            <th className="p-3">{t('EXAMPLE')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ADMIN_SYSTEM_BULK_IMPORT_INSTRUCTION_ROWS.map((row) => (
                            <tr key={row.labelKey} className="h-12 border-b border-border text-text-primary motion-safe:transition-colors hover:bg-surface-hover even:bg-surface-zebra/30">
                              <td className="p-3 font-medium text-text-primary">{t(row.labelKey)}</td>
                              <td className="p-3">
                                {row.required
                                  ? <AdminSystemBadge variant="danger">{t('REQUIRED')}</AdminSystemBadge>
                                  : <AdminSystemBadge variant="outline">{t('OPTIONAL_PLAIN')}</AdminSystemBadge>}
                              </td>
                              <td className="p-3 text-text-secondary text-xs">{'exampleKey' in row ? t(row.exampleKey) : row.example}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
    </>
  );
}
