'use client';

import { toast } from 'sonner';

export interface SystemHealthTelemetryData {
  rps: string;
  latency: string;
  errorRate: string;
  webSockets: string;
  uptime: string;
}

export function buildSystemHealthSnapshotPayload(
  telemetryData: SystemHealthTelemetryData,
  serviceNodes: any[]
) {
  return {
    exportTimestamp: new Date().toISOString(),
    system: 'LibraryOS Superadmin Infrastructure Telemetry',
    environment: 'production',
    region: 'ap-south-1',
    globalMetrics: {
      rps: telemetryData.rps,
      avgLatency: telemetryData.latency,
      errorRate5xx: telemetryData.errorRate,
      activeWebSockets: telemetryData.webSockets,
      uptime30Days: telemetryData.uptime,
    },
    services: serviceNodes,
  };
}

export function exportSystemHealthJSON(
  telemetryData: SystemHealthTelemetryData,
  serviceNodes: any[]
): void {
  const payload = buildSystemHealthSnapshotPayload(telemetryData, serviceNodes);
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `system-health-snapshot-${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  toast.success('JSON telemetry snapshot exported');
}

export function exportSystemHealthCSV(serviceNodes: any[]): void {
  const headers = ['ID', 'Service Name', 'Category', 'Cluster Node', 'Latency', 'CPU %', 'Memory Allocation', 'Status', 'Uptime'];
  const rows = serviceNodes.map((item) => [
    item.id,
    `"${item.name}"`,
    item.category,
    item.node,
    item.latency,
    `${item.cpu}%`,
    `"${item.memory}"`,
    item.status,
    item.uptime,
  ]);
  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob(['\uFEFF', csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `services-health-matrix-${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  toast.success('CSV service health matrix exported');
}

export function printSystemHealthReport(telemetryData: SystemHealthTelemetryData, serviceNodes: any[]): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=1000,height=700');
  if (!printWindow) {
    window.print();
    return;
  }
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const html = `
    <!DOCTYPE html><html><head><title>SuperAdmin Infrastructure Telemetry & Health Report</title>
    <style>
      @page { size: landscape; margin: 8mm 6mm; } * { box-sizing: border-box; }
      body { font-family: system-ui, sans-serif; color: #0f172a; margin: 0; padding: 10px; font-size: 8.5pt; }
      .header { display: flex; justify-content: space-between; border-bottom: 2px solid #059669; padding-bottom: 8px; margin-bottom: 8px; }
      .title { font-size: 15px; font-weight: 800; text-transform: uppercase; color: #059669; }
      .kpi-strip { display: flex; gap: 8px; margin-bottom: 8px; }
      .kpi-chip { flex: 1; padding: 4px 8px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 4px; }
      table { width: 100%; border-collapse: collapse; font-size: 8pt; }
      th { background-color: #f1f5f9; padding: 4px 5px; border: 1px solid #cbd5e1; text-align: left; }
      td { padding: 4px 5px; border: 1px solid #e2e8f0; }
    </style></head><body>
      <div class="header"><div><div class="title">System Health & Telemetry</div><div>Date: ${dateStr}</div></div></div>
      <div class="kpi-strip"><div class="kpi-chip">Uptime: ${telemetryData.uptime}</div><div class="kpi-chip">Avg Latency: ${telemetryData.latency}</div><div class="kpi-chip">Nodes: ${serviceNodes.length}</div></div>
      <table><thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Node</th><th>Latency</th><th>CPU</th><th>Memory</th><th>Status</th><th>Uptime</th></tr></thead>
      <tbody>${serviceNodes.map((s) => `<tr><td>${s.id}</td><td>${s.name}</td><td>${s.category}</td><td>${s.node}</td><td>${s.latency}</td><td>${s.cpu}%</td><td>${s.memory}</td><td>${s.status}</td><td>${s.uptime}</td></tr>`).join('')}</tbody></table>
    </body></html>`;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 250);
}
