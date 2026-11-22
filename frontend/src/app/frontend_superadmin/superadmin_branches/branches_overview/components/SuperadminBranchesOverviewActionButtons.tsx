'use client';
// RESPONSIBILITY: Render single-line horizontal action buttons for each branch row.
import { Eye, Edit2, ShieldAlert, CheckCircle2, XCircle, RotateCcw, UserCheck, Clock, BarChart2, MessageSquare, Mail, PhoneCall, Copy } from 'lucide-react';
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

      {/* 9. WhatsApp Branch Manager */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          const raw = branch.managerPhone || branch.phone || '9876543210';
          let digits = raw.replace(/\D/g, '');
          if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
          const phone = digits.length === 10 ? `91${digits}` : digits;
          const msg = `Hello ${branch.managerName || 'Branch Manager'}, greetings from SuperAdmin regarding branch ${branch.name} (${branch.code}).`;
          const popup = window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
          if (popup) popup.opener = null;
        }}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:text-white hover:bg-emerald-600/30 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
        title={`Chat on WhatsApp with ${branch.managerName || 'Manager'}`}
      >
        <MessageSquare size={14} />
      </button>

      {/* 10. Email Branch Manager */}
      <a
        href={`mailto:${branch.managerEmail || branch.email}?subject=${encodeURIComponent(`Notice for Branch: ${branch.name} (${branch.code})`)}`}
        onClick={(e) => e.stopPropagation()}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/15 text-blue-300 hover:text-white hover:bg-blue-600/30 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
        title={`Email ${branch.managerEmail || branch.email}`}
      >
        <Mail size={14} />
      </a>

      {/* 11. Phone Call */}
      <a
        href={`tel:${(branch.managerPhone || branch.phone).replace(/\s+/g, '')}`}
        onClick={(e) => e.stopPropagation()}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/15 text-amber-300 hover:text-white hover:bg-amber-600/30 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
        title={`Call ${branch.managerPhone || branch.phone}`}
      >
        <PhoneCall size={14} />
      </a>

      {/* 12. Duplicate Branch Configuration */}
      {onDuplicate && (
        <button
          type="button"
          onClick={() => onDuplicate(branch)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 hover:text-white hover:bg-indigo-600/30 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
          title="Duplicate / Clone Branch Configuration"
        >
          <Copy size={14} />
        </button>
      )}
    </div>
  );
}
