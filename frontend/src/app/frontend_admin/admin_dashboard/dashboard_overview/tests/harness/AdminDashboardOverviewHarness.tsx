import type { ReactNode } from 'react';

/** Minimal host-neutral wrapper for focused route tests. */
export default function AdminDashboardOverviewHarness({ children }: { children: ReactNode }) {
  return <div data-testid="admin-dashboard-dashboard-overview-harness">{children}</div>;
}
