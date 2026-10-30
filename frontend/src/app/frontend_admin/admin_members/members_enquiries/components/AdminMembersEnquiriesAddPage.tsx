'use client';
// Responsibility: AdminEnquiriesAddPage component owned by admin_enquiries; responsibility folder: admin_enquiries_components_views.

import useAdminMembersEnquiriesUnsavedChangesGuard from '@/app/frontend_admin/admin_members/members_enquiries/hooks/useAdminMembersEnquiriesUnsavedChangesGuard';
import { ADMIN_ENQUIRIES_URLS } from '@/app/frontend_admin/admin_members/members_enquiries/config/admin_members_enquiries.url_config';

// RESPONSIBILITY: Entry page for the admin_enquiries module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PhoneCall, Save, X } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { createAdminEnquiriesAddEnquirySchema, type AddEnquiryFormData } from '@/app/frontend_admin/admin_members/members_enquiries/schemas/AdminMembersEnquiriesSchema';
import { ADMIN_ENQUIRIES_ENQUIRY_SOURCE_OPTIONS } from '@/app/frontend_admin/admin_members/members_enquiries/config/admin_members_enquiries.url_config';
import { addEnquiry } from '@/app/frontend_admin/admin_members/members_enquiries/hooks/useAdminMembersEnquiriesPage';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { ADMIN_MEMBERS_ENQUIRIES_HARDCODED_FIXTURE as adminEnquiriesFixtureData } from '@/app/frontend_admin/admin_members/members_enquiries/mocks/scenarios/admin_members_enquiries.scenarios';



export function AdminEnquiriesAddPage() {
  const t = useTranslations('ADMIN_ENQUIRIES');
  const formSchema = useMemo(() => createAdminEnquiriesAddEnquirySchema((key) => t(key)), [t]);
  const router = useRouter();
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const drawerRef = useRef<HTMLElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const isDemoMode = isFrontendDemoModeEnabled();
  const data = isDemoMode ? adminEnquiriesFixtureData : { staff: [], shifts: [] };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<AddEnquiryFormData>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: '',
      phone: '',
      preferredShift: '',
      source: undefined,
      handledBy: '',
      notes: '',
    },
  });

  const nameRegistration = register('name');
  const handleBlockedNavigation = useCallback((href: string) => { setPendingNavigation(href); setConfirmDiscard(true); }, []);
  useAdminMembersEnquiriesUnsavedChangesGuard(isDirty, isSubmitting, handleBlockedNavigation);


  const onSubmit = async (formData: AddEnquiryFormData) => {
    if (!isDemoMode) {
      toast.error(t('LEAD_CREATE_BLOCKED'), { id: 'admin_members-members_enquiries-components-AdminMembersEnquiriesAddPage-toast-62-1' });
      return;
    }
    try {
      addEnquiry({
        name: formData.name,
        phone: formData.phone,
        shift: formData.preferredShift || 'Morning',
        status: 'New',
        source: formData.source || undefined,
        notes: formData.notes?.trim() || undefined,
        handledBy: formData.handledBy || 'Admin'
      });
    } catch {
      toast.error(t('LEAD_SAVE_FAILED'), { id: 'admin_members-members_enquiries-components-AdminMembersEnquiriesAddPage-save-error' });
      return;
    }
    toast.info(t('DEMO_SAVE_NOTICE'), { id: 'admin_members-members_enquiries-components-AdminMembersEnquiriesAddPage-toast-74-2', className: 'border border-border bg-card text-text-primary shadow-toast border-success-bg bg-success-bg text-success-text' });
    router.push(ADMIN_ENQUIRIES_URLS.ENQUIRIES);
  };

  const handleClose = useCallback(() => { if (isDirty && !isSubmitting) { setConfirmDiscard(true); return; } router.push(ADMIN_ENQUIRIES_URLS.ENQUIRIES); }, [isDirty, isSubmitting, router]);
  const discardDraft = () => { setConfirmDiscard(false); const destination = pendingNavigation; setPendingNavigation(null); router.push(destination ?? ADMIN_ENQUIRIES_URLS.ENQUIRIES); };

  useEffect(() => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    firstFieldRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
        return;
      }
      if (event.key !== 'Tab' || !drawerRef.current) return;
      const focusable = Array.from(drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )).filter((element) => element.getAttribute('aria-hidden') !== 'true');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [handleClose]);

  if (!isFrontendDemoModeEnabled()) return <section className="space-y-3 rounded-lg border border-warning-bg bg-card p-6"><h1 className="text-section-title font-semibold text-text-primary">{t('CREATE_TITLE')}</h1><p role="status" className="text-warning-text">{t('CREATE_NOTICE')}</p><button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border px-3.5 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-primary hover:bg-surface-hover" onClick={handleClose}>{t('BACK_TO_ENQUIRIES')}</button></section>;

  return (
    <>
      <Toaster position="bottom-right" />

      {/* ── Overlay ── */}
      <button
        type="button"
        className="fixed inset-0 z-40 flex items-end justify-center bg-overlay-backdrop p-0 sm:items-center sm:p-4"
        onClick={handleClose}
        aria-label={t('CLOSE_DRAWER')}
        tabIndex={-1}
      />

      {/* ── Drawer ── */}
      <aside ref={drawerRef} data-testid="admin_enquiries-page-control-001" className="flex max-h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-xl border border-border bg-overlay shadow-dialog sm:max-h-[88dvh] sm:rounded-xl" role="dialog" aria-labelledby="admin-crm-enquiry-drawer-title" aria-describedby="admin-crm-enquiry-drawer-description" aria-modal="true">

        <div className="flex items-start justify-between gap-4 border-b border-border p-4 sm:p-6">
          <div className="flex min-w-0 items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary"><PhoneCall size={18} className="text-text-primary" strokeWidth={2} aria-hidden="true" /></div><div><h2 id="admin-crm-enquiry-drawer-title" className="text-section-title font-semibold text-text-primary">{t('NEW_ENQUIRY')}</h2><p id="admin-crm-enquiry-drawer-description" className="mt-1 text-body text-text-secondary">{t('PREVIEW_FORM_NOTICE')}</p></div></div>
          <button data-testid="admin_enquiries-page-control-002" type="button" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-card text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" onClick={handleClose} title={t('CLOSE')} aria-label={t('CLOSE_DRAWER')}><X size={18} strokeWidth={2} aria-hidden="true" /></button>
        </div>

        {/* Body — Form */}
        <form data-testid="admin_enquiries-page-control-003" id="add-enquiry-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="min-h-0 overflow-y-auto p-4 sm:p-6">
            <div className="grid gap-4">

              {/* ── Name ── */}
              <div className="grid min-w-0 gap-1">
                <label htmlFor="enq-name" className="text-body font-medium text-text-primary after:ml-0.5 after:text-danger-text after:content-['*']">
                  {t('FULL_NAME')}
                </label>
                <input
                  id="enq-name"
                  type="text"
                  placeholder={t('NAME_PLACEHOLDER')}
                  className={`min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary${errors.name ? ' border-danger-text focus-visible:ring-danger-text' : ''}`}
                  {...nameRegistration}
                  ref={(node) => { nameRegistration.ref(node); firstFieldRef.current = node; }}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'enq-name-error' : undefined}
                  autoComplete="name"
                />
                {errors.name && <p id="enq-name-error" data-testid="admin_enquiries-page-state-004" className="rounded-lg border border-danger-bg bg-danger-bg p-3 text-body text-danger-text" role="alert">{errors.name.message}</p>}
              </div>

              {/* ── Phone ── */}
              <div className="grid min-w-0 gap-1">
                <label htmlFor="enq-phone" className="text-body font-medium text-text-primary after:ml-0.5 after:text-danger-text after:content-['*']">
                  {t('MOBILE_NUMBER')}
                </label>
                <div className="flex min-w-0 items-center gap-2">
                  <span className="inline-flex min-h-11 shrink-0 items-center rounded-md border border-border bg-surface-zebra px-3 text-body text-text-secondary">+91</span>
                  <input
                    id="enq-phone"
                    type="tel"
                    maxLength={10}
                    placeholder={t('MOBILE_PLACEHOLDER')}
                    className={`min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pl-3${errors.phone ? ' border-danger-text focus-visible:ring-danger-text' : ''}`}
                    {...register('phone')}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'enq-phone-error' : undefined}
                    autoComplete="tel"
                    inputMode="numeric"
                  />
                </div>
                {errors.phone && <p id="enq-phone-error" data-testid="admin_enquiries-page-state-005" className="rounded-lg border border-danger-bg bg-danger-bg p-3 text-body text-danger-text" role="alert">{errors.phone.message}</p>}
              </div>

              {/* ── Preferred Shift ── */}
              <div className="grid min-w-0 gap-1">
                <label htmlFor="enq-shift" className="text-body font-medium text-text-primary">
                  {t('PREFERRED_SHIFT')} <span className="text-caption font-normal text-text-secondary">({t('OPTIONAL')})</span>
                </label>
                <select data-testid="admin_enquiries-page-control-006"
                  id="enq-shift"
                  className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  {...register('preferredShift')}
                >
                  <option value="">{t('SELECT_SHIFT')}</option>
                  {data.shifts.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.time})
                    </option>
                  ))}
                </select>
              </div>

              {/* ── Source ── */}
              <div className="grid min-w-0 gap-1">
                <label htmlFor="enq-source" className="text-body font-medium text-text-primary">
                  {t('SOURCE')} <span className="text-caption font-normal text-text-secondary">({t('OPTIONAL')})</span>
                </label>
                <select data-testid="admin_enquiries-page-control-007"
                  id="enq-source"
                  className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  {...register('source')}
                >
                  <option value="">{t('SOURCE_PROMPT')}</option>
                  {ADMIN_ENQUIRIES_ENQUIRY_SOURCE_OPTIONS.map((source) => (
                    <option key={source.value} value={source.value}>{t(`SOURCE_${source.value.toUpperCase().replace(/[^A-Z]+/g, '_')}`)}</option>
                  ))}
                </select>
              </div>

              {/* ── Handled By ── */}
              <div className="grid min-w-0 gap-1">
                <label htmlFor="enq-handled-by" className="text-body font-medium text-text-primary">
                  {t('HANDLED_BY')} <span className="text-caption font-normal text-text-secondary">({t('OPTIONAL')})</span>
                </label>
                <select data-testid="admin_enquiries-page-control-008"
                  id="enq-handled-by"
                  className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  {...register('handledBy')}
                >
                  <option value="">{t('ASSIGN_STAFF')}</option>
                  {data.staff.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* ── Notes ── */}
              <div className="grid min-w-0 gap-1">
                <label htmlFor="enq-notes" className="text-body font-medium text-text-primary">
                  {t('NOTES')} <span className="text-caption font-normal text-text-secondary">({t('OPTIONAL')})</span>
                </label>
                <textarea
                  id="enq-notes"
                  rows={3}
                  placeholder={t('NOTES_PLACEHOLDER')}
                  className="min-h-24 w-full min-w-0 resize-y rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  {...register('notes')}
                />
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-wrap justify-end gap-2 border-t border-border p-4 sm:p-6">
            <button data-testid="admin_enquiries-page-control-009"
              type="button"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-body font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 flex-1"
              onClick={handleClose}
            >
              {t('CANCEL')}
            </button>
            <button data-testid="admin_enquiries-page-control-010"
              type="submit"
              form="add-enquiry-form"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-body font-semibold text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 flex-[2]"
              disabled={!isDemoMode || isSubmitting}
              title={!isDemoMode ? t('LEAD_CREATE_BLOCKED') : undefined}
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block h-5 w-5 rounded-full border-2 border-border border-t-primary motion-safe:animate-spin" />
                  {t('SAVING')}
                </>
              ) : (
                <>
                  <Save size={18}  strokeWidth={2}/>
                  {t('SAVE_LEAD')}
                </>
              )}
            </button>
          </div>
        </form>
        {confirmDiscard && <div role="alertdialog" aria-modal="true" aria-labelledby="admin-enquiries-discard-title" className="rounded-xl border border-border bg-overlay p-5 shadow-dialog"><h2 id="admin-enquiries-discard-title">{t('UNSAVED_CHANGES_TITLE')}</h2><p>{t('UNSAVED_CHANGES_DESCRIPTION')}</p><div className="mt-4 flex gap-2"><button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-body font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" onClick={() => { setConfirmDiscard(false); setPendingNavigation(null); }}>{t('KEEP_EDITING')}</button><button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-body font-semibold text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" onClick={discardDraft}>{t('DISCARD_CHANGES')}</button></div></div>}
      </aside>
    </>
  );
}
