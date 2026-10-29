import { describe, expect, it } from 'vitest';
import { MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE } from '@/app/frontend_manager/manager_attendance/attendance_daily/hooks/ManagerAttendanceDailyDemoRepository';
import { MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE as FIXTURE_SOURCE } from '@/app/frontend_manager/manager_attendance/attendance_daily/mocks/manager_attendance_daily_fixtures/ManagerAttendanceDailySampleFixtures';

describe('ManagerAttendanceDailyDemoRepository', () => {
  it('returns a defensive sample snapshot rather than aliasing fixture objects', () => {
    expect(MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE).not.toBe(FIXTURE_SOURCE);
    expect(MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE[0]).not.toBe(FIXTURE_SOURCE[0]);
    expect(MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE[0]).toEqual(FIXTURE_SOURCE[0]);
  });
});
