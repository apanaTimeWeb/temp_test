'use client';
// RESPONSIBILITY: Display branch-level audit logs and history trail.
import { X, Clock, ShieldCheck } from 'lucide-react';
import type { SuperadminBranchRecord, BranchAuditLog } from '@/app/frontend_superadmin/superadmin_branches/branches_overview/types/SuperadminBranchesOverviewTypes';

interface SuperadminBranchesOverviewActivityModalProps {
  branch: SuperadminBranchRecord;
  logs: BranchAuditLog[];
  onClose: () => void;
}

export default function SuperadminBranchesOverviewActivityModal({ branch, logs, onClose }: SuperadminBranchesOverviewActivityModalProps) {
  const branchLogs = logs.filter((l) => l.branchId === branch.id);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-overlay-backdrop backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-border bg-overlay p-6 shadow-dialog text-foreground">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-foreground">
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="p-2.5 rounded-xl bg-purple-bg border border-purple-border text-purple">
            <Clock size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Branch Activity & Audit Trail</h2>
            <p className="text-xs text-secondary">{branch.name} ({branch.code})</p>
          </div>
        </div>

        <div className="my-4 max-h-[60vh] overflow-y-auto space-y-3 pr-1">
          {branchLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted">
              No recent audit records logged for this branch.
            </div>
          ) : (
            branchLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-xl border border-border bg-card space-y-1 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold px-2 py-0.5 rounded bg-purple-bg text-purple border border-purple-border">
                    {log.action}
                  </span>
                  <span className="text-muted">{log.timestamp}</span>
                </div>
                <p className="font-medium text-foreground pt-1">{log.details}</p>
                {log.reason && <p className="text-secondary italic text-[11px]">Reason: {log.reason}</p>}
                <p className="text-[10px] text-muted flex items-center gap-1 pt-1">
                  <ShieldCheck size={11} className="text-success" />
                  <span>Actor: {log.performedBy}</span>
                </p>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-3 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-surface hover:bg-surface-elevated border border-border text-xs font-bold text-foreground transition-colors cursor-pointer"
          >
            Close Audit Logs
          </button>
        </div>
      </div>
    </div>
  );
}
