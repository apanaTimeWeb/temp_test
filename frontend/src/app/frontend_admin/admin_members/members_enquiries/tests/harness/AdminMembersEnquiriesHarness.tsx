import { useState, type ReactNode } from 'react';
import { AdminMembersEnquiriesScenarioLabel, type AdminMembersEnquiriesScenario } from '@/app/frontend_admin/admin_members/members_enquiries/tests/harness/bootstrap';
import type { AdminMembersEnquiriesHarnessProps } from '@/app/frontend_admin/admin_members/members_enquiries/types/AdminMembersEnquiriesComponentTypes';


/** Test-only state harness that renders the named UI state rather than only tagging children. */
export function AdminMembersEnquiriesHarness({ children, scenario = 'ACTIVE' }: AdminMembersEnquiriesHarnessProps) {
  const [currentScenario, setCurrentScenario] = useState<AdminMembersEnquiriesScenario>(scenario);
  const retry = () => setCurrentScenario('ACTIVE');
  const label = AdminMembersEnquiriesScenarioLabel(currentScenario);
  if (currentScenario === 'ACTIVE') return <div data-testid="admin_members_enquiries-harness" data-scenario={label}>{children}</div>;
  if (currentScenario === 'EMPTY') return <section data-testid="admin_members_enquiries-scenario-empty" role="status" aria-label="Empty state"><p>No records are available in this scenario.</p></section>;
  if (currentScenario === 'UNAUTHORIZED') return <section data-testid="admin_members_enquiries-scenario-unauthorized" role="alert"><h2>Access unavailable</h2><p>You are not authorized to view this sample state.</p></section>;
  const message = currentScenario === 'TIMEOUT' ? 'The simulated request timed out.' : 'The simulated server request failed.';
  return <section data-testid={`admin_members_enquiries-scenario-${label}`} role="alert"><p>{message}</p><button type="button" className="min-h-11 rounded-md border border-border px-4 py-2 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={retry}>Retry scenario</button></section>;
}


export type { AdminMembersEnquiriesHarnessProps };
