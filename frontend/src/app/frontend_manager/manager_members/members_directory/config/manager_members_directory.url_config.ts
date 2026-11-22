/** Canonical route and API contract for the manager members directory. */
export const MANAGER_MEMBERS_DIRECTORY_ROUTES = {
  root: '/frontend_manager/manager_members/members_directory',
  newAdmission: '/frontend_manager/manager_members/members_new_admission',
  membershipRenewal: '/frontend_manager/manager_finance/finance_renewals',
  memberDocuments: '/frontend_manager/manager_members/members_new_admission',
} as const;

export const MANAGER_MEMBERS_DIRECTORY_API = {
  LIST: '/api/v1/manager/members/directory' as const,
  DETAIL: (id: string) => `/api/v1/manager/members/directory/${encodeURIComponent(id)}` as const,
  UPDATE_STATUS: (id: string) => `/api/v1/manager/members/directory/${encodeURIComponent(id)}/status` as const,
  EXPORT_CSV: '/api/v1/manager/members/directory/export-csv' as const,
} as const;
