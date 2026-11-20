'use client';
import { useState } from 'react';
import { X, AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import type { ServiceNode } from './SuperadminSystemHealthOverviewServicesTable';

interface RestartModalProps {
  service: ServiceNode | null;
  onClose: () => void;
  onRestartComplete: (serviceId: string) => void;
}

export default function SuperadminSystemHealthOverviewRestartModal({
  service,
  onClose,
  onRestartComplete,
}: RestartModalProps) {
  const [restarting, setRestarting] = useState(false);

  if (!service) return null;

  const handleConfirmRestart = () => {
    setRestarting(true);
    setTimeout(() => {
      setRestarting(false);
      onRestartComplete(service.id);
      toast.success(`Service ${service.name} restarted successfully (zero downtime rolling deploy)`);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-amber-500/40 bg-[#0c1022] p-6 shadow-2xl text-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Restart Microservice</h2>
              <p className="text-xs text-slate-400">Initiate graceful rolling restart</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={restarting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-3 text-xs text-slate-300">
          <p>
            Are you sure you want to gracefully restart <strong className="text-white">{service.name}</strong> on instance <span className="font-mono text-emerald-400">{service.node}</span>?
          </p>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 space-y-1">
            <p className="font-semibold text-amber-300">Rolling Reload Policy:</p>
            <p className="text-[11px]">
              Active requests will drain naturally over 5 seconds while traffic routes to warm peer replicas.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border/80">
          <button
            type="button"
            onClick={onClose}
            disabled={restarting}
            className="px-3.5 py-1.5 rounded-xl border border-border/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmRestart}
            disabled={restarting}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            {restarting && <RefreshCw size={13} className="animate-spin" />}
            <span>{restarting ? 'Restarting Cluster...' : 'Confirm Restart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
