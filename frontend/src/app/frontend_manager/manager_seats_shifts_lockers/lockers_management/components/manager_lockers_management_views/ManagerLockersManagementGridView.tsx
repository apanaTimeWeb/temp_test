'use client';

import React from 'react';
import { DoorClosed, User, CheckCircle2, AlertTriangle, Key } from 'lucide-react';
import type { ManagerLockersManagementSampleLocker as Locker } from '../../mocks/manager_lockers_management_fixtures/ManagerLockersManagementSampleFixtures';

export interface ManagerLockersManagementGridViewProps {
  lockers: Locker[];
  onSelectLocker: (locker: Locker) => void;
  onShowAssign: (locker: Locker) => void;
}

export function ManagerLockersManagementGridView({
  lockers,
  onSelectLocker,
  onShowAssign,
}: ManagerLockersManagementGridViewProps) {
  if (lockers.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl border border-border bg-card">
        <DoorClosed size={36} className="mx-auto mb-3 text-secondary opacity-60" />
        <h3 className="text-sm font-semibold text-primary">No Lockers Found</h3>
        <p className="text-xs text-secondary mt-1">Try adjusting your search query or status filter.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface border border-border text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 font-medium text-secondary">
            <span className="w-2.5 h-2.5 rounded-full bg-success" />
            <span>Available (Free)</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-secondary">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span>Occupied (Click for Student Detail)</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-secondary">
            <span className="w-2.5 h-2.5 rounded-full bg-warning" />
            <span>Under Maintenance</span>
          </div>
        </div>
        <span className="text-[11px] font-mono font-medium text-secondary">
          Total: {lockers.length} Lockers
        </span>
      </div>

      {/* Grid of Lockers */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {lockers.map((locker) => {
          const isOccupied = locker.status === 'Occupied';
          const isFree = locker.status === 'Free';
          const isMaintenance = locker.status === 'Maintenance';

          return (
            <div
              key={locker.id || locker.lockerId}
              role="button"
              tabIndex={0}
              onClick={() => {
                if (isOccupied) {
                  onSelectLocker(locker);
                } else if (isFree) {
                  onShowAssign(locker);
                } else {
                  onSelectLocker(locker);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (isOccupied) onSelectLocker(locker);
                  else if (isFree) onShowAssign(locker);
                  else onSelectLocker(locker);
                }
              }}
              className={`group relative flex flex-col justify-between p-3.5 rounded-2xl border transition-all cursor-pointer select-none text-left focus:outline-none focus:ring-2 focus:ring-primary ${
                isOccupied
                  ? 'bg-card border-primary/30 hover:border-primary shadow-xs hover:shadow-md'
                  : isFree
                  ? 'bg-card border-success/30 hover:border-success hover:bg-success/5 shadow-xs'
                  : 'bg-card border-warning/30 hover:border-warning opacity-80'
              }`}
            >
              {/* Locker Top: ID & Status Badge */}
              <div className="flex items-start justify-between gap-1 mb-2">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                      isOccupied
                        ? 'bg-primary-subtle text-primary'
                        : isFree
                        ? 'bg-success-subtle text-success'
                        : 'bg-warning-subtle text-warning'
                    }`}
                  >
                    <DoorClosed size={14} />
                  </div>
                  <span className="font-mono font-bold text-sm text-primary">
                    {locker.lockerId}
                  </span>
                </div>

                <span
                  className={`w-2 h-2 rounded-full shrink-0 mt-1 ${
                    isOccupied ? 'bg-primary' : isFree ? 'bg-success' : 'bg-warning'
                  }`}
                  title={locker.status}
                />
              </div>

              {/* Locker Body Content */}
              <div className="space-y-1">
                {isOccupied ? (
                  <>
                    <div className="flex items-center gap-1 text-xs font-semibold text-primary truncate">
                      <User size={12} className="shrink-0 text-primary" />
                      <span className="truncate">{locker.assignedTo}</span>
                    </div>
                    <div className="text-[10px] text-secondary font-mono truncate">
                      {locker.studentId && locker.studentId !== '—' ? locker.studentId : 'Assigned'}
                    </div>
                    <div className="pt-1.5 text-[10px] font-medium text-primary group-hover:underline flex items-center gap-1">
                      <span>View details</span>
                      <span aria-hidden="true">→</span>
                    </div>
                  </>
                ) : isFree ? (
                  <>
                    <div className="flex items-center gap-1 text-xs font-medium text-success">
                      <CheckCircle2 size={12} className="shrink-0" />
                      <span>Available</span>
                    </div>
                    <div className="text-[10px] text-secondary font-mono">
                      Key: #{locker.lockerId}
                    </div>
                    <div className="pt-1.5 text-[10px] font-medium text-success group-hover:underline flex items-center gap-1">
                      <span>Allot Locker</span>
                      <span aria-hidden="true">+</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1 text-xs font-medium text-warning">
                      <AlertTriangle size={12} className="shrink-0" />
                      <span>Maintenance</span>
                    </div>
                    <div className="text-[10px] text-secondary">Service required</div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

