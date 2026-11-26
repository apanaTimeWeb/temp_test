import type { UsageReportTableRecord } from '@/app/frontend_superadmin/superadmin_analytics/analytics_usage_reports/types/SuperadminAnalyticsUsageReportsTypes';
import { formatStorageSize } from '@/app/frontend_superadmin/superadmin_analytics/analytics_usage_reports/utils/SuperadminAnalyticsUsageReportsFormatters';

/** Prints usage reports roster in 1 landscape page without overflow. */
export function printUsageReportsRoster(records: readonly UsageReportTableRecord[], title = 'SuperAdmin System Resource & API Usage Report'): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=1000,height=700');
  if (!printWindow) {
    window.print();
    return;
  }
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const totalStorageMb = records.reduce((acc, r) => acc + (r.storageMb || 0), 0);
  const totalStudents = records.reduce((acc, r) => acc + (r.membersCount || 0), 0);

  const html = `<!DOCTYPE html><html><head><title>${title}</title><style>
@page { size: landscape; margin: 8mm 6mm; } * { box-sizing: border-box; }
body { font-family: system-ui, sans-serif; color: #0f172a; margin: 0; padding: 10px; font-size: 8.5pt; line-height: 1.25; }
.header { display: flex; justify-content: space-between; border-bottom: 2px solid #059669; padding-bottom: 8px; margin-bottom: 8px; }
.title { font-size: 15px; font-weight: 800; text-transform: uppercase; color: #059669; }
.kpi-strip { display: flex; gap: 8px; margin-bottom: 8px; }
.kpi-chip { flex: 1; padding: 4px 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 8.5px; }
.kpi-chip strong { font-size: 10.5px; color: #059669; display: block; }
table { width: 100%; border-collapse: collapse; font-size: 8pt; table-layout: fixed; }
th { background-color: #f1f5f9; text-align: left; padding: 4px 5px; border: 1px solid #cbd5e1; font-weight: 700; font-size: 7.5pt; }
td { padding: 4px 5px; border: 1px solid #e2e8f0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style></head><body>
<div class="header"><div><div class="title">${title}</div><div style="font-size: 9.5px; color: #64748b;">Infrastructure Utilization, DB Storage & API Quota Telemetry</div></div><div style="font-size: 8.5px; text-align: right; color: #475569;"><div><strong>Generated:</strong> ${dateStr}</div><div>System Operations Report</div></div></div>
<div class="kpi-strip"><div class="kpi-chip"><span>Total Tenants Monitored</span><strong>${records.length}</strong></div><div class="kpi-chip"><span>Total Storage Consumed</span><strong>${formatStorageSize(totalStorageMb)}</strong></div><div class="kpi-chip"><span>Active Members Hosted</span><strong>${totalStudents.toLocaleString('en-IN')}</strong></div><div class="kpi-chip"><span>Compute State</span><strong>Nominal</strong></div></div>
<table><thead><tr><th style="width: 12%;">Code</th><th style="width: 22%;">Library Name</th><th style="width: 11%;">Plan</th><th style="width: 11%;">Branch</th><th style="width: 14%;">Members</th><th style="width: 15%;">Storage Used</th><th style="width: 15%;">API Calls Today</th></tr></thead>
<tbody>${records.map((r) => `<tr><td>${r.libraryCode}</td><td>${r.libraryName}</td><td>${r.plan}</td><td>${r.branchName || 'Main'}</td><td>${(r.membersCount ?? 0).toLocaleString('en-IN')}</td><td>${formatStorageSize(r.storageMb)}</td><td>${(r.apiCalls ?? 0).toLocaleString('en-IN')}</td></tr>`).join('')}</tbody></table>
<div style="margin-top: 10px; font-size: 8px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 4px;"><span>Smart Library SaaS System · Infrastructure Telemetry</span><span>Confidential System Metric Ledger</span></div>
<script>window.onload = function() { window.print(); }</script></body></html>`.trim();

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
