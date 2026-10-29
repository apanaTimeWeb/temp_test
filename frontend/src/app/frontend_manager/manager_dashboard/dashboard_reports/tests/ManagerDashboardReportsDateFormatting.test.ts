import { describe, expect, it } from 'vitest';
import { formatManagerReportsCalendarDate, formatManagerReportsMonth } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/utils/ManagerDashboardReportsDateFormatting';

describe('ManagerDashboardReportsDateFormatting', () => {
  it('formats date-only values using local calendar semantics', () => {
    expect(formatManagerReportsCalendarDate('2026-10-17', 'en-GB')).toContain('17');
    expect(formatManagerReportsCalendarDate('not-a-date', 'en-GB')).toBe('not-a-date');
  });
  it('formats year-month labels and preserves invalid values', () => {
    expect(formatManagerReportsMonth('2026-10', 'en-GB')).toContain('Oct');
    expect(formatManagerReportsMonth('2026-13', 'en-GB')).toBe('2026-13');
  });
});
