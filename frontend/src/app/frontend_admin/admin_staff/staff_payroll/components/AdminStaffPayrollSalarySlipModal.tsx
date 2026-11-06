'use client';

import { useTranslations } from 'next-intl';
import { Printer, X, Building2, CheckCircle2 } from 'lucide-react';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogHeader from '@/app/frontend_admin/components/ui/dialog/DialogHeader';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import type { StaffSalaryRecord } from '@/app/frontend_admin/admin_staff/staff_payroll/schemas/AdminStaffPayrollSchema';

interface Props {
  record: StaffSalaryRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminStaffPayrollSalarySlipModal({ record, isOpen, onClose }: Props) {
  const t = useTranslations('ADMIN_STAFF_PAYROLL');

  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{t('MODAL_SLIP_TITLE')}</DialogTitle>
        </DialogHeader>

        {/* Printable Payslip Card */}
        <div id="salary-slip-printable" className="space-y-4 rounded-xl border border-border bg-card p-5 text-sm shadow-sm">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-border pb-3">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold">
                <Building2 size={18} />
                <span>{t('SLIP_COMPANY_HEADER')}</span>
              </div>
              <p className="mt-0.5 text-xs text-text-secondary">{record.branchName} · Operations Division</p>
            </div>
            <div className="text-right">
              <span className="rounded bg-surface px-2 py-0.5 text-xs font-semibold uppercase text-text-secondary border border-border">
                {record.month}
              </span>
              <p className="mt-1 text-[11px] font-mono text-text-disabled">Ref: {record.id}</p>
            </div>
          </div>

          {/* Employee & Bank Info Grid */}
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-surface p-3 text-xs">
            <div className="space-y-1">
              <p><span className="text-text-secondary">Name:</span> <strong className="text-text-primary">{record.staffName}</strong></p>
              <p><span className="text-text-secondary">Employee ID:</span> <span className="font-mono">{record.staffId}</span></p>
              <p><span className="text-text-secondary">Designation:</span> {record.role}</p>
            </div>
            <div className="space-y-1 text-right">
              <p><span className="text-text-secondary">{t('SLIP_BANK_NAME')}:</span> {record.bankDetails.bankName}</p>
              <p><span className="text-text-secondary">{t('SLIP_ACC_NO')}:</span> <span className="font-mono">{record.bankDetails.accountNoMasked}</span></p>
              <p><span className="text-text-secondary">{t('SLIP_IFSC')}:</span> <span className="font-mono">{record.bankDetails.ifsc}</span></p>
            </div>
          </div>

          {/* Attendance Breakdown */}
          <div className="grid grid-cols-4 gap-2 rounded-lg border border-border p-2.5 text-center text-xs">
            <div>
              <span className="text-text-secondary block text-[10px] uppercase">{t('SLIP_WORKING_DAYS')}</span>
              <strong className="text-text-primary text-sm">{record.attendanceStats.totalWorkingDays}</strong>
            </div>
            <div>
              <span className="text-text-secondary block text-[10px] uppercase">{t('SLIP_DAYS_WORKED')}</span>
              <strong className="text-success-text text-sm">{record.attendanceStats.presentDays}</strong>
            </div>
            <div>
              <span className="text-text-secondary block text-[10px] uppercase">{t('SLIP_ABSENT_DAYS')}</span>
              <strong className="text-danger-text text-sm">{record.attendanceStats.absentDays}</strong>
            </div>
            <div>
              <span className="text-text-secondary block text-[10px] uppercase">Leaves</span>
              <strong className="text-text-secondary text-sm">{record.attendanceStats.leavesTaken}</strong>
            </div>
          </div>

          {/* Earnings vs Deductions Table */}
          <div className="grid grid-cols-2 gap-4 border-t border-b border-border py-3 text-xs">
            {/* Earnings */}
            <div className="space-y-1.5">
              <h4 className="font-bold text-text-primary uppercase tracking-wider text-[11px]">{t('SLIP_EARNINGS')}</h4>
              <div className="flex justify-between text-text-secondary">
                <span>Basic Salary</span>
                <span className="font-mono text-text-primary">₹{record.baseSalary.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Shift / Performance Bonus</span>
                <span className="font-mono text-success-text">+₹{record.allowances.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Deductions */}
            <div className="space-y-1.5 border-l border-border pl-4">
              <h4 className="font-bold text-text-primary uppercase tracking-wider text-[11px]">{t('SLIP_DEDUCTIONS')}</h4>
              <div className="flex justify-between text-text-secondary">
                <span>Unpaid Absence Deductions</span>
                <span className="font-mono text-danger-text">
                  {record.deductions > 0 ? `-₹${record.deductions.toLocaleString('en-IN')}` : '₹0'}
                </span>
              </div>
              {record.advanceSalaryDeduction > 0 && (
                <div className="flex justify-between text-text-secondary">
                  <span>{t('SLIP_ADVANCE_SETTLED')}</span>
                  <span className="font-mono text-warning-text">
                    -₹{record.advanceSalaryDeduction.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Net Take-Home Highlight */}
          <div className="flex items-center justify-between rounded-xl bg-primary-subtle p-4">
            <div>
              <span className="text-xs font-semibold text-text-secondary block">{t('SLIP_NET_PAY')}</span>
              <span className="text-[11px] text-text-disabled">Net salary transferred to bank</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-primary font-mono">
                ₹{record.netPayable.toLocaleString('en-IN')}
              </p>
              {record.status === 'DISBURSED' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success-text">
                  <CheckCircle2 size={12} />
                  Disbursed on {record.disbursedAt?.split('T')[0]} ({record.paymentMethod})
                </span>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2 flex justify-between border-t border-border pt-3">
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 rounded-md border border-border px-4 text-xs font-medium text-text-primary hover:bg-surface-hover"
          >
            {t('BTN_CLOSE')}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-md bg-primary px-4 text-xs font-semibold text-on-primary hover:bg-primary-hover"
          >
            <Printer size={15} />
            {t('BTN_PRINT')}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AdminStaffPayrollSalarySlipModal;

