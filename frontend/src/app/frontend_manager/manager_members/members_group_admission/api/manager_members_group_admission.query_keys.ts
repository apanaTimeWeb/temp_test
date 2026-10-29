export const MANAGER_STUDENTS_QUERY_KEYS = {
  all: ['manager_group_admission'] as const,
  list: () => [...MANAGER_STUDENTS_QUERY_KEYS.all, 'list'] as const,
  detail: (id: string) => [...MANAGER_STUDENTS_QUERY_KEYS.all, 'detail', id] as const,
} as const;
