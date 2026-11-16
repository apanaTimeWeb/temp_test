'use client';
// RESPONSIBILITY: Modal dialog for auditing seat occupancy history, especially for damage or theft incident investigations (e.g. past 1 month occupants of a specific seat).
import React, { useState, useMemo } from 'react';
import { ShieldAlert, Search, X, Calendar, User, Armchair, Clock, Copy, Check, Filter } from 'lucide-react';
import { toast } from 'sonner';
import type { ManagerSeatsHistoryRow } from '../../types/ManagerSeatsHistoryTypes';

export interface ManagerSeatsHistoryAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  seatOptions: string[];
  historyData: ManagerSeatsHistoryRow[];
  onApplySeatFilter: (seatNo: string, horizon: '30days' | 'all') => void;
  initialSeat?: string;
}

export function ManagerSeatsHistoryAuditModal({
  isOpen,
  onClose,
  seatOptions,
  historyData,
  onApplySeatFilter,
  initialSeat = '',
}: ManagerSeatsHistoryAuditModalProps) {
  const [selectedSeat, setSelectedSeat] = useState<string>(initialSeat || (seatOptions[0] ?? ''));
  const [timeHorizon, setTimeHorizon] = useState<'30days' | '7days' | '90days' | 'all'>('30days');
  const [studentSearch, setStudentSearch] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Filter occupants by selected seat and time horizon
  const seatOccupants = useMemo(() => {
    if (!selectedSeat) return [];

    const now = new Date();
    let cutoffDate: Date | null = null;
    if (timeHorizon === '7days') {
      cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeHorizon === '30days') {
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (timeHorizon === '90days') {
      cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    }

    const cutoffStr = cutoffDate ? cutoffDate.toISOString().slice(0, 10) : null;
    const q = studentSearch.trim().toLowerCase();

    return historyData
      .filter((row) => {
        if (row.seatNo !== selectedSeat) return false;
        if (cutoffStr) {
          // If occupiedTill is on/after cutoff OR occupiedFrom is on/after cutoff
          const isWithinHorizon = row.occupiedTill >= cutoffStr || row.occupiedFrom >= cutoffStr;
          if (!isWithinHorizon) return false;
        }
        if (q) {
          const matchName = row.studentName.toLowerCase().includes(q);
          const matchId = row.smartId.toLowerCase().includes(q);
          if (!matchName && !matchId) return false;
        }
        return true;
      })
      .sort((a, b) => b.occupiedFrom.localeCompare(a.occupiedFrom));
  }, [selectedSeat, timeHorizon, studentSearch, historyData]);

  if (!isOpen) return null;

  const handleCopyReport = () => {
    if (seatOccupants.length === 0) {
      toast.error('No occupant records to copy.');
      return;
    }
    const lines = [
      `SEAT INCIDENT AUDIT REPORT`,
      `Seat: ${selectedSeat}`,
      `Period: ${timeHorizon === '30days' ? 'Past 1 Month (30 Days)' : timeHorizon === '7days' ? 'Past 7 Days' : timeHorizon === '90days' ? 'Past 90 Days' : 'All Time'}`,
      `Total Occupants Found: ${seatOccupants.length}`,
      `Generated: ${new Date().toLocaleString()}`,
      `----------------------------------------`,
      ...seatOccupants.map(
        (o, i) =>
          `${i + 1}. ${o.studentName} (${o.smartId}) | Shift: ${o.shift} | Dates: ${o.occupiedFrom} to ${o.occupiedTill} | Reason: ${o.reason}`
      ),
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    toast.success('Audit report copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyFilter = () => {
    onApplySeatFilter(selectedSeat, timeHorizon === '30days' ? '30days' : 'all');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="manager-seat-audit-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-3 sm:p-4 overflow-y-auto backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h2 id="manager-seat-audit-title" className="text-base font-bold text-primary">
                Seat Incident & Audit Investigation
              </h2>
              <p className="text-xs text-secondary mt-0.5">
                Audit past occupants of a seat for damage, theft complaints, or disciplinary review
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-secondary hover:text-primary hover:bg-surface transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filters Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl border border-border bg-surface">
          {/* Seat Picker */}
          <div className="space-y-1">
            <label htmlFor="audit-seat-select" className="text-[11px] font-bold text-secondary uppercase tracking-wider">
              Investigate Seat
            </label>
            <select
              id="audit-seat-select"
              data-testid="manager-audit-seat-select"
              value={selectedSeat}
              onChange={(e) => setSelectedSeat(e.target.value)}
              className="w-full h-9 px-2.5 rounded-lg border border-border bg-card text-primary text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {seatOptions.map((s) => (
                <option key={s} value={s}>
                  Seat {s}
                </option>
              ))}
            </select>
          </div>

          {/* Time Horizon */}
          <div className="space-y-1">
            <label htmlFor="audit-horizon-select" className="text-[11px] font-bold text-secondary uppercase tracking-wider">
              Audit Time Horizon
            </label>
            <select
              id="audit-horizon-select"
              data-testid="manager-audit-horizon-select"
              value={timeHorizon}
              onChange={(e) => setTimeHorizon(e.target.value as any)}
              className="w-full h-9 px-2.5 rounded-lg border border-border bg-card text-primary text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="30days">🗓️ Past 1 Month (30 Days)</option>
              <option value="7days">⚡ Past 7 Days</option>
              <option value="90days">📅 Past 3 Months (90 Days)</option>
              <option value="all">♾️ All Recorded Time</option>
            </select>
          </div>

          {/* Student Name Filter */}
          <div className="space-y-1">
            <label htmlFor="audit-student-search" className="text-[11px] font-bold text-secondary uppercase tracking-wider">
              Filter By Student Name
            </label>
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
              <input
                id="audit-student-search"
                data-testid="manager-audit-student-search"
                type="text"
                placeholder="Search student..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full h-9 pl-7 pr-2.5 rounded-lg border border-border bg-card text-primary text-xs placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Results Banner */}
        <div className="flex items-center justify-between text-xs px-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">Occupancy Roster:</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-semibold text-[11px] border border-amber-500/30">
              {seatOccupants.length} student{seatOccupants.length === 1 ? '' : 's'} on Seat {selectedSeat}
            </span>
          </div>
          <button
            type="button"
            data-testid="manager-audit-copy-report-btn"
            onClick={handleCopyReport}
            className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy Audit Report'}</span>
          </button>
        </div>

        {/* Occupants List / Timeline */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {seatOccupants.length === 0 ? (
            <div className="p-8 rounded-xl border border-dashed border-border text-center space-y-1">
              <p className="text-secondary text-xs">
                No students found on Seat {selectedSeat} within the selected audit period.
              </p>
              <p className="text-[11px] text-secondary/70">
                Try switching the time horizon to "Past 3 Months" or "All Recorded Time".
              </p>
            </div>
          ) : (
            seatOccupants.map((occ, idx) => (
              <div
                key={`${occ.smartId}-${occ.occupiedFrom}-${idx}`}
                className="p-3 rounded-xl border border-border bg-surface hover:border-primary/40 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary-subtle text-primary flex items-center justify-center shrink-0">
                      <User size={14} />
                    </div>
                    <div>
                      <span className="font-bold text-primary text-xs block leading-tight">
                        {occ.studentName}
                      </span>
                      <span className="font-mono text-[11px] text-secondary">
                        ID: {occ.smartId} · Shift: <strong className="text-primary">{occ.shift}</strong>
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-card border border-border text-secondary">
                    {occ.reason}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-secondary pt-1 border-t border-border/50">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar size={11} className="text-secondary" />
                    {occ.occupiedFrom} → {occ.occupiedTill}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock size={11} className="text-secondary" />
                    Duration: {occ.duration}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <p className="text-[11px] text-secondary hidden sm:block">
            Quickly isolate this seat and timeframe in the main history table.
          </p>
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              data-testid="manager-audit-apply-filter-btn"
              onClick={handleApplyFilter}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-sm cursor-pointer"
            >
              <Filter size={13} />
              <span>Filter Main Table to Seat {selectedSeat}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ManagerSeatsHistoryAuditModal;
