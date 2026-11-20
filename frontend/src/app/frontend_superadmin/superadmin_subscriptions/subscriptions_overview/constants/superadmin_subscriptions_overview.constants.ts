// RESPONSIBILITY: Constants for SuperAdmin Subscriptions Overview module.

export const SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_CONSTANTS = Object.freeze({
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_GRACE_PERIOD_DAYS: 7,
  MAX_GRACE_PERIOD_DAYS: 30,
  AUTO_RETRY_WINDOW_HOURS: 72,
  MAX_FAILED_RETRIES: 3,
  STATUS_LABELS: {
    ACTIVE: 'Active',
    TRIAL: 'Trial',
    PAST_DUE: 'Past Due',
    GRACE_PERIOD: 'Grace Period',
    SUSPENDED: 'Suspended',
    CANCELLED: 'Cancelled',
    EXPIRED: 'Expired',
  },
});
