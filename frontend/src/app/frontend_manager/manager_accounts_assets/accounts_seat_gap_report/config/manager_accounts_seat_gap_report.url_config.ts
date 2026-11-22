/** Canonical route configuration owned by manager accounts_seat_gap_report. */
const ROOT = '/frontend_manager/manager_accounts_assets/accounts_seat_gap_report' as const;

export const MANAGER_ACCOUNTS_SEAT_GAP_REPORT_ROUTES = { root: ROOT } as const;

export const MANAGER_ACCOUNTS_SEAT_GAP_REPORT_API = {
  LIST: '/api/v1/manager/accounts/seat-gap-report' as const,
  EXPORT_CSV: '/api/v1/manager/accounts/seat-gap-report/export-csv' as const,
} as const;
