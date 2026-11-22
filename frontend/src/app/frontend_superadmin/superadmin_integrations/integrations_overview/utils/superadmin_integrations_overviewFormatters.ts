// utils/superadmin_integrations_overviewFormatters.ts
// Feature-local formatters for Integration & API Management under Strict WET.

export function formatMaskedKey(key: string): string {
  if (!key) return '—';
  if (key.length <= 10) return '••••••••••';
  const prefix = key.slice(0, 7);
  const suffix = key.slice(-4);
  return `${prefix}••••••••••••${suffix}`;
}

export function formatLatency(ms: number): { label: string; textClass: string; bgClass: string } {
  if (ms < 100) {
    return { label: `${ms} ms`, textClass: 'text-success-text', bgClass: 'bg-success-bg' };
  }
  if (ms < 400) {
    return { label: `${ms} ms`, textClass: 'text-warning-text', bgClass: 'bg-warning-bg' };
  }
  return { label: `${ms} ms`, textClass: 'text-danger-text', bgClass: 'bg-danger-bg' };
}

export function formatStatusCodeBadge(code: number): { label: string; textClass: string; bgClass: string } {
  if (code >= 200 && code < 300) {
    return { label: `${code} OK`, textClass: 'text-success-text', bgClass: 'bg-success-bg' };
  }
  if (code >= 400 && code < 500) {
    return { label: `${code} Client Error`, textClass: 'text-warning-text', bgClass: 'bg-warning-bg' };
  }
  return { label: `${code} Server Error`, textClass: 'text-danger-text', bgClass: 'bg-danger-bg' };
}

export function formatRelativeTimestamp(isoString: string): string {
  if (!isoString) return '—';
  try {
    const diffSeconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diffSeconds < 60) return 'Just now';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    return `${Math.floor(diffSeconds / 86400)}d ago`;
  } catch {
    return isoString;
  }
}
