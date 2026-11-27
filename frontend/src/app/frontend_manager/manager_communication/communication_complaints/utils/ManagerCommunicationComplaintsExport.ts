import type {
  ManagerCommunicationComplaintsComplaint,
  ManagerCommunicationComplaintsComplaintStatus,
} from '@/app/frontend_manager/manager_communication/communication_complaints/types/ManagerCommunicationComplaintsTypes';

export function computeComplaintStats(allComplaints: ManagerCommunicationComplaintsComplaint[]) {
  const total = allComplaints.length;
  const openCount = allComplaints.filter((c) => c.status === 'Open').length;
  const inProgressCount = allComplaints.filter((c) => c.status === 'In-Progress').length;
  const resolvedCount = allComplaints.filter((c) => c.status === 'Resolved').length;
  const resolutionRate = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;
  return { total, openCount, inProgressCount, resolvedCount, resolutionRate };
}

export function filterComplaintsList(
  allComplaints: ManagerCommunicationComplaintsComplaint[],
  tab: ManagerCommunicationComplaintsComplaintStatus | 'All',
  categoryFilter: string,
  searchQuery: string
): ManagerCommunicationComplaintsComplaint[] {
  const q = searchQuery.trim().toLowerCase();
  const base = tab === 'All' ? allComplaints : allComplaints.filter((c) => c.status === tab);
  return base.filter((c) => {
    const matchCat =
      categoryFilter === 'all' ||
      c.title.toLowerCase().includes(categoryFilter.toLowerCase()) ||
      c.description.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchQ =
      !q ||
      c.title.toLowerCase().includes(q) ||
      (c.student && c.student.toLowerCase().includes(q)) ||
      (c.seatTag && c.seatTag.toLowerCase().includes(q)) ||
      c.description.toLowerCase().includes(q) ||
      (c.resolvedBy && c.resolvedBy.toLowerCase().includes(q));
    return matchCat && matchQ;
  });
}

export function formatComplaintCalendarDate(value: string, locale: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return value;
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

function escapeCsvCell(val: unknown): string {
  let str = String(val ?? '');
  if (/^[\u0000-\u0020]*[=+\-@]/.test(str)) str = `'${str}`;
  return `"${str.replace(/"/g, '""')}"`;
}

export function exportComplaintsToCsv(complaints: ManagerCommunicationComplaintsComplaint[]): void {
  const headers = ['ID', 'Title', 'Student', 'Description', 'Status', 'Date', 'Resolved By'].map(escapeCsvCell).join(',');
  const rows = complaints
    .map((c) =>
      [c.id, c.title, c.student || 'Anonymous', c.description, c.status, c.date, c.resolvedBy || '']
        .map(escapeCsvCell)
        .join(',')
    )
    .join('\r\n');
  const blob = new Blob([`\uFEFF${headers}\r\n${rows}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `complaints_${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.hidden = true;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportComplaintsToExcel(complaints: ManagerCommunicationComplaintsComplaint[]): void {
  const headers = ['ID', 'Title', 'Student', 'Phone', 'Description', 'Location/Seat', 'Status', 'Date', 'Resolved By'];
  const rows = complaints.map((c) => [
    c.id,
    c.title,
    c.student || 'Anonymous',
    c.phone || '—',
    c.description,
    c.seatTag || 'General Area',
    c.status,
    c.date,
    c.resolvedBy || '—',
  ]);
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((cell) => `<td>${String(cell ?? '')}</td>`).join('')}</tr>`).join('')}</tbody></table></body></html>`;
  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `complaints_${new Date().toISOString().slice(0, 10)}.xls`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
