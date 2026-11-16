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
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Available (Free)</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-secondary">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Occupied (Click for Student Detail)</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Plan Expired / Overdue</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-secondary">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Under Maintenance</span>
          </div>
        </div>
        <span className="text-[11px] font-mono font-medium text-secondary">
          Total: {lockers.length} Lockers
        </span>
      </div>

      {/* Grid of Lockers */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
        {lockers.map((locker) => {
          const isOccupied = locker.status === 'Occupied';
          const isFree = locker.status === 'Free';
          const isMaintenance = locker.status === 'Maintenance';
          const isExpired =
            (isOccupied || locker.status === 'Expired') &&
            Boolean(locker.expiryDate && new Date(locker.expiryDate) < new Date());

          return (
            <div
              key={locker.id || locker.lockerId}
              role="button"
              tabIndex={0}
              onClick={() => {
                if (isOccupied || isExpired) {
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
                  if (isOccupied || isExpired) onSelectLocker(locker);
                  else if (isFree) onShowAssign(locker);
                  else onSelectLocker(locker);
                }
              }}
              className={`group relative flex flex-col justify-between p-3.5 rounded-2xl border transition-all cursor-pointer select-none text-left focus:outline-none focus:ring-2 focus:ring-primary ${
                isExpired
                  ? 'bg-card border-amber-500/50 hover:border-amber-500 hover:bg-amber-500/10 shadow-xs ring-1 ring-amber-500/30'
                  : isOccupied
                  ? 'bg-card border-rose-500/30 hover:border-rose-500 hover:bg-rose-500/5 shadow-xs hover:shadow-md'
                  : isFree
                  ? 'bg-card border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-500/5 shadow-xs'
                  : 'bg-card border-amber-500/30 hover:border-amber-500 hover:bg-amber-500/5 opacity-80'
              }`}
            >
              {/* Locker Top: ID & Status Badge */}
              <div className="flex items-start justify-between gap-1 mb-2">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                      isExpired
                        ? 'bg-amber-500/15 text-amber-500'
                        : isOccupied
                        ? 'bg-rose-500/10 text-rose-600'
                        : isFree
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : 'bg-amber-500/10 text-amber-600'
                    }`}
                  >
                    <DoorClosed size={14} />
                  </div>
                  <div>
                    <span className="font-mono font-bold text-sm text-primary block leading-none">
                      {locker.lockerId}
                    </span>
                    <span className="font-mono text-[10px] text-secondary">
                      {locker.keyNumber || `KEY-${locker.lockerId}`}
                    </span>
                  </div>
                </div>

                <span
                  className={`w-2 h-2 rounded-full shrink-0 mt-1 ${
                    isExpired ? 'bg-amber-500 animate-pulse' : isOccupied ? 'bg-rose-500' : isFree ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  title={isExpired ? 'Plan Expired' : locker.status}
                />
              </div>

              {/* Locker Body Content */}
              <div className="space-y-1">
                {isExpired ? (
                  <>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-400 truncate">
                      <User size={12} className="shrink-0 text-amber-400" />
                      <span className="truncate">{locker.assignedTo}</span>
                    </div>
                    <div className="text-[10px] font-semibold text-amber-500 truncate">
                      ⚠️ Plan Ended {locker.expiryDate}
                    </div>
                    {locker.lostKeyReported && (
                      <div className="text-[10px] font-bold text-rose-400">
                        🚨 Key Lost (-₹{locker.lostKeyFine || 150})
                      </div>
                    )}
                    <div className="pt-1.5 text-[10px] font-bold text-amber-400 group-hover:underline flex items-center gap-1">
                      <span>Action required</span>
                      <span aria-hidden="true">→</span>
                    </div>
                  </>
                ) : isOccupied ? (
                  <>
                    <div className="flex items-center gap-1 text-xs font-semibold text-rose-600 truncate">
                      <User size={12} className="shrink-0 text-rose-600" />
                      <span className="truncate">{locker.assignedTo}</span>
                    </div>
                    <div className="text-[10px] text-secondary font-mono truncate">
                      {locker.studentId && locker.studentId !== '—' ? locker.studentId : 'Assigned'}
                    </div>
                    {locker.lostKeyReported && (
                      <div className="text-[10px] font-bold text-rose-400">
                        🚨 Key Lost (-₹{locker.lostKeyFine || 150})
                      </div>
                    )}
                    <div className="pt-1.5 text-[10px] font-medium text-rose-600 group-hover:underline flex items-center gap-1">
                      <span>View details</span>
                      <span aria-hidden="true">→</span>
                    </div>
                  </>
                ) : isFree ? (
                  <>
                    <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <CheckCircle2 size={12} className="shrink-0" />
                      <span>Available</span>
                    </div>
                    <div className="text-[10px] text-secondary font-mono">
                      Key: #{locker.lockerId}
                    </div>
                    <div className="pt-1.5 text-[10px] font-medium text-emerald-600 group-hover:underline flex items-center gap-1">
                      <span>Allot Locker</span>
                      <span aria-hidden="true">+</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1 text-xs font-medium text-amber-600">
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

