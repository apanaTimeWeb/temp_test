'use client';
// Responsibility: AdminEnquiriesAddPage component owned by admin_enquiries; responsibility folder: admin_enquiries_components_views.

import useAdminMembersEnquiriesUnsavedChangesGuard from '@/app/frontend_admin/admin_members/members_enquiries/hooks/useAdminMembersEnquiriesUnsavedChangesGuard';
import { ADMIN_ENQUIRIES_URLS } from '@/app/frontend_admin/admin_members/members_enquiries/config/admin_members_enquiries.url_config';
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
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { SearchableCombobox, type ComboboxOption } from '@/components/ui/combobox/SearchableCombobox';

const STANDARD_SHIFTS_COMBOBOX: ComboboxOption[] = [
  { value: 'Morning', label: 'Morning (06:00 - 12:00)', badge: 'M' },
  { value: 'Afternoon', label: 'Afternoon (12:00 - 17:00)', badge: 'A' },
  { value: 'Evening', label: 'Evening (17:00 - 22:00)', badge: 'E' },
  { value: 'Night', label: 'Night (22:00 - 06:00)', badge: 'N' },
  { value: 'Full Day', label: 'Full Day 24/7 (06:00 - 22:00+)', badge: 'FD' },
];

export function AdminEnquiriesAddPage() {
  const t = useTranslations('ADMIN_ENQUIRIES');
  const formSchema = useMemo(() => createAdminEnquiriesAddEnquirySchema((key) => t(key)), [t]);
  const router = useRouter();
  const { branches, selectedBranch } = useAdminBranch();
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const drawerRef = useRef<HTMLElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const isDemoMode = isFrontendDemoModeEnabled();
  const data = isDemoMode ? adminEnquiriesFixtureData : { staff: [], shifts: [] };

  const branchOptions: ComboboxOption[] = useMemo(() => {
    return branches.map((b) => ({
      value: b.name,
      label: b.name,
      subLabel: b.city ? `${b.code} · ${b.city}` : b.code,
    }));
  }, [branches]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<AddEnquiryFormData>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: '',
      phone: '',
      preferredShift: '',
      preferredBranch: selectedBranch?.name || 'Downtown Central',
      source: undefined,
      handledBy: '',
      notes: '',
    },
  });

  const selectedPreferredBranch = watch('preferredBranch') || '';
  const selectedPreferredShift = watch('preferredShift') || '';
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
        handledBy: formData.handledBy || 'Admin',
        preferredBranch: formData.preferredBranch || selectedBranch?.name || 'Downtown Central',
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
      if (event.key === 'Escape') { event.preventDefault(); handleClose(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay-backdrop backdrop-blur-sm motion-safe:transition-opacity animate-in fade-in" onClick={handleClose}>
        <aside
          ref={(node) => { drawerRef.current = node; }}
          className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="enq-drawer-title"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex min-w-0 items-center justify-between border-b border-border p-4 sm:p-6">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary">
                <PhoneCall size={20} />
              </span>
              <div className="min-w-0">
                <h2 id="enq-drawer-title" className="text-section-title font-semibold text-text-primary truncate">
                  {t('NEW_ENQUIRY')}
                </h2>
                <p className="text-caption text-text-secondary truncate">{t('FILL_STUDENT_DETAILS')}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-card text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <form id="add-enquiry-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
                  autoComplete="name"
                />
                {errors.name && <p className="text-body text-danger-text" role="alert">{errors.name.message}</p>}
              </div>

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
                    className={`min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary${errors.phone ? ' border-danger-text' : ''}`}
                    {...register('phone', {
                      onChange: (e) => {
                        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      },
                    })}
                    aria-invalid={Boolean(errors.phone)}
                    autoComplete="tel"
                  />
                </div>
                {errors.phone && <p className="text-body text-danger-text" role="alert">{errors.phone.message}</p>}
              </div>

              {/* Branch Selection */}
              <div className="grid min-w-0 gap-1">
                <label className="text-body font-medium text-text-primary">Target Branch</label>
                <SearchableCombobox
                  options={branchOptions}
                  value={selectedPreferredBranch}
                  onChange={(val) => setValue('preferredBranch', val, { shouldDirty: true })}
                  placeholder="Select branch for enquiry..."
                  searchPlaceholder="Search branches..."
                />
              </div>

              {/* Preferred Shift */}
              <div className="grid min-w-0 gap-1">
                <label className="text-body font-medium text-text-primary">
                  {t('PREFERRED_SHIFT')} <span className="text-caption font-normal text-text-secondary">({t('OPTIONAL')})</span>
                </label>
                <SearchableCombobox
                  options={STANDARD_SHIFTS_COMBOBOX}
                  value={selectedPreferredShift}
                  onChange={(val) => setValue('preferredShift', val, { shouldDirty: true })}
                  placeholder={t('SELECT_SHIFT')}
                  searchPlaceholder="Search shift options..."
                />
              </div>

              {/* Source */}
              <div className="grid min-w-0 gap-1">
                <label htmlFor="enq-source" className="text-body font-medium text-text-primary">
                  {t('SOURCE')} <span className="text-caption font-normal text-text-secondary">({t('OPTIONAL')})</span>
                </label>
                <select
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

              {/* Handled By */}
              <div className="grid min-w-0 gap-1">
                <label htmlFor="enq-handled-by" className="text-body font-medium text-text-primary">
                  {t('HANDLED_BY')} <span className="text-caption font-normal text-text-secondary">({t('OPTIONAL')})</span>
                </label>
                <select
                  id="enq-handled-by"
                  className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  {...register('handledBy')}
                >
                  <option value="">{t('ASSIGN_STAFF')}</option>
                  {data.staff.map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
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
            </form>
          </div>

          {/* Footer */}
          <div className="flex flex-wrap justify-end gap-2 border-t border-border p-4 sm:p-6">
            <button type="button" className="admin-btn-ghost min-h-11" onClick={handleClose}>{t('CANCEL')}</button>
            <button form="add-enquiry-form" type="submit" disabled={isSubmitting} className="admin-btn-primary min-h-11 inline-flex items-center gap-2">
              <Save size={16} /> {isSubmitting ? t('SAVING') : t('SAVE_LEAD')}
            </button>
          </div>
        </aside>
      </div>

      {confirmDiscard && (
        <div role="alertdialog" aria-modal="true" aria-labelledby="discard-title" className="fixed inset-0 z-60 flex items-center justify-center bg-overlay-backdrop p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-overlay p-6 shadow-dialog">
            <h3 id="discard-title" className="text-section-title font-semibold text-text-primary">{t('DISCARD_TITLE')}</h3>
            <p className="mt-2 text-body text-text-secondary">{t('DISCARD_MESSAGE')}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" className="admin-btn-ghost min-h-11" onClick={() => { setConfirmDiscard(false); setPendingNavigation(null); }}>{t('CONTINUE_EDITING')}</button>
              <button type="button" className="admin-btn-danger min-h-11" onClick={discardDraft}>{t('DISCARD_BUTTON')}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default AdminEnquiriesAddPage;
