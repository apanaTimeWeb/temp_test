// RESPONSIBILITY: Define source-level test coverage for billing member payments using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_member_payments/tests/harness/bootstrap.ts -> module-local test harness/fixtures -> assertions and regression evidence.
/** Canonical autonomous harness entrypoint; delegates to the existing workflow bootstrap. */
export * from './SuperadminBillingOverviewMemberPaymentsWorkflowBootstrap';
