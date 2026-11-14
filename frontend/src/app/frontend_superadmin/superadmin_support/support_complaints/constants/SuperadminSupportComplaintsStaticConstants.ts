// RESPONSIBILITY: Own the canonical complaint status vocabulary and status-filter options.
// FLOW: Complaint types, API normalization and UI filters -> this leaf-owned registry.
export const SUPERADMIN_SUPPORT_COMPLAINT_STATUS = Object.freeze({
  OPEN: 'Open',
  IN_PROGRESS: 'In-Progress',
  RESOLVED: 'Resolved',
  UNKNOWN: 'Unknown',
} as const);

export const SUPERADMIN_SUPPORT_COMPLAINT_STATUS_FILTERS = [
  'All',
  SUPERADMIN_SUPPORT_COMPLAINT_STATUS.OPEN,
  SUPERADMIN_SUPPORT_COMPLAINT_STATUS.IN_PROGRESS,
  SUPERADMIN_SUPPORT_COMPLAINT_STATUS.RESOLVED,
] as const;
