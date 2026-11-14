'use client';
import { Calendar, X } from 'lucide-react';
import type { ManagerCrmTimeHorizon } from '@/app/frontend_manager/manager_members/members_enquiries/hooks/useManagerMembersEnquiriesEnquiries';

interface ManagerMembersEnquiriesTimeHorizonBarProps {
  timeHorizon: ManagerCrmTimeHorizon;
  setTimeHorizon: (val: ManagerCrmTimeHorizon) => void;
  timeHorizonOptions: Array<{ id: ManagerCrmTimeHorizon; label: string }>;
  customStartDate: string;
  setCustomStartDate: (val: string) => void;
  customEndDate: string;
  setCustomEndDate: (val: string) => void;
}

export function ManagerMembersEnquiriesTimeHorizonBar({
  timeHorizon,
  setTimeHorizon,
  timeHorizonOptions,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
}: ManagerMembersEnquiriesTimeHorizonBarProps) {
  return (
    <div className="w-full max-w-full min-w-0 rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 p-3.5 sm:p-4 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Calendar size={16} className="text-indigo-400 shrink-0" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Pipeline Time Horizon:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
        {/* Segmented Time Horizon Pills */}
        <div className="inline-flex flex-wrap bg-[#060818] p-1 rounded-xl border border-indigo-500/25 gap-1 w-full sm:w-auto">
          {timeHorizonOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTimeHorizon(opt.id)}
              className={`min-h-8 flex-1 sm:flex-initial text-center px-2.5 sm:px-3 py-1 text-xs font-semibold rounded-lg motion-safe:transition-all cursor-pointer whitespace-nowrap ${
                timeHorizon === opt.id
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm shadow-indigo-950/50'
                  : 'text-slate-300 hover:text-white hover:bg-indigo-500/15'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Inline Custom Date Inputs if Custom Range is active */}
        {timeHorizon === 'custom' && (
          <div className="flex items-center gap-2 flex-wrap text-xs bg-[#060818] p-1.5 rounded-xl border border-indigo-500/25">
            <label className="flex items-center gap-1.5 text-slate-300">
              <span className="text-[11px] font-medium text-slate-400">From:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-2 py-1 bg-[#0c0f28] border border-indigo-500/30 rounded-lg text-xs text-slate-100 outline-none focus:border-indigo-400"
              />
            </label>
            <label className="flex items-center gap-1.5 text-slate-300">
              <span className="text-[11px] font-medium text-slate-400">To:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-2 py-1 bg-[#0c0f28] border border-indigo-500/30 rounded-lg text-xs text-slate-100 outline-none focus:border-indigo-400"
              />
            </label>
            {(customStartDate || customEndDate) && (
              <button
                type="button"
                onClick={() => {
                  setCustomStartDate('');
                  setCustomEndDate('');
                }}
                className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                title="Clear custom dates"
              >
                <X size={13} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
