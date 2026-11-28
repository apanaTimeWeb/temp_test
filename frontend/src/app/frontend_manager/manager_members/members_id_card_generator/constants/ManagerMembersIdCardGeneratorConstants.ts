export const MANAGER_STUDENT_STATUS_ACTIVE = 'Active' as const;
export const MANAGER_STUDENT_STATUS_SUSPENDED = 'Suspended' as const;
export const MANAGER_STUDENT_STATUS_EXPIRED = 'Expired' as const;
export const MANAGER_STUDENT_STATUSES = [MANAGER_STUDENT_STATUS_ACTIVE, MANAGER_STUDENT_STATUS_SUSPENDED, MANAGER_STUDENT_STATUS_EXPIRED] as const;
export type ManagerStudentStatus = typeof MANAGER_STUDENT_STATUSES[number];

export const MANAGER_STUDENT_STATUS_OPTIONS = [
  { value: 'all' },
  ...MANAGER_STUDENT_STATUSES.map((value) => ({ value })),
] as const;

export const MANAGER_STUDENT_SHIFTS = ['Morning', 'Afternoon', 'Evening', 'Night', 'Full Day'] as const;
export const MANAGER_STUDENT_SHIFT_OPTIONS = [
  { value: 'all' },
  ...MANAGER_STUDENT_SHIFTS.map((value) => ({ value })),
] as const;

export const MANAGER_STUDENT_DEFAULT_CURRENCY = 'INR';
