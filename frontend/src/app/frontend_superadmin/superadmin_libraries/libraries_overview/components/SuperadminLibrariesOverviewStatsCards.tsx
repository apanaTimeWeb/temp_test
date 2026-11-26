'use client';
/** Responsibility: Superadmin Libraries Overview Stats Cards; displays top-level multi-tenant facility counters with goal progress and trends. */
import { Building2, Store, Users, IndianRupee, TrendingUp, CheckCircle } from 'lucide-react';
import { SuperadminLibrariesFormatMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/utils/SuperadminLibrariesOverviewFormattingUtilities';

interface SuperadminLibrariesOverviewStatsCardsProps {
  totalCount: number;
  activeCount: number;
  totalStudents: number;
  totalRevenue: number;
  locale: string;
}

export default function SuperadminLibrariesOverviewStatsCards({
  totalCount,
  activeCount,
  totalStudents,
  totalRevenue,
  locale,
}: SuperadminLibrariesOverviewStatsCardsProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-6" aria-label="Libraries Statistics">
      {/* Card 1: Total Registered Libraries */}
      <div className="sa-kpi-card group relative overflow-hidden rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/80 via-[#1a1f4e] to-indigo-900/60 p-5 sm:p-6 shadow-lg shadow-indigo-950/50 motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:border-indigo-400/60">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 transition-opacity motion-safe:duration-500 pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,32 Q15,22 35,18 T75,14 T115,8 T150,4" fill="none" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <div className="flex items-start justify-between relative z-10 gap-3">
          <p className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider">Total Libraries</p>
          <div className="p-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/15 shrink-0 transition-transform group-hover:scale-110">
            <Building2 size={20} className="text-indigo-400" aria-hidden="true" />
          </div>
        </div>
        <div className="relative z-10 mt-3 sm:mt-4">
          <p className="sa-kpi-value text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">{totalCount.toLocaleString()}</p>
          <div className="mt-3.5 flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs">
              <TrendingUp size={12} className="text-emerald-400" />
              <span>+12 this month</span>
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1"><span>Target Progress</span><span>86%</span></div>
            <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 w-[86%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Active Tenants */}
      <div className="sa-kpi-card group relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/80 via-[#0f2d22] to-emerald-900/60 p-5 sm:p-6 shadow-lg shadow-emerald-950/50 motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:border-emerald-400/60">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 transition-opacity motion-safe:duration-500 pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,30 Q20,20 40,24 T80,16 T120,10 T150,6" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <div className="flex items-start justify-between relative z-10 gap-3">
          <p className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider">Active Tenants</p>
          <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 shrink-0 transition-transform group-hover:scale-110">
            <Store size={20} className="text-emerald-400" aria-hidden="true" />
          </div>
        </div>
        <div className="relative z-10 mt-3 sm:mt-4">
          <p className="sa-kpi-value text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">{activeCount.toLocaleString()}</p>
          <div className="mt-3.5 flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs">
              <CheckCircle size={12} className="text-emerald-400" />
              <span>{Math.round((activeCount / Math.max(1, totalCount)) * 100)}% Operational</span>
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1"><span>System SLA</span><span>99.8%</span></div>
            <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 w-[99%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Enrolled Students */}
      <div className="sa-kpi-card group relative overflow-hidden rounded-2xl border border-sky-500/40 bg-gradient-to-br from-sky-950/80 via-[#0f2540] to-sky-900/60 p-5 sm:p-6 shadow-lg shadow-sky-950/50 motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:border-sky-400/60">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 transition-opacity motion-safe:duration-500 pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,34 Q18,24 38,20 T78,12 T118,8 T150,4" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <div className="flex items-start justify-between relative z-10 gap-3">
          <p className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider">Enrolled Students</p>
          <div className="p-2.5 rounded-xl border border-sky-500/30 bg-sky-500/15 shrink-0 transition-transform group-hover:scale-110">
            <Users size={20} className="text-sky-400" aria-hidden="true" />
          </div>
        </div>
        <div className="relative z-10 mt-3 sm:mt-4">
          <p className="sa-kpi-value text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">{totalStudents.toLocaleString()}</p>
          <div className="mt-3.5 flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs">
              <TrendingUp size={12} className="text-emerald-400" />
              <span>+1,420 this week</span>
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1"><span>Seat Utilization</span><span>82%</span></div>
            <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-400 w-[82%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Card 4: LTV Revenue */}
      <div className="sa-kpi-card group relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-950/80 via-[#2d1f08] to-amber-900/60 p-5 sm:p-6 shadow-lg shadow-amber-950/50 motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:border-amber-400/60">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 transition-opacity motion-safe:duration-500 pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,36 Q16,26 36,22 T76,14 T116,8 T150,4" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <div className="flex items-start justify-between relative z-10 gap-3">
          <p className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider">LTV Revenue</p>
          <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/15 shrink-0 transition-transform group-hover:scale-110">
            <IndianRupee size={20} className="text-amber-400" aria-hidden="true" />
          </div>
        </div>
        <div className="relative z-10 mt-3 sm:mt-4">
          <p className="sa-kpi-value text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white truncate">
            {SuperadminLibrariesFormatMajorPreviewCurrency(totalRevenue, 'INR', locale)}
          </p>
          <div className="mt-3.5 flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs">
              <TrendingUp size={12} className="text-emerald-400" />
              <span>+18.4% MoM</span>
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1"><span>Target</span><span>92%</span></div>
            <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 w-[92%]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
