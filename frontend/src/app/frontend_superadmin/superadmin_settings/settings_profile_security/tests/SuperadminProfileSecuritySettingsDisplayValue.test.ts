// RESPONSIBILITY: Define source-level test coverage for settings profile security using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_settings/settings_profile_security/tests/SuperadminProfileSecuritySettingsDisplayValue.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { displayValue } from '../utils/SuperadminProfileSecuritySettingsDisplayValue';

describe('SuperadminProfileSecuritySettingsDisplayValue contract', () => {
  it('uses an en dash for null, undefined, and empty string', () => {
    expect(displayValue(null)).toBe('—');
    expect(displayValue(undefined)).toBe('—');
    expect(displayValue('')).toBe('—');
  });

  it('preserves meaningful values instead of treating them as empty', () => {
    expect(displayValue('Ready')).toBe('Ready');
    expect(displayValue(0)).toBe(0);
    expect(displayValue(false)).toBe(false);
  });
});
