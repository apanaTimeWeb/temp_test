'use client';
// RESPONSIBILITY: Render hero header with primary Create Branch CTA and export actions.
import { GitBranch, Plus, ShieldCheck, Download, FileSpreadsheet, Printer, BookOpen } from 'lucide-react';

interface SuperadminBranchesOverviewHeaderProps {
  onCreateBranch: () => void;
  onExportCsv: () => void;
  onExportExcel: () => void;
  onPrint: () => void;
}

export default function SuperadminBranchesOverviewHeader({
  onCreateBranch,
  onExportCsv,
  onExportExcel,
  onPrint,
}: SuperadminBranchesOverviewHeaderProps) {
  return (
    <div className="w-full max-w-full min-w-0 rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/80 via-[#0f2d22] to-emerald-900/60 p-5 sm:p-6 shadow-lg mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Multi-Branch Architecture
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              <BookOpen size={11} className="text-indigo-400" />
              Shared Catalog • Branch Physical Assets
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              <ShieldCheck size={11} /> SuperAdmin Control
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <GitBranch className="text-emerald-400 shrink-0" size={28} />
              <span>Branch Management — Complete Control</span>
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Centralized branch lifecycle across all Library Accounts. Create branches, update entitlements, transfer managers, execute safe closures with pre-flight checks, and monitor branch-level audit logs.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={onExportCsv}
              className="p-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/15 text-emerald-300 hover:text-white hover:bg-emerald-600/30 transition-all cursor-pointer"
              title="Export to CSV"
            >
              <Download size={15} />
            </button>
            <button
              type="button"
              onClick={onExportExcel}
              className="p-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/15 text-emerald-300 hover:text-white hover:bg-emerald-600/30 transition-all cursor-pointer"
              title="Export to Excel (.xls)"
            >
              <FileSpreadsheet size={15} />
            </button>
            <button
              type="button"
              onClick={onPrint}
              className="p-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/15 text-emerald-300 hover:text-white hover:bg-emerald-600/30 transition-all cursor-pointer"
              title="Print Branch Directory"
            >
              <Printer size={15} />
            </button>
          </div>

          <button
            type="button"
            onClick={onCreateBranch}
            id="superadmin-create-branch-btn"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-emerald-950/60 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <Plus size={16} className="text-white" />
            <span>Create New Branch</span>
          </button>
        </div>
      </div>
    </div>
  );
}
