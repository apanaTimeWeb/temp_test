import type { BillingReportTableRecord } from '../types/SuperadminAnalyticsBillingReportsTypes';
import { formatBillingCurrency } from './SuperadminAnalyticsBillingReportsFormatters';

/** Prints billing reports roster in 1 landscape page without overflow. */
export function printBillingReportsRoster(records: readonly BillingReportTableRecord[], title = 'SuperAdmin Billing & Revenue Analytics Report'): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=1000,height=700');
  if (!printWindow) {
    window.print();
    return;
  }
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const totalAmountMinor = records.reduce((acc, r) => acc + (r.amountMinor || 0), 0);
  const paidCount = records.filter((r) => r.paymentStatus === 'PAID').length;
  const overdueCount = records.filter((r) => r.paymentStatus === 'OVERDUE').length;

  const html = `<!DOCTYPE html><html><head><title>${title}</title><style>
@page { size: landscape; margin: 8mm 6mm; } * { box-sizing: border-box; }
body { font-family: system-ui, sans-serif; color: #0f172a; margin: 0; padding: 10px; font-size: 8.5pt; line-height: 1.25; }
.header { display: flex; justify-content: space-between; border-bottom: 2px solid #312e81; padding-bottom: 8px; margin-bottom: 8px; }
.title { font-size: 15px; font-weight: 800; text-transform: uppercase; color: #312e81; }
.kpi-strip { display: flex; gap: 8px; margin-bottom: 8px; }
.kpi-chip { flex: 1; padding: 4px 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 8.5px; }
.kpi-chip strong { font-size: 10.5px; color: #312e81; display: block; }
table { width: 100%; border-collapse: collapse; font-size: 8pt; table-layout: fixed; }
th { background-color: #f1f5f9; text-align: left; padding: 4px 5px; border: 1px solid #cbd5e1; font-weight: 700; font-size: 7.5pt; }
td { padding: 4px 5px; border: 1px solid #e2e8f0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.badge { display: inline-block; padding: 1px 4px; border-radius: 3px; font-size: 7.5px; font-weight: 700; }
.badge-paid { background: #dcfce7; color: #15803d; } .badge-overdue { background: #fee2e2; color: #b91c1c; } .badge-pending { background: #fef3c7; color: #b45309; }
</style></head><body>
<div class="header"><div><div class="title">${title}</div><div style="font-size: 9.5px; color: #64748b;">Platform Financial Records & Invoice Settlement Roster</div></div><div style="font-size: 8.5px; text-align: right; color: #475569;"><div><strong>Generated:</strong> ${dateStr}</div><div>Confidential SuperAdmin Financial Export</div></div></div>
<div class="kpi-strip"><div class="kpi-chip"><span>Total Records</span><strong>${records.length}</strong></div><div class="kpi-chip"><span>Gross Billed Value</span><strong>${formatBillingCurrency(totalAmountMinor)}</strong></div><div class="kpi-chip"><span>Settled (PAID)</span><strong>${paidCount}</strong></div><div class="kpi-chip"><span>Overdue Invoices</span><strong>${overdueCount}</strong></div></div>
<table><thead><tr><th style="width: 11%;">Invoice No</th><th style="width: 21%;">Library Name</th><th style="width: 13%;">Branch</th><th style="width: 9%;">Plan</th><th style="width: 8%;">Cycle</th><th style="width: 10%;">Amount</th><th style="width: 9%;">Status</th><th style="width: 9%;">Method</th><th style="width: 10%;">Date</th></tr></thead>
<tbody>${records.map((r) => `<tr><td><strong>${r.invoiceNumber}</strong></td><td>${r.libraryName}</td><td>${r.branchName}</td><td>${r.planName}</td><td>${r.billingCycle}</td><td>${formatBillingCurrency(r.amountMinor)}</td><td><span class="badge ${r.paymentStatus === 'PAID' ? 'badge-paid' : r.paymentStatus === 'OVERDUE' ? 'badge-overdue' : 'badge-pending'}">${r.paymentStatus}</span></td><td>${r.paymentMethod}</td><td>${r.invoiceDate}</td></tr>`).join('')}</tbody></table>
<div style="margin-top: 10px; font-size: 8px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 4px;"><span>Smart Library SaaS System · SuperAdmin Financial Reports</span><span>Confidential — Internal System Output</span></div>
<script>window.onload = function() { window.print(); }</script></body></html>`.trim();

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
