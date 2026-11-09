'use client';
// Responsibility: AdminSettingsBranchesCreateBranchSection component owned by admin_settings_branches.

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Building2, MapPin, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import useAdminSettingsBranchesUnsavedChangesGuard from '@/app/frontend_admin/admin_settings/settings_branches/hooks/useAdminSettingsBranchesUnsavedChangesGuard';
import { createAdminBranchesCreateFormSchema, type AdminBranchesCreateFormValues } from '@/app/frontend_admin/admin_settings/settings_branches/schemas/AdminSettingsBranchesSchema';
import type { AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionMAINDASHBOARDVIEWSSectionCreateNewBranchSectionProps } from '@/app/frontend_admin/admin_settings/settings_branches/types/AdminSettingsBranchesComponentTypes';

const EMPTY_VALUES: AdminBranchesCreateFormValues = { name: '', code: '', address: '', phone: '', email: '' };

export function AdminSettingsBranchesCreateBranchSection({
  model,
}: AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionMAINDASHBOARDVIEWSSectionCreateNewBranchSectionProps) {
  const t = useTranslations('ADMIN_BRANCHES');
  const router = useRouter();
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const schema = useMemo(() => createAdminBranchesCreateFormSchema({
    nameRequired: t('VALIDATION_BRANCH_NAME_REQUIRED'), nameTooShort: t('VALIDATION_BRANCH_NAME_MIN'), nameTooLong: t('VALIDATION_BRANCH_NAME_MAX'),
    codeRequired: t('VALIDATION_BRANCH_CODE_REQUIRED'), codeInvalid: t('VALIDATION_BRANCH_CODE_FORMAT'), codeTooLong: t('VALIDATION_BRANCH_CODE_MAX'),
    addressRequired: t('VALIDATION_BRANCH_ADDRESS_REQUIRED'), addressTooLong: t('VALIDATION_BRANCH_ADDRESS_MAX'),
    phoneInvalid: t('VALIDATION_BRANCH_PHONE_INVALID'), phoneTooLong: t('VALIDATION_BRANCH_PHONE_MAX'),
    emailInvalid: t('VALIDATION_BRANCH_EMAIL_INVALID'), emailTooLong: t('VALIDATION_BRANCH_EMAIL_MAX'),
  }), [t]);

  const form = useForm<AdminBranchesCreateFormValues>({ resolver: zodResolver(schema), defaultValues: EMPTY_VALUES, mode: 'onBlur' });
  const errors = form.formState.errors;
  const handleBlockedNavigation = useCallback((href: string) => { setPendingHref(href); setShowDiscardDialog(true); }, []);
  useAdminSettingsBranchesUnsavedChangesGuard(form.formState.isDirty, handleBlockedNavigation, form.formState.isSubmitting);

  const requestBack = () => { if (form.formState.isDirty) { setPendingHref(null); setShowDiscardDialog(true); return; } model.setActiveTab('all'); };
  const discardDraft = () => { const destination = pendingHref; form.reset(EMPTY_VALUES); setPendingHref(null); setShowDiscardDialog(false); if (destination) router.push(destination); else model.setActiveTab('all'); };
  if (model.viewingBranch || model.activeTab !== 'create') return null;

  const submit = form.handleSubmit((values) => {
    const result = model.createDemoBranch(values);
    if (result === 'created') {
      toast.success(t('CREATE_DEMO_SUCCESS', { name: values.name.trim() }), { id: 'admin_settings-settings_branches-components-AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionMAINDASHBOARDVIEWSSectionCreateNewBranchSection-toast-35-1' });
      form.reset(EMPTY_VALUES);
      model.setActiveTab('all');
    } else if (result === 'duplicate-code') {
      toast.error(t('CREATE_DUPLICATE_CODE'), { id: 'admin_settings-settings_branches-components-AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionMAINDASHBOARDVIEWSSectionCreateNewBranchSection-toast-39-2' });
    } else {
      toast.info(t('CREATE_UNAVAILABLE'), { id: 'admin_settings-settings_branches-components-AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionMAINDASHBOARDVIEWSSectionCreateNewBranchSection-toast-41-3' });
    }
  });

  return (
    <section className="rounded-lg border border-border bg-card p-6 shadow-card" aria-labelledby="admin-branches-create-title">
      <div className="mb-5 flex items-center gap-3">
        <Building2 size={22} strokeWidth={2} aria-hidden="true" />
        <div>
          <h2 id="admin-branches-create-title" className="text-section-title font-semibold text-text-primary">{t('CREATE_TITLE')}</h2>
          <p id="admin-branches-create-unavailable" className="mt-1 text-sm text-text-secondary" role="status">{model.isDemoMode ? t('CREATE_DEMO_DESCRIPTION') : t('CREATE_UNAVAILABLE')}</p>
        </div>
      </div>
      <form onSubmit={submit} noValidate>
        <fieldset disabled={!model.isDemoMode} aria-describedby="admin-branches-create-unavailable" className={`grid gap-4 sm:grid-cols-2 ${!model.isDemoMode ? 'opacity-70' : ''}`}>
          <legend className="sr-only">{t('CREATE_FORM_LABEL')}</legend>
          <div className="grid gap-1">
            <label className="grid gap-1 text-sm text-text-secondary" htmlFor="admin-branches-create-name">
              {t('FIELD_BRANCH_NAME')}
              <input id="admin-branches-create-name" className="min-h-11 rounded-md border border-border bg-input px-3 text-text-primary" autoComplete="organization" maxLength={120} required {...form.register('name')} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'admin-branches-create-name-error' : undefined} />
            </label>
            {errors.name && <p id="admin-branches-create-name-error" className="text-sm text-danger-text" role="alert">{errors.name.message}</p>}
          </div>
          <div className="grid gap-1">
            <label className="grid gap-1 text-sm text-text-secondary" htmlFor="admin-branches-create-code">
              {t('FIELD_BRANCH_CODE')}
              <input id="admin-branches-create-code" className="min-h-11 rounded-md border border-border bg-input px-3 text-text-primary uppercase" maxLength={32} required {...form.register('code')} aria-invalid={Boolean(errors.code)} aria-describedby={errors.code ? 'admin-branches-create-code-error' : undefined} />
            </label>
            {errors.code && <p id="admin-branches-create-code-error" className="text-sm text-danger-text" role="alert">{errors.code.message}</p>}
          </div>
          <div className="grid gap-1 sm:col-span-2">
            <label className="grid gap-1 text-sm text-text-secondary" htmlFor="admin-branches-create-address">
              <span className="flex items-center gap-2"><MapPin size={16} aria-hidden="true" /> {t('FIELD_ADDRESS')}</span>
              <input id="admin-branches-create-address" className="min-h-11 rounded-md border border-border bg-input px-3 text-text-primary" autoComplete="street-address" maxLength={240} required {...form.register('address')} aria-invalid={Boolean(errors.address)} aria-describedby={errors.address ? 'admin-branches-create-address-error' : undefined} />
            </label>
            {errors.address && <p id="admin-branches-create-address-error" className="text-sm text-danger-text" role="alert">{errors.address.message}</p>}
          </div>
          <div className="grid gap-1">
            <label className="grid gap-1 text-sm text-text-secondary" htmlFor="admin-branches-create-phone">
              <span className="flex items-center gap-2"><Phone size={16} aria-hidden="true" /> {t('FIELD_PHONE')}</span>
              <input
                id="admin-branches-create-phone"
                className="min-h-11 rounded-md border border-border bg-input px-3 text-text-primary font-mono"
                type="tel"
                autoComplete="tel"
                maxLength={10}
                placeholder="10-digit mobile"
                required
                {...form.register('phone', {
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  },
                })}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? 'admin-branches-create-phone-error' : undefined}
              />
            </label>
            {errors.phone && <p id="admin-branches-create-phone-error" className="text-sm text-danger-text" role="alert">{errors.phone.message}</p>}
          </div>
          <div className="grid gap-1">
            <label className="grid gap-1 text-sm text-text-secondary" htmlFor="admin-branches-create-email">
              <span className="flex items-center gap-2"><Mail size={16} aria-hidden="true" /> {t('FIELD_EMAIL')}</span>
              <input id="admin-branches-create-email" className="min-h-11 rounded-md border border-border bg-input px-3 text-text-primary" type="email" autoComplete="email" maxLength={254} required {...form.register('email')} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'admin-branches-create-email-error' : undefined} />
            </label>
            {errors.email && <p id="admin-branches-create-email-error" className="text-sm text-danger-text" role="alert">{errors.email.message}</p>}
          </div>
        </fieldset>
        <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
          <button type="submit" disabled={!model.isDemoMode || form.formState.isSubmitting} aria-describedby="admin-branches-create-unavailable" className="min-h-11 rounded-md bg-primary px-4 py-2 font-medium text-on-primary disabled:cursor-not-allowed disabled:opacity-60">{model.isDemoMode ? t('CREATE_ACTION') : t('CREATE_ACTION_UNAVAILABLE')}</button>
          <button type="button" className="min-h-11 rounded-md border border-border px-4 py-2 text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={requestBack}>{t('BACK_TO_BRANCHES')}</button>
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
    </section>
  );
}

export default AdminSettingsBranchesCreateBranchSection;

