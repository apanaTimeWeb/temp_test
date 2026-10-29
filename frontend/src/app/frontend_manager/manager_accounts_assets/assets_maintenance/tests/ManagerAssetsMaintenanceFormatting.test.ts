import { describe, expect, it } from 'vitest';
import { formatManagerAssetsMaintenanceCurrency, toManagerAssetsMaintenanceMinorUnits } from '../utils/ManagerAssetsMaintenanceFormatting';

describe('maintenance currency formatting', () => {
  it('formats minor units and converts major units', () => {
    expect(formatManagerAssetsMaintenanceCurrency(123400, 'INR', 'en-IN')).toContain('1,234');
    expect(toManagerAssetsMaintenanceMinorUnits(12.34, 'INR', 'en-IN')).toBe(1234);
  });
  it('returns a safe placeholder for non-finite values', () => {
    expect(formatManagerAssetsMaintenanceCurrency(Number.NaN, 'INR', 'en-IN')).toBe('—');
  });
});
