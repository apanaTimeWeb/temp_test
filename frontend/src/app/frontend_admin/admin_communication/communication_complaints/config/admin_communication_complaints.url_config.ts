

/**
 * Canonical UI/API contract for admin_communication_complaints.
 * UI routes are source-verified; API operations remain explicitly unverified unless stated below.
 */
export const ADMIN_COMMUNICATION_COMPLAINTS_ROUTES = {
  ROOT: '/admin/admin_communication/communication_complaints',
} as const;

export const ADMIN_COMMUNICATION_COMPLAINTS_API = {
  /** API-relative path is preserved from existing apiFetch call sites; backend behavior/authorization remain unverified. */
  COMPLAINTS: '/communication/complaints',
  NOTICES: '/communication/notices',
} as const;

/** Preserves the existing canonical route export without creating a re-export facade. */
export const ADMIN_COMMUNICATION_COMPLAINTS_CANONICAL_ROUTE = ADMIN_COMMUNICATION_COMPLAINTS_ROUTES.ROOT;

export const ADMIN_COMMUNICATION_COMPLAINT_STATUS = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
} as const;

export const ADMIN_COMMUNICATION_NOTICE_STATUS = {
  ACTIVE: "Active",
  EXPIRED: "Expired",
} as const;


export type AdminCommunicationComplaintStatus =
  | (typeof ADMIN_COMMUNICATION_COMPLAINT_STATUS)[keyof typeof ADMIN_COMMUNICATION_COMPLAINT_STATUS]
  | 'Unknown';

/** Maps source values onto UI statuses. Unknown values remain explicitly unknown. */
export function getAdminCommunicationComplaintStatus(status: string): AdminCommunicationComplaintStatus {
  const normalized = status.trim().toLowerCase().replace(/[\s_-]+/g, ' ');
  switch (normalized) {
    case 'open': return ADMIN_COMMUNICATION_COMPLAINT_STATUS.OPEN;
    case 'in progress': return ADMIN_COMMUNICATION_COMPLAINT_STATUS.IN_PROGRESS;
    case 'resolved': return ADMIN_COMMUNICATION_COMPLAINT_STATUS.RESOLVED;
    default: return 'Unknown';
  }
}
