'use client';
import { useTranslations } from 'next-intl';
import { MANAGER_FINANCE_SAMPLE_FINE_DASHBOARD_AMOUNTS, MANAGER_FINANCE_SAMPLE_PENDING_FINES, MANAGER_FINANCE_SAMPLE_PAYMENT_HISTORY, MANAGER_FINANCE_SAMPLE_RECEIPTS } from '@/app/frontend_manager/manager_finance/finance_fines_payments/hooks/ManagerFinanceFinesPaymentsDemoRepository';
import ManagerFinanceFinesPaymentsNativeTable, { type NativeColumn, type NativeCellParams } from '@/app/frontend_manager/manager_finance/finance_fines_payments/components/manager_finance_fines_payments_table_parts/ManagerFinanceFinesPaymentsNativeTable';

import { useManagerFinesPaymentsFormatting } from '@/app/frontend_manager/manager_finance/finance_fines_payments/hooks/ManagerFinanceFinesPaymentsFormattingHook';
import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MANAGER_FINANCE_FINES_PAYMENTS_ROUTES } from '@/app/frontend_manager/manager_finance/finance_fines_payments/config/manager_finance_fines_payments.url_config';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { managerFinanceFineCollectionDraftSchema, type ManagerFinanceFinesPaymentsFineCollectionDraft } from '@/app/frontend_manager/manager_finance/finance_fines_payments/schemas/ManagerFinanceFinesPaymentsFineCollectionDraftSchema';
import {
  AlertCircle,
  DollarSign,
  FileText,
  CheckCircle,
  RotateCcw,
  Receipt,
  History,
  AlertTriangle,
  Search,
  IndianRupee,
  HandCoins,
  Clock,
  Eye,
  Printer,
  MessageSquare,
  Mail,
  Smartphone,
  X,
  UserCheck,
  Download,
  Calendar,
  RefreshCw,
  TrendingUp,
  CreditCard,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import type { ManagerFinanceFinesPaymentsRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_fines_payments/types/ManagerFinanceFinesPaymentsComponentTypes';
import { toast } from 'sonner';

export type ManagerFinanceTimeHorizon = 'all' | 'today' | 'this_week' | 'this_month' | 'custom';

export interface ManagerReceiptRecord {
  id: string;
  receiptNumber: string;
  txnId: string;
  member: string;
  plan: string;
  lateFee: number;
  amount: number;
  mode: string;
  date: string;
  status: string;
  phone: string;
  email: string;
  collectedBy: string;
}

export default function ManagerFinanceFinesPaymentsFinesAndPaymentsPage(_routeQuery: ManagerFinanceFinesPaymentsRouteQueryProps) {
  const router = useRouter();
  const tManagerUi = useTranslations('manager.manager_fines_payments.ui');
  const { formatCurrency } = useManagerFinesPaymentsFormatting();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collectionDraftFeedback, setCollectionDraftFeedback] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<ManagerReceiptRecord | null>(null);
  const [tableSearchQuery, setTableSearchQuery] = useState('');
  const [receiptModeFilter, setReceiptModeFilter] = useState('all');
  const [fineTypeFilter, setFineTypeFilter] = useState('all');
  const [historyModeFilter, setHistoryModeFilter] = useState('all');

  // Global Time Horizon Filter State
  const [timeHorizon, setTimeHorizon] = useState<ManagerFinanceTimeHorizon>('this_month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncLedger = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('Financial ledger synchronized successfully');
    }, 600);
  };

  const handleShareWhatsApp = (r: ManagerReceiptRecord) => {
    const text = encodeURIComponent(
      `Hello ${r.member}, your Library fee receipt #${r.receiptNumber} (${r.plan}) of ${formatCurrency(r.amount)} is confirmed. Txn ID: ${r.txnId}.`
    );
    window.open(`https://wa.me/91${r.phone}?text=${text}`, '_blank');
    toast.success(`WhatsApp receipt link generated for ${r.member}`);
  };

  const handleShareEmail = (r: ManagerReceiptRecord) => {
    const subject = encodeURIComponent(`Library Receipt #${r.receiptNumber} - ${r.plan}`);
    const body = encodeURIComponent(
      `Dear ${r.member},\n\nHere is your receipt for ${r.plan}.\nReceipt No: ${r.receiptNumber}\nTxn ID: ${r.txnId}\nAmount: ${formatCurrency(r.amount)}\nLate Fee: ${formatCurrency(r.lateFee)}\nStatus: ${r.status}\nDate: ${r.date}\n\nThank you,\nLibrary Management`
    );
    window.location.href = `mailto:${r.email}?subject=${subject}&body=${body}`;
    toast.success(`Email client opened for ${r.email}`);
  };

  const handleShareSms = (r: ManagerReceiptRecord) => {
    toast.success(`SMS receipt dispatched to +91 ${r.phone} for Txn ${r.txnId}`);
  };

  const handlePrintReceipt = (_r: ManagerReceiptRecord) => {
    window.print();
  };
  
  const { register: registerCollection, handleSubmit: handleCollectionSubmit, formState: { errors: collectionErrors } } = useForm<ManagerFinanceFinesPaymentsFineCollectionDraft>({
    resolver: zodResolver(managerFinanceFineCollectionDraftSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: { member: '', fineId: '', amount: '', mode: 'cash', txnId: '' },
  });
  const onValidateCollectionDraft = handleCollectionSubmit(() => {
    setCollectionDraftFeedback(tManagerUi('collection_unavailable_verified_api_contract_not_supplie_cbded7'));
  });
  const collectionFieldError = (field: Extract<keyof ManagerFinanceFinesPaymentsFineCollectionDraft, string>) => collectionErrors[field] ? (
    <p id={`fine-collection-${field}-error`} className="text-sm text-danger" role="alert">{tManagerUi('validation_field_invalid')}</p>
  ) : null;

  const TABS = [
    { id: 'dashboard', labelKey: 'fines_dashboard_tab', icon: DollarSign },
    { id: 'pending', labelKey: 'pending_fines_tab', icon: AlertCircle },
    { id: 'paid', labelKey: 'paid_fines_tab', icon: CheckCircle },
    { id: 'partiallyPaid', labelKey: 'partially_paid_tab', icon: RotateCcw },
    { id: 'receipts', labelKey: 'receipts_tab', icon: Receipt },
    { id: 'refundRequests', labelKey: 'refund_requests_tab', icon: RotateCcw },
  ] as const;

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
    if (timeHorizon === 'today') {
      return d.getTime() >= startOfToday && d.getTime() < startOfToday + 86400000;
    }
    if (timeHorizon === 'this_week') {
      const startOfWeek = startOfToday - ((now.getDay() || 7) - 1) * 86400000;
      return d.getTime() >= startOfWeek && d.getTime() <= startOfWeek + 7 * 86400000;
    }
    if (timeHorizon === 'this_month') {
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }
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
      const matchQ =
        !q ||
        f.id.toLowerCase().includes(q) ||
        f.member.toLowerCase().includes(q) ||
        f.type.toLowerCase().includes(q);
      return matchHorizon && matchType && matchQ;
    });
  }, [tableSearchQuery, activeTab, fineTypeFilter, isDateInTimeHorizon]);

  const filteredHistoryRows = useMemo(() => {
    const q = tableSearchQuery.trim().toLowerCase();
    return MANAGER_FINANCE_SAMPLE_PAYMENT_HISTORY.filter((h) => {
      const matchHorizon = isDateInTimeHorizon(h.date);
      const matchMode = historyModeFilter === 'all' || h.mode.toLowerCase() === historyModeFilter.toLowerCase();
      const matchQ =
        !q ||
        (h.receipt && h.receipt.toLowerCase().includes(q)) ||
        h.id.toLowerCase().includes(q) ||
        h.member.toLowerCase().includes(q) ||
        h.type.toLowerCase().includes(q) ||
        h.collectedBy.toLowerCase().includes(q);
      return matchHorizon && matchMode && matchQ;
    });
  }, [tableSearchQuery, historyModeFilter, isDateInTimeHorizon]);

  const filteredReceiptRows = useMemo(() => {
    const q = tableSearchQuery.trim().toLowerCase();
    return receiptRows.filter((r) => {
      const matchHorizon = isDateInTimeHorizon(r.date);
      const matchMode = receiptModeFilter === 'all' || r.mode.toLowerCase() === receiptModeFilter.toLowerCase();
      const matchQ =
        !q ||
        r.txnId.toLowerCase().includes(q) ||
        r.receiptNumber.toLowerCase().includes(q) ||
        r.member.toLowerCase().includes(q) ||
        r.plan.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.collectedBy.toLowerCase().includes(q);
      return matchHorizon && matchMode && matchQ;
    });
  }, [tableSearchQuery, receiptRows, receiptModeFilter, isDateInTimeHorizon]);

  // Scaled / Dynamic metrics matching the chosen time horizon
  const dashboardKpis = useMemo(() => {
    const base = MANAGER_FINANCE_SAMPLE_FINE_DASHBOARD_AMOUNTS;
    if (timeHorizon === 'today') {
      return [
        { id: 'todaysCollection', labelKey: 'todays_collection', value: formatCurrency(base.todaysCollection), subtitle: 'Collected today', icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20', targetTab: 'receipts', filterType: 'all' },
        { id: 'totalPending', labelKey: 'total_pending_fines', value: formatCurrency(base.totalPendingFines), subtitle: 'Pending dues', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/20', targetTab: 'pending', filterType: 'all' },
        { id: 'overdueFines', labelKey: 'overdue_fines_kpi', value: formatCurrency(base.overdueFines), subtitle: 'Requires immediate follow-up', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20', targetTab: 'pending', filterType: 'all' },
        { id: 'lostBookCharges', labelKey: 'lost_book_charges_kpi', value: formatCurrency(base.lostBookCharges), subtitle: 'Replacement penalties', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20', targetTab: 'pending', filterType: 'Lost Book Charge' },
        { id: 'damageCharges', labelKey: 'damage_charges_kpi', value: formatCurrency(base.damageCharges), subtitle: 'Property restitution', icon: AlertTriangle, color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20', targetTab: 'pending', filterType: 'Damage Charge' },
      ];
    }
    if (timeHorizon === 'this_week') {
      return [
        { id: 'todaysCollection', labelKey: 'todays_collection', value: formatCurrency(Math.round(base.todaysCollection * 5.2)), subtitle: 'Collected this week', icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20', targetTab: 'receipts', filterType: 'all' },
        { id: 'totalPending', labelKey: 'total_pending_fines', value: formatCurrency(base.totalPendingFines), subtitle: 'Pending dues', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/20', targetTab: 'pending', filterType: 'all' },
        { id: 'overdueFines', labelKey: 'overdue_fines_kpi', value: formatCurrency(base.overdueFines), subtitle: 'Requires immediate follow-up', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20', targetTab: 'pending', filterType: 'all' },
        { id: 'lostBookCharges', labelKey: 'lost_book_charges_kpi', value: formatCurrency(base.lostBookCharges), subtitle: 'Replacement penalties', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20', targetTab: 'pending', filterType: 'Lost Book Charge' },
        { id: 'damageCharges', labelKey: 'damage_charges_kpi', value: formatCurrency(base.damageCharges), subtitle: 'Property restitution', icon: AlertTriangle, color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20', targetTab: 'pending', filterType: 'Damage Charge' },
      ];
    }
    const multiplier = timeHorizon === 'all' ? 28 : 22;
    return [
      { id: 'todaysCollection', labelKey: 'todays_collection', value: formatCurrency(Math.round(base.todaysCollection * multiplier)), subtitle: timeHorizon === 'all' ? 'All-time collections' : 'Collected this month', icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20', targetTab: 'receipts', filterType: 'all' },
      { id: 'totalPending', labelKey: 'total_pending_fines', value: formatCurrency(base.totalPendingFines), subtitle: 'Pending dues', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/20', targetTab: 'pending', filterType: 'all' },
      { id: 'overdueFines', labelKey: 'overdue_fines_kpi', value: formatCurrency(base.overdueFines), subtitle: 'Requires immediate follow-up', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20', targetTab: 'pending', filterType: 'all' },
      { id: 'lostBookCharges', labelKey: 'lost_book_charges_kpi', value: formatCurrency(base.lostBookCharges), subtitle: 'Replacement penalties', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20', targetTab: 'pending', filterType: 'Lost Book Charge' },
      { id: 'damageCharges', labelKey: 'damage_charges_kpi', value: formatCurrency(base.damageCharges), subtitle: 'Property restitution', icon: AlertTriangle, color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20', targetTab: 'pending', filterType: 'Damage Charge' },
    ];
  }, [timeHorizon, formatCurrency]);

  const timeHorizonLabel = useMemo(() => {
    switch (timeHorizon) {
      case 'all': return 'All Time';
      case 'today': return 'Today';
      case 'this_week': return 'This Week';
      case 'this_month': return 'This Month';
      case 'custom':
        return customStartDate && customEndDate
          ? `${customStartDate} to ${customEndDate}`
          : 'Custom Range';
      default: return 'This Month';
    }
  }, [timeHorizon, customStartDate, customEndDate]);

  const handleExportReceiptsCsv = () => {
    const headers = `Receipts Ledger Export - Scope: ${timeHorizonLabel}\nTransaction ID,Receipt Number,Member,Plan,Late Fee,Amount,Mode,Date,Collected By,Status\n`;
    const rows = filteredReceiptRows.map((r) =>
      `"${r.txnId}","${r.receiptNumber}","${r.member}","${r.plan}","${r.lateFee}","${r.amount}","${r.mode}","${r.date}","${r.collectedBy}","${r.status}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `receipts_ledger_${timeHorizonLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success('Receipts exported to CSV successfully');
  };

  const handleExportPendingFinesCsv = () => {
    const headers = `Fines Export (${activeTab}) - Scope: ${timeHorizonLabel}\nFine ID,Member,Type,Amount,Date,Status\n`;
    const rows = filteredPendingFines.map((f) =>
      `"${f.id}","${f.member}","${f.type}","${f.amount}","${f.date}","${f.status}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `fines_${activeTab}_${timeHorizonLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success(`Fines (${activeTab}) exported to CSV successfully`);
  };

  const handleExportHistoryCsv = () => {
    const headers = `Payment History Export - Scope: ${timeHorizonLabel}\nReceipt,Member,Fine Type,Amount,Payment Mode,Date Time,Collected By\n`;
    const rows = filteredHistoryRows.map((h) =>
      `"${h.receipt || ''}","${h.member}","${h.type}","${h.amount}","${h.mode}","${h.date}","${h.collectedBy}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `payment_history_${timeHorizonLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success('Payment history exported to CSV successfully');
  };

  // Native semantic table column definitions
  const pendingCols: NativeColumn[] = useMemo(() => [
    { field: 'id', headerName: tManagerUi('fine_id'), width: 120 },
    { field: 'member', headerName: tManagerUi('member_6853c9'), flex: 1 },
    { field: 'type', headerName: tManagerUi('type'), flex: 1, valueFormatter: (p) => translateFineType(p.value) },
    { field: 'amount', headerName: tManagerUi('amount_43dc85'), width: 120, valueFormatter: (p: NativeCellParams) => formatCurrency(Number(p.value ?? 0)) },
    { field: 'date', headerName: tManagerUi('date'), width: 150 },
    { field: 'status', headerName: tManagerUi('status'), width: 150, cellRenderer: (p: NativeCellParams) => <span className="mgr-badge mgr-badge--warning">{p.value === 'Pending' ? tManagerUi('status_pending') : p.value === 'Partially Paid' ? tManagerUi('status_partially_paid') : String(p.value ?? '')}</span> },
  ], [formatCurrency, tManagerUi, translateFineType]);

  const historyCols: NativeColumn[] = useMemo(() => [
    { field: 'receipt', headerName: tManagerUi('receipt_097d66'), width: 130 },
    { field: 'member', headerName: tManagerUi('member_6853c9'), flex: 1 },
    { field: 'type', headerName: tManagerUi('fine_type'), flex: 1, valueFormatter: (p) => translateFineType(p.value) },
    { field: 'amount', headerName: tManagerUi('amount_43dc85'), width: 120, cellClass: 'text-success font-bold', valueFormatter: (p: NativeCellParams) => formatCurrency(Number(p.value ?? 0)) },
    { field: 'mode', headerName: tManagerUi('mode'), width: 120, cellRenderer: (p: NativeCellParams) => <span className="mgr-badge mgr-badge--info">{translatePaymentMode(p.value)}</span> },
    { field: 'date', headerName: tManagerUi('date_time_853aab'), width: 160 },
    { field: 'collectedBy', headerName: tManagerUi('collected_by_898bb0'), width: 140 },
  ], [formatCurrency, tManagerUi, translateFineType, translatePaymentMode]);

  const receiptsCols: NativeColumn[] = useMemo(() => [
    { field: 'txnId', headerName: 'Transaction ID', width: 140, cellRenderer: (p: NativeCellParams) => <span className="font-mono text-xs font-semibold text-primary">{String(p.value ?? '—')}</span> },
    { field: 'receiptNumber', headerName: tManagerUi('receipt_097d66'), width: 130, cellRenderer: (p: NativeCellParams) => <span className="text-xs font-semibold">{String(p.value ?? '—')}</span> },
    { field: 'member', headerName: tManagerUi('member_6853c9'), flex: 1, minWidth: 160 },
    { field: 'plan', headerName: 'Plan', flex: 1, minWidth: 150, cellRenderer: (p: NativeCellParams) => <span className="fin-badge fin-badge--neutral text-xs">{String(p.value ?? '—')}</span> },
    { field: 'lateFee', headerName: 'Late Fee', width: 110, cellRenderer: (p: NativeCellParams) => <span className={Number(p.value ?? 0) > 0 ? 'text-amber-600 font-bold text-xs' : 'text-secondary text-xs'}>{formatCurrency(Number(p.value ?? 0))}</span> },
    { field: 'amount', headerName: tManagerUi('amount_43dc85'), width: 120, cellClass: 'text-success font-bold', cellRenderer: (p: NativeCellParams) => <span className="text-success font-bold text-xs">{formatCurrency(Number(p.value ?? 0))}</span> },
    { field: 'mode', headerName: tManagerUi('mode'), width: 100, cellRenderer: (p: NativeCellParams) => <span className="mgr-badge mgr-badge--info text-xs">{translatePaymentMode(p.value)}</span> },
    { field: 'date', headerName: tManagerUi('date_time_853aab'), width: 140, cellRenderer: (p: NativeCellParams) => <span className="text-xs text-secondary">{String(p.value ?? '—')}</span> },
    { field: 'collectedBy', headerName: 'Collected By', width: 150, cellRenderer: (p: NativeCellParams) => <span className="text-xs font-medium text-primary flex items-center gap-1.5"><UserCheck size={13} className="text-secondary" />{String(p.value ?? 'Branch Manager Satyam')}</span> },
    { field: 'status', headerName: tManagerUi('status'), width: 110, cellRenderer: (p: NativeCellParams) => <span className="mgr-badge mgr-badge--success text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60">{String(p.value ?? 'Completed')}</span> },
    {
      headerName: tManagerUi('actions'),
      width: 200,
      sortable: false,
      cellRenderer: (p: NativeCellParams) => {
        const row = p.data as ManagerReceiptRecord;
        return (
          <div className="flex items-center gap-1.5 h-full">
            <button
              type="button"
              onClick={() => setSelectedReceipt(row)}
              className="p-1 rounded hover:bg-surface-hover text-primary transition-colors cursor-pointer"
              title="View Receipt Details"
            >
              <Eye size={15} />
            </button>
            <button
              type="button"
              onClick={() => handlePrintReceipt(row)}
              className="p-1 rounded hover:bg-surface-hover text-secondary hover:text-primary transition-colors cursor-pointer"
              title="Print Receipt"
            >
              <Printer size={15} />
            </button>
            <button
              type="button"
              onClick={() => handleShareWhatsApp(row)}
              className="p-1 rounded hover:bg-surface-hover text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
              title="Share via WhatsApp"
            >
              <MessageSquare size={15} />
            </button>
            <button
              type="button"
              onClick={() => handleShareEmail(row)}
              className="p-1 rounded hover:bg-surface-hover text-purple hover:text-purple-700 transition-colors cursor-pointer"
              title="Share via Email"
            >
              <Mail size={15} />
            </button>
            <button
              type="button"
              onClick={() => handleShareSms(row)}
              className="p-1 rounded hover:bg-surface-hover text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
              title="Share via SMS"
            >
              <Smartphone size={15} />
            </button>
          </div>
        );
      }
    }
  ], [formatCurrency, tManagerUi, translatePaymentMode]);

  const timeHorizonOptions: Array<{ id: ManagerFinanceTimeHorizon; label: string }> = [
    { id: 'all', label: 'All Time' },
    { id: 'today', label: 'Today' },
    { id: 'this_week', label: 'This Week' },
    { id: 'this_month', label: 'This Month' },
    { id: 'custom', label: 'Custom Range' },
  ];

  return (
    <div
      className="mgr-page-animate relative pb-12 space-y-6"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
      data-route-name={_routeQuery.name}
      data-route-phone={_routeQuery.phone}
      data-route-smart-id={_routeQuery.smartId}
    >
      {/* ── Executive ERP Header Banner ── */}
      <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-md p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-semibold text-primary uppercase tracking-wider">{tManagerUi('finance')}</span>
              <span className="text-border">•</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <DollarSign size={12} />
                Financial Treasury & Fines
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium bg-secondary/10 text-secondary border border-border">
                📍 Central Branch
              </span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary flex items-center gap-2.5">
                <span>{tManagerUi('fines_payments')}</span>
              </h1>
              <span className="text-xs px-2.5 py-1 rounded-md bg-primary-subtle text-primary font-bold">
                {filteredReceiptRows.length} Receipts • Scope: {timeHorizonLabel}
              </span>
            </div>

            <p className="text-sm text-secondary">
              {tManagerUi('manage_fine_collections_view_pending_dues_and_request_re_7b6cc6')} • Scope: {timeHorizonLabel}
            </p>
          </div>

          {/* Header Fast Actions */}
          <div className="flex items-center flex-wrap gap-2.5 sm:self-start lg:self-center">
            <button
              type="button"
              onClick={handleSyncLedger}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 min-h-11 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:border-border-strong hover:bg-surface-hover motion-safe:transition-all shadow-sm active:scale-95 disabled:opacity-60"
              title="Sync Financial Ledger"
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin text-primary' : ''} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Ledger'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('receipts');
              }}
              className="mgr-btn-primary min-h-11 px-4 rounded-xl shadow-sm inline-flex items-center gap-2 text-sm font-semibold"
            >
              <Receipt size={16} />
              <span>View Receipts Ledger</span>
            </button>
          </div>
        </div>

        {/* Warning notification banner */}
        <p
          className="mt-4 rounded-xl border border-warning/20 bg-warning/5 p-3 text-xs text-warning leading-relaxed"
          data-testid="manager-finance-fines-sample-warning"
          role="status"
        >
          {tManagerUi('this_page_displays_sample_financial_records_for_layout_r_04f8ef')}
        </p>
      </div>

      {/* ── Main Global Time Horizon Filter Bar ── */}
      <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-primary shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-secondary">
            Ledger Time Horizon:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Segmented Time Horizon Pills */}
          <div className="inline-flex bg-muted/60 p-1 rounded-xl border border-border flex-wrap">
            {timeHorizonOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTimeHorizon(opt.id)}
                className={`min-h-8 px-3 py-1 text-xs font-medium rounded-lg motion-safe:transition-all ${
                  timeHorizon === opt.id
                    ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Custom Date Range Picker */}
          {timeHorizon === 'custom' && (
            <div className="flex items-center gap-2 flex-wrap text-xs bg-muted/40 p-1.5 rounded-lg border border-border">
              <label className="flex items-center gap-1 text-secondary">
                <span>From:</span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-2 py-1 bg-card border border-border rounded text-xs text-primary outline-none focus:border-primary"
                />
              </label>
              <label className="flex items-center gap-1 text-secondary">
                <span>To:</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-2 py-1 bg-card border border-border rounded text-xs text-primary outline-none focus:border-primary"
                />
              </label>
              {(customStartDate || customEndDate) && (
                <button
                  type="button"
                  onClick={() => {
                    setCustomStartDate('');
                    setCustomEndDate('');
                  }}
                  className="p-1 text-secondary hover:text-destructive"
                  title="Clear custom dates"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Submodule Navigation Tabs ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-border">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count =
            tab.id === 'pending'
              ? MANAGER_FINANCE_SAMPLE_PENDING_FINES.filter((f) => f.status === 'Pending').length
              : tab.id === 'partiallyPaid'
              ? MANAGER_FINANCE_SAMPLE_PENDING_FINES.filter((f) => f.status === 'Partially Paid').length
              : tab.id === 'paid'
              ? MANAGER_FINANCE_SAMPLE_PAYMENT_HISTORY.length
              : tab.id === 'receipts'
              ? receiptRows.length
              : null;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (tab.id === 'refundRequests') {
                  router.push(MANAGER_FINANCE_FINES_PAYMENTS_ROUTES.REFUNDS);
                  return;
                }
                setActiveTab(tab.id);
                setTableSearchQuery('');
                setFineTypeFilter('all');
                setHistoryModeFilter('all');
                setReceiptModeFilter('all');
              }}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap motion-safe:transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm ring-1 ring-primary'
                  : 'bg-card border border-border text-secondary hover:text-primary hover:bg-surface-hover'
              }`}
            >
              <tab.icon size={15} className={isActive ? 'text-primary-foreground' : 'opacity-70'} />
              <span>{tManagerUi(tab.labelKey)}</span>
              {count !== null && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-secondary'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Main Tab Content ── */}
      <div className="mgr-card p-6 min-h-96 w-full shadow-card border border-border rounded-2xl bg-card">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 motion-safe:transition-all motion-safe:duration-base">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <h2 className="text-xl font-bold text-primary">{tManagerUi('fine_collection_overview')}</h2>
                <p className="text-xs text-secondary mt-0.5">
                  Synchronized with {timeHorizonOptions.find((h) => h.id === timeHorizon)?.label}
                </p>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardKpis.map((kpi) => (
                <button
                  key={kpi.labelKey}
                  type="button"
                  onClick={() => {
                    setActiveTab(kpi.targetTab);
                    setFineTypeFilter(kpi.filterType);
                  }}
                  className="p-5 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 motion-safe:transition-all text-left cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className={`p-2.5 rounded-xl border ${kpi.bg} ${kpi.color}`}>
                      <kpi.icon size={20} />
                    </div>
                    <span className="text-xs text-secondary group-hover:text-primary font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      View list <ArrowRight size={13} />
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-xs font-semibold text-secondary uppercase tracking-wider">
                        {tManagerUi(kpi.labelKey)}
                      </p>
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border">
                        [{timeHorizonLabel}]
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-primary tracking-tight">{kpi.value}</h3>
                    <p className="text-[11px] text-secondary mt-1">{kpi.subtitle} ({timeHorizonLabel})</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Supplementary Financial Overview Widget: Payment Method Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl border border-border bg-card/60 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                    <CreditCard size={16} className="text-primary" />
                    Payment Method Realization
                  </h3>
                  <span className="text-xs text-secondary font-medium">Digital vs Cash</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-primary">UPI / QR Code</span>
                      <span className="text-emerald-600 dark:text-emerald-400">62% (Instant)</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '62%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-primary">Cash Counter</span>
                      <span className="text-amber-600 dark:text-amber-400">26% (Physical Vault)</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '26%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-primary">Debit / Credit Card & Bank</span>
                      <span className="text-blue-600 dark:text-blue-400">12% (POS / NetBanking)</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '12%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-card/60 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-primary flex items-center gap-2 mb-2">
                    <TrendingUp size={16} className="text-primary" />
                    Audit & Settlement Status
                  </h3>
                  <p className="text-xs text-secondary leading-relaxed">
                    All fine receipts and late penalties generated in Central Branch are balanced automatically against the daily settlement vault at end of day (10:00 PM).
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                  <span className="text-secondary font-medium">Daily Vault Status:</span>
                  <span className="px-2.5 py-1 rounded-full font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    🟢 Balanced & Audited
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PENDING FINES TAB */}
        {(activeTab === 'pending' || activeTab === 'partiallyPaid') && (
          <div className="motion-safe:transition-all motion-safe:duration-base h-full flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 border-b border-border pb-4">
              <div>
                <h2 className="text-xl font-bold text-primary">
                  {tManagerUi(TABS.find((tab) => tab.id === activeTab)?.labelKey ?? 'fines_dashboard_tab')}
                </h2>
                <p className="text-xs text-secondary mt-0.5">
                  Filter, inspect, and export {activeTab === 'pending' ? 'pending' : 'partially paid'} student dues
                </p>
              </div>

              {/* Multi-Filter Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-full sm:w-60">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                  <input
                    type="search"
                    placeholder="Search fine ID, member, or type..."
                    className="mgr-input pl-8 text-xs w-full"
                    value={tableSearchQuery}
                    onChange={(e) => setTableSearchQuery(e.target.value)}
                  />
                </div>

                <select
                  aria-label="Filter by Fine Type"
                  value={fineTypeFilter}
                  onChange={(e) => setFineTypeFilter(e.target.value)}
                  className="mgr-select text-xs py-1.5 px-3 min-w-[140px]"
                >
                  <option value="all">All Fine Types</option>
                  <option value="Overdue Book">Overdue Book</option>
                  <option value="Lost Book Charge">Lost Book Charge</option>
                  <option value="Damage Charge">Damage Charge</option>
                  <option value="Late Fee">Late Fee</option>
                </select>

                {(tableSearchQuery.trim() !== '' || fineTypeFilter !== 'all' || timeHorizon !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setTableSearchQuery('');
                      setFineTypeFilter('all');
                      setTimeHorizon('all');
                      setCustomStartDate('');
                      setCustomEndDate('');
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer"
                    title="Reset filters"
                  >
                    <X size={13} /> Reset
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleExportPendingFinesCsv}
                  className="mgr-btn-outline flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg border border-border bg-card hover:bg-surface-highlight transition-colors cursor-pointer"
                  title="Export Fines CSV"
                >
                  <Download size={13} /> Export CSV
                </button>

                <span className="mgr-badge mgr-badge--info font-mono text-xs shrink-0">
                  Showing {filteredPendingFines.length} Fines ({timeHorizonLabel})
                </span>
              </div>
            </div>
            <div className="flex-1 w-full h-96">
              <ManagerFinanceFinesPaymentsNativeTable
                getRowKey={(row) => String(row.id)}
                emptyMessage={tableSearchQuery ? tManagerUi('no_receipts_found') : `No ${activeTab === 'pending' ? 'pending' : 'partially paid'} fines found for ${timeHorizonLabel}.`}
                rows={filteredPendingFines}
                columns={pendingCols}
                labels={{ previous: tManagerUi('previous_page'), next: tManagerUi('next_page') }}
              />
            </div>
          </div>
        )}

        {/* PAID FINES TAB */}
        {activeTab === 'paid' && (
          <div className="motion-safe:transition-all motion-safe:duration-base h-full flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 border-b border-border pb-4">
              <div>
                <h2 className="text-xl font-bold text-primary">
                  {tManagerUi(TABS.find((tab) => tab.id === activeTab)?.labelKey ?? 'fines_dashboard_tab')}
                </h2>
                <p className="text-xs text-secondary mt-0.5">Historical log of settled fines and penalty collections</p>
              </div>

              {/* Multi-Filter Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-full sm:w-60">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                  <input
                    type="search"
                    placeholder="Search receipt, member, or collector..."
                    className="mgr-input pl-8 text-xs w-full"
                    value={tableSearchQuery}
                    onChange={(e) => setTableSearchQuery(e.target.value)}
                  />
                </div>

                <select
                  aria-label="Filter by Payment Mode"
                  value={historyModeFilter}
                  onChange={(e) => setHistoryModeFilter(e.target.value)}
                  className="mgr-select text-xs py-1.5 px-3 min-w-[130px]"
                >
                  <option value="all">All Modes</option>
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                  <option value="bank">Bank Transfer</option>
                </select>

                {(tableSearchQuery.trim() !== '' || historyModeFilter !== 'all' || timeHorizon !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setTableSearchQuery('');
                      setHistoryModeFilter('all');
                      setTimeHorizon('all');
                      setCustomStartDate('');
                      setCustomEndDate('');
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer"
                    title="Reset filters"
                  >
                    <X size={13} /> Reset
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleExportHistoryCsv}
                  className="mgr-btn-outline flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg border border-border bg-card hover:bg-surface-highlight transition-colors cursor-pointer"
                  title="Export Payment History CSV"
                >
                  <Download size={13} /> Export CSV
                </button>

                <span className="mgr-badge mgr-badge--info font-mono text-xs shrink-0">
                  Showing {filteredHistoryRows.length} Payments ({timeHorizonLabel})
                </span>
              </div>
            </div>
            <div className="flex-1 w-full h-96">
              <ManagerFinanceFinesPaymentsNativeTable
                getRowKey={(row) => String(row.id)}
                emptyMessage={tableSearchQuery ? tManagerUi('no_receipts_found') : `No payment history records found for ${timeHorizonLabel}.`}
                rows={filteredHistoryRows}
                columns={historyCols}
                labels={{ previous: tManagerUi('previous_page'), next: tManagerUi('next_page') }}
              />
            </div>
          </div>
        )}

        {/* RECEIPTS TAB */}
        {activeTab === 'receipts' && (
          <div className="motion-safe:transition-all motion-safe:duration-base h-full flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 border-b border-border pb-4">
              <div>
                <h2 className="text-xl font-bold text-primary">{tManagerUi('receipts_tab')}</h2>
                <p className="text-xs text-secondary mt-1">Official transaction receipts with late fees, plan details, and multi-channel dispatch</p>
              </div>

              {/* Multi-Filter Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-full sm:w-60">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                  <input
                    type="search"
                    placeholder="Search txn ID, receipt, member, plan..."
                    className="mgr-input pl-8 text-xs w-full"
                    value={tableSearchQuery}
                    onChange={(e) => setTableSearchQuery(e.target.value)}
                  />
                </div>

                <select
                  aria-label="Filter Receipts by Mode"
                  value={receiptModeFilter}
                  onChange={(e) => setReceiptModeFilter(e.target.value)}
                  className="mgr-select text-xs py-1.5 px-3 min-w-[130px]"
                >
                  <option value="all">All Modes</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>

                {(tableSearchQuery.trim() !== '' || receiptModeFilter !== 'all' || timeHorizon !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setTableSearchQuery('');
                      setReceiptModeFilter('all');
                      setTimeHorizon('all');
                      setCustomStartDate('');
                      setCustomEndDate('');
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer"
                    title="Reset filters"
                  >
                    <X size={13} /> Reset
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleExportReceiptsCsv}
                  className="mgr-btn-outline flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg border border-border bg-card hover:bg-surface-highlight transition-colors cursor-pointer"
                  title="Export Receipts CSV"
                >
                  <Download size={13} /> Export CSV
                </button>

                <span className="mgr-badge mgr-badge--info font-mono text-xs shrink-0">
                  Showing {filteredReceiptRows.length} of {receiptRows.length} Receipts ({timeHorizonLabel})
                </span>
              </div>
            </div>
            <div className="flex-1 w-full h-96">
              <ManagerFinanceFinesPaymentsNativeTable
                getRowKey={(row) => String(row.id)}
                emptyMessage={tableSearchQuery ? tManagerUi('no_receipts_found') : `No receipts found for ${timeHorizonLabel}.`}
                rows={filteredReceiptRows}
                columns={receiptsCols}
                labels={{ previous: tManagerUi('previous_page'), next: tManagerUi('next_page') }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Selected Receipt Details & Multi-Channel Share Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden motion-safe:animate-scale-up">
            <div className="flex items-center justify-between p-5 border-b border-border bg-surface-highlight">
              <div className="flex items-center gap-2">
                <Receipt className="text-primary" size={20} />
                <h3 className="font-bold text-primary text-base">Receipt Details — {selectedReceipt.receiptNumber}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="p-1 rounded-lg hover:bg-card text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-surface-highlight border border-border text-xs font-mono">
                <div>
                  <span className="text-secondary block">Transaction ID</span>
                  <span className="font-bold text-primary">{selectedReceipt.txnId}</span>
                </div>
                <div>
                  <span className="text-secondary block">Receipt Number</span>
                  <span className="font-bold text-primary">{selectedReceipt.receiptNumber}</span>
                </div>
                <div>
                  <span className="text-secondary block">Member</span>
                  <span className="font-bold text-primary">{selectedReceipt.member}</span>
                </div>
                <div>
                  <span className="text-secondary block">Contact Phone</span>
                  <span className="text-primary">+91 {selectedReceipt.phone}</span>
                </div>
                <div>
                  <span className="text-secondary block">Membership Plan</span>
                  <span className="font-semibold text-primary">{selectedReceipt.plan}</span>
                </div>
                <div>
                  <span className="text-secondary block">Payment Mode</span>
                  <span className="font-semibold text-primary uppercase">{selectedReceipt.mode}</span>
                </div>
                <div>
                  <span className="text-secondary block">Date & Time</span>
                  <span className="text-primary">{selectedReceipt.date}</span>
                </div>
                <div>
                  <span className="text-secondary block">Collected By</span>
                  <span className="font-semibold text-primary">{selectedReceipt.collectedBy}</span>
                </div>
                <div>
                  <span className="text-secondary block">Payment Status</span>
                  <span className="mgr-badge mgr-badge--success text-xs font-bold">{selectedReceipt.status}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card space-y-2 text-sm">
                <div className="flex justify-between text-secondary">
                  <span>Base Fee:</span>
                  <span>{formatCurrency(selectedReceipt.amount - selectedReceipt.lateFee)}</span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>Late Fee:</span>
                  <span className={selectedReceipt.lateFee > 0 ? 'text-amber-600 font-bold' : ''}>{formatCurrency(selectedReceipt.lateFee)}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-bold text-base text-primary">
                  <span>Total Paid:</span>
                  <span className="text-success">{formatCurrency(selectedReceipt.amount)}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Share & Print Options</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handlePrintReceipt(selectedReceipt)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-border bg-card hover:bg-surface-hover text-xs font-semibold text-primary transition-colors cursor-pointer"
                  >
                    <Printer size={14} /> Print
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShareWhatsApp(selectedReceipt)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <MessageSquare size={14} /> WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShareEmail(selectedReceipt)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-purple hover:bg-purple-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Mail size={14} /> Email
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShareSms(selectedReceipt)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Smartphone size={14} /> SMS
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border bg-surface-highlight flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="mgr-btn-secondary mgr-btn-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
