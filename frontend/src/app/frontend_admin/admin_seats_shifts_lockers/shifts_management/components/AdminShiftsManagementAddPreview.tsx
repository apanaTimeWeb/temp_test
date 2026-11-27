'use client';

import { Building2, Clock, IndianRupee, Sun } from 'lucide-react';

export const SHIFT_BRANCH_METADATA: Record<string, { deskCount: number; maxDesksText: string; timingText: string; badgeColor: string }> = {
  'Downtown Central': {
    deskCount: 24,
    maxDesksText: '24 Physical Desks',
    timingText: '24/7 Round-the-clock operations',
    badgeColor: 'border-border-focus bg-primary-subtle text-primary',
  },
  'Westside Branch': {
    deskCount: 12,
    maxDesksText: '12 Physical Desks',
    timingText: '07:00 – 21:00 (Mall / Complex Hours)',
    badgeColor: 'border-success bg-success-bg text-success-text',
  },
  'North Hub': {
    deskCount: 12,
    maxDesksText: '12 Physical Desks',
    timingText: '06:00 – 23:00 (University Area)',
    badgeColor: 'border-purple-text bg-purple-bg text-purple-text',
  },
  'All Branches': {
    deskCount: 24,
    maxDesksText: 'Universal Network Template (All 3 Branches)',
    timingText: 'Applied across network with branch desk caps',
    badgeColor: 'border-info bg-info-bg text-info-text',
  },
};

export const SHIFT_ADD_PRESETS = [
  { name: 'Morning Shift', start: '06:00', end: '12:00', price: 800, capacity: 24, icon: '🌅' },
  { name: 'Afternoon Shift', start: '12:00', end: '17:00', price: 700, capacity: 24, icon: '☀️' },
  { name: 'Evening Shift', start: '17:00', end: '22:00', price: 900, capacity: 24, icon: '🌆' },
  { name: 'Night Owl Slot', start: '22:00', end: '06:00', price: 1000, capacity: 24, icon: '🌙' },
  { name: 'Full Day Dedicated 24/7', start: '00:00', end: '23:59', price: 2000, capacity: 24, icon: '⭐' },
];

interface AdminShiftsManagementAddPreviewProps {
  name: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  monthlyPrice: number;
  capacity: number;
  targetBranch: string;
  branchBadgeColor: string;
  timelineSegments: Array<{ left: number; width: number }>;
}

export function AdminShiftsManagementAddPreview({
  name,
  startTime,
  endTime,
  durationHours,
  monthlyPrice,
  capacity,
  targetBranch,
  branchBadgeColor,
  timelineSegments,
}: AdminShiftsManagementAddPreviewProps) {
  return (
    <>
      <div className="rounded-xl border border-border bg-surface-highlight p-3 space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-text-secondary">
          <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
            <Sun size={11} className="text-warning-text" aria-hidden="true" /> 24-Hour Day Schedule Placement
          </span>
          <span className="font-mono text-primary">{startTime} → {endTime} ({durationHours} Hours)</span>
        </div>
        <div className="relative h-6 w-full rounded-lg bg-card border border-border overflow-hidden">
          <div className="absolute inset-0 flex justify-between px-1 pointer-events-none opacity-40 text-[9px] text-text-secondary">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>24:00</span>
          </div>
          {timelineSegments.map((seg) => (
            <div
              key={`${seg.left}-${seg.width}`}
              className="absolute top-0 bottom-0 bg-primary opacity-80 rounded-sm shadow-card"
              style={{ left: `${seg.left}%`, width: `${Math.max(1, seg.width)}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between text-[9px] text-text-secondary font-mono px-0.5">
          <span>12 AM</span>
          <span>6 AM</span>
          <span>12 PM</span>
          <span>6 PM</span>
          <span>12 AM</span>
        </div>
      </div>

      <div className="rounded-xl border border-border-focus bg-primary-subtle p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
            Live Shift Directory Preview
          </span>
          <span className="text-[10px] text-text-secondary">Card rendered in student catalog</span>
        </div>
        <div className="rounded-lg border border-border bg-card p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-text-primary">{name || 'Shift Title Preview'}</h4>
              <p className="text-[11px] text-text-secondary flex items-center gap-1.5 mt-0.5">
                <Clock size={11} className="text-info-text" aria-hidden="true" />
                <span>{startTime} → {endTime}</span>
                <span className="text-primary font-mono">({durationHours} hrs)</span>
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-0.5 rounded-md border border-success bg-success-bg px-2 py-0.5 text-xs font-bold text-success-text">
                <IndianRupee size={11} aria-hidden="true" />
                <span>{monthlyPrice} / mo</span>
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border text-[11px]">
            <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-medium ${branchBadgeColor}`}>
              <Building2 size={11} aria-hidden="true" />
              <span>{targetBranch}</span>
            </span>
            <span className="text-text-secondary font-mono">
              Capacity: <strong className="text-text-primary">{capacity} Desks</strong>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
