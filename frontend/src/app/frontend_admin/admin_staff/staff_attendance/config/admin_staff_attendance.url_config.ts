import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

export const ADMIN_STAFF_ATTENDANCE_ROUTES = {
  INDEX: (ADMIN_ROUTES as any).STAFF_ATTENDANCE ?? '/admin/admin_staff/staff_attendance',
} as const;

export const ADMIN_STAFF_ATTENDANCE_API = {
  LIST: '/api/v1/admin/staff_attendance',
  ROSTER: '/api/v1/admin/staff_attendance/roster',
  REGULARIZE: '/api/v1/admin/staff_attendance/regularize',
} as const;

export const ADMIN_STAFF_SHIFTS = [
  { id: 'shift-morning', name: 'Morning Shift', timing: '07:00 AM - 03:00 PM', code: 'MORNING' },
  { id: 'shift-evening', name: 'Evening Shift', timing: '03:00 PM - 11:00 PM', code: 'EVENING' },
  { id: 'shift-night', name: 'Night Shift', timing: '11:00 PM - 07:00 AM', code: 'NIGHT' },
] as const;

export const ATTENDANCE_STATUS_VARIANTS = {
  PRESENT: 'bg-success-bg text-success-text border-success-border',
  LATE: 'bg-warning-bg text-warning-text border-warning-border',
  ABSENT: 'bg-danger-bg text-danger-text border-danger-border',
  ON_LEAVE: 'bg-surface-highlight text-text-secondary border-border',
} as const;

