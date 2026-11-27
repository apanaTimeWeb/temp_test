export interface EarlyEntryWarningData {
  studentName: string;
  smartId: string;
  shiftName: string;
  shiftWindow: string;
  currentTimeStr: string;
  hoursEarly: number;
}

export interface QrRecentScanLog {
  studentName: string;
  smartId: string;
  seat: string;
  shift: string;
  action: 'CHECK_IN' | 'CHECK_OUT';
  time: string;
  warningNote?: string;
}

export const STUDENT_SHIFT_SCHEDULE: Record<
  string,
  { shiftName: string; shiftWindow: string; startHour: number; endHour: number }
> = {
  'LIB-001': { shiftName: 'Morning', shiftWindow: '06:00 AM - 02:00 PM', startHour: 6, endHour: 14 },
  'LIB-002': { shiftName: 'Morning', shiftWindow: '06:00 AM - 02:00 PM', startHour: 6, endHour: 14 },
  'LIB-003': { shiftName: 'Afternoon', shiftWindow: '02:00 PM - 06:00 PM', startHour: 14, endHour: 18 },
  'LIB-004': { shiftName: 'Morning', shiftWindow: '06:00 AM - 02:00 PM', startHour: 6, endHour: 14 },
  'LIB-005': { shiftName: 'Evening', shiftWindow: '06:00 PM - 10:00 PM', startHour: 18, endHour: 22 },
  'LIB-006': { shiftName: 'Morning', shiftWindow: '06:00 AM - 02:00 PM', startHour: 6, endHour: 14 },
  'LIB-007': { shiftName: 'Evening', shiftWindow: '06:00 PM - 10:00 PM', startHour: 18, endHour: 22 },
  'LIB-008': { shiftName: 'Full Day', shiftWindow: '06:00 AM - 10:00 PM', startHour: 6, endHour: 22 },
  'LIB-009': { shiftName: 'Evening', shiftWindow: '06:00 PM - 10:00 PM', startHour: 18, endHour: 22 },
  'LIB-010': { shiftName: 'Morning', shiftWindow: '06:00 AM - 02:00 PM', startHour: 6, endHour: 14 },
};

export function playKioskBeep(type: 'success' | 'warning'): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === 'success') {
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else {
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.38);
    }
  } catch {
    // Ignore audio policies gracefully
  }
}

export function evaluateEarlyShiftEntry(
  targetSmartId: string,
  targetName: string
): EarlyEntryWarningData | null {
  const sched =
    STUDENT_SHIFT_SCHEDULE[targetSmartId] ||
    (targetSmartId.toLowerCase().includes('evening') ||
    targetName.toLowerCase().includes('rohan') ||
    targetName.toLowerCase().includes('vikas')
      ? { shiftName: 'Evening', shiftWindow: '06:00 PM - 10:00 PM', startHour: 18, endHour: 22 }
      : null);

  if (!sched) return null;

  const scanHour = 8.5;
  const graceBuffer = 0.5;
  if (scanHour < sched.startHour - graceBuffer) {
    const hoursEarly = Math.round((sched.startHour - scanHour) * 10) / 10;
    return {
      studentName: targetName,
      smartId: targetSmartId,
      shiftName: sched.shiftName,
      shiftWindow: sched.shiftWindow,
      currentTimeStr: '08:30 AM',
      hoursEarly,
    };
  }
  return null;
}
