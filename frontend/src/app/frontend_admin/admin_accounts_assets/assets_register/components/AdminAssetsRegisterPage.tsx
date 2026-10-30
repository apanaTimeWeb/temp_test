import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Download, Plus, Trash2, X } from 'lucide-react';
import toast from 'sonner';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import type { DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import { displayValue } from '@/lib/display_value';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import AdminAssetsRegisterSummarySection from '@/app/frontend_admin/admin_accounts_assets/assets_register/components/AdminAssetsRegisterSummarySection';
import AdminAssetsRegisterFilterSection from '@/app/frontend_admin/admin_accounts_assets/assets_register/components/AdminAssetsRegisterFilterSection';
import AdminAssetsRegisterTableSection from '@/app/frontend_admin/admin_accounts_assets/assets_register/components/AdminAssetsRegisterTableSection';
import { ADMIN_ASSETS_REGISTER_CATEGORY_OPTIONS, ADMIN_ASSETS_REGISTER_CATEGORY_TRANSLATION_KEY, ADMIN_ASSETS_REGISTER_STATUS_BADGE, ADMIN_ASSETS_REGISTER_STATUS_TRANSLATION_KEY, ADMIN_ASSETS_REGISTER_ROUTES } from '@/app/frontend_admin/admin_accounts_assets/assets_register/config/admin_assets_register.url_config';
import { createAdminAssetsRegisterFormSchema, type AdminAssetsRegisterFormValues } from '@/app/frontend_admin/admin_accounts_assets/assets_register/schemas/AdminAssetsRegisterFormSchemas';
import { ADMIN_ASSETS_REGISTER_ASSET_FIXTURES } from '@/app/frontend_admin/admin_accounts_assets/assets_register/mocks/scenarios/admin_assets_register.scenarios';
import type { AdminAssetsRegisterAsset } from '@/app/frontend_admin/admin_accounts_assets/assets_register/schemas/AdminAssetsRegisterFormSchemas';
import { buildAdminAssetsRegisterCsv, downloadAdminAssetsRegisterCsv, formatAdminAccountingCurrency, toAdminAccountingMinorUnits } from '@/app/frontend_admin/admin_accounts_assets/assets_register/utils/AdminAssetsRegisterCurrencyAndCsv';

import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import type { AdminAssetsRegisterDeleteConfirmationDialogProps } from '@/app/frontend_admin/admin_accounts_assets/assets_register/types/AdminAssetsRegisterComponentTypes';

// Responsibility: owns transient asset-register demo state, form flows, filters, and confirmations.
'use client';

function resolveAdminAssetsRegisterCategoryFilter(value: string | null): string {
  return value && (ADMIN_ASSETS_REGISTER_CATEGORY_OPTIONS as readonly string[]).includes(value) ? value : 'all';
}

export function AdminAssetsRegisterPage() {
  const locale = useLocale();
  const t = useTranslations('ADMIN_ACCOUNTING.ASSETS');
  const router = useRouter();
  const isDemoMode = isFrontendDemoModeEnabled();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [assets, setAssets] = useState<AdminAssetsRegisterAsset[]>(() => isDemoMode ? [...ADMIN_ASSETS_REGISTER_ASSET_FIXTURES] : []);
  const [catFilter, setCatFilter] = useState(() => resolveAdminAssetsRegisterCategoryFilter(searchParams.get('category')));
  const [showAdd, setShowAdd] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminAssetsRegisterAsset | null>(null);
  const assetFormSchema = useMemo(() => createAdminAssetsRegisterFormSchema((key) => t(key)), [t]);
  const form = useForm<AdminAssetsRegisterFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: { name: '', category: 'Furniture', purchaseDate: '', purchaseValue: 0, location: '' },
    mode: 'onBlur',
  });

  const handleBlockedNavigation = useCallback((href: string) => {
    setPendingHref(href);
    setShowDiscardDialog(true);
  }, []);
  const hasUnsavedChanges = showAdd && form.formState.isDirty;
  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    const onDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement) || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.href === window.location.href) return;
      event.preventDefault(); event.stopPropagation();
      handleBlockedNavigation(`${destination.pathname}${destination.search}${destination.hash}`);
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    document.addEventListener('click', onDocumentClick, true);
    return () => { window.removeEventListener('beforeunload', onBeforeUnload); document.removeEventListener('click', onDocumentClick, true); };
  }, [hasUnsavedChanges, handleBlockedNavigation]);

  const categories = useMemo(() => [...new Set(assets.map((asset) => asset.category))], [assets]);
  useEffect(() => {
    const nextCategory = resolveAdminAssetsRegisterCategoryFilter(searchParams.get('category'));
    if (nextCategory !== catFilter) setCatFilter(nextCategory);
  }, [catFilter, searchParams]);

  const updateCategoryFilter = (value: string) => {
    const next = resolveAdminAssetsRegisterCategoryFilter(value === 'all' ? null : value);
    setCatFilter(next);
    const params = new URLSearchParams(searchParams.toString());
    if (next === 'all') params.delete('category'); else params.set('category', next);
    router.replace(`${pathname}${params.size ? `?${params.toString()}` : ''}`, { scroll: false });
  };

  const requestCloseAdd = useCallback(() => {
    if (form.formState.isDirty) {
      setPendingHref(null);
      setShowDiscardDialog(true);
      return;
    }
    setShowAdd(false);
  }, [form.formState.isDirty]);

  const discardAndNavigate = () => {
    form.reset();
    setShowDiscardDialog(false);
    setShowAdd(false);
    const destination = pendingHref;
    setPendingHref(null);
    if (destination) router.push(destination);
  };

  const visible = catFilter === 'all' ? assets : assets.filter((asset) => asset.category === catFilter);
  const totalValue = assets.filter((asset) => asset.status !== 'disposed').reduce((sum, asset) => sum + asset.currentValue, 0);
  const columns: DataGridColumn<AdminAssetsRegisterAsset>[] = [
    { field: 'name', headerName: t('ASSET_NAME'), sortable: true, cellRenderer: ({ value }) => displayValue(value as string | number | null | undefined) },
    { field: 'category', headerName: t('CATEGORY'), sortable: true, cellRenderer: ({ value }) => displayValue(value as string | number | null | undefined) },
    { field: 'purchaseDate', headerName: t('PURCHASE_DATE'), sortable: true, cellRenderer: ({ value }) => displayValue(value as string | number | null | undefined) },
    { field: 'purchaseValue', headerName: t('PURCHASE_VALUE'), sortable: true, valueFormatter: ({ value }) => formatAdminAccountingCurrency(Number(value ?? 0), locale) },
    { field: 'currentValue', headerName: t('CURRENT_VALUE'), sortable: true, valueFormatter: ({ value }) => formatAdminAccountingCurrency(Number(value ?? 0), locale) },
    { field: 'location', headerName: t('LOCATION'), sortable: true, cellRenderer: ({ value }) => displayValue(value as string | number | null | undefined) },
    { field: 'status', headerName: t('STATUS'), sortable: true, cellRenderer: ({ value }) => {
      const status = String(value ?? '');
      const badgeClass = ADMIN_ASSETS_REGISTER_STATUS_BADGE[status as keyof typeof ADMIN_ASSETS_REGISTER_STATUS_BADGE] ?? 'bg-surface-zebra text-text-secondary';
      const translationKey = ADMIN_ASSETS_REGISTER_STATUS_TRANSLATION_KEY[status as keyof typeof ADMIN_ASSETS_REGISTER_STATUS_TRANSLATION_KEY] ?? 'STATUS_UNKNOWN';
      return <span className={`inline-flex min-h-7 items-center rounded-full border border-border px-3 py-1 text-xs font-semibold ${badgeClass}`}>{t(translationKey)}</span>;
    } },
    { field: 'id', headerName: t('ACTIONS'), width: 100, sortable: false, cellRenderer: ({ data }) => <button type="button" aria-label={t('DELETE_ASSET', { name: displayValue(data.name) })} title={!isDemoMode ? t('DELETE_BLOCKED') : undefined} disabled={!isDemoMode} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-danger-bg text-danger-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" onClick={() => setPendingDelete(data)}><Trash2 size={18} strokeWidth={2} aria-hidden="true" /></button> },
  ];

  const handleAdd = form.handleSubmit((values) => {
    if (!isDemoMode) {
      toast.error(t('CREATE_BLOCKED'), { id: 'admin-assets-register-create-blocked' });
      return;
    }
    const amountMinor = toAdminAccountingMinorUnits(values.purchaseValue);
    setAssets((current) => [{
      id: Date.now(), name: values.name.trim(), category: values.category, purchaseDate: values.purchaseDate,
      purchaseValue: amountMinor, currentValue: amountMinor, location: values.location.trim(), status: 'active',
    }, ...current]);
    toast.info(t('DEMO_SAVED'), { id: 'admin-assets-register-demo-saved' });
    form.reset();
    setShowAdd(false);
  });

  const handleDelete = () => {
    if (!pendingDelete) return;
    if (!isDemoMode) {
      toast.error(t('DELETE_BLOCKED'), { id: 'admin-assets-register-delete-blocked' });
      setPendingDelete(null);
      return;
    }
    setAssets((current) => current.filter((asset) => asset.id !== pendingDelete.id));
    toast.info(t('DEMO_DELETED'), { id: 'admin-assets-register-demo-deleted' });
    setPendingDelete(null);
  };

  return (
    <div className="space-y-6">
      {!isDemoMode && <p role="status" className="rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('LIVE_UNAVAILABLE')}</p>}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-page-title font-bold text-text-primary">{t('TITLE')}</h1><p className="mt-2 text-sm text-text-secondary">{t('SUBTITLE')}</p></div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" disabled={!isDemoMode} title={!isDemoMode ? t('EXPORT_ASSETS_BLOCKED') : undefined} onClick={() => {
            if (!isDemoMode) { toast.error(t('EXPORT_ASSETS_BLOCKED'), { id: 'admin-assets-register-export-blocked' }); return; }
            try {
              downloadAdminAssetsRegisterCsv('assets-register.csv', buildAdminAssetsRegisterCsv(visible, locale));
              toast.success(t('EXPORT_ASSETS_SUCCESS'), { id: 'admin-assets-register-export-success' });
            } catch {
              toast.error(t('EXPORT_ASSETS_FAILURE'), { id: 'admin-assets-register-export-failure' });
            }
          }}><Download size={18} strokeWidth={2} aria-hidden="true" />{t('EXPORT_ASSETS')}</button>
          <button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" disabled={!isDemoMode} title={!isDemoMode ? t('CREATE_BLOCKED') : undefined} onClick={() => setShowAdd(true)}><Plus size={18} strokeWidth={2} aria-hidden="true" />{t('ADD_ASSET')}</button>
        </div>
      </header>

      <AdminAssetsRegisterSummarySection assets={assets} totalValueLabel={formatAdminAccountingCurrency(totalValue, locale)} labels={{ totalAssets: t('TOTAL_ASSETS'), currentValue: t('CURRENT_VALUE'), underMaintenance: t('UNDER_MAINTENANCE'), disposed: t('DISPOSED') }} />
      <AdminAssetsRegisterFilterSection label={t('FILTER_CATEGORY')} allLabel={t('ALL_CATEGORIES')} categories={categories} categoryFilter={catFilter} onCategoryChange={updateCategoryFilter} getCategoryLabel={(category) => {
        const key = ADMIN_ASSETS_REGISTER_CATEGORY_TRANSLATION_KEY[category as keyof typeof ADMIN_ASSETS_REGISTER_CATEGORY_TRANSLATION_KEY];
        return key ? t(key) : displayValue(category);
      }} />
      <AdminAssetsRegisterTableSection assets={visible} columns={columns} emptyMessage={t('NO_ASSETS')} tableLabel={t('TITLE')} />

      <Dialog open={showAdd} onOpenChange={(open) => { if (open) setShowAdd(true); else requestCloseAdd(); }}>
        <DialogContent className="space-y-4">
          <div className="flex items-center justify-between gap-3"><DialogTitle className="text-section-title font-semibold text-text-primary">{t('ADD_TITLE')}</DialogTitle><button type="button" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-card text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={t('CLOSE_DIALOG')} onClick={requestCloseAdd}><X size={18} strokeWidth={2} aria-hidden="true" /></button></div>
          <DialogDescription className="text-sm text-text-secondary">{t('ADD_DESCRIPTION')}</DialogDescription>
          <form className="space-y-4" onSubmit={handleAdd} noValidate>
            <div><label className="block text-sm font-medium text-text-secondary" htmlFor="asset-name">{t('ASSET_NAME')}</label><input id="asset-name" required className="mt-1 min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder={t('ASSET_PLACEHOLDER')} aria-invalid={Boolean(form.formState.errors.name)} aria-describedby={form.formState.errors.name ? 'asset-name-error' : undefined} {...form.register('name')} />{form.formState.errors.name && <p id="asset-name-error" className="mt-1 text-caption text-danger-text" role="alert">{form.formState.errors.name.message}</p>}</div>
            <div><label className="block text-sm font-medium text-text-secondary" htmlFor="asset-category">{t('CATEGORY')}</label><select id="asset-category" className="mt-1 min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" required aria-invalid={Boolean(form.formState.errors.category)} aria-describedby={form.formState.errors.category ? 'asset-category-error' : undefined} {...form.register('category')}>{ADMIN_ASSETS_REGISTER_CATEGORY_OPTIONS.map((category) => { const key = ADMIN_ASSETS_REGISTER_CATEGORY_TRANSLATION_KEY[category]; return <option key={category} value={category}>{t(key)}</option>; })}</select>{form.formState.errors.category && <p id="asset-category-error" className="mt-1 text-caption text-danger-text" role="alert">{form.formState.errors.category.message}</p>}</div>
            <div><label className="block text-sm font-medium text-text-secondary" htmlFor="asset-date">{t('PURCHASE_DATE')}</label><input id="asset-date" type="date" required className="mt-1 min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-invalid={Boolean(form.formState.errors.purchaseDate)} aria-describedby={form.formState.errors.purchaseDate ? 'asset-date-error' : undefined} {...form.register('purchaseDate')} />{form.formState.errors.purchaseDate && <p id="asset-date-error" className="mt-1 text-caption text-danger-text" role="alert">{form.formState.errors.purchaseDate.message}</p>}</div>
            <div><label className="block text-sm font-medium text-text-secondary" htmlFor="asset-value">{t('PURCHASE_VALUE')}</label><input id="asset-value" type="number" min="0.01" step="0.01" required className="mt-1 min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-invalid={Boolean(form.formState.errors.purchaseValue)} aria-describedby={form.formState.errors.purchaseValue ? 'asset-value-error' : undefined} {...form.register('purchaseValue', { valueAsNumber: true })} />{form.formState.errors.purchaseValue && <p id="asset-value-error" className="mt-1 text-caption text-danger-text" role="alert">{form.formState.errors.purchaseValue.message}</p>}</div>
            <div><label className="block text-sm font-medium text-text-secondary" htmlFor="asset-location">{t('LOCATION')}</label><input id="asset-location" required className="mt-1 min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder={t('LOCATION_PLACEHOLDER')} aria-invalid={Boolean(form.formState.errors.location)} aria-describedby={form.formState.errors.location ? 'asset-location-error' : undefined} {...form.register('location')} />{form.formState.errors.location && <p id="asset-location-error" className="mt-1 text-caption text-danger-text" role="alert">{form.formState.errors.location.message}</p>}</div>
            <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-4"><button type="button" className="min-h-11 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={requestCloseAdd}>{t('CANCEL')}</button><button type="submit" className="min-h-11 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" disabled={!isDemoMode || form.formState.isSubmitting} title={!isDemoMode ? t('CREATE_BLOCKED') : undefined}>{form.formState.isSubmitting ? t('SAVING') : t('SAVE')}</button></div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <DialogContent className="space-y-4"><DialogTitle className="text-section-title font-semibold text-text-primary">{t('UNSAVED_CHANGES_TITLE')}</DialogTitle><DialogDescription className="text-sm text-text-secondary">{t('UNSAVED_CHANGES_DESCRIPTION')}</DialogDescription><div className="flex flex-wrap justify-end gap-3"><button type="button" className="min-h-11 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => { setShowDiscardDialog(false); setPendingHref(null); }}>{t('KEEP_EDITING')}</button><button type="button" className="min-h-11 rounded-md bg-danger px-4 py-2 text-sm font-semibold text-on-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={discardAndNavigate}>{t('DISCARD_CHANGES')}</button></div></DialogContent>
      </Dialog>

      <AdminAssetsRegisterDeleteConfirmationDialog open={pendingDelete !== null} title={t('DELETE_TITLE')} description={pendingDelete ? t('DELETE_DESCRIPTION', { name: displayValue(pendingDelete.name) }) : ''} confirmLabel={t('DELETE')} cancelLabel={t('CANCEL')} onCancel={() => setPendingDelete(null)} onConfirm={handleDelete} />
    </div>
  );
}

export default AdminAssetsRegisterPage;

// Responsibility: explicit confirmation for removing an asset from transient demo state.
'use client';

export function AdminAssetsRegisterDeleteConfirmationDialog({ open, title, description, confirmLabel, cancelLabel, onConfirm, onCancel }: AdminAssetsRegisterDeleteConfirmationDialogProps) {
  const handleOpenChange = useCallback((nextOpen: boolean) => { if (!nextOpen) onCancel(); }, [onCancel]);
  return <Dialog open={open} onOpenChange={handleOpenChange}><DialogContent className="space-y-4"><DialogTitle className="text-section-title font-semibold text-text-primary">{title}</DialogTitle><DialogDescription className="text-sm text-text-secondary">{description}</DialogDescription><DialogFooter><button type="button" className="min-h-11 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={onCancel}>{cancelLabel}</button><button type="button" className="min-h-11 rounded-md bg-danger px-4 py-2 text-sm font-medium text-on-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={onConfirm}>{confirmLabel}</button></DialogFooter></DialogContent></Dialog>;
}

export type { AdminAssetsRegisterDeleteConfirmationDialogProps };
