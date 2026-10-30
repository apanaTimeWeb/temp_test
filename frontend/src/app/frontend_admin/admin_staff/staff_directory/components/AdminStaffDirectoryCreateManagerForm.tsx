'use client';
// RESPONSIBILITY: AdminStaffDirectoryCreateManagerForm component owned by admin_staff_directory; responsibility folder: admin_staff_directory_create_manager_form.

import { Camera, UserPlus } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createAdminStaffDirectoryCreateManagerSchema, type AdminStaffDirectoryCreateManagerFormValues } from '@/app/frontend_admin/admin_staff/staff_directory/schemas/AdminStaffDirectorySchema';
import { ADMIN_STAFF_DIRECTORY_INITIAL_STATUS_OPTIONS, ADMIN_STAFF_DIRECTORY_DEMO_BRANCH_OPTIONS } from '@/app/frontend_admin/admin_staff/staff_directory/config/admin_staff_directory.url_config';
import { toast } from 'sonner';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import useAdminStaffDirectoryUnsavedChangesGuard from '@/app/frontend_admin/admin_staff/staff_directory/hooks/useAdminStaffDirectoryUnsavedChangesGuard';
import type { AdminStaffDirectoryCreateManagerFormProps } from '@/app/frontend_admin/admin_staff/staff_directory/types/AdminStaffDirectoryComponentTypes';


/**
 * Validates and adds a user-entered manager to local demo state only; no credential is generated or delivered.
 */
export default function AdminStaffDirectoryCreateManagerForm({ onCreate, canCreate }: AdminStaffDirectoryCreateManagerFormProps) {
  const t = useTranslations('ADMIN_STAFF_DIRECTORY');
  const router = useRouter();
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const schema = useMemo(() => createAdminStaffDirectoryCreateManagerSchema({
    nameRequired: t('VALIDATION_NAME_REQUIRED'),
    nameTooLong: t('VALIDATION_NAME_TOO_LONG'),
    usernameTooShort: t('VALIDATION_USERNAME_TOO_SHORT'),
    usernameTooLong: t('VALIDATION_USERNAME_TOO_LONG'),
    emailInvalid: t('VALIDATION_EMAIL'),
    phoneInvalid: t('VALIDATION_PHONE'),
    phoneTooLong: t('VALIDATION_PHONE_TOO_LONG'),
    branchRequired: t('VALIDATION_BRANCH'),
  }), [t]);
  const form = useForm<AdminStaffDirectoryCreateManagerFormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: { fullName: '', username: '', email: '', phone: '', passwordSetup: 'auto', branchId: '' as unknown as 'b1', initialStatus: 'Active' },
    mode: 'onBlur',
  });
  const errors = form.formState.errors;
  const handleBlockedNavigation = useCallback((href: string) => { setPendingHref(href); setShowDiscardDialog(true); }, []);
  useAdminStaffDirectoryUnsavedChangesGuard(form.formState.isDirty, handleBlockedNavigation, form.formState.isSubmitting);
  const discardDraft = () => { const destination = pendingHref; form.reset(); setPendingHref(null); setShowDiscardDialog(false); if (destination) router.push(destination); };

  return (
    <div className="admin-card p-8" >
      <h2 className="admin-shared-section-title" >{t('FORM_TITLE')}</h2>
      <p className="px-5 pb-3 text-sm text-warning-text" role="status">{canCreate ? t('FORM_DESCRIPTION') : t('CREATE_BLOCKED_TOAST')}</p>
      <form data-testid="admin_staff_directory-AdminStaffDirectoryCreateManagerForm-form-001" onSubmit={form.handleSubmit((values) => { const result = onCreate(values); if (result === 'created') { toast.success(t('DEMO_MANAGER_CREATED', { name: values.fullName.trim() }), { id: 'admin_staff-staff_directory-components-AdminStaffDirectoryCreateManagerForm-toast-44-1' }); form.reset(); } else if (result === 'duplicate') { toast.error(t('DEMO_MANAGER_DUPLICATE'), { id: 'admin_staff-staff_directory-components-AdminStaffDirectoryCreateManagerForm-toast-44-2' }); } else { toast.info(t('CREATE_BLOCKED_TOAST'), { id: 'admin_staff-staff_directory-components-AdminStaffDirectoryCreateManagerForm-toast-44-3' }); } })} noValidate className="admin-shared-stack" >
        <div className="flex items-center gap-6" >
          <div className="flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center rounded-full border border-dashed border-border bg-floating" ><Camera size={18} strokeWidth={2} aria-hidden="true" /></div>
          <div><div className="text-sm font-semibold text-primary" >{t('PHOTO_TITLE')}</div><div className="text-xs text-text-secondary" >{t('PHOTO_UNAVAILABLE')}</div></div>
        </div>

        <div className="admin-shared-card-grid" >
          <div>
            <label htmlFor="admin-staff-users-full-name" className="admin-label">{t('FULL_NAME')}</label>
            <input id="admin-staff-users-full-name" type="text" autoComplete="name" className="admin-input" required placeholder={t('FULL_NAME_PLACEHOLDER')} {...form.register('fullName')} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? 'admin-staff-users-full-name-error' : undefined} />
            {errors.fullName && <p id="admin-staff-users-full-name-error" className="admin-error" role="alert">{errors.fullName.message}</p>}
          </div>
          <div>
            <label htmlFor="admin-staff-users-username" className="admin-label">{t('USERNAME')}</label>
            <input id="admin-staff-users-username" type="text" autoComplete="username" className="admin-input" required placeholder={t('USERNAME_PLACEHOLDER')} {...form.register('username')} aria-invalid={Boolean(errors.username)} aria-describedby={errors.username ? 'admin-staff-users-username-error' : undefined} />
            {errors.username && <p id="admin-staff-users-username-error" className="admin-error" role="alert">{errors.username.message}</p>}
          </div>
        </div>

        <div className="admin-shared-card-grid" >
          <div>
            <label htmlFor="admin-staff-users-email" className="admin-label">{t('EMAIL')}</label>
            <input id="admin-staff-users-email" type="email" autoComplete="email" className="admin-input" required placeholder={t('EMAIL_PLACEHOLDER')} {...form.register('email')} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'admin-staff-users-email-error' : undefined} />
            {errors.email && <p id="admin-staff-users-email-error" className="admin-error" role="alert">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="admin-staff-users-phone" className="admin-label">{t('PHONE')}</label>
            <input id="admin-staff-users-phone" type="tel" inputMode="tel" autoComplete="tel" className="admin-input" required placeholder={t('PHONE_PLACEHOLDER')} {...form.register('phone')} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'admin-staff-users-phone-error' : undefined} />
            {errors.phone && <p id="admin-staff-users-phone-error" className="admin-error" role="alert">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="admin-shared-card-grid" >
          <div>
            <label htmlFor="admin-staff-users-password-setup" className="admin-label">{t('PASSWORD_SETUP')}</label>
            <select id="admin-staff-users-password-setup" className="admin-input" required {...form.register('passwordSetup')}>
              <option value="auto">{t('PASSWORD_SETUP_PREVIEW')}</option>
            </select>
          </div>
          <div>
            <label htmlFor="admin-staff-users-branch" className="admin-label">{t('BRANCH_ASSIGNMENT')}</label>
            <select id="admin-staff-users-branch" className="admin-input" required {...form.register('branchId')} aria-invalid={Boolean(errors.branchId)} aria-describedby={errors.branchId ? 'admin-staff-users-branch-error' : undefined}>
              <option value="">{t('SELECT_BRANCH')}</option>
              {ADMIN_STAFF_DIRECTORY_DEMO_BRANCH_OPTIONS.map((branch) => <option key={branch.id} value={branch.id}>{branch.id === 'b1' ? t('BRANCH_DOWNTOWN') : t('BRANCH_WESTSIDE')}</option>)}
            </select>
            {errors.branchId && <p id="admin-staff-users-branch-error" className="admin-error" role="alert">{errors.branchId.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="admin-staff-users-status" className="admin-label">{t('INITIAL_STATUS')}</label>
          <select id="admin-staff-users-status" className="admin-input" required {...form.register('initialStatus')}>
            {ADMIN_STAFF_DIRECTORY_INITIAL_STATUS_OPTIONS.map((status) => <option key={status} value={status}>{(status === 'Active' ? t('STATUS_ACTIVE') : t('STATUS_SUSPENDED'))}</option>)}
          </select>
        </div>

        <div className="mt-4 flex justify-end" >
          <button type="submit" className="admin-btn-primary" disabled={form.formState.isSubmitting}><UserPlus size={18} strokeWidth={2} aria-hidden="true"/> {t('CREATE_MANAGER_DEMO')}</button>
        </div>
      </form>
      <Dialog open={showDiscardDialog} onOpenChange={(open) => { if (!open) { setShowDiscardDialog(false); setPendingHref(null); } }}>
        <DialogContent className="space-y-4">
          <DialogTitle>{t('UNSAVED_CHANGES_TITLE')}</DialogTitle>
          <DialogDescription>{t('UNSAVED_CHANGES_DESCRIPTION')}</DialogDescription>
          <DialogFooter>
            <button type="button" className="min-h-11 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => { setShowDiscardDialog(false); setPendingHref(null); }}>{t('UNSAVED_CHANGES_STAY')}</button>
            <button type="button" className="min-h-11 rounded-md bg-danger px-4 py-2 text-sm font-semibold text-on-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={discardDraft}>{t('UNSAVED_CHANGES_LEAVE')}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


export type { AdminStaffDirectoryCreateManagerFormProps };
