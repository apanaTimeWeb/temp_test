export const ADMIN_STAFF_ATTENDANCE_QUERY_KEYS = {
  all: ['admin_staff_attendance'] as const,
  lists: () => [...ADMIN_STAFF_ATTENDANCE_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...ADMIN_STAFF_ATTENDANCE_QUERY_KEYS.lists(), filters] as const,
  roster: (branchId: string) => [...ADMIN_STAFF_ATTENDANCE_QUERY_KEYS.all, 'roster', branchId] as const,
  detail: (id: string) => [...ADMIN_STAFF_ATTENDANCE_QUERY_KEYS.all, 'detail', id] as const,
};

