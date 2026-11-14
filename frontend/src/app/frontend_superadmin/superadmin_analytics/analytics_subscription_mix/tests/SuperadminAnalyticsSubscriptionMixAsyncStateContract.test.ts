// RESPONSIBILITY: Define source-level test coverage for analytics subscription mix using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_analytics/analytics_subscription_mix/tests/SuperadminAnalyticsSubscriptionMixAsyncStateContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const components = resolve(process.cwd(), 'src/app/frontend_superadmin/superadmin_analytics/analytics_subscription_mix/components');

describe('superadmin_analytics/analytics_subscription_mix async-state source contract', () => {
  it('uses an accessible, reduced-motion-safe skeleton with source-matched columns', () => {
    const source = readFileSync(resolve(components, 'SuperadminAnalyticsSubscriptionMixListSkeleton.tsx'), 'utf8');
    expect(source).toContain('role="status"');
    expect(source).toContain('aria-busy="true"');
    expect(source).toContain('motion-reduce:animate-none');
    expect(source).toContain('grid grid-flow-col auto-cols-fr');
    expect(source.match(/'column-\d+'/g)?.length).toBe(7);
  });
  it('provides a retry action and avoids raw exception rendering', () => {
    const source = readFileSync(resolve(components, 'SuperadminAnalyticsSubscriptionMixErrorFallback.tsx'), 'utf8');
    expect(source).toContain('role="alert"');
    expect(source).toContain('onClick={onRetry}');
    expect(source).toContain("typeof responseMessage === 'string'");
    expect(source).toContain('COPY.MODULE_ROUTE_ERROR_MESSAGE');
    expect(source).not.toContain('error.stack');
  });
});
