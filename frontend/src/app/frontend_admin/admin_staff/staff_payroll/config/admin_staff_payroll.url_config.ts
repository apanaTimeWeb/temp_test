import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

export const ADMIN_STAFF_PAYROLL_ROUTES = {
  INDEX: (ADMIN_ROUTES as any).STAFF_PAYROLL ?? '/admin/admin_staff/staff_payroll',
} as const;

export const ADMIN_STAFF_PAYROLL_API = {
  LIST: '/api/v1/admin/staff_payroll',
  DISBURSE: '/api/v1/admin/staff_payroll/disburse',
  SLIP: (id: string) => `/api/v1/admin/staff_payroll/${id}/slip`,
} as const;

export const PAYROLL_STATUS_VARIANTS = {
  DISBURSED: 'bg-success-bg text-success-text border-success-border',
  PENDING: 'bg-warning-bg text-warning-text border-warning-border',
  ON_HOLD: 'bg-surface-highlight text-text-secondary border-border',
} as const;

export const PAYROLL_MONTHS = [
  { id: '2026-11', label: 'November 2026' },
  { id: '2026-10', label: 'October 2026' },
  { id: '2026-09', label: 'September 2026' },
] as const;

