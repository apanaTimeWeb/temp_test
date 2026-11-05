'use client';
// Responsibility: AdminBlacklistRecordsTable component owned by admin_blacklist; responsibility folder: admin_blacklist_components_tables.

// RESPONSIBILITY: Renders the paginated blacklist record grid; query and mutation ownership stays in AdminMembersBlacklistMain.
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { DataGrid, type DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { AdminBlacklistRecord } from '@/app/frontend_admin/admin_members/members_blacklist/types/AdminMembersBlacklistTypes';
import type { AdminBlacklistRecordsTableProps } from '@/app/frontend_admin/admin_members/members_blacklist/types/AdminMembersBlacklistTypes';


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

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setUrlTablePage0(0);
            }}
            placeholder="Search blacklisted members by name, phone, reason..."
            aria-label="Search blacklisted members"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-input text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
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
  );
}


export type { AdminBlacklistRecordsTableProps };
