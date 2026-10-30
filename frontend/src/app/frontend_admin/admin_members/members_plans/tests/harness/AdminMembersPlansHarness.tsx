/** Standalone scenario harness for the members-plans module; this is not the production page. */
'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { AdminMembersPlansScenarioLabel, type AdminMembersPlansScenario } from '@/app/frontend_admin/admin_members/members_plans/tests/harness/bootstrap';
import type { AdminMembersPlansHarnessProps } from '@/app/frontend_admin/admin_members/members_plans/types/AdminMembersPlansComponentTypes';


export default function AdminMembersPlansHarness({ children, scenario = 'ACTIVE' }: AdminMembersPlansHarnessProps) {
  const [currentScenario, setCurrentScenario] = useState<AdminMembersPlansScenario>(scenario);
  const retry = () => setCurrentScenario('ACTIVE');
  const label = AdminMembersPlansScenarioLabel(currentScenario);
  if (currentScenario === 'ACTIVE') return <div data-testid="admin_members_plans-harness" data-scenario={label}>{children}</div>;
  if (currentScenario === 'EMPTY') return <section data-testid="admin_members_plans-scenario-empty" role="status"><p>No records are available in this scenario.</p></section>;
  if (currentScenario === 'UNAUTHORIZED') return <section data-testid="admin_members_plans-scenario-unauthorized" role="alert"><h2>Access unavailable</h2><p>This simulated state is not authorized.</p></section>;
  const message = currentScenario === 'TIMEOUT' ? 'The simulated request timed out.' : 'The simulated server request failed.';
  return <section data-testid={`admin_members_plans-scenario-${label}`} role="alert"><p>{message}</p><button type="button" className="min-h-11 rounded-md border border-border px-4 py-2 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={retry}>Retry scenario</button></section>;
}


export type { AdminMembersPlansHarnessProps };
