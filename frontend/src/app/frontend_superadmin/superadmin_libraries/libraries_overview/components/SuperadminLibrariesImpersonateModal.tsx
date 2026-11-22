'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { UserCheck, X, ShieldAlert, ExternalLink, Lock, AlertTriangle } from 'lucide-react';
import { useModalScrollLock } from '@/lib/useModalScrollLock';
import { toast } from 'sonner';
import type { SuperadminLibrariesLibrary } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/types/SuperadminLibrariesOverviewTypes';

interface SuperadminLibrariesImpersonateModalProps {
  library: SuperadminLibrariesLibrary;
  onClose: () => void;
}

export default function SuperadminLibrariesImpersonateModal({
  library,
  onClose,
}: SuperadminLibrariesImpersonateModalProps) {
  useModalScrollLock(true);
  const [reason, setReason] = useState('Customer Support: Diagnostics & Configuration Assistance');
  const [ticketRef, setTicketRef] = useState('SUP-8821');

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('superadmin_impersonating_tenant', library.id);
        sessionStorage.setItem('superadmin_impersonating_name', library.name);
        window.open('/admin/admin_dashboard/dashboard_overview', '_blank', 'noopener,noreferrer');
      }
      toast.success(`Authorized Impersonation: Launched Admin session for "${library.name}" (Audit Logged).`);
      onClose();
    } catch {
      toast.error('Unable to launch impersonated admin session.');
    }
  };

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="impersonate-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-[#0c0f2f] to-[#07091c] p-6 shadow-2xl text-slate-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4 border-b border-indigo-500/20 pb-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <UserCheck size={20} />
          </div>
          <div>
            <h3 id="impersonate-modal-title" className="text-base font-bold text-white">
              Login as Library Admin (Impersonation Mode)
            </h3>
            <p className="text-xs text-slate-400">Secure Read/Write Administrative Delegation Session</p>
          </div>
        </div>

        <form onSubmit={handleLaunch} className="space-y-4 text-xs">
          {/* Target Facility Overview */}
          <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 space-y-2 text-slate-300">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Target Facility:</span>
              <span className="font-bold text-white">{library.name} ({library.id})</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Primary Administrator:</span>
              <span className="font-semibold text-indigo-300">{library.owner}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Admin Email:</span>
              <span className="font-mono text-slate-200">{library.email || 'admin@library.org'}</span>
            </div>
          </div>

          {/* Security & Compliance Notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Audit Policy:</strong> Impersonation sessions are cryptographically signed. All modifications will be attributed to your SuperAdmin credential in the immutable audit trail.
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Support Reason (Mandatory for SOC-2 Compliance)</label>
            <input maxLength={250}
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-indigo-500/25 bg-[#060818] text-slate-100 focus:outline-none focus:border-indigo-400"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Linked Support Ticket Reference</label>
            <input maxLength={100}
              type="text"
              value={ticketRef}
              onChange={(e) => setTicketRef(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-indigo-500/25 bg-[#060818] text-slate-100 font-mono focus:outline-none focus:border-indigo-400"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-indigo-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-950/60 cursor-pointer"
            >
              <ExternalLink size={14} />
              <span>Launch Impersonated Admin Session</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
