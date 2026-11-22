'use client';
import { X, Server, Activity, CheckCircle, AlertTriangle, Cpu, HardDrive, Terminal } from 'lucide-react';
import type { ServiceNode } from './SuperadminSystemHealthOverviewServicesTable';

interface InspectModalProps {
  service: ServiceNode | null;
  onClose: () => void;
  onPing?: (name: string) => void;
  onRestartRequest?: (service: ServiceNode) => void;
}

export default function SuperadminSystemHealthOverviewInspectModal({
  service,
  onClose,
}: InspectModalProps) {
  if (!service) return null;

  const mockLogs = [
    `[INFO] [${service.id}] Health check probe responded HTTP 200 in ${service.latency}.`,
    `[DEBUG] [${service.id}] Active connections: 42 pool leases, 0 queue wait.`,
    `[INFO] [${service.id}] TLS 1.3 handshake completed with cluster peer edge.`,
    `[INFO] [${service.id}] Memory RSS verified nominal (${service.memory}).`,
    `[TRACE] [${service.id}] Worker thread pool: 8 active, 0 idle stalls.`,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-emerald-500/30 bg-[#0c1022] p-6 shadow-2xl text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Server size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">{service.name}</h2>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    service.status === 'Healthy'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {service.status === 'Healthy' ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                  <span>{service.status}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{service.node} • Category: {service.category}</p>
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

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-border/60">
          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">Ping Latency</span>
            <span className="text-lg font-bold font-mono text-emerald-400">{service.latency}</span>
            <span className="text-[10px] text-emerald-500 block mt-0.5">Optimal response</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">CPU Load</span>
            <span className={`text-lg font-bold font-mono ${service.cpu > 80 ? 'text-amber-400' : 'text-slate-100'}`}>
              {service.cpu}%
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">4 vCPU alloc</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">Memory RSS</span>
            <span className="text-xs font-bold font-mono text-slate-200 mt-1 block truncate">{service.memory}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Zero leak detected</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">30D Uptime</span>
            <span className="text-lg font-bold font-mono text-emerald-400">{service.uptime}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Zero unhandled crash</span>
          </div>
        </div>

        {/* Replicas & Node Specs */}
        <div className="py-3.5 space-y-2 border-b border-border/60">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Cluster Replicas & Topology</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Pod 1 (Primary)</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Pod 2 (Replica A)</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                In Sync
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Pod 3 (Replica B)</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                In Sync
              </span>
            </div>
          </div>
        </div>

        {/* Live Service Logs */}
        <div className="mt-3 rounded-xl bg-black/80 border border-slate-800 p-3 font-mono text-[11px] text-slate-300 max-h-36 overflow-y-auto space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 border-b border-slate-800/80 pb-1 mb-1 font-semibold uppercase tracking-wider text-[10px]">
            <Terminal size={12} />
            <span>Streaming Node Audit Log</span>
          </div>
          {mockLogs.map((log, idx) => (
            <div key={idx} className="text-slate-400 hover:text-slate-200">
              {log}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end pt-4 mt-4 border-t border-border/80">
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
