export const MONTH_OPTIONS = [
  { id: '2026-11', label: 'November 2026 (Current)' },
  { id: '2026-10', label: 'October 2026' },
  { id: '2026-09', label: 'September 2026' },
] as const;

export const ATTENDANCE_DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export const ATTENDANCE_SHIFT_TIMINGS: Record<string, { in: string; out: string; hours: number }> = {
  Morning: { in: '06:15', out: '14:00', hours: 7.75 },
  Afternoon: { in: '13:00', out: '18:00', hours: 5.0 },
  Evening: { in: '18:00', out: '22:00', hours: 4.0 },
  Night: { in: '22:00', out: '06:00', hours: 8.0 },
  'Full Day': { in: '08:00', out: '20:00', hours: 12.0 },
};

export function pseudoAttendanceHash(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
