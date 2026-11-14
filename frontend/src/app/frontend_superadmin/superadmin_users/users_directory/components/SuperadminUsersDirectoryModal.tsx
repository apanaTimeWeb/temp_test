'use client';
/** Responsibility: Superadmin Users Modal; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: owning feature event -> local dialog/confirmation state -> typed callback to the owning component; API writes remain contract-gated. */

import { useSuperadminUsersDirectoryValidationMessage } from '@/app/frontend_superadmin/superadmin_users/users_directory/hooks/useSuperadminUsersDirectoryValidationMessage';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Shield, ShieldCheck, X } from 'lucide-react';
import type { SuperadminUsersModalProps } from '@/app/frontend_superadmin/superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes';
import { SUPERADMIN_USERS_DEFAULT_FORM_VALUES, SUPERADMIN_USERS_ROLE_OPTIONS } from '@/app/frontend_superadmin/superadmin_users/users_directory/constants/SuperadminUsersDirectoryConstants';
import { SUPERADMIN_USERS_FORM_SCHEMA, type SuperadminUsersFormValues } from '@/app/frontend_superadmin/superadmin_users/users_directory/schemas/SuperadminUsersDirectorySchema';
import { useTranslations } from 'next-intl';
import { useSuperadminUsersDirectoryUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_users/users_directory/hooks/useSuperadminUsersDirectoryUnsavedChangesGuard';

/** Accessible, schema-validated editor for the preview-only users experience. */
export default function SuperadminUsersDirectoryModal({ showModal, editUser, onClose, handleSave }: SuperadminUsersModalProps) {
  const t = useTranslations('SUPERADMIN_USERS');
  const translateValidationMessage = useSuperadminUsersDirectoryValidationMessage();
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting , isDirty},
  } = useForm<SuperadminUsersFormValues>({
    resolver: zodResolver(SUPERADMIN_USERS_FORM_SCHEMA),
    defaultValues: SUPERADMIN_USERS_DEFAULT_FORM_VALUES,
    mode: 'onBlur',
  });
  const { confirmLeave } = useSuperadminUsersDirectoryUnsavedChangesGuard(isDirty, t('COPY.UNSAVED_CHANGES_WARNING'));
  const confirmLeaveRef = useRef(confirmLeave);
  confirmLeaveRef.current = confirmLeave;
  const isDirtyRef = useRef(isDirty);
  isDirtyRef.current = isDirty;
  const closeRequestPendingRef = useRef(false);
  const requestCloseRef = useRef<() => Promise<void>>(async () => undefined);
  requestCloseRef.current = async () => {
    if (closeRequestPendingRef.current) return;

    // Keep clean-form dismissal synchronous and avoid opening a confirmation dialog.
    if (!isDirtyRef.current) {
      onCloseRef.current();
      return;
    }

    // All dismissal surfaces share this single-flight path while the accessible
    // confirmation dialog is open, so concurrent events cannot close the draft.
    closeRequestPendingRef.current = true;
    try {
      if (await confirmLeaveRef.current()) onCloseRef.current();
    } catch {
      // Fail closed: an unavailable confirmation must never discard a dirty draft.
    } finally {
      closeRequestPendingRef.current = false;
    }
  };

  // Effect contract: manage keyboard focus, Escape/Tab behavior, and focus restoration for the active dialog or drawer; dependency set [editUser, reset, showModal] is the deliberate re-run boundary.
  useEffect(() => {
    if (!showModal) return;
    reset(editUser ? {
      name: editUser.name,
      username: editUser.username,
      email: editUser.email,
      role: editUser.role,
      branch: editUser.branch,
      twoFactor: editUser.twoFactor,
    } : { ...SUPERADMIN_USERS_DEFAULT_FORM_VALUES });
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusFrame = window.requestAnimationFrame(() => firstInputRef.current?.focus());

    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        requestCloseRef.current();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from<HTMLElement>(dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )).filter((element) => element.getAttribute('aria-hidden') !== 'true');
      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener('keydown', handleDialogKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleDialogKeyDown);
      previouslyFocused?.focus();
    };
  }, [editUser, reset, showModal]);

  if (!showModal) return null;

  const onSubmit = handleSubmit((values) => handleSave(values));

  return (
    <div
      className="sa-wizard-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestCloseRef.current();
      }}
    >
      <div
        ref={dialogRef}
        className="sa-wizard-modal sa-wizard-modal--wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="superadmin-user-modal-title"
        aria-describedby="superadmin-user-modal-description"
        tabIndex={-1}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="superadmin-user-modal-title" className="text-lg font-bold text-primary flex items-center gap-2">
            <Shield size={20} aria-hidden="true" className="text-primary" />
            {editUser ? t('COPY.EDIT_USER_CONFIGURATION') : t('COPY.PROVISION_NEW_USER')}
          </h2>
          <button type="button" aria-label={t("COPY.CLOSE_USER_DIALOG")} onClick={() => requestCloseRef.current()} className="text-secondary hover:text-primary" data-testid="superadmin-users-users-close-user-dialog-1">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <p id="superadmin-user-modal-description" className="mb-4 text-sm text-secondary">
          {t("COPY.CHANGES_IN_THIS_SCREEN_UPDATE_SAMPLE_DATA_IN_THIS_PAGE_ONLY_NO_USER_ACCOUNT_IS_CREATED_OR_CHANGED_ON_THE_SERVER")}
        </p>

        <form onSubmit={onSubmit} noValidate data-testid="superadmin-superadmin-users-overview-modal-form-line-123">
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="superadmin-user-full-name" className="text-xs font-semibold text-secondary block mb-1">{t("COPY.FULL_NAME")}</label>
                <input
                  ref={firstInputRef}
                  id="superadmin-user-full-name"
                  autoComplete="name"
                  className="sa-input w-full"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'superadmin-user-full-name-error' : undefined}
                  {...register('name')}
                 data-testid="superadmin-users-users-superadmin-user-full-name-2"/>
                {translateValidationMessage(errors.name?.message) && <p id="superadmin-user-full-name-error" className="mt-1 text-xs text-danger" role="alert">{translateValidationMessage(errors.name.message)}</p>}
              </div>
              <div>
                <label htmlFor="superadmin-user-username" className="text-xs font-semibold text-secondary block mb-1">{t("COPY.USERNAME")}</label>
                <input
                  id="superadmin-user-username"
                  autoComplete="username"
                  className="sa-input w-full"
                  aria-invalid={Boolean(errors.username)}
                  aria-describedby={errors.username ? 'superadmin-user-username-error' : undefined}
                  {...register('username')}
                 data-testid="superadmin-users-users-superadmin-user-username-3"/>
                {translateValidationMessage(errors.username?.message) && <p id="superadmin-user-username-error" className="mt-1 text-xs text-danger" role="alert">{translateValidationMessage(errors.username.message)}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="superadmin-user-email" className="text-xs font-semibold text-secondary block mb-1">{t("COPY.EMAIL_ADDRESS")}</label>
              <input
                id="superadmin-user-email"
                type="email"
                autoComplete="email"
                className="sa-input w-full"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'superadmin-user-email-error' : undefined}
                {...register('email')}
               data-testid="superadmin-users-users-superadmin-user-email-4"/>
              {translateValidationMessage(errors.email?.message) && <p id="superadmin-user-email-error" className="mt-1 text-xs text-danger" role="alert">{translateValidationMessage(errors.email.message)}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="superadmin-user-role" className="text-xs font-semibold text-secondary block mb-1">{t("COPY.ROLE_TYPE")}</label>
                <select
                  id="superadmin-user-role"
                  className="sa-input w-full"
                  aria-invalid={Boolean(errors.role)}
                  aria-describedby={errors.role ? 'superadmin-user-role-error' : undefined}
                  {...register('role')}
                 data-testid="superadmin-users-users-superadmin-user-role-5">
                  {SUPERADMIN_USERS_ROLE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{t(option.labelKey)}</option>)}
                </select>
                {translateValidationMessage(errors.role?.message) && <p id="superadmin-user-role-error" className="mt-1 text-xs text-danger" role="alert">{translateValidationMessage(errors.role.message)}</p>}
              </div>
              <div>
                <label htmlFor="superadmin-user-branch" className="text-xs font-semibold text-secondary block mb-1">{t("COPY.ASSIGNED_TENANT_BRANCH")}</label>
                <input
                  id="superadmin-user-branch"
                  className="sa-input w-full"
                  aria-invalid={Boolean(errors.branch)}
                  aria-describedby={errors.branch ? 'superadmin-user-branch-error' : undefined}
                  {...register('branch')}
                 data-testid="superadmin-users-users-superadmin-user-branch-6"/>
                {translateValidationMessage(errors.branch?.message) && <p id="superadmin-user-branch-error" className="mt-1 text-xs text-danger" role="alert">{translateValidationMessage(errors.branch.message)}</p>}
              </div>
            </div>
            <div className="mt-4 p-3 border border-border rounded-lg bg-floating flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-primary flex items-center gap-1">
                  <ShieldCheck size={14} aria-hidden="true" className="text-success" /> {t("COPY.ENFORCE_2FA")}
                </h3>
                <p className="text-xs text-secondary">{t("COPY.REQUIRE_TWO_FACTOR_AUTHENTICATION_ON_NEXT_LOGIN_PREVIEW_ONLY")}</p>
              </div>
              <label className="sa-toggle" htmlFor="superadmin-user-two-factor">
                <span className="sr-only">{t("COPY.ENFORCE_TWO_FACTOR_AUTHENTICATION")}</span>
                <input id="superadmin-user-two-factor" type="checkbox" {...register('twoFactor')}  data-testid="superadmin-users-users-superadmin-user-two-factor-7"/>
                <span className="sa-slider" aria-hidden="true" />
              </label>
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-border">
            <button type="button" className="sa-btn-ghost" onClick={() => requestCloseRef.current()} data-testid="superadmin-users-users-cancel-8">{t("COPY.CANCEL")}</button>
            <button type="submit" className="sa-btn-primary" disabled={isSubmitting} data-testid="superadmin-users-users-saving-preview-9">
              {isSubmitting ? t('COPY.SAVING_PREVIEW') : editUser ? t('COPY.UPDATE_CONFIGURATION_PREVIEW') : t('COPY.ADD_USER_PREVIEW')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
