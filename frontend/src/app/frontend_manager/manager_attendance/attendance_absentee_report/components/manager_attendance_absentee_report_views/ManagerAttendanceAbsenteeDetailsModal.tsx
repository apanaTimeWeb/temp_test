'use client';

import React, { useEffect } from 'react';
import { X, User, Phone, Mail, Calendar, AlertTriangle, ShieldCheck, MessageSquare, Printer } from 'lucide-react';
import type { ManagerAttendanceAbsenteeReportSampleAbsentee } from '../../hooks/ManagerAttendanceAbsenteeReportDemoRepository';

export interface ManagerAttendanceAbsenteeDetailsModalProps {
  isOpen: boolean;
  absentee: ManagerAttendanceAbsenteeReportSampleAbsentee | null;
  onClose: () => void;
  onSendWhatsApp: (item: ManagerAttendanceAbsenteeReportSampleAbsentee) => void;
}

export function ManagerAttendanceAbsenteeDetailsModal({
  isOpen,
  absentee,
  onClose,
  onSendWhatsApp,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                isCritical
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
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-primary-subtle text-primary border border-primary/20">
                  {absentee.shift} Shift
                </span>
              </div>
              <h2 id="absentee-details-modal-title" className="text-base font-bold text-primary mt-1">
                {absentee.name}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Severity Banner */}
        <div
          className={`p-4 rounded-xl border flex items-center justify-between ${
            isCritical
              ? 'bg-rose-500/10 border-rose-500/25 text-rose-400'
              : 'bg-amber-500/10 border-amber-500/25 text-amber-400'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <AlertTriangle size={20} className="shrink-0" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block">
                {isCritical ? 'Critical Unexcused Absence' : 'Attendance Concern'}
              </span>
              <span className="text-[11px] text-secondary">
                {isCritical ? 'Immediate seat re-allocation risk' : 'Counseling & notification recommended'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black font-mono">{absentee.daysAbsent}</span>
            <span className="text-xs font-semibold block">Days Absent</span>
          </div>
        </div>

        {/* Details Grid */}
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
            <p className="font-semibold font-mono text-primary">{absentee.parentPhone || '—'}</p>
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

        {/* Official Protocol Advisory */}
        <div className="p-3 rounded-xl bg-surface-highlight/40 border border-border text-[11px] text-secondary leading-relaxed flex items-start gap-2">
          <ShieldCheck size={16} className="text-primary shrink-0 mt-0.5" />
          <span>
            Library regulations require 3+ day consecutive absence notifications. For 7+ days, seat reservation is subject to forfeiture without verified leave approval.
          </span>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-border">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer shadow-xs"
          >
            <Printer size={14} /> Print Notice
          </button>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer shadow-xs"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onSendWhatsApp(absentee);
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-all"
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
