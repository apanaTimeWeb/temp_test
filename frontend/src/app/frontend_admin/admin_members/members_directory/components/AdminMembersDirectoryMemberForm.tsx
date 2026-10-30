// RESPONSIBILITY: Owns the validated member-create and member-edit form lifecycle for the directory page.
'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { UserPlus } from 'lucide-react';
import useAdminMembersDirectoryUnsavedChangesGuard from '@/app/frontend_admin/admin_members/members_directory/hooks/useAdminMembersDirectoryUnsavedChangesGuard';
import useAdminMembersDirectoryMain from '@/app/frontend_admin/admin_members/members_directory/hooks/useAdminMembersDirectoryMain';
import { AdminMembersCreateSchema, type AdminMembersCreateFormValues, type AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import type { AdminMembersDirectoryMemberFormProps } from '@/app/frontend_admin/admin_members/members_directory/types/AdminMembersDirectoryComponentTypes';


export default function AdminMembersDirectoryMemberForm({ model }: AdminMembersDirectoryMemberFormProps) {
  const t = useTranslations('ADMIN_MEMBERS');
  const router = useRouter();
  const editingMember: AdminMembersMember | null = model.editingMember;
  const isEditing = editingMember !== null;
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const defaults = editingMember ? { name: editingMember.name, email: editingMember.email, phone: editingMember.phone, plan: editingMember.plan } : { name: '', email: '', phone: '', plan: '' };
  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty }, reset } = useForm<AdminMembersCreateFormValues>({ resolver: zodResolver(AdminMembersCreateSchema), defaultValues: defaults, mode: 'onBlur' });
  useEffect(() => { reset(defaults); setConfirmDiscard(false); }, [editingMember?.id, editingMember?.name, editingMember?.email, editingMember?.phone, editingMember?.plan, model.activeTab, reset]);
  const handleBlockedNavigation = useCallback((href: string) => { setPendingNavigation(href); setConfirmDiscard(true); }, []);
  useAdminMembersDirectoryUnsavedChangesGuard(isDirty && (isEditing || (!model.viewingMember && model.activeTab === 'add')), isSubmitting, handleBlockedNavigation);
  const requestCancel = () => {
    if (isDirty) { setConfirmDiscard(true); return; }
    reset(defaults);
    if (isEditing) model.setEditingMember(null); else model.setActiveTab('all');
  };
  const discardDraft = () => {
    setConfirmDiscard(false);
    reset(defaults);
    const destination = pendingNavigation;
    setPendingNavigation(null);
    if (destination) { router.push(destination); return; }
    if (isEditing) model.setEditingMember(null); else model.setActiveTab('all');
  };
  const validationMessages: Record<string, string> = {
    'VALIDATION.MEMBER_NAME_TOO_SHORT': t('VALIDATION.MEMBER_NAME_TOO_SHORT'), 'VALIDATION.MEMBER_NAME_TOO_LONG': t('VALIDATION.MEMBER_NAME_TOO_LONG'),
    'VALIDATION.MEMBER_EMAIL_INVALID': t('VALIDATION.MEMBER_EMAIL_INVALID'), 'VALIDATION.MEMBER_EMAIL_TOO_LONG': t('VALIDATION.MEMBER_EMAIL_TOO_LONG'),
    'VALIDATION.MEMBER_PHONE_TOO_SHORT': t('VALIDATION.MEMBER_PHONE_TOO_SHORT'), 'VALIDATION.MEMBER_PHONE_TOO_LONG': t('VALIDATION.MEMBER_PHONE_TOO_LONG'),
    'VALIDATION.MEMBER_PLAN_REQUIRED': t('VALIDATION.MEMBER_PLAN_REQUIRED'), 'VALIDATION.MEMBER_PLAN_TOO_LONG': t('VALIDATION.MEMBER_PLAN_TOO_LONG'),
  };
  const validationMessage = (message?: string) => message ? validationMessages[message] ?? t('VALIDATION.UNKNOWN') : '';
  const submit = handleSubmit((values) => { if (editingMember) model.handleSaveDemoMember(editingMember, values); else model.handleAddMember(values); });
  if (isEditing && editingMember) {
    return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-overlay-backdrop p-4"><section className="admin-card w-full max-w-2xl bg-overlay p-6" role="dialog" aria-modal="true" aria-labelledby="admin-members-edit-title"><h2 id="admin-members-edit-title" className="text-lg font-semibold">{t('MEMBER_EDIT_TITLE')}</h2><p className="mt-2 text-sm text-text-secondary">{t('MEMBER_EDIT_FORM_NOTICE')}</p><form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={submit} noValidate>
      <div className="grid gap-1 text-sm"><label htmlFor="admin-members-edit-name">{t('FULL_NAME')}</label><input id="admin-members-edit-name" className="admin-input" autoComplete="name" maxLength={120} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'admin-members-edit-name-error' : undefined} {...register('name')}/>{errors.name && <p id="admin-members-edit-name-error" role="alert" className="text-sm text-danger-text">{validationMessage(errors.name.message)}</p>}</div>
      <div className="grid gap-1 text-sm"><label htmlFor="admin-members-edit-email">{t('EMAIL')}</label><input id="admin-members-edit-email" className="admin-input" type="email" autoComplete="email" maxLength={254} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'admin-members-edit-email-error' : undefined} {...register('email')}/>{errors.email && <p id="admin-members-edit-email-error" role="alert" className="text-sm text-danger-text">{validationMessage(errors.email.message)}</p>}</div>
      <div className="grid gap-1 text-sm"><label htmlFor="admin-members-edit-phone">{t('PHONE')}</label><input id="admin-members-edit-phone" className="admin-input" type="tel" autoComplete="tel" maxLength={32} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'admin-members-edit-phone-error' : undefined} {...register('phone')}/>{errors.phone && <p id="admin-members-edit-phone-error" role="alert" className="text-sm text-danger-text">{validationMessage(errors.phone.message)}</p>}</div>
      <div className="grid gap-1 text-sm"><label htmlFor="admin-members-edit-plan">{t('MEMBERSHIP_PLAN')}</label><input id="admin-members-edit-plan" className="admin-input" maxLength={120} aria-invalid={Boolean(errors.plan)} aria-describedby={errors.plan ? 'admin-members-edit-plan-error' : undefined} {...register('plan')}/>{errors.plan && <p id="admin-members-edit-plan-error" role="alert" className="text-sm text-danger-text">{validationMessage(errors.plan.message)}</p>}</div>
      <div className="sm:col-span-2 flex flex-wrap gap-2"><button type="submit" className="admin-btn-primary min-h-11" disabled={isSubmitting}>{t('SAVE_DEMO_CHANGES')}</button><button type="button" className="admin-btn-ghost min-h-11" onClick={requestCancel}>{t('CANCEL')}</button></div></form>
      {confirmDiscard && <div role="alertdialog" aria-modal="true" aria-labelledby="admin-members-discard-title" className="mt-4 rounded-lg border border-warning-bg bg-card p-4"><h3 id="admin-members-discard-title" className="font-semibold text-text-primary">{t('UNSAVED_CHANGES_TITLE')}</h3><p className="mt-2 text-text-secondary">{t('UNSAVED_CHANGES_DESCRIPTION')}</p><div className="mt-4 flex justify-end gap-2"><button type="button" className="admin-btn-ghost min-h-11" onClick={() => { setConfirmDiscard(false); setPendingNavigation(null); }}>{t('KEEP_EDITING')}</button><button type="button" className="admin-btn-danger min-h-11" onClick={discardDraft}>{t('DISCARD_CHANGES')}</button></div></div>}</section></div>;
  }
  if (model.viewingMember || model.activeTab !== 'add') return null;
  const errorClassName = 'text-sm text-danger-text';
  return <section className="admin-card p-6" aria-labelledby="admin-members-add-title"><div className="mb-5 flex items-center gap-3"><UserPlus size={20} strokeWidth={2} aria-hidden="true"/><div><h2 id="admin-members-add-title">{t('ADD_MEMBER_TITLE')}</h2><p className="text-sm text-text-secondary">{model.isDemoMode ? t('FORM_NOTICE_DEMO') : t('FORM_NOTICE')}</p></div></div><form className="grid gap-4 sm:grid-cols-2" onSubmit={submit} noValidate>
    <div className="grid gap-1 text-sm"><label htmlFor="admin-members-create-name">{t('FULL_NAME')}</label><input id="admin-members-create-name" className="admin-input" autoComplete="name" maxLength={120} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'admin-members-create-name-error' : undefined} {...register('name')}/>{errors.name && <p id="admin-members-create-name-error" className={errorClassName} role="alert">{validationMessage(errors.name.message)}</p>}</div>
    <div className="grid gap-1 text-sm"><label htmlFor="admin-members-create-email">{t('EMAIL')}</label><input id="admin-members-create-email" className="admin-input" type="email" autoComplete="email" maxLength={254} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'admin-members-create-email-error' : undefined} {...register('email')}/>{errors.email && <p id="admin-members-create-email-error" className={errorClassName} role="alert">{validationMessage(errors.email.message)}</p>}</div>
    <div className="grid gap-1 text-sm"><label htmlFor="admin-members-create-phone">{t('PHONE')}</label><input id="admin-members-create-phone" className="admin-input" type="tel" autoComplete="tel" maxLength={32} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'admin-members-create-phone-error' : undefined} {...register('phone')}/>{errors.phone && <p id="admin-members-create-phone-error" className={errorClassName} role="alert">{validationMessage(errors.phone.message)}</p>}</div>
    <div className="grid gap-1 text-sm"><label htmlFor="admin-members-create-plan">{t('MEMBERSHIP_PLAN')}</label><input id="admin-members-create-plan" className="admin-input" maxLength={120} aria-invalid={Boolean(errors.plan)} aria-describedby={errors.plan ? 'admin-members-create-plan-error' : undefined} {...register('plan')}/>{errors.plan && <p id="admin-members-create-plan-error" className={errorClassName} role="alert">{validationMessage(errors.plan.message)}</p>}</div>
    <div className="sm:col-span-2 flex flex-wrap gap-2"><button className="admin-btn-primary" type="submit" disabled={isSubmitting}>{t('VALIDATE_DETAILS')}</button><button className="admin-btn-ghost" type="button" onClick={requestCancel}>{t('CANCEL')}</button></div></form>
    {confirmDiscard && <div role="alertdialog" aria-modal="true" aria-labelledby="admin-members-add-discard-title" className="mt-4 rounded-lg border border-warning-bg bg-card p-4"><h3 id="admin-members-add-discard-title" className="font-semibold text-text-primary">{t('UNSAVED_CHANGES_TITLE')}</h3><p className="mt-2 text-text-secondary">{t('UNSAVED_CHANGES_DESCRIPTION')}</p><div className="mt-4 flex flex-wrap justify-end gap-2"><button type="button" className="admin-btn-ghost min-h-11" onClick={() => { setConfirmDiscard(false); setPendingNavigation(null); }}>{t('KEEP_EDITING')}</button><button type="button" className="admin-btn-danger min-h-11" onClick={discardDraft}>{t('DISCARD_CHANGES')}</button></div></div>}</section>;
}


export type { AdminMembersDirectoryMemberFormProps };
