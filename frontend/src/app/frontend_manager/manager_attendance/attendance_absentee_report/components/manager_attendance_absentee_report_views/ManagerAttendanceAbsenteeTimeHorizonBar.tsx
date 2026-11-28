'use client';

import '@/app/frontend_manager/manager_attendance/attendance_absentee_report/components/manager_attendance_absentee_report_styles/ManagerAttendanceAbsenteeReportManager_absentee_report.css';
import { Calendar,X } from 'lucide-react';

export type ManagerAbsenteeTimeHorizon = 'all' | 'today' | 'this_week' | 'this_month' | 'custom';

export interface ManagerAttendanceAbsenteeTimeHorizonBarProps {
  timeHorizon: ManagerAbsenteeTimeHorizon;
  onChangeTimeHorizon: (horizon: ManagerAbsenteeTimeHorizon) => void;
  customStartDate: string;
  onCustomStartDateChange: (date: string) => void;
  customEndDate: string;
  onCustomEndDateChange: (date: string) => void;
  activeCount: number;
}

const HORIZON_ACTIVE_CLASSES: Record<ManagerAbsenteeTimeHorizon, string> = {
  all: 'mgr-absentee-horizon--indigo',
  today: 'mgr-absentee-horizon--emerald',
  this_week: 'mgr-absentee-horizon--sky',
  this_month: 'mgr-absentee-horizon--amber',
  custom: 'mgr-absentee-horizon--purple',
};

const timeHorizonOptions: Array<{ id: ManagerAbsenteeTimeHorizon; label: string }> = [
  { id: 'all', label: 'All Absentees' },
  { id: 'today', label: 'Today' },
  { id: 'this_week', label: 'This Week' },
  { id: 'this_month', label: 'This Month' },
  { id: 'custom', label: 'Custom Range' },
];

export function ManagerAttendanceAbsenteeTimeHorizonBar({
  timeHorizon,
  onChangeTimeHorizon,
  customStartDate,
  onCustomStartDateChange,
  customEndDate,
  onCustomEndDateChange,
  activeCount,
}: ManagerAttendanceAbsenteeTimeHorizonBarProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3.5 sm:p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
          <Calendar size={16} />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-secondary block">
            Absentee Time Horizon
          </span>
          <span className="text-[11px] font-semibold text-primary">
            Filter records by student attendance timeline
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Segmented Time Horizon Pills with Glowing Color Halos */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-highlight/70 border border-border/80 overflow-x-auto scrollbar-none w-full sm:w-auto">
          {timeHorizonOptions.map((opt) => {
            const isActive = timeHorizon === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChangeTimeHorizon(opt.id)}
                className={`min-h-8 px-3 py-1 text-xs rounded-lg font-semibold whitespace-nowrap motion-safe:transition-all cursor-pointer ${
                  isActive
                    ? `${HORIZON_ACTIVE_CLASSES[opt.id]} border shadow-sm font-bold`
                    : 'text-secondary hover:text-primary hover:bg-surface-hover'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Custom Range Picker */}
        {timeHorizon === 'custom' && (
          <div className="flex items-center gap-2 flex-wrap text-xs bg-surface-highlight/80 p-1.5 rounded-xl border border-border/80 w-full sm:w-auto">
            <label className="flex items-center gap-1.5 text-secondary">
              <span className="text-[11px] font-medium">From:</span>
              <input maxLength={100}
                type="date"
                value={customStartDate}
                onChange={(e) => onCustomStartDateChange(e.target.value)}
                className="px-2 py-1 bg-card border border-border rounded-lg text-xs text-primary outline-none focus:border-primary cursor-pointer"
              />
            </label>
            <label className="flex items-center gap-1.5 text-secondary">
              <span className="text-[11px] font-medium">To:</span>
              <input maxLength={100}
                type="date"
                value={customEndDate}
                onChange={(e) => onCustomEndDateChange(e.target.value)}
                className="px-2 py-1 bg-card border border-border rounded-lg text-xs text-primary outline-none focus:border-primary cursor-pointer"
              />
            </label>
            {(customStartDate || customEndDate) && (
              <button
                type="button"
                onClick={() => {
                  onCustomStartDateChange('');
                  onCustomEndDateChange('');
                }}
                className="p-1 rounded text-secondary hover:text-danger hover:bg-danger-bg motion-safe:transition-colors cursor-pointer"
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

export default ManagerAttendanceAbsenteeTimeHorizonBar;
