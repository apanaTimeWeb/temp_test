// frontend/src/app/frontend_superadmin/superadmin_data/data_export_management/utils/superadmin_data_export_management_formatters.ts
/**
 * @file superadmin_data_export_management_formatters.ts
 * @description Formatters with universal null safety for Data Export Management.
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

export function formatNumberWithCommas(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return num.toLocaleString('en-US');
}

export function formatShortHash(hash: string | null | undefined): string {
  if (!hash) return '—';
  if (hash.length <= 12) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
}
