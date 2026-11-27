'use client';

import { AlertTriangle, Send } from 'lucide-react';

interface AdminCommunicationNoticesEmergencyBannerProps {
  title: string;
  message: string;
  targetBranch?: string;
  onRebroadcast: () => void;
}

export function AdminCommunicationNoticesEmergencyBanner({
  title,
  message,
  targetBranch,
  onRebroadcast,
}: AdminCommunicationNoticesEmergencyBannerProps) {
  return (
    <div className="mb-6 rounded-2xl border border-danger bg-danger-bg p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-card text-danger-text border border-danger shrink-0 mt-0.5 motion-safe:animate-pulse">
          <AlertTriangle size={20} />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="rounded-full bg-danger text-on-primary px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
              Network-Wide Emergency Alert Active
            </span>
            <span className="text-xs text-text-secondary font-mono">Scope: {targetBranch || 'All Branches'}</span>
          </div>
          <h3 className="text-base font-bold text-text-primary mt-1">{title}</h3>
          <p className="text-xs text-text-secondary line-clamp-2 mt-0.5">{message}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onRebroadcast}
        className="inline-flex items-center gap-1.5 rounded-xl border border-danger bg-card px-3.5 py-2 text-xs font-semibold text-danger-text hover:bg-card-hover motion-safe:transition-all shadow-sm shrink-0 self-end sm:self-center"
      >
        <Send size={14} className="text-danger-text" />
        <span>Re-Broadcast Blast</span>
      </button>
    </div>
  );
}
export default AdminCommunicationNoticesEmergencyBanner;
