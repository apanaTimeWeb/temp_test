'use client';

import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  CheckCircle, Download, AlertCircle, Search, X, RotateCcw,
  Plus, ShieldAlert, Eye, Receipt, CreditCard, BarChart3, Zap, RotateCcw as RefundIcon,
  MessageSquare, Mail, FileSpreadsheet, Printer
} from 'lucide-react';
import type { SemanticColumnDef as ColDef, SemanticCellParams as ICellRendererParams } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminBillingInvoicesSemanticTable';
import SuperadminBillingInvoicesSemanticTable from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminBillingInvoicesSemanticTable';
import { SuperadminBillingDownloadSampleInvoicePdf } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/utils/SuperadminBillingInvoicesSamplePdf';
import {
  downloadSuperadminInvoicesCsv,
  downloadSuperadminInvoicesExcel,
  printSuperadminInvoicesRoster,
} from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/utils/SuperadminBillingInvoicesExportUtils';
import type { SuperadminBillingInvoiceSample } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/types/SuperadminBillingInvoicesTypes';
import { SUPERADMIN_BILLING_SAMPLE_INVOICES } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/mocks/fixtures/SuperadminBillingInvoicesSampleMockFixtures';
import SuperadminBillingInvoicesKpiCards from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminBillingInvoicesKpiCards';
import SuperadminBillingInvoicesFilterBar from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminBillingInvoicesFilterBar';
import SuperadminBillingCreateInvoiceModal from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminBillingCreateInvoiceModal';
import SuperadminBillingInvoiceDetailModal from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminBillingInvoiceDetailModal';
import SuperadminPaymentFailureRulesModal from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminPaymentFailureRulesModal';
import SuperadminBillingCreditNoteModal from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminBillingCreditNoteModal';
import SuperadminBillingTransactionsLedger from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminBillingTransactionsLedger';
import SuperadminBillingOutstandingRevenueReports from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminBillingOutstandingRevenueReports';

type BillingTab = 'invoices' | 'transactions' | 'reports';

export default function SuperadminBillingInvoicesPageClient({ initialFilter }: { initialFilter?: string } = {}) {
  const tCopy = useTranslations('SUPERADMIN_BILLING');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlTab = (searchParams?.get('tab') as BillingTab) || 'invoices';
  const [activeTab, setActiveTab] = useState<BillingTab>(urlTab);
  const [invoices, setInvoices] = useState<SuperadminBillingInvoiceSample[]>(() => [...SUPERADMIN_BILLING_SAMPLE_INVOICES]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialFilter === 'outstanding' ? 'Overdue' : 'all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<SuperadminBillingInvoiceSample | null>(null);
  const [creditNoteInvoice, setCreditNoteInvoice] = useState<SuperadminBillingInvoiceSample | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isFailureRulesOpen, setIsFailureRulesOpen] = useState(false);

  const showToast = useCallback((msg: string) => { toast.message(msg, { id: 'superadmin:superadmin_billing:feedback' }); }, []);
  const handleOpenDetail = useCallback((inv: SuperadminBillingInvoiceSample) => { setSelectedInvoice(inv); setIsDetailOpen(true); }, []);
  const handleCreateInvoice = useCallback((newInv: SuperadminBillingInvoiceSample) => {
    setInvoices((prev) => [newInv, ...prev]);
    showToast(`Created Platform Tax Invoice ${newInv.id} for ${newInv.tenant}`);
  }, [showToast]);

  const handleRunAutoInvoice = () => {
    const autoInv: SuperadminBillingInvoiceSample = {
      id: `INV-2026-${1000 + invoices.length + 1}`,
      tenant: 'Takshashila Study Hall',
      legalName: 'Takshashila Learning Foundation',
      billingAddress: '77 Heritage Circle, Patna, Bihar',
      cityStatePin: 'Patna, Bihar - 800001',
      date: '22 Nov, 2026',
      dueDate: '02 Dec, 2026',
      amount: 4999,
      subtotal: 4236.44,
      cgst: 0,
      sgst: 0,
      igst: 762.56,
      status: 'Pending',
      method: 'UPI',
      gateway: 'Razorpay',
      gst: '10AAATT9876K1Z1',
      phone: '+91 94310 99881',
      email: 'accounts@takshashila.in',
      planName: 'Professional Plan (Monthly Recurring)',
      billingCycle: 'Monthly',
      items: [{ description: 'Monthly SaaS Recurring Subscription', quantity: 1, rate: 4236.44, amount: 4236.44, sacCode: '998313' }],
    };
    setInvoices((prev) => [autoInv, ...prev]);
    showToast(`⚡ Generated recurring billing cycle invoice ${autoInv.id} for Takshashila Study Hall`);
  };

  const handleTabChange = (tab: BillingTab) => {
    setActiveTab(tab);
    router.replace(`/superadmin/superadmin_billing/billing_invoices?tab=${tab}`);
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (statusFilter !== 'all' && inv.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (methodFilter !== 'all' && inv.method.toLowerCase() !== methodFilter.toLowerCase()) return false;
      const q = searchQuery.trim().toLowerCase();
      return !q || inv.id.toLowerCase().includes(q) || inv.tenant.toLowerCase().includes(q) || inv.method.toLowerCase().includes(q);
    });
  }, [invoices, searchQuery, statusFilter, methodFilter]);

  const colDefs = useMemo<ColDef<SuperadminBillingInvoiceSample>[]>(() => [
    { headerName: tCopy('COPY.TABLE_COLUMN_INVOICE_ID'), field: 'id', flex: 1.1, cellClass: () => 'sa-cell-primary-bold' },
    {
      headerName: tCopy('COPY.TABLE_COLUMN_TENANT_LIBRARY'),
      field: 'tenant',
      flex: 1.5,
      cellRenderer: (p: ICellRendererParams<SuperadminBillingInvoiceSample>) => (
        <div>
          <span className="font-semibold text-slate-100">{p.data?.tenant}</span>
          {p.data?.legalName && <div className="text-[10px] text-slate-400 truncate">{p.data.legalName}</div>}
        </div>
      ),
    },
    { headerName: tCopy('COPY.TABLE_COLUMN_DATE'), field: 'date', flex: 0.9, cellClass: () => 'sa-cell-muted-sm' },
    {
      headerName: tCopy('COPY.TABLE_COLUMN_AMOUNT'),
      field: 'amount',
      flex: 1,
      cellRenderer: (p: ICellRendererParams<SuperadminBillingInvoiceSample>) => (
        <span className="text-xs font-bold text-emerald-400 font-mono">₹{Number(p.value ?? 0).toLocaleString('en-IN')}</span>
      ),
    },
    {
      headerName: tCopy('COPY.TABLE_COLUMN_STATUS'),
      field: 'status',
      flex: 1,
      cellRenderer: (p: ICellRendererParams<SuperadminBillingInvoiceSample>) => {
        const val = String(p.value ?? '');
        const isPaid = val === 'Paid';
        const isOverdue = val === 'Overdue' || val === 'Failed';
        return (
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
            isPaid ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400' : isOverdue ? 'border-rose-500/30 bg-rose-500/15 text-rose-400' : 'border-amber-500/30 bg-amber-500/15 text-amber-400'
          }`}>
            {isPaid ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
            <span>{val}</span>
          </span>
        );
      },
    },
    { headerName: tCopy('COPY.TABLE_COLUMN_METHOD'), field: 'method', flex: 0.9, cellClass: () => 'sa-cell-muted font-mono text-xs' },
    {
      headerName: tCopy('COPY.TABLE_COLUMN_ACTION'),
      flex: 2.2,
      minWidth: 260,
      cellRenderer: (params: ICellRendererParams<SuperadminBillingInvoiceSample>) => {
        if (!params.data) return null;
        const inv = params.data;
        return (
          <div className="flex items-center gap-1.5 flex-wrap">
            <button type="button" onClick={() => handleOpenDetail(inv)} className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/15 px-2 py-1 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/25 cursor-pointer" title="View Detailed Tax Invoice">
              <Eye size={12} /> <span>View</span>
            </button>
            <button type="button" onClick={() => SuperadminBillingDownloadSampleInvoicePdf(inv)} className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 cursor-pointer" title="Download Official Tax Invoice PDF">
              <Download size={12} />
            </button>
            <button
              type="button"
              onClick={() => {
                const raw = inv.phone || '9876543210';
                let digits = raw.replace(/\D/g, '');
                if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
                const phone = digits.length === 10 ? `91${digits}` : digits;
                const msg = `Hello ${inv.tenant}, your Smart Library tax invoice ${inv.id} for ₹${inv.amount.toLocaleString('en-IN')} (Due: ${inv.dueDate}) is ready for download.`;
                const popup = window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
                if (popup) popup.opener = null;
                showToast(`Opened WhatsApp invoice share for ${inv.tenant}`);
              }}
              className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 cursor-pointer"
              title="Share Invoice on WhatsApp"
            >
              <MessageSquare size={12} />
            </button>
            <button
              type="button"
              onClick={() => showToast(`Dispatched invoice ${inv.id} via email to ${inv.email || 'accounts@' + inv.tenant.toLowerCase().replace(/\s+/g, '') + '.in'}`)}
              className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-blue-500/30 bg-blue-500/15 text-blue-300 hover:bg-blue-500/25 cursor-pointer"
              title="Email Invoice"
            >
              <Mail size={12} />
            </button>
            <button type="button" onClick={() => setCreditNoteInvoice(inv)} className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/15 px-2 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-500/25 cursor-pointer" title="Issue Credit Note / Refund">
              <RefundIcon size={11} /> <span>Credit Note</span>
            </button>
          </div>
        );
      },
    },
  ], [handleOpenDetail, locale, tCopy]);

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 pb-12">
      {/* Hero Header */}
      <div className="rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/80 via-[#0a0d24] to-[#060810] p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shadow-inner">
                <Receipt size={24} aria-hidden="true" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                Billing, Invoices & Payment Engine
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> SAC 998313 GST Ready
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Multi-tenant recurring invoice generation, UPI/Card/Netbanking gateway settlement, automated dunning, and GST compliance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={handleRunAutoInvoice} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 text-xs font-semibold cursor-pointer">
              <Zap size={13} /> <span>Run Auto-Invoice Job</span>
            </button>
            <button type="button" onClick={() => setIsCreateOpen(true)} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white text-xs font-bold shadow-md cursor-pointer">
              <Plus size={14} /> <span>Create Invoice</span>
            </button>
            <button type="button" onClick={() => setIsFailureRulesOpen(true)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 text-xs font-semibold cursor-pointer">
              <ShieldAlert size={13} /> <span>Failure Rules</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-indigo-500/20 overflow-x-auto pb-1 text-xs font-semibold">
          {[
            { id: 'invoices', label: 'Tax Invoices & Billing', icon: Receipt },
            { id: 'transactions', label: 'Transactions & Ledger', icon: CreditCard },
            { id: 'reports', label: 'Outstanding & Revenue', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id as BillingTab)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  active ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-indigo-950/40'
                }`}
              >
                <Icon size={14} /> <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          <SuperadminBillingInvoicesKpiCards />
          <SuperadminBillingInvoicesFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            methodFilter={methodFilter}
            setMethodFilter={setMethodFilter}
            onReset={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setMethodFilter('all');
            }}
            onExportCsv={() => {
              downloadSuperadminInvoicesCsv(filteredInvoices);
              showToast('Invoices statement exported as CSV');
            }}
            onExportExcel={() => {
              downloadSuperadminInvoicesExcel(filteredInvoices);
              showToast('Invoices statement exported as Excel (.xls)');
            }}
            onPrint={() => printSuperadminInvoicesRoster(filteredInvoices)}
            filteredCount={filteredInvoices.length}
            totalCount={invoices.length}
          />
          <SuperadminBillingInvoicesSemanticTable rowData={filteredInvoices} columnDefs={colDefs} pagination paginationPageSize={10} />
        </div>
      )}

      {activeTab === 'transactions' && <SuperadminBillingTransactionsLedger />}
      {activeTab === 'reports' && <SuperadminBillingOutstandingRevenueReports />}

      <SuperadminBillingCreateInvoiceModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onCreate={handleCreateInvoice} nextInvoiceSequence={invoices.length + 1} />
      <SuperadminBillingInvoiceDetailModal invoice={selectedInvoice} isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} onSendEmail={(inv) => showToast(`Dispatched tax invoice PDF to ${inv.email || inv.tenant}`)} onSendWhatsApp={(inv) => showToast(`Generated WhatsApp invoice link for ${inv.tenant}`)} />
      <SuperadminPaymentFailureRulesModal isOpen={isFailureRulesOpen} onClose={() => setIsFailureRulesOpen(false)} />
      {creditNoteInvoice && (
        <SuperadminBillingCreditNoteModal
          invoice={creditNoteInvoice}
          onClose={() => setCreditNoteInvoice(null)}
          onCreditNoteIssued={(cnId, amt, rsn) => {
            showToast(`Issued Credit Note ${cnId} for ₹${amt.toLocaleString('en-IN')} (${rsn})`);
          }}
        />
      )}
    </div>
  );
}
