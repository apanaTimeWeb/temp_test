/** Canonical route and fail-closed API contract for the manager members directory. */
export const MANAGER_MEMBERS_DIRECTORY_ROUTES = {
  root: '/frontend_manager/manager_members/members_directory',
  newAdmission: '/frontend_manager/manager_members/members_new_admission',
  membershipRenewal: '/frontend_manager/manager_finance/finance_renewals',
  memberDocuments: '/frontend_manager/manager_members/members_document_vault',
} as const;

/** No authoritative directory API endpoint was supplied. */
export const MANAGER_MEMBERS_DIRECTORY_API = {} as const;

