'use client';
import SuperadminLibrariesOverviewFacilityAssetRegistryEmptyState from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_registry/components/SuperadminLibrariesOverviewFacilityAssetRegistryEmptyState';
/** Responsibility: Superadmin Accounting Assets Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminLibrariesOverviewFacilityAssetRegistryPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { useSuperadminLibrariesOverviewFacilityAssetRegistryUrlFilter } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_registry/hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryUrlFilter';
import { useSuperadminLibrariesOverviewFacilityAssetRegistryValidationMessage } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_registry/hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryValidationMessage';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { formatSuperadminAccountingMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_registry/utils/SuperadminLibrariesOverviewFacilityAssetRegistryFormatters';
import { SuperadminAccountingAssetSchema, type SuperadminAccountingAssetFormValues } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_registry/schemas/SuperadminLibrariesOverviewFacilityAssetRegistryAssetSchema';
import { SUPERADMIN_ACCOUNTING_SAMPLE_ASSETS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_registry/mocks/fixtures/SuperadminLibrariesOverviewFacilityAssetRegistryAssetMockFixtures';
import type { SuperadminAccountingAsset } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_registry/types/SuperadminLibrariesOverviewFacilityAssetRegistryAssetTypes';
import { SUPERADMIN_ACCOUNTING_ASSET_STATUS_BADGE } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_registry/constants/SuperadminLibrariesOverviewFacilityAssetRegistryAssetConstants';
import { getSuperadminAccountingAssetCategories } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_registry/utils/SuperadminLibrariesOverviewFacilityAssetRegistryAssetUtilities';
import { useTranslations, useLocale } from 'next-intl';
import { useSuperadminLibrariesOverviewFacilityAssetRegistryUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_registry/hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryUnsavedChangesGuard';
import { SUPERADMIN_ACCOUNTING_ASSETS_PAGE_CLIENT_SELECTOR } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_registry/constants/SuperadminLibrariesOverviewFacilityAssetRegistryStaticConstants';



/**
 * Renders the `superadmin_accounting` view owned by `SuperadminLibrariesOverviewFacilityAssetRegistryPageClient`.
 * Owns local UI state for `assets`, `catFilter`, `showAdd`.
 * Effect lifecycle boundaries are `[showAdd]`; listeners/timers/focus are cleaned up by their owning effects.
 * Dirty form state is guarded before destructive or route-leaving actions.
 */
export default function SuperadminLibrariesOverviewFacilityAssetRegistryPageClient() {
  const tCopy = useTranslations('SUPERADMIN_ACCOUNTING');
  const locale = useLocale();
  const translateValidationMessage = useSuperadminLibrariesOverviewFacilityAssetRegistryValidationMessage();
  const [assets, setAssets] = useState<SuperadminAccountingAsset[]>(() => SUPERADMIN_ACCOUNTING_SAMPLE_ASSETS.map((asset) => ({ ...asset })));
  const [catFilter, setCatFilter] = useSuperadminLibrariesOverviewFacilityAssetRegistryUrlFilter<string>('assetCategory', 'all');
  const [showAdd, setShowAdd] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting , isDirty} } = useForm<SuperadminAccountingAssetFormValues>({
    resolver: zodResolver(SuperadminAccountingAssetSchema),
    defaultValues: { name: '', category: 'Furniture', purchaseDate: '', purchaseValue: '', location: '' },
  });
  useSuperadminLibrariesOverviewFacilityAssetRegistryUnsavedChangesGuard(isDirty, tCopy('COPY.UNSAVED_CHANGES_WARNING'));

  // Effect contract: manage keyboard focus, Escape/Tab behavior, and focus restoration for the active dialog or drawer; dependency set [showAdd] is the deliberate re-run boundary.
  useEffect(() => {
    if (!showAdd) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    
    
    const getControls = () => Array.from<HTMLElement>(dialogRef.current?.querySelectorAll<HTMLElement>(SUPERADMIN_ACCOUNTING_ASSETS_PAGE_CLIENT_SELECTOR) ?? []);
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

  const categories = getSuperadminAccountingAssetCategories(assets);
  const visible = catFilter === 'all' ? assets : assets.filter(a => a.category === catFilter);
  const totalValue = assets.filter(a => a.status !== 'disposed').reduce((s, a) => s + a.currentValue, 0);

  const handleAdd = (values: SuperadminAccountingAssetFormValues) => {
    const value = Number(values.purchaseValue);
    setAssets(p => [{ id: Date.now(), name: values.name.trim(), category: values.category, purchaseDate: values.purchaseDate, purchaseValue: value, currentValue: value, location: values.location.trim(), status: 'active' }, ...p]);
    toast.message(tCopy("COPY.PREVIEW_UPDATED_LOCALLY_ONLY_NO_ASSET_API_CONTRACT_IS_SUPPLIED"), { id: "superadmin_accounting:SuperadminLibrariesOverviewFacilityAssetRegistryPageClient:message:1" });
    setShowAdd(false);
    reset();
  };

  return (
    <div className="space-y-6">
      {(visible?.length === 0) && <SuperadminLibrariesOverviewFacilityAssetRegistryEmptyState filtered={catFilter !== 'all'} />}

      {/* ── Page Header ── */}
      <div className="w-full rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 p-5 sm:p-6 shadow-md mb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{tCopy("COPY.ASSET_MANAGER")}</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">{tCopy("COPY.TRACK_ASSET_SAMPLES_AND_PREVIEW_ASSET_STATE_CHANGES")}</p>
            <p className="mt-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-2 text-xs text-indigo-300" role="status">{tCopy("COPY.SAMPLE_ASSET_DATA_ONLY_ADD_ASSET_UPDATES_THIS_PAGE_PREVIEW_NO_ASSET_PERSISTENCE_API_IS_SUPPLIED")}</p>
          </div>
          <button type="button" className="inline-flex items-center gap-1.5 min-h-9 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-md transition-all cursor-pointer shrink-0" onClick={() => setShowAdd(true)} data-testid="superadmin-accounting-accounting-assets-add-asset-1"><Plus size={13} /> {tCopy("COPY.ADD_ASSET")}</button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        <div className="rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 to-[#12163a]/80 shadow-md p-4 sm:p-5 hover:scale-[1.01] transition-all">
          <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">{tCopy("COPY.TOTAL_ASSETS")}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{assets.length}</p>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-3"><div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 w-[78%]" /></div>
        </div>
        <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 to-[#0e2721]/80 shadow-md p-4 sm:p-5 hover:scale-[1.01] transition-all">
          <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1">{tCopy("COPY.CURRENT_VALUE")}</p>
          <p className="text-xl sm:text-2xl font-extrabold text-white">{formatSuperadminAccountingMajorPreviewCurrency(totalValue, 'INR', locale)}</p>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-3"><div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 w-[88%]" /></div>
        </div>
        <div className="rounded-2xl border border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 to-[#2c200c]/80 shadow-md p-4 sm:p-5 hover:scale-[1.01] transition-all">
          <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">{tCopy("COPY.UNDER_MAINTENANCE")}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{assets.filter(a=>a.status==='maintenance').length}</p>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-3"><div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400" style={{width: `${Math.min(100, assets.filter(a=>a.status==='maintenance').length * 25)}%`}} /></div>
        </div>
        <div className="rounded-2xl border border-slate-500/25 bg-gradient-to-br from-[#111]/95 to-[#1e1e1e]/80 shadow-md p-4 sm:p-5 hover:scale-[1.01] transition-all">
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">{tCopy("COPY.DISPOSED")}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{assets.filter(a=>a.status==='disposed').length}</p>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-3"><div className="h-full rounded-full bg-gradient-to-r from-slate-500 to-slate-400" style={{width: `${Math.min(100, assets.filter(a=>a.status==='disposed').length * 25)}%`}} /></div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-[#0c0f28]/95 border border-indigo-500/25 shadow-md">
        <select aria-label={tCopy("COPY.CAT_FILTER")} className="rounded-xl border border-indigo-500/25 bg-card px-3 py-2 text-xs font-medium text-white hover:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none cursor-pointer w-44" value={catFilter} onChange={e => setCatFilter(e.target.value)} data-testid="superadmin-accounting-accounting-assets-cat-filter-2">
          <option value="all">{tCopy("COPY.ALL_CATEGORIES")}</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 shadow-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-indigo-500/20 text-xs font-semibold text-slate-400 uppercase tracking-wide">
              <th className="text-left py-3 px-4">{tCopy("COPY.ASSET_NAME")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.CATEGORY")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.PURCHASE_DATE")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.PURCHASE_VALUE")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.CURRENT_VALUE")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.LOCATION")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.STATUS")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-500/10">
            {visible.length === 0 ? (
              <tr><td colSpan={7}><div className="flex flex-col items-center justify-center gap-2 py-10 text-center"><div className="text-3xl">🏷️</div><p className="text-sm text-slate-400">{tCopy("COPY.NO_ASSETS_FOUND")}</p></div></td></tr>
            ) : visible.map((a) => (
              <tr key={a.id} className={`hover:bg-indigo-500/5 transition-colors ${a.status === 'disposed' ? 'opacity-50' : ''}`}>
                <td className="py-3 px-4 font-semibold text-white text-xs">{a.name}</td>
                <td className="py-3 px-4"><span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border border-slate-700 bg-slate-800/60 text-slate-300">{a.category}</span></td>
                <td className="py-3 px-4 text-slate-400 text-xs">{a.purchaseDate}</td>
                <td className="py-3 px-4 text-right text-slate-400 text-xs">{formatSuperadminAccountingMajorPreviewCurrency(a.purchaseValue, 'INR', locale)}</td>
                <td className="py-3 px-4 text-right font-semibold text-emerald-300 text-xs">{formatSuperadminAccountingMajorPreviewCurrency(a.currentValue, 'INR', locale)}</td>
                <td className="py-3 px-4 text-slate-400 text-xs">{a.location}</td>
                <td className="py-3 px-4"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${SUPERADMIN_ACCOUNTING_ASSET_STATUS_BADGE[a.status]}`}>{tCopy(`COPY.${String(a.status).toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="acct-dialog-overlay" onClick={() => setShowAdd(false)} data-testid="superadmin-superadmin-accounting-assets-page-client-div-line-134">
          <div ref={dialogRef} className="acct-dialog" role="dialog" aria-modal="true" aria-labelledby="asset-form-title" onClick={(event) => event.stopPropagation()} data-testid="superadmin-superadmin-accounting-assets-page-client-div-line-135">
            <h2 id="asset-form-title" className="acct-dialog__title">{tCopy("COPY.ADD_ASSET")}</h2>
            <button type="button" className="acct-dialog__close" aria-label={tCopy("COPY.CLOSE_ADD_ASSET_DIALOG")} onClick={() => setShowAdd(false)} data-testid="superadmin-accounting-accounting-assets-close-add-asset-dialog-3">✕</button>
            <p className="text-sm text-secondary" role="status">{tCopy("COPY.PREVIEW_ONLY_ADDING_AN_ASSET_CHANGES_THIS_PAGE_STATE_NO_ASSET_WRITE_API_CONTRACT_IS_SUPPLIED")}</p>
            <form onSubmit={handleSubmit(handleAdd)} noValidate className="space-y-3" data-testid="superadmin-superadmin-accounting-assets-page-client-form-line-139">
              <div><label className="acct-label" htmlFor="accounting-asset-name">{tCopy("COPY.ASSET_NAME")} <span className="acct-text-danger">*</span></label><input id="accounting-asset-name" className="acct-input" placeholder={tCopy("COPY.E_G_AC_UNIT")} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "accounting-asset-name-error" : undefined} {...register("name")}  data-testid="superadmin-accounting-accounting-assets-accounting-asset-name-4"/>{errors.name && <p id="accounting-asset-name-error" className="mt-1 text-xs text-danger" role="alert">{translateValidationMessage(errors.name.message)}</p>}</div>
              <div><label className="acct-label" htmlFor="accounting-asset-category">{tCopy("COPY.CATEGORY")}</label><select id="accounting-asset-category" className="acct-select" aria-invalid={Boolean(errors.category)} aria-describedby={errors.category ? "accounting-asset-category-error" : undefined} {...register("category")} data-testid="superadmin-accounting-accounting-assets-accounting-asset-category-5">{[...categories,'Other'].map((c) =><option key={c}>{c}</option>)}</select></div>
              <div><label className="acct-label" htmlFor="accounting-asset-purchase-date">{tCopy("COPY.PURCHASE_DATE")} <span className="acct-text-danger">*</span></label><input id="accounting-asset-purchase-date" type="date" className="acct-input" aria-invalid={Boolean(errors.purchaseDate)} aria-describedby={errors.purchaseDate ? "accounting-asset-purchase-date-error" : undefined} {...register("purchaseDate")}  data-testid="superadmin-accounting-accounting-assets-accounting-asset-purchase-date-6"/>{errors.purchaseDate && <p id="accounting-asset-purchase-date-error" className="mt-1 text-xs text-danger" role="alert">{translateValidationMessage(errors.purchaseDate.message)}</p>}</div>
              <div><label className="acct-label" htmlFor="accounting-asset-purchase-value">{tCopy("COPY.PURCHASE_VALUE")} <span className="acct-text-danger">*</span></label><input id="accounting-asset-purchase-value" type="number" min="0.01" step="0.01" className="acct-input" placeholder="0" aria-invalid={Boolean(errors.purchaseValue)} aria-describedby={errors.purchaseValue ? "accounting-asset-purchase-value-error" : undefined} {...register("purchaseValue")}  data-testid="superadmin-accounting-accounting-assets-accounting-asset-purchase-value-7"/>{errors.purchaseValue && <p id="accounting-asset-purchase-value-error" className="mt-1 text-xs text-danger" role="alert">{translateValidationMessage(errors.purchaseValue.message)}</p>}</div>
              <div><label className="acct-label" htmlFor="accounting-asset-location">{tCopy("COPY.LOCATION")} <span className="acct-text-danger">*</span></label><input id="accounting-asset-location" className="acct-input" placeholder={tCopy("COPY.E_G_GROUND_FLOOR")} aria-invalid={Boolean(errors.location)} aria-describedby={errors.location ? "accounting-asset-location-error" : undefined} {...register("location")}  data-testid="superadmin-accounting-accounting-assets-accounting-asset-location-8"/>{errors.location && <p id="accounting-asset-location-error" className="mt-1 text-xs text-danger" role="alert">{translateValidationMessage(errors.location.message)}</p>}</div>
            <div className="acct-dialog__footer">
              <button type="button" className="acct-badge acct-badge--neutral cursor-pointer" onClick={() => setShowAdd(false)} data-testid="superadmin-accounting-accounting-assets-cancel-9">{tCopy("COPY.CANCEL")}</button>
              <button type="submit" disabled={isSubmitting} className="acct-badge acct-badge--success cursor-pointer" data-testid="superadmin-accounting-accounting-assets-save-preview-10">{tCopy("COPY.SAVE_PREVIEW")}</button>
            </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
