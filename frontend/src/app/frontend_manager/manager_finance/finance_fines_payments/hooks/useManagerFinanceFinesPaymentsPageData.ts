'use client';

import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import {
  MANAGER_FINANCE_SAMPLE_FINE_DASHBOARD_AMOUNTS,
  MANAGER_FINANCE_SAMPLE_PENDING_FINES,
  MANAGER_FINANCE_SAMPLE_PAYMENT_HISTORY,
  MANAGER_FINANCE_SAMPLE_RECEIPTS,
} from './ManagerFinanceFinesPaymentsDemoRepository';
import {
  IndianRupee,
  AlertCircle,
  Clock,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import type { DashboardKpiItem } from '../components/manager_finance_fines_payments_views/ManagerFinanceFinesPaymentsDashboardTab';
import type { ManagerReceiptRecord } from '../components/manager_finance_fines_payments_views/ManagerFinanceFinesPaymentsFinesAndPaymentsPage';
import type { ManagerFinanceTimeHorizon } from '../components/manager_finance_fines_payments_views/ManagerFinanceFinesPaymentsTimeHorizonBar';

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
    id: r.id,
    txnId: r.id,
    receiptNumber: r.receiptNumber,
    member: `${r.studentName} (${r.studentId})`,
    plan: r.planName,
    lateFee: Number(r.lateFee ?? 0),
    amount: Number(r.amount),
    mode: r.paymentMode,
    date: r.date.split('T')[0],
    status: r.status ?? 'Completed',
    phone: r.phone,
    email: `${r.studentName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    collectedBy: (r as unknown as { collectedBy?: string }).collectedBy ?? 'Branch Manager Satyam',
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
      return true;
    }
    return true;
  }, [timeHorizon, customStartDate, customEndDate]);

  const filteredPendingFines = useMemo(() => {
    const q = tableSearchQuery.trim().toLowerCase();
    const base = MANAGER_FINANCE_SAMPLE_PENDING_FINES.filter((f) =>
      activeTab === 'pending' ? f.status === 'Pending' : f.status === 'Partially Paid'
    );
    return base.filter((f) => {
      const matchHorizon = isDateInTimeHorizon(f.date);
      const matchType = fineTypeFilter === 'all' || f.type.toLowerCase() === fineTypeFilter.toLowerCase();
      const matchQ = !q || f.id.toLowerCase().includes(q) || f.member.toLowerCase().includes(q) || f.type.toLowerCase().includes(q);
      return matchHorizon && matchType && matchQ;
    });
  }, [tableSearchQuery, activeTab, fineTypeFilter, isDateInTimeHorizon]);

  const filteredHistoryRows = useMemo(() => {
    const q = tableSearchQuery.trim().toLowerCase();
    return MANAGER_FINANCE_SAMPLE_PAYMENT_HISTORY.filter((h) => {
      const matchHorizon = isDateInTimeHorizon(h.date);
      const matchMode = historyModeFilter === 'all' || h.mode.toLowerCase() === historyModeFilter.toLowerCase();
      const matchQ = !q || (h.receipt && h.receipt.toLowerCase().includes(q)) || h.id.toLowerCase().includes(q) || h.member.toLowerCase().includes(q) || h.type.toLowerCase().includes(q) || h.collectedBy.toLowerCase().includes(q);
      return matchHorizon && matchMode && matchQ;
    });
  }, [tableSearchQuery, historyModeFilter, isDateInTimeHorizon]);

  const filteredReceiptRows = useMemo(() => {
    const q = tableSearchQuery.trim().toLowerCase();
    return receiptRows.filter((r) => {
      const matchHorizon = isDateInTimeHorizon(r.date);
      const matchMode = receiptModeFilter === 'all' || r.mode.toLowerCase() === receiptModeFilter.toLowerCase();
      const matchQ = !q || r.txnId.toLowerCase().includes(q) || r.receiptNumber.toLowerCase().includes(q) || r.member.toLowerCase().includes(q) || r.plan.toLowerCase().includes(q) || r.phone.includes(q) || r.collectedBy.toLowerCase().includes(q);
      return matchHorizon && matchMode && matchQ;
    });
  }, [tableSearchQuery, receiptRows, receiptModeFilter, isDateInTimeHorizon]);

  const dashboardKpis = useMemo<DashboardKpiItem[]>(() => {
    const base = MANAGER_FINANCE_SAMPLE_FINE_DASHBOARD_AMOUNTS;
    const factor = timeHorizon === 'today' ? 1 : timeHorizon === 'this_week' ? 5.2 : timeHorizon === 'all' ? 28 : 22;
    const todaysVal = Math.round(base.todaysCollection * factor);
    const sub = timeHorizon === 'today' ? 'Collected today' : timeHorizon === 'this_week' ? 'Collected this week' : timeHorizon === 'all' ? 'All-time collections' : 'Collected this month';
    return [
      { id: 'todaysCollection', labelKey: 'todays_collection', value: formatCurrency(todaysVal), subtitle: sub, icon: IndianRupee, color: 'text-success', bg: 'bg-success-bg border-border', targetTab: 'receipts', filterType: 'all' },
      { id: 'totalPending', labelKey: 'total_pending_fines', value: formatCurrency(base.totalPendingFines), subtitle: 'Pending dues', icon: AlertCircle, color: 'text-danger', bg: 'bg-danger-bg border-border', targetTab: 'pending', filterType: 'all' },
      { id: 'overdueFines', labelKey: 'overdue_fines_kpi', value: formatCurrency(base.overdueFines), subtitle: 'Requires immediate follow-up', icon: Clock, color: 'text-warning', bg: 'bg-warning-bg border-border', targetTab: 'pending', filterType: 'all' },
      { id: 'lostBookCharges', labelKey: 'lost_book_charges_kpi', value: formatCurrency(base.lostBookCharges), subtitle: 'Replacement penalties', icon: FileText, color: 'text-info', bg: 'bg-info-bg border-border', targetTab: 'pending', filterType: 'Lost Book Charge' },
      { id: 'damageCharges', labelKey: 'damage_charges_kpi', value: formatCurrency(base.damageCharges), subtitle: 'Property restitution', icon: AlertTriangle, color: 'text-purple', bg: 'bg-purple-bg border-border', targetTab: 'pending', filterType: 'Damage Charge' },
    ];
  }, [timeHorizon, formatCurrency]);

  const timeHorizonLabel = useMemo(() => {
    switch (timeHorizon) {
      case 'all': return 'All Time';
      case 'today': return 'Today';
      case 'this_week': return 'This Week';
      case 'this_month': return 'This Month';
      case 'custom': return customStartDate && customEndDate ? `${customStartDate} to ${customEndDate}` : 'Custom Range';
      default: return 'This Month';
    }
  }, [timeHorizon, customStartDate, customEndDate]);

  const handleExportReceiptsCsv = () => {
    const headers = `Receipts Ledger Export - Scope: ${timeHorizonLabel}\nTransaction ID,Receipt Number,Member,Plan,Late Fee,Amount,Mode,Date,Collected By,Status\n`;
    const rows = filteredReceiptRows.map((r) => `"${r.txnId}","${r.receiptNumber}","${r.member}","${r.plan}","${r.lateFee}","${r.amount}","${r.mode}","${r.date}","${r.collectedBy}","${r.status}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipts_ledger_${timeHorizonLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Receipts exported to CSV successfully');
  };

  const escapeCsv = (val: unknown) => {
    let s = String(val ?? '');
    if (/^[\u0000-\u0020]*[=+\-@]/.test(s)) s = `'${s}`;
    return `"${s.replace(/"/g, '""')}"`;
  };

  const handleExportPendingFinesCsv = () => {
    const headers = ['Fine ID', 'Member', 'Type', 'Amount', 'Date', 'Status'].map(escapeCsv).join(',');
    const rows = filteredPendingFines.map((f) => [f.id, f.member, f.type, f.amount, f.date, f.status].map(escapeCsv).join(',')).join('\r\n');
    const blob = new Blob([`\uFEFF${headers}\r\n${rows}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fines_${activeTab}_${timeHorizonLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.hidden = true;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(`Fines (${activeTab}) exported to CSV successfully`);
  };

  const handleExportHistoryCsv = () => {
    const headers = ['Receipt', 'Member', 'Fine Type', 'Amount', 'Payment Mode', 'Date Time', 'Collected By'].map(escapeCsv).join(',');
    const rows = filteredHistoryRows.map((h) => [h.receipt || '', h.member, h.type, h.amount, h.mode, h.date, h.collectedBy].map(escapeCsv).join(',')).join('\r\n');
    const blob = new Blob([`\uFEFF${headers}\r\n${rows}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment_history_${timeHorizonLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.hidden = true;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success('Payment history exported to CSV successfully');
  };

  const handleShareWhatsApp = (r: ManagerReceiptRecord) => {
    const text = encodeURIComponent(`Hello ${r.member}, your Library fee receipt #${r.receiptNumber} (${r.plan}) of ${formatCurrency(r.amount)} is confirmed. Txn ID: ${r.txnId}.`);
    let digits = (r.phone || '').replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
    const targetPhone = digits.length === 10 ? `91${digits}` : digits;
    const popup = window.open(`https://wa.me/${targetPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;
    toast.success(`WhatsApp receipt link generated for ${r.member}`);
  };

  const handleShareEmail = (r: ManagerReceiptRecord) => {
    const subject = encodeURIComponent(`Library Receipt #${r.receiptNumber} - ${r.plan}`);
    const body = encodeURIComponent(`Dear ${r.member},\n\nHere is your receipt for ${r.plan}.\nReceipt No: ${r.receiptNumber}\nTxn ID: ${r.txnId}\nAmount: ${formatCurrency(r.amount)}\nLate Fee: ${formatCurrency(r.lateFee)}\nStatus: ${r.status}\nDate: ${r.date}\n\nThank you,\nLibrary Management`);
    window.location.href = `mailto:${r.email}?subject=${subject}&body=${body}`;
    toast.success(`Email client opened for ${r.email}`);
  };

  const handleShareSms = (r: ManagerReceiptRecord) => {
    toast.success(`SMS receipt dispatched to +91 ${r.phone} for Txn ${r.txnId}`);
  };

  return {
    timeHorizon,
    setTimeHorizon,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    timeHorizonLabel,
    receiptRows,
    filteredPendingFines,
    filteredHistoryRows,
    filteredReceiptRows,
    dashboardKpis,
    handleExportReceiptsCsv,
    handleExportPendingFinesCsv,
    handleExportHistoryCsv,
    handleShareWhatsApp,
    handleShareEmail,
    handleShareSms,
    translateFineType,
    translatePaymentMode,
  };
}

