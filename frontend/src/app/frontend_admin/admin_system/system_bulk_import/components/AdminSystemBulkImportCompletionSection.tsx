// RESPONSIBILITY: AdminSystemBulkImportCompletionSection component owned by admin_system; responsibility folder: admin_system_bulk_import_page_view_sections.
'use client';

import { useTranslations } from 'next-intl';
import Card from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import CardContent from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardContent';
import { Button } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveButton';
import { Upload } from 'lucide-react';
import type useBulkImportPage from '@/app/frontend_admin/admin_system/system_bulk_import/hooks/useAdminSystemBulkImportPage';
import type { AdminSystemBulkImportCompletionSectionProps } from '@/app/frontend_admin/admin_system/system_bulk_import/types/AdminSystemBulkImportTypes';


export default function AdminSystemBulkImportCompletionSection({ model }: AdminSystemBulkImportCompletionSectionProps) {
  const t = useTranslations('ADMIN_SYSTEM_EXTRA');
  const { step, okCount, errorCount, handleReset } = model;
  return (
    <>
      {step === 'done' && (
              <Card>
                <CardContent className="py-16 flex flex-col items-center gap-6 text-center">
                  <div className="h-24 w-24 rounded-full bg-success-bg flex items-center justify-center text-5xl">
                    🎉
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-2">{t('DEMO_IMPORT_COMPLETE')}</h2>
                    <p className="text-text-secondary">{t('DEMO_IMPORT_NO_SAVE')}</p>
                    <p className="text-sm text-text-secondary mt-2">{t('FIXTURE_ROWS_VALID')} <span className="font-semibold text-success-text">{okCount}</span>.</p>
                    {errorCount > 0 && (
                      <p className="text-sm text-text-secondary mt-2">
                        <span data-testid="admin_system-AdminSystemBulkImportPageView-state-003" className="text-danger-text font-semibold">{errorCount} {t('FIXTURE_ROWS')}</span> {t('FIXTURE_ROWS_VALIDATION_ISSUES')}
                      </p>
                    )}
                  </div>
                  <p id="admin_system-import-completion-navigation-note" className="text-xs text-text-secondary">{t('IMPORT_NAVIGATION_UNAVAILABLE')}</p>
              <div className="flex gap-3">
                    <Button id="view-students-btn" variant="primary" disabled title={t('STUDENT_LIST_ROUTE_UNAVAILABLE')}>
                      {t('VIEW_ALL_STUDENTS')}
                    </Button>
                    <Button data-testid="admin_system-AdminSystemBulkImportPageView-control-004" id="import-again-btn" variant="ghost" onClick={handleReset}>
                      <Upload size={18} strokeWidth={2} /> {t('IMPORT_ANOTHER_FILE')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
    </>
  );
}
