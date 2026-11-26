'use client';
/** Responsibility: Superadmin Libraries Overview Header; renders the hero banner with the primary Create New Library Account CTA and roster export tools. */
import { Building2, Download, FileSpreadsheet, Printer, ShieldCheck } from 'lucide-react';

interface SuperadminLibrariesOverviewHeaderProps {
  onCreateNew: () => void;
  onExportCsv: () => void;
  onExportExcel: () => void;
  onPrintRoster: () => void;
}

export default function SuperadminLibrariesOverviewHeader({
  onCreateNew,
  onExportCsv,
  onExportExcel,
  onPrintRoster,
}: SuperadminLibrariesOverviewHeaderProps) {
  return (
    <div className="w-full max-w-full min-w-0 rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/80 via-[#1a1f4e] to-indigo-900/60 p-5 sm:p-6 shadow-lg motion-safe:transition-all mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left: Titles & Meta Chips */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
              Live Multi-Tenant Core
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              <ShieldCheck size={11} className="text-indigo-400" />
              SuperAdmin Scope
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <Building2 className="text-indigo-400 shrink-0" size={28} />
              <span>Library Account Management</span>
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Centralized multi-tenant account provisioning. Create isolated tenant workspaces, assign administrative roles, manage multi-branch quotas, and control operational modules without manual deployments.
          </p>
        </div>

        {/* Right: Primary Create Action & Export Tools */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {/* Quick Roster Export Tools */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={onExportCsv}
              className="p-2.5 rounded-xl border border-indigo-500/25 bg-indigo-500/15 text-indigo-300 hover:text-white hover:bg-indigo-600/30 motion-safe:transition-all cursor-pointer"
              title="Export to CSV"
            >
              <Download size={15} />
            </button>
            <button
              type="button"
              onClick={onExportExcel}
              className="p-2.5 rounded-xl border border-indigo-500/25 bg-indigo-500/15 text-indigo-300 hover:text-white hover:bg-indigo-600/30 motion-safe:transition-all cursor-pointer"
              title="Export to Excel (.xls)"
            >
              <FileSpreadsheet size={15} />
            </button>
            <button
              type="button"
              onClick={onPrintRoster}
              className="p-2.5 rounded-xl border border-indigo-500/25 bg-indigo-500/15 text-indigo-300 hover:text-white hover:bg-indigo-600/30 motion-safe:transition-all cursor-pointer"
              title="Print Library Directory Roster"
            >
              <Printer size={15} />
            </button>
          </div>

          {/* Primary CTA: Create New Library Account */}
          <button
            type="button"
            onClick={onCreateNew}
            id="superadmin-create-library-btn"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-emerald-950/60 motion-safe:transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <Building2 size={16} className="text-emerald-200" />
            <span>Create New Library Account</span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white">
              SuperAdmin Only
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
