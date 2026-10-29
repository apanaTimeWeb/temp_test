/** Canonical URL contract for the manager members-enquiries leaf module. */
const ROOT = '/frontend_manager/manager_members/members_enquiries' as const;
const API_ROOT = '/crm/enquiries' as const;
const managerMembersEnquiriesView = (view: string, params: Record<string, string> = {}) =>
  `${ROOT}?${new URLSearchParams({ view, ...params }).toString()}` as const;

export const MANAGER_MEMBERS_ENQUIRIES_ROUTES = {
  root: ROOT,
  ROOT,
  LIST: managerMembersEnquiriesView('enquiries'),
  ADD: managerMembersEnquiriesView('add'),
  DETAIL: (id: string) => managerMembersEnquiriesView('detail', { id }),
  /** This route carries no name/phone PII in the URL. */
  ADMISSION_CONVERSION: () => '/frontend_manager/manager_members/members_new_admission',
} as const;

/** Existing source-backed API-relative paths only; write operations remain fail-closed. */
export const MANAGER_MEMBERS_ENQUIRIES_API = {
  LIST: API_ROOT,
  DETAIL: (id: string) => `${API_ROOT}/${encodeURIComponent(id)}`,
} as const;
