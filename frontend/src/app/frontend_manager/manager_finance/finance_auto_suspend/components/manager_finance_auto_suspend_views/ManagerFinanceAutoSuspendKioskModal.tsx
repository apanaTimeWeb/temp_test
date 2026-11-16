'use client';

import React, { useState } from 'react';
import { ShieldAlert, X, QrCode, Volume2, CheckCircle2, Lock, Unlock, AlertOctagon } from 'lucide-react';
import type { ManagerFinanceAutoSuspendSuspendedStudent as SuspendedStudent } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/types/ManagerFinanceAutoSuspendTypes';

export interface ManagerFinanceAutoSuspendKioskModalProps {
  isOpen: boolean;
  onClose: () => void;
  suspendedStudents: SuspendedStudent[];
  initialStudent?: SuspendedStudent | null;
}

export default function ManagerFinanceAutoSuspendKioskModal({
  isOpen,
  onClose,
  suspendedStudents,
  initialStudent,
}: ManagerFinanceAutoSuspendKioskModalProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<number | string>(
    initialStudent ? initialStudent.id : (suspendedStudents[0]?.id || '')
  );
  const [scanResult, setScanResult] = useState<'idle' | 'denied' | 'granted'>('idle');
  const [scannedStudent, setScannedStudent] = useState<SuspendedStudent | null>(null);

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
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <QrCode size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-primary">
                Entrance Gate QR Kiosk Simulator
              </h2>
              <p className="text-xs text-secondary">
                Turnstile scanner sync & suspended student access barrier verification.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-primary p-1 rounded-lg hover:bg-muted"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scan Selector Control */}
        <div className="space-y-2 text-xs">
          <label className="font-bold text-primary block">
            Select Student RFID / QR To Scan at Turnstile Gate:
          </label>
          <div className="flex gap-2">
            <select
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                setScanResult('idle');
              }}
              data-testid="kiosk-student-select"
              className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-xs text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {suspendedStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  ⚠️ [SUSPENDED - {s.daysOverdue}d Overdue] {s.studentName} ({s.smartId} • Seat {s.seat})
                </option>
              ))}
              <option value="active-student-test">
                ✓ [ACTIVE - Regular Student] Vikram Malhotra (STU-999 • All Dues Cleared)
              </option>
            </select>

            <button
              type="button"
              data-testid="simulate-kiosk-scan-btn"
              onClick={handleSimulateScan}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-on-primary hover:opacity-90 shadow-sm transition-all cursor-pointer shrink-0"
            >
              Scan QR
            </button>
          </div>
        </div>

        {/* Turnstile Screen Display */}
        <div className="rounded-2xl border border-border overflow-hidden shadow-inner">
          {scanResult === 'idle' && (
            <div className="p-10 flex flex-col items-center justify-center text-center space-y-3 bg-muted/30">
              <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center text-secondary">
                <QrCode size={32} />
              </div>
              <p className="text-sm font-bold text-primary">Turnstile Scanner Ready</p>
              <p className="text-xs text-secondary max-w-xs">
                Scan member QR barcode or tap RFID card on the gate reader to verify access.
              </p>
            </div>
          )}

          {scanResult === 'denied' && (
            <div
              data-testid="kiosk-access-denied-screen"
              className="p-8 flex flex-col items-center justify-center text-center space-y-4 bg-rose-600 text-white animate-pulse"
            >
              <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white flex items-center justify-center text-white shadow-lg">
                <AlertOctagon size={48} className="stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-wider uppercase text-white drop-shadow">
                  ACCESS DENIED - CONTACT DESK
                </h3>
                <p className="text-xs font-semibold text-rose-100">
                  Account Suspended: Overdue Fee Policy Triggered
                </p>
              </div>

              {scannedStudent && (
                <div className="w-full bg-black/30 rounded-xl p-3 space-y-1 text-xs text-left text-white border border-white/20">
                  <div className="flex justify-between">
                    <span>Student:</span>
                    <span className="font-bold">{scannedStudent.studentName} ({scannedStudent.smartId})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seat Assigned:</span>
                    <span className="font-bold">{scannedStudent.seat}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overdue Period:</span>
                    <span className="font-bold">{scannedStudent.daysOverdue} Days Past Due</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-white/20">
                    <span>Gate Hardware Lock:</span>
                    <span className="font-bold text-amber-300 flex items-center gap-1">
                      <Lock size={12} /> Turnstile Flap Barred (100% Synced)
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs font-bold text-white bg-white/20 px-3 py-1.5 rounded-full">
                <Volume2 size={14} className="animate-bounce" />
                <span>Audio Alert Buzzer Ringing At Entrance</span>
              </div>
            </div>
          )}

          {scanResult === 'granted' && (
            <div
              data-testid="kiosk-access-granted-screen"
              className="p-8 flex flex-col items-center justify-center text-center space-y-4 bg-emerald-600 text-white"
            >
              <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white flex items-center justify-center text-white shadow-lg">
                <CheckCircle2 size={48} className="stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-wider uppercase text-white">
                  ACCESS GRANTED - WELCOME
                </h3>
                <p className="text-xs font-semibold text-emerald-100">
                  Membership Active • Turnstile Unlocked
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-white bg-white/20 px-3 py-1.5 rounded-full">
                <Unlock size={14} />
                <span>Turnstile Gate Flap Opened</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-border">
          <button type="button" onClick={onClose} className="mgr-btn-ghost text-xs">
            Close Scanner
          </button>
        </div>
      </div>
    </div>
  );
}
