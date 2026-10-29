import { describe, expect, it } from 'vitest';
import { formatManagerAssetsCurrency, toManagerAssetsMinorUnits } from '@/app/frontend_manager/manager_accounts_assets/assets_register/utils/ManagerAssetsRegisterFormatting';

describe('ManagerAssetsRegisterFormatting', () => {
  it('formats integer minor units as currency', () => {
    expect(formatManagerAssetsCurrency(123400, 'INR', 'en-IN')).toContain('1,234');
  });

  it('converts entered major units to minor units', () => {
    expect(toManagerAssetsMinorUnits(12.34, 'INR', 'en-IN')).toBe(1234);
  });

  it('respects currency-specific fraction digits', () => {
    expect(formatManagerAssetsCurrency(1500, 'JPY', 'ja-JP')).toContain('1,500');
    expect(toManagerAssetsMinorUnits(1500, 'JPY', 'ja-JP')).toBe(1500);
    expect(formatManagerAssetsCurrency(1234, 'KWD', 'en-US')).toContain('1.234');
    expect(toManagerAssetsMinorUnits(1.234, 'KWD', 'en-US')).toBe(1234);
  });

  it('returns a safe placeholder for non-finite display values', () => {
    expect(formatManagerAssetsCurrency(Number.NaN, 'INR', 'en-IN')).toBe('—');
  });
});
