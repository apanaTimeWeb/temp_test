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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-purple-500/40 bg-[#0d102b] p-6 shadow-2xl text-white">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-purple-500/20">
          <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
            <Clock size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Branch Activity & Audit Trail</h2>
            <p className="text-xs text-slate-400">{branch.name} ({branch.code})</p>
          </div>
        </div>

        <div className="my-4 max-h-[60vh] overflow-y-auto space-y-3 pr-1">
          {branchLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No recent audit records logged for this branch.
            </div>
          ) : (
            branchLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-xl border border-purple-500/20 bg-card/40 space-y-1 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {log.action}
                  </span>
                  <span className="text-slate-400">{log.timestamp}</span>
                </div>
                <p className="font-medium text-white pt-1">{log.details}</p>
                {log.reason && <p className="text-slate-300 italic text-[11px]">Reason: {log.reason}</p>}
                <p className="text-[10px] text-slate-400 flex items-center gap-1 pt-1">
                  <ShieldCheck size={11} className="text-emerald-400" />
                  <span>Actor: {log.performedBy}</span>
                </p>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-3 border-t border-border">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white">
            Close Audit Logs
          </button>
        </div>
      </div>
    </div>
  );
}
