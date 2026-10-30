'use client';
// RESPONSIBILITY: AdminAssetsMaintenancePage component owned by admin_accounting; responsibility folder: admin_accounting_components_views.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import type { DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import AdminAccountingMaintenanceSummarySection from '@/app/frontend_admin/admin_accounts_assets/assets_maintenance/components/AdminAssetsMaintenanceSummarySection';
import AdminAccountingMaintenanceFilterSection, { type AdminAccountingMaintenanceStatusFilter } from '@/app/frontend_admin/admin_accounts_assets/assets_maintenance/components/AdminAssetsMaintenanceFilterSection';
import AdminAccountingMaintenanceTableSection from '@/app/frontend_admin/admin_accounts_assets/assets_maintenance/components/AdminAssetsMaintenanceTableSection';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { createAdminAccountingMaintenanceFormSchema, type AdminAccountingMaintenanceFormValues, type AdminAccountingMaintenanceValidationKey } from '@/app/frontend_admin/admin_accounts_assets/assets_maintenance/schemas/AdminAssetsMaintenanceFormSchemas';
import { ADMIN_ACCOUNTING_MAINTENANCE_FIXTURES } from '@/app/frontend_admin/admin_accounts_assets/assets_maintenance/mocks/scenarios/admin_assets_maintenance.scenarios';
import type { AdminAccountingMaintenanceLog } from '@/app/frontend_admin/admin_accounts_assets/assets_maintenance/types/AdminAssetsMaintenanceTypes';
import { formatAdminAccountingCurrency, toAdminAccountingMinorUnits } from '@/app/frontend_admin/admin_accounts_assets/assets_maintenance/utils/AdminAssetsMaintenanceFormatCurrency';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import useAdminAssetsMaintenanceUnsavedChangesGuard from '@/app/frontend_admin/admin_accounts_assets/assets_maintenance/hooks/useAdminAssetsMaintenanceUnsavedChangesGuard';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';

const STATUS_BADGE = { pending: 'bg-warning-bg text-warning-text border-warning-bg', 'in-progress': 'bg-info-bg text-info-text border-info-bg', completed: 'bg-success-bg text-success-text border-success-bg' } as const;
const STATUS_OPTIONS = ['all', 'pending', 'in-progress', 'completed'] as const;
const STATUS_TRANSLATION_KEYS = {
  pending: 'PENDING',
  'in-progress': 'IN_PROGRESS',
  completed: 'COMPLETED',
} as const;

/**
 * Renders asset maintenance records, status filtering, and maintenance actions. Dependencies: module-owned maintenance data and status options. Edge cases: empty filtered results and unknown maintenance states must remain understandable.
 */
export function AdminAssetsMaintenancePage() {
  const locale = useLocale();
  const t = useTranslations('ADMIN_ACCOUNTING.MAINTENANCE');
  const isDemoMode = isFrontendDemoModeEnabled();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status');
  const [logs, setLogs] = useState<AdminAccountingMaintenanceLog[]>(isDemoMode ? [...ADMIN_ACCOUNTING_MAINTENANCE_FIXTURES] : []);
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_OPTIONS)[number]>(STATUS_OPTIONS.includes(initialStatus as (typeof STATUS_OPTIONS)[number]) ? initialStatus as (typeof STATUS_OPTIONS)[number] : 'all');
  const [showAdd, setShowAdd] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const schema = useMemo(() => createAdminAccountingMaintenanceFormSchema((key: AdminAccountingMaintenanceValidationKey) => t(key)), [t]);
  const form = useForm<AdminAccountingMaintenanceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { assetName: '', issue: '', reportedDate: '', scheduledDate: '', vendor: '', cost: 0 },
  });

  useEffect(() => {
    const nextStatus = searchParams.get('status');
    const normalized = STATUS_OPTIONS.includes(nextStatus as (typeof STATUS_OPTIONS)[number]) ? nextStatus as (typeof STATUS_OPTIONS)[number] : 'all';
    if (normalized !== statusFilter) setStatusFilter(normalized);
  }, [searchParams, statusFilter]);

  const updateStatusFilter = (value: (typeof STATUS_OPTIONS)[number]) => {
    setStatusFilter(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') params.delete('status'); else params.set('status', value);
    router.replace(`${pathname}${params.size ? `?${params.toString()}` : ''}`, { scroll: false });
  };

  const visible = statusFilter === 'all' ? logs : logs.filter((log) => log.status === statusFilter);
  const totalCost = logs.filter((log) => log.status === 'completed').reduce((sum, log) => sum + log.cost, 0);
  const columns: DataGridColumn<AdminAccountingMaintenanceLog>[] = [
    { field: 'assetName', headerName: t('ASSET'), sortable: true },
    { field: 'issue', headerName: t('ISSUE'), sortable: true },
    { field: 'reportedDate', headerName: t('REPORTED'), sortable: true },
    { field: 'scheduledDate', headerName: t('SCHEDULED'), sortable: true },
    { field: 'vendor', headerName: t('VENDOR'), sortable: true },
    { field: 'cost', headerName: t('COST'), sortable: true, valueFormatter: ({ value }) => formatAdminAccountingCurrency(Number(value ?? 0), locale) },
    { field: 'status', headerName: t('STATUS'), sortable: true, cellRenderer: ({ value }) => {
      const status = String(value ?? '');
      const labelKey = STATUS_TRANSLATION_KEYS[status as keyof typeof STATUS_TRANSLATION_KEYS];
      return <span className={`inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap ${STATUS_BADGE[status as keyof typeof STATUS_BADGE] ?? 'bg-card text-text-secondary border-border'}`}>{labelKey ? t(labelKey) : (status || '—')}</span>;
    } },
    { headerName: t('ACTION'), sortable: false, cellRenderer: ({ data }) => data.status !== 'completed' ? <button type="button" aria-label={t('MARK_COMPLETE', { asset: data.assetName })} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-transparent bg-success px-4 py-2 text-body font-semibold text-on-success hover:bg-success focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:transition-colors motion-safe:duration-base disabled:cursor-not-allowed disabled:opacity-50" disabled={!isDemoMode} title={!isDemoMode ? t('UPDATE_BLOCKED') : undefined} onClick={() => handleComplete(data.id)}>
<CheckCircle size={18} strokeWidth={2} /> {t('DONE')}</button> : <span className="text-text-secondary">{t('COMPLETE_LABEL')}</span> },
  ];

  const handleBlockedNavigation = useCallback((href: string) => { setPendingHref(href); setShowDiscardDialog(true); }, []);
  useAdminAssetsMaintenanceUnsavedChangesGuard(showAdd && form.formState.isDirty, handleBlockedNavigation, form.formState.isSubmitting);
  const requestClose = () => {
    if (form.formState.isDirty) { setPendingHref(null); setShowDiscardDialog(true); return; }
    form.reset();
    setShowAdd(false);
  };
  const discardDraft = () => {
    const destination = pendingHref;
    form.reset();
    setPendingHref(null);
    setShowDiscardDialog(false);
    setShowAdd(false);
    if (destination) router.push(destination);
  };

  const handleComplete = (id: number) => {
    if (!isDemoMode) { toast.error(t('UPDATE_BLOCKED'), { id: 'admin_accounts_assets-assets_maintenance-components-AdminAssetsMaintenancePage-toast-85-1' }); return; }
    setLogs((current) => current.map((log) => log.id === id ? { ...log, status: 'completed' } : log));
    toast.info(t('DEMO_UPDATED'), { id: 'admin_accounts_assets-assets_maintenance-components-AdminAssetsMaintenancePage-toast-87-2' });
  };

  const handleAdd = form.handleSubmit((values) => {
    if (!isDemoMode) { toast.error(t('CREATE_BLOCKED'), { id: 'admin_accounts_assets-assets_maintenance-components-AdminAssetsMaintenancePage-toast-91-3' }); return; }
    setLogs((current) => [{
      id: Date.now(), assetName: values.assetName, issue: values.issue, reportedDate: values.reportedDate,
      scheduledDate: values.scheduledDate, vendor: values.vendor || t('NO_VENDOR'), cost: toAdminAccountingMinorUnits(values.cost), status: 'pending',
    }, ...current]);
    toast.info(t('DEMO_CREATED'), { id: 'admin_accounts_assets-assets_maintenance-components-AdminAssetsMaintenancePage-toast-96-4' });
    form.reset();
    setShowAdd(false);
  });

  return <div className="space-y-6">
    {!isDemoMode && <p role="status" className="rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('LIVE_UNAVAILABLE')}</p>}
    <div className="flex items-center justify-between gap-4">
<div>
<h1 className="text-page-title font-bold text-text-primary">{t('TITLE')}</h1>
<p className="mt-1 text-body text-text-secondary">{t('SUBTITLE')}</p>
</div>
<button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-transparent bg-primary px-4 py-2 text-body font-semibold text-on-primary hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" disabled={!isDemoMode} title={!isDemoMode ? t('CREATE_BLOCKED') : undefined} onClick={() => setShowAdd(true)}>
<Plus size={18} strokeWidth={2} /> {t('LOG_REQUEST')}</button>
</div>
    <AdminAccountingMaintenanceSummarySection
      logs={logs}
      totalCostLabel={formatAdminAccountingCurrency(totalCost, locale)}
      labels={{ pending: t('PENDING'), inProgress: t('IN_PROGRESS'), completed: t('COMPLETED'), totalCost: t('TOTAL_COST') }}
    />
    <AdminAccountingMaintenanceFilterSection
      label={t('FILTER_STATUS')}
      allLabel={t('ALL_STATUS')}
      options={STATUS_OPTIONS}
      value={statusFilter}
      onChange={updateStatusFilter}
      getStatusLabel={(status) => t(STATUS_TRANSLATION_KEYS[status])}
    />
    <AdminAccountingMaintenanceTableSection logs={visible} columns={columns} emptyMessage={t('NO_RECORDS')} tableLabel={t('TITLE')} />
    <Dialog open={showAdd} onOpenChange={(open) => { if (open) setShowAdd(true); else if (showDiscardDialog) { setShowDiscardDialog(false); setPendingHref(null); } else requestClose(); }}>
      <DialogContent className="admin-dialog-viewport--wide">
        {showDiscardDialog ? (<>
          <DialogTitle>{t('UNSAVED_CHANGES_TITLE')}</DialogTitle>
          <DialogDescription>{t('UNSAVED_CHANGES_DESCRIPTION')}</DialogDescription>
          <DialogFooter>
            <button type="button" className="min-h-11 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => { setShowDiscardDialog(false); setPendingHref(null); }}>{t('UNSAVED_CHANGES_STAY')}</button>
            <button type="button" className="min-h-11 rounded-md bg-danger px-4 py-2 text-sm font-semibold text-on-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={discardDraft}>{t('UNSAVED_CHANGES_LEAVE')}</button>
          </DialogFooter>
        </>) : <>
        <div className="flex items-center justify-between">
<DialogTitle className="text-section-title font-bold text-text-primary">{t('DIALOG_TITLE')}</DialogTitle>
<button type="button" className="absolute right-4 top-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-text-secondary hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={t('CLOSE_DIALOG')} onClick={requestClose}>
<X size={18} strokeWidth={2} />
</button>
</div>
        <DialogDescription className="mt-2">{t('DIALOG_DESCRIPTION')}</DialogDescription>
        <form className="mt-4 space-y-3" onSubmit={handleAdd}>
          <div>
<label className="mb-1.5 block text-body font-medium text-text-primary" htmlFor="maintenance-asset">{t('ASSET_NAME')}</label>
<input id="maintenance-asset" required aria-invalid={Boolean(form.formState.errors.assetName)} aria-describedby={form.formState.errors.assetName ? 'maintenance-asset-error' : undefined} className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" {...form.register('assetName')} />{form.formState.errors.assetName && <p id="maintenance-asset-error" role="alert" className="text-danger-text text-caption">{form.formState.errors.assetName.message}</p>}</div>
          <div>
<label className="mb-1.5 block text-body font-medium text-text-primary" htmlFor="maintenance-issue">{t('ISSUE')}</label>
<input id="maintenance-issue" required aria-invalid={Boolean(form.formState.errors.issue)} aria-describedby={form.formState.errors.issue ? 'maintenance-issue-error' : undefined} className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" {...form.register('issue')} />{form.formState.errors.issue && <p id="maintenance-issue-error" role="alert" className="text-danger-text text-caption">{form.formState.errors.issue.message}</p>}</div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
<div>
<label className="mb-1.5 block text-body font-medium text-text-primary" htmlFor="maintenance-reported">{t('REPORTED_DATE')}</label>
<input id="maintenance-reported" type="date" required aria-invalid={Boolean(form.formState.errors.reportedDate)} aria-describedby={form.formState.errors.reportedDate ? 'maintenance-reported-error' : undefined} className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" {...form.register('reportedDate')} />{form.formState.errors.reportedDate && <p id="maintenance-reported-error" role="alert" className="text-danger-text text-caption">{form.formState.errors.reportedDate.message}</p>}</div>
<div>
<label className="mb-1.5 block text-body font-medium text-text-primary" htmlFor="maintenance-scheduled">{t('SCHEDULED_DATE')}</label>
<input id="maintenance-scheduled" type="date" required aria-invalid={Boolean(form.formState.errors.scheduledDate)} aria-describedby={form.formState.errors.scheduledDate ? 'maintenance-scheduled-error' : undefined} className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" {...form.register('scheduledDate')} />{form.formState.errors.scheduledDate && <p id="maintenance-scheduled-error" role="alert" className="text-danger-text text-caption">{form.formState.errors.scheduledDate.message}</p>}</div>
</div>
          <div>
<label className="mb-1.5 block text-body font-medium text-text-primary" htmlFor="maintenance-vendor">{t('VENDOR')}</label>
<input id="maintenance-vendor" className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" {...form.register('vendor')} />
</div>
          <div>
<label className="mb-1.5 block text-body font-medium text-text-primary" htmlFor="maintenance-cost">{t('ESTIMATED_COST')}</label>
<input id="maintenance-cost" type="number" min="0" step="0.01" aria-invalid={Boolean(form.formState.errors.cost)} aria-describedby={form.formState.errors.cost ? 'maintenance-cost-error' : undefined} className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" {...form.register('cost', { valueAsNumber: true })} />{form.formState.errors.cost && <p id="maintenance-cost-error" role="alert" className="text-danger-text text-caption">{form.formState.errors.cost.message}</p>}</div>
          <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-3">
<button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-body font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" onClick={requestClose}>{t('CANCEL')}</button>
<button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-transparent bg-success px-4 py-2 text-body font-semibold text-on-success hover:bg-success focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:transition-colors motion-safe:duration-base disabled:cursor-not-allowed disabled:opacity-50" disabled={!isDemoMode || form.formState.isSubmitting} title={!isDemoMode ? t('CREATE_BLOCKED') : undefined}>{form.formState.isSubmitting ? t('SAVING') : t('SAVE')}</button>
</div>
        </form>
        </>}
      </DialogContent>
    </Dialog>
  </div>;
}
