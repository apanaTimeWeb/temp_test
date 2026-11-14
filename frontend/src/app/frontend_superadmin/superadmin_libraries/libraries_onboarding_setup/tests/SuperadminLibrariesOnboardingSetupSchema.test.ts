// RESPONSIBILITY: Define source-level test coverage for libraries onboarding setup using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_onboarding_setup/tests/SuperadminLibrariesOnboardingSetupSchema.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { branchDetailsSchema, shiftsSchema, seatsSchema, plansSchema } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/schemas/SuperadminLibrariesOnboardingSetupSchema';

describe('SuperadminSetupWizardSchema', () => {
  it('validates branch details', () => {
    expect(branchDetailsSchema.safeParse({ name: 'Sample Library', address: 'Sample street 123', city: 'Lucknow', gst: '' }).success).toBe(true);
    expect(branchDetailsSchema.safeParse({ name: 'A', address: '', city: '' }).success).toBe(false);
  });
  it('requires at least one shift', () => {
    expect(shiftsSchema.safeParse({ shifts: [] }).success).toBe(false);
    expect(shiftsSchema.safeParse({ shifts: [{ name: 'Morning', start: '06:00', end: '14:00' }] }).success).toBe(true);
    expect(shiftsSchema.safeParse({ shifts: [{ name: 'Malformed', start: '99:99', end: '14:00' }] }).success).toBe(false);
    expect(shiftsSchema.safeParse({ shifts: [{ name: 'Reversed', start: '14:00', end: '06:00' }] }).success).toBe(false);
  });
  it('bounds seats and requires at least one plan', () => {
    expect(seatsSchema.safeParse({ count: 10, prefix: 'A' }).success).toBe(true);
    expect(seatsSchema.safeParse({ count: 10.5, prefix: 'A' }).success).toBe(false);
    expect(seatsSchema.safeParse({ count: 0, prefix: '' }).success).toBe(false);
    expect(plansSchema.safeParse({ plans: [] }).success).toBe(false);
    expect(plansSchema.safeParse({ plans: [{ name: 'Monthly', days: 30.5, price: 100 }] }).success).toBe(false);
  });
  it('uses the project-locked Zod v3 constructor options', () => {
    const source = readFileSync(new URL('../schemas/SuperadminLibrariesOnboardingSetupSchema.ts', import.meta.url), 'utf8');
    expect(source).toContain('required_error:');
    expect(source).toContain('invalid_type_error:');
    expect(source).not.toContain('{ error:');
  });

});
