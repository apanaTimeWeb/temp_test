'use client';
// RESPONSIBILITY: Render complete branch profile and operational details.
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Building2, MapPin, Phone, Mail, Clock, Armchair, Wallet } from 'lucide-react';
import type { SuperadminBranchRecord } from '@/app/frontend_superadmin/superadmin_branches/branches_overview/types/SuperadminBranchesOverviewTypes';
import { useModalScrollLock } from '@/lib/useModalScrollLock';

interface SuperadminBranchesOverviewDetailsModalProps {
  branch: SuperadminBranchRecord;
  onClose: () => void;
}

export default function SuperadminBranchesOverviewDetailsModal({ branch, onClose }: SuperadminBranchesOverviewDetailsModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useModalScrollLock(Boolean(mounted));

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-overlay-backdrop backdrop-blur-sm p-3 sm:p-4 md:p-6 overflow-hidden animate-in fade-in motion-safe:duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl rounded-2xl border border-border bg-overlay p-6 shadow-dialog text-foreground max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 motion-safe:duration-200 ease-out">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-foreground">
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="p-2.5 rounded-xl bg-primary-subtle border border-border text-primary">
            <Building2 size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">{branch.name}</h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary-subtle text-primary border border-border">{branch.code}</span>
            </div>
            <p className="text-xs text-secondary">Parent Organization: {branch.libraryName} ({branch.libraryId})</p>
          </div>
        </div>

        <div className="my-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Status and Physical Asset Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl border border-border bg-card">
              <p className="text-[11px] text-muted uppercase font-semibold">Status</p>
              <p className="text-sm font-bold capitalize mt-1 text-success">{branch.status}</p>
            </div>
            <div className="p-3 rounded-xl border border-border bg-card">
              <p className="text-[11px] text-muted uppercase font-semibold">Seat Capacity</p>
              <p className="text-sm font-bold text-warning mt-1 flex items-center gap-1"><Armchair size={14} />{branch.capacity} seats</p>
            </div>
            <div className="p-3 rounded-xl border border-border bg-card">
              <p className="text-[11px] text-muted uppercase font-semibold">Operating Shifts</p>
              <p className="text-sm font-bold text-info mt-1 flex items-center gap-1"><Clock size={14} />{branch.workingHours ? 'Configured' : 'Full Day'}</p>
            </div>
            <div className="p-3 rounded-xl border border-border bg-card">
              <p className="text-[11px] text-muted uppercase font-semibold">Petty Cash</p>
              <p className="text-sm font-bold text-success mt-1 flex items-center gap-1"><Wallet size={14} />₹{branch.cashBalance.toLocaleString()}</p>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="p-4 rounded-xl border border-border bg-card space-y-2 text-xs">
            <p className="text-xs font-bold text-primary flex items-center gap-1.5"><MapPin size={13} /> Location & Address</p>
            <p className="text-foreground">{branch.address}, {branch.city}, {branch.state} - {branch.pinCode}</p>
            <div className="flex items-center gap-4 text-secondary pt-1">
              <span className="flex items-center gap-1"><Phone size={12} />{branch.phone}</span>
              <span className="flex items-center gap-1"><Mail size={12} />{branch.email}</span>
            </div>
          </div>

          {/* Manager & Admin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-border bg-card">
              <p className="font-bold text-info mb-1">Branch Manager</p>
              <p className="font-semibold text-foreground">{branch.managerName}</p>
              <p className="text-secondary mt-0.5">{branch.managerEmail} • {branch.managerPhone}</p>
              <p className="text-[10px] text-muted mt-1">Has operational desk access strictly to this branch.</p>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-card">
              <p className="font-bold text-primary mb-1">Authorized Library Admin</p>
              <p className="font-semibold text-foreground">{branch.adminName}</p>
              <p className="text-secondary mt-0.5">{branch.adminEmail}</p>
              <p className="text-[10px] text-muted mt-1">Supervises all branches under {branch.libraryName}.</p>
            </div>
          </div>

          {/* Operational Hours */}
          <div className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-secondary">
              <Clock size={14} className="text-primary" />
              <span>Working Hours: <strong className="text-foreground">{branch.workingHours || '08:00 AM - 10:00 PM'}</strong></span>
            </div>
            <span className="text-muted">Holidays: {branch.weeklyHolidays || 'Sunday'}</span>
          </div>

          {/* Module Entitlements */}
          <div className="p-3.5 rounded-xl border border-border bg-card text-xs space-y-2">
            <p className="font-bold text-foreground">Allowed Branch Operational Modules</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(branch.allowedModules || {}).map(([key, enabled]) => (
                <span
                  key={key}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-medium capitalize ${
                    enabled ? 'bg-success-bg text-success border-success-border' : 'bg-surface text-muted border-border'
                  }`}
                >
                  {key.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-surface hover:bg-surface-elevated text-xs font-semibold text-secondary hover:text-foreground transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
