// Responsibility: AdminFinanceSecurityDepositsPage component owned by admin_finance; responsibility folder: admin_finance_components_views.
'use client';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';

// RESPONSIBILITY: Owns deposit demo state and coordinates the toolbar, ledger and modal intents.
// DATA FLOW: feature fixture -> page-local state -> filtered ledger -> explicit demo-only local updates.

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAdminFinanceAccessibleDialog } from '@/app/frontend_admin/admin_finance/finance_security_deposits/hooks/useAdminFinanceSecurityDepositsAccessibleDialog';
import { ADMIN_FINANCE_DEMO_SECURITY_DEPOSITS } from '@/app/frontend_admin/admin_finance/finance_security_deposits/mocks/scenarios/admin_finance_security_deposits.scenarios';
import type { AdminFinanceDeposit } from '@/app/frontend_admin/admin_finance/finance_security_deposits/types/AdminFinanceSecurityDepositsTypes';
import toast from 'sonner';
import { getAdminFinanceLocalDateString, majorToMinor, minorToMajor } from '@/app/frontend_admin/admin_finance/finance_security_deposits/utils/AdminFinanceSecurityDepositsFormat';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import AdminFinanceSecurityDepositsToolbar from '@/app/frontend_admin/admin_finance/finance_security_deposits/components/AdminFinanceSecurityDepositsToolbar';
import AdminFinanceSecurityDepositsTable from '@/app/frontend_admin/admin_finance/finance_security_deposits/components/AdminFinanceSecurityDepositsTable';
import AdminFinanceSecurityDepositsRefundDialog, { type AdminFinanceSecurityDepositsRefundTarget } from '@/app/frontend_admin/admin_finance/finance_security_deposits/components/AdminFinanceSecurityDepositsRefundDialog';
import AdminFinanceSecurityDepositsDeductionDialog from '@/app/frontend_admin/admin_finance/finance_security_deposits/components/AdminFinanceSecurityDepositsDeductionDialog';

export function AdminFinanceSecurityDepositsPage() {
  const t = useTranslations('ADMIN_FINANCE_SECURITY_DEPOSITS');
  const [statusFilter, setStatusFilter] = useAdminApplicationInfrastructureUrlQueryState<string>('statusFilter', 'all', { validValues: ['all', 'held', 'refunded', 'forfeited'] });
  const [deposits, setDeposits] = useState<AdminFinanceDeposit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refundDialog, setRefundDialog] = useState<AdminFinanceSecurityDepositsRefundTarget | null>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [deductionAmount, setDeductionAmount] = useState('');
  const [deductionReason, setDeductionReason] = useState('');
  const [deductDialog, setDeductDialog] = useState<{ id: number; name: string } | null>(null);
  const [deductAmount, setDeductAmount] = useState('');
  const [deductReason, setDeductReason] = useState('');
  const closeDepositDialogs = () => {
    setRefundDialog(null);
    setDeductDialog(null);
    setRefundAmount('');
    setDeductionAmount('');
    setDeductionReason('');
    setDeductAmount('');
    setDeductReason('');
  };
  const { dialogRef } = useAdminFinanceAccessibleDialog({ isOpen: Boolean(refundDialog || deductDialog), onClose: closeDepositDialogs });

  useEffect(() => {
    setDeposits(isFrontendDemoModeEnabled() ? [...ADMIN_FINANCE_DEMO_SECURITY_DEPOSITS] : []);
    setIsLoading(false);
  }, []);

  const filtered = deposits.filter((deposit) => statusFilter === 'all' || deposit.status === statusFilter);

  const openRefundDialog = (deposit: AdminFinanceDeposit) => {
    setRefundDialog({ id: deposit.id, name: deposit.studentName, amount: deposit.depositAmount, deductionAmount: deposit.deductionAmount, deductionReason: deposit.deductionReason });
    setRefundAmount(String(minorToMajor(deposit.depositAmount - deposit.deductionAmount, 'INR', 'en-IN')));
    setDeductionAmount('');
    setDeductionReason('');
  };

  const openDeductionDialog = (deposit: AdminFinanceDeposit) => {
    setDeductDialog({ id: deposit.id, name: deposit.studentName });
    setDeductAmount('');
    setDeductReason('');
  };

  const handleRefund = () => {
    if (!refundDialog) return;
    if (!isFrontendDemoModeEnabled()) { toast.error(t('REFUND_BLOCKED'), { id: 'admin_finance-finance_security_deposits-components-AdminFinanceSecurityDepositsPage-toast-66-1' }); return; }
    const refundRupees = Number(refundAmount);
    const hasEnteredDeduction = deductionAmount.trim() !== '';
    const deductionRupees = hasEnteredDeduction ? Number(deductionAmount) : minorToMajor(refundDialog.deductionAmount, 'INR', 'en-IN');
    const deductionDescription = deductionReason.trim() || refundDialog.deductionReason || '';
    if (!Number.isFinite(refundRupees) || refundRupees < 0) { toast.error(t('REFUND_AMOUNT_INVALID'), { id: 'admin_finance-finance_security_deposits-components-AdminFinanceSecurityDepositsPage-toast-71-2' }); return; }
    if (!Number.isFinite(deductionRupees) || deductionRupees < 0) { toast.error(t('DEDUCTION_AMOUNT_INVALID'), { id: 'admin_finance-finance_security_deposits-components-AdminFinanceSecurityDepositsPage-toast-72-3' }); return; }
    if (hasEnteredDeduction && deductionRupees > 0 && !deductionReason.trim()) { toast.error(t('DEDUCTION_REASON_REQUIRED'), { id: 'admin_finance-finance_security_deposits-components-AdminFinanceSecurityDepositsPage-toast-73-4' }); return; }
    const refundMinor = majorToMinor(refundRupees, 'INR', 'en-IN');
    const deductionMinor = majorToMinor(deductionRupees, 'INR', 'en-IN');
    if (refundMinor + deductionMinor > refundDialog.amount) { toast.error(t('REFUND_TOTAL_EXCEEDED'), { id: 'admin_finance-finance_security_deposits-components-AdminFinanceSecurityDepositsPage-toast-76-5' }); return; }
    setDeposits((previous) => previous.map((deposit) => deposit.id === refundDialog.id
      ? { ...deposit, status: 'refunded', refundedDate: getAdminFinanceLocalDateString(), refundAmount: refundMinor, deductionAmount: deductionMinor, deductionReason: deductionDescription || undefined }
      : deposit));
    toast.info(t('DEMO_REFUND_LOCAL'), { id: 'admin_finance-finance_security_deposits-components-AdminFinanceSecurityDepositsPage-toast-80-6' });
    closeDepositDialogs();
  };

  const handleDeduction = () => {
    if (!deductDialog) return;
    if (!isFrontendDemoModeEnabled()) { toast.error(t('DEDUCTION_BLOCKED'), { id: 'admin_finance-finance_security_deposits-components-AdminFinanceSecurityDepositsPage-toast-86-7' }); return; }
    const amountRupees = Number(deductAmount);
    const reason = deductReason.trim();
    const target = deposits.find((deposit) => deposit.id === deductDialog.id);
    if (!Number.isFinite(amountRupees) || amountRupees <= 0) { toast.error(t('DEDUCTION_POSITIVE'), { id: 'admin_finance-finance_security_deposits-components-AdminFinanceSecurityDepositsPage-toast-90-8' }); return; }
    if (!reason) { toast.error(t('DEDUCTION_REQUIRED'), { id: 'admin_finance-finance_security_deposits-components-AdminFinanceSecurityDepositsPage-toast-91-9' }); return; }
    if (!target || majorToMinor(amountRupees, 'INR', 'en-IN') > target.depositAmount - target.deductionAmount) { toast.error(t('DEDUCTION_EXCEEDED'), { id: 'admin_finance-finance_security_deposits-components-AdminFinanceSecurityDepositsPage-toast-92-10' }); return; }
    setDeposits((previous) => previous.map((deposit) => deposit.id === deductDialog.id
      ? { ...deposit, deductionAmount: deposit.deductionAmount + majorToMinor(amountRupees, 'INR', 'en-IN'), deductionReason: reason }
      : deposit));
    toast.info(t('DEMO_DEDUCTION_LOCAL'), { id: 'admin_finance-finance_security_deposits-components-AdminFinanceSecurityDepositsPage-toast-96-11' });
    closeDepositDialogs();
  };

  return (
    <div className="space-y-6">
      <AdminFinanceSecurityDepositsToolbar isLiveMode={!isFrontendDemoModeEnabled()} statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} />
      <AdminFinanceSecurityDepositsTable deposits={filtered} isLoading={isLoading} onProcessRefund={openRefundDialog} onAddDeduction={openDeductionDialog} canMutate={isFrontendDemoModeEnabled()} />
      <AdminFinanceSecurityDepositsRefundDialog target={refundDialog} dialogRef={dialogRef} refundAmount={refundAmount} deductionAmount={deductionAmount} deductionReason={deductionReason} onRefundAmountChange={setRefundAmount} onDeductionAmountChange={setDeductionAmount} onDeductionReasonChange={setDeductionReason} onClose={closeDepositDialogs} onSubmit={handleRefund} />
      <AdminFinanceSecurityDepositsDeductionDialog target={deductDialog} dialogRef={dialogRef} amount={deductAmount} reason={deductReason} onAmountChange={setDeductAmount} onReasonChange={setDeductReason} onClose={closeDepositDialogs} onSubmit={handleDeduction} />
    </div>
  );
}
