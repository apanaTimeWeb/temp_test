'use client';

import type { MembersAlumniRow } from '@/app/frontend_manager/manager_members/members_alumni/types/ManagerMembersAlumniComponentTypes';
import { Award, Building2, Clock, Trash2, Users, X } from 'lucide-react';

export function ManagerMembersAlumniKpiGrid({
  totalCount,
  kpis,
}: {
  totalCount: number;
  kpis: { successRate: string; officersPercent: string; avgTenure: string };
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <div className="malm-kpi-indigo group relative overflow-hidden rounded-2xl border p-4 sm:p-5 shadow-lg shadow-indigo-950/40 motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:border-indigo-400/60 hover:shadow-xl flex items-center justify-between">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke="currentColor" className="text-indigo-400" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="space-y-1 relative z-10">
          <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Total Alumni Network</span>
          <p suppressHydrationWarning className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">{totalCount}</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center shrink-0 shadow-xs motion-safe:transition-transform group-hover:scale-110 relative z-10">
          <Users size={20} className="text-indigo-400" />
        </div>
      </div>

      <div className="malm-kpi-emerald group relative overflow-hidden rounded-2xl border p-4 sm:p-5 shadow-lg shadow-emerald-950/40 motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:border-emerald-400/60 hover:shadow-xl flex items-center justify-between">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,34 Q25,18 55,20 T105,8 T150,14" fill="none" stroke="currentColor" className="text-emerald-400" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="space-y-1 relative z-10">
          <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Exam Success Rate</span>
          <p suppressHydrationWarning className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight font-sans">{kpis.successRate}</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-xs motion-safe:transition-transform group-hover:scale-110 relative z-10">
          <Award size={20} className="text-emerald-400" />
        </div>
      </div>

      <div className="malm-kpi-sky group relative overflow-hidden rounded-2xl border p-4 sm:p-5 shadow-lg shadow-sky-950/40 motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:border-sky-400/60 hover:shadow-xl flex items-center justify-between">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,30 Q20,10 45,22 T90,12 T130,18 T150,8" fill="none" stroke="currentColor" className="text-sky-400" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="space-y-1 relative z-10">
          <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Govt / PSU Officers</span>
          <p suppressHydrationWarning className="text-2xl sm:text-3xl font-extrabold text-sky-400 tracking-tight font-sans">{kpis.officersPercent}</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center shrink-0 shadow-xs motion-safe:transition-transform group-hover:scale-110 relative z-10">
          <Building2 size={20} className="text-sky-400" />
        </div>
      </div>

      <div className="malm-kpi-amber group relative overflow-hidden rounded-2xl border p-4 sm:p-5 shadow-lg shadow-amber-950/40 motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:border-amber-400/60 hover:shadow-xl flex items-center justify-between">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke="currentColor" className="text-amber-400" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="space-y-1 relative z-10">
          <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Average Tenure</span>
          <p suppressHydrationWarning className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight font-sans">{kpis.avgTenure}</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-xs motion-safe:transition-transform group-hover:scale-110 relative z-10">
          <Clock size={20} className="text-amber-400" />
        </div>
      </div>
    </div>
  );
}

export function ManagerMembersAlumniDeleteModal({
  deleteTarget,
  onCancel,
  onConfirm,
}: {
  deleteTarget: MembersAlumniRow | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!deleteTarget) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs motion-safe:animate-in fade-in" role="dialog" aria-modal="true" aria-labelledby="delete-alumni-dialog-title">
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-2xl motion-safe:animate-in zoom-in-95 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-danger-bg text-danger border border-border flex items-center justify-center mb-3.5 shrink-0">
          <Trash2 size={22} className="text-danger shrink-0" />
        </div>
        <h3 id="delete-alumni-dialog-title" className="text-base font-bold text-primary">Remove Alumni Member?</h3>
        <p className="text-xs text-secondary mt-1.5 leading-relaxed">
          Are you sure you want to remove <strong className="text-primary font-semibold">{deleteTarget.name}</strong> ({deleteTarget.id}) from the alumni directory? This action cannot be undone.
        </p>
        <div className="grid grid-cols-2 gap-2.5 w-full mt-5">
          <button type="button" onClick={onCancel} className="mgr-btn mgr-btn-secondary text-xs h-9 px-3 rounded-lg font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer">
            <X size={14} className="text-secondary shrink-0" />
            <span>Cancel</span>
          </button>
          <button type="button" onClick={onConfirm} className="inline-flex items-center justify-center gap-1.5 text-xs h-9 px-3 rounded-lg font-semibold bg-danger text-white hover:opacity-90 motion-safe:transition-colors shadow-sm cursor-pointer">
            <Trash2 size={14} className="text-white shrink-0" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
