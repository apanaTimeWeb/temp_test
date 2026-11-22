'use client';
// Responsibility: AdminBlacklistRecordsTable component owned by admin_blacklist; responsibility folder: admin_blacklist_components_tables.

// RESPONSIBILITY: Renders the paginated blacklist record grid; query and mutation ownership stays in AdminMembersBlacklistMain.
import type { AdminBlacklistRecordsTableProps } from '@/app/frontend_admin/admin_members/members_blacklist/types/AdminMembersBlacklistTypes';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { DataGrid } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import { Download,FileSpreadsheet,Printer,Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo,useState } from 'react';
import { toast } from 'sonner';


export default function AdminBlacklistRecordsTable({ records, columns, onRowClicked }: AdminBlacklistRecordsTableProps) {
  const [urlTablePage0, setUrlTablePage0] = useAdminApplicationInfrastructureUrlQueryState<number>('admin-blacklist-admin-blacklist-records-table-1-page', 0);
  const [search, setSearch] = useState('');
  const t = useTranslations('ADMIN_BLACKLIST');

  const filteredRecords = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return records;
    return records.filter((r) =>
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.phone && r.phone.toLowerCase().includes(q)) ||
      (r.reason && r.reason.toLowerCase().includes(q)) ||
      (r.blacklistedBy && r.blacklistedBy.toLowerCase().includes(q)) ||
      (r.previousSeat && r.previousSeat.toLowerCase().includes(q))
    );
  }, [records, search]);

  const downloadBlacklistCsv = () => {
    const headers = ['Record ID', 'Member Name', 'Phone', 'Reason', 'Blacklisted By', 'Date', 'Previous Seat', 'Status'];
    const rows = filteredRecords.map((r) => [
      `"${r.id}"`,
      `"${r.name.replaceAll('"', '""')}"`,
      `"${r.phone || ''}"`,
      `"${r.reason.replaceAll('"', '""')}"`,
      `"${(r.blacklistedBy || '').replaceAll('"', '""')}"`,
      `"${r.blacklistedOn || ''}"`,
      `"${(r.previousSeat || '').replaceAll('"', '""')}"`,
      `"${r.status || 'Blacklisted'}"`,
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'smart-library-blacklist.csv';
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(`Exported ${filteredRecords.length} blacklist records to CSV`);
  };

  const downloadBlacklistExcel = () => {
    const headers = ['Record ID', 'Student Name', 'Phone', 'Reason', 'Blacklisted By', 'Date', 'Previous Seat', 'Status'];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.name,
      r.phone || '—',
      r.reason,
      r.blacklistedBy || 'Admin',
      r.blacklistedOn || '—',
      r.previousSeat || '—',
      r.status || 'Blacklisted',
    ]);
    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Blacklist</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <style>
          table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
          th { background-color: #881337; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #9f1239; text-align: left; }
          td { padding: 8px; border: 1px solid #cbd5e1; }
          tr:nth-child(even) { background-color: #fff1f2; }
        </style>
      </head>
      <body>
        <table>
          <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>
            ${rows.map((row) => `<tr>${row.map((cell) => `<td>${String(cell ?? '').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `.trim();
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'smart-library-blacklist.xls';
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(`Exported ${filteredRecords.length} blacklist records to Excel (.xls)`);
  };

  const printBlacklistRoster = () => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) { window.print(); return; }
    const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Smart Library - Security Blacklist Roster</title>
          <style>
            @page { size: landscape; margin: 10mm; }
            body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e11d48; padding-bottom: 10px; margin-bottom: 12px; }
            .title { font-size: 18px; font-weight: 800; text-transform: uppercase; color: #be123c; letter-spacing: 0.5px; }
            .subtitle { font-size: 12px; color: #64748b; margin-top: 2px; }
            .meta { font-size: 11px; text-align: right; color: #475569; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; }
            th { background-color: #ffe4e6; color: #9f1239; text-align: left; padding: 6px; border: 1px solid #fecdd3; font-weight: 700; text-transform: uppercase; font-size: 10px; }
            td { padding: 6px; border: 1px solid #e2e8f0; }
            tr:nth-child(even) { background-color: #fff1f2; }
            .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 600; text-transform: uppercase; background: #fee2e2; color: #b91c1c; }
            .footer { margin-top: 14px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 6px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">Smart Library Network · Restricted Members Blacklist</div>
              <div class="subtitle">Confidential Disciplinary Record · Total Records: ${filteredRecords.length}</div>
            </div>
            <div class="meta">
              <div><strong>Generated:</strong> ${dateStr}</div>
              <div><strong>Security:</strong> Central Access Control</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Phone</th>
                <th>Reason</th>
                <th>Reported By</th>
                <th>Date</th>
                <th>Prev Seat</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRecords.map((r) => `
                <tr>
                  <td><strong>${r.name}</strong></td>
                  <td>${r.phone || '—'}</td>
                  <td>${r.reason}</td>
                  <td>${r.blacklistedBy || 'Admin'}</td>
                  <td>${r.blacklistedOn || '—'}</td>
                  <td>${r.previousSeat || '—'}</td>
                  <td><span class="badge">${r.status || 'Blacklisted'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <span>Smart Library Security & Compliance Registry</span>
            <span>Page 1 of 1</span>
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-5 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setUrlTablePage0(0);
            }}
            placeholder="Search blacklisted members by name, phone, reason..."
            aria-label="Search blacklisted members"
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950/60 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={downloadBlacklistCsv}
            disabled={filteredRecords.length === 0}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            title="Export Blacklist to CSV"
          >
            <Download size={14} strokeWidth={2} className="text-cyan-400" />
            <span>CSV</span>
          </button>
          <button
            type="button"
            onClick={downloadBlacklistExcel}
            disabled={filteredRecords.length === 0}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:text-white hover:bg-emerald-500/20 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            title="Export Blacklist to Excel (.xls)"
          >
            <FileSpreadsheet size={14} strokeWidth={2} className="text-emerald-400" />
            <span>Excel</span>
          </button>
          <button
            type="button"
            onClick={printBlacklistRoster}
            disabled={filteredRecords.length === 0}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-300 hover:text-white hover:bg-sky-500/20 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            title="Print Blacklist Roster"
          >
            <Printer size={14} strokeWidth={2} className="text-sky-400" />
            <span>Print</span>
          </button>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/20">
        <DataGrid
          rowData={filteredRecords}
          columnDefs={columns}
          pagination
          pageSize={25}
          rowHeight={56}
          onRowClicked={onRowClicked}
          tableLabel={t('TABLE_LABEL')}
          mobileOpenLabel={t('OPEN_RECORD')}
          page={urlTablePage0}
          onPageChange={setUrlTablePage0}
        />
      </div>
    </div>
  );
}


export type { AdminBlacklistRecordsTableProps };
