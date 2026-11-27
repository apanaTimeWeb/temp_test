export const ADMIN_SEATS_SEAT_STATUS_BADGE_CLASS = {
  Working: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-success-text bg-success-bg text-success-text',
  Maintenance: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-warning-text bg-warning-bg text-warning-text',
  Broken: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-danger-text bg-danger-bg text-danger-text',
} as const;

export type AdminSeatsSeatStatus =
  keyof typeof ADMIN_SEATS_SEAT_STATUS_BADGE_CLASS;

/** Canonical status options used by form controls and filters; labels resolve through the feature locale catalog. */
export const ADMIN_SEATS_MANAGEMENT_STATUS_OPTIONS = [
  { value: 'Working', labelKey: 'working' },
  { value: 'Maintenance', labelKey: 'statusMaintenance' },
  { value: 'Broken', labelKey: 'broken' },
] as const;
