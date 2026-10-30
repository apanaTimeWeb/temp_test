import { useState, type ReactNode } from 'react';
import { AdminMembersCouponsScenarioLabel, type AdminMembersCouponsScenario } from '@/app/frontend_admin/admin_members/members_coupons/tests/harness/bootstrap';
import type { AdminMembersCouponsHarnessProps } from '@/app/frontend_admin/admin_members/members_coupons/types/AdminMembersCouponsComponentTypes';


/** Test-only state harness that renders the named UI state rather than only tagging children. */
export function AdminMembersCouponsHarness({ children, scenario = 'ACTIVE' }: AdminMembersCouponsHarnessProps) {
  const [currentScenario, setCurrentScenario] = useState<AdminMembersCouponsScenario>(scenario);
  const retry = () => setCurrentScenario('ACTIVE');
  const label = AdminMembersCouponsScenarioLabel(currentScenario);
  if (currentScenario === 'ACTIVE') return <div data-testid="admin_members_coupons-harness" data-scenario={label}>{children}</div>;
  if (currentScenario === 'EMPTY') return <section data-testid="admin_members_coupons-scenario-empty" role="status" aria-label="Empty state"><p>No records are available in this scenario.</p></section>;
  if (currentScenario === 'UNAUTHORIZED') return <section data-testid="admin_members_coupons-scenario-unauthorized" role="alert"><h2>Access unavailable</h2><p>You are not authorized to view this sample state.</p></section>;
  const message = currentScenario === 'TIMEOUT' ? 'The simulated request timed out.' : 'The simulated server request failed.';
  return <section data-testid={`admin_members_coupons-scenario-${label}`} role="alert"><p>{message}</p><button type="button" className="min-h-11 rounded-md border border-border px-4 py-2 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={retry}>Retry scenario</button></section>;
}


export type { AdminMembersCouponsHarnessProps };
