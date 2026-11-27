'use client';
// Responsibility: AdminBlacklistRecordsTable component owned by admin_blacklist; responsibility folder: admin_blacklist_components_tables.

import type { AdminBlacklistRecordsTableProps } from '@/app/frontend_admin/admin_members/members_blacklist/types/AdminMembersBlacklistTypes';
import {
  exportBlacklistCsv,
  exportBlacklistExcel,
  printBlacklistRosterHtml,
} from '@/app/frontend_admin/admin_members/members_blacklist/utils/adminMembersBlacklistExports';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { DataGrid } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import { Download, FileSpreadsheet, Printer, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

export default function AdminBlacklistRecordsTable({ records, columns, onRowClicked }: AdminBlacklistRecordsTableProps) {
  const [urlTablePage0, setUrlTablePage0] = useAdminApplicationInfrastructureUrlQueryState<number>('admin-blacklist-admin-blacklist-records-table-1-page', 0);
  const [search, setSearch] = useState('');
  const t = useTranslations('ADMIN_BLACKLIST');

  const filteredRecords = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return records;
    return records.filter(
      (r) =>
        (r.name && r.name.toLowerCase().includes(q)) ||
        (r.phone && r.phone.toLowerCase().includes(q)) ||
        (r.reason && r.reason.toLowerCase().includes(q)) ||
        (r.blacklistedBy && r.blacklistedBy.toLowerCase().includes(q)) ||
        (r.previousSeat && r.previousSeat.toLowerCase().includes(q)),
    );
  }, [records, search]);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" aria-hidden="true" />
          <input
            maxLength={100}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setUrlTablePage0(0);
            }}
            placeholder="Search blacklisted members by name, phone, reason..."
            aria-label="Search blacklisted members"
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-input text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => exportBlacklistCsv(filteredRecords, 'smart-library-blacklist.csv', false)}
            disabled={filteredRecords.length === 0}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-info bg-info-bg px-3 py-1.5 text-xs font-medium text-info-text hover:opacity-90 motion-safe:transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            title="Export Blacklist to CSV"
          >
            <Download size={14} strokeWidth={2} aria-hidden="true" />
            <span>CSV</span>
          </button>
          <button
            type="button"
            onClick={() => exportBlacklistExcel(filteredRecords, 'smart-library-blacklist.xls', false)}
            disabled={filteredRecords.length === 0}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-success bg-success-bg px-3 py-1.5 text-xs font-medium text-success-text hover:opacity-90 motion-safe:transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            title="Export Blacklist to Excel (.xls)"
          >
            <FileSpreadsheet size={14} strokeWidth={2} aria-hidden="true" />
            <span>Excel</span>
          </button>
          <button
            type="button"
            onClick={() => printBlacklistRosterHtml(filteredRecords)}
            disabled={filteredRecords.length === 0}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-border-focus bg-primary-subtle px-3 py-1.5 text-xs font-medium text-primary hover:opacity-90 motion-safe:transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            title="Print Blacklist Roster"
          >
            <Printer size={14} strokeWidth={2} aria-hidden="true" />
            <span>Print</span>
          </button>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-surface-highlight">
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
