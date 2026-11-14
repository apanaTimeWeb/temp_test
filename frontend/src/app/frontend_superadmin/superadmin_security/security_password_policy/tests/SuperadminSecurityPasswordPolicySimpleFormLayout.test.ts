// RESPONSIBILITY: Guard the password-policy simple-form geometry rule at the owning feature boundary.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('../components/SuperadminSecurityPasswordPolicyPolicyPanels.tsx', import.meta.url), 'utf8');

describe('security_password_policy simple form layout', () => {
  it('keeps the four-control policy group in one column', () => {
    expect(source).toContain('grid grid-cols-1 gap-6');
    expect(source).not.toContain('grid grid-cols-2');
  });
});
