// RESPONSIBILITY: Define source-level test coverage for system backup overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_system/system_backup_overview/tests/SuperadminBackupOverviewCreateFlowHarness.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import type { ReactNode } from 'react';

/** Minimal feature-local harness boundary for host-provided providers. */
export function SuperadminBackupOverviewCreateFlowHarness({ children }: { children: ReactNode }) { return <div data-testid="superadmin_system_backup_overview-backup_create_flow-harness">{children}</div>; }
