import type { Student } from '../types/ManagerAttendanceDailyComponentTypes';

export type AttendanceDailyMonthStatus = 'present' | 'absent' | 'late' | 'holiday';

export interface AttendanceDailyDayRecord {
  dayNumber: number;
  dateStr: string;
  dayOfWeek: string;
  isSunday: boolean;
  status: AttendanceDailyMonthStatus;
  inTime: string;
  outTime: string;
  studyHours: number;
  verificationMethod: string;
}

export interface StudentMonthlyAttendanceSummary {
  studentId: string;
  studentName: string;
  smartId: string;
  shift: string;
  seat: string;
  month: string; // e.g. "2026-11"
  monthLabel: string; // e.g. "November 2026"
  totalDays: number;
  totalWorkingDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  holidayDays: number;
  attendanceRate: number; // 0 - 100 percentage
  totalStudyHours: number;
  dailyLogs: AttendanceDailyDayRecord[];
}

export const MONTH_OPTIONS = [
  { id: '2026-11', label: 'November 2026 (Current)' },
  { id: '2026-10', label: 'October 2026' },
  { id: '2026-09', label: 'September 2026' },
] as const;

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Deterministic pseudo-random generator for consistent demo attendance history.
 */
function pseudoHash(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getStudentMonthlyAttendance(
  student: Student,
  monthKey: string = '2026-11'
): StudentMonthlyAttendanceSummary {
  const [yearStr, monthStr] = monthKey.split('-');
  const year = parseInt(yearStr || '2026', 10);
  const monthIndex = parseInt(monthStr || '11', 10) - 1;

  // Days in selected month
  const totalDays = new Date(year, monthIndex + 1, 0).getDate();
  const monthDate = new Date(year, monthIndex, 1);
  const monthLabel = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const dailyLogs: AttendanceDailyDayRecord[] = [];
  let presentDays = 0;
  let absentDays = 0;
  let lateDays = 0;
  let holidayDays = 0;
  let totalStudyHours = 0;

  // Shift base timings
  const shiftTimings: Record<string, { in: string; out: string; hours: number }> = {
    Morning: { in: '06:15', out: '14:00', hours: 7.75 },
    Afternoon: { in: '13:00', out: '18:00', hours: 5.0 },
    Evening: { in: '18:00', out: '22:00', hours: 4.0 },
    Night: { in: '22:00', out: '06:00', hours: 8.0 },
    'Full Day': { in: '08:00', out: '20:00', hours: 12.0 },
  };

  const defaultTiming = shiftTimings[student.shift] || { in: '08:00', out: '17:00', hours: 9.0 };

  for (let d = 1; d <= totalDays; d++) {
    const dStr = String(d).padStart(2, '0');
    const dateObj = new Date(year, monthIndex, d);
    const dayOfWeek = DAY_NAMES[dateObj.getDay()];
    const isSunday = dayOfWeek === 'Sun';
    const dateFormatted = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${dStr}`;

    if (isSunday) {
      holidayDays++;
      dailyLogs.push({
        dayNumber: d,
        dateStr: dateFormatted,
        dayOfWeek,
        isSunday: true,
        status: 'holiday',
        inTime: '—',
        outTime: '—',
        studyHours: 0,
        verificationMethod: 'Weekly Off / Sunday',
      });
      continue;
    }

    // Determine status deterministically
    const hash = pseudoHash(`${student.id}-${student.smartId}-${monthKey}-${d}`);
    const hashMod = hash % 100;

    let status: AttendanceDailyMonthStatus = 'present';
    let inTime = defaultTiming.in;
    let outTime = defaultTiming.out;
    let studyHours = defaultTiming.hours;

    // High consecutive absent student demo handling
    const isConsecutiveAbsentWindow =
      student.consecutiveAbsent > 0 &&
      d > totalDays - student.consecutiveAbsent - 2 &&
      monthKey === '2026-11';

    if (isConsecutiveAbsentWindow) {
      status = 'absent';
      absentDays++;
      inTime = '—';
      outTime = '—';
      studyHours = 0;
    } else if (hashMod < 6) {
      // 6% chance of random absent
      status = 'absent';
      absentDays++;
      inTime = '—';
      outTime = '—';
      studyHours = 0;
    } else if (hashMod < 14) {
      // 8% chance of late arrival
      status = 'late';
      lateDays++;
      presentDays++;
      const [h, m] = defaultTiming.in.split(':').map(Number);
      inTime = `${String(h).padStart(2, '0')}:${String((m + 35) % 60).padStart(2, '0')}`;
      studyHours = Math.max(1, defaultTiming.hours - 0.75);
      totalStudyHours += studyHours;
    } else {
      // Present on time
      status = 'present';
      presentDays++;
      totalStudyHours += studyHours;
    }

    const verificationMethods = ['Biometric Turnstile', 'QR Kiosk Scan', 'Manager Roll Check'];
    const verificationMethod = status === 'absent' ? 'Unmarked / Absent' : verificationMethods[hash % 3];

    dailyLogs.push({
      dayNumber: d,
      dateStr: dateFormatted,
      dayOfWeek,
      isSunday: false,
      status,
      inTime,
      outTime,
      studyHours: Math.round(studyHours * 10) / 10,
      verificationMethod,
    });
  }

  const totalWorkingDays = totalDays - holidayDays;
  const attendanceRate = totalWorkingDays > 0 ? Math.round((presentDays / totalWorkingDays) * 1000) / 10 : 0;

  return {
    studentId: student.id,
    studentName: student.name,
    smartId: student.smartId,
    shift: student.shift,
    seat: student.seat || 'General Floor',
    month: monthKey,
    monthLabel,
    totalDays,
    totalWorkingDays,
    presentDays,
    absentDays,
    lateDays,
    holidayDays,
    attendanceRate,
    totalStudyHours: Math.round(totalStudyHours),
    dailyLogs,
  };
}
