'use client';
import { useState } from 'react';
import { X, Download, FileText, FileSpreadsheet, Printer, Check, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { SAMPLE_SERVICE_NODES } from '@/app/frontend_superadmin/superadmin_system/system_health_overview/components/SuperadminSystemHealthOverviewServicesTable';
import {
  buildSystemHealthSnapshotPayload,
  exportSystemHealthCSV,
  exportSystemHealthJSON,
  printSystemHealthReport,
  type SystemHealthTelemetryData,
} from '@/app/frontend_superadmin/superadmin_system/system_health_overview/utils/SuperadminSystemHealthOverviewExportUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  telemetryData?: SystemHealthTelemetryData;
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

  const handleExportJSON = () => {
    exportSystemHealthJSON(telemetryData, SAMPLE_SERVICE_NODES);
    onClose();
  };

  const handleExportCSV = () => {
    exportSystemHealthCSV(SAMPLE_SERVICE_NODES);
    onClose();
  };

  const handleCopyJSON = () => {
    const payload = buildSystemHealthSnapshotPayload(telemetryData, SAMPLE_SERVICE_NODES);
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    toast.success('Snapshot JSON copied to clipboard', {
      id: 'superadmin:system_health:copy-json',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    onClose();
    printSystemHealthReport(telemetryData, SAMPLE_SERVICE_NODES);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in motion-safe:duration-200">
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
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/15 motion-safe:transition-all text-center group cursor-pointer"
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
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-teal-500/30 bg-teal-500/5 hover:bg-teal-500/15 motion-safe:transition-all text-center group cursor-pointer"
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
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-sky-500/30 bg-sky-500/5 hover:bg-sky-500/15 motion-safe:transition-all text-center group cursor-pointer"
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 bg-slate-800/60 hover:bg-slate-700 text-slate-200 text-xs font-semibold motion-safe:transition-all cursor-pointer"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold motion-safe:transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
