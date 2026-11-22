'use client';
// RESPONSIBILITY: Render layout boundary for Superadmin System Health & Monitoring.
// FLOW: Domain route -> superadmin_system/layout.tsx -> children.
// STRICT ALIGNMENT: Module 15 ("Server, database, API, queue, error aur uptime monitoring").
// Note: Category filtering is autonomously owned by SuperadminSystemHealthOverviewDashboardSections
// without duplicate stacked navigation bars.

import type { ReactNode } from 'react';

export default function SystemHealthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-full min-w-0 p-0">
      <div className="w-full max-w-full min-w-0">{children}</div>
    </div>
  );
}
