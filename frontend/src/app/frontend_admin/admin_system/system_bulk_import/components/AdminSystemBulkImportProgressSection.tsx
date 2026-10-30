// RESPONSIBILITY: AdminSystemBulkImportProgressSection component owned by admin_system; responsibility folder: admin_system_bulk_import_page_view_sections.
import { useTranslations } from 'next-intl';
import Card from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import CardContent from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardContent';
import type useBulkImportPage from '@/app/frontend_admin/admin_system/system_bulk_import/hooks/useAdminSystemBulkImportPage';
import type { AdminSystemBulkImportProgressSectionProps } from '@/app/frontend_admin/admin_system/system_bulk_import/types/AdminSystemBulkImportTypes';


export default function AdminSystemBulkImportProgressSection({ model }: AdminSystemBulkImportProgressSectionProps) {
  const t = useTranslations('ADMIN_SYSTEM_EXTRA');
  const { step, importAdminSystemProgress, okCount } = model;
  return (
    <>
      {step === 'importing' && (
              <Card>
                <CardContent className="py-16 flex flex-col items-center gap-6 text-center">
                  <div className="text-5xl motion-safe:animate-bounce">{t('HOURGLASS')}</div>
                  <div>
                    <h2 className="text-xl font-bold text-text-primary mb-1">{t('IMPORTING_STUDENTS')}</h2>
                    <p className="text-sm text-text-secondary">{t('IMPORT_DO_NOT_CLOSE')}</p>
                  </div>
                  <div className="w-full max-w-sm space-y-2">
                    <div className="flex justify-between text-xs text-text-secondary">
                      <span>{t('PROGRESS')}</span>
                      <span className="text-primary font-semibold">{importAdminSystemProgress}{t('PERCENT')}</span>
                    </div>
                    <div className="h-3 rounded-full bg-card overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-primary motion-safe:transition-all motion-safe:duration-slow admin-dynamic-width-${Math.min(100, Math.max(0, Math.round(importAdminSystemProgress)))}`}
                      />
                    </div>
                    <p className="text-xs text-text-secondary">
                      {Math.round((importAdminSystemProgress / 100) * okCount)} {t('OF')} {okCount} {t('ROWS_IMPORTED')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
    </>
  );
}
