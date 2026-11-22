'use client';

import { Armchair,CalendarCheck,Clock,ExternalLink,GraduationCap,Layers,Lock,Pencil,User } from 'lucide-react';
import Link from 'next/link';
import type { ManagerMembersDirectoryRecord } from '../../types/ManagerMembersDirectoryTypes';

interface ManagerMembersDirectoryExtendedCardsProps {
  member: ManagerMembersDirectoryRecord;
  onEdit: () => void;
}

export function ManagerMembersDirectoryExtendedCards({
  member,
  onEdit,
}: ManagerMembersDirectoryExtendedCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 min-w-0 w-full max-w-full">
      {/* Seat & Shift Details */}
      <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border space-y-3 min-w-0 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-border pb-2 gap-2 mb-3">
            <h4 className="font-bold text-primary flex items-center gap-2 text-sm truncate">
              <Armchair size={16} className="text-indigo-400 shrink-0" />
              <span className="truncate">Seat & Shift Allotment</span>
            </h4>
            <button
              type="button"
              onClick={onEdit}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1 cursor-pointer shrink-0"
              title="Change Seat, Shift, or Locker"
            >
              <Pencil size={11} />
              <span>Edit</span>
            </button>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center gap-2 min-w-0">
              <span className="text-secondary flex items-center gap-1.5 shrink-0"><Armchair size={14} className="text-indigo-400" /> Assigned Seat:</span>
              <span className="font-bold text-primary bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded text-right truncate">{member.seat || 'Unassigned'}</span>
            </div>
            <div className="flex justify-between items-center gap-2 min-w-0">
              <span className="text-secondary flex items-center gap-1.5 shrink-0"><Clock size={14} className="text-amber-400" /> Shift Timing:</span>
              <span className="font-semibold text-primary text-right truncate">{member.shift || 'Not Selected'}</span>
            </div>
            <div className="flex justify-between items-center gap-2 min-w-0">
              <span className="text-secondary flex items-center gap-1.5 shrink-0"><Layers size={14} className="text-sky-400" /> Floor:</span>
              <span className="font-medium text-primary text-right truncate">{member.floor || 'Unallocated'}</span>
            </div>
            <div className="flex justify-between items-center gap-2 min-w-0">
              <span className="text-secondary flex items-center gap-1.5 shrink-0"><Lock size={14} className="text-purple-400" /> Locker:</span>
              <span className="font-medium text-primary text-right truncate">{member.locker || 'None'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Attendance & Consistency Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border space-y-3 min-w-0 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-border pb-2 gap-2 mb-3">
            <h4 className="font-bold text-primary flex items-center gap-2 text-sm truncate">
              <CalendarCheck size={16} className="text-emerald-400 shrink-0" />
              <span className="truncate">Monthly Attendance</span>
            </h4>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Nov 2026
            </span>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center gap-2 min-w-0">
              <span className="text-secondary shrink-0">Attendance Rate:</span>
              <span className="font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded text-right font-mono">
                92.3% Present
              </span>
            </div>
            <div className="flex justify-between items-center gap-2 min-w-0">
              <span className="text-secondary shrink-0">Monthly Breakdown:</span>
              <span className="font-medium text-primary text-right truncate">24 P · 2 A · 1 L</span>
            </div>
            <div className="flex justify-between items-center gap-2 min-w-0">
              <span className="text-secondary shrink-0">Current Streak:</span>
              <span className="font-semibold text-primary text-right truncate">14 Days Active</span>
            </div>
          </div>
        </div>
        <div className="pt-2 border-t border-border">
          <Link
            href="/frontend_manager/manager_attendance/attendance_daily"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1.5 cursor-pointer hover:underline"
            title="Open Full Attendance Roll Register"
          >
            <span>Open Attendance Register</span>
            <ExternalLink size={12} />
          </Link>
        </div>
      </div>

      {/* Parent & Guardian Information */}
      <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border space-y-3 min-w-0 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-border pb-2 gap-2 mb-3">
            <h4 className="font-bold text-primary flex items-center gap-2 text-sm truncate">
              <User size={16} className="text-sky-400 shrink-0" />
              <span className="truncate">Guardian & Family Info</span>
            </h4>
            <button
              type="button"
              onClick={onEdit}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1 cursor-pointer shrink-0"
              title="Edit Guardian Details"
            >
              <Pencil size={11} />
              <span>Edit</span>
            </button>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center gap-2 min-w-0">
              <span className="text-secondary shrink-0">Parent / Guardian:</span>
              <span className="font-bold text-primary text-right truncate" title={member.guardian}>{member.guardian || 'Not Provided'}</span>
            </div>
            <div className="flex justify-between items-center gap-2 min-w-0">
              <span className="text-secondary shrink-0">Guardian Contact:</span>
              <span className="font-mono text-primary text-right truncate">{member.emergencyContact || 'Not Provided'}</span>
            </div>
            <div className="flex justify-between items-center gap-2 min-w-0">
              <span className="text-secondary shrink-0">Gender:</span>
              <span className="font-medium text-primary text-right truncate">{member.gender || 'Not Specified'}</span>
            </div>
            <div className="flex justify-between items-center gap-2 min-w-0">
              <span className="text-secondary shrink-0">Date of Birth:</span>
              <span className="font-medium text-primary text-right truncate">{member.dob || 'Not Provided'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Academic & Goal Preparation */}
      <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border space-y-3 min-w-0 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-border pb-2 gap-2 mb-3">
            <h4 className="font-bold text-primary flex items-center gap-2 text-sm truncate">
              <GraduationCap size={16} className="text-emerald-400 shrink-0" />
              <span className="truncate">Academic & Target Goal</span>
            </h4>
            <button
              type="button"
              onClick={onEdit}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1 cursor-pointer shrink-0"
              title="Edit Academic Goal"
            >
              <Pencil size={11} />
              <span>Edit</span>
            </button>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center gap-2 min-w-0">
              <span className="text-secondary shrink-0">Target Preparation:</span>
              <span className="font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded text-right truncate" title={member.preparationFor}>{member.preparationFor || 'General Study'}</span>
            </div>
            <div className="flex justify-between items-center gap-2 min-w-0">
              <span className="text-secondary shrink-0">Course / Stream:</span>
              <span className="font-medium text-primary text-right truncate" title={member.department}>{member.department || 'General Studies & Research'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

