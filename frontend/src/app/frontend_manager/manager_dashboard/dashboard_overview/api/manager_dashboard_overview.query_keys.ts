export const MANAGER_DASHBOARD_QUERY_KEYS = {
  all: ['manager_dashboard'] as const,
  overview: () => [...MANAGER_DASHBOARD_QUERY_KEYS.all, 'overview'] as const,
};
