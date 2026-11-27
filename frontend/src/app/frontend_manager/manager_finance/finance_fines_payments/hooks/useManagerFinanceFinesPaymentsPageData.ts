'use client';

import type { DashboardKpiItem } from '@/app/frontend_manager/manager_finance/finance_fines_payments/components/manager_finance_fines_payments_views/ManagerFinanceFinesPaymentsDashboardTab';
import type { ManagerReceiptRecord } from '@/app/frontend_manager/manager_finance/finance_fines_payments/components/manager_finance_fines_payments_views/ManagerFinanceFinesPaymentsFinesAndPaymentsPage';
import type { ManagerFinanceTimeHorizon } from '@/app/frontend_manager/manager_finance/finance_fines_payments/components/manager_finance_fines_payments_views/ManagerFinanceFinesPaymentsTimeHorizonBar';
import {
  MANAGER_FINANCE_SAMPLE_FINE_DASHBOARD_AMOUNTS,
  MANAGER_FINANCE_SAMPLE_PAYMENT_HISTORY,
  MANAGER_FINANCE_SAMPLE_PENDING_FINES,
  MANAGER_FINANCE_SAMPLE_RECEIPTS,
} from '@/app/frontend_manager/manager_finance/finance_fines_payments/hooks/ManagerFinanceFinesPaymentsDemoRepository';
import {
  exportPaymentHistoryCsv,
  exportPendingFinesCsv,
  exportReceiptsLedgerCsv,
  shareReceiptViaEmail,
  shareReceiptViaSms,
  shareReceiptViaWhatsApp,
} from '@/app/frontend_manager/manager_finance/finance_fines_payments/utils/ManagerFinanceFinesPaymentsExportAndShare';
import { AlertCircle, AlertTriangle, Clock, FileText, IndianRupee } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

export interface UseManagerFinanceFinesPaymentsPageDataParams {
  formatCurrency: (n: number) => string;
  activeTab: string;
  tableSearchQuery: string;
  fineTypeFilter: string;
  historyModeFilter: string;
  receiptModeFilter: string;
  tManagerUi: (k: string) => string;
}

export function useManagerFinanceFinesPaymentsPageData({
  formatCurrency,
  activeTab,
  tableSearchQuery,
  fineTypeFilter,
  historyModeFilter,
  receiptModeFilter,
  tManagerUi,
}: UseManagerFinanceFinesPaymentsPageDataParams) {
  const [timeHorizon, setTimeHorizon] = useState<ManagerFinanceTimeHorizon>('this_month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const translateFineType = useCallback((value: unknown) => {
    switch (String(value ?? '')) {
      case 'Overdue Book': return tManagerUi('overdue_book');
      case 'Lost Book Charge': return tManagerUi('lost_book_charge');
      case 'Damage Charge': return tManagerUi('damage_charge');
      case 'Late Fee': return tManagerUi('late_fee');
      default: return String(value ?? '');
    }
  }, [tManagerUi]);

  const translatePaymentMode = useCallback((value: unknown) => {
    const mode = String(value ?? '').trim().toLowerCase();
    if (mode === 'cash') return tManagerUi('cash');
    if (mode === 'upi') return tManagerUi('upi');
    if (mode === 'card') return tManagerUi('card');
    if (mode === 'bank' || mode === 'bank transfer') return tManagerUi('bank');
    return String(value ?? '');
  }, [tManagerUi]);

  const receiptRows = useMemo<ManagerReceiptRecord[]>(() => MANAGER_FINANCE_SAMPLE_RECEIPTS.map((r) => ({
    id: r.id, txnId: r.id, receiptNumber: r.receiptNumber, member: `${r.studentName} (${r.studentId})`, plan: r.planName,
    lateFee: Number((r as { lateFee?: number }).lateFee ?? 0), amount: Number(r.amount), mode: r.paymentMode,
    date: r.date.split('T')[0], status: (r as { status?: string }).status ?? 'Completed', phone: r.phone,
    email: `${r.studentName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    collectedBy: (r as { collectedBy?: string }).collectedBy ?? 'Branch Manager Satyam',
  })), []);

  const isDateInTimeHorizon = useCallback((dateStr: string) => {
    if (timeHorizon === 'all') return true;
    const parsed = Date.parse(dateStr);
    if (Number.isNaN(parsed)) return true;
    const d = new Date(parsed);
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    if (timeHorizon === 'today') return d.getTime() >= startOfToday && d.getTime() < startOfToday + 86400000;
    if (timeHorizon === 'this_week') {
      const startOfWeek = startOfToday - ((now.getDay() || 7) - 1) * 86400000;
      return d.getTime() >= startOfWeek && d.getTime() <= startOfWeek + 7 * 86400000;
    }
    if (timeHorizon === 'this_month') return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    if (timeHorizon === 'custom') {
      if (customStartDate && d.getTime() < new Date(`${customStartDate}T00:00:00`).getTime()) return false;
      if (customEndDate && d.getTime() > new Date(`${customEndDate}T23:59:59`).getTime()) return false;
    }
    return true;
  }, [timeHorizon, customStartDate, customEndDate]);

  const q = tableSearchQuery.trim().toLowerCase();
  const filteredPendingFines = useMemo(() => MANAGER_FINANCE_SAMPLE_PENDING_FINES
    .filter((f) => activeTab === 'pending' ? f.status === 'Pending' : f.status === 'Partially Paid')
    .filter((f) => isDateInTimeHorizon(f.date) && (fineTypeFilter === 'all' || f.type.toLowerCase() === fineTypeFilter.toLowerCase()) && (!q || f.id.toLowerCase().includes(q) || f.member.toLowerCase().includes(q) || f.type.toLowerCase().includes(q))),
    [q, activeTab, fineTypeFilter, isDateInTimeHorizon]);

  const filteredHistoryRows = useMemo(() => MANAGER_FINANCE_SAMPLE_PAYMENT_HISTORY.filter((h) =>
    isDateInTimeHorizon(h.date) && (historyModeFilter === 'all' || h.mode.toLowerCase() === historyModeFilter.toLowerCase()) &&
    (!q || (h.receipt && h.receipt.toLowerCase().includes(q)) || h.id.toLowerCase().includes(q) || h.member.toLowerCase().includes(q) || h.type.toLowerCase().includes(q) || h.collectedBy.toLowerCase().includes(q))
  ), [q, historyModeFilter, isDateInTimeHorizon]);

  const filteredReceiptRows = useMemo(() => receiptRows.filter((r) =>
    isDateInTimeHorizon(r.date) && (receiptModeFilter === 'all' || r.mode.toLowerCase() === receiptModeFilter.toLowerCase()) &&
    (!q || r.txnId.toLowerCase().includes(q) || r.receiptNumber.toLowerCase().includes(q) || r.member.toLowerCase().includes(q) || r.plan.toLowerCase().includes(q) || r.phone.includes(q) || r.collectedBy.toLowerCase().includes(q))
  ), [q, receiptRows, receiptModeFilter, isDateInTimeHorizon]);

  const dashboardKpis = useMemo<DashboardKpiItem[]>(() => {
    const base = MANAGER_FINANCE_SAMPLE_FINE_DASHBOARD_AMOUNTS;
    const factor = timeHorizon === 'today' ? 1 : timeHorizon === 'this_week' ? 5.2 : timeHorizon === 'all' ? 28 : 22;
    const sub = timeHorizon === 'today' ? 'Collected today' : timeHorizon === 'this_week' ? 'Collected this week' : timeHorizon === 'all' ? 'All-time collections' : 'Collected this month';
    return [
      { id: 'todaysCollection', labelKey: 'todays_collection', value: formatCurrency(Math.round(base.todaysCollection * factor)), subtitle: sub, icon: IndianRupee, color: 'text-success', bg: 'bg-success-bg border-border', targetTab: 'receipts', filterType: 'all' },
      { id: 'totalPending', labelKey: 'total_pending_fines', value: formatCurrency(base.totalPendingFines), subtitle: 'Pending dues', icon: AlertCircle, color: 'text-danger', bg: 'bg-danger-bg border-border', targetTab: 'pending', filterType: 'all' },
      { id: 'overdueFines', labelKey: 'overdue_fines_kpi', value: formatCurrency(base.overdueFines), subtitle: 'Requires immediate follow-up', icon: Clock, color: 'text-warning', bg: 'bg-warning-bg border-border', targetTab: 'pending', filterType: 'all' },
      { id: 'lostBookCharges', labelKey: 'lost_book_charges_kpi', value: formatCurrency(base.lostBookCharges), subtitle: 'Replacement penalties', icon: FileText, color: 'text-info', bg: 'bg-info-bg border-border', targetTab: 'pending', filterType: 'Lost Book Charge' },
      { id: 'damageCharges', labelKey: 'damage_charges_kpi', value: formatCurrency(base.damageCharges), subtitle: 'Property restitution', icon: AlertTriangle, color: 'text-purple', bg: 'bg-purple-bg border-border', targetTab: 'pending', filterType: 'Damage Charge' },
    ];
  }, [timeHorizon, formatCurrency]);

  const timeHorizonLabel = useMemo(() => {
    if (timeHorizon === 'all') return 'All Time';
    if (timeHorizon === 'today') return 'Today';
    if (timeHorizon === 'this_week') return 'This Week';
    if (timeHorizon === 'custom') return customStartDate && customEndDate ? `${customStartDate} to ${customEndDate}` : 'Custom Range';
    return 'This Month';
  }, [timeHorizon, customStartDate, customEndDate]);

  return {
    timeHorizon, setTimeHorizon, customStartDate, setCustomStartDate, customEndDate, setCustomEndDate,
    timeHorizonLabel, receiptRows, filteredPendingFines, filteredHistoryRows, filteredReceiptRows, dashboardKpis,
    handleExportReceiptsCsv: () => exportReceiptsLedgerCsv(filteredReceiptRows, timeHorizonLabel),
    handleExportPendingFinesCsv: () => exportPendingFinesCsv(filteredPendingFines, activeTab, timeHorizonLabel),
    handleExportHistoryCsv: () => exportPaymentHistoryCsv(filteredHistoryRows, timeHorizonLabel),
    handleShareWhatsApp: (r: ManagerReceiptRecord) => shareReceiptViaWhatsApp(r, formatCurrency),
    handleShareEmail: (r: ManagerReceiptRecord) => shareReceiptViaEmail(r, formatCurrency),
    handleShareSms: shareReceiptViaSms,
    translateFineType, translatePaymentMode,
  };
}
