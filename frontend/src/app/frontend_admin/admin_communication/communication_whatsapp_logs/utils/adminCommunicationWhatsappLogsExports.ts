import type { AdminCommunicationWhatsappLog } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/types/AdminCommunicationWhatsappLogsTypes';

function escapeWhatsappCsvCell(value: unknown): string {
  const text = String(value ?? '');
  const isFiniteNumber = typeof value === 'number' && Number.isFinite(value);
  const safeText = !isFiniteNumber && /^[\u0000-\u0020]*[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safeText.replaceAll('"', '""')}"`;
}

function escapeWhatsappHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function exportWhatsappLogsToCsv(visibleLogs: readonly AdminCommunicationWhatsappLog[]): void {
  const headers = ['Dispatch ID', 'Date & Time', 'Student Name', 'Mobile Number', 'Template Type', 'Dispatch Mode', 'Status', 'Error Diagnostic', 'Target Branch'];
  const rows = visibleLogs.map((l) => [
    `WA-00${l.id}`,
    l.dateTime,
    l.student,
    l.phone,
    l.type,
    l.dispatchMode === 'auto_api_single' ? 'Server API (1x Auto)' : 'WhatsApp Web (Free)',
    l.status,
    l.error || 'None',
    l.branch || 'Downtown',
  ].map(escapeWhatsappCsvCell));
  const csvContent = '\uFEFF' + [headers.map(escapeWhatsappCsvCell).join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `whatsapp_dispatch_logs_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportWhatsappLogsToExcel(visibleLogs: readonly AdminCommunicationWhatsappLog[]): void {
  const tableRows = visibleLogs
    .map(
      (l) =>
        `<tr><td>#WA-00${escapeWhatsappHtml(l.id)}</td><td>${escapeWhatsappHtml(l.dateTime)}</td><td>${escapeWhatsappHtml(l.student)}</td><td>+91 ${escapeWhatsappHtml(l.phone)}</td><td>${escapeWhatsappHtml(l.type)}</td><td>${l.dispatchMode === 'auto_api_single' ? 'Server API (1x Auto)' : 'WhatsApp Web (Free)'}</td><td>${escapeWhatsappHtml(l.status)}</td><td>${escapeWhatsappHtml(l.error || 'None')}</td><td>${escapeWhatsappHtml(l.branch || 'Downtown')}</td></tr>`
    )
    .join('');
  const excelHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"/></head><body><table border="1"><thead><tr style="background:#075e54;color:#fff;"><th>ID</th><th>Date</th><th>Student</th><th>Phone</th><th>Template</th><th>Dispatch Mode</th><th>Status</th><th>Error</th><th>Branch</th></tr></thead><tbody>${tableRows}</tbody></table></body></html>`;
  const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `whatsapp_audit_${new Date().toISOString().slice(0, 10)}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
