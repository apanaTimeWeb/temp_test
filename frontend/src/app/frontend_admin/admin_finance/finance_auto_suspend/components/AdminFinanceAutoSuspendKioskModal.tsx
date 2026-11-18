'use client';

import { useState } from 'react';
import { ShieldAlert, X, QrCode, Lock, Unlock, AlertOctagon, CheckCircle2, RotateCcw } from 'lucide-react';
import type { AdminFinanceAutoSuspendSuspendedStudent } from '../types/AdminFinanceAutoSuspendTypes';

export interface AdminFinanceAutoSuspendKioskModalProps {
  isOpen: boolean;
  onClose: () => void;
  suspendedStudents: AdminFinanceAutoSuspendSuspendedStudent[];
  initialStudent?: AdminFinanceAutoSuspendSuspendedStudent | null;
}

export function AdminFinanceAutoSuspendKioskModal({
  isOpen,
  onClose,
  suspendedStudents,
  initialStudent,
}: AdminFinanceAutoSuspendKioskModalProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<number | string>(
    initialStudent ? initialStudent.id : (suspendedStudents[0]?.id || '')
  );
  const [scanResult, setScanResult] = useState<'idle' | 'denied' | 'granted'>('idle');
  const [scannedStudent, setScannedStudent] = useState<AdminFinanceAutoSuspendSuspendedStudent | null>(null);

  if (!isOpen) return null;

  // Web Audio buzzer alert simulator
  const playAlertBuzzer = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(220, ctx.currentTime + 0.15);
        osc.frequency.setValueAtTime(440, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch {
      // AudioContext unavailable in headless testing environment
    }
  };

  const handleSimulateScan = () => {
    if (String(selectedStudentId) === 'active-student-test') {
      setScanResult('granted');
      setScannedStudent(null);
      return;
    }

    const matched = suspendedStudents.find((s) => String(s.id) === String(selectedStudentId));
    if (matched) {
      setScanResult('denied');
      setScannedStudent(matched);
      playAlertBuzzer();
    } else {
      setScanResult('granted');
      setScannedStudent(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      data-testid="gate-qr-kiosk-modal"
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <QrCode size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-primary">
                Entrance Turnstile QR Kiosk Simulator
              </h2>
              <p className="text-xs text-secondary">
                Simulate gate scanner behavior when a suspended defaulter scans their Smart Card / QR.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-primary p-1.5 rounded-lg hover:bg-surface-hover cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="student-scan-select" className="text-xs font-semibold text-secondary">
              Select Student to Simulate at Gate Scanner
            </label>
            <select
              id="student-scan-select"
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                setScanResult('idle');
              }}
              className="w-full p-2.5 rounded-xl border border-border bg-input-bg text-primary text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            >
              <optgroup label="Suspended Defaulters">
                {suspendedStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    ⛔ {s.studentName} ({s.smartId}) — Seat {s.seat} · {s.daysOverdue}d overdue
                  </option>
                ))}
              </optgroup>
              <optgroup label="Active Students (Normal Access)">
                <option value="active-student-test">
                  ✅ Regular Active Member (Dues Cleared)
                </option>
              </optgroup>
            </select>
          </div>

          <button
            type="button"
            onClick={handleSimulateScan}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            <QrCode size={15} />
            <span>Simulate Gate QR Scan</span>
          </button>

          {/* Scanner Visual Screen */}
          {scanResult === 'denied' && scannedStudent && (
            <div
              data-testid="kiosk-access-denied-box"
              className="p-5 rounded-2xl bg-rose-500/10 border-2 border-rose-500/50 text-center space-y-3 animate-in zoom-in-95"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center border border-rose-500/40">
                <Lock size={28} />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-rose-600 text-white shadow-xs">
                  <AlertOctagon size={13} />
                  Access Denied • Turnstile Locked
                </span>
                <h3 className="text-lg font-black text-rose-600 dark:text-rose-400 mt-2">
                  SEAT ACCESS SUSPENDED
                </h3>
                <p className="text-xs text-secondary mt-1">
                  Dear <strong>{scannedStudent.studentName}</strong> ({scannedStudent.smartId}), your library seat{' '}
                  <strong className="text-primary font-bold">{scannedStudent.seat}</strong> is locked due to{' '}
                  <span className="text-rose-600 font-bold">{scannedStudent.daysOverdue} days unpaid overdue fee</span>.
                </p>
              </div>

              <div className="bg-card/70 border border-border/80 p-3 rounded-xl text-xs space-y-1 text-left">
                <div className="flex justify-between">
                  <span className="text-secondary">Student Name:</span>
                  <span className="font-bold text-primary">{scannedStudent.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Smart ID:</span>
                  <span className="font-mono text-primary">{scannedStudent.smartId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Allotted Seat:</span>
                  <span className="font-bold text-primary">{scannedStudent.seat} ({scannedStudent.shift})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Pending Amount:</span>
                  <span className="font-bold text-rose-600">₹{(scannedStudent.duesAmount || 1500).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Branch:</span>
                  <span className="text-primary">{scannedStudent.branch}</span>
                </div>
              </div>

              <p className="text-[11px] text-rose-500/80 font-medium italic">
                * Turnstile gate buzzer sounding. Please visit front desk to clear dues and restore access.
              </p>
            </div>
          )}

          {scanResult === 'granted' && (
            <div
              data-testid="kiosk-access-granted-box"
              className="p-5 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/50 text-center space-y-3 animate-in zoom-in-95"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/40">
                <Unlock size={28} />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
                  <CheckCircle2 size={13} />
                  Access Granted • Turnstile Unlocked
                </span>
                <h3 className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-2">
                  WELCOME TO THE LIBRARY
                </h3>
                <p className="text-xs text-secondary mt-1">
                  Active subscription verified. Turnstile gate opened successfully.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer"
          >
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  );
}
