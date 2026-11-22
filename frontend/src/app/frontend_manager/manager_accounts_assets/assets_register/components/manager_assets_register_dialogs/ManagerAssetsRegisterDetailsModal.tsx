'use client';

import type { ManagerAssetsRegisterAsset } from '@/app/frontend_manager/manager_accounts_assets/assets_register/hooks/ManagerAssetsRegisterDemoRepository';
import {
Archive,
Calendar,
CheckCircle2,
IndianRupee,
MapPin,
Package,
Printer,
QrCode,
Tag,
Wrench,
X
} from 'lucide-react';
import { useEffect } from 'react';

interface ManagerAssetsRegisterDetailsModalProps {
  isOpen: boolean;
  asset: ManagerAssetsRegisterAsset | null;
  formatCurrency: (val: number) => string;
  categoryLabel: (category: string) => string;
  statusLabel: (status: ManagerAssetsRegisterAsset['status']) => string;
  onClose: () => void;
  onScheduleMaintenance?: (asset: ManagerAssetsRegisterAsset) => void;
}

export function ManagerAssetsRegisterDetailsModal({
  isOpen,
  asset,
  formatCurrency,
  categoryLabel,
  statusLabel,
  onClose,
  onScheduleMaintenance,
}: ManagerAssetsRegisterDetailsModalProps) {
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

  if (!isOpen || !asset) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="asset-details-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Package size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-highlight border border-border text-secondary">
                  ASSET #{asset.id}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-highlight border border-border text-secondary uppercase font-semibold">
                  {categoryLabel(asset.category)}
                </span>
              </div>
              <h2 id="asset-details-title" className="text-base font-bold text-primary mt-1">
                {asset.name}
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

        {/* Operational Status Banner */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-surface-highlight/70 border border-border">
          <span className="text-xs text-secondary font-medium">Operational Status:</span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              asset.status === 'active'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : asset.status === 'maintenance'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'bg-slate-500/15 text-slate-400 border border-slate-500/30'
            }`}
          >
            {asset.status === 'active' ? (
              <>
                <CheckCircle2 size={13} /> {statusLabel(asset.status)}
              </>
            ) : asset.status === 'maintenance' ? (
              <>
                <Wrench size={13} /> {statusLabel(asset.status)}
              </>
            ) : (
              <>
                <Archive size={13} /> {statusLabel(asset.status)}
              </>
            )}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-surface-highlight/40 border border-border/80 space-y-1">
            <span className="text-[11px] text-secondary flex items-center gap-1.5 font-medium">
              <MapPin size={12} className="text-primary" /> Location
            </span>
            <p className="font-semibold text-primary">{asset.location}</p>
          </div>

          <div className="p-3 rounded-xl bg-surface-highlight/40 border border-border/80 space-y-1">
            <span className="text-[11px] text-secondary flex items-center gap-1.5 font-medium">
              <Calendar size={12} className="text-primary" /> Purchase Date
            </span>
            <p className="font-semibold text-primary">{asset.purchaseDate}</p>
          </div>

          <div className="p-3 rounded-xl bg-surface-highlight/40 border border-border/80 space-y-1">
            <span className="text-[11px] text-secondary flex items-center gap-1.5 font-medium">
              <IndianRupee size={12} className="text-emerald-500" /> Purchase Value
            </span>
            <p className="font-semibold text-emerald-400 font-mono text-sm">
              {formatCurrency(asset.purchaseValue)}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface-highlight/40 border border-border/80 space-y-1">
            <span className="text-[11px] text-secondary flex items-center gap-1.5 font-medium">
              <Tag size={12} className="text-primary" /> Current Book Value
            </span>
            <p className="font-semibold text-primary font-mono text-sm">
              {formatCurrency(asset.currentValue)}
            </p>
          </div>
        </div>

        {/* Asset Tag Simulation */}
        <div className="p-3.5 rounded-xl bg-surface-highlight/30 border border-dashed border-border flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-secondary flex items-center gap-1.5">
              <QrCode size={13} className="text-primary" /> Library Asset Barcode Tag
            </span>
            <p className="text-xs font-mono text-primary font-bold">
              LIB-AST-{String(asset.id).padStart(6, '0')}
            </p>
            <p className="text-[10px] text-secondary">
              Scan tag with branch reader to view service history
            </p>
          </div>
          <div className="w-14 h-14 bg-white rounded-lg p-1.5 flex items-center justify-center shrink-0 shadow-xs">
            <QrCode size={46} className="text-black" />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-border">
          <button
            type="button"
            onClick={() => window.print()}
            className="mgr-btn-ghost flex items-center justify-center gap-1.5 text-xs font-semibold py-2"
          >
            <Printer size={14} /> Print Asset Tag
          </button>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mgr-btn-ghost text-xs px-3.5 py-2 font-medium"
            >
              Close
            </button>
            {asset.status === 'active' && onScheduleMaintenance && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onScheduleMaintenance(asset);
                }}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-amber-500/40 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 shadow-xs cursor-pointer transition-all"
              >
                <Wrench size={14} /> Send to Maintenance
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerAssetsRegisterDetailsModal;
