'use client';

import '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_styles/ManagerMembersDirectoryStyles.css';
import { Calendar, X } from 'lucide-react';

export type ManagerMembersTimeHorizon = 'all' | 'today' | 'this_week' | 'this_month' | 'custom';

export interface ManagerMembersDirectoryTimeHorizonBarProps {
  timeHorizon: ManagerMembersTimeHorizon;
  onChangeTimeHorizon: (horizon: ManagerMembersTimeHorizon) => void;
  customStartDate: string;
  onCustomStartDateChange: (date: string) => void;
  customEndDate: string;
  onCustomEndDateChange: (date: string) => void;
  activeCount: number;
}

const timeHorizonOptions: Array<{ id: ManagerMembersTimeHorizon; label: string }> = [
  { id: 'all', label: 'All Time' },
  { id: 'today', label: 'Today' },
  { id: 'this_week', label: 'This Week' },
  { id: 'this_month', label: 'This Month' },
  { id: 'custom', label: 'Custom Range' },
];

export function ManagerMembersDirectoryTimeHorizonBar({
  timeHorizon,
  onChangeTimeHorizon,
  customStartDate,
  onCustomStartDateChange,
  customEndDate,
  onCustomEndDateChange,
  activeCount,
}: ManagerMembersDirectoryTimeHorizonBarProps) {
  return (
    <div className="w-full max-w-full min-w-0 rounded-2xl border border-indigo-500/25 md-surface-panel p-3.5 sm:p-4 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-2">
        <Calendar size={16} className="text-indigo-400 shrink-0" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Filter by Join Date:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex md-surface-sub p-1 rounded-xl border border-indigo-500/25 flex-wrap gap-1">
          {timeHorizonOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChangeTimeHorizon(opt.id)}
              className={`min-h-8 px-3 py-1 text-xs font-semibold rounded-lg motion-safe:transition-all cursor-pointer ${
                timeHorizon === opt.id
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-950/50'
                  : 'text-slate-300 hover:text-white hover:bg-indigo-500/15'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {timeHorizon === 'custom' && (
          <div className="flex items-center gap-2 flex-wrap text-xs bg-muted p-1.5 rounded-lg border border-border">
            <label className="flex items-center gap-1 text-secondary">
              <span>From:</span>
              <input maxLength={100}
                type="date"
                value={customStartDate}
                onChange={(e) => onCustomStartDateChange(e.target.value)}
                className="px-2 py-1 bg-card border border-border rounded text-xs text-primary outline-none focus:border-primary"
              />
            </label>
            <label className="flex items-center gap-1 text-secondary">
              <span>To:</span>
              <input maxLength={100}
                type="date"
                value={customEndDate}
                onChange={(e) => onCustomEndDateChange(e.target.value)}
                className="px-2 py-1 bg-card border border-border rounded text-xs text-primary outline-none focus:border-primary"
              />
            </label>
            {(customStartDate || customEndDate) && (
              <button
                type="button"
                onClick={() => {
                  onCustomStartDateChange('');
                  onCustomEndDateChange('');
                }}
                className="p-1 text-secondary hover:text-danger cursor-pointer focus-visible:ring-2 focus-visible:ring-primary outline-none rounded"
                title="Clear custom dates"
                aria-label="Clear custom dates"
              >
                <X size={13} aria-hidden="true" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default ManagerMembersDirectoryTimeHorizonBar;

