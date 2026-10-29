import { describe, expect, it } from 'vitest';
import { displayValue } from '@/app/frontend_manager/manager_accounts_assets/assets_register/utils/ManagerAssetsRegisterDisplayValue';

describe('ManagerAssetsRegisterDisplayValue', () => {
  it('uses an en dash for nullable, empty, and object values', () => {
    expect(displayValue(null)).toBe('—');
    expect(displayValue(undefined)).toBe('—');
    expect(displayValue('')).toBe('—');
    expect(displayValue({ nested: true })).toBe('—');
  });
  it('preserves valid primitive values including zero and false', () => {
    expect(displayValue(0)).toBe('0');
    expect(displayValue(false)).toBe('false');
    expect(displayValue('hello')).toBe('hello');
  });
});
