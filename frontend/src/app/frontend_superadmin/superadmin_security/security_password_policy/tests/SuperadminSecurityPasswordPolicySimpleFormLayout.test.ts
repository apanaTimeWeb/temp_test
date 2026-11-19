// RESPONSIBILITY: Guard the password-policy simple-form geometry rule at the owning feature boundary.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(resolve(here, '../components/SuperadminSecurityPasswordPolicyPolicyPanels.tsx'), 'utf8');

describe('security_password_policy simple form layout', () => {
  it('keeps the policy form layout organized and responsive', () => {
    expect(source).toContain('space-y-4');
    expect(source).toContain('grid grid-cols-1 sm:grid-cols-2');
  });
});
