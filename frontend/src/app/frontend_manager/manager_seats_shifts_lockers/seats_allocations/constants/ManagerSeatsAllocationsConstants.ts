export const SHIFT_TABS = [
  { value: 'All', labelKey: 'shift_tab_all' },
  { value: 'Morning', labelKey: 'shift_tab_morning' },
  { value: 'Evening', labelKey: 'shift_tab_evening' },
  { value: 'Full Day', labelKey: 'shift_tab_full_day' },
] as const;

export const LEGEND_ITEMS = [
  { cls: 'ss-legend-dot--success', labelKey: 'legend_free' },
  { cls: 'ss-legend-dot--danger', labelKey: 'legend_occupied' },
  { cls: 'ss-legend-dot--warning', labelKey: 'legend_expiring_within_7_days' },
  { cls: 'ss-legend-dot--maintenance', labelKey: 'legend_maintenance' },
] as const;

export const SHIFT_BADGE: Record<string, string> = {
  Morning:  'ss-badge ss-badge--primary',
  Evening:  'ss-badge ss-badge--success',
  'Full Day':'ss-badge ss-badge--info',
};

export const MANAGER_SEATS_ALLOCATIONS_ALLOCATION_STATUS_CLASSES: Record<string, string> = {
  Active: 'ss-badge ss-badge--success',
  Expired: 'ss-badge ss-badge--danger',
  Suspended: 'ss-badge ss-badge--warning',
};

export const MANAGER_SEATS_ALLOCATIONS_HISTORY_REASON_CLASSES: Record<string, string> = {
  Admission: 'ss-badge ss-badge--success',
  'Shift Change': 'ss-badge ss-badge--info',
  'Seat Change': 'ss-badge ss-badge--warning',
};
