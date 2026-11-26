// page.tsx
// RESPONSIBILITY: Server component route entry for Superadmin Billing Reports.
// FLOW: App Router -> analytics_billing_reports/page.tsx -> SuperadminAnalyticsBillingReportsMain

import { SuperadminAnalyticsBillingReportsMain } from '@/app/frontend_superadmin/superadmin_analytics/analytics_billing_reports/components/SuperadminAnalyticsBillingReportsMain';

export const metadata = {
  title: 'Billing Reports | Superadmin Analytics',
  description: 'Revenue, MRR, ARR, pending invoices, failed payments, refunds, and plan-wise income reports',
};

export default function SuperadminAnalyticsBillingReportsPage() {
  return (
    <div
      className="w-full max-w-full min-w-0"
      data-feature-module="superadmin_analytics"
      data-feature-route="analytics_billing_reports"
    >
      <SuperadminAnalyticsBillingReportsMain />
    </div>
  );
}
