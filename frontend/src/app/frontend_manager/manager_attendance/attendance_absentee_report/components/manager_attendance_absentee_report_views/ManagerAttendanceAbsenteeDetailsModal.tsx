'use client';

import { ManagerAttendanceAbsenteeLeaveSection } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/components/manager_attendance_absentee_report_views/ManagerAttendanceAbsenteeLeaveSection';
import type { ManagerAttendanceAbsenteeReportSampleAbsentee } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/hooks/ManagerAttendanceAbsenteeReportDemoRepository';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Mail,
  MessageSquare,
  Phone,
  Printer,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useEffect } from 'react';

export interface ManagerAttendanceAbsenteeDetailsModalProps {
  isOpen: boolean;
  absentee: ManagerAttendanceAbsenteeReportSampleAbsentee | null;
  onClose: () => void;
  onSendWhatsApp: (item: ManagerAttendanceAbsenteeReportSampleAbsentee) => void;
  onMarkExcused?: (smartId: string, reason: string, duration?: string) => void;
  onRevokeExcused?: (smartId: string) => void;
}

export function ManagerAttendanceAbsenteeDetailsModal({
  isOpen,
  absentee,
  onClose,
  onSendWhatsApp,
  onMarkExcused,
  onRevokeExcused,
}: ManagerAttendanceAbsenteeDetailsModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !absentee) return null;

  const isCritical = absentee.daysAbsent >= 7;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="absentee-details-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs motion-safe:animate-in motion-safe:fade-in motion-safe:duration-fast"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                absentee.excused
                  ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                  : isCritical
                  ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                  : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
              }`}
            >
              {absentee.initials || 'ST'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-highlight border border-border text-secondary">
                  {absentee.smartId}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-primary-subtle text-primary border border-border">
                  {absentee.shift} Shift
                </span>
                {absentee.excused && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-blue-500/15 text-blue-400 border border-blue-500/30">
                    Excused Leave
                  </span>
                )}
              </div>
              <h2 id="absentee-details-modal-title" className="text-base font-bold text-primary mt-1">
                {absentee.name}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div
          className={`p-4 rounded-xl border flex items-center justify-between ${
            absentee.excused
              ? 'bg-blue-500/10 border-blue-500/25 text-blue-400'
              : isCritical
              ? 'bg-rose-500/10 border-rose-500/25 text-rose-400'
              : 'bg-amber-500/10 border-amber-500/25 text-amber-400'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {absentee.excused ? (
              <CheckCircle2 size={20} className="shrink-0 text-blue-400" />
            ) : (
              <AlertTriangle size={20} className="shrink-0" />
            )}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block">
                {absentee.excused
                  ? 'Official Excused Absence'
                  : isCritical
                  ? 'Critical Unexcused Absence'
                  : 'Attendance Concern'}
              </span>
              <span className="text-[11px] text-secondary">
                {absentee.excused
                  ? `Reason: ${absentee.leaveReason || 'Authorized Leave'}`
                  : isCritical
                  ? 'Immediate seat re-allocation risk'
                  : 'Counseling & notification recommended'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black font-mono">{absentee.daysAbsent}</span>
            <span className="text-xs font-semibold block">Days Absent</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-surface-highlight/40 border border-border/80 space-y-1">
            <span className="text-[11px] text-secondary flex items-center gap-1.5 font-medium">
              <Calendar size={12} className="text-primary" /> Last Attended Date
            </span>
            <p className="font-semibold text-primary">{absentee.lastSeen}</p>
          </div>

          <div className="p-3 rounded-xl bg-surface-highlight/40 border border-border/80 space-y-1">
            <span className="text-[11px] text-secondary flex items-center gap-1.5 font-medium">
              <ShieldCheck size={12} className="text-emerald-400" /> Parent Alert Status
            </span>
            <p className={`font-semibold ${absentee.notified ? 'text-emerald-400' : 'text-amber-400'}`}>
              {absentee.notified ? 'Previously Notified' : 'Pending WhatsApp Alert'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface-highlight/40 border border-border/80 space-y-1">
            <span className="text-[11px] text-secondary flex items-center gap-1.5 font-medium">
              <Phone size={12} className="text-indigo-400" /> Parent Contact
            </span>
            <span className="font-semibold font-mono text-primary">{absentee.parentPhone || '—'}</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-highlight/40 border border-border/80 space-y-1">
            <span className="text-[11px] text-secondary flex items-center gap-1.5 font-medium">
              <Mail size={12} className="text-sky-400" /> Registered Email
            </span>
            <p className="font-semibold text-primary truncate" title={absentee.parentEmail}>
              {absentee.parentEmail || '—'}
            </p>
          </div>
        </div>

        <ManagerAttendanceAbsenteeLeaveSection
          smartId={absentee.smartId}
          excused={absentee.excused}
          leaveReason={absentee.leaveReason}
          onMarkExcused={onMarkExcused}
          onRevokeExcused={onRevokeExcused}
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-border">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors cursor-pointer shadow-xs"
          >
            <Printer size={14} /> Print Notice
          </button>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors cursor-pointer shadow-xs"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onSendWhatsApp(absentee)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer motion-safe:transition-all"
            >
              <MessageSquare size={14} />
              <span>Send WhatsApp Notice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerAttendanceAbsenteeDetailsModal;
