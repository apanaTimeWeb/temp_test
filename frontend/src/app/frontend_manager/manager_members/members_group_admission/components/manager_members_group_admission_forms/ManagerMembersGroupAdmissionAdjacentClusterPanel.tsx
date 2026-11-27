'use client';

import type { GroupStudentEntry } from '@/app/frontend_manager/manager_members/members_group_admission/components/manager_members_group_admission_forms/ManagerMembersGroupAdmissionManualModal';
import { MANAGER_GROUP_SEAT_CLUSTERS } from '@/app/frontend_manager/manager_members/members_group_admission/utils/ManagerMembersGroupAdmissionAdjacentSeats';
import { Armchair, Users } from 'lucide-react';

interface AdjacentClusterPanelProps {
  manualRows: GroupStudentEntry[];
  selectedClusterId: string;
  onAllocateAdjacent: (clusterId?: string) => void;
}

export function ManagerMembersGroupAdmissionAdjacentClusterPanel({
  manualRows,
  selectedClusterId,
  onAllocateAdjacent,
}: AdjacentClusterPanelProps) {
  return (
    <div className="shrink-0 p-3 sm:p-3.5 rounded-xl border border-indigo-500/30 bg-surface space-y-2.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Armchair size={17} className="text-indigo-400 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-primary">Smart Adjacent Seat Allocation (For Friends & Groups)</h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                Smart Cluster
              </span>
            </div>
            <p className="text-[11px] text-secondary">
              Auto-allocate contiguous desks so friends and batchmates sit side-by-side without manual search.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onAllocateAdjacent(selectedClusterId)}
          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 motion-safe:transition-colors cursor-pointer shrink-0"
          title="Allocate contiguous adjacent seats for all students in this batch"
        >
          <Users size={14} />
          <span>1-Click Auto Assign Adjacent Seats</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border">
        <span className="text-[11px] text-secondary font-medium">Select Table / Zone:</span>
        {MANAGER_GROUP_SEAT_CLUSTERS.map((cluster) => {
          const isSelected = selectedClusterId === cluster.id;
          const hasCapacity = cluster.seats.length >= manualRows.length;
          return (
            <button
              key={cluster.id}
              type="button"
              onClick={() => onAllocateAdjacent(cluster.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border motion-safe:transition-colors cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 font-bold'
                  : 'bg-card border-border text-secondary hover:text-primary hover:border-border-hover'
              }`}
            >
              <span>{cluster.name.split(' (')[0]}</span>
              <span className="text-[10px] opacity-75 font-mono">
                ({cluster.seats[0]}–{cluster.seats[Math.min(cluster.seats.length - 1, manualRows.length - 1)]})
              </span>
              {hasCapacity && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Has enough contiguous seats" />
              )}
            </button>
          );
        })}
      </div>

      {manualRows.some((r) => r.seatPreference && r.seatPreference !== 'Any Seat') && (
        <div className="p-2 rounded-lg bg-surface border border-border flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] text-secondary font-semibold shrink-0">Assigned Desks:</span>
          <div className="flex items-center gap-1.5 shrink-0">
            {manualRows.map((row, idx) => (
              <div
                key={row.id}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold"
              >
                <span>{row.seatPreference || `S-${String(idx + 1).padStart(2, '0')}`}</span>
                <span className="text-[10px] font-sans font-normal opacity-80 max-w-[80px] truncate">
                  ({row.name.trim() || `Student ${idx + 1}`})
                </span>
                {idx < manualRows.length - 1 && <span className="text-secondary font-sans font-normal ml-1">↔</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
