'use client';

import type { AdminFinanceAutoSuspendSuspendedStudent } from '@/app/frontend_admin/admin_finance/finance_auto_suspend/types/AdminFinanceAutoSuspendTypes';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { AlertOctagon, CheckCircle2, Lock, QrCode, Unlock, X } from 'lucide-react';
import { useState } from 'react';

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
    initialStudent ? initialStudent.id : suspendedStudents[0]?.id || '',
  );
  const [scanResult, setScanResult] = useState<'idle' | 'denied' | 'granted'>('idle');
  const [scannedStudent, setScannedStudent] = useState<AdminFinanceAutoSuspendSuspendedStudent | null>(null);

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
    <Dialog open={isOpen} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent
        data-testid="gate-qr-kiosk-modal"
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-overlay p-6 shadow-dialog space-y-5 text-text-primary"
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-danger-bg text-danger-text border border-danger">
              <QrCode size={20} aria-hidden="true" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-text-primary">
                Entrance Turnstile QR Kiosk Simulator
              </DialogTitle>
              <p className="text-xs text-text-secondary">
                Simulate gate scanner behavior when a suspended defaulter scans their Smart Card / QR.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close simulator"
            className="text-text-secondary hover:text-text-primary p-1.5 rounded-lg hover:bg-surface-hover cursor-pointer motion-safe:transition-colors"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="student-scan-select" className="text-xs font-semibold text-text-secondary">
              Select Student to Simulate at Gate Scanner
            </label>
            <select
              id="student-scan-select"
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                setScanResult('idle');
              }}
              className="w-full p-2.5 rounded-xl border border-border bg-input text-text-primary text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <optgroup label="Suspended Defaulters">
                {suspendedStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    ⛔ {s.studentName} ({s.smartId}) — Seat {s.seat} · {s.daysOverdue}d overdue
                  </option>
                ))}
              </optgroup>
              <optgroup label="Active Students (Normal Access)">
                <option value="active-student-test">✅ Regular Active Member (Dues Cleared)</option>
              </optgroup>
            </select>
          </div>

          <button
            type="button"
            onClick={handleSimulateScan}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-on-primary bg-primary hover:bg-primary-hover motion-safe:transition-colors shadow-card cursor-pointer flex items-center justify-center gap-2"
          >
            <QrCode size={15} aria-hidden="true" />
            <span>Simulate Gate QR Scan</span>
          </button>

          {scanResult === 'denied' && scannedStudent && (
            <div data-testid="kiosk-access-denied-box" className="p-5 rounded-2xl bg-danger-bg border-2 border-danger text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-card text-danger-text flex items-center justify-center border border-danger">
                <Lock size={28} aria-hidden="true" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-danger-text text-card shadow-card">
                  <AlertOctagon size={13} aria-hidden="true" />
                  Access Denied • Turnstile Locked
                </span>
                <h3 className="text-lg font-black text-danger-text mt-2">SEAT ACCESS SUSPENDED</h3>
                <p className="text-xs text-text-secondary mt-1">
                  Dear <strong>{scannedStudent.studentName}</strong> ({scannedStudent.smartId}), your library seat{' '}
                  <strong className="text-text-primary font-bold">{scannedStudent.seat}</strong> is locked due to{' '}
                  <span className="text-danger-text font-bold">{scannedStudent.daysOverdue} days unpaid overdue fee</span>.
                </p>
              </div>

              <div className="bg-card border border-border p-3 rounded-xl text-xs space-y-1 text-left">
                <div className="flex justify-between"><span className="text-text-secondary">Student Name:</span><span className="font-bold text-text-primary">{scannedStudent.studentName}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Smart ID:</span><span className="font-mono text-text-primary">{scannedStudent.smartId}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Allotted Seat:</span><span className="font-bold text-text-primary">{scannedStudent.seat} ({scannedStudent.shift})</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Pending Amount:</span><span className="font-bold text-danger-text">₹{(scannedStudent.duesAmount || 1500).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Branch:</span><span className="text-text-primary">{scannedStudent.branch}</span></div>
              </div>

              <p className="text-[11px] text-danger-text font-medium italic">
                * Turnstile gate buzzer sounding. Please visit front desk to clear dues and restore access.
              </p>
            </div>
          )}

          {scanResult === 'granted' && (
            <div data-testid="kiosk-access-granted-box" className="p-5 rounded-2xl bg-success-bg border-2 border-success text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-card text-success-text flex items-center justify-center border border-success">
                <Unlock size={28} aria-hidden="true" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-success-text text-card shadow-card">
                  <CheckCircle2 size={13} aria-hidden="true" />
                  Access Granted • Turnstile Unlocked
                </span>
                <h3 className="text-lg font-black text-success-text mt-2">WELCOME TO THE LIBRARY</h3>
                <p className="text-xs text-text-secondary mt-1">Active subscription verified. Turnstile gate opened successfully.</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-border">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover cursor-pointer">
            Close Simulator
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
