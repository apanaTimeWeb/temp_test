import type { AdminBlacklistRecord } from '@/app/frontend_admin/admin_members/members_blacklist/types/AdminMembersBlacklistTypes';
import { format, isValid, parseISO } from 'date-fns';
import { enIN, hi } from 'date-fns/locale';
import { toast } from 'sonner';

/** Safe date-only formatting for the displayed blacklist history. */
export function formatAdminBlacklistDate(value: string | undefined, locale: string): string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return '—';
  const parsed = parseISO(value);
  if (!isValid(parsed) || format(parsed, 'yyyy-MM-dd') !== value) return '—';
  return format(parsed, 'd MMM yyyy', { locale: locale.toLowerCase().startsWith('hi') ? hi : enIN });
}

export function escapeBlacklistHtml(text: string): string {
  return text.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

export function exportBlacklistCsv(records: readonly AdminBlacklistRecord[], filename: string, includeBranch = false): void {
  const headers = includeBranch
    ? ['Record ID', 'Student Name', 'Phone', 'Reason', 'Blacklisted By', 'Incident Date', 'Previous Seat', 'Branch', 'Status']
    : ['Record ID', 'Member Name', 'Phone', 'Reason', 'Blacklisted By', 'Date', 'Previous Seat', 'Status'];

  const rows = records.map((r) => {
    const base = [
      `"${r.id}"`,
      `"${(r.name || '').replaceAll('"', '""')}"`,
      `"${r.phone || ''}"`,
      `"${(r.reason || '').replaceAll('"', '""')}"`,
      `"${(r.blacklistedBy || (includeBranch ? 'Admin Operations' : '')).replaceAll('"', '""')}"`,
      `"${r.blacklistedOn || ''}"`,
      `"${(r.previousSeat || '').replaceAll('"', '""')}"`,
    ];
    if (includeBranch) base.push(`"${(r.branch || 'Main Branch').replaceAll('"', '""')}"`);
    base.push(`"${r.status || 'Blacklisted'}"`);
    return base;
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast.success(`Exported ${records.length} blacklist records to CSV`, { id: 'admin-blacklist-export-csv' });
}

export function exportBlacklistExcel(records: readonly AdminBlacklistRecord[], filename: string, includeBranch = false): void {
  const headers = includeBranch
    ? ['Record ID', 'Student Name', 'Phone', 'Reason', 'Blacklisted By', 'Incident Date', 'Previous Seat', 'Branch', 'Status']
    : ['Record ID', 'Student Name', 'Phone', 'Reason', 'Blacklisted By', 'Date', 'Previous Seat', 'Status'];

  const rows = records.map((r) => {
    const base = [
      r.id,
      r.name,
      r.phone || '—',
      r.reason,
      r.blacklistedBy || (includeBranch ? 'Admin Operations' : 'Admin'),
      r.blacklistedOn || '—',
      r.previousSeat || '—',
    ];
    if (includeBranch) base.push(r.branch || 'Main Branch');
    base.push(r.status || 'Blacklisted');
    return base;
  });

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
        th { background-color: #881337; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #9f1239; text-align: left; }
        td { padding: 8px; border: 1px solid #cbd5e1; } tr:nth-child(even) { background-color: #fff1f2; }
      </style>
    </head>
    <body><table>
      <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeBlacklistHtml(String(cell ?? ''))}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></body></html>
  `.trim();
  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast.success(`Exported ${records.length} blacklist records to Excel (.xls)`, { id: 'admin-blacklist-export-excel' });
}

export function openBlacklistWhatsAppNotice(record: AdminBlacklistRecord): void {
  const phone = (record.phone || '').replace(/\D/g, '');
  const cleanPhone = phone.length === 10 ? `91${phone}` : phone;
  const isNetwork = record.banScope === 'NETWORK_WIDE' || !record.banScope;
  const scopeText = isNetwork ? 'ऑल ब्रांचेज नेटवर्क-वाइड (All Branches)' : `${record.branch || 'ब्रांच'}`;
  const message = `*आधिकारिक निष्कासन एवं ब्लैकलिस्ट सूचना (SMART LIBRARY)*\n\nप्रिय ${record.name},\nआपको सूचित किया जाता है कि अनुशासनहीनता / पुस्तकालय नियमों के उल्लंघन के कारण आपको तत्काल प्रभाव से ब्लैकलिस्ट व निष्कासित कर दिया गया है।\n\n• *कारण:* ${record.reason}\n• *प्रतिबंध का दायरा:* ${scopeText}\n• *सीट आवंटन:* तत्काल निरस्त (Vacated)\n• *बायोमेट्रिक प्रवेश:* ब्लॉक कर दिया गया है\n\nकिसी भी अनधिकृत प्रवेश का प्रयास कानूनी उल्लंघन माना जाएगा। किसी भी औपचारिक अपील के लिए केंद्रीय प्रशासन कार्यालय से संपर्क करें।\n- मुख्य सुरक्षा प्रशासक`;
  window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
}
