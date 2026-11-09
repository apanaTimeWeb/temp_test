'use client';
// RESPONSIBILITY: Owns the validated member-create and member-edit form lifecycle for the directory page.

import { useCallback, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { UserPlus } from 'lucide-react';
import useAdminMembersDirectoryUnsavedChangesGuard from '@/app/frontend_admin/admin_members/members_directory/hooks/useAdminMembersDirectoryUnsavedChangesGuard';
import { AdminMembersCreateSchema, type AdminMembersCreateFormValues, type AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import type { AdminMembersDirectoryMemberFormProps } from '@/app/frontend_admin/admin_members/members_directory/types/AdminMembersDirectoryComponentTypes';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { ADMIN_MEMBERS_PLAN_OPTIONS, ADMIN_MEMBERS_SHIFT_OPTIONS } from '@/app/frontend_admin/admin_members/members_directory/constants/AdminMembersDirectoryFormConstants';

export default function AdminMembersDirectoryMemberForm({ model }: AdminMembersDirectoryMemberFormProps) {
  const t = useTranslations('ADMIN_MEMBERS');
  const router = useRouter();
  const { branches } = useAdminBranch();
  const editingMember: AdminMembersMember | null = model.editingMember;
  const isEditing = editingMember !== null;
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  const branchOptions = useMemo(() => {
    return branches.map((b) => ({ value: b.name, label: b.name }));
  }, [branches]);

  const defaults = editingMember
    ? {
        name: editingMember.name,
        email: editingMember.email,
        phone: editingMember.phone,
        plan: editingMember.plan,
        branch: editingMember.branch || '',
        shift: editingMember.shift || '',
        seat: editingMember.seat || '',
        locker: editingMember.locker || '',
      }
    : { name: '', email: '', phone: '', plan: '', branch: '', shift: '', seat: '', locker: '' };

  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty }, reset } = useForm<AdminMembersCreateFormValues>({
    resolver: zodResolver(AdminMembersCreateSchema),
    defaultValues: defaults,
    mode: 'onBlur',
  });

  useEffect(() => {
    reset(defaults);
    setConfirmDiscard(false);
  }, [editingMember?.id, editingMember?.name, editingMember?.email, editingMember?.phone, editingMember?.plan, model.activeTab, reset]);

  const handleBlockedNavigation = useCallback((href: string) => {
    setPendingNavigation(href);
    setConfirmDiscard(true);
  }, []);

  useAdminMembersDirectoryUnsavedChangesGuard(
    isDirty && (isEditing || (!model.viewingMember && model.activeTab === 'add')),
    isSubmitting,
    handleBlockedNavigation,
  );

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
    'VALIDATION.MEMBER_NAME_TOO_SHORT': t('VALIDATION.MEMBER_NAME_TOO_SHORT'),
    'VALIDATION.MEMBER_NAME_TOO_LONG': t('VALIDATION.MEMBER_NAME_TOO_LONG'),
    'VALIDATION.MEMBER_EMAIL_INVALID': t('VALIDATION.MEMBER_EMAIL_INVALID'),
    'VALIDATION.MEMBER_EMAIL_TOO_LONG': t('VALIDATION.MEMBER_EMAIL_TOO_LONG'),
    'VALIDATION.MEMBER_PHONE_TOO_SHORT': t('VALIDATION.MEMBER_PHONE_TOO_SHORT'),
    'VALIDATION.MEMBER_PHONE_TOO_LONG': t('VALIDATION.MEMBER_PHONE_TOO_LONG'),
    'VALIDATION.MEMBER_PLAN_REQUIRED': t('VALIDATION.MEMBER_PLAN_REQUIRED'),
    'VALIDATION.MEMBER_PLAN_TOO_LONG': t('VALIDATION.MEMBER_PLAN_TOO_LONG'),
  };
  const validationMessage = (message?: string) => message ? validationMessages[message] ?? t('VALIDATION.UNKNOWN') : '';

  const submit = handleSubmit((values) => {
    const cleanedValues: AdminMembersCreateFormValues = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      plan: values.plan,
      ...(values.branch?.trim() ? { branch: values.branch.trim() } : {}),
      ...(values.shift?.trim() ? { shift: values.shift.trim() } : {}),
      ...(values.seat?.trim() ? { seat: values.seat.trim() } : {}),
      ...(values.locker?.trim() ? { locker: values.locker.trim() } : {}),
    };
    if (editingMember) model.handleSaveDemoMember(editingMember, cleanedValues);
    else model.handleAddMember(cleanedValues);
  });

  const renderFormFields = (isEditMode: boolean) => {
    const prefix = isEditMode ? 'admin-members-edit' : 'admin-members-create';
    return (
      <>
        <div className="grid gap-1 text-sm">
          <label htmlFor={`${prefix}-name`}>{t('FULL_NAME')}</label>
          <input id={`${prefix}-name`} className="admin-input" autoComplete="name" maxLength={120} aria-invalid={Boolean(errors.name)} {...register('name')} />
          {errors.name && <p className="text-sm text-danger-text" role="alert">{validationMessage(errors.name.message)}</p>}
        </div>
        <div className="grid gap-1 text-sm">
          <label htmlFor={`${prefix}-email`}>{t('EMAIL')}</label>
          <input id={`${prefix}-email`} className="admin-input" type="email" autoComplete="email" maxLength={254} aria-invalid={Boolean(errors.email)} {...register('email')} />
          {errors.email && <p className="text-sm text-danger-text" role="alert">{validationMessage(errors.email.message)}</p>}
        </div>
        <div className="grid gap-1 text-sm">
          <label htmlFor={`${prefix}-phone`}>{t('PHONE')}</label>
          <input
            id={`${prefix}-phone`}
            className="admin-input font-mono"
            type="tel"
            autoComplete="tel"
            maxLength={10}
            placeholder="10-digit mobile"
            aria-invalid={Boolean(errors.phone)}
            {...register('phone', {
              onChange: (e) => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
              },
            })}
          />
          {errors.phone && <p className="text-sm text-danger-text" role="alert">{validationMessage(errors.phone.message)}</p>}
        </div>
        <div className="grid gap-1 text-sm">
          <label htmlFor={`${prefix}-plan`}>{t('MEMBERSHIP_PLAN')}</label>
          <input id={`${prefix}-plan`} list={`plan-opts-${prefix}`} className="admin-input" maxLength={120} aria-invalid={Boolean(errors.plan)} placeholder="Select or type plan..." {...register('plan')} />
          <datalist id={`plan-opts-${prefix}`}>{ADMIN_MEMBERS_PLAN_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</datalist>
          {errors.plan && <p className="text-sm text-danger-text" role="alert">{validationMessage(errors.plan.message)}</p>}
        </div>
        <div className="grid gap-1 text-sm">
          <label htmlFor={`${prefix}-seat`}>Seat No. (Optional)</label>
          <input id={`${prefix}-seat`} className="admin-input" placeholder="e.g. S-12" maxLength={50} {...register('seat')} />
        </div>
        <div className="grid gap-1 text-sm">
          <label htmlFor={`${prefix}-shift`}>Shift (Optional)</label>
          <input id={`${prefix}-shift`} list={`shift-opts-${prefix}`} className="admin-input" placeholder="e.g. Morning (6AM - 12PM)" maxLength={100} {...register('shift')} />
          <datalist id={`shift-opts-${prefix}`}>{ADMIN_MEMBERS_SHIFT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</datalist>
        </div>
        <div className="grid gap-1 text-sm">
          <label htmlFor={`${prefix}-branch`}>Branch (Optional)</label>
          <input id={`${prefix}-branch`} list={`branch-opts-${prefix}`} className="admin-input" placeholder="e.g. Main Branch" maxLength={100} {...register('branch')} />
          <datalist id={`branch-opts-${prefix}`}>{branchOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</datalist>
        </div>
        <div className="grid gap-1 text-sm">
          <label htmlFor={`${prefix}-locker`}>Locker No. (Optional)</label>
          <input id={`${prefix}-locker`} className="admin-input" placeholder="e.g. L-04" maxLength={50} {...register('locker')} />
        </div>
      </>
    );
  };

  if (isEditing && editingMember) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-overlay-backdrop p-4">
        <section className="admin-card w-full max-w-2xl bg-overlay p-6" role="dialog" aria-modal="true" aria-labelledby="admin-members-edit-title">
          <h2 id="admin-members-edit-title" className="text-lg font-semibold">{t('MEMBER_EDIT_TITLE')}</h2>
          <p className="mt-2 text-sm text-text-secondary">{t('MEMBER_EDIT_FORM_NOTICE')}</p>
          <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={submit} noValidate>
            {renderFormFields(true)}
            <div className="sm:col-span-2 flex flex-wrap gap-2 pt-2">
              <button type="submit" className="admin-btn-primary min-h-11" disabled={isSubmitting}>{t('SAVE_DEMO_CHANGES')}</button>
              <button type="button" className="admin-btn-ghost min-h-11" onClick={requestCancel}>{t('CANCEL')}</button>
            </div>
          </form>
          {confirmDiscard && (
            <div role="alertdialog" aria-modal="true" aria-labelledby="admin-members-discard-title" className="mt-4 rounded-lg border border-warning-bg bg-card p-4">
              <h3 id="admin-members-discard-title" className="font-semibold text-text-primary">{t('UNSAVED_CHANGES_TITLE')}</h3>
              <p className="mt-2 text-text-secondary">{t('UNSAVED_CHANGES_DESCRIPTION')}</p>
              <div className="mt-4 flex justify-end gap-2">
                <button type="button" className="admin-btn-ghost min-h-11" onClick={() => { setConfirmDiscard(false); setPendingNavigation(null); }}>{t('KEEP_EDITING')}</button>
                <button type="button" className="admin-btn-danger min-h-11" onClick={discardDraft}>{t('DISCARD_CHANGES')}</button>
              </div>
            </div>
          )}
        </section>
      </div>
    );
  }

  if (model.viewingMember || model.activeTab !== 'add') return null;

  return (
    <section className="admin-card p-6" aria-labelledby="admin-members-add-title">
      <div className="mb-5 flex items-center gap-3">
        <UserPlus size={20} strokeWidth={2} aria-hidden="true"/>
        <div>
          <h2 id="admin-members-add-title">{t('ADD_MEMBER_TITLE')}</h2>
          <p className="text-sm text-text-secondary">{model.isDemoMode ? t('FORM_NOTICE_DEMO') : t('FORM_NOTICE')}</p>
        </div>
      </div>
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={submit} noValidate>
        {renderFormFields(false)}
        <div className="sm:col-span-2 flex flex-wrap gap-2 pt-2">
          <button className="admin-btn-primary min-h-11" type="submit" disabled={isSubmitting}>{t('VALIDATE_DETAILS')}</button>
          <button className="admin-btn-ghost min-h-11" type="button" onClick={requestCancel}>{t('CANCEL')}</button>
        </div>
      </form>
      {confirmDiscard && (
        <div role="alertdialog" aria-modal="true" aria-labelledby="admin-members-add-discard-title" className="mt-4 rounded-lg border border-warning-bg bg-card p-4">
          <h3 id="admin-members-add-discard-title" className="font-semibold text-text-primary">{t('UNSAVED_CHANGES_TITLE')}</h3>
          <p className="mt-2 text-text-secondary">{t('UNSAVED_CHANGES_DESCRIPTION')}</p>
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <button type="button" className="admin-btn-ghost min-h-11" onClick={() => { setConfirmDiscard(false); setPendingNavigation(null); }}>{t('KEEP_EDITING')}</button>
            <button type="button" className="admin-btn-danger min-h-11" onClick={discardDraft}>{t('DISCARD_CHANGES')}</button>
          </div>
        </div>
      )}
    </section>
  );
}

export type { AdminMembersDirectoryMemberFormProps };
