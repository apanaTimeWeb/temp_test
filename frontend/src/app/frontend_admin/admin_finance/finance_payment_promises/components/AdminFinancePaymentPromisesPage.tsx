// Responsibility: AdminFinancePaymentPromisesPage component owned by admin_finance; responsibility folder: admin_finance_components_views.
'use client';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';

// RESPONSIBILITY: Owns payment-promise demo state and composes filter, ledger and extension dialog.
// DATA FLOW: module fixtures -> filtered list -> local demo state changes; live mutation remains blocked without an API contract.

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { differenceInCalendarDays, parseISO, startOfToday } from 'date-fns';
import { useAdminFinanceAccessibleDialog } from '@/app/frontend_admin/admin_finance/finance_payment_promises/hooks/useAdminFinancePaymentPromisesAccessibleDialog';
import { ADMIN_FINANCE_DEMO_PAYMENT_PROMISES } from '@/app/frontend_admin/admin_finance/finance_payment_promises/mocks/AdminFinancePaymentPromisesDemoFixtures';
import type { AdminFinancePromiseItem } from '@/app/frontend_admin/admin_finance/finance_payment_promises/types/AdminFinancePaymentPromisesTypes';
import toast from 'sonner';
import { getAdminFinanceLocalDateString } from '@/app/frontend_admin/admin_finance/finance_payment_promises/utils/AdminFinancePaymentPromisesFormat';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import AdminFinancePaymentPromisesToolbar from '@/app/frontend_admin/admin_finance/finance_payment_promises/components/AdminFinancePaymentPromisesToolbar';
import AdminFinancePaymentPromisesTable from '@/app/frontend_admin/admin_finance/finance_payment_promises/components/AdminFinancePaymentPromisesTable';
import AdminFinancePaymentPromisesExtendDialog from '@/app/frontend_admin/admin_finance/finance_payment_promises/components/AdminFinancePaymentPromisesExtendDialog';

function calcDays(dateStr: string) {
  // Promise due dates are calendar dates; compare calendar days rather than UTC milliseconds.
  return differenceInCalendarDays(parseISO(dateStr), startOfToday());
}

export function AdminFinancePaymentPromisesPage() {
  const t = useTranslations('ADMIN_FINANCE_PAYMENT_PROMISES');
  const [statusFilter, setStatusFilter] = useAdminApplicationInfrastructureUrlQueryState<string>('statusFilter', 'all', { validValues: ['all', 'pending', 'fulfilled', 'overdue'] });
  const [promises, setPromises] = useState<AdminFinancePromiseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [extendDialog, setExtendDialog] = useState<{ id: number; name: string } | null>(null);
  const [newDate, setNewDate] = useState('');
  const [extendReason, setExtendReason] = useState('');
  const closeExtendDialog = () => { setExtendDialog(null); setNewDate(''); setExtendReason(''); };
  const { dialogRef } = useAdminFinanceAccessibleDialog({ isOpen: Boolean(extendDialog), onClose: closeExtendDialog });

  useEffect(() => {
    setPromises(isFrontendDemoModeEnabled() ? [...ADMIN_FINANCE_DEMO_PAYMENT_PROMISES] : []);
    setIsLoading(false);
  }, []);

  const filtered = promises.filter((promise) => statusFilter === 'all' || promise.status === statusFilter);

  const handleFulfill = (id: number, name: string) => {
    if (!isFrontendDemoModeEnabled()) { toast.error(t('FULFILL_BLOCKED'), { id: 'admin_finance-finance_payment_promises-components-AdminFinancePaymentPromisesPage-toast-45-1' }); return; }
    setPromises((previous) => previous.map((promise) => promise.id === id ? { ...promise, status: 'fulfilled', fulfilledDate: getAdminFinanceLocalDateString() } : promise));
    toast.info(t('FULFILL_DEMO', { name }), { id: 'admin_finance-finance_payment_promises-components-AdminFinancePaymentPromisesPage-toast-47-2' });
  };

  const handleExtend = () => {
    if (!extendDialog || !newDate || !extendReason.trim()) return;
    if (!isFrontendDemoModeEnabled()) { toast.error(t('EXTEND_BLOCKED'), { id: 'admin_finance-finance_payment_promises-components-AdminFinancePaymentPromisesPage-toast-52-3' }); return; }
    const daysUntilDue = calcDays(newDate);
    setPromises((previous) => previous.map((promise) => promise.id === extendDialog.id
      ? { ...promise, expectedDate: newDate, timesChanged: promise.timesChanged + 1, daysUntilDue, status: daysUntilDue < 0 ? 'overdue' : 'pending' }
      : promise));
    toast.info(t('EXTEND_DEMO', { name: extendDialog.name }), { id: 'admin_finance-finance_payment_promises-components-AdminFinancePaymentPromisesPage-toast-57-4' });
    closeExtendDialog();
  };

  return (
    <div className="space-y-6">
      <AdminFinancePaymentPromisesToolbar isLiveMode={!isFrontendDemoModeEnabled()} statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} />
      <AdminFinancePaymentPromisesTable promises={filtered} isLoading={isLoading} onFulfill={handleFulfill} onExtend={setExtendDialog} canMutate={isFrontendDemoModeEnabled()} />
      <AdminFinancePaymentPromisesExtendDialog target={extendDialog} dialogRef={dialogRef} newDate={newDate} reason={extendReason} onDateChange={setNewDate} onReasonChange={setExtendReason} onClose={closeExtendDialog} onSubmit={handleExtend} />
    </div>
  );
}
