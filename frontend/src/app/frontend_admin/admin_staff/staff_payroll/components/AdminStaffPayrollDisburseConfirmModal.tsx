'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogHeader from '@/app/frontend_admin/components/ui/dialog/DialogHeader';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import type {
  StaffSalaryRecord,
  PaymentMethod,
  DisburseSalaryInput,
} from '@/app/frontend_admin/admin_staff/staff_payroll/schemas/AdminStaffPayrollSchema';

interface Props {
  record: StaffSalaryRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (input: DisburseSalaryInput) => void;
}

export function AdminStaffPayrollDisburseConfirmModal({
  record,
  isOpen,
  onClose,
  onConfirm,
}: Props) {
  const t = useTranslations('ADMIN_STAFF_PAYROLL');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BANK_TRANSFER');
  const [transactionRef, setTransactionRef] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (record) {
      setPaymentMethod('BANK_TRANSFER');
      setTransactionRef(`NEFT${Date.now().toString().slice(-8)}`);
      setNotes('');
    }
  }, [record]);

  if (!record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim()) return;
    onConfirm({
      payrollId: record.id,
      paymentMethod,
      transactionRef: transactionRef.trim(),
      notes: notes.trim() || undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-warning-text">
            <ShieldAlert size={20} />
            <DialogTitle>{t('MODAL_DISBURSE_TITLE')}</DialogTitle>
          </div>
          <DialogDescription>{t('MODAL_DISBURSE_DESC')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Summary Box */}
          <div className="rounded-xl border border-warning-border bg-warning-bg/10 p-3.5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-text-primary">{record.staffName}</p>
                <p className="text-xs text-text-secondary">{record.role} · {record.branchName}</p>
                <p className="mt-1 text-[11px] text-text-disabled">
                  Bank: {record.bankDetails.bankName} ({record.bankDetails.accountNoMasked})
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-text-secondary">Net Payable:</span>
                <p className="text-xl font-extrabold text-primary">
                  ₹{record.netPayable.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-secondary">
              {t('FIELD_PAYMENT_METHOD')}
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="min-h-11 w-full rounded-md border border-border bg-input px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="BANK_TRANSFER">{t('MODE_BANK_TRANSFER')}</option>
              <option value="UPI">{t('MODE_UPI')}</option>
              <option value="CASH">{t('MODE_CASH')}</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-secondary">
              {t('FIELD_TXN_REF')}
            </label>
            <input
              type="text"
              required
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              placeholder={t('FIELD_TXN_REF_PLACEHOLDER')}
              className="min-h-11 w-full rounded-md border border-border bg-input px-3 font-mono text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <p className="text-xs text-danger-text">
            {t('FIELD_DISBURSE_WARNING', {
              amount: record.netPayable.toLocaleString('en-IN'),
              name: record.staffName,
            })}
          </p>

          <DialogFooter className="mt-4 flex justify-end gap-2 border-t border-border pt-3">
            <button
              type="button"
              onClick={onClose}
              className="min-h-10 rounded-md border border-border px-4 text-xs font-medium text-text-primary hover:bg-surface-hover"
            >
              {t('BTN_CANCEL')}
            </button>
            <button
              type="submit"
              disabled={!transactionRef.trim()}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-md bg-primary px-4 text-xs font-semibold text-on-primary hover:bg-primary-hover disabled:opacity-50"
            >
              <CheckCircle2 size={16} />
              {t('BTN_CONFIRM_DISBURSE')}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AdminStaffPayrollDisburseConfirmModal;

