// RESPONSIBILITY: Guard App Router ownership of this leaf's URL-backed filter and pagination state.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const hook = readFileSync(new URL('../hooks/useSuperadminSecurityUserSessionsSemanticTableState.ts', import.meta.url), 'utf8');

describe('security_user_sessions URL state contract', () => {
  it('uses Next App Router navigation and preserves unrelated query keys', () => {
    expect(hook).toContain("from 'next/navigation'");
    expect(hook).toContain('useSearchParams');
    expect(hook).toContain('usePathname');
    expect(hook).toContain('useRouter');
    expect(hook).toContain('router.replace');
    expect(hook).toContain('new URLSearchParams(queryString)');
    expect(hook).not.toContain('window.location');
    expect(hook).not.toContain('window.history');
  });
});
