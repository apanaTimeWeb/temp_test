// RESPONSIBILITY: AdminSystemDataExportPage component owned by admin_system; responsibility folder: admin_system_components_views.
'use client';

import { useMemo, useState } from 'react';
import { ChevronRight, Download, FileSpreadsheet } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Card from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import CardHeader from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardHeader';
import CardTitle from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardTitle';
import CardDescription from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardDescription';
import CardContent from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardContent';
import CardFooter from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardFooter';
import { Button } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveButton';
import { AdminSystemBadge } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveBadge';
import { ADMIN_SYSTEM_DATA_EXPORT_DEFAULT_DATE_FROM, ADMIN_SYSTEM_DATA_EXPORT_DEFAULT_DATE_TO, ADMIN_SYSTEM_DATA_EXPORT_MODULES, ADMIN_SYSTEM_QUICK_EXPORTS } from '@/app/frontend_admin/admin_system/system_data_export/config/admin_system_data_export_constants';
import type { AdminSystemDataExportModuleId, AdminSystemDataExportPreset } from '@/app/frontend_admin/admin_system/system_data_export/types/AdminSystemDataExportTypes';
import { buildAdminSystemDataExportCsv, downloadAdminSystemDataExportCsv } from '@/app/frontend_admin/admin_system/system_data_export/utils/AdminSystemDataExportUtils';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';

/** Provides an explicitly demo-only CSV preview. Live export remains unavailable until its job/API contract exists. */
export function AdminSystemDataExportPage() {
  const t = useTranslations('ADMIN_SYSTEM_DATA_EXPORT');
  const locale = useLocale();
  const demoMode = isFrontendDemoModeEnabled();
  const [selected, setSelected] = useState<Set<AdminSystemDataExportModuleId>>(new Set());
  const [dateFrom, setDateFrom] = useState(ADMIN_SYSTEM_DATA_EXPORT_DEFAULT_DATE_FROM);
  const [dateTo, setDateTo] = useState(ADMIN_SYSTEM_DATA_EXPORT_DEFAULT_DATE_TO);
  const hasValidDateRange = Boolean(dateFrom && dateTo && dateFrom <= dateTo);
  const estimatedTotal = useMemo(
    () => ADMIN_SYSTEM_DATA_EXPORT_MODULES.filter((module) => selected.has(module.id)).reduce((sum, module) => sum + module.estimatedRows, 0),
    [selected],
  );
  const numberFormat = new Intl.NumberFormat(locale.toLowerCase().startsWith('hi') ? 'hi-IN' : 'en-IN');

  const toggleModule = (id: AdminSystemDataExportModuleId) => {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleExport = (moduleIds: readonly AdminSystemDataExportModuleId[], filePrefix: string, preset: AdminSystemDataExportPreset = 'custom') => {
    if (!demoMode || !moduleIds.length || !dateFrom || !dateTo || dateFrom > dateTo) return;
    const csv = buildAdminSystemDataExportCsv(moduleIds, dateFrom, dateTo, preset);
    downloadAdminSystemDataExportCsv(`${filePrefix}-${dateFrom}-to-${dateTo}.csv`, csv);
  };

  return (
    <div className="space-y-8">
      <header>
        <div className="mb-1 flex items-center gap-2 text-xs font-medium tracking-wide text-text-secondary">
          <span>{t('BREADCRUMB_SYSTEM')}</span><ChevronRight size={18} strokeWidth={2} /><span>{t('BREADCRUMB_EXPORT')}</span>
        </div>
        <h1 className="flex items-center gap-3 text-page-title font-bold text-text-primary"><Download size={18} strokeWidth={2} className="text-primary" />{t('TITLE')}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t('SUBTITLE')}</p>
        {!demoMode && <p role="status" className="mt-3 rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('LIVE_UNAVAILABLE')}</p>}
      </header>

      <section aria-labelledby="admin-system-quick-exports-title">
        <h2 id="admin-system-quick-exports-title" className="mb-3 text-base font-semibold text-text-primary">{t('QUICK_EXPORTS_TITLE')}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ADMIN_SYSTEM_QUICK_EXPORTS.map((quickExport) => {
            const Icon = quickExport.icon;
            const label = t(quickExport.labelKey);
            return (
              <Card key={quickExport.id} className="hover:border-border motion-safe:transition-colors motion-safe:duration-base">
                <CardContent className="flex items-start gap-3 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary"><Icon size={18} strokeWidth={2} /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-text-primary">{label}</p>
                    <p className="mt-0.5 text-xs leading-snug text-text-secondary">{t(quickExport.descriptionKey)}</p>
                    <button type="button" data-testid={`admin_system-data-export-${quickExport.id}`} aria-label={t('EXPORT_QUICK_ARIA', { label })} disabled={!demoMode || !hasValidDateRange} onClick={() => handleExport(quickExport.moduleIds, quickExport.id, quickExport.preset)} className="mt-2 min-h-11 text-xs font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-text-disabled">{t('EXPORT_CSV')}</button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div><CardTitle className="flex items-center gap-2"><FileSpreadsheet size={18} strokeWidth={2} className="text-primary" />{t('CUSTOM_BUILDER_TITLE')}</CardTitle><CardDescription>{t('CUSTOM_BUILDER_DESCRIPTION')}</CardDescription></div>
            <div className="flex gap-2"><button type="button" data-testid="admin_system-data-export-select-all" onClick={() => setSelected(new Set(ADMIN_SYSTEM_DATA_EXPORT_MODULES.map((module) => module.id)))} className="min-h-11 text-xs font-medium text-primary hover:underline">{t('SELECT_ALL')}</button><span className="self-center text-xs text-text-secondary">·</span><button type="button" data-testid="admin_system-data-export-clear-all" onClick={() => setSelected(new Set())} className="min-h-11 text-xs text-text-secondary hover:text-primary">{t('CLEAR_ALL')}</button></div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {ADMIN_SYSTEM_DATA_EXPORT_MODULES.map((module) => {
              const isSelected = selected.has(module.id);
              return (
                <button type="button" data-testid={`admin_system-data-export-module-${module.id}`} key={module.id} onClick={() => toggleModule(module.id)} aria-pressed={isSelected} className={`flex min-h-11 items-start gap-3 rounded-xl border p-3.5 text-left motion-safe:transition-all motion-safe:duration-base ${isSelected ? 'border-primary bg-primary-subtle' : 'border-border hover:border-primary hover:bg-surface-hover'}`}>
                  <span className="text-base" aria-hidden="true">{module.icon}</span>
                  <span className="min-w-0 flex-1"><span className="flex items-center gap-2"><span className="text-sm font-semibold text-primary">{t(module.labelKey)}</span><span className="ml-auto text-xs text-text-secondary">~{numberFormat.format(module.estimatedRows)} {t('ESTIMATED_DEMO_ROWS')}</span></span><span className="mt-0.5 block text-xs leading-snug text-text-secondary">{t(module.descriptionKey)}</span></span>
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-1 gap-4 rounded-xl border border-border bg-card p-4 md:grid-cols-2">
            <div className="space-y-1.5"><label htmlFor="export-date-from" className="text-xs font-medium uppercase tracking-wide text-text-secondary">{t('FROM_DATE')}</label><input id="export-date-from" type="date" required aria-invalid={!hasValidDateRange} aria-describedby={!hasValidDateRange ? "admin-system-export-date-range-error" : undefined} value={dateFrom} max={dateTo || undefined} onChange={(event) => setDateFrom(event.target.value)} className="min-h-11 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none" /></div>
            <div className="space-y-1.5"><label htmlFor="export-date-to" className="text-xs font-medium uppercase tracking-wide text-text-secondary">{t('TO_DATE')}</label><input id="export-date-to" type="date" required aria-invalid={!hasValidDateRange} aria-describedby={!hasValidDateRange ? "admin-system-export-date-range-error" : undefined} value={dateTo} min={dateFrom || undefined} onChange={(event) => setDateTo(event.target.value)} className="min-h-11 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none" /></div>
          </div>
          {!hasValidDateRange && <p id="admin-system-export-date-range-error" role="alert" className="text-sm text-danger-text">{t('DATE_RANGE_INVALID')}</p>}
        </CardContent>
        <CardFooter>
          <div className="flex w-full flex-wrap items-center gap-4"><div className="min-w-0 flex-1">{selected.size > 0 && <p className="text-sm text-text-secondary"><span className="font-semibold text-primary">{numberFormat.format(selected.size)} {selected.size === 1 ? t('MODULE_SINGULAR') : t('MODULE_PLURAL')} {t('SELECTED')}</span> · ~{numberFormat.format(estimatedTotal)} {t('ESTIMATED_DEMO_ROWS')} · {t('FORMAT_LABEL')} <AdminSystemBadge variant="outline">CSV</AdminSystemBadge></p>}</div><Button data-testid="admin_system-data-export-submit" id="export-data-btn" variant="primary" disabled={!demoMode || selected.size === 0 || !hasValidDateRange} onClick={() => handleExport([...selected], 'admin-data-export')}><Download size={18} strokeWidth={2} /> {t('EXPORT_CSV')}</Button></div>
        </CardFooter>
      </Card>
    </div>
  );
}
