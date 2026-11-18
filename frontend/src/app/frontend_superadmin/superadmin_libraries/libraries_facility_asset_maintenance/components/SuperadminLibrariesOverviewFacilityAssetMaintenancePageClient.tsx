'use client';
import SuperadminLibrariesOverviewFacilityAssetMaintenanceEmptyState from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_maintenance/components/SuperadminLibrariesOverviewFacilityAssetMaintenanceEmptyState';
/** Responsibility: Superadmin Accounting Asset Maintenance Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminLibrariesOverviewFacilityAssetMaintenancePageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { useSuperadminLibrariesOverviewFacilityAssetMaintenanceUrlFilter } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_maintenance/hooks/useSuperadminLibrariesOverviewFacilityAssetMaintenanceUrlFilter';
import { useSuperadminLibrariesOverviewFacilityAssetMaintenanceValidationMessage } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_maintenance/hooks/useSuperadminLibrariesOverviewFacilityAssetMaintenanceValidationMessage';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { formatSuperadminAccountingMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_maintenance/utils/SuperadminLibrariesOverviewFacilityAssetMaintenanceFormatters';
import { SuperadminAccountingMaintenanceSchema, type SuperadminAccountingMaintenanceFormValues } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_maintenance/schemas/SuperadminLibrariesOverviewFacilityAssetMaintenanceMaintenanceSchema';
import { SUPERADMIN_ACCOUNTING_SAMPLE_MAINTENANCE_LOGS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_maintenance/mocks/fixtures/SuperadminLibrariesOverviewFacilityAssetMaintenanceMaintenanceMockFixtures';
import type { SuperadminAccountingMaintenanceLog } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_maintenance/types/SuperadminLibrariesOverviewFacilityAssetMaintenanceMaintenanceTypes';
import { SUPERADMIN_ACCOUNTING_MAINTENANCE_STATUS_BADGE } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_maintenance/constants/SuperadminLibrariesOverviewFacilityAssetMaintenanceMaintenanceConstants';
import { useTranslations, useLocale } from 'next-intl';
import { useSuperadminLibrariesOverviewFacilityAssetMaintenanceUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_maintenance/hooks/useSuperadminLibrariesOverviewFacilityAssetMaintenanceUnsavedChangesGuard';
import { SUPERADMIN_ACCOUNTING_ASSET_MAINTENANCE_PAGE_CLIENT_SELECTOR } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_maintenance/constants/SuperadminLibrariesOverviewFacilityAssetMaintenanceStaticConstants';



/**
 * Renders the `superadmin_accounting` view owned by `SuperadminLibrariesOverviewFacilityAssetMaintenancePageClient`.
 * Owns local UI state for `logs`, `statusFilter`, `showAdd`.
 * Effect lifecycle boundaries are `[showAdd]`; listeners/timers/focus are cleaned up by their owning effects.
 * Dirty form state is guarded before destructive or route-leaving actions.
 */
export default function SuperadminLibrariesOverviewFacilityAssetMaintenancePageClient() {
  const tCopy = useTranslations('SUPERADMIN_ACCOUNTING');
  const locale = useLocale();
  const translateValidationMessage = useSuperadminLibrariesOverviewFacilityAssetMaintenanceValidationMessage();
  const [logs, setLogs] = useState<SuperadminAccountingMaintenanceLog[]>(() => SUPERADMIN_ACCOUNTING_SAMPLE_MAINTENANCE_LOGS.map((log) => ({ ...log })));
  const [statusFilter, setStatusFilter] = useSuperadminLibrariesOverviewFacilityAssetMaintenanceUrlFilter<string>('maintenanceStatus', 'all');
  const [showAdd, setShowAdd] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting , isDirty} } = useForm<SuperadminAccountingMaintenanceFormValues>({
    resolver: zodResolver(SuperadminAccountingMaintenanceSchema),
    defaultValues: { assetName: '', issue: '', reportedDate: '', scheduledDate: '', vendor: '', cost: '' },
  });
  useSuperadminLibrariesOverviewFacilityAssetMaintenanceUnsavedChangesGuard(isDirty, tCopy('COPY.UNSAVED_CHANGES_WARNING'));

  // Effect contract: manage keyboard focus, Escape/Tab behavior, and focus restoration for the active dialog or drawer; dependency set [showAdd] is the deliberate re-run boundary.
  useEffect(() => {
    if (!showAdd) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    
    
    const getControls = () => Array.from<HTMLElement>(dialogRef.current?.querySelectorAll<HTMLElement>(SUPERADMIN_ACCOUNTING_ASSET_MAINTENANCE_PAGE_CLIENT_SELECTOR) ?? []);
    getControls()[0]?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setShowAdd(false); return; }
      if (event.key !== 'Tab') return;
      const controls = getControls(); const first = controls[0]; const last = controls[controls.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => { document.removeEventListener('keydown', handleKeyDown); previousFocus?.focus(); };
  }, [showAdd]);

  const visible = statusFilter === 'all' ? logs : logs.filter(l => l.status === statusFilter);
  const totalCost = logs.filter(l => l.status === 'completed').reduce((s, l) => s + l.cost, 0);

  const handleComplete = (id: number) => {
    setLogs(p => p.map((l) => l.id === id ? { ...l, status: 'completed' } : l));
    toast.message(tCopy("COPY.PREVIEW_UPDATED_LOCALLY_ONLY_NO_MAINTENANCE_API_CONTRACT_IS_SUPPLIED"), { id: "superadmin_accounting:SuperadminLibrariesOverviewFacilityAssetMaintenancePageClient:message:1" });
  };

  const handleAdd = (values: SuperadminAccountingMaintenanceFormValues) => {
    setLogs(p => [{ id: Date.now(), assetName: values.assetName.trim(), issue: values.issue.trim(), reportedDate: values.reportedDate, scheduledDate: values.scheduledDate, vendor: values.vendor.trim() || '—', cost: values.cost ? Number(values.cost) : 0, status: 'pending' }, ...p]);
    toast.message(tCopy("COPY.PREVIEW_UPDATED_LOCALLY_ONLY_NO_MAINTENANCE_API_CONTRACT_IS_SUPPLIED"), { id: "superadmin_accounting:SuperadminLibrariesOverviewFacilityAssetMaintenancePageClient:message:2" });
    setShowAdd(false);
    reset();
  };

  return (
    <div className="space-y-6">
      {(visible?.length === 0) && <SuperadminLibrariesOverviewFacilityAssetMaintenanceEmptyState filtered />}

      {/* ── Page Header ── */}
      <div className="w-full rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 p-5 sm:p-6 shadow-md mb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{tCopy("COPY.ASSET_MAINTENANCE")}</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">{tCopy("COPY.REVIEW_ILLUSTRATIVE_MAINTENANCE_REQUESTS_AND_SERVICE_HISTORY")}</p>
            <p className="mt-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-2 text-xs text-indigo-300" role="status">{tCopy("COPY.SAMPLE_RECORDS_ONLY_LOGGING_OR_COMPLETING_A_REQUEST_CHANGES_BROWSER_PREVIEW_STATE_AND_DOES_NOT_CREATE_A_SERVICE_ORDER")}</p>
          </div>
          <button type="button" className="inline-flex items-center gap-1.5 min-h-9 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-md transition-all cursor-pointer shrink-0" onClick={() => setShowAdd(true)} data-testid="superadmin-accounting-accounting-asset-maintenance-log-request-1"><Plus size={13} /> {tCopy("COPY.LOG_REQUEST")}</button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        <div className="rounded-2xl border border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 to-[#2c200c]/80 shadow-md p-4 sm:p-5 hover:scale-[1.01] transition-all">
          <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">{tCopy("COPY.PENDING")}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{logs.filter(l=>l.status==='pending').length}</p>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-3"><div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400" style={{width: `${Math.min(100, logs.filter(l=>l.status==='pending').length * 20)}%`}} /></div>
        </div>
        <div className="rounded-2xl border border-sky-500/25 bg-gradient-to-br from-[#0c1828]/95 to-[#122238]/80 shadow-md p-4 sm:p-5 hover:scale-[1.01] transition-all">
          <p className="text-xs font-semibold text-sky-300 uppercase tracking-wider mb-1">{tCopy("COPY.IN_PROGRESS")}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{logs.filter(l=>l.status==='in-progress').length}</p>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-3"><div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-400" style={{width: `${Math.min(100, logs.filter(l=>l.status==='in-progress').length * 20)}%`}} /></div>
        </div>
        <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 to-[#0e2721]/80 shadow-md p-4 sm:p-5 hover:scale-[1.01] transition-all">
          <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1">{tCopy("COPY.COMPLETED")}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{logs.filter(l=>l.status==='completed').length}</p>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-3"><div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{width: `${Math.min(100, logs.filter(l=>l.status==='completed').length * 20)}%`}} /></div>
        </div>
        <div className="rounded-2xl border border-rose-500/25 bg-gradient-to-br from-[#1a0810]/95 to-[#2a0e1a]/80 shadow-md p-4 sm:p-5 hover:scale-[1.01] transition-all">
          <p className="text-xs font-semibold text-rose-300 uppercase tracking-wider mb-1">{tCopy("COPY.TOTAL_COST")}</p>
          <p className="text-xl sm:text-2xl font-extrabold text-white">{formatSuperadminAccountingMajorPreviewCurrency(totalCost, 'INR', locale)}</p>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-3"><div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-rose-400 w-[75%]" /></div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-[#0c0f28]/95 border border-indigo-500/25 shadow-md">
        <select aria-label={tCopy("COPY.STATUS_FILTER")} className="rounded-xl border border-indigo-500/25 bg-card px-3 py-2 text-xs font-medium text-white hover:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none cursor-pointer w-44" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} data-testid="superadmin-accounting-accounting-asset-maintenance-status-filter-2">
          <option value="all">{tCopy("COPY.ALL_STATUS")}</option>
          <option value="pending">{tCopy("COPY.PENDING")}</option>
          <option value="in-progress">{tCopy("COPY.IN_PROGRESS")}</option>
          <option value="completed">{tCopy("COPY.COMPLETED")}</option>
        </select>
      </div>

      <div className="rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 shadow-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-indigo-500/20 text-xs font-semibold text-slate-400 uppercase tracking-wide">
              <th className="text-left py-3 px-4">{tCopy("COPY.ASSET")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.ISSUE")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.REPORTED")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.SCHEDULED")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.VENDOR")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.COST")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.STATUS")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.ACTION")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-500/10">
            {visible.length === 0 ? (
              <tr><td colSpan={8}><div className="flex flex-col items-center justify-center gap-2 py-10 text-center"><div className="text-3xl">🔧</div><p className="text-sm text-slate-400">{tCopy("COPY.NO_MAINTENANCE_RECORDS_FOUND")}</p></div></td></tr>
            ) : visible.map((l) => (
              <tr key={l.id} className="hover:bg-indigo-500/5 transition-colors">
                <td className="py-3 px-4 font-semibold text-white text-xs">{l.assetName}</td>
                <td className="py-3 px-4 text-slate-300 text-xs">{l.issue}</td>
                <td className="py-3 px-4 text-slate-400 text-xs">{l.reportedDate}</td>
                <td className="py-3 px-4 text-slate-400 text-xs">{l.scheduledDate}</td>
                <td className="py-3 px-4 text-slate-400 text-xs">{l.vendor}</td>
                <td className="py-3 px-4 text-right font-semibold text-amber-300 text-xs">{formatSuperadminAccountingMajorPreviewCurrency(l.cost, 'INR', locale)}</td>
                <td className="py-3 px-4"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${SUPERADMIN_ACCOUNTING_MAINTENANCE_STATUS_BADGE[l.status]}`}>{tCopy(`COPY.${String(l.status).toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`)}</span></td>
                <td className="py-3 px-4 text-right">
                  {l.status !== 'completed' && (
                    <button type="button" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 cursor-pointer transition-all" onClick={() => handleComplete(l.id)} data-testid={`superadmin-accounting-accounting-asset-maintenance-done-3-${String(l.id)}`}>
                      <CheckCircle size={11} /> {tCopy("COPY.DONE")}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="acct-dialog-overlay" onClick={() => setShowAdd(false)} data-testid="superadmin-superadmin-accounting-asset-maintenance-page-client-div-line-146">
          <div ref={dialogRef} className="acct-dialog" role="dialog" aria-modal="true" aria-labelledby="maintenance-form-title" onClick={(event) => event.stopPropagation()} data-testid="superadmin-superadmin-accounting-asset-maintenance-page-client-div-line-147">
            <h2 id="maintenance-form-title" className="acct-dialog__title">{tCopy("COPY.LOG_MAINTENANCE_REQUEST")}</h2>
            <button type="button" className="acct-dialog__close" aria-label={tCopy("COPY.CLOSE_MAINTENANCE_REQUEST_DIALOG")} onClick={() => setShowAdd(false)} data-testid="superadmin-accounting-accounting-asset-maintenance-close-maintenance-request-dialog-4">✕</button>
            <p className="text-sm text-secondary" role="status">{tCopy("COPY.PREVIEW_ONLY_SAVING_CHANGES_THIS_PAGE_STATE_THE_SUPPLIED_SCOPE_CONTAINS_NO_MAINTENANCE_WRITE_API")}</p>
            <form onSubmit={handleSubmit(handleAdd)} noValidate className="space-y-3" data-testid="superadmin-superadmin-accounting-asset-maintenance-page-client-form-line-151">
              <div><label className="acct-label" htmlFor="maintenance-asset-name">{tCopy("COPY.ASSET_NAME")} <span className="acct-text-danger">*</span></label><input id="maintenance-asset-name" className="acct-input" placeholder={tCopy("COPY.E_G_AC_UNIT")} aria-invalid={Boolean(errors.assetName)} aria-describedby={errors.assetName ? "maintenance-asset-name-error" : undefined} {...register("assetName")}  data-testid="superadmin-accounting-accounting-asset-maintenance-maintenance-asset-name-5"/>{errors.assetName && <p id="maintenance-asset-name-error" className="mt-1 text-xs text-danger" role="alert">{translateValidationMessage(errors.assetName.message)}</p>}</div>
              <div><label className="acct-label" htmlFor="maintenance-issue">{tCopy("COPY.ISSUE")} <span className="acct-text-danger">*</span></label><input id="maintenance-issue" className="acct-input" placeholder={tCopy("COPY.DESCRIBE_THE_ISSUE")} aria-invalid={Boolean(errors.issue)} aria-describedby={errors.issue ? "maintenance-issue-error" : undefined} {...register("issue")}  data-testid="superadmin-accounting-accounting-asset-maintenance-maintenance-issue-6"/>{errors.issue && <p id="maintenance-issue-error" className="mt-1 text-xs text-danger" role="alert">{translateValidationMessage(errors.issue.message)}</p>}</div>
              <div><label className="acct-label" htmlFor="maintenance-reported-date">{tCopy("COPY.REPORTED_DATE")} <span className="acct-text-danger">*</span></label><input id="maintenance-reported-date" type="date" className="acct-input" aria-invalid={Boolean(errors.reportedDate)} aria-describedby={errors.reportedDate ? "maintenance-reported-date-error" : undefined} {...register("reportedDate")}  data-testid="superadmin-accounting-accounting-asset-maintenance-maintenance-reported-date-7"/>{errors.reportedDate && <p id="maintenance-reported-date-error" className="mt-1 text-xs text-danger" role="alert">{translateValidationMessage(errors.reportedDate.message)}</p>}</div>
              <div><label className="acct-label" htmlFor="maintenance-scheduled-date">{tCopy("COPY.SCHEDULED_DATE")} <span className="acct-text-danger">*</span></label><input id="maintenance-scheduled-date" type="date" className="acct-input" aria-invalid={Boolean(errors.scheduledDate)} aria-describedby={errors.scheduledDate ? "maintenance-scheduled-date-error" : undefined} {...register("scheduledDate")}  data-testid="superadmin-accounting-accounting-asset-maintenance-maintenance-scheduled-date-8"/>{errors.scheduledDate && <p id="maintenance-scheduled-date-error" className="mt-1 text-xs text-danger" role="alert">{translateValidationMessage(errors.scheduledDate.message)}</p>}</div>
              <div><label className="acct-label" htmlFor="maintenance-vendor">{tCopy("COPY.VENDOR")}</label><input id="maintenance-vendor" className="acct-input" placeholder={tCopy("COPY.VENDOR_NAME")} aria-invalid={Boolean(errors.vendor)} aria-describedby={errors.vendor ? "maintenance-vendor-error" : undefined} {...register("vendor")}  data-testid="superadmin-accounting-accounting-asset-maintenance-maintenance-vendor-9"/>{errors.vendor && <p id="maintenance-vendor-error" className="mt-1 text-xs text-danger" role="alert">{translateValidationMessage(errors.vendor.message)}</p>}</div>
              <div><label className="acct-label" htmlFor="maintenance-cost">{tCopy("COPY.ESTIMATED_COST")}</label><input id="maintenance-cost" type="number" min="0" step="0.01" className="acct-input" placeholder="0" aria-invalid={Boolean(errors.cost)} aria-describedby={errors.cost ? "maintenance-cost-error" : undefined} {...register("cost")}  data-testid="superadmin-accounting-accounting-asset-maintenance-maintenance-cost-10"/>{errors.cost && <p id="maintenance-cost-error" className="mt-1 text-xs text-danger" role="alert">{translateValidationMessage(errors.cost.message)}</p>}</div>
            <div className="acct-dialog__footer">
              <button type="button" className="acct-badge acct-badge--neutral cursor-pointer" onClick={() => setShowAdd(false)} data-testid="superadmin-accounting-accounting-asset-maintenance-cancel-11">{tCopy("COPY.CANCEL")}</button>
              <button type="submit" disabled={isSubmitting} className="acct-badge acct-badge--success cursor-pointer" data-testid="superadmin-accounting-accounting-asset-maintenance-save-preview-12">{tCopy("COPY.SAVE_PREVIEW")}</button>
            </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
