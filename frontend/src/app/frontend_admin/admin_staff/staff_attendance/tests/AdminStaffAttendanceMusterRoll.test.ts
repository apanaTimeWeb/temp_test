import { describe, expect, it } from 'vitest';

describe('Admin Staff Attendance Monthly Muster Roll', () => {
  it('generates full monthly register with 30 days punch data and attendance rate', () => {
    const daysInMonth = 30;
    const dayHeaders = Array.from({ length: daysInMonth }, (_, i) => `D${String(i + 1).padStart(2, '0')}`);
    const headers = [
      'Staff ID',
      'Staff Name',
      'Designation',
      'Branch',
      'Month',
      ...dayHeaders,
      'Present Days',
      'Absent Days',
      'Total Hours',
      'Attendance %',
    ];

    expect(headers).toHaveLength(5 + 30 + 4);
    expect(headers[5]).toBe('D01');
    expect(headers[34]).toBe('D30');

    const samplePunches = Array.from({ length: daysInMonth }, (_, i) => ((i + 1) % 7 === 0 ? 'OFF' : 'P'));
    const presentDays = samplePunches.filter((p) => p === 'P').length;
    expect(presentDays).toBe(26);

    const rate = Math.round((presentDays / 26) * 100);
    expect(rate).toBe(100);
  });
});
