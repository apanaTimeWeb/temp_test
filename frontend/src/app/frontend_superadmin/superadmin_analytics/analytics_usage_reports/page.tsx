// page.tsx
// RESPONSIBILITY: Server component route entry for Superadmin Usage Reports.
// FLOW: App Router -> analytics_usage_reports/page.tsx -> SuperadminAnalyticsUsageReportsMain

import { SuperadminAnalyticsUsageReportsMain } from '@/app/frontend_superadmin/superadmin_analytics/analytics_usage_reports/components/SuperadminAnalyticsUsageReportsMain';

export const metadata = {
  title: 'Usage Reports | Superadmin Analytics',
  description: 'Members, staff, branches, cloud storage, API volume, and SMS/WhatsApp consumption reports',
};

export default function SuperadminAnalyticsUsageReportsPage() {
  return (
    <div
      className="w-full max-w-full min-w-0"
      data-feature-module="superadmin_analytics"
      data-feature-route="analytics_usage_reports"
    >
      <SuperadminAnalyticsUsageReportsMain />
    </div>
  );
}
