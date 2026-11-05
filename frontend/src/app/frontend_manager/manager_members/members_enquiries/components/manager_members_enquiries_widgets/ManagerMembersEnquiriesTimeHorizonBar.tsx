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
    <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Calendar size={16} className="text-primary shrink-0" />
        <span className="text-xs font-bold uppercase tracking-wider text-secondary">
          Pipeline Time Horizon:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Segmented Time Horizon Pills */}
        <div className="inline-flex bg-muted p-1 rounded-xl border border-border flex-wrap">
          {timeHorizonOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTimeHorizon(opt.id)}
              className={`min-h-8 px-3 py-1 text-xs font-medium rounded-lg motion-safe:transition-all ${timeHorizon === opt.id
                ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                : 'text-secondary hover:text-primary'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Inline Custom Date Inputs if Custom Range is active */}
        {timeHorizon === 'custom' && (
          <div className="flex items-center gap-2 flex-wrap text-xs bg-muted p-1.5 rounded-lg border border-border">
            <label className="flex items-center gap-1 text-secondary">
              <span>From:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-2 py-1 bg-card border border-border rounded text-xs text-primary outline-none focus:border-primary"
              />
            </label>
            <label className="flex items-center gap-1 text-secondary">
              <span>To:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-2 py-1 bg-card border border-border rounded text-xs text-primary outline-none focus:border-primary"
              />
            </label>
            {(customStartDate || customEndDate) && (
              <button
                type="button"
                onClick={() => {
                  setCustomStartDate('');
                  setCustomEndDate('');
                }}
                className="p-1 text-secondary hover:text-destructive"
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

