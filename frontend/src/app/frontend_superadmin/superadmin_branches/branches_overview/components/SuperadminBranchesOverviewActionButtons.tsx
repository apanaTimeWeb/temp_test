'use client';
// RESPONSIBILITY: Render single-line horizontal action buttons for each branch row.
import { Eye, Edit2, ShieldAlert, CheckCircle2, XCircle, RotateCcw, UserCheck, Clock, BarChart2, Copy } from 'lucide-react';
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
  onDuplicate?: (b: SuperadminBranchRecord) => void;
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
  onDuplicate,
}: SuperadminBranchesOverviewActionButtonsProps) {
  const isClosed = branch.status === 'closed';
  const isActive = branch.status === 'active';

  return (
    <div className="flex items-center gap-1.5 flex-nowrap whitespace-nowrap shrink-0">
      {/* 1. View Full Profile */}
      <button
        type="button"
        onClick={() => onView(branch)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-primary-subtle text-primary hover:text-foreground hover:bg-primary-subtle transition-colors shadow-xs motion-safe:active:scale-95 cursor-pointer shrink-0"
        title="View Full Branch Profile"
      >
        <Eye size={14} />
      </button>

      {/* 2. Edit Details */}
      {!isClosed && (
        <button
          type="button"
          onClick={() => onEdit(branch)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-success-border bg-success-bg text-success hover:bg-success-bg transition-colors shadow-xs motion-safe:active:scale-95 cursor-pointer shrink-0"
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
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-danger-border bg-danger-bg text-danger hover:bg-danger-bg transition-colors shadow-xs motion-safe:active:scale-95 cursor-pointer shrink-0"
            title="Temporarily Suspend Branch (Siblings Unaffected)"
          >
            <ShieldAlert size={14} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onActivate(branch.id)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-success-border bg-success-bg text-success hover:bg-success-bg transition-colors shadow-xs motion-safe:active:scale-95 cursor-pointer shrink-0"
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
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-warning-border bg-warning-bg text-warning hover:bg-warning-bg transition-colors shadow-xs motion-safe:active:scale-95 cursor-pointer shrink-0"
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
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-info-border bg-info-bg text-info hover:bg-info-bg transition-colors shadow-xs motion-safe:active:scale-95 cursor-pointer shrink-0"
          title="Restore Closed Branch"
        >
          <RotateCcw size={14} />
        </button>
      )}

      {/* 6. Reassign Branch Manager */}
      {!isClosed && (
        <button
          type="button"
          onClick={() => onTransferManager(branch)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-info-border bg-info-bg text-info hover:bg-info-bg transition-colors shadow-xs motion-safe:active:scale-95 cursor-pointer shrink-0"
          title="Transfer Manager Assignment"
        >
          <UserCheck size={14} />
        </button>
      )}

      {/* 7. Branch Activity Logs */}
      <button
        type="button"
        onClick={() => onViewActivity(branch)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-purple-border bg-purple-bg text-purple hover:bg-purple-bg transition-colors shadow-xs motion-safe:active:scale-95 cursor-pointer shrink-0"
        title="View Branch Audit Trail"
      >
        <Clock size={14} />
      </button>

      {/* 8. Analytics & Occupancy */}
      <button
        type="button"
        onClick={() => onViewReports(branch)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-info-border bg-info-bg text-info hover:bg-info-bg transition-colors shadow-xs motion-safe:active:scale-95 cursor-pointer shrink-0"
        title="Branch Performance Reports"
      >
        <BarChart2 size={14} />
      </button>

      {/* 9. Duplicate Branch Template */}
      {onDuplicate && (
        <button
          type="button"
          onClick={() => onDuplicate(branch)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-secondary hover:text-foreground hover:bg-surface-elevated transition-colors shadow-xs motion-safe:active:scale-95 cursor-pointer shrink-0"
          title="Clone Branch Configuration"
        >
          <Copy size={14} />
        </button>
      )}
    </div>
  );
}
