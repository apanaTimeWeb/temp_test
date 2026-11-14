// FLOW: Feature preview/test -> superadmin_billing/billing_member_payments_collection/mocks/fixtures/SuperadminBillingOverviewMemberPaymentsCollectionMockStudents.ts -> typed local fixtures -> screen rendering or assertions.
/** Responsibility: Superadmin Finance Mock Students; supplies module-owned mock fixtures or handler behavior only. */
export const SUPERADMIN_FINANCE_MOCK_STUDENTS = [
  { id: 1, name: 'Sample Student A',  smartId: 'STU001', phone: '0000000000', status: 'active',    dueAmount: 0,    plan: 'Premium Plan', shift: 'Morning', seat: 'A-01' },
  { id: 2, name: 'Sample Student B',   smartId: 'STU002', phone: '0000000000', status: 'active',    dueAmount: 1800, plan: 'Basic Plan',   shift: 'Evening', seat: 'B-05' },
  { id: 3, name: 'Sample Student C',   smartId: 'STU003', phone: '0000000000', status: 'expired',   dueAmount: 4000, plan: 'Premium Plan', shift: 'Night',   seat: 'C-12' },
  { id: 4, name: 'Sample Student D',   smartId: 'STU004', phone: '0000000000', status: 'suspended', dueAmount: 4500, plan: 'Basic Plan',   shift: 'Morning', seat: 'A-08' },
  { id: 5, name: 'Sample Student E',    smartId: 'STU005', phone: '0000000000', status: 'active',    dueAmount: 0,    plan: 'Elite Plan',   shift: 'Full Day','seat': 'D-03' },
  { id: 6, name: 'Sample Student F',  smartId: 'STU006', phone: '0000000000', status: 'active',    dueAmount: 0,    plan: 'Basic Plan',   shift: 'Evening', seat: 'B-10' },
] as const;
