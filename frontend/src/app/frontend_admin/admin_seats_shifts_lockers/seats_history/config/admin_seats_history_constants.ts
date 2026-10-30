export const ADMIN_SEATS_STATUS = {
  FREE: "free",
  OCCUPIED: "occupied",
  EXPIRING: "expiring",
  MAINTENANCE: "maintenance",
} as const;

export const ADMIN_SEATS_SHIFTS = ["All", "Morning", "Evening", "Full Day"] as const;
export const ADMIN_SEATS_SEAT_STATUS_BADGE_CLASS = {
  Working: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-success-text bg-success-bg text-success-text',
  Maintenance: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-warning-text bg-warning-bg text-warning-text',
  Broken: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-danger-text bg-danger-bg text-danger-text',
} as const;

export type AdminSeatsSeatStatus =
  keyof typeof ADMIN_SEATS_SEAT_STATUS_BADGE_CLASS;

export const ADMIN_SEATS_LOCKER_STATUS_BADGE_CLASS = {
  Free: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-success-text bg-success-bg text-success-text',
  Occupied: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-danger-text bg-danger-bg text-danger-text',
  Maintenance: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-warning-text bg-warning-bg text-warning-text',
} as const;

export const ADMIN_SEATS_ALLOCATION_STATUS_BADGE_CLASS = {
  Active: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-success-text bg-success-bg text-success-text',
  Expired: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-danger-text bg-danger-bg text-danger-text',
  Suspended: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-warning-text bg-warning-bg text-warning-text',
} as const;

export const ADMIN_SEATS_ALLOCATION_FEE_STATUS_BADGE_CLASS = {
  Paid: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-success-text bg-success-bg text-success-text',
  Due: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-danger-text bg-danger-bg text-danger-text',
} as const;

export const ADMIN_SEATS_SHIFT_BADGE_CLASS = {
  Morning: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-primary bg-primary-subtle text-primary',
  Evening: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-success-text bg-success-bg text-success-text',
  'Full Day': 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-info-text bg-info-bg text-info-text',
} as const;

export const ADMIN_SEATS_SEAT_HISTORY_REASON_BADGE_CLASS = {
  Admission: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-success-text bg-success-bg text-success-text',
  'Shift Change': 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-info-text bg-info-bg text-info-text',
  'Seat Change': 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-warning-text bg-warning-bg text-warning-text',
} as const;

export const ADMIN_SEATS_SEAT_OCCUPANCY_STATUS_BADGE_CLASS = {
  free: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-success-text bg-success-bg text-success-text',
  occupied: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-danger-text bg-danger-bg text-danger-text',
  expiring: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-warning-text bg-warning-bg text-warning-text',
  maintenance: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-warning-text bg-warning-bg text-warning-text',
  unknown: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-border bg-surface-highlight text-text-secondary',
} as const;


/** Canonical status options used by form controls and filters; labels resolve through the feature locale catalog. */
export const ADMIN_SEATS_SEAT_MANAGEMENT_STATUS_OPTIONS = [
  { value: 'Working', labelKey: 'working' },
  { value: 'Maintenance', labelKey: 'statusMaintenance' },
  { value: 'Broken', labelKey: 'broken' },
] as const;

export const ADMIN_SEATS_LOCKER_STATUS_OPTIONS = [
  { value: 'Free', labelKey: 'statusFree' },
  { value: 'Occupied', labelKey: 'statusOccupied' },
  { value: 'Maintenance', labelKey: 'statusMaintenance' },
] as const;

export const ADMIN_SEATS_ALLOCATION_STATUS_OPTIONS = [
  { value: 'Active', labelKey: 'active' },
  { value: 'Expired', labelKey: 'expired' },
  { value: 'Suspended', labelKey: 'suspended' },
] as const;
