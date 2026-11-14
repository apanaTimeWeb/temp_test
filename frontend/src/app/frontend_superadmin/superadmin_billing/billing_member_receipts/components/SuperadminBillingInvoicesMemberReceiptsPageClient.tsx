'use client';
import SuperadminBillingInvoicesMemberReceiptsEmptyState from '@/app/frontend_superadmin/superadmin_billing/billing_member_receipts/components/SuperadminBillingInvoicesMemberReceiptsEmptyState';
/** Responsibility: Superadmin Finance Receipt Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminBillingInvoicesMemberReceiptsPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { SUPERADMIN_BILLING_MEMBER_RECEIPTS_ROUTES as __SUPERADMIN_BILLING_MEMBER_RECEIPTS_ROUTES } from "@/app/frontend_superadmin/superadmin_billing/billing_member_receipts/config/superadmin_billing_member_receipts.url_config";
import { useSuperadminBillingInvoicesMemberReceiptsUrlFilter } from '@/app/frontend_superadmin/superadmin_billing/billing_member_receipts/hooks/useSuperadminBillingInvoicesMemberReceiptsUrlFilter';

import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import Link from 'next/link';
import { formatMajorUnitPreviewCurrency, formatDate } from '@/app/frontend_superadmin/superadmin_billing/billing_member_receipts/utils/SuperadminBillingInvoicesMemberReceiptsFormatters';
import { Search, Receipt, Eye, Printer, Send } from 'lucide-react';
import { printThermal } from '@/lib/thermalPrint';
import { SUPERADMIN_FINANCE_SAMPLE_RECEIPTS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_receipts/mocks/fixtures/SuperadminBillingInvoicesMemberReceiptsMockFixtures';
import { SUPERADMIN_FINANCE_RECEIPT_MODE_BADGE } from '@/app/frontend_superadmin/superadmin_billing/billing_member_receipts/constants/SuperadminBillingInvoicesMemberReceiptsConstants';
import type { FilterMode } from '@/app/frontend_superadmin/superadmin_billing/billing_member_receipts/types/SuperadminBillingInvoicesMemberReceiptsPageClientComponentTypes';


/**
 * Renders the `superadmin_member_finance` view owned by `SuperadminBillingInvoicesMemberReceiptsPageClient`.
 * Owns local UI state for `search`, `modeFilter`.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminBillingInvoicesMemberReceiptsPageClient() {
  const tCopy = useTranslations('SUPERADMIN_FINANCE');
  const locale = useLocale();
  const [search, setSearch]           = useState('');
  const [modeFilter, setModeFilter]   = useSuperadminBillingInvoicesMemberReceiptsUrlFilter<FilterMode>('paymentMode', 'all', ['all', 'upi', 'cash', 'card', 'bank transfer']);

  const filtered = SUPERADMIN_FINANCE_SAMPLE_RECEIPTS.filter(r => {
    const ms = !search || r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.receiptNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.studentId.toLowerCase().includes(search.toLowerCase());
    const mm = modeFilter === 'all' || r.paymentMode.toLowerCase() === modeFilter;
    return ms && mm;
  });

  const totalCollected = SUPERADMIN_FINANCE_SAMPLE_RECEIPTS.reduce((s, r) => s + r.amount, 0);


  function handlePrint(r: typeof SUPERADMIN_FINANCE_SAMPLE_RECEIPTS[0]) {
    printThermal({
      type: 'receipt', shopName: 'SAMPLE PREVIEW — NOT A PAYMENT', branch: 'Demo Branch — sample only',
      studentName: r.studentName, smartId: r.studentId, phone: r.phone,
      shift: r.shift, seat: r.seat, plan: r.planName,
      billNumber: r.receiptNumber, date: formatDate(r.date, locale),
      totalPayable: r.amount, amountPaid: 0, discount: 0,
      balance: r.amount, paymentMode: 'SAMPLE ONLY — NOT PAID',
    });
  }

  return (
    <div className="space-y-6">
      {(filtered?.length === 0) && <SuperadminBillingInvoicesMemberReceiptsEmptyState filtered />}

      <div>
        <h1 className="fin-page-title">{tCopy("COPY.RECEIPTS_SAMPLE")}</h1>
        <p className="fin-page-subtitle">{tCopy("COPY.SAMPLE_RECEIPT_PREVIEWS_ONLY_NO_REAL_TRANSACTIONS_OR_RECEIPT_DETAI_7C02117C")}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: tCopy('COPY.SAMPLE_RECEIPTS'),  value: SUPERADMIN_FINANCE_SAMPLE_RECEIPTS.length.toString() },
          { label: tCopy('COPY.TOTAL_COLLECTED'), value: formatMajorUnitPreviewCurrency(totalCollected, 'INR', locale), success: true },
          { label: tCopy('COPY.THIS_MONTH_2'),      value: SUPERADMIN_FINANCE_SAMPLE_RECEIPTS.filter(r => r.date.startsWith(new Date().toISOString().slice(0, 7))).length.toString() },
        ].map((k) => (
          <div key={k.label} className="fin-kpi-card">
            <div className="fin-kpi-card__header"><p className="fin-kpi-label">{k.label}</p><Receipt size={18} className="fin-icon-muted" /></div>
            <p className={`fin-kpi-value${k.success ? ' fin-text-success' : ''}`}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="fin-filter-bar">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 fin-icon-muted" />
          <input aria-label={tCopy("COPY.SEARCH_BY_RECEIPT_NO_STUDENT_NAME_OR_ID")} className="fin-input fin-input--pl9" placeholder={tCopy("COPY.SEARCH_BY_RECEIPT_NO_STUDENT_NAME_OR_ID_2")} value={search} onChange={e => setSearch(e.target.value)}  data-testid="superadmin-finance-finance-receipt-search-by-receipt-no-student-name-or-id-1"/>
        </div>
        <select aria-label={tCopy("COPY.MODE_FILTER")} className="fin-select w-40" value={modeFilter} onChange={e => setModeFilter(e.target.value as FilterMode)} data-testid="superadmin-finance-finance-receipt-mode-filter-2">
          <option value="all">{tCopy("COPY.ALL_MODES")}</option>
          <option value="upi">{tCopy("COPY.UPI")}</option>
          <option value="cash">{tCopy("COPY.CASH")}</option>
          <option value="card">{tCopy("COPY.CARD")}</option>
          <option value="bank transfer">{tCopy("COPY.BANK_TRANSFER")}</option>
        </select>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">{tCopy("COPY.RECEIPT_NO")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.STUDENT")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.PLAN")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.DATE")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.AMOUNT")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.MODE")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.ACTIONS")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7}><div className="fin-empty-state"><div className="fin-empty-state__icon">🧾</div><p className="fin-empty-state__title">{tCopy("COPY.NO_RECEIPTS_FOUND")}</p></div></td></tr>
            ) : filtered.map((r) => (
              <tr key={r.id} className="fin-table-hover-row fin-table-row">
                <td className="py-3 px-4"><span className="fin-mono">{r.receiptNumber}</span></td>
                <td className="py-3 px-4">
                  <p className="fin-cell-name">{r.studentName}</p>
                  <p className="fin-cell-subtext">{r.studentId}</p>
                </td>
                <td className="py-3 px-4 fin-cell-subtext fin-receipt-plan-column">{r.planName}</td>
                <td className="py-3 px-4 fin-cell-subtext">{formatDate(r.date, locale)}</td>
                <td className="py-3 px-4 text-right font-semibold fin-text-body">{tCopy('COPY.FINANCIAL_DETAIL_ONLY')}</td>
                <td className="py-3 px-4">
                  <span className={SUPERADMIN_FINANCE_RECEIPT_MODE_BADGE[r.paymentMode.toLowerCase()] || 'fin-badge fin-badge--info'}>{r.paymentMode}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={__SUPERADMIN_BILLING_MEMBER_RECEIPTS_ROUTES.SUPERADMIN_BILLING_INVOICES_MEMBER_RECEIPTS_FINANCE_URLS.RECEIPT_DETAIL_PAGE(r.id)} className="fin-badge fin-badge--neutral" aria-label={tCopy("COPY.OPEN_SAMPLE_RECEIPT_PREVIEW_ARIA_LABEL", { number: r.receiptNumber })} data-testid="superadmin-finance-member_receiptss-link-1">
                      <Eye size={11} /> {tCopy("COPY.SAMPLE_PREVIEW")}</Link>
                    <button type="button" className="fin-badge fin-badge--neutral cursor-pointer" onClick={() => handlePrint(r)} title={tCopy("COPY.PRINT_THERMAL")} data-testid={`superadmin-finance-finance-receipt-print-thermal-3-${String(r.id)}`}>
                      <Printer size={11} aria-hidden="true" />
                    </button>
                    <button type="button" className="fin-badge fin-badge--neutral cursor-not-allowed" disabled title={tCopy("COPY.SENDING_IS_DISABLED_FOR_BUNDLED_SAMPLE_RECORDS")} aria-label={tCopy("COPY.WHATSAPP_UNAVAILABLE_FOR_SAMPLE_RECEIPT")} data-testid={`superadmin-finance-finance-receipt-sending-is-disabled-for-bundled-sample-records-4-${String(r.id)}`}>
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
