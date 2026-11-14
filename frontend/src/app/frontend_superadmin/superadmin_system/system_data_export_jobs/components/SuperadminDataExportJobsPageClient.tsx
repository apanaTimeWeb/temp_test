'use client';
/** Responsibility: Superadmin System Data Export Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminDataExportJobsPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */

import { useTranslations } from 'next-intl';
import { useSuperadminSystemDataExportJobsState } from '@/app/frontend_superadmin/superadmin_system/system_data_export_jobs/hooks/useSuperadminSystemDataExportJobsState';
import { useEffect } from 'react';
import { SuperadminDataExportJobsCard as Card } from '@/app/frontend_superadmin/superadmin_system/system_data_export_jobs/components/SuperadminDataExportJobsCard';
import { SuperadminDataExportJobsCardHeader as CardHeader } from '@/app/frontend_superadmin/superadmin_system/system_data_export_jobs/components/SuperadminDataExportJobsCardHeader';
import { SuperadminDataExportJobsCardTitle as CardTitle } from '@/app/frontend_superadmin/superadmin_system/system_data_export_jobs/components/SuperadminDataExportJobsCardTitle';
import { SuperadminDataExportJobsCardDescription as CardDescription } from '@/app/frontend_superadmin/superadmin_system/system_data_export_jobs/components/SuperadminDataExportJobsCardDescription';
import { SuperadminDataExportJobsCardContent as CardContent } from '@/app/frontend_superadmin/superadmin_system/system_data_export_jobs/components/SuperadminDataExportJobsCardContent';
import { SuperadminDataExportJobsCardFooter as CardFooter } from '@/app/frontend_superadmin/superadmin_system/system_data_export_jobs/components/SuperadminDataExportJobsCardFooter';
import { SuperadminDataExportJobsButton as Button } from '@/app/frontend_superadmin/superadmin_system/system_data_export_jobs/components/SuperadminDataExportJobsButton';
import { SuperadminDataExportJobsBadge as Badge } from '@/app/frontend_superadmin/superadmin_system/system_data_export_jobs/components/SuperadminDataExportJobsBadge';
import { Download, FileSpreadsheet, ChevronRight, CheckCircle } from 'lucide-react';
import { SuperadminSystemCreateExportManifestCsv, SuperadminSystemDownloadExportManifestCsv, type SuperadminSystemExportManifestEntry } from '@/app/frontend_superadmin/superadmin_system/system_data_export_jobs/utils/SuperadminDataExportJobsExportUtilities';
import { SUPERADMIN_SYSTEM_DATA_EXPORT_PAGE_CLIENT_EXPORT_MODULES, SUPERADMIN_SYSTEM_DATA_EXPORT_QUICK_EXPORTS } from '@/app/frontend_superadmin/superadmin_system/system_data_export_jobs/constants/SuperadminDataExportJobsStaticConstants';




/**
 * Renders the `superadmin_system` view owned by `SuperadminDataExportJobsPageClient`.
 * Owns local UI state for `selected`, `dateFrom`, `dateTo`, `operationMessage`.
 */
export default function SuperadminDataExportJobsPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SYSTEM');
  const { selected, setSelected, format, dateFrom, setDateFrom, dateTo, setDateTo, operationMessage, setOperationMessage } = useSuperadminSystemDataExportJobsState(tCopy('COPY.EXPORTS_DISABLED_UNTIL_HOST_CONTRACT'));

  // Effect contract: initialize date-only export filters after hydration using the current UTC month and day; [] is the deliberate mount-only boundary.
  useEffect(() => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString().slice(0, 10);
    setDateFrom((current) => current || monthStart);
    setDateTo((current) => current || today);
  }, []);

  const toggleModule = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(SUPERADMIN_SYSTEM_DATA_EXPORT_PAGE_CLIENT_EXPORT_MODULES.map((m) => m.id)));
  const clearAll  = () => setSelected(new Set());

  const estimatedTotal = SUPERADMIN_SYSTEM_DATA_EXPORT_PAGE_CLIENT_EXPORT_MODULES.filter(m => selected.has(m.id)).reduce((sum, m) => sum + m.estimatedRows, 0);

  const handleExport = (id?: string) => {
    const quickExport = id ? SUPERADMIN_SYSTEM_DATA_EXPORT_QUICK_EXPORTS.find((item) => item.id === id) : undefined;
    const selectedModules = id
      ? SUPERADMIN_SYSTEM_DATA_EXPORT_PAGE_CLIENT_EXPORT_MODULES.filter((module) => module.id === id)
      : SUPERADMIN_SYSTEM_DATA_EXPORT_PAGE_CLIENT_EXPORT_MODULES.filter((module) => selected.has(module.id));
    const entries: SuperadminSystemExportManifestEntry[] = selectedModules.map((module) => ({
      id: module.id,
      label: tCopy(module.labelKey),
      estimatedRows: module.estimatedRows,
      exportKind: 'module' as const,
    }));
    if (quickExport) entries.push({
      id: quickExport.id,
      label: tCopy(quickExport.labelKey),
      estimatedRows: null,
      exportKind: 'quick_export' as const,
    });

    if (!dateFrom || !dateTo) {
      setOperationMessage(tCopy('COPY.EXPORT_DATE_RANGE_NOT_READY'));
      return;
    }
    if (dateFrom > dateTo) {
      setOperationMessage(tCopy("COPY.EXPORT_MANIFEST_NOT_GENERATED_FROM_DATE_MUST_BE_ON_OR_BEFORE_TO_DATE"));
      return;
    }
    if (entries.length === 0) {
      setOperationMessage(tCopy("COPY.SELECT_ONE_OR_MORE_MODULES_FIRST_NO_MANIFEST_WAS_GENERATED"));
      return;
    }
    try {
      const csv = SuperadminSystemCreateExportManifestCsv({
        entries,
        dateFrom,
        dateTo,
        requestedFormat: format,
        generatedAt: new Date().toISOString(),
      });
      const safeDate = new Date().toISOString().slice(0, 10);
      SuperadminSystemDownloadExportManifestCsv(csv, `superadmin_export_manifest_${safeDate}.csv`);
      setOperationMessage(tCopy("COPY.DOWNLOADED_A_CSV_CONFIGURATION_MANIFEST_FOR_COUNT_SELECTION_S_TH_A095AC4319", { count: entries.length }));
    } catch (error) {
      setOperationMessage(tCopy("COPY.MANIFEST_DOWNLOAD_FAILED_PLEASE_CORRECT_THE_SELECTION_AND_RETRY"));
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-secondary text-xs font-medium tracking-wide mb-1">
          <span>{tCopy("COPY.SYSTEM")}</span><ChevronRight size={12} /><span>{tCopy("COPY.DATA_EXPORT")}</span>
        </div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <Download size={28} className="text-primary" />
          {tCopy("COPY.DATA_EXPORT")}</h1>
        <p className="text-secondary mt-1 text-sm">
          {tCopy("COPY.SAMPLE_EXPORT_OPTIONS_ONLY_REAL_EXPORTS_REMAIN_UNAVAILABLE_UNTIL_A_E38CBEBE")}</p>
        <p className="mt-2 text-sm text-secondary" role="status" aria-live="polite">{operationMessage}</p>
      </div>

      {/* Quick Exports */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-primary mb-3">{tCopy("COPY.QUICK_EXPORTS")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SUPERADMIN_SYSTEM_DATA_EXPORT_QUICK_EXPORTS.map((qe) => (
            <Card key={qe.id} className="hover:border-focus motion-safe:transition-colors motion-reduce:transition-none group">
              <CardContent className="flex items-start gap-3 py-4">
                <div className="h-10 w-10 rounded-xl bg-primary-subtle text-primary flex items-center justify-center shrink-0 group-hover:bg-primary-subtle motion-safe:transition-colors motion-reduce:transition-none">
                  {qe.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary">{tCopy(qe.labelKey)}</p>
                  <p className="text-xs text-secondary mt-0.5 leading-snug">{tCopy(qe.descriptionKey)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{tCopy(qe.formatKey)}</Badge>
                    <button type="button"
                      id={`quick-export-${qe.id}`}
                      onClick={() => handleExport(qe.id)}
                      title={tCopy("COPY.DOWNLOADS_A_CONFIGURATION_MANIFEST_ONLY_NO_BUSINESS_RECORDS_ARE_EXPORTED")} className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                     data-testid={`superadmin-system-system-data-export-downloads-a-configuration-manifest-only-no-business-records-are-exported-1-${String(qe.id)}`}>
                      {tCopy("COPY.DOWNLOAD_MANIFEST")}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Export Builder */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet size={18} className="text-primary" /> {tCopy("COPY.CUSTOM_EXPORT_BUILDER")}</CardTitle>
              <CardDescription>{tCopy("COPY.SELECT_MODULES_AND_FILTERS_TO_DOWNLOAD_A_CONFIGURATION_MANIFEST_TH_A4FC7CCF")}</CardDescription>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={selectAll} className="text-xs text-primary font-medium hover:underline" data-testid="superadmin-system-system-data-export-select-all-2">{tCopy("COPY.SELECT_ALL")}</button>
              <span className="text-secondary text-xs">·</span>
              <button type="button" onClick={clearAll} className="text-xs text-secondary hover:text-primary" data-testid="superadmin-system-system-data-export-clear-3">{tCopy("COPY.CLEAR")}</button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Module selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SUPERADMIN_SYSTEM_DATA_EXPORT_PAGE_CLIENT_EXPORT_MODULES.map((mod) => {
              const isSelected = selected.has(mod.id);
              return (
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  aria-label={`${isSelected ? tCopy("COPY.DESELECT") : tCopy("COPY.SELECT")} ${tCopy(mod.labelKey)}`}
                  key={mod.id}
                  id={`export-module-${mod.id}`}
                  onClick={() => toggleModule(mod.id)}
                  className={`w-full text-left flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary motion-safe:transition-all motion-reduce:transition-none ${
                    isSelected
                      ? 'border-focus bg-primary-subtle'
                      : 'border-border hover:border-focus hover:bg-card'
                  }`}
                 data-testid={`superadmin-system-system-data-export-deselect-4-${String(mod.id)}`}>
                  <div className={`h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 motion-safe:transition-all motion-reduce:transition-none ${
                    isSelected ? 'bg-primary border-focus' : 'border-border'
                  }`}>
                    {isSelected && <CheckCircle size={12} className="text-on-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{mod.icon}</span>
                      <span className="text-sm font-semibold text-primary">{tCopy(mod.labelKey)}</span>
                      <span className="text-xs text-secondary ml-auto">~{mod.estimatedRows.toLocaleString()} {tCopy("COPY.ILLUSTRATIVE_ROWS")}</span>
                    </div>
                    <p className="text-xs text-secondary mt-0.5 leading-snug">{tCopy(mod.descriptionKey)}</p>
                    <div className="flex gap-1 mt-1.5">
                      {mod.formats.map((f) => <Badge key={f} variant="outline">{tCopy('COPY.MANIFEST_CSV')}</Badge>)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Filters row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-card border border-border">
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-secondary uppercase tracking-wide">{tCopy("COPY.AVAILABLE_OUTPUT")}</p>
              <div className="rounded-lg border border-border bg-floating px-3 py-2 text-sm font-semibold text-primary" aria-label={tCopy("COPY.AVAILABLE_OUTPUT_FORMAT_CSV_CONFIGURATION_MANIFEST")}>
                {tCopy("COPY.CSV_CONFIGURATION_MANIFEST")}</div>
              <p className="text-xs text-secondary">{tCopy("COPY.XLSX_ZIP_AND_BUSINESS_DATA_EXPORTS_ARE_UNAVAILABLE_BECAUSE_NO_APPR_7C5F113A")}</p>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="export-date-from" className="text-xs font-medium text-secondary uppercase tracking-wide">{tCopy("COPY.FROM_DATE")}</label>
              <input
                id="export-date-from"
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-floating border border-border text-sm text-primary focus:outline-none focus:border-focus"
               data-testid="superadmin-system-system-data-export-export-date-from-5"/>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="export-date-to" className="text-xs font-medium text-secondary uppercase tracking-wide">{tCopy("COPY.TO_DATE")}</label>
              <input
                id="export-date-to"
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-floating border border-border text-sm text-primary focus:outline-none focus:border-focus"
               data-testid="superadmin-system-system-data-export-export-date-to-6"/>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1">
              {selected.size > 0 && (
                <p className="text-sm text-secondary">
                  <span className="text-primary font-semibold">{tCopy('COPY.SELECTED_EXPORT_ESTIMATE', { count: selected.size, rows: estimatedTotal.toLocaleString(), format })}</span>
                </p>
              )}
            </div>
            <Button
              id="export-data-btn"
              variant="primary"
              disabled={selected.size === 0 || (Boolean(dateFrom && dateTo) && dateFrom > dateTo)}
              title={tCopy("COPY.DOWNLOADS_A_CSV_CONFIGURATION_MANIFEST_ONLY_NO_BUSINESS_RECORDS_ARE_EXPORTED")}
              onClick={() => handleExport()}
             data-testid="superadmin_system_data_export_jobs-export-data-btn">
              <><Download size={16} /> {tCopy("COPY.DOWNLOAD_MANIFEST_CSV")}</>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
