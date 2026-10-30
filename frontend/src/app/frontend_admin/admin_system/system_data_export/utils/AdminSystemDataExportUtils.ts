import { ADMIN_SYSTEM_DATA_EXPORT_DEMO_ROWS } from '@/app/frontend_admin/admin_system/system_data_export/mocks/AdminSystemDataExportFixtures';
import type { AdminSystemDataExportModuleId, AdminSystemDataExportPreset } from '@/app/frontend_admin/admin_system/system_data_export/types/AdminSystemDataExportTypes';

export function escapeAdminSystemDataExportCsvCell(value: unknown): string {
  let text = String(value ?? '');
  if (/^[\u0000-\u0020]*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function buildAdminSystemDataExportCsv(
  moduleIds: readonly AdminSystemDataExportModuleId[],
  dateFrom: string,
  dateTo: string,
  preset: AdminSystemDataExportPreset = 'custom',
): string {
  const selected = new Set(moduleIds);
  if (!dateFrom || !dateTo || dateFrom > dateTo) {
    return '\uFEFF"module","recordId","label","value","recordDate","feeStatus","subscriptionExpiry"';
  }
  // These timestamps are synthetic fixture dates and apply only to the explicit demo export.
  // Never use this helper for live records; live export requires the backend's date contract.
  const rows = ADMIN_SYSTEM_DATA_EXPORT_DEMO_ROWS.filter((row) =>
    selected.has(row.module) &&
      (preset === 'expiring' ? Boolean(row.subscriptionExpiry) && row.subscriptionExpiry! >= dateFrom && row.subscriptionExpiry! <= dateTo : row.recordDate >= dateFrom && row.recordDate <= dateTo) &&
      (preset !== 'due-fees' || (row.module === 'payments' && row.feeStatus === 'Due')) &&
      (preset !== 'active' || (row.module === 'students' && row.value === 'Active')) &&
      (preset !== 'expiring' || row.module === 'students'),
  );
  const lines = [
    ['module', 'recordId', 'label', 'value', 'recordDate', 'feeStatus', 'subscriptionExpiry'].map(escapeAdminSystemDataExportCsvCell).join(','),
    ...rows.map((row) => [row.module, row.recordId, row.label, row.value, row.recordDate, row.feeStatus ?? '', row.subscriptionExpiry ?? ''].map(escapeAdminSystemDataExportCsvCell).join(',')),
  ];
  return `\uFEFF${lines.join('\r\n')}`;
}

export function downloadAdminSystemDataExportCsv(filename: string, csv: string): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
