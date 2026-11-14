// RESPONSIBILITY: Orchestrate payment-promises filters, local sample state and the preview date-extension lifecycle.
'use client';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useSuperadminBillingOverviewMemberPaymentPromisesUrlFilter } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payment_promises/hooks/useSuperadminBillingOverviewMemberPaymentPromisesUrlFilter';
import { SuperadminFinanceCalculateDaysUntilDate } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payment_promises/utils/SuperadminBillingOverviewMemberPaymentPromisesDateUtilities';
import { SUPERADMIN_FINANCE_SAMPLE_PAYMENT_PROMISES } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payment_promises/mocks/fixtures/SuperadminBillingOverviewMemberPaymentPromisesPaymentPromiseMockFixtures';
import type { PromiseItem } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payment_promises/types/superadmin_billing_member_payment_promises.types';
import { SuperadminBillingOverviewMemberPaymentPromisesExtensionSchema, type SuperadminBillingOverviewMemberPaymentPromisesExtensionValues } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payment_promises/schemas/superadmin_billing_member_payment_promises.schemas';
import SuperadminBillingOverviewMemberPaymentPromisesPageHeader from '@/app/frontend_superadmin/superadmin_billing/billing_member_payment_promises/components/SuperadminBillingOverviewMemberPaymentPromisesPageHeader';
import SuperadminBillingOverviewMemberPaymentPromisesTable from '@/app/frontend_superadmin/superadmin_billing/billing_member_payment_promises/components/SuperadminBillingOverviewMemberPaymentPromisesTable';
import SuperadminBillingOverviewMemberPaymentPromisesExtensionDialog from '@/app/frontend_superadmin/superadmin_billing/billing_member_payment_promises/components/SuperadminBillingOverviewMemberPaymentPromisesExtensionDialog';

export default function SuperadminBillingOverviewMemberPaymentPromisesPageClient() {
  const tCopy = useTranslations('SUPERADMIN_FINANCE');
  const [statusFilter, setStatusFilter] = useSuperadminBillingOverviewMemberPaymentPromisesUrlFilter('promiseStatus', 'all', ['all', 'pending', 'overdue', 'fulfilled'] as const);
  const [promises, setPromises] = useState<PromiseItem[]>(() => SUPERADMIN_FINANCE_SAMPLE_PAYMENT_PROMISES.map((promise) => ({ ...promise, daysUntilDue: SuperadminFinanceCalculateDaysUntilDate(promise.expectedDate) })));
  const [extendDialog, setExtendDialog] = useState<{ id: number; name: string } | null>(null);
  const extendForm = useForm<SuperadminBillingOverviewMemberPaymentPromisesExtensionValues>({ resolver: zodResolver(SuperadminBillingOverviewMemberPaymentPromisesExtensionSchema), defaultValues: { newDate: '', reason: '' }, mode: 'onChange' });
  const dialogRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const extendTriggerRef = useRef<HTMLButtonElement | null>(null);
  const filtered = promises.filter((promise) => statusFilter === 'all' || promise.status === statusFilter);

  useEffect(() => {
    if (!extendDialog) return;
    const getFocusable = () => Array.from<HTMLElement>(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])') ?? []).filter((element) => element.getAttribute('aria-hidden') !== 'true');
    dateInputRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setExtendDialog(null); extendForm.reset({ newDate: '', reason: '' }); return; }
      if (event.key !== 'Tab') return;
      const focusable = getFocusable();
      if (!focusable.length) { event.preventDefault(); dialogRef.current?.focus(); return; }
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialogRef.current?.contains(document.activeElement))) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !dialogRef.current?.contains(document.activeElement))) { event.preventDefault(); first?.focus(); }
    };
    dialogRef.current?.addEventListener('keydown', handleKeyDown);
    return () => { dialogRef.current?.removeEventListener('keydown', handleKeyDown); extendTriggerRef.current?.focus(); };
  }, [extendDialog]);

  const closeExtendDialog = () => { setExtendDialog(null); extendForm.reset({ newDate: '', reason: '' }); };
  const openExtendDialog = (promise: PromiseItem, trigger: HTMLButtonElement) => { extendTriggerRef.current = trigger; extendForm.reset({ newDate: '', reason: '' }); setExtendDialog({ id: promise.id, name: promise.studentName }); };
  const handleExtend = (values: SuperadminBillingOverviewMemberPaymentPromisesExtensionValues) => {
    if (!extendDialog) return;
    setPromises((previous) => previous.map((promise) => promise.id === extendDialog.id ? { ...promise, expectedDate: values.newDate, daysUntilDue: SuperadminFinanceCalculateDaysUntilDate(values.newDate), timesChanged: promise.timesChanged + 1, lastExtensionReason: values.reason.trim() } : promise));
    toast.message(tCopy('COPY.PROMISE_DATE_CHANGED_LOCALLY_PREVIEW'), { id: `superadmin_member_finance:promise-date-preview:${extendDialog.id}` });
    closeExtendDialog();
  };

  return <div className="space-y-6">
    <SuperadminBillingOverviewMemberPaymentPromisesPageHeader statusFilter={statusFilter} onStatusChange={setStatusFilter} />
    <SuperadminBillingOverviewMemberPaymentPromisesTable rows={filtered} onOpenExtension={openExtendDialog} />
    <SuperadminBillingOverviewMemberPaymentPromisesExtensionDialog dialog={extendDialog} form={extendForm} dialogRef={dialogRef} dateInputRef={dateInputRef} onClose={closeExtendDialog} onSubmit={handleExtend} />
  </div>;
}
