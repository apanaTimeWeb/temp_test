export interface AdminSystemGapFillingBookedSegment {
  start: number;
  end: number;
}

export interface AdminSystemGapFillingRecord {
  seat: string;
  booked: readonly AdminSystemGapFillingBookedSegment[];
  gap: { start: number; end: number; label: string; hours: number };
}

/** Synthetic seat-gap rows for the explicitly demo-only gap analysis preview. */
export const ADMIN_SYSTEM_GAP_FILLING_FIXTURES: readonly AdminSystemGapFillingRecord[] = [
  { seat: 'S-03', booked: [{ start: 0, end: 25 }, { start: 70, end: 100 }], gap: { start: 25, end: 70, label: '10AM – 2PM', hours: 4 } },
  { seat: 'S-07', booked: [{ start: 0, end: 45 }], gap: { start: 45, end: 100, label: '12PM – 6PM', hours: 6 } },
  { seat: 'S-12', booked: [{ start: 30, end: 60 }, { start: 80, end: 100 }], gap: { start: 60, end: 80, label: '2PM – 4PM', hours: 2 } },
  { seat: 'S-15', booked: [{ start: 0, end: 15 }], gap: { start: 15, end: 100, label: '8AM – 6PM', hours: 10 } },
];
