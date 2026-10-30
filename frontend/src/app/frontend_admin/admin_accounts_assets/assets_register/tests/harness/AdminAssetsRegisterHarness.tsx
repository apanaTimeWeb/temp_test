'use client';
import { useState, type ReactNode } from 'react';

import { type AdminAssetsRegisterScenario } from '@/app/frontend_admin/admin_accounts_assets/assets_register/tests/harness/bootstrap';
import type { AdminAssetsRegisterHarnessProps } from '@/app/frontend_admin/admin_accounts_assets/assets_register/types/AdminAssetsRegisterComponentTypes';


/** Deterministic test-only UI states; retry transitions the fixture back to its active state. */
export function AdminAssetsRegisterHarness({ children, scenario = 'ACTIVE' }: AdminAssetsRegisterHarnessProps) {
  const [isRecovered, setIsRecovered] = useState(false);
  if (scenario === 'ACTIVE' || isRecovered) return <div data-testid="admin_assets_register-harness" data-scenario="active">{children}</div>;
  if (scenario === 'EMPTY') return <section data-testid="admin_assets_register-harness" data-scenario="empty" role="status"><h2>No assets</h2><p>The current test state contains no asset rows.</p></section>;
  if (scenario === 'UNAUTHORIZED') return <section data-testid="admin_assets_register-harness" data-scenario="unauthorized" role="alert"><h2>Access unavailable</h2><p>This scenario represents a simulated permission-denied state.</p></section>;
  const isTimeout = scenario === 'TIMEOUT';
  return <section data-testid="admin_assets_register-harness" data-scenario={isTimeout ? 'timeout' : 'server-error'} role="alert"><h2>{isTimeout ? 'Request timed out' : 'Assets unavailable'}</h2><p>{isTimeout ? 'This is a simulated timeout state, not a live API result.' : 'This scenario represents a simulated server failure.'}</p><button type="button" onClick={() => setIsRecovered(true)} className="min-h-11">Retry fixture</button></section>;
}


export type { AdminAssetsRegisterHarnessProps };
