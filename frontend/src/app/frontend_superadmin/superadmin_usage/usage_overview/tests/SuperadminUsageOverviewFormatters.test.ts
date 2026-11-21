import { describe, it, expect } from 'vitest';
import {
  calculateUsagePercent,
  determineQuotaSeverity,
  getQuotaColorClasses,
  formatBytesOrGb,
} from '../utils/SuperadminUsageOverviewFormatters';

describe('SuperadminUsageOverviewFormatters', () => {
  it('calculates usage percentages correctly', () => {
    expect(calculateUsagePercent(3, 3)).toBe(100);
    expect(calculateUsagePercent(1, 2)).toBe(50);
    expect(calculateUsagePercent(0, 10)).toBe(0);
    expect(calculateUsagePercent(5, 0)).toBe(100);
  });

  it('determines quota severity based on utilization thresholds', () => {
    expect(determineQuotaSeverity(3, 3)).toBe('EXCEEDED_100');
    expect(determineQuotaSeverity(95, 100)).toBe('CRITICAL_90');
    expect(determineQuotaSeverity(85, 100)).toBe('WARNING_80');
    expect(determineQuotaSeverity(50, 100)).toBe('NORMAL');
  });

  it('returns valid Tailwind color classes for quota severities', () => {
    const exceeded = getQuotaColorClasses('EXCEEDED_100');
    expect(exceeded.text).toContain('red');
    expect(exceeded.bar).toContain('red');

    const warning = getQuotaColorClasses('WARNING_80');
    expect(warning.text).toContain('yellow');

    const normal = getQuotaColorClasses('NORMAL');
    expect(normal.text).toContain('emerald');
  });

  it('formats bytes and gigabytes properly', () => {
    expect(formatBytesOrGb(2048, 'MB')).toBe('2.0 GB');
    expect(formatBytesOrGb(500, 'MB')).toBe('500 MB');
    expect(formatBytesOrGb(50, 'GB')).toBe('50 GB');
  });
});
