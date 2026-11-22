'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { Download, FileText, ArrowRight, CreditCard, Landmark, ShieldCheck } from 'lucide-react';
import type { SuperadminBillingInvoiceSample } from '@/app/frontend_superadmin/superadmin_billing/billing_overview/types/SuperadminBillingOverviewTypes';
import { SUPERADMIN_BILLING_SAMPLE_INVOICES } from '@/app/frontend_superadmin/superadmin_billing/billing_overview/mocks/fixtures/SuperadminBillingOverviewSampleMockFixtures';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';

import SuperadminBillingOverviewInvoicesTab from './SuperadminBillingOverviewInvoicesTab';
import SuperadminBillingOverviewGstForm from './SuperadminBillingOverviewGstForm';
import SuperadminBillingOverviewRefundsTab from './SuperadminBillingOverviewRefundsTab';

interface SuperadminBillingOverviewPageClientProps {
  initialTab?: string;
}

export default function SuperadminBillingOverviewPageClient({ initialTab }: SuperadminBillingOverviewPageClientProps = {}) {
  const tCopy = useTranslations('SUPERADMIN_BILLING');

  const [activeTab, setActiveTab] = useState<'invoices' | 'gst' | 'refunds'>(
    initialTab === 'gst' ? 'gst' : initialTab === 'refunds' ? 'refunds' : 'invoices'
  );

  const [invoices] = useState<SuperadminBillingInvoiceSample[]>(SUPERADMIN_BILLING_SAMPLE_INVOICES);

  const showToast = (msg: string) => {
    toast.message(msg, { id: 'superadmin:superadmin_billing:SuperadminBillingOverviewPageClient:feedback' });
  };

  const exportInvoicePreviewCsv = () => {
    const escapeCell = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
    const lines = [
      ['Invoice ID', 'Tenant', 'Date', 'Amount INR', 'Status', 'Method', 'GST'],
      ...invoices.map((row) => [row.id, row.tenant, row.date, row.amount, row.status, row.method, row.gst]),
    ];
    const blob = new Blob([lines.map((line) => line.map(escapeCell).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'superadmin_invoice_sample_preview.csv';
    anchor.click();
    URL.revokeObjectURL(url);
    showToast(tCopy('COPY.SAMPLE_INVOICE_ROWS_EXPORTED_THIS_FILE_CONTAINS_ONLY_LOCAL_DEMONSTRATI_F7A809E7'));
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 pb-12">
      {/* Hero Header */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-bold text-primary">{tCopy('COPY.BILLING_REVENUE')}</h1>
            <p className="text-xs text-secondary">
              Platform revenue overview, payment reconciliation, GST configuration, and dispute settlements.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={SUPERADMIN_NAVIGATION_ROUTES.billing_invoices}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-semibold shadow-card hover:bg-primary-hover motion-safe:active:scale-95 motion-safe:transition-all cursor-pointer"
            >
              <FileText size={14} />
              <span>Platform Invoices & Rules</span>
              <ArrowRight size={12} />
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-input text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-all motion-safe:active:scale-95 cursor-pointer shadow-card"
              onClick={exportInvoicePreviewCsv}
              data-testid="superadmin-billing-billing-overview-export-csv-2"
            >
              <Download size={14} className="text-primary" /> {tCopy('COPY.EXPORT_CSV')}
            </button>
          </div>
        </div>
      </div>

      <p className="rounded-xl border border-border bg-warning-bg p-3.5 text-xs text-warning" role="status">
        {tCopy('COPY.INVOICE_AND_PROMOTION_ENTRIES_ARE_LOCAL_DEMONSTRATION_DATA_PROMO_CHANGES_ARE_PREVIEWS_AND_ARE_NOT_LIVE_BILLING_CHANGES')}
      </p>

      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-1 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('invoices')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold motion-safe:transition-all cursor-pointer ${
            activeTab === 'invoices'
              ? 'bg-primary text-on-primary shadow-card'
              : 'text-secondary hover:text-primary hover:bg-surface-hover'
          }`}
        >
          <CreditCard size={14} />
          <span>Payment Collection & Ledger</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('gst')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold motion-safe:transition-all cursor-pointer ${
            activeTab === 'gst'
              ? 'bg-primary text-on-primary shadow-card'
              : 'text-secondary hover:text-primary hover:bg-surface-hover'
          }`}
        >
          <Landmark size={14} />
          <span>GST Settings & Taxes</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('refunds')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold motion-safe:transition-all cursor-pointer ${
            activeTab === 'refunds'
              ? 'bg-primary text-on-primary shadow-card'
              : 'text-secondary hover:text-primary hover:bg-surface-hover'
          }`}
        >
          <ShieldCheck size={14} />
          <span>Refunds & Credit Notes</span>
        </button>
      </div>

      {/* Active Tab View */}
      {activeTab === 'invoices' && <SuperadminBillingOverviewInvoicesTab invoices={invoices} />}
      {activeTab === 'gst' && <SuperadminBillingOverviewGstForm />}
      {activeTab === 'refunds' && <SuperadminBillingOverviewRefundsTab />}
    </div>
  );
}
