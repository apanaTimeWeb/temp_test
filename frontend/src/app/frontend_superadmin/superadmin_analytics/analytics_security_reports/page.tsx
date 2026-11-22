// page.tsx
// RESPONSIBILITY: Server component route entry for Superadmin Security Reports.
// FLOW: App Router -> analytics_security_reports/page.tsx -> SuperadminAnalyticsSecurityReportsMain

import { SuperadminAnalyticsSecurityReportsMain } from './components/SuperadminAnalyticsSecurityReportsMain';

export const metadata = {
  title: 'Security Reports | Superadmin Analytics',
  description: 'Login history, failed logins, locked accounts, permission changes, exports, and suspicious activities',
};

export default function SuperadminAnalyticsSecurityReportsPage() {
  return (
    <div
      className="w-full max-w-full min-w-0"
      data-feature-module="superadmin_analytics"
      data-feature-route="analytics_security_reports"
    >
      <SuperadminAnalyticsSecurityReportsMain />
    </div>
  );
}
