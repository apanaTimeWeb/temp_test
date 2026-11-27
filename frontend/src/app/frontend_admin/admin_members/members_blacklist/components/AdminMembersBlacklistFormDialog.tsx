'use client';
// RESPONSIBILITY: AdminBlacklistFormDialog component owned by admin_blacklist.

import { ADMIN_BLACKLIST_EMPTY_FORM } from '@/app/frontend_admin/admin_members/members_blacklist/config/admin_members_blacklist.url_config';
import useAdminMembersBlacklistUnsavedChangesGuard from '@/app/frontend_admin/admin_members/members_blacklist/hooks/useAdminMembersBlacklistUnsavedChangesGuard';
import {
  createAdminBlacklistFormSchema,
  type AdminBlacklistFormSchemaType,
  type AdminBlacklistValidationKey,
} from '@/app/frontend_admin/admin_members/members_blacklist/schemas/AdminMembersBlacklistSchema';
import type { AdminBlacklistFormDialogProps } from '@/app/frontend_admin/admin_members/members_blacklist/types/AdminMembersBlacklistTypes';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, ShieldAlert, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

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

  const handleBlockedNavigation = useCallback((href: string) => {
    setPendingNavigation(href);
    setConfirmDiscard(true);
  }, []);
  useAdminMembersBlacklistUnsavedChangesGuard(isDirty && open, isSubmitting, handleBlockedNavigation);

  const requestClose = () => {
    if (isDirty) {
      setConfirmDiscard(true);
      return;
    }
    onOpenChange(false);
  };
  const discardDraft = () => {
    setConfirmDiscard(false);
    reset(ADMIN_BLACKLIST_EMPTY_FORM);
    const destination = pendingNavigation;
    setPendingNavigation(null);
    onOpenChange(false);
    if (destination) router.push(destination);
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (nextOpen) onOpenChange(true); else requestClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-danger-bg text-danger-text border border-danger">
              <ShieldAlert size={20} aria-hidden="true" />
            </div>
            <div>
              <DialogTitle className="text-section-title font-semibold text-text-primary">{t('FORM_TITLE')}</DialogTitle>
              <p className="text-xs text-text-secondary mt-0.5">Network-Wide Disciplinary Expulsion & Blacklist Record</p>
            </div>
          </div>
          <button type="button" className="admin-btn-icon min-h-11 min-w-11" aria-label={t('CLOSE_FORM')} onClick={requestClose}>
            <X size={18} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
        <DialogDescription className="mt-2 text-xs text-text-secondary">{t('FORM_DESCRIPTION')}</DialogDescription>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="admin-blacklist-name" className="admin-label">{t('NAME_LABEL')}</label>
              <input maxLength={30} id="admin-blacklist-name" {...register('name')} placeholder="Student Full Name" className="admin-input" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'admin-blacklist-name-error' : undefined} required autoComplete="name" />
              {errors.name && <p id="admin-blacklist-name-error" className="admin-error" role="alert">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="admin-blacklist-phone" className="admin-label">{t('PHONE_LABEL')}</label>
              <input
                id="admin-blacklist-phone"
                {...register('phone', {
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  },
                })}
                maxLength={10}
                placeholder="10-digit mobile"
                className="admin-input font-mono"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? 'admin-blacklist-phone-error' : undefined}
                required
                inputMode="tel"
                autoComplete="tel"
              />
              {errors.phone && <p id="admin-blacklist-phone-error" className="admin-error" role="alert">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="admin-blacklist-category" className="admin-label">
                Disciplinary Violation Category <span className="text-danger-text">*</span>
              </label>
              <select id="admin-blacklist-category" {...register('category')} defaultValue="THEFT_STOLEN_PROPERTY" className="admin-input">
                <option value="THEFT_STOLEN_PROPERTY">🚨 Theft / Stolen Property (चोरी)</option>
                <option value="INDISCIPLINE_MISCONDUCT">⚡ Gross Indiscipline & Misconduct (अनुशासनहीनता)</option>
                <option value="PHYSICAL_ALTERCATION">⚠️ Physical Altercation / Threat (मारपीट/धमकी)</option>
                <option value="PROPERTY_VANDALISM">🔨 Property Damage & Vandalism (तोड़फोड़)</option>
                <option value="UNAUTHORIZED_OCCUPANCY">🚫 Unauthorized Occupancy / Proxy Seating (अवैध कब्जा)</option>
                <option value="FEE_DEFAULT_FRAUD">💳 Severe Fee Fraud / Fake Receipt (धोखाधड़ी)</option>
                <option value="OTHER">⚠️ Other Disciplinary Violation</option>
              </select>
            </div>

            <div>
              <label htmlFor="admin-blacklist-scope" className="admin-label">
                Enforcement Scope (प्रतिबंध का दायरा) <span className="text-danger-text">*</span>
              </label>
              <select id="admin-blacklist-scope" {...register('banScope')} defaultValue="NETWORK_WIDE" className="admin-input">
                <option value="NETWORK_WIDE">🌐 Network-Wide Bar (All Library Branches)</option>
                <option value="BRANCH_SPECIFIC">🏢 Branch Specific Only (Current Branch)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="admin-blacklist-duration" className="admin-label">Ban Duration (प्रतिबंध अवधि)</label>
              <select id="admin-blacklist-duration" {...register('banDuration')} defaultValue="PERMANENT" className="admin-input">
                <option value="PERMANENT">Permanent / Indefinite Bar (आजीवन निष्कासन)</option>
                <option value="TEMPORARY_30_DAYS">Temporary (30 Days Suspension)</option>
                <option value="TEMPORARY_90_DAYS">Temporary (90 Days / 3 Months)</option>
                <option value="TEMPORARY_180_DAYS">Temporary (180 Days / 6 Months)</option>
                <option value="TEMPORARY_1_YEAR">Temporary (1 Year Expulsion)</option>
              </select>
            </div>

            <div>
              <label htmlFor="admin-blacklist-seat" className="admin-label">
                {t('PREVIOUS_SEAT_LABEL')} <span className="text-caption font-normal text-text-secondary">(Optional)</span>
              </label>
              <input maxLength={30} id="admin-blacklist-seat" {...register('previousSeat')} placeholder="e.g. A-04 or Desk 12" className="admin-input" />
            </div>
          </div>

          <div className="rounded-xl border border-danger bg-danger-bg p-4 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-danger-text block">
              Immediate Disciplinary Enforcement Actions
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 text-text-primary cursor-pointer">
                <input type="checkbox" defaultChecked {...register('revokeSeat')} className="rounded accent-danger" />
                <span>Revoke & vacate assigned seat immediately</span>
              </label>
              <label className="flex items-center gap-2 text-text-primary cursor-pointer">
                <input type="checkbox" defaultChecked {...register('revokeLocker')} className="rounded accent-danger" />
                <span>Revoke & reclaim locker allocation</span>
              </label>
              <label className="flex items-center gap-2 text-text-primary cursor-pointer">
                <input type="checkbox" defaultChecked {...register('blockBiometric')} className="rounded accent-danger" />
                <span>Lock turnstiles & biometric access network-wide</span>
              </label>
              <label className="flex items-center gap-2 text-text-primary cursor-pointer">
                <input type="checkbox" {...register('confiscateDeposit')} className="rounded accent-danger" />
                <span>Forfeit caution money towards damages</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="admin-blacklist-location" className="admin-label">Incident Hall / Location</label>
              <input maxLength={30} id="admin-blacklist-location" {...register('incidentLocation')} placeholder="e.g. Silent Study Hall A, 2nd Floor" className="admin-input" />
            </div>
            <div>
              <label htmlFor="admin-blacklist-fir" className="admin-label">Police Complaint / FIR Ref (Optional)</label>
              <input maxLength={30} id="admin-blacklist-fir" {...register('firRefNo')} placeholder="e.g. FIR-2026-SEC-092" className="admin-input" />
            </div>
          </div>

          <div>
            <label htmlFor="admin-blacklist-reason" className="admin-label">{t('REASON_LABEL')}</label>
            <textarea maxLength={1000} id="admin-blacklist-reason" {...register('reason')} placeholder="Describe the violation, evidence, or eyewitness reports..." className="admin-textarea" aria-invalid={Boolean(errors.reason)} aria-describedby={errors.reason ? 'admin-blacklist-reason-error' : undefined} rows={3} required />
            {errors.reason && <p id="admin-blacklist-reason-error" className="admin-error" role="alert">{errors.reason.message}</p>}
          </div>

          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <button type="button" className="admin-btn-ghost min-h-11" onClick={requestClose}>{t('CANCEL')}</button>
            <button type="submit" className="admin-btn-danger min-h-11 disabled:cursor-not-allowed disabled:opacity-50" disabled={isSubmitting || !isDemoMode}>
              <Save size={18} strokeWidth={2} aria-hidden="true" /> Enforce Blacklist & Expel
            </button>
          </div>
        </form>

        {confirmDiscard && (
          <div role="alertdialog" aria-modal="true" aria-labelledby="admin-blacklist-discard-title" className="mt-4 rounded-lg border border-warning bg-card p-4">
            <h3 id="admin-blacklist-discard-title" className="font-semibold text-text-primary">{t('UNSAVED_CHANGES_TITLE')}</h3>
            <p className="mt-2 text-text-secondary">{t('UNSAVED_CHANGES_DESCRIPTION')}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="admin-btn-ghost min-h-11" onClick={() => { setConfirmDiscard(false); setPendingNavigation(null); }}>{t('KEEP_EDITING')}</button>
              <button type="button" className="admin-btn-danger min-h-11" onClick={discardDraft}>{t('DISCARD_CHANGES')}</button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export type { AdminBlacklistFormDialogProps };
