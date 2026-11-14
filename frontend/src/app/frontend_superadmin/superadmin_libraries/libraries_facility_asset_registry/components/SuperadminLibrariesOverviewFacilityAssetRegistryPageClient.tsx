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
  const [catFilter, setCatFilter] = useSuperadminLibrariesOverviewFacilityAssetRegistryUrlFilter('assetCategory', 'all');
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

      <div className="flex items-center justify-between">
        <div>
          <h1 className="acct-page-title">{tCopy("COPY.ASSET_MANAGER")}</h1>
          <p className="acct-page-subtitle">{tCopy("COPY.TRACK_ASSET_SAMPLES_AND_PREVIEW_ASSET_STATE_CHANGES")}</p>
          <p className="mt-3 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy("COPY.SAMPLE_ASSET_DATA_ONLY_ADD_ASSET_UPDATES_THIS_PAGE_PREVIEW_NO_ASSET_PERSISTENCE_API_IS_SUPPLIED")}</p>
        </div>
        <button type="button" className="acct-badge acct-badge--info cursor-pointer" onClick={() => setShowAdd(true)} data-testid="superadmin-accounting-accounting-assets-add-asset-1"><Plus size={12} /> {tCopy("COPY.ADD_ASSET")}</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="acct-kpi-card"><p className="acct-kpi-label">{tCopy("COPY.TOTAL_ASSETS")}</p><p className="acct-kpi-value">{assets.length}</p></div>
        <div className="acct-kpi-card"><p className="acct-kpi-label acct-text-success">{tCopy("COPY.CURRENT_VALUE")}</p><p className="acct-kpi-value acct-text-success">{formatSuperadminAccountingMajorPreviewCurrency(totalValue, 'INR', locale)}</p></div>
        <div className="acct-kpi-card acct-kpi-card--warning"><p className="acct-kpi-label acct-kpi-label--warning">{tCopy("COPY.UNDER_MAINTENANCE")}</p><p className="acct-kpi-value acct-kpi-value--warning">{assets.filter(a=>a.status==='maintenance').length}</p></div>
        <div className="acct-kpi-card"><p className="acct-kpi-label acct-text-muted">{tCopy("COPY.DISPOSED")}</p><p className="acct-kpi-value acct-text-muted">{assets.filter(a=>a.status==='disposed').length}</p></div>
      </div>

      <div className="acct-filter-bar">
        <select aria-label={tCopy("COPY.CAT_FILTER")} className="acct-select w-44" value={catFilter} onChange={e => setCatFilter(e.target.value)} data-testid="superadmin-accounting-accounting-assets-cat-filter-2">
          <option value="all">{tCopy("COPY.ALL_CATEGORIES")}</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="acct-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="acct-table-header-row">
              <th className="text-left py-3 px-4">{tCopy("COPY.ASSET_NAME")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.CATEGORY")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.PURCHASE_DATE")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.PURCHASE_VALUE")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.CURRENT_VALUE")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.LOCATION")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.STATUS")}</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan={7}><div className="acct-empty-state"><div className="acct-empty-state__icon">🏷️</div><p className="acct-empty-state__title">{tCopy("COPY.NO_ASSETS_FOUND")}</p></div></td></tr>
            ) : visible.map((a) => (
              <tr key={a.id} className={`acct-table-hover-row acct-table-row ${a.status === 'disposed' ? 'opacity-50' : ''}`}>
                <td className="py-3 px-4 acct-cell-name">{a.name}</td>
                <td className="py-3 px-4"><span className="acct-badge acct-badge--neutral">{a.category}</span></td>
                <td className="py-3 px-4 acct-cell-subtext">{a.purchaseDate}</td>
                <td className="py-3 px-4 text-right acct-cell-subtext">{formatSuperadminAccountingMajorPreviewCurrency(a.purchaseValue, 'INR', locale)}</td>
                <td className="py-3 px-4 text-right font-semibold acct-text-body">{formatSuperadminAccountingMajorPreviewCurrency(a.currentValue, 'INR', locale)}</td>
                <td className="py-3 px-4 acct-cell-subtext">{a.location}</td>
                <td className="py-3 px-4"><span className={`acct-badge ${SUPERADMIN_ACCOUNTING_ASSET_STATUS_BADGE[a.status]}`}>{tCopy(`COPY.${String(a.status).toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`)}</span></td>
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
