export const ADMIN_STAFF_PAYROLL_QUERY_KEYS = {
  all: ['admin_staff_payroll'] as const,
  lists: () => [...ADMIN_STAFF_PAYROLL_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...ADMIN_STAFF_PAYROLL_QUERY_KEYS.lists(), filters] as const,
  detail: (id: string) => [...ADMIN_STAFF_PAYROLL_QUERY_KEYS.all, 'detail', id] as const,
  slip: (id: string) => [...ADMIN_STAFF_PAYROLL_QUERY_KEYS.all, 'slip', id] as const,
};

