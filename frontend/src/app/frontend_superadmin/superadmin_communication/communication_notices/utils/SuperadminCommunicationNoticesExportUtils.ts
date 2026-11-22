import type { SuperadminCommunicationNotice as Notice } from '../types/SuperadminCommunicationNoticesTypes';

export { printSuperadminNoticesRoster } from './SuperadminCommunicationNoticesPrintUtils';

function quoteCsvCell(value: unknown): string {
  const str = String(value ?? '');
  const formulaSafe = /^[\u0000-\u0020]*[=+\-@]/.test(str) ? `'${str}` : str;
  return `"${formulaSafe.replaceAll('"', '""')}"`;
}

/** Builds RFC-4180 compliant CSV string for Platform Notices with UTF-8 BOM. */
export function buildSuperadminNoticesCsv(notices: readonly Notice[]): string {
  const headers = ['Notice ID', 'Title', 'Message', 'Status', 'Valid Till', 'Posted By', 'Posted Date'];
  const rows = [
    headers.map(quoteCsvCell).join(','),
    ...notices.map((n) => [
      n.id,
      n.title,
      n.message,
      n.status,
      n.validTill,
      n.postedBy ?? '',
      n.postedDate ?? '',
    ].map(quoteCsvCell).join(',')),
  ];
  return `\uFEFF${rows.join('\r\n')}`;
}

/** Downloads notices CSV file in browser. */
export function downloadSuperadminNoticesCsv(notices: readonly Notice[], filename = `platform_notices_${new Date().toISOString().slice(0, 10)}.csv`): void {
  if (typeof window === 'undefined') return;
  const content = buildSuperadminNoticesCsv(notices);
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.hidden = true;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Builds an HTML/XML Excel spreadsheet from notice records. */
export function buildSuperadminNoticesExcel(notices: readonly Notice[]): string {
  const headers = ['Notice ID', 'Title', 'Message', 'Status', 'Valid Till', 'Posted By', 'Posted Date'];
  const rows = notices.map((n) => [
    n.id,
    n.title,
    n.message,
    n.status,
    n.validTill,
    n.postedBy || 'SuperAdmin',
    n.postedDate || '—',
  ]);

  return `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Notices</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
        th { background-color: #0284c7; color: #ffffff; font-weight: bold; padding: 8px; border: 1px solid #0369a1; text-align: left; }
        td { padding: 6px; border: 1px solid #cbd5e1; }
        tr:nth-child(even) { background-color: #f0f9ff; }
      </style>
    </head>
    <body>
      <table>
        <thead>
          <tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${rows.map((row) => `<tr>${row.map((cell) => `<td>${String(cell ?? '').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `.trim();
}

/** Downloads Excel (.xls) spreadsheet file for notices. */
export function downloadSuperadminNoticesExcel(notices: readonly Notice[], filename = `platform_notices_${new Date().toISOString().slice(0, 10)}.xls`): void {
  if (typeof window === 'undefined') return;
  const content = buildSuperadminNoticesExcel(notices);
  const blob = new Blob([content], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.hidden = true;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
