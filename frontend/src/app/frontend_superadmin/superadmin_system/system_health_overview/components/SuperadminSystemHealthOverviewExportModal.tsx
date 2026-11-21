'use client';
import { useState } from 'react';
import { X, Download, FileText, FileSpreadsheet, Printer, Check, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { SAMPLE_SERVICE_NODES } from './SuperadminSystemHealthOverviewServicesTable';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  telemetryData?: {
    rps: string;
    latency: string;
    errorRate: string;
    webSockets: string;
    uptime: string;
  };
}

export default function SuperadminSystemHealthOverviewExportModal({
  isOpen,
  onClose,
  telemetryData = {
    rps: '1,248 req/s',
    latency: '38ms',
    errorRate: '0.012%',
    webSockets: '8,432',
    uptime: '99.991%',
  },
}: ExportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getSnapshotPayload = () => ({
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
    services: SAMPLE_SERVICE_NODES,
  });

  const handleExportJSON = () => {
    const payload = getSnapshotPayload();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `system-health-snapshot-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('JSON telemetry snapshot exported');
    onClose();
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Service Name', 'Category', 'Cluster Node', 'Latency', 'CPU %', 'Memory Allocation', 'Status', 'Uptime'];
    const rows = SAMPLE_SERVICE_NODES.map((item) => [
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
    onClose();
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(getSnapshotPayload(), null, 2));
    setCopied(true);
    toast.success('Snapshot JSON copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    onClose();
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=1000,height=700');
    if (!printWindow) {
      window.print();
      return;
    }
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>SuperAdmin Infrastructure Telemetry & Health Report</title>
          <style>
            @page { size: landscape; margin: 8mm 6mm; }
            * { box-sizing: border-box; }
            body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; margin: 0; padding: 10px; font-size: 8.5pt; line-height: 1.25; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #059669; padding-bottom: 8px; margin-bottom: 8px; }
            .title { font-size: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #059669; }
            .subtitle { font-size: 9.5px; color: #64748b; margin-top: 2px; }
            .meta { font-size: 8.5px; text-align: right; color: #475569; }
            .kpi-strip { display: flex; gap: 8px; margin-bottom: 8px; }
            .kpi-chip { flex: 1; padding: 4px 8px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 4px; font-size: 8.5px; }
            .kpi-chip strong { font-size: 10.5px; color: #059669; display: block; }
            table { width: 100%; border-collapse: collapse; font-size: 8pt; table-layout: fixed; }
            th { background-color: #f1f5f9; color: #0f172a; text-align: left; padding: 4px 5px; border: 1px solid #cbd5e1; font-weight: 700; text-transform: uppercase; font-size: 7.5pt; }
            td { padding: 4px 5px; border: 1px solid #e2e8f0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            tr { page-break-inside: avoid; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .badge { display: inline-block; padding: 1px 4px; border-radius: 3px; font-size: 7.5px; font-weight: 700; text-transform: uppercase; }
            .badge-online { background: #dcfce7; color: #15803d; }
            .badge-degraded { background: #fef3c7; color: #b45309; }
            .badge-offline { background: #fee2e2; color: #b91c1c; }
            .footer { margin-top: 10px; font-size: 8px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 4px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">System Infrastructure & Microservices Telemetry</div>
              <div class="subtitle">Platform Resilience, Cluster Node Health & Real-Time Performance Matrix</div>
            </div>
            <div class="meta">
              <div><strong>Generated:</strong> ${dateStr}</div>
              <div><strong>Region / Cluster:</strong> ap-south-1 (Mumbai Production Cluster)</div>
            </div>
          </div>
          <div class="kpi-strip">
            <div class="kpi-chip"><span>Network Throughput</span><strong>${telemetryData.rps}</strong></div>
            <div class="kpi-chip"><span>Avg Gateway Latency</span><strong>${telemetryData.latency}</strong></div>
            <div class="kpi-chip"><span>5xx Error Rate</span><strong>${telemetryData.errorRate}</strong></div>
            <div class="kpi-chip"><span>Active Sockets</span><strong>${telemetryData.webSockets}</strong></div>
            <div class="kpi-chip"><span>Rolling Uptime (30d)</span><strong>${telemetryData.uptime}</strong></div>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 22%;">Microservice</th>
                <th style="width: 14%;">Category</th>
                <th style="width: 14%;">Cluster Node</th>
                <th style="width: 10%;">Latency</th>
                <th style="width: 8%;">CPU</th>
                <th style="width: 12%;">Memory</th>
                <th style="width: 10%;">Status</th>
                <th style="width: 10%;">Uptime</th>
              </tr>
            </thead>
            <tbody>
              ${SAMPLE_SERVICE_NODES.map((item) => `
                <tr>
                  <td><strong>${item.name}</strong></td>
                  <td>${item.category}</td>
                  <td>${item.node}</td>
                  <td>${item.latency}</td>
                  <td>${item.cpu}%</td>
                  <td>${item.memory}</td>
                  <td><span class="badge ${item.status === 'online' ? 'badge-online' : item.status === 'degraded' ? 'badge-degraded' : 'badge-offline'}">${item.status}</span></td>
                  <td>${item.uptime}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <span>Smart Library SaaS System · Infrastructure SRE Operations</span>
            <span>Confidential — Internal System Output</span>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `.trim();

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-emerald-500/30 bg-[#0c1022] p-6 shadow-2xl text-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Download size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Export System Health Snapshot</h2>
              <p className="text-xs text-slate-400">Download telemetry metrics, cluster status, and audit reports</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Export Options Grid */}
        <div className="py-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={handleExportJSON}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/15 transition-all text-center group cursor-pointer"
          >
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
              <FileText size={22} />
            </div>
            <span className="text-xs font-bold text-slate-200">JSON Telemetry</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Machine readable</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-teal-500/30 bg-teal-500/5 hover:bg-teal-500/15 transition-all text-center group cursor-pointer"
          >
            <div className="p-3 rounded-xl bg-teal-500/20 text-teal-400 mb-2 group-hover:scale-110 transition-transform">
              <FileSpreadsheet size={22} />
            </div>
            <span className="text-xs font-bold text-slate-200">CSV Matrix</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Spreadsheet table</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-sky-500/30 bg-sky-500/5 hover:bg-sky-500/15 transition-all text-center group cursor-pointer"
          >
            <div className="p-3 rounded-xl bg-sky-500/20 text-sky-400 mb-2 group-hover:scale-110 transition-transform">
              <Printer size={22} />
            </div>
            <span className="text-xs font-bold text-slate-200">Print / PDF</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Executive audit</span>
          </button>
        </div>

        {/* Snapshot Summary Box */}
        <div className="p-3.5 rounded-xl border border-border/60 bg-slate-900/60 text-xs space-y-1.5 mb-4">
          <div className="flex justify-between text-slate-400">
            <span>Snapshot Time:</span>
            <span className="font-mono text-slate-200">{new Date().toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Included Services:</span>
            <span className="text-emerald-400 font-semibold">{SAMPLE_SERVICE_NODES.length} Active Nodes</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Global Availability:</span>
            <span className="text-emerald-400 font-semibold">{telemetryData.uptime}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border/80">
          <button
            type="button"
            onClick={handleCopyJSON}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 bg-slate-800/60 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
