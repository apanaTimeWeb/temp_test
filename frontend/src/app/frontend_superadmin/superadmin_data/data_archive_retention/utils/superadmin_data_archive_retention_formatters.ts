// frontend/src/app/frontend_superadmin/superadmin_data/data_archive_retention/utils/superadmin_data_archive_retention_formatters.ts
/**
 * @file superadmin_data_archive_retention_formatters.ts
 * @description Formatters with universal null safety for Data Archive & Retention Rules.
 */

export function displayValue<T>(value: T | null | undefined, fallback: string = '—'): string {
  if (value === null || value === undefined || value === '') return fallback;
  return String(value);
}

export function formatBytes(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined || isNaN(bytes) || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatTimestamp(isoString: string | null | undefined): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return '—';
  }
}

export function formatDaysToYearsOrDays(days: number | null | undefined): string {
  if (!days) return '0 days';
  if (days >= 365) {
    const years = (days / 365).toFixed(1).replace('.0', '');
    return `${years} ${Number(years) === 1 ? 'Year' : 'Years'} (${days}d)`;
  }
  return `${days} Days`;
}

export function formatNumberWithCommas(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return num.toLocaleString('en-US');
}
