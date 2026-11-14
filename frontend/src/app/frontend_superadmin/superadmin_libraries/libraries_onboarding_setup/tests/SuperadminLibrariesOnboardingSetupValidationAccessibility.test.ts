import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const step1 = readFileSync(new URL('../components/SuperadminLibrariesOnboardingSetupStep1Form.tsx', import.meta.url), 'utf8');
const step3 = readFileSync(new URL('../components/SuperadminLibrariesOnboardingSetupStep3Form.tsx', import.meta.url), 'utf8');

describe('onboarding validation accessibility contracts', () => {
  it('connects Step 1 name, address and city errors to their controls', () => {
    for (const field of ['name', 'address', 'city']) {
      expect(step1).toContain(`aria-describedby={errors.${field} ? 'step1-${field}-error' : undefined}`);
      expect(step1).toContain(`id="step1-${field}-error" role="alert"`);
    }
    expect(step1).toContain('aria-invalid={Boolean(errors.name)}');
    expect(step1).toContain('aria-invalid={Boolean(errors.address)}');
    expect(step1).toContain('aria-invalid={Boolean(errors.city)}');
  });

  it('connects Step 3 seat-count and prefix errors to their controls', () => {
    for (const field of ['count', 'prefix']) {
      expect(step3).toContain(`aria-describedby={errors.${field} ? 'step3-${field}-error' : undefined}`);
      expect(step3).toContain(`id="step3-${field}-error" role="alert"`);
      expect(step3).toContain(`aria-invalid={Boolean(errors.${field})}`);
    }
  });
});
