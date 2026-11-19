// RESPONSIBILITY: Define source-level test coverage for plans promotions using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_plans/plans_promotions/tests/SuperadminPlansPromotionsAsyncStateContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMPONENTS = resolve(__dirname, '../components');

describe('plans_promotions async-state contract', () => {
  it('uses an accessible reduced-motion-safe loading skeleton', () => {
    const source = readFileSync(resolve(COMPONENTS, 'SuperadminPlansPromotionsListSkeleton.tsx'), 'utf8');
    expect(source).toContain('role="status"');
    expect(source).toContain('aria-busy="true"');
    expect(source).toContain('motion-reduce:animate-none');
    expect(source).toContain('key={key}');
  });
  it('wires the localized empty state for a zero-row promotions list', () => {
    const page = readFileSync(resolve(COMPONENTS, 'SuperadminPlansPromotionsPageClient.tsx'), 'utf8');
    const emptyState = readFileSync(resolve(COMPONENTS, 'SuperadminPlansPromotionsEmptyState.tsx'), 'utf8');
    expect(page).toContain("import SuperadminPlansPromotionsEmptyState from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/components/SuperadminPlansPromotionsEmptyState'");
    expect(page).toContain('promos.length === 0 ? (');
    expect(page).toContain('<SuperadminPlansPromotionsEmptyState />');
    expect(emptyState).toContain("useTranslations('SUPERADMIN_BILLING')");
    expect(emptyState).toContain("COPY.TABLE_EMPTY");
    expect(emptyState).toContain('data-testid="superadmin-plans-promotions-empty-state"');
  });

  it('provides safe localized error recovery and wires route boundaries', () => {
    const fallback = readFileSync(resolve(COMPONENTS, 'SuperadminPlansPromotionsErrorFallback.tsx'), 'utf8');
    const loading = readFileSync(resolve(__dirname, '../loading.tsx'), 'utf8');
    const error = readFileSync(resolve(__dirname, '../error.tsx'), 'utf8');
    expect(fallback).toContain('role="alert"');
    expect(fallback).toContain('COPY.MODULE_ROUTE_ERROR_MESSAGE');
    expect(fallback).not.toContain('error.stack');
    expect(loading).toContain('SuperadminPlansPromotionsListSkeleton');
    expect(error).toContain('SuperadminPlansPromotionsErrorFallback');
    expect(error).not.toContain('...props');
  });
});
