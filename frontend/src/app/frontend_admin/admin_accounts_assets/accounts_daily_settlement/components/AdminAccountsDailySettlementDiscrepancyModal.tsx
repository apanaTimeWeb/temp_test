// components/AdminAccountsDailySettlementDiscrepancyModal.tsx
'use client';

import type {
  DailySettlementRecord,
  DiscrepancyResolutionAction,
  FlagDiscrepancyPayload,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/types/AdminAccountsDailySettlementTypes';
import { formatPaiseToRupees } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/utils/AdminAccountsDailySettlementFormatters';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import DialogHeader from '@/app/frontend_admin/components/ui/dialog/DialogHeader';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, ArrowRightCircle, CheckCircle2, CreditCard, Flag, ShieldAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const DiscrepancyFormSchema = z.object({
  reason: z.enum(['CASH_SHORTAGE', 'MISSING_SLIP', 'UNAUTHORIZED_EXPENSE', 'RECORD_MISMATCH']),
  resolutionAction: z.enum(['DEDUCT_SALARY', 'CARRY_FORWARD', 'IMMEDIATE_DEPOSIT', 'WRITE_OFF']),
  notes: z.string().trim().min(5, 'Audit notes must be at least 5 characters long.').max(1000),
});

type DiscrepancyFormValues = z.infer<typeof DiscrepancyFormSchema>;

const RESOLUTION_CARDS: ReadonlyArray<{
  action: DiscrepancyResolutionAction;
  title: string;
  activeClass: string;
  radioClass: string;
  icon: typeof CreditCard;
  iconClass: string;
  desc: (managerName: string) => string;
}> = [
  {
    action: 'DEDUCT_SALARY',
    title: 'Deduct from Salary',
    activeClass: 'border-danger bg-danger-bg ring-1 ring-danger',
    radioClass: 'text-danger-text focus:ring-danger',
    icon: CreditCard,
    iconClass: 'text-danger-text',
    desc: (m) => `Debit shortage from ${m}'s next monthly payroll disbursement.`,
  },
  {
    action: 'CARRY_FORWARD',
    title: 'Carry-Forward Deficit',
    activeClass: 'border-warning bg-warning-bg ring-1 ring-warning',
    radioClass: 'text-warning-text focus:ring-warning',
    icon: ArrowRightCircle,
    iconClass: 'text-warning-text',
    desc: () => "Carry forward liability to tomorrow's shift opening cash balance.",
  },
  {
    action: 'IMMEDIATE_DEPOSIT',
    title: 'Immediate Deposit',
    activeClass: 'border-success bg-success-bg ring-1 ring-success',
    radioClass: 'text-success-text focus:ring-success',
    icon: CheckCircle2,
    iconClass: 'text-success-text',
    desc: () => 'Manager deposited the cash shortage difference at counter immediately.',
  },
  {
    action: 'WRITE_OFF',
    title: 'Waive / Loss Absorption',
    activeClass: 'border-border-focus bg-surface-highlight ring-1 ring-primary',
    radioClass: 'text-primary focus:ring-primary',
    icon: ShieldAlert,
    iconClass: 'text-text-secondary',
    desc: () => 'Waive deficit as authorized operational variance / library expense.',
  },
];

interface Props {
  record: DailySettlementRecord | null;
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (payload: FlagDiscrepancyPayload) => Promise<boolean>;
}

export function AdminAccountsDailySettlementDiscrepancyModal({
  record,
  isOpen,
  isSubmitting,
  onClose,
  onConfirm,
}: Props) {
  const t = useTranslations('ADMIN_ACCOUNTS_DAILY_SETTLEMENT.MODAL_FLAG');
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<DiscrepancyFormValues>({
    resolver: zodResolver(DiscrepancyFormSchema),
    defaultValues: {
      reason: 'CASH_SHORTAGE',
      resolutionAction: 'DEDUCT_SALARY',
      notes: '',
    },
  });

  useEffect(() => {
    if (record) {
      reset({
        reason: 'CASH_SHORTAGE',
        resolutionAction: 'DEDUCT_SALARY',
        notes: '',
      });
    }
  }, [record, reset]);

  useEffect(() => {
    if (!isOpen || !isDirty || isSubmitting) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, isOpen, isSubmitting]);

  if (!record) return null;

  const resolutionAction = watch('resolutionAction');

  const submitForm = handleSubmit(async (values) => {
    const success = await onConfirm({
      settlementId: record.id,
      discrepancyReason: values.reason,
      resolutionAction: values.resolutionAction,
      adminNotes: values.notes.trim(),
    });
    if (success) onClose();
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open && !isSubmitting) onClose(); }}>
      <DialogContent className="max-w-lg">
        <form onSubmit={submitForm} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-danger-text" aria-hidden="true" />
              <DialogTitle>{t('TITLE')}</DialogTitle>
            </div>
            <DialogDescription>{t('DESCRIPTION')}</DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-danger bg-danger-bg p-3 text-xs space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-text-secondary">Branch:</span>
                <p className="font-semibold text-text-primary">{record.branchName}</p>
              </div>
              <div>
                <span className="text-text-secondary">Manager:</span>
                <p className="font-semibold text-text-primary">{record.managerName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-border pt-2">
              <div>
                <span className="text-text-secondary">Expected:</span>
                <p className="font-mono text-text-primary font-medium">{formatPaiseToRupees(record.expectedClosingCash)}</p>
              </div>
              <div>
                <span className="text-text-secondary">Reported Handover:</span>
                <p className="font-mono text-text-primary font-semibold">{formatPaiseToRupees(record.actualHandoverCash)}</p>
              </div>
            </div>

            <div className="border-t border-border pt-2 flex items-center justify-between">
              <span className="text-text-secondary">Calculated Variance:</span>
              <span className={`font-mono font-bold ${record.difference < 0 ? 'text-danger-text' : 'text-success-text'}`}>
                {formatPaiseToRupees(record.difference)}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="discrepancy-reason" className="block text-xs font-semibold text-text-primary">
              {t('REASON_LABEL')}
            </label>
            <select
              id="discrepancy-reason"
              {...register('reason')}
              disabled={isSubmitting}
              className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
            >
              <option value="CASH_SHORTAGE">{t('REASONS.CASH_SHORTAGE')}</option>
              <option value="MISSING_SLIP">{t('REASONS.MISSING_SLIP')}</option>
              <option value="UNAUTHORIZED_EXPENSE">{t('REASONS.UNAUTHORIZED_EXPENSE')}</option>
              <option value="RECORD_MISMATCH">{t('REASONS.RECORD_MISMATCH')}</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-text-primary">
              Recovery &amp; Adjustment Action (शॉर्टेज समाधान) *
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {RESOLUTION_CARDS.map((card) => {
                const CardIcon = card.icon;
                const isSelected = resolutionAction === card.action;
                return (
                  <label
                    key={card.action}
                    className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 motion-safe:transition-colors ${
                      isSelected ? card.activeClass : 'border-border bg-card hover:bg-surface-hover'
                    }`}
                  >
                    <input
                      type="radio"
                      name="resolutionAction"
                      value={card.action}
                      checked={isSelected}
                      onChange={() => setValue('resolutionAction', card.action, { shouldDirty: true })}
                      className={`mt-0.5 ${card.radioClass}`}
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
                        <CardIcon className={`h-3.5 w-3.5 ${card.iconClass}`} aria-hidden="true" />
                        <span>{card.title}</span>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-tight">
                        {card.desc(record.managerName)}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="discrepancy-notes" className="block text-xs font-semibold text-text-primary">
              {t('NOTES_LABEL')}
            </label>
            <textarea
              maxLength={1000}
              id="discrepancy-notes"
              rows={3}
              {...register('notes')}
              placeholder={t('NOTES_PLACEHOLDER')}
              disabled={isSubmitting}
              required
              className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
            />
            {errors.notes?.message && <p className="text-xs text-danger-text font-medium">{errors.notes.message}</p>}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
            >
              {t('CANCEL')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-md bg-danger px-4 py-2 text-sm font-medium text-on-primary hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger disabled:opacity-50 motion-safe:transition-opacity"
            >
              <Flag className="h-4 w-4" aria-hidden="true" />
              <span>{isSubmitting ? 'Flagging...' : t('SUBMIT')}</span>
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AdminAccountsDailySettlementDiscrepancyModal;
