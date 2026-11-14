'use client';

/** Responsibility: Orchestrate daily settlement preview state and compose the leaf-owned header, summary and table components. */
/** Data-Flow: route -> local sample fixtures/state -> localized page components; settle action is browser-only preview state. */
import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'next-intl';
import { useSuperadminAccountingDailySettlementConfirm } from '@/app/frontend_superadmin/superadmin_accounting/accounting_daily_settlement/hooks/useSuperadminAccountingDailySettlementConfirm';
import { useSuperadminAccountingDailySettlementUrlFilter } from '@/app/frontend_superadmin/superadmin_accounting/accounting_daily_settlement/hooks/useSuperadminAccountingDailySettlementUrlFilter';
import { formatSuperadminAccountingMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_accounting/accounting_daily_settlement/utils/SuperadminAccountingDailySettlementFormatters';
import { SUPERADMIN_ACCOUNTING_SAMPLE_SETTLEMENTS, SUPERADMIN_ACCOUNTING_SETTLEMENT_SAMPLE_DATE } from '@/app/frontend_superadmin/superadmin_accounting/accounting_daily_settlement/mocks/fixtures/SuperadminAccountingDailySettlementSettlementMockFixtures';
import type { SuperadminAccountingSettlementEntry } from '@/app/frontend_superadmin/superadmin_accounting/accounting_daily_settlement/types/superadmin_accounting_daily_settlement.types';
import type { SemanticCellParams, SemanticColumnDef } from '@/app/frontend_superadmin/superadmin_accounting/accounting_daily_settlement/types/superadmin_accounting_daily_settlement.types';
import SuperadminAccountingDailySettlementPageHeader from '@/app/frontend_superadmin/superadmin_accounting/accounting_daily_settlement/components/SuperadminAccountingDailySettlementPageHeader';
import SuperadminAccountingDailySettlementSummaryCards from '@/app/frontend_superadmin/superadmin_accounting/accounting_daily_settlement/components/SuperadminAccountingDailySettlementSummaryCards';
import SuperadminAccountingDailySettlementTableSection from '@/app/frontend_superadmin/superadmin_accounting/accounting_daily_settlement/components/SuperadminAccountingDailySettlementTableSection';

function getSuperadminInteractiveTestIdSuffix(value: unknown): string {
  const record = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  for (const field of ['id', 'uuid', 'recordId', 'userId', 'assetId', 'libraryId', 'planId', 'subscriptionId', 'transactionId', 'invoiceId', 'refundId', 'requestId', 'ruleId', 'messageId', 'noticeId', 'complaintId', 'entryId', 'backupId', 'enquiryId', 'studentId', 'memberId', 'branchId', 'scheduleId', 'logId', 'smartId', 'receiptNumber', 'ticketId', 'lockerId', 'seatNo', 'code', 'slug', 'key', 'name']) {
    const candidate = record[field];
    if (typeof candidate === 'string' || typeof candidate === 'number') return String(candidate);
  }
  return 'missing-domain-id';
}


export default function SuperadminAccountingDailySettlementPageClient() {
  const confirm = useSuperadminAccountingDailySettlementConfirm();
  const tCopy = useTranslations('SUPERADMIN_ACCOUNTING');
  const locale = useLocale();
  const shiftLabels: Record<string, string> = {
    Morning: tCopy('COPY.MORNING'),
    Afternoon: tCopy('COPY.AFTERNOON'),
    Evening: tCopy('COPY.EVENING'),
    Night: tCopy('COPY.NIGHT'),
  };
  const translateShift = (value: string) => shiftLabels[value] ?? tCopy('COPY.SHIFT');
  const [date, setDate] = useSuperadminAccountingDailySettlementUrlFilter('settlementDate', SUPERADMIN_ACCOUNTING_SETTLEMENT_SAMPLE_DATE);
  const [entries, setEntries] = useState<SuperadminAccountingSettlementEntry[]>(() => SUPERADMIN_ACCOUNTING_SAMPLE_SETTLEMENTS.map((entry) => ({ ...entry })));
  const visibleEntries = entries.filter((entry) => entry.date === date);

  const handleSettle = async (id: number) => {
    const entry = entries.find((item) => item.id === id);
    if (!entry || entry.status === 'settled') return;
    const confirmed = await confirm(tCopy('COPY.CONFIRM_SAMPLE_SETTLEMENT', { shift: translateShift(entry.shift) }));
    if (!confirmed) return;
    setEntries((previous) => previous.map((item) => item.id === id ? { ...item, status: 'settled', settledBy: 'Sample Operator (preview)' } : item));
    toast.message(tCopy('COPY.PREVIEW_ONLY_SETTLEMENT_STATE_CHANGED_IN_THIS_BROWSER_NO_TRANSACTION_WAS_SUBMITTED'), { id: `superadmin_accounting:SuperadminAccountingDailySettlementPageClient:${id}` });
  };

  const totalCash = visibleEntries.reduce((sum, entry) => sum + entry.cashCollected, 0);
  const totalUpi = visibleEntries.reduce((sum, entry) => sum + entry.upiCollected, 0);
  const totalExpenses = visibleEntries.reduce((sum, entry) => sum + entry.expenses, 0);

  const columnDefs: SemanticColumnDef<SuperadminAccountingSettlementEntry>[] = [
    { field: 'shift', headerName: tCopy('COPY.SHIFT'), flex: 1, minWidth: 180, cellRenderer: (params: SemanticCellParams<SuperadminAccountingSettlementEntry>) => <span className="acct-cell-name font-medium">{translateShift(String(params.value ?? ''))}</span> },
    { field: 'openingBalance', headerName: tCopy('COPY.TABLE_COLUMN_OPENING'), width: 130, cellStyle: { textAlign: 'right' }, cellRenderer: (params: SemanticCellParams<SuperadminAccountingSettlementEntry>) => <span className="acct-cell-subtext text-sm">{formatSuperadminAccountingMajorPreviewCurrency(Number(params.value ?? 0), 'INR', locale)}</span> },
    { field: 'cashCollected', headerName: tCopy('COPY.TABLE_COLUMN_CASH'), width: 120, cellStyle: { textAlign: 'right' }, cellRenderer: (params: SemanticCellParams<SuperadminAccountingSettlementEntry>) => <span className="acct-text-success font-medium">{formatSuperadminAccountingMajorPreviewCurrency(Number(params.value ?? 0), 'INR', locale)}</span> },
    { field: 'upiCollected', headerName: tCopy('COPY.TABLE_COLUMN_UPI'), width: 120, cellStyle: { textAlign: 'right' }, cellRenderer: (params: SemanticCellParams<SuperadminAccountingSettlementEntry>) => <span className="acct-text-info font-medium">{formatSuperadminAccountingMajorPreviewCurrency(Number(params.value ?? 0), 'INR', locale)}</span> },
    { field: 'expenses', headerName: tCopy('COPY.TABLE_COLUMN_EXPENSES'), width: 130, cellStyle: { textAlign: 'right' }, cellRenderer: (params: SemanticCellParams<SuperadminAccountingSettlementEntry>) => <span className="acct-text-danger font-medium">{formatSuperadminAccountingMajorPreviewCurrency(Number(params.value ?? 0), 'INR', locale)}</span> },
    { field: 'closingBalance', headerName: tCopy('COPY.TABLE_COLUMN_CLOSING'), width: 130, cellStyle: { textAlign: 'right', fontWeight: 600 }, cellRenderer: (params: SemanticCellParams<SuperadminAccountingSettlementEntry>) => <span className="acct-text-body">{formatSuperadminAccountingMajorPreviewCurrency(Number(params.value ?? 0), 'INR', locale)}</span> },
    { field: 'settledBy', headerName: tCopy('COPY.TABLE_COLUMN_SETTLED_BY'), width: 140, cellRenderer: (params: SemanticCellParams<SuperadminAccountingSettlementEntry>) => <span className="acct-cell-subtext">{String(params.value ?? '—')}</span> },
    { field: 'status', headerName: tCopy('COPY.STATUS'), width: 120, cellRenderer: (params: SemanticCellParams<SuperadminAccountingSettlementEntry>) => <span className={`acct-badge ${params.data.status === 'settled' ? 'acct-badge--success' : 'acct-badge--warning'} inline-block mt-2`}>{params.data.status === 'settled' ? tCopy('COPY.SETTLED') : tCopy('COPY.PENDING')}</span> },
    { headerName: tCopy('COPY.ACTION'), width: 120, sortable: false, cellStyle: { textAlign: 'right' }, cellRenderer: (params: SemanticCellParams<SuperadminAccountingSettlementEntry>) => params.data.status === 'pending' ? <div className="h-full flex justify-end items-center"><button type="button" className="acct-badge acct-badge--success cursor-pointer hover:bg-success hover:text-on-success motion-safe:transition-colors motion-reduce:transition-none motion-safe:duration-200" onClick={() => handleSettle(params.data.id)} data-testid={`superadmin-accounting-accounting-daily-settlement-settle-1-${getSuperadminInteractiveTestIdSuffix(params.data)}`}><CheckCircle size={18} className="mr-1" aria-hidden="true" />{tCopy('COPY.SETTLE')}</button></div> : null },
  ];

  return <div className="space-y-6">
    <SuperadminAccountingDailySettlementPageHeader date={date} onDateChange={setDate} />
    <SuperadminAccountingDailySettlementSummaryCards cash={totalCash} upi={totalUpi} expenses={totalExpenses} locale={locale} />
    <SuperadminAccountingDailySettlementTableSection rows={visibleEntries} columnDefs={columnDefs} />
  </div>;
}
