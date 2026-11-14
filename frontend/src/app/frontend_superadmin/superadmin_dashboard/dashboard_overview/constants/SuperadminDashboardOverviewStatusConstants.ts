// FLOW: Feature consumers -> superadmin_dashboard/dashboard_overview/constants/SuperadminDashboardOverviewStatusConstants.ts -> typed constants -> component/hook/config behavior.
/** Responsibility: Superadmin Dashboard Status Constants; centralizes stable module-owned options and configuration. */
export const SUPERADMIN_DASHBOARD_LIBRARY_STATUS_CONFIG = {
  active:   { labelKey: 'COPY.ACTIVE',    cls: 'sa-badge--success' },
  setup:    { labelKey: 'COPY.SETUP_DUE', cls: 'sa-badge--warning' },
  inactive: { labelKey: 'COPY.INACTIVE',  cls: 'sa-badge--danger' },
};
