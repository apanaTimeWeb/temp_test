import { useMemo } from 'react';
import { MANAGER_ENGAGEMENT_SAMPLE_ABSENTEES } from '@/app/frontend_manager/manager_attendance/attendance_daily/hooks/ManagerAttendanceDailyDemoRepository';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

/** Sample-only rows for layout and filter demonstrations; no server persistence is implied. */
export function useManagerAttendanceDemoData() {
  return useMemo(() => MANAGER_ENGAGEMENT_SAMPLE_ABSENTEES.map((row) => ({ ...row })), []);
}
