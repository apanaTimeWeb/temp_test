import type { SecurityReportTableRecord } from '@/app/frontend_superadmin/superadmin_analytics/analytics_security_reports/types/SuperadminAnalyticsSecurityReportsTypes';
import { formatSecurityEventLabel } from '@/app/frontend_superadmin/superadmin_analytics/analytics_security_reports/utils/SuperadminAnalyticsSecurityReportsFormatters';

/** Prints security reports roster in 1 landscape page without overflow. */
export function printSecurityReportsRoster(records: readonly SecurityReportTableRecord[], title = 'SuperAdmin Security Audit & Threat Intelligence Report'): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=1000,height=700');
  if (!printWindow) {
    window.print();
    return;
  }
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const criticalCount = records.filter((r) => r.severity === 'CRITICAL').length;
  const highCount = records.filter((r) => r.severity === 'HIGH').length;

  const html = `<!DOCTYPE html><html><head><title>${title}</title><style>
@page { size: landscape; margin: 8mm 6mm; } * { box-sizing: border-box; }
body { font-family: system-ui, sans-serif; color: #0f172a; margin: 0; padding: 10px; font-size: 8.5pt; line-height: 1.25; }
.header { display: flex; justify-content: space-between; border-bottom: 2px solid #991b1b; padding-bottom: 8px; margin-bottom: 8px; }
.title { font-size: 15px; font-weight: 800; text-transform: uppercase; color: #991b1b; }
.kpi-strip { display: flex; gap: 8px; margin-bottom: 8px; }
.kpi-chip { flex: 1; padding: 4px 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 8.5px; }
.kpi-chip strong { font-size: 10.5px; color: #991b1b; display: block; }
table { width: 100%; border-collapse: collapse; font-size: 8pt; table-layout: fixed; }
th { background-color: #f1f5f9; text-align: left; padding: 4px 5px; border: 1px solid #cbd5e1; font-weight: 700; font-size: 7.5pt; }
td { padding: 4px 5px; border: 1px solid #e2e8f0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.badge { display: inline-block; padding: 1px 4px; border-radius: 3px; font-size: 7.5px; font-weight: 700; }
.badge-critical { background: #fee2e2; color: #991b1b; } .badge-high { background: #ffedd5; color: #c2410c; }
</style></head><body>
<div class="header"><div><div class="title">${title}</div><div style="font-size: 9.5px; color: #64748b;">Zero-Trust Access Log & Threat Telemetry Ledger</div></div><div style="font-size: 8.5px; text-align: right; color: #475569;"><div><strong>Generated:</strong> ${dateStr}</div><div>Restricted Security Document</div></div></div>
<div class="kpi-strip"><div class="kpi-chip"><span>Total Events</span><strong>${records.length}</strong></div><div class="kpi-chip"><span>Critical Alerts</span><strong>${criticalCount}</strong></div><div class="kpi-chip"><span>High Severity</span><strong>${highCount}</strong></div><div class="kpi-chip"><span>Audit Standard</span><strong>SOC2 Type II</strong></div></div>
<table><thead><tr><th style="width: 14%;">Timestamp</th><th style="width: 18%;">Event Type</th><th style="width: 10%;">Severity</th><th style="width: 16%;">Library</th><th style="width: 14%;">User</th><th style="width: 12%;">IP Address</th><th style="width: 16%;">Location</th></tr></thead>
<tbody>${records.map((r) => `<tr><td>${r.timestamp}</td><td>${formatSecurityEventLabel(r.eventType)}</td><td><span class="badge ${r.severity === 'CRITICAL' ? 'badge-critical' : 'badge-high'}">${r.severity}</span></td><td>${r.libraryName}</td><td>${r.adminName}</td><td>${r.ipAddress}</td><td>${r.location}</td></tr>`).join('')}</tbody></table>
<div style="margin-top: 10px; font-size: 8px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 4px;"><span>Smart Library SaaS System · SuperAdmin Security Center</span><span>Strictly Confidential</span></div>
<script>window.onload = function() { window.print(); }</script></body></html>`.trim();

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
