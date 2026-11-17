import type { Enquiry } from '@/app/frontend_admin/admin_members/members_enquiries/schemas/AdminMembersEnquiriesSchema';
import { format, isValid, parseISO } from 'date-fns';
import { enIN, hi } from 'date-fns/locale';

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 6) return phone;
  return digits.slice(0, 2) + '****' + digits.slice(-4);
}

export function getInitials(name: string): string {
  return name.split(' ').filter(Boolean).map((part) => part[0]).join('').toUpperCase().slice(0, 2);
}

/**
 * @description Tests an enquiry against free-text or phone search without treating a non-numeric query as an empty phone match.
 * @dependencies Consumes only the owning module's enquiry type.
 * @edge-case Empty/whitespace queries match all records; punctuation-only phone queries do not match every record.
 */
export function matchesAdminEnquiriesEnquirySearch(enquiry: Enquiry, rawSearch: string): boolean {
  const query = rawSearch.trim().toLocaleLowerCase();
  if (!query) return true;

  const nameMatches = enquiry.name.toLocaleLowerCase().includes(query);
  if (nameMatches) return true;

  const normalizedPhoneQuery = rawSearch.replace(/\D/g, '');
  if (!normalizedPhoneQuery) return false;

  const normalizedPhone = enquiry.phone.replace(/\D/g, '');
  return normalizedPhone.includes(normalizedPhoneQuery);
}

/** Locale-aware display for ISO calendar-day strings; invalid dates are neutralized. */
export function formatAdminEnquiriesDate(value: string | undefined, locale: string): string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return '—';
  const date = parseISO(value);
  if (!isValid(date) || format(date, 'yyyy-MM-dd') !== value) return '—';
  return format(date, 'd MMM yyyy', { locale: locale.toLowerCase().startsWith('hi') ? hi : enIN });
}


// CSV export is a text serialization concern; formula-safe quoting is retained in the same utility.

const ADMIN_ENQUIRIES_EXPORT_COLUMNS = [
  { header: 'Enquiry ID', value: (row: Enquiry) => row.id },
  { header: 'Name', value: (row: Enquiry) => row.name },
  { header: 'Phone', value: (row: Enquiry) => row.phone },
  { header: 'Shift', value: (row: Enquiry) => row.shift },
  { header: 'Status', value: (row: Enquiry) => row.status },
  { header: 'Source', value: (row: Enquiry) => row.source ?? '' },
  { header: 'Enquiry Date', value: (row: Enquiry) => row.enquiryDate ?? row.addedDate },
] as const;

function escapeAdminEnquiriesCsvCell(value: unknown): string {
  const text = String(value ?? '');
  // Neutralize spreadsheet formula starters before quoting untrusted record text.
  const safeText = /^[\s]*[=+@-]/.test(text) ? `'${text}` : text;
  return `"${safeText.replace(/"/g, '""')}"`;
}

/** Creates CSV only from the records passed by the owning view. It does not fetch or infer live CRM data. */
export function buildAdminEnquiriesCsv(records: readonly Enquiry[]): string {
  const header = ADMIN_ENQUIRIES_EXPORT_COLUMNS.map((column) => escapeAdminEnquiriesCsvCell(column.header)).join(',');
  const rows = records.map((record) => ADMIN_ENQUIRIES_EXPORT_COLUMNS.map((column) => escapeAdminEnquiriesCsvCell(column.value(record))).join(','));
  return `\uFEFF${[header, ...rows].join('\r\n')}`;
}

/** Builds an HTML/XML Excel spreadsheet from enquiry records. */
export function buildAdminEnquiriesExcel(records: readonly Enquiry[]): string {
  const headers = ['Enquiry ID', 'Full Name', 'Phone', 'Shift', 'Status', 'Handled By', 'Source', 'Date Added'];
  const rows = records.map((e) => [
    e.id,
    e.name,
    e.phone,
    e.shift || 'General',
    e.status,
    e.handledBy || 'Unassigned',
    e.source || 'Walk-in',
    e.addedDate || '—',
  ]);

  return `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Enquiries</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
        th { background-color: #1e1b4b; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #312e81; text-align: left; }
        td { padding: 8px; border: 1px solid #cbd5e1; }
        tr:nth-child(even) { background-color: #f8fafc; }
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

/** Downloads an Excel spreadsheet (.xls) directly in the browser. */
export function downloadAdminEnquiriesExcel(records: readonly Enquiry[], filename = 'admin-crm-enquiries.xls'): void {
  if (typeof window === 'undefined') return;
  const content = buildAdminEnquiriesExcel(records);
  const blob = new Blob([content], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.hidden = true;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Prints a clean, high-resolution enquiry roster view with letterhead. */
export function printAdminEnquiriesRoster(records: readonly Enquiry[]): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    window.print();
    return;
  }
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Smart Library - Enquiries & CRM Pipeline</title>
        <style>
          @page { size: landscape; margin: 10mm; }
          body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 12px; }
          .title { font-size: 18px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
          .subtitle { font-size: 12px; color: #64748b; margin-top: 2px; }
          .meta { font-size: 11px; text-align: right; color: #475569; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; }
          th { background-color: #f1f5f9; color: #0f172a; text-align: left; padding: 6px; border: 1px solid #cbd5e1; font-weight: 700; text-transform: uppercase; font-size: 10px; }
          td { padding: 6px; border: 1px solid #e2e8f0; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 600; text-transform: uppercase; }
          .badge-new { background: #dbeafe; color: #1d4ed8; }
          .badge-visited { background: #fef3c7; color: #b45309; }
          .badge-interested { background: #e0e7ff; color: #4338ca; }
          .badge-converted { background: #dcfce7; color: #15803d; }
          .badge-lost { background: #fee2e2; color: #b91c1c; }
          .footer { margin-top: 14px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 6px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">Smart Library Network · CRM Leads & Enquiries</div>
            <div class="subtitle">Total Records: ${records.length}</div>
          </div>
          <div class="meta">
            <div><strong>Generated:</strong> ${dateStr}</div>
            <div><strong>Confidential:</strong> Admin Authorized View</div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Lead Name</th>
              <th>Phone</th>
              <th>Shift</th>
              <th>Status</th>
              <th>Handled By</th>
              <th>Source</th>
              <th>Date Added</th>
            </tr>
          </thead>
          <tbody>
            ${records.map((e) => `
              <tr>
                <td style="font-family: monospace; font-weight: 600;">${e.id}</td>
                <td><strong>${e.name}</strong></td>
                <td>${e.phone}</td>
                <td>${e.shift || 'General'}</td>
                <td><span class="badge badge-${(e.status || 'new').toLowerCase()}">${e.status}</span></td>
                <td>${e.handledBy || 'Unassigned'}</td>
                <td>${e.source || 'Walk-in'}</td>
                <td>${e.addedDate || '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <span>Smart Library CRM Management System</span>
          <span>Page 1 of 1</span>
        </div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

