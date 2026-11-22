// utils/SuperadminUsageOverviewFormatters.ts
import type { QuotaSeverity } from '../types/SuperadminUsageOverviewTypes';

export function calculateUsagePercent(current: number, limit: number): number {
  if (limit <= 0) return 100;
  return Math.min(100, Math.round((current / limit) * 100));
}

export function determineQuotaSeverity(current: number, limit: number): QuotaSeverity {
  const percent = calculateUsagePercent(current, limit);
  if (percent >= 100) return 'EXCEEDED_100';
  if (percent >= 90) return 'CRITICAL_90';
  if (percent >= 80) return 'WARNING_80';
  return 'NORMAL';
}

export function getQuotaColorClasses(severity: QuotaSeverity): { text: string; bg: string; bar: string } {
  switch (severity) {
    case 'EXCEEDED_100':
      return { text: 'text-red-400', bg: 'bg-red-500/20 border-red-500/40', bar: 'bg-red-500' };
    case 'CRITICAL_90':
      return { text: 'text-amber-400', bg: 'bg-amber-500/20 border-amber-500/40', bar: 'bg-amber-500' };
    case 'WARNING_80':
      return { text: 'text-yellow-400', bg: 'bg-yellow-500/20 border-yellow-500/40', bar: 'bg-yellow-400' };
    case 'NORMAL':
    default:
      return { text: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/40', bar: 'bg-emerald-500' };
  }
}

export function formatBytesOrGb(val: number, unit = 'GB'): string {
  if (unit === 'MB' && val >= 1024) {
    return `${(val / 1024).toFixed(1)} GB`;
  }
  return `${val.toLocaleString()} ${unit}`;
}
