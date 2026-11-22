// RESPONSIBILITY: Guard App Router ownership of this leaf's URL-backed filter and pagination state.
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const hook = readFileSync(resolve(__dirname, '../hooks/useSuperadminSecurityUserSessionsSemanticTableState.ts'), 'utf8');

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
