// api/superadmin_data_overview.query_keys.ts
// Factory for Superadmin Data Overview query keys

export const SUPERADMIN_DATA_OVERVIEW_QUERY_KEYS = {
  all: ['superadmin_data_overview'] as const,
  metrics: () => [...SUPERADMIN_DATA_OVERVIEW_QUERY_KEYS.all, 'metrics'] as const,
  rpoRto: () => [...SUPERADMIN_DATA_OVERVIEW_QUERY_KEYS.all, 'rpo_rto'] as const,
  activity: () => [...SUPERADMIN_DATA_OVERVIEW_QUERY_KEYS.all, 'activity'] as const,
  storage: () => [...SUPERADMIN_DATA_OVERVIEW_QUERY_KEYS.all, 'storage'] as const,
};
