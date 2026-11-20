'use client';
// RESPONSIBILITY: Render single-line horizontal action buttons for each branch row.
import { Eye, Edit2, ShieldAlert, CheckCircle2, XCircle, RotateCcw, UserCheck, Clock, BarChart2 } from 'lucide-react';
import type { SuperadminBranchRecord } from '@/app/frontend_superadmin/superadmin_branches/branches_overview/types/SuperadminBranchesOverviewTypes';

interface SuperadminBranchesOverviewActionButtonsProps {
  branch: SuperadminBranchRecord;
  onView: (b: SuperadminBranchRecord) => void;
  onEdit: (b: SuperadminBranchRecord) => void;
  onActivate: (id: string) => void;
  onSuspend: (b: SuperadminBranchRecord) => void;
  onCloseSafety: (b: SuperadminBranchRecord) => void;
  onRestore: (id: string) => void;
  onTransferManager: (b: SuperadminBranchRecord) => void;
  onViewActivity: (b: SuperadminBranchRecord) => void;
  onViewReports: (b: SuperadminBranchRecord) => void;
}

export default function SuperadminBranchesOverviewActionButtons({
  branch,
  onView,
  onEdit,
  onActivate,
  onSuspend,
  onCloseSafety,
  onRestore,
  onTransferManager,
  onViewActivity,
  onViewReports,
}: SuperadminBranchesOverviewActionButtonsProps) {
  const isClosed = branch.status === 'closed';
  const isActive = branch.status === 'active';

  return (
    <div className="flex items-center gap-1.5 flex-nowrap whitespace-nowrap shrink-0">
      {/* 1. View Full Profile */}
      <button
        type="button"
        onClick={() => onView(branch)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 hover:text-white hover:bg-indigo-600/30 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
        title="View Full Branch Profile"
      >
        <Eye size={14} />
      </button>

      {/* 2. Edit Details */}
      {!isClosed && (
        <button
          type="button"
          onClick={() => onEdit(branch)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:text-white hover:bg-emerald-600/30 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
          title="Edit Branch Address & Details"
        >
          <Edit2 size={14} />
        </button>
      )}

      {/* 3. Lifecycle Status (Activate / Suspend) */}
      {!isClosed && (
        isActive ? (
          <button
            type="button"
            onClick={() => onSuspend(branch)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/15 text-rose-300 hover:text-white hover:bg-rose-600/30 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
            title="Temporarily Suspend Branch (Siblings Unaffected)"
          >
            <ShieldAlert size={14} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onActivate(branch.id)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:text-white hover:bg-emerald-600/30 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
            title="Activate Branch"
          >
            <CheckCircle2 size={14} />
          </button>
        )
      )}

      {/* 4. Safe Close Branch (Pre-flight Outstanding Checks) */}
      {!isClosed && (
        <button
          type="button"
          onClick={() => onCloseSafety(branch)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/15 text-amber-300 hover:text-white hover:bg-amber-600/30 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
          title="Safe Close Branch (Pre-flight checks required)"
        >
          <XCircle size={14} />
        </button>
      )}

      {/* 5. Restore (If closed/archived) */}
      {isClosed && (
        <button
          type="button"
          onClick={() => onRestore(branch.id)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/15 text-cyan-300 hover:text-white hover:bg-cyan-600/30 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
          title="Restore Archived Branch per Policy"
        >
          <RotateCcw size={14} />
        </button>
      )}

      {/* 6. Transfer Manager */}
      {!isClosed && (
        <button
          type="button"
          onClick={() => onTransferManager(branch)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/15 text-sky-300 hover:text-white hover:bg-sky-600/30 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
          title="Transfer Branch Manager (Audit Logged)"
        >
          <UserCheck size={14} />
        </button>
      )}

      {/* 7. View Branch Audit Logs */}
      <button
        type="button"
        onClick={() => onViewActivity(branch)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-500/15 text-purple-300 hover:text-white hover:bg-purple-600/30 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
        title="View Branch Audit Trail & Logs"
      >
        <Clock size={14} />
      </button>

      {/* 8. View Branch Analytics Reports */}
      <button
        type="button"
        onClick={() => onViewReports(branch)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-teal-500/30 bg-teal-500/15 text-teal-300 hover:text-white hover:bg-teal-600/30 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
        title="View Branch-Level Analytics & Financial Reports"
      >
        <BarChart2 size={14} />
      </button>
    </div>
  );
}
