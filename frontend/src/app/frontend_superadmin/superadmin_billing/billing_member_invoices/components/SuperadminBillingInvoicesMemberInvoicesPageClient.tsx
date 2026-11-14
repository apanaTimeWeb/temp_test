'use client';
import SuperadminBillingInvoicesMemberInvoicesEmptyState from '@/app/frontend_superadmin/superadmin_billing/billing_member_invoices/components/SuperadminBillingInvoicesMemberInvoicesEmptyState';
/** Responsibility: Superadmin Finance Invoice Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminBillingInvoicesMemberInvoicesPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { SUPERADMIN_BILLING_MEMBER_INVOICES_ROUTES as __SUPERADMIN_BILLING_MEMBER_INVOICES_ROUTES } from "@/app/frontend_superadmin/superadmin_billing/billing_member_invoices/config/superadmin_billing_member_invoices.url_config";
import { useSuperadminBillingInvoicesMemberInvoicesUrlFilter } from '@/app/frontend_superadmin/superadmin_billing/billing_member_invoices/hooks/useSuperadminBillingInvoicesMemberInvoicesUrlFilter';

import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import Link from 'next/link';
import { formatMajorUnitPreviewCurrency, formatDate } from '@/app/frontend_superadmin/superadmin_billing/billing_member_invoices/utils/SuperadminBillingInvoicesMemberInvoicesFormatters';
import { Search, FileText, Printer, Eye, Send } from 'lucide-react';
import { printThermal } from '@/lib/thermalPrint';
import { SUPERADMIN_FINANCE_SAMPLE_INVOICES } from '@/app/frontend_superadmin/superadmin_billing/billing_member_invoices/mocks/fixtures/SuperadminBillingInvoicesMemberInvoicesMockFixtures';
import { SUPERADMIN_FINANCE_INVOICE_STATUS_BADGE } from '@/app/frontend_superadmin/superadmin_billing/billing_member_invoices/constants/SuperadminBillingInvoicesMemberInvoicesConstants';
import type { FilterStatus } from '@/app/frontend_superadmin/superadmin_billing/billing_member_invoices/types/SuperadminBillingInvoicesMemberInvoicesPageClientComponentTypes';


/**
 * Renders the `superadmin_member_finance` view owned by `SuperadminBillingInvoicesMemberInvoicesPageClient`.
 * Owns local UI state for `search`, `statusFilter`.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminBillingInvoicesMemberInvoicesPageClient() {
  const tCopy = useTranslations('SUPERADMIN_FINANCE');
  const locale = useLocale();
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useSuperadminBillingInvoicesMemberInvoicesUrlFilter<FilterStatus>('invoiceStatus', 'all', ['all', 'paid', 'pending', 'overdue']);

  const filtered = SUPERADMIN_FINANCE_SAMPLE_INVOICES.filter(inv => {
    const ms = !search || inv.studentName.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.studentId.toLowerCase().includes(search.toLowerCase());
    const mst = statusFilter === 'all' || inv.paymentStatus === statusFilter;
    return ms && mst;
  });


  function handlePrint(inv: typeof SUPERADMIN_FINANCE_SAMPLE_INVOICES[0]) {
    printThermal({
      type: 'receipt', shopName: 'SAMPLE PREVIEW — NOT A TAX INVOICE', branch: 'Demo Branch — sample only',
      studentName: inv.studentName, smartId: inv.studentId, phone: inv.phone,
      shift: inv.shift, seat: inv.seat, plan: inv.planName,
      billNumber: inv.invoiceNumber, date: formatDate(inv.invoiceDate, locale),
      totalPayable: inv.grandTotal,
      amountPaid: 0,
      discount: 0, balance: inv.grandTotal,
      paymentMode: 'SAMPLE ONLY — NOT PAID',
    });
  }

  return (
    <div className="space-y-6">
      {(filtered?.length === 0) && <SuperadminBillingInvoicesMemberInvoicesEmptyState filtered />}

      <div>
        <h1 className="fin-page-title">{tCopy("COPY.INVOICES_SAMPLE")}</h1>
        <p className="fin-page-subtitle">{tCopy("COPY.SYNTHETIC_INVOICE_EXAMPLES_FOR_UI_PREVIEW_ONLY_THEY_ARE_NOT_GST_DO_F49946F7")}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: tCopy('COPY.TOTAL_INVOICES'),    value: SUPERADMIN_FINANCE_SAMPLE_INVOICES.length.toString() },
          { label: tCopy('COPY.TOTAL_BILLED'),      value: formatMajorUnitPreviewCurrency(SUPERADMIN_FINANCE_SAMPLE_INVOICES.reduce((s, i) => s + i.grandTotal, 0), 'INR', locale), success: true },
          { label: tCopy('COPY.PENDING_OVERDUE'), value: SUPERADMIN_FINANCE_SAMPLE_INVOICES.filter(i => i.paymentStatus !== 'paid').length.toString(), warning: true },
        ].map((k) => (
          <div key={k.label} className={`fin-kpi-card${k.warning ? ' fin-kpi-card--warning' : ''}`}>
            <div className="fin-kpi-card__header"><p className={`fin-kpi-label${k.warning ? ' fin-kpi-label--warning' : ''}`}>{k.label}</p><FileText size={18} className={k.warning ? 'fin-text-warning' : 'fin-icon-muted'} /></div>
            <p className={`fin-kpi-value${k.success ? ' fin-text-success' : k.warning ? ' fin-kpi-value--warning' : ''}`}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="fin-filter-bar">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 fin-icon-muted" />
          <input aria-label={tCopy("COPY.SEARCH_BY_INVOICE_NO_STUDENT_NAME_OR_ID")} className="fin-input fin-input--pl9" placeholder={tCopy("COPY.SEARCH_BY_INVOICE_NO_STUDENT_NAME_OR_ID_2")} value={search} onChange={e => setSearch(e.target.value)}  data-testid="superadmin-finance-finance-invoice-search-by-invoice-no-student-name-or-id-1"/>
        </div>
        <select aria-label={tCopy("COPY.STATUS_FILTER")} className="fin-select w-40" value={statusFilter} onChange={e => setStatusFilter(e.target.value as FilterStatus)} data-testid="superadmin-finance-finance-invoice-status-filter-2">
          <option value="all">{tCopy("COPY.ALL_STATUS")}</option>
          <option value="paid">{tCopy("COPY.PAID")}</option>
          <option value="pending">{tCopy("COPY.PENDING_2")}</option>
          <option value="overdue">{tCopy("COPY.OVERDUE")}</option>
        </select>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">{tCopy("COPY.INVOICE_NO")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.STUDENT")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.DATE")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.AMOUNT")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.MODE")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.STATUS")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.ACTIONS")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7}><div className="fin-empty-state"><div className="fin-empty-state__icon">🧾</div><p className="fin-empty-state__title">{tCopy("COPY.NO_INVOICES_FOUND")}</p></div></td></tr>
            ) : filtered.map((inv) => (
              <tr key={inv.id} className="fin-table-hover-row fin-table-row">
                <td className="py-3 px-4"><span className="fin-mono">{inv.invoiceNumber}</span></td>
                <td className="py-3 px-4">
                  <p className="fin-cell-name">{inv.studentName}</p>
                  <p className="fin-cell-subtext">{inv.studentId}</p>
                </td>
                <td className="py-3 px-4 fin-cell-subtext">{formatDate(inv.invoiceDate, locale)}</td>
                <td className="py-3 px-4 text-right font-semibold fin-text-body">{tCopy('COPY.FINANCIAL_DETAIL_ONLY')}</td>
                <td className="py-3 px-4">
                  {inv.paymentMode
                    ? <span className={`fin-badge fin-badge--${inv.paymentMode.toLowerCase().replace(' ', '-')}`}>{inv.paymentMode}</span>
                    : <span className="fin-text-muted">—</span>}
                </td>
                <td className="py-3 px-4">
                  <span className={SUPERADMIN_FINANCE_INVOICE_STATUS_BADGE[inv.paymentStatus] || 'fin-badge fin-badge--neutral'}>{inv.paymentStatus}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={__SUPERADMIN_BILLING_MEMBER_INVOICES_ROUTES.SUPERADMIN_BILLING_INVOICES_MEMBER_INVOICES_FINANCE_URLS.INVOICE_DETAIL_PAGE(inv.id)} className="fin-badge fin-badge--neutral" aria-label={tCopy("COPY.OPEN_SAMPLE_INVOICE_PREVIEW_ARIA_LABEL", { number: inv.invoiceNumber })} data-testid="superadmin-finance-member_invoicess-link-1">
                      <Eye size={11} /> {tCopy("COPY.SAMPLE_PREVIEW")}</Link>
                    <button type="button" className="fin-badge fin-badge--neutral cursor-pointer" onClick={() => handlePrint(inv)} title={tCopy("COPY.PRINT_THERMAL")} aria-label={tCopy("COPY.PRINT_THERMAL")} data-testid={`superadmin-finance-finance-invoice-print-thermal-3-${String(inv.id)}`}>
                      <Printer size={11} />
                    </button>
                    <button type="button" className="fin-badge fin-badge--neutral cursor-not-allowed" disabled title={tCopy("COPY.SENDING_IS_DISABLED_FOR_BUNDLED_SAMPLE_RECORDS")} aria-label={tCopy("COPY.WHATSAPP_UNAVAILABLE_FOR_SAMPLE_INVOICE")} data-testid={`superadmin-finance-finance-invoice-sending-is-disabled-for-bundled-sample-records-4-${String(inv.id)}`}>
                      <Send size={11} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
