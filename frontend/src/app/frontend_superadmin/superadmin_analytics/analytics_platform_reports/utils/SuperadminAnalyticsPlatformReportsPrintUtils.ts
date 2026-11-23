import type { PlatformReportTableRecord } from '../types/SuperadminAnalyticsPlatformReportsTypes';

/** Prints platform reports roster in 1 landscape page without overflow. */
export function printPlatformReportsRoster(records: readonly PlatformReportTableRecord[], title = 'SuperAdmin Platform Tenants & Growth Report'): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=1000,height=700');
  if (!printWindow) {
    window.print();
    return;
  }
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const activeCount = records.filter((r) => r.status === 'ACTIVE').length;
  const totalBranches = records.reduce((acc, r) => acc + (r.branchCount || 0), 0);

  const html = `<!DOCTYPE html><html><head><title>${title}</title><style>
@page { size: landscape; margin: 8mm 6mm; } * { box-sizing: border-box; }
body { font-family: system-ui, sans-serif; color: #0f172a; margin: 0; padding: 10px; font-size: 8.5pt; line-height: 1.25; }
.header { display: flex; justify-content: space-between; border-bottom: 2px solid #0284c7; padding-bottom: 8px; margin-bottom: 8px; }
.title { font-size: 15px; font-weight: 800; text-transform: uppercase; color: #0284c7; }
.kpi-strip { display: flex; gap: 8px; margin-bottom: 8px; }
.kpi-chip { flex: 1; padding: 4px 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 8.5px; }
.kpi-chip strong { font-size: 10.5px; color: #0284c7; display: block; }
table { width: 100%; border-collapse: collapse; font-size: 8pt; table-layout: fixed; }
th { background-color: #f1f5f9; text-align: left; padding: 4px 5px; border: 1px solid #cbd5e1; font-weight: 700; font-size: 7.5pt; }
td { padding: 4px 5px; border: 1px solid #e2e8f0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.badge { display: inline-block; padding: 1px 4px; border-radius: 3px; font-size: 7.5px; font-weight: 700; }
.badge-active { background: #dcfce7; color: #15803d; } .badge-inactive { background: #fee2e2; color: #b91c1c; }
</style></head><body>
<div class="header"><div><div class="title">${title}</div><div style="font-size: 9.5px; color: #64748b;">Platform Tenants & Infrastructure Growth Overview</div></div><div style="font-size: 8.5px; text-align: right; color: #475569;"><div><strong>Generated:</strong> ${dateStr}</div><div>Confidential SuperAdmin Platform Export</div></div></div>
<div class="kpi-strip"><div class="kpi-chip"><span>Total Tenants</span><strong>${records.length}</strong></div><div class="kpi-chip"><span>Active Libraries</span><strong>${activeCount}</strong></div><div class="kpi-chip"><span>Total Branches</span><strong>${totalBranches}</strong></div><div class="kpi-chip"><span>Growth Tier</span><strong>Multi-Region</strong></div></div>
<table><thead><tr><th style="width: 12%;">Library ID</th><th style="width: 22%;">Library Name</th><th style="width: 8%;">Branches</th><th style="width: 12%;">City</th><th style="width: 10%;">State</th><th style="width: 14%;">Admin Name</th><th style="width: 11%;">Plan</th><th style="width: 11%;">Status</th></tr></thead>
<tbody>${records.map((r) => `<tr><td><strong>${r.libraryCode}</strong></td><td>${r.libraryName}</td><td>${r.branchCount}</td><td>${r.city}</td><td>${r.state}</td><td>${r.adminName}</td><td>${r.plan}</td><td><span class="badge ${r.status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}">${r.status}</span></td></tr>`).join('')}</tbody></table>
<div style="margin-top: 10px; font-size: 8px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 4px;"><span>Smart Library SaaS System · SuperAdmin Platform Analytics</span><span>Internal Operations Output</span></div>
<script>window.onload = function() { window.print(); }</script></body></html>`.trim();

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
