// utils/superadmin_data_overview_formatters.ts
// Feature-local formatters for Superadmin Data Overview

export function formatGigabytes(gigabytes: number): string {
  if (gigabytes >= 1024) {
    return `${(gigabytes / 1024).toFixed(2)} TB`;
  }
  return `${gigabytes.toFixed(1)} GB`;
}

export function formatDurationSeconds(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const mins = Math.floor(seconds / 60);
  const remSecs = seconds % 60;
  return `${mins}m ${remSecs}s`;
}

export function getStatusBadgeVariant(status: string): { bg: string; text: string; label: string } {
  switch (status) {
    case 'SUCCESS':
    case 'OPTIMAL':
    case 'COMPLIANT':
    case 'VERIFIED_100_PERCENT':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Verified / Compliant' };
    case 'IN_PROGRESS':
      return { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'In Progress' };
    case 'DEGRADED':
    case 'WARNING':
      return { bg: 'bg-amber-500/15', text: 'text-amber-300', label: 'Attention' };
    case 'BREACHED':
    case 'FAILED':
    case 'ATTENTION_REQUIRED':
      return { bg: 'bg-rose-500/10', text: 'text-rose-400', label: 'Breached / Action Required' };
    default:
      return { bg: 'bg-neutral-800', text: 'text-neutral-400', label: status };
  }
}
