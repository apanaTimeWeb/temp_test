'use client';

import { useEffect } from 'react';
import {
  X,
  Wrench,
  Clock,
  CheckCircle2,
  Calendar,
  Building2,
  IndianRupee,
  AlertTriangle,
  Printer,
  ShieldAlert,
} from 'lucide-react';
import type { MaintenanceLogItem } from './ManagerAssetsMaintenanceTable';

interface ManagerAssetsMaintenanceDetailsModalProps {
  isOpen: boolean;
  logItem: MaintenanceLogItem | null;
  formatCurrency: (val: number) => string;
  onClose: () => void;
  onAdvanceStatus?: (id: number, currentStatus: string) => void;
}

export function ManagerAssetsMaintenanceDetailsModal({
  isOpen,
  logItem,
  formatCurrency,
  onClose,
  onAdvanceStatus,
}: ManagerAssetsMaintenanceDetailsModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !logItem) return null;

  const handlePrint = () => {
    window.print();
  };

  const priorityColor =
    logItem.priority === 'emergency'
      ? { bg: 'bg-rose-500/15', text: 'text-rose-500', border: 'border-rose-500/30' }
      : logItem.priority === 'urgent'
      ? { bg: 'bg-amber-500/15', text: 'text-amber-500', border: 'border-amber-500/30' }
      : { bg: 'bg-emerald-500/15', text: 'text-emerald-500', border: 'border-emerald-500/30' };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ticket-details-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
              <Wrench size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-highlight border border-border text-secondary">
                  TICKET #{logItem.id}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${priorityColor.bg} ${priorityColor.text} ${priorityColor.border} uppercase`}
                >
                  <ShieldAlert size={10} />
                  {logItem.priority || 'routine'}
                </span>
                {logItem.type && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-highlight border border-border text-secondary uppercase font-semibold">
                    {logItem.type}
                  </span>
                )}
              </div>
              <h2 id="ticket-details-title" className="text-base font-bold text-primary mt-1">
                {logItem.assetName}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-secondary hover:text-primary hover:bg-surface-hover transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Status Banner */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-surface-highlight/70 border border-border">
          <span className="text-xs text-secondary font-medium">Work Order Status:</span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              logItem.status === 'completed'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : logItem.status === 'in-progress'
                ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
            }`}
          >
            {logItem.status === 'completed' ? (
              <>
                <CheckCircle2 size={13} /> Completed
              </>
            ) : logItem.status === 'in-progress' ? (
              <>
                <Wrench size={13} /> In Progress
              </>
            ) : (
              <>
                <Clock size={13} /> Pending Service
              </>
            )}
          </span>
        </div>

        {/* Issue Description */}
        <div className="p-3.5 rounded-xl bg-card border border-border space-y-1">
          <label className="text-xs font-semibold text-secondary flex items-center gap-1">
            <AlertTriangle size={13} className="text-warning" /> Reported Issue & Scope
          </label>
          <p className="text-xs text-primary leading-relaxed font-medium mt-1">
            {logItem.issue}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-surface-highlight/40 border border-border/80 space-y-1">
            <span className="text-[11px] text-secondary flex items-center gap-1.5 font-medium">
              <Calendar size={12} className="text-primary" /> Reported Date
            </span>
            <p className="font-semibold text-primary">{logItem.reportedDate}</p>
          </div>

          <div className="p-3 rounded-xl bg-surface-highlight/40 border border-border/80 space-y-1">
            <span className="text-[11px] text-secondary flex items-center gap-1.5 font-medium">
              <Calendar size={12} className="text-primary" /> Scheduled Date
            </span>
            <p className="font-semibold text-primary">{logItem.scheduledDate}</p>
          </div>

          <div className="p-3 rounded-xl bg-surface-highlight/40 border border-border/80 space-y-1">
            <span className="text-[11px] text-secondary flex items-center gap-1.5 font-medium">
              <Building2 size={12} className="text-primary" /> Assigned Vendor / Agency
            </span>
            <p className="font-semibold text-primary">{logItem.vendor || 'Internal Maintenance Staff'}</p>
          </div>

          <div className="p-3 rounded-xl bg-surface-highlight/40 border border-border/80 space-y-1">
            <span className="text-[11px] text-secondary flex items-center gap-1.5 font-medium">
              <IndianRupee size={12} className="text-emerald-500" /> Cost (INR)
            </span>
            <p className="font-semibold text-emerald-400 text-sm">{formatCurrency(logItem.cost)}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-border">
          <button
            type="button"
            onClick={handlePrint}
            className="mgr-btn-ghost flex items-center justify-center gap-1.5 text-xs font-semibold py-2"
          >
            <Printer size={14} /> Print Work Order
          </button>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mgr-btn-ghost text-xs px-3.5 py-2 font-medium"
            >
              Close
            </button>
            {logItem.status !== 'completed' && onAdvanceStatus && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAdvanceStatus(logItem.id, logItem.status);
                }}
                className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs cursor-pointer transition-all ${
                  logItem.status === 'pending'
                    ? 'bg-amber-500 hover:bg-amber-600 !text-black'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {logItem.status === 'pending' ? (
                  <>
                    <Wrench size={14} /> Start Work
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} /> Mark Completed
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
