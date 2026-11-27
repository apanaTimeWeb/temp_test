// page.tsx
// RESPONSIBILITY: Server component route entry for Superadmin Platform Reports.
// FLOW: App Router -> analytics_platform_reports/page.tsx -> SuperadminAnalyticsPlatformReportsMain

import { SuperadminAnalyticsPlatformReportsMain } from '@/app/frontend_superadmin/superadmin_analytics/analytics_platform_reports/components/SuperadminAnalyticsPlatformReportsMain';

export const metadata = {
  title: 'Platform Reports | Superadmin Analytics',
  description: 'Total libraries, branches, active accounts, growth velocity, and account creation reports',
};

export default function SuperadminAnalyticsPlatformReportsPage() {
  return (
    <div
      className="w-full max-w-full min-w-0"
      data-feature-module="superadmin_analytics"
      data-feature-route="analytics_platform_reports"
    >
      <SuperadminAnalyticsPlatformReportsMain />
    </div>
  );
}
