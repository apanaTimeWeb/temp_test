import { describe, expect, it } from 'vitest';
import { managerEngagementLocalDraftSchema } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/types/ManagerAttendanceAbsenteeReportLocalDraft';

describe('ManagerAttendanceAbsenteeReportLocalDraft', () => {
  it('trims and validates a usable local draft without implying delivery or persistence', () => {
    expect(managerEngagementLocalDraftSchema.parse({ title: '  Draft  ', message: '  Not sent  ' })).toEqual({ title: 'Draft', message: 'Not sent' });
  });
  it('rejects blank title/message and unexpected fields', () => {
    expect(managerEngagementLocalDraftSchema.safeParse({ title: ' ', message: 'body' }).success).toBe(false);
    expect(managerEngagementLocalDraftSchema.safeParse({ title: 'title', message: ' ' }).success).toBe(false);
    expect(managerEngagementLocalDraftSchema.safeParse({ title: 'title', message: 'body', persisted: true }).success).toBe(false);
  });
});
