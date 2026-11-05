/** Canonical route/API contract for manager branch information. */
export const MANAGER_SETTINGS_BRANCH_INFO_ROUTES = { root: '/frontend_manager/manager_settings/settings_branch_info' } as const;

export const MANAGER_SETTINGS_BRANCH_INFO_API = {
  GET_INFO: '/api/v1/manager/settings/branch-info' as const,
  UPDATE_INFO: '/api/v1/manager/settings/branch-info' as const,
} as const;
