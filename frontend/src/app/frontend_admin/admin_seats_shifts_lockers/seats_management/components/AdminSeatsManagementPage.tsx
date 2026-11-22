'use client';
// Responsibility: AdminSeatsManagementPage component owned by admin_seats; responsibility folder: admin_seats_components_views.
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';

// RESPONSIBILITY: Read-only seat inventory with local search and canonical status filtering.
// DATA FLOW: demo fixtures (demo mode only) -> filtered rows -> shared data grid.

import {
ADMIN_SEATS_MANAGEMENT_STATUS_OPTIONS,
ADMIN_SEATS_SEAT_STATUS_BADGE_CLASS
} from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_management/config/admin_seats_management_constants';
import {
ADMIN_SEATS_DEMO_SEATS
} from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_management/mocks/AdminSeatsManagementDemoFixtures';
import type { Seat,SeatStatus } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_management/types/AdminSeatsManagementComponentTypes';
import { matchesAdminSeatsFilter } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_management/utils/AdminSeatsManagementFilterUtils';
import { DataGrid,type DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { AlertOctagon,Armchair,CheckCircle2,ChevronDown,Download,FileSpreadsheet,Printer,Search,Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect,useMemo,useState } from 'react';
import { toast } from 'sonner';


function renderSeatNoCell({ value }: { value: string }) {
  return <span className="font-mono text-sm font-semibold text-primary">{value}</span>;
}

function renderBranchCell({ data }: { data: Seat }) {
  return <span className="font-medium text-primary">{data.branch}</span>;
}

export function AdminSeatsManagementPage() {
  const [urlTablePage0, setUrlTablePage0] = useAdminApplicationInfrastructureUrlQueryState<number>('admin-seats-admin-seats-seat-management-page-1-page', 0);

  const t = useTranslations('ADMIN_SEATS');
  const isDemoMode = isFrontendDemoModeEnabled();
  const seats = isDemoMode ? ADMIN_SEATS_DEMO_SEATS : [];
  const [search, setSearch] = useAdminApplicationInfrastructureUrlQueryState<string>('search', '');
  const [searchInput, setSearchInput] = useState(search);
  useEffect(() => setSearchInput(search), [search]);
  useEffect(() => {
    const timeoutId = window.setTimeout(() => setSearch(searchInput), 300);
    return () => window.clearTimeout(timeoutId);
  }, [searchInput, setSearch]);
  const [statusFilter, setStatusFilter] = useAdminApplicationInfrastructureUrlQueryState<'all' | SeatStatus>('statusFilter', 'all', { validValues: ['all', 'Working', 'Maintenance', 'Broken'] });
  const { selectedBranch, isAllBranches } = useAdminBranch();

  const branchScopedSeats = useMemo(() => {
    return seats.filter((seat) => {
      return isAllBranches || !selectedBranch || seat.branch.toLowerCase().includes(selectedBranch.name.toLowerCase()) || selectedBranch.name.toLowerCase().includes(seat.branch.toLowerCase());
    });
  }, [seats, isAllBranches, selectedBranch]);

  const stats = useMemo(() => {
    const total = branchScopedSeats.length;
    const working = branchScopedSeats.filter(s => s.status === 'Working').length;
    const maintenance = branchScopedSeats.filter(s => s.status === 'Maintenance').length;
    const broken = branchScopedSeats.filter(s => s.status === 'Broken').length;
    return { total, working, maintenance, broken };
  }, [branchScopedSeats]);

  const filtered = branchScopedSeats.filter((seat) => {
    const normalizedSearch = search.trim().toLocaleLowerCase();
    const matchesSearch = [seat.seatNo, seat.branch, seat.assignedTo]
      .some((value) => value.toLocaleLowerCase().includes(normalizedSearch));
    return matchesSearch && matchesAdminSeatsFilter(seat.status, statusFilter);
  });

  const exportMasterCsv = () => {
    const headers = ['Seat Number', 'Branch', 'Status', 'Assigned Student', 'Last Maintenance'];
    const rows = filtered.map((s) => [
      `"${s.seatNo}"`,
      `"${s.branch.replaceAll('"', '""')}"`,
      `"${s.status}"`,
      `"${(s.assignedTo || '—').replaceAll('"', '""')}"`,
      `"${s.lastMaintenance || '—'}"`,
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `seats-master-inventory-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(`Exported ${filtered.length} seats to CSV`);
  };

  const exportMasterExcel = () => {
    const headers = ['Seat Number', 'Branch', 'Status', 'Assigned Student', 'Last Maintenance'];
    const rows = filtered.map((s) => [
      s.seatNo,
      s.branch,
      s.status,
      s.assignedTo || '—',
      s.lastMaintenance || '—',
    ]);
    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>SeatsInventory</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <style>
          table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
          th { background-color: #0e7490; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #155e75; text-align: left; }
          td { padding: 8px; border: 1px solid #cbd5e1; }
          tr:nth-child(even) { background-color: #ecfeff; }
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
    const link = document.createElement('a');
    link.href = url;
    link.download = `seats-master-inventory-${new Date().toISOString().slice(0, 10)}.xls`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(`Exported ${filtered.length} seats to Excel (.xls)`);
  };

  const printMasterRoster = () => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=950,height=750');
    if (!printWindow) { window.print(); return; }
    const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Smart Library - Seats Master Inventory Roster</title>
          <style>
            @page { size: landscape; margin: 10mm; }
            body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0e7490; padding-bottom: 10px; margin-bottom: 12px; }
            .title { font-size: 18px; font-weight: 800; text-transform: uppercase; color: #0e7490; }
            .subtitle { font-size: 12px; color: #64748b; margin-top: 2px; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; }
            th { background-color: #cffafe; color: #155e75; text-align: left; padding: 6px; border: 1px solid #a5f3fc; font-weight: 700; text-transform: uppercase; font-size: 10px; }
            td { padding: 6px; border: 1px solid #e2e8f0; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 600; text-transform: uppercase; }
            .badge-working { background: #dcfce7; color: #15803d; }
            .badge-maintenance { background: #fef3c7; color: #b45309; }
            .badge-broken { background: #fee2e2; color: #b91c1c; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">Smart Library Network · Seats Master Inventory Roster</div>
              <div class="subtitle">Branch: ${selectedBranch ? selectedBranch.name : 'All Branches'} · Total Seats: ${filtered.length}</div>
            </div>
            <div style="font-size: 11px; text-align: right; color: #475569;">
              <div><strong>Generated:</strong> ${dateStr}</div>
              <div><strong>Scope:</strong> Master Inventory Asset Audit</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Seat Number</th>
                <th>Branch</th>
                <th>Operational Status</th>
                <th>Assigned Student</th>
                <th>Last Maintenance Log</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map((s) => `
                <tr>
                  <td><strong style="color:#0891b2;">${s.seatNo}</strong></td>
                  <td>${s.branch}</td>
                  <td><span class="badge badge-${s.status.toLowerCase()}">${s.status}</span></td>
                  <td>${s.assignedTo || '—'}</td>
                  <td>${s.lastMaintenance || '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const colDefs = useMemo<readonly DataGridColumn<Seat>[]>(() => [
    { field: 'seatNo', headerName: t('seatNumber'), flex: 1, sortable: true, cellRenderer: renderSeatNoCell },
    { field: 'branch', headerName: t('branch'), flex: 2, sortable: true, cellRenderer: renderBranchCell },
    {
      field: 'status',
      headerName: t('status'),
      flex: 1.2,
      sortable: true,
      cellRenderer: ({ value }: { value: string }) => {
        const statusKey = ADMIN_SEATS_MANAGEMENT_STATUS_OPTIONS.find((option) => option.value === value)?.labelKey ?? 'statusUnknown';
        return (
          <span data-testid="admin_seats-page-state-001" className={ADMIN_SEATS_SEAT_STATUS_BADGE_CLASS[value as SeatStatus] ?? 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-border bg-surface-highlight text-text-secondary'}>
            <span className="mr-1.5 inline-block size-1.5 shrink-0 rounded-full bg-current align-middle" />{t(statusKey)}
          </span>
        );
      },
    },
    { field: 'assignedTo', headerName: t('assignedTo'), flex: 2, sortable: true, cellClass: 'text-sm text-text-secondary' },
    { field: 'lastMaintenance', headerName: t('lastMaintenance'), flex: 1.5, sortable: true, cellClass: 'text-sm text-text-secondary' },
    {
      headerName: t('actions'),
      flex: 1.5,
      sortable: false,
      cellRenderer: () => (
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            data-testid="admin_seats-page-control-002"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-card text-text-secondary motion-safe:transition-colors motion-safe:duration-base hover:bg-surface-hover hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            title={t('maintenanceLogUnavailable')}
            aria-label={t('viewMaintenanceLog')}
            disabled
          >
            <Wrench size={18} strokeWidth={2} />
          </button>
        </div>
      ),
    },
  ], [t]);

  return (
    <div className="min-w-0 space-y-6">
      {!isDemoMode && <p role="status" className="mb-4 rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('liveSeatNotice')}</p>}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
              <Armchair size={13} className="text-cyan-400" />
              Desk & Cabin Inventory
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{t('seatsTitle')}</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">{t('seatsSubtitle')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={exportMasterCsv}
            disabled={filtered.length === 0}
            className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            title="Export Seats Master to CSV"
          >
            <Download size={14} className="text-cyan-400" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={exportMasterExcel}
            disabled={filtered.length === 0}
            className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 hover:text-white hover:bg-emerald-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            title="Export Seats Master to Excel (.xls)"
          >
            <FileSpreadsheet size={14} className="text-emerald-400" />
            <span>Excel</span>
          </button>
          <button
            type="button"
            onClick={printMasterRoster}
            disabled={filtered.length === 0}
            className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            title="Print Master Inventory Roster"
          >
            <Printer size={14} className="text-slate-400" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* 4 Premium Glassmorphic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="group relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-[#081822]/95 via-[#081822]/90 to-[#0d2636]/80 shadow-cyan-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">Total Inventory</span>
            <div className="p-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/15 text-cyan-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
              <Armchair size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white tabular-nums">{stats.total}</p>
          <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400">{selectedBranch ? selectedBranch.name : 'All branches'}</p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 shadow-emerald-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">Working Desks</span>
            <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
              <CheckCircle2 size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-emerald-400 tabular-nums">{stats.working}</p>
          <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400">Fully operational</p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 shadow-amber-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">Maintenance</span>
            <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
              <Wrench size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-amber-400 tabular-nums">{stats.maintenance}</p>
          <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400">Scheduled repairs</p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-rose-500/25 bg-gradient-to-br from-[#1f0a10]/95 via-[#1f0a10]/90 to-[#2d0e17]/80 shadow-rose-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#f87171" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">Out of Order</span>
            <div className="p-2.5 rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
              <AlertOctagon size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-rose-400 tabular-nums">{stats.broken}</p>
          <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400">Defective / broken</p>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" strokeWidth={2} />
          <input maxLength={100}
            type="text"
            aria-label={t('searchSeatsPlaceholder')}
            placeholder={t('searchSeatsPlaceholder')}
            className="min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 pl-10 text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </div>
        <div className="relative min-w-0 sm:w-56">
          <select
            aria-label={t('status')}
            data-testid="admin_seats-page-control-003"
            className="min-h-11 w-full appearance-none rounded-md border border-border bg-input px-3 py-2 pr-9 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | SeatStatus)}
          >
            <option value="all">{t('allStatuses')}</option>
            {ADMIN_SEATS_MANAGEMENT_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{t(option.labelKey)}</option>
            ))}
          </select>
          <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" strokeWidth={2} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div data-testid="admin_seats-page-state-004" className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-6 text-center">
          <p data-testid="admin_seats-page-state-005" className="mb-1 text-3xl">🪑</p>
          <p data-testid="admin_seats-page-state-006" className="text-sm font-semibold text-text-primary">{t('noSeatsFound')}</p>
          <p data-testid="admin_seats-page-state-007" className="text-sm text-text-secondary">{t('noSeatsMatch')}</p>
        </div>
      ) : (
        <div className="min-w-0 overflow-x-auto rounded-lg border border-border bg-card min-h-96">
          <DataGrid rowData={filtered} columnDefs={colDefs} rowHeight={52}  page={urlTablePage0} onPageChange={setUrlTablePage0}/>
        </div>
      )}
    </div>
  );
}
