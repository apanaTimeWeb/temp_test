import type { AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionProps, AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionMAINDASHBOARDVIEWSSectionProps, AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionMAINDASHBOARDVIEWSSectionCreateNewBranchSectionProps } from '@/app/frontend_admin/admin_settings/settings_branches/types/AdminSettingsBranchesComponentTypes';
import { useTranslations } from 'next-intl';
import useAdminSettingsBranchesMain from '@/app/frontend_admin/admin_settings/settings_branches/hooks/useAdminSettingsBranchesMain';

import { Users, Building2, MapPin, Mail, Phone } from 'lucide-react';
import AdminBranchesListViews from '@/app/frontend_admin/admin_settings/settings_branches/components/AdminSettingsBranchesListViews';
import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import useAdminSettingsBranchesUnsavedChangesGuard from '@/app/frontend_admin/admin_settings/settings_branches/hooks/useAdminSettingsBranchesUnsavedChangesGuard';
import toast from 'sonner';
import { createAdminBranchesCreateFormSchema, type AdminBranchesCreateFormValues } from '@/app/frontend_admin/admin_settings/settings_branches/schemas/AdminSettingsBranchesSchema';

'use client';

// Responsibility: AdminSettingsBranchesViewSIDEBARNAVIGATIONSection component owned by admin_branches; responsibility folder: admin_settings_branches_view_sections.
'use client';

// RESPONSIBILITY: Renders the feature-owned branch navigation and composes the selected branch view.

export default function AdminSettingsBranchesViewSIDEBARNAVIGATIONSection({ model }: AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionProps) {
  const t = useTranslations('ADMIN_BRANCHES');
  const { activeTab, setActiveTab, viewingBranch, detailTab, setDetailTab, mainNav, detailNav } = model;
  return (
    <div className="admin-shared-flex-wrap-row" >
      <nav className="admin-card flex-1 basis-64 p-4 flex flex-col gap-2 md:sticky md:top-6" aria-label={t('PAGE_TITLE')} >
        {!viewingBranch ? mainNav.map((item) => (
          <button type="button" key={item.id} aria-current={activeTab === item.id ? 'page' : undefined}
            onClick={() => setActiveTab(item.id)}
            className={`admin-tab-button admin-tab-button-branch ${activeTab === item.id ? 'admin-tab-button-active' : ''}`}>
            <item.icon size={18} aria-hidden="true" className={activeTab === item.id ? 'text-primary' : 'text-text-secondary'} />
            {t(`NAV_MAIN_${item.id.toUpperCase()}`)}
          </button>
        )) : <>
          <div  className="px-4 py-2 text-xs font-bold uppercase text-text-disabled">{t('DETAIL_NAV_HEADING')}</div>
          {detailNav.map((item) => (
            <button type="button" key={item.id} aria-current={detailTab === item.id ? 'page' : undefined}
              onClick={() => setDetailTab(item.id)}
              className={`admin-tab-button admin-tab-button-branch ${detailTab === item.id ? 'admin-tab-button-active' : ''}`}>
              <item.icon size={18} aria-hidden="true" className={detailTab === item.id ? 'text-primary' : 'text-text-secondary'} />
              {t(`NAV_DETAIL_${item.id.toUpperCase()}`)}
            </button>
          ))}
        </>}
      </nav>
      <AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionMAINDASHBOARDVIEWSSection model={model} />
    </div>
  );
}

export type { AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionProps };

'use client';

// Responsibility: AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionMAINDASHBOARDVIEWSSection component owned by admin_branches; responsibility folder: admin_settings_branches_view_sidebarnavigationsection_sections.
'use client';

// RESPONSIBILITY: Routes the selected branch navigation state to focused feature-owned view sections.

export function AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionMAINDASHBOARDVIEWSSection({ model }: AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionMAINDASHBOARDVIEWSSectionProps) {
  const t = useTranslations('ADMIN_BRANCHES');
  const { activeTab, viewingBranch, setViewingBranch, detailTab } = model;
  const contractNotice = (titleKey: 'DETAIL_OVERVIEW' | 'DETAIL_USERS' | 'DETAIL_RESERVATIONS' | 'DETAIL_REPORTS' | 'DETAIL_AUDIT' | 'DETAIL_SETTINGS' | 'GLOBAL_SETTINGS' | 'GLOBAL_USAGE' | 'COMPARISON_REPORTS', descriptionKey: 'DETAIL_REQUIRED' | 'GLOBAL_SETTINGS_REQUIRED' | 'GLOBAL_USAGE_REQUIRED' | 'REPORTS_REQUIRED') => <section className="admin-card p-5" role="status"><h2 className="font-semibold text-text-primary">{t(titleKey)}</h2><p className="mt-2 text-text-secondary">{t(descriptionKey)}</p></section>;

  return (
    <div className="space-y-4">
      {!viewingBranch && <AdminBranchesListViews model={model} />}
      <AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionMAINDASHBOARDVIEWSSectionCreateNewBranchSection model={model} />
      {!viewingBranch && activeTab === 'managers' && <section className="admin-card p-5"><div className="mb-4 flex items-center gap-3"><Users size={20} strokeWidth={2}/><div><h2>{t('BRANCH_MANAGERS')}</h2><p className="text-sm text-text-secondary">{t('MANAGER_INFO_CONTRACT')}</p></div></div>{model.branches.length === 0 ? <p className="rounded-md border border-border p-4 text-text-secondary" role="status">{t('NO_LIVE_MANAGERS')}</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-surface-highlight text-text-secondary"><tr><th scope="col" className="px-3 py-3">{t('TABLE_BRANCH')}</th><th scope="col" className="px-3 py-3">{t('TABLE_MANAGER')}</th><th scope="col" className="px-3 py-3">{t('TABLE_STATUS')}</th></tr></thead><tbody>{model.branches.map((branch) => <tr key={branch.id} className="border-b border-border"><th scope="row" className="px-3 py-3 font-medium">{branch.name}</th><td className="px-3 py-3">{branch.manager || t('NOT_PROVIDED')}</td><td className="px-3 py-3">{t(branch.status === 'Active' ? 'STATUS_ACTIVE' : branch.status === 'Suspended' ? 'STATUS_SUSPENDED' : 'STATUS_ARCHIVED')}</td></tr>)}</tbody></table></div>}</section>}
      {viewingBranch && detailTab === 'members' && <section className="admin-card p-5"><div className="mb-3 flex items-center gap-3"><Users size={20} strokeWidth={2}/><div><h2>{t('BRANCH_MEMBERS')}</h2><p className="text-sm text-text-secondary">{t('BRANCH_MEMBER_CONTRACT', { name: viewingBranch.name })}</p></div></div><p className="rounded-md border border-warning-bg bg-warning-bg p-4 text-warning-text" role="status">{t('MEMBER_ROSTER_UNAVAILABLE')}</p></section>}
      {viewingBranch && detailTab === 'overview' && <section className="admin-card grid gap-4 p-6 sm:grid-cols-2"><div className="sm:col-span-2 flex items-center gap-3"><Building2 size={18} strokeWidth={2}/><div><h2>{viewingBranch.name}</h2><p className="text-text-secondary">{viewingBranch.code}</p></div></div><div className="flex items-start gap-3"><MapPin size={18} strokeWidth={2}/><div><span className="block text-caption text-text-secondary">{t('FIELD_ADDRESS_LABEL')}</span><span>{viewingBranch.address}</span></div></div><div className="flex items-start gap-3"><Phone size={18} strokeWidth={2}/><div><span className="block text-caption text-text-secondary">{t('FIELD_PHONE_LABEL')}</span><span>{viewingBranch.phone}</span></div></div><div className="flex items-start gap-3"><Mail size={18} strokeWidth={2}/><div><span className="block text-caption text-text-secondary">{t('FIELD_EMAIL_LABEL')}</span><span>{viewingBranch.email}</span></div></div><div><span className="text-text-secondary">{t('LABEL_MANAGER')}</span><p>{viewingBranch.manager}</p></div></section>}
      {viewingBranch && !['overview', 'members'].includes(detailTab) && contractNotice(`DETAIL_${detailTab.toUpperCase()}` as 'DETAIL_USERS' | 'DETAIL_RESERVATIONS' | 'DETAIL_REPORTS' | 'DETAIL_AUDIT' | 'DETAIL_SETTINGS', 'DETAIL_REQUIRED')}
      {!viewingBranch && activeTab === 'settings' && contractNotice('GLOBAL_SETTINGS', 'GLOBAL_SETTINGS_REQUIRED')}
      {!viewingBranch && activeTab === 'usage' && contractNotice('GLOBAL_USAGE', 'GLOBAL_USAGE_REQUIRED')}
      {!viewingBranch && activeTab === 'reports' && contractNotice('COMPARISON_REPORTS', 'REPORTS_REQUIRED')}
      {viewingBranch && <button type="button" className="mb-4 admin-btn-ghost" onClick={() => setViewingBranch(null)}>{t('BACK_TO_BRANCHES')}</button>}
    </div>
  );
}

export type { AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionMAINDASHBOARDVIEWSSectionProps };

// RESPONSIBILITY: AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionMAINDASHBOARDVIEWSSectionCreateNewBranchSection component owned by admin_branches; responsibility folder: admin_settings_branches_view_sidebarnavigationsection_maindashboardviewssection_sections.
'use client';

const EMPTY_VALUES: AdminBranchesCreateFormValues = { name: '', code: '', address: '', phone: '', email: '' };

export function AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionMAINDASHBOARDVIEWSSectionCreateNewBranchSection({ model }: AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionMAINDASHBOARDVIEWSSectionCreateNewBranchSectionProps) {
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
              <input id="admin-branches-create-phone" className="min-h-11 rounded-md border border-border bg-input px-3 text-text-primary" type="tel" autoComplete="tel" maxLength={32} required {...form.register('phone')} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'admin-branches-create-phone-error' : undefined} />
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

export type { AdminSettingsBranchesViewSIDEBARNAVIGATIONSectionMAINDASHBOARDVIEWSSectionCreateNewBranchSectionProps };
