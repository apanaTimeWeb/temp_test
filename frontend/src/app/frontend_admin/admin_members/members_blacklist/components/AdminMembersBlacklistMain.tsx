import { useMemo, useCallback, useEffect, useState } from 'react';
import { format, isValid, parseISO } from 'date-fns';
import { enIN, hi } from 'date-fns/locale';
import { useLocale, useTranslations } from 'next-intl';
import { AlertOctagon, X, Save } from 'lucide-react';
import { type DataGridColumn, type DataGridCellParams } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import { ADMIN_BLACKLIST_STATUS_VALUES, ADMIN_BLACKLIST_EMPTY_FORM } from '@/app/frontend_admin/admin_members/members_blacklist/config/admin_members_blacklist.url_config';
import type { AdminBlacklistRecord, AdminBlacklistFormDialogProps } from '@/app/frontend_admin/admin_members/members_blacklist/types/AdminMembersBlacklistTypes';
import AdminBlacklistRecordsSection from '@/app/frontend_admin/admin_members/members_blacklist/components/AdminMembersBlacklistRecordsSection';
import { Toaster } from 'sonner';
import useAdminMembersBlacklistState from '@/app/frontend_admin/admin_members/members_blacklist/hooks/useAdminMembersBlacklistState';
import type { AdminBlacklistFormSchemaType } from '@/app/frontend_admin/admin_members/members_blacklist/schemas/AdminMembersBlacklistSchema';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import useAdminMembersBlacklistUnsavedChangesGuard from '@/app/frontend_admin/admin_members/members_blacklist/hooks/useAdminMembersBlacklistUnsavedChangesGuard';

import { useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { createAdminBlacklistFormSchema, type AdminBlacklistFormSchemaType, type AdminBlacklistValidationKey } from '@/app/frontend_admin/admin_members/members_blacklist/schemas/AdminMembersBlacklistSchema';



// RESPONSIBILITY: AdminMembersBlacklistMain component owned by admin_blacklist; responsibility folder: admin_blacklist_components_tables.
'use client';



















/** Safe date-only formatting for the displayed blacklist history. */
export function formatAdminBlacklistDate(value: string | undefined, locale: string): string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return '—';
  const parsed = parseISO(value);
  if (!isValid(parsed) || format(parsed, 'yyyy-MM-dd') !== value) return '—';
  return format(parsed, 'd MMM yyyy', { locale: locale.toLowerCase().startsWith('hi') ? hi : enIN });
}

/** Renders blacklist records and dialogs; query and mutation orchestration belongs to the module hook. */
export default function AdminMembersBlacklistMain() {
  const t = useTranslations('ADMIN_BLACKLIST');
  const locale = useLocale();
  const { isDemoMode, recordsQuery, records, showForm, setShowForm, removeId, setRemoveId, selectedRecord, setSelectedRecord, submit, confirmRemove } = useAdminMembersBlacklistState();

  const columns = useMemo<readonly DataGridColumn<AdminBlacklistRecord>[]>(() => [
    { field: 'name', headerName: t('TABLE_STUDENT'), flex: 2, minWidth: 180 },
    { field: 'reason', headerName: t('TABLE_REASON'), flex: 2.5, minWidth: 220 },
    { field: 'blacklistedBy', headerName: t('TABLE_BLACKLISTED_BY'), flex: 1.5, minWidth: 150 },
    { field: 'blacklistedOn', headerName: t('TABLE_DATE'), flex: 1, minWidth: 120, cellRenderer: ({ value }: DataGridCellParams<AdminBlacklistRecord>) => formatAdminBlacklistDate(typeof value === 'string' ? value : undefined, locale) },
    { field: 'previousSeat', headerName: t('TABLE_PREVIOUS_SEAT'), flex: 0.8, minWidth: 100 },
    { field: 'status', headerName: t('TABLE_STATUS'), flex: 1, minWidth: 120, cellRenderer: ({ value }: DataGridCellParams<AdminBlacklistRecord>) => <span className="admin-badge bg-danger-bg text-danger-text">{value == null || value === ADMIN_BLACKLIST_STATUS_VALUES[0] ? t('STATUS_BLACKLISTED') : String(value)}</span> },
    { headerName: t('TABLE_ACTIONS'), minWidth: 110, sortable: false, cellRenderer: ({ data }) => <button type="button" disabled={!isDemoMode} className="admin-btn-icon min-h-11 min-w-11 disabled:cursor-not-allowed disabled:opacity-50" aria-label={t('REMOVE_ARIA', { name: data.name })} title={!isDemoMode ? t('LIVE_UNAVAILABLE') : undefined} onClick={() => setRemoveId(data.id)}><X size={18} strokeWidth={2} /></button> },
  ], [isDemoMode, t, locale]);

  const errorMessage = recordsQuery.isError ? t('LOAD_ERROR') : null;
  const selectedRecordDetails = selectedRecord ? [
    [t('TABLE_STUDENT'), selectedRecord.name],
    [t('PHONE_LABEL'), selectedRecord.phone],
    [t('TABLE_REASON'), selectedRecord.reason],
    [t('TABLE_BLACKLISTED_BY'), selectedRecord.blacklistedBy],
    [t('TABLE_DATE'), formatAdminBlacklistDate(selectedRecord.blacklistedOn, locale)],
    [t('TABLE_PREVIOUS_SEAT'), selectedRecord.previousSeat],
    [t('TABLE_STATUS'), selectedRecord.status],
  ] : [];

  return (
    <>
      <Toaster position="bottom-right" richColors closeButton />
      <div className="space-y-6">
        <div className="space-y-3">
          {!isDemoMode && <p role="status" className="rounded-lg border border-warning-bg bg-warning-bg p-4 text-warning-text">{t('LIVE_UNAVAILABLE')}</p>}
          <header className="admin-page-header">
            <div><p className="admin-breadcrumb">{t('BREADCRUMB')}</p><h1 className="admin-page-title">{t('TITLE')}</h1><p className="admin-page-subtitle">{t('SUBTITLE')}</p></div>
            <div className="admin-page-actions"><button type="button" className="admin-btn-danger min-h-11 disabled:cursor-not-allowed disabled:opacity-50" onClick={() => { if (isDemoMode) setShowForm(true); }} disabled={!isDemoMode} title={!isDemoMode ? t('LIVE_UNAVAILABLE') : undefined}><AlertOctagon size={18} strokeWidth={2} /> {t('ADD_ACTION')}</button></div>
          </header>
        </div>
        <AdminBlacklistRecordsSection
          records={records}
          columns={columns}
          isLoading={recordsQuery.isPending}
          isError={recordsQuery.isError}
          errorMessage={errorMessage}
          onRetry={() => { void recordsQuery.refetch(); }}
          onRowClicked={setSelectedRecord}
        />
        {selectedRecord && (
          <section className="rounded-lg border border-border bg-card p-4 sm:p-6" aria-labelledby="admin-blacklist-record-detail-title" aria-live="polite">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 id="admin-blacklist-record-detail-title" className="text-lg font-semibold text-text-primary">{t('DETAILS_TITLE')}</h2>
              <button type="button" className="min-h-11 rounded-md border border-border px-3 py-2 text-primary" onClick={() => setSelectedRecord(null)}>{t('DETAILS_CLOSE')}</button>
            </div>
            <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {selectedRecordDetails.map(([label, value]) => (
                <div key={label} className="min-w-0 rounded-md bg-surface-highlight p-3">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{label}</dt>
                  <dd className="mt-1 break-words text-sm text-text-primary">{value || '—'}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
        <>
          <AdminBlacklistFormDialog open={showForm} onOpenChange={setShowForm} onSubmit={(values: AdminBlacklistFormSchemaType) => submit(values)} isDemoMode={isDemoMode} />
          <Dialog open={removeId !== null} onOpenChange={(open) => { if (!open) setRemoveId(null); }}>
            <DialogContent>
              <DialogTitle className="text-section-title font-semibold text-text-primary">{t('REMOVE_TITLE')}</DialogTitle>
              <DialogDescription className="mt-3">{t(isDemoMode ? 'REMOVE_DEMO_DESCRIPTION' : 'REMOVE_DESCRIPTION')}</DialogDescription>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" className="admin-btn-ghost min-h-11" onClick={() => setRemoveId(null)}>{t('CANCEL')}</button>
                <button type="button" className="admin-btn-danger min-h-11 disabled:cursor-not-allowed disabled:opacity-50" disabled={!isDemoMode} onClick={confirmRemove}>{t('CONFIRM')}</button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      </div>
    </>
  );
}

// RESPONSIBILITY: AdminBlacklistFormDialog component owned by admin_blacklist; responsibility folder: admin_blacklist_form_dialog.
'use client';

















/** Owns localized blacklist form state and accessible validation; does not perform persistence. */
export function AdminBlacklistFormDialog({ open, onOpenChange, onSubmit, isDemoMode }: AdminBlacklistFormDialogProps) {
  const t = useTranslations('ADMIN_BLACKLIST');
  const router = useRouter();
  const schema = useMemo(() => createAdminBlacklistFormSchema((key: AdminBlacklistValidationKey) => t(key)), [t]);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isDirty, isSubmitting } } = useForm<AdminBlacklistFormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: ADMIN_BLACKLIST_EMPTY_FORM,
  });

  useEffect(() => {
    if (!open) reset(ADMIN_BLACKLIST_EMPTY_FORM);
  }, [open, reset]);

  const handleBlockedNavigation = useCallback((href: string) => { setPendingNavigation(href); setConfirmDiscard(true); }, []);
  useAdminMembersBlacklistUnsavedChangesGuard(isDirty && open, isSubmitting, handleBlockedNavigation);

  const requestClose = () => {
    if (isDirty) { setConfirmDiscard(true); return; }
    onOpenChange(false);
  };
  const discardDraft = () => { setConfirmDiscard(false); reset(ADMIN_BLACKLIST_EMPTY_FORM); const destination = pendingNavigation; setPendingNavigation(null); onOpenChange(false); if (destination) router.push(destination); };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (nextOpen) onOpenChange(true); else requestClose(); }}>
      <DialogContent>
        <div className="flex items-center justify-between gap-3">
          <DialogTitle className="text-section-title font-semibold text-text-primary">{t('FORM_TITLE')}</DialogTitle>
          <button type="button" className="admin-btn-icon min-h-11 min-w-11" aria-label={t('CLOSE_FORM')} onClick={requestClose}><X size={18} strokeWidth={2} /></button>
        </div>
        <DialogDescription className="mt-2">{t('FORM_DESCRIPTION')}</DialogDescription>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-blacklist-name" className="admin-label">{t('NAME_LABEL')}</label>
            <input id="admin-blacklist-name" {...register('name')} className="admin-input" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'admin-blacklist-name-error' : undefined} required autoComplete="name" />
            {errors.name && <p id="admin-blacklist-name-error" className="admin-error" role="alert">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="admin-blacklist-phone" className="admin-label">{t('PHONE_LABEL')}</label>
            <input id="admin-blacklist-phone" {...register('phone')} className="admin-input" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'admin-blacklist-phone-error' : undefined} required inputMode="tel" autoComplete="tel" />
            {errors.phone && <p id="admin-blacklist-phone-error" className="admin-error" role="alert">{errors.phone.message}</p>}
          </div>
          <div>
            <label htmlFor="admin-blacklist-reason" className="admin-label">{t('REASON_LABEL')}</label>
            <textarea id="admin-blacklist-reason" {...register('reason')} className="admin-textarea" aria-invalid={Boolean(errors.reason)} aria-describedby={errors.reason ? 'admin-blacklist-reason-error' : undefined} rows={4} required />
            {errors.reason && <p id="admin-blacklist-reason-error" className="admin-error" role="alert">{errors.reason.message}</p>}
          </div>
          <div>
            <label htmlFor="admin-blacklist-seat" className="admin-label">{t('PREVIOUS_SEAT_LABEL')}</label>
            <input id="admin-blacklist-seat" {...register('previousSeat')} className="admin-input" />
          </div>
          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <button type="button" className="admin-btn-ghost min-h-11" onClick={requestClose}>{t('CANCEL')}</button>
            <button type="submit" className="admin-btn-danger min-h-11 disabled:cursor-not-allowed disabled:opacity-50" disabled={isSubmitting || !isDemoMode}><Save size={18} strokeWidth={2} /> {t('SAVE')}</button>
          </div>
        </form>
        {confirmDiscard && <div role="alertdialog" aria-modal="true" aria-labelledby="admin-blacklist-discard-title" className="mt-4 rounded-lg border border-warning-bg bg-card p-4"><h3 id="admin-blacklist-discard-title" className="font-semibold text-text-primary">{t('UNSAVED_CHANGES_TITLE')}</h3><p className="mt-2 text-text-secondary">{t('UNSAVED_CHANGES_DESCRIPTION')}</p><div className="mt-4 flex justify-end gap-2"><button type="button" className="admin-btn-ghost min-h-11" onClick={() => { setConfirmDiscard(false); setPendingNavigation(null); }}>{t('KEEP_EDITING')}</button><button type="button" className="admin-btn-danger min-h-11" onClick={discardDraft}>{t('DISCARD_CHANGES')}</button></div></div>}
      </DialogContent>
    </Dialog>
  );
}


export type { AdminBlacklistFormDialogProps };
