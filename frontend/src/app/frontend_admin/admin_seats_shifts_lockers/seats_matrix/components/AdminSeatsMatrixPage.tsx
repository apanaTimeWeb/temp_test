'use client';
// RESPONSIBILITY: AdminSeatMatrixSeatMatrixPage component owned by admin_seat_matrix; responsibility folder: admin_seat_matrix_components_views.

import { ADMIN_SEAT_MATRIX_QUERY_KEYS } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/api/admin_seats_matrix.query_keys';
import { ADMIN_SEAT_MATRIX_SHIFTS } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/config/admin_seats_matrix.url_config';
import useAdminSeatMatrixDialogFocus from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/hooks/useAdminSeatsMatrixDialogFocus';
import { generateFallbackSeatMatrix,useAdminSeatMatrixSeatMatrix } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/hooks/useAdminSeatsMatrixSeatMatrix';
import type { AdminSeatMatrixSeatMatrixViewModel } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/types/AdminSeatsMatrixTypes';
import { buildAdminSeatMatrixSeatMatrixCsv,downloadAdminSeatMatrixCsv } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/utils/AdminSeatsMatrixExportUtils';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { DataGrid,type DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { useQueryClient } from '@tanstack/react-query';
import { addDays,format } from 'date-fns';
import {
AlertTriangle,
Armchair,
Building2,
CheckCircle2,
Clock,
Download,
FileSpreadsheet,
Filter,
Layers,
LayoutGrid,
List,
Printer,
Search,
User,
Users,
Wrench,
X
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect,useMemo,useRef,useState } from 'react';
import { toast } from 'sonner';
import AdminSeatsMatrixBulkGenerateModal from './AdminSeatsMatrixBulkGenerateModal';

const ADMIN_SEAT_MATRIX_LEGEND_ITEMS = [
  { dotCls: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]', label: 'Available Free', desc: 'Ready for allocation' },
  { dotCls: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]', label: 'Occupied', desc: 'Student allocated' },
  { dotCls: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]', label: 'Expiring ≤7d', desc: 'Renewal required' },
  { dotCls: 'bg-slate-400 border border-slate-600', label: 'Maintenance', desc: 'Under service' },
] as const;

const PLAN_OPTIONS = [
  'Full Day Dedicated Desk',
  'Flexi Shift Half Day',
  'Night Owl Special',
  'Weekend Warrior Pass',
  'Monthly Reserved Cabin',
];

const SHIFT_OPTIONS = ['Morning', 'Afternoon', 'Evening', 'Night', 'Full Day'] as const;

function computeShiftOccupancy(seat: AdminSeatMatrixSeatMatrixViewModel) {
  if (seat.status === 'free' || seat.status === 'maintenance' || !seat.student) {
    return { morning: false, afternoon: false, evening: false, night: false };
  }
  const shiftStr = (seat.shift || '').toLowerCase();
  if (shiftStr.includes('full') || (seat.status === 'occupied' && !seat.shift)) {
    return { morning: true, afternoon: true, evening: true, night: true };
  }
  const m = shiftStr.includes('morning');
  const a = shiftStr.includes('afternoon');
  const e = shiftStr.includes('evening');
  const n = shiftStr.includes('night');
  return {
    morning: m || (!a && !e && !n),
    afternoon: a,
    evening: e,
    night: n,
  };
}

export function AdminSeatMatrixSeatMatrixPage() {
  const t = useTranslations('ADMIN_SEAT_MATRIX');
  const isDemo = isFrontendDemoModeEnabled();
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ADMIN_SEAT_MATRIX_QUERY_KEYS.list({ resource: 'seat-matrix', demo: isDemo }), [isDemo]);

  const { selectedBranchId, selectedBranch, isAllBranches } = useAdminBranch();
  const [activeBranchFilter, setActiveBranchFilter] = useState('All Branches');
  const [activeTab, setActiveTab] = useState<(typeof ADMIN_SEAT_MATRIX_SHIFTS)[number]>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'free' | 'occupied' | 'expiring' | 'maintenance'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedSeat, setSelectedSeat] = useState<AdminSeatMatrixSeatMatrixViewModel | null>(null);
  const seatDetailDialogRef = useRef<HTMLDivElement>(null);
  useAdminSeatMatrixDialogFocus(Boolean(selectedSeat), () => setSelectedSeat(null), seatDetailDialogRef);
  const [date, setDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [isBulkGenerateOpen, setIsBulkGenerateOpen] = useState(false);

  // Allocation Form State
  const [assignStudent, setAssignStudent] = useState('');
  const [assignSmartId, setAssignSmartId] = useState('');
  const [assignPhone, setAssignPhone] = useState('');
  const [assignShift, setAssignShift] = useState<(typeof SHIFT_OPTIONS)[number]>('Full Day');
  const [assignPlan, setAssignPlan] = useState(PLAN_OPTIONS[0]);
  const [assignLocker, setAssignLocker] = useState('');
  const [assignExpiry, setAssignExpiry] = useState(() => format(addDays(new Date(), 30), 'yyyy-MM-dd'));

  // Query
  const seatMatrixQuery = useAdminSeatMatrixSeatMatrix();
  const rawSeats = seatMatrixQuery.data ?? [];
  const isPending = seatMatrixQuery.isPending;

  // Sync in-page branch filter when header branch changes
  useEffect(() => {
    if (!isAllBranches && selectedBranch) {
      setActiveBranchFilter(selectedBranch.name);
    } else {
      setActiveBranchFilter('All Branches');
    }
  }, [isAllBranches, selectedBranch]);

  // Reset allocation form when selected seat changes
  useEffect(() => {
    if (selectedSeat && selectedSeat.status === 'free') {
      const generatedId = `SL-${selectedSeat.branchId || 'BR'}-${Date.now().toString().slice(-4)}`;
      setAssignStudent('');
      setAssignSmartId(generatedId);
      setAssignPhone('');
      setAssignShift('Full Day');
      setAssignPlan(PLAN_OPTIONS[0]);
      setAssignLocker(`L-${selectedSeat.id}`);
      setAssignExpiry(format(addDays(new Date(), 30), 'yyyy-MM-dd'));
    }
  }, [selectedSeat]);

  // Branch Scoped Seats
  const branchFilteredSeats = useMemo(() => {
    if (activeBranchFilter === 'All Branches') return rawSeats;
    const filterLower = activeBranchFilter.toLowerCase();
    return rawSeats.filter((seat) => {
      const bName = (seat.branchName || '').toLowerCase();
      const bId = (seat.branchId || '').toLowerCase();
      return bName.includes(filterLower) || filterLower.includes(bName) || bId.includes(filterLower);
    });
  }, [rawSeats, activeBranchFilter]);

  // Combined Filtered Seats (Shift Tab + Status Filter + Real Search Filter)
  const visible = useMemo(() => {
    return branchFilteredSeats.filter((seat) => {
      // 1. Shift Tab Filter
      if (activeTab !== 'All') {
        const dots = computeShiftOccupancy(seat);
        if (activeTab === 'Morning') {
          if (seat.status !== 'free' && seat.status !== 'maintenance' && !dots.morning) return false;
        } else if (activeTab === 'Afternoon') {
          if (seat.status !== 'free' && seat.status !== 'maintenance' && !dots.afternoon) return false;
        } else if (activeTab === 'Evening') {
          if (seat.status !== 'free' && seat.status !== 'maintenance' && !dots.evening) return false;
        } else if (activeTab === 'Night') {
          if (seat.status !== 'free' && seat.status !== 'maintenance' && !dots.night) return false;
        } else if (activeTab === 'Full Day') {
          if (seat.status !== 'free' && seat.status !== 'maintenance' && seat.shift !== 'Full Day') return false;
        }
      }

      // 2. Status Dropdown Filter
      if (statusFilter !== 'all') {
        if (seat.status !== statusFilter) return false;
      }

      // 3. Search Query Filter
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const matchesId = seat.id.toLowerCase().includes(q) || `s-${seat.id}`.toLowerCase().includes(q);
        const matchesStudent = Boolean(seat.student && seat.student.toLowerCase().includes(q));
        const matchesSmartId = Boolean(seat.smartId && seat.smartId.toLowerCase().includes(q));
        const matchesPhone = Boolean(seat.phone && seat.phone.toLowerCase().includes(q));
        const matchesPlan = Boolean(seat.plan && seat.plan.toLowerCase().includes(q));
        const matchesShift = Boolean(seat.shift && seat.shift.toLowerCase().includes(q));
        if (!matchesId && !matchesStudent && !matchesSmartId && !matchesPhone && !matchesPlan && !matchesShift) {
          return false;
        }
      }

      return true;
    });
  }, [branchFilteredSeats, activeTab, statusFilter, searchQuery]);

  // Overall Statistics for KPI Cards
  const stats = useMemo(() => {
    const total = branchFilteredSeats.length;
    const free = branchFilteredSeats.filter((s) => s.status === 'free').length;
    const occupied = branchFilteredSeats.filter((s) => s.status === 'occupied').length;
    const expiringOrMaint = branchFilteredSeats.filter((s) => s.status === 'expiring' || s.status === 'maintenance').length;
    const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;
    return { total, free, occupied, expiringOrMaint, occupancyRate };
  }, [branchFilteredSeats]);

  // Demo Mutation: Allocate Seat
  const handleAllocateSeat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeat) return;
    const studentName = assignStudent.trim();
    if (!studentName) {
      toast.error('Student name is required.');
      return;
    }
    const updatedSeat: AdminSeatMatrixSeatMatrixViewModel = {
      ...selectedSeat,
      status: 'occupied',
      student: studentName,
      smartId: assignSmartId.trim() || `SL-${selectedSeat.id}`,
      phone: assignPhone.trim() || '9876543210',
      shift: assignShift,
      plan: assignPlan,
      locker: assignLocker.trim() || undefined,
      validFrom: format(new Date(), 'yyyy-MM-dd'),
      expiry: assignExpiry,
    };

    queryClient.setQueryData<AdminSeatMatrixSeatMatrixViewModel[]>(queryKey, (current) => {
      const list = current && current.length > 0 ? current : generateFallbackSeatMatrix();
      return list.map((s) => (s.id === selectedSeat.id ? updatedSeat : s));
    });

    toast.success(`Seat S-${selectedSeat.id} successfully allocated to ${studentName}`);
    setSelectedSeat(null);
  };

  // Demo Mutation: Release/Vacate Seat
  const handleVacateSeat = () => {
    if (!selectedSeat) return;
    const updatedSeat: AdminSeatMatrixSeatMatrixViewModel = {
      ...selectedSeat,
      status: 'free',
      student: undefined,
      smartId: undefined,
      phone: undefined,
      shift: undefined,
      plan: undefined,
      locker: undefined,
      validFrom: undefined,
      expiry: undefined,
    };

    queryClient.setQueryData<AdminSeatMatrixSeatMatrixViewModel[]>(queryKey, (current) => {
      const list = current && current.length > 0 ? current : generateFallbackSeatMatrix();
      return list.map((s) => (s.id === selectedSeat.id ? updatedSeat : s));
    });

    toast.success(`Seat S-${selectedSeat.id} vacated and marked available`);
    setSelectedSeat(null);
  };

  // Demo Mutation: Toggle Maintenance
  const handleToggleMaintenance = (targetStatus: 'maintenance' | 'free') => {
    if (!selectedSeat) return;
    const updatedSeat: AdminSeatMatrixSeatMatrixViewModel = {
      ...selectedSeat,
      status: targetStatus,
      student: targetStatus === 'free' ? undefined : selectedSeat.student,
    };

    queryClient.setQueryData<AdminSeatMatrixSeatMatrixViewModel[]>(queryKey, (current) => {
      const list = current && current.length > 0 ? current : generateFallbackSeatMatrix();
      return list.map((s) => (s.id === selectedSeat.id ? updatedSeat : s));
    });

    if (targetStatus === 'maintenance') {
      toast.info(`Seat S-${selectedSeat.id} marked as under maintenance`);
    } else {
      toast.success(`Seat S-${selectedSeat.id} maintenance resolved. Marked available`);
    }
    setSelectedSeat(null);
  };

  // Quick Shift Change on Occupied Seat
  const handleQuickShiftChange = (nextShift: string) => {
    if (!selectedSeat) return;
    const updatedSeat: AdminSeatMatrixSeatMatrixViewModel = {
      ...selectedSeat,
      shift: nextShift,
    };

    queryClient.setQueryData<AdminSeatMatrixSeatMatrixViewModel[]>(queryKey, (current) => {
      const list = current && current.length > 0 ? current : generateFallbackSeatMatrix();
      return list.map((s) => (s.id === selectedSeat.id ? updatedSeat : s));
    });

    toast.success(`Shift for Seat S-${selectedSeat.id} updated to ${nextShift}`);
    setSelectedSeat(updatedSeat);
  };

  // CSV Export
  const downloadCsv = () => {
    const rows = [
      ['Seat ID', 'Branch', 'Status', 'Student Name', 'Smart ID', 'Phone', 'Shift', 'Plan', 'Locker', 'Valid From', 'Expires'],
      ...visible.map((seat) => [
        `S-${seat.id}`,
        seat.branchName || 'Downtown Central',
        seat.status,
        seat.student || '—',
        seat.smartId || '—',
        seat.phone || '—',
        seat.shift || '—',
        seat.plan || '—',
        seat.locker || '—',
        seat.validFrom || '—',
        seat.expiry || '—',
      ]),
    ];
    const csv = buildAdminSeatMatrixSeatMatrixCsv(rows);
    downloadAdminSeatMatrixCsv(`smart-library-seat-matrix-${activeBranchFilter.replaceAll(' ', '_')}-${date}.csv`, csv);
    toast.success(`Exported ${visible.length} seat records to CSV`);
  };

  // Formatted Excel (.xls) Export
  const downloadExcel = () => {
    const headers = ['Seat ID', 'Branch', 'Status', 'Student Name', 'Smart ID', 'Phone', 'Shift', 'Plan', 'Locker', 'Valid From', 'Expires'];
    const rows = visible.map((seat) => [
      `S-${seat.id}`,
      seat.branchName || 'Downtown Central',
      seat.status,
      seat.student || '—',
      seat.smartId || '—',
      seat.phone || '—',
      seat.shift || '—',
      seat.plan || '—',
      seat.locker || '—',
      seat.validFrom || '—',
      seat.expiry || '—',
    ]);
    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>SeatMatrix</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <style>
          table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
          th { background-color: #312e81; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #4338ca; text-align: left; }
          td { padding: 8px; border: 1px solid #cbd5e1; }
          tr:nth-child(even) { background-color: #eef2ff; }
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
    link.download = `smart-library-seat-matrix-${activeBranchFilter.replaceAll(' ', '_')}-${date}.xls`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(`Exported ${visible.length} seat records to Excel (.xls)`);
  };

  // Printable Floor Plan & Master Roster
  const printSeatMatrixRoster = () => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=950,height=750');
    if (!printWindow) { window.print(); return; }
    const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Smart Library - Seat Matrix & Floor Plan Roster</title>
          <style>
            @page { size: landscape; margin: 10mm; }
            body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #4338ca; padding-bottom: 10px; margin-bottom: 12px; }
            .title { font-size: 18px; font-weight: 800; text-transform: uppercase; color: #4338ca; }
            .subtitle { font-size: 12px; color: #64748b; margin-top: 2px; }
            .kpis { display: flex; gap: 16px; margin-bottom: 12px; }
            .kpi { padding: 8px 12px; background: #eef2ff; border-radius: 6px; font-size: 11px; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; }
            th { background-color: #e0e7ff; color: #3730a3; text-align: left; padding: 6px; border: 1px solid #c7d2fe; font-weight: 700; text-transform: uppercase; font-size: 10px; }
            td { padding: 6px; border: 1px solid #e2e8f0; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 600; text-transform: uppercase; }
            .badge-free { background: #dcfce7; color: #15803d; }
            .badge-occupied { background: #fee2e2; color: #b91c1c; }
            .badge-maintenance { background: #fef3c7; color: #b45309; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">Smart Library Network · Seat Matrix Master Roster</div>
              <div class="subtitle">Branch: ${activeBranchFilter} · Total Desks: ${visible.length}</div>
            </div>
            <div style="font-size: 11px; text-align: right; color: #475569;">
              <div><strong>Generated:</strong> ${dateStr}</div>
              <div><strong>Authority:</strong> Central Operations Desk</div>
            </div>
          </div>
          <div class="kpis">
            <div class="kpi">Total Desks: <strong>${stats.total}</strong></div>
            <div class="kpi">Available Free: <strong style="color:#15803d">${stats.free}</strong></div>
            <div class="kpi">Occupied: <strong style="color:#b91c1c">${stats.occupied}</strong></div>
            <div class="kpi">Occupancy Rate: <strong>${stats.occupancyRate}%</strong></div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Seat ID</th>
                <th>Branch</th>
                <th>Status</th>
                <th>Student Name</th>
                <th>Smart ID</th>
                <th>Phone</th>
                <th>Shift</th>
                <th>Plan Type</th>
                <th>Locker</th>
                <th>Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              ${visible.map((s) => `
                <tr>
                  <td><strong style="color:#4338ca;">S-${s.id}</strong></td>
                  <td>${s.branchName || 'Downtown Central'}</td>
                  <td><span class="badge badge-${s.status}">${s.status}</span></td>
                  <td>${s.student || '—'}</td>
                  <td>${s.smartId || '—'}</td>
                  <td>${s.phone || '—'}</td>
                  <td>${s.shift || '—'}</td>
                  <td>${s.plan || '—'}</td>
                  <td>${s.locker || '—'}</td>
                  <td>${s.expiry || '—'}</td>
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

  // Bulk Generate Action Handler
  const handleBulkGenerateSeats = (newSeats: AdminSeatMatrixSeatMatrixViewModel[]) => {
    queryClient.setQueryData<AdminSeatMatrixSeatMatrixViewModel[]>(queryKey, (current) => {
      const list = current && current.length > 0 ? current : generateFallbackSeatMatrix();
      const existingIds = new Set(list.map((s) => s.id));
      const filtered = newSeats.filter((s) => !existingIds.has(s.id));
      return [...list, ...filtered];
    });
  };

  // Table Columns
  const tableColumns = useMemo<readonly DataGridColumn<AdminSeatMatrixSeatMatrixViewModel>[]>(() => [
    {
      field: 'id',
      headerName: 'SEAT',
      minWidth: 100,
      sortable: true,
      cellRenderer: ({ data }) => (
        <span className="font-mono font-bold text-indigo-400">S-{data.id}</span>
      ),
    },
    {
      field: 'branchName',
      headerName: 'BRANCH',
      minWidth: 160,
      sortable: true,
      cellRenderer: ({ data }) => {
        const b = data.branchName || 'Downtown Central';
        const isDt = b.toLowerCase().includes('downtown');
        const isWs = b.toLowerCase().includes('westside');
        const cls = isDt
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
          : isWs
            ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
            : 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400';
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
            <Building2 size={11} /> {b}
          </span>
        );
      },
    },
    {
      field: 'status',
      headerName: 'STATUS',
      minWidth: 120,
      sortable: true,
      cellRenderer: ({ data }) => {
        const s = data.status;
        const cls =
          s === 'free'
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
            : s === 'occupied'
              ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
              : s === 'expiring'
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                : 'border-slate-700 bg-slate-800 text-slate-400';
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase ${cls}`}>
            <span className="size-1.5 rounded-full bg-current" />
            {s}
          </span>
        );
      },
    },
    {
      field: 'student',
      headerName: 'STUDENT',
      minWidth: 160,
      sortable: true,
      cellRenderer: ({ data }) => (
        <span className="font-semibold text-white">{data.student || '—'}</span>
      ),
    },
    {
      field: 'smartId',
      headerName: 'SMART ID',
      minWidth: 130,
      sortable: true,
      cellRenderer: ({ data }) => (
        <span className="font-mono text-xs text-slate-400">{data.smartId || '—'}</span>
      ),
    },
    {
      field: 'shift',
      headerName: 'SHIFT',
      minWidth: 130,
      sortable: true,
      cellRenderer: ({ data }) =>
        data.shift ? (
          <span className="inline-flex rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-300">
            {data.shift}
          </span>
        ) : (
          <span className="text-slate-500">—</span>
        ),
    },
    {
      field: 'plan',
      headerName: 'PLAN',
      minWidth: 180,
      sortable: true,
      cellRenderer: ({ data }) => (
        <span className="text-xs text-slate-300 truncate">{data.plan || '—'}</span>
      ),
    },
    {
      field: 'locker',
      headerName: 'LOCKER',
      minWidth: 100,
      sortable: true,
      cellRenderer: ({ data }) => (
        <span className="font-mono text-xs text-slate-400">{data.locker || '—'}</span>
      ),
    },
    {
      field: 'expiry',
      headerName: 'EXPIRES',
      minWidth: 120,
      sortable: true,
      cellRenderer: ({ data }) => (
        <span className="text-xs text-slate-300">{data.expiry || '—'}</span>
      ),
    },
    {
      headerName: 'ACTIONS',
      minWidth: 110,
      sortable: false,
      cellRenderer: ({ data }) => (
        <button
          type="button"
          onClick={() => setSelectedSeat(data)}
          className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition-colors"
        >
          Manage
        </button>
      ),
    },
  ], []);

  return (
    <div className="min-w-0 space-y-6">
      {/* ── Executive Header ── */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-5 md:p-6 shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Armchair size={24} className="text-indigo-400" />
              {activeBranchFilter === 'All Branches' ? 'Smart Library Network · Seat Matrix' : `${activeBranchFilter} · Floor Plan & Seat Matrix`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Visual desk layout, 4-shift real-time occupancy (Morning, Afternoon, Evening, Night), and student allocations
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle Button Group */}
            <div className="inline-flex items-center rounded-xl border border-slate-800 bg-slate-950/70 p-1">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'grid'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                  }`}
              >
                <LayoutGrid size={14} />
                <span>Floor Plan</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'table'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                  }`}
              >
                <List size={14} />
                <span>Table View</span>
              </button>
            </div>

            {/* Bulk Generate Seats */}
            <button
              type="button"
              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-indigo-500/25 hover:from-indigo-600 hover:to-indigo-700 transition-all cursor-pointer"
              onClick={() => setIsBulkGenerateOpen(true)}
              title="Bulk Generate consecutive desks for new hall/branch"
            >
              <Layers size={14} />
              <span>Bulk Generate Seats</span>
            </button>

            <button
              type="button"
              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-medium text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-colors shadow-xs"
              onClick={downloadCsv}
              title="Export Seat Matrix to CSV"
            >
              <Download size={14} strokeWidth={2} className="text-cyan-400" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300 hover:text-white hover:bg-emerald-500/20 transition-colors shadow-xs"
              onClick={downloadExcel}
              title="Export Formatted Seat Matrix to Excel (.xls)"
            >
              <FileSpreadsheet size={14} strokeWidth={2} className="text-emerald-400" />
              <span>Excel</span>
            </button>
            <button
              type="button"
              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors shadow-xs"
              onClick={printSeatMatrixRoster}
              title="Print Floor Plan & Seat Matrix Roster"
            >
              <Printer size={14} strokeWidth={2} className="text-slate-400" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 4 Glassmorphic KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Desks - Cyan */}
        <div className="group relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-[#081822]/95 via-[#081822]/90 to-[#0d2636]/80 shadow-cyan-950/30 p-5 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Total Desks</span>
            <div className="p-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/15 text-cyan-400 shrink-0 shadow-xs">
              <Armchair size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-3 text-3xl font-extrabold tracking-tight text-white tabular-nums">{stats.total}</p>
          <p className="relative z-10 mt-3 pt-2 border-t border-white/10 text-xs font-medium text-slate-400">
            {activeBranchFilter} capacity
          </p>
        </div>

        {/* Available Free - Emerald */}
        <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 shadow-emerald-950/30 p-5 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Available Free</span>
            <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shrink-0 shadow-xs">
              <CheckCircle2 size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-3 text-3xl font-extrabold tracking-tight text-emerald-400 tabular-nums">{stats.free}</p>
          <p className="relative z-10 mt-3 pt-2 border-t border-white/10 text-xs font-medium text-slate-400">Ready for instant allocation</p>
        </div>

        {/* Occupied Desks - Indigo */}
        <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 shadow-indigo-950/30 p-5 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Occupied Desks</span>
            <div className="p-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shrink-0 shadow-xs">
              <Users size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-3 text-3xl font-extrabold tracking-tight text-white tabular-nums">{stats.occupied}</p>
          <p className="relative z-10 mt-3 pt-2 border-t border-white/10 text-xs font-medium text-indigo-300">
            {stats.occupancyRate}% seat utilization
          </p>
        </div>

        {/* Maint. / Expiring - Amber */}
        <div className="group relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 shadow-amber-950/30 p-5 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Maint. / Expiring</span>
            <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400 shrink-0 shadow-xs">
              <AlertTriangle size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-3 text-3xl font-extrabold tracking-tight text-amber-400 tabular-nums">{stats.expiringOrMaint}</p>
          <p className="relative z-10 mt-3 pt-2 border-t border-white/10 text-xs font-medium text-slate-400">Action recommended</p>
        </div>
      </div>

      {/* ── Toolbar: Branch + Status + Search + Shifts ── */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-4 shadow-lg space-y-4">
        {/* Row 1: Shift Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Seat Shifts">
            {ADMIN_SEAT_MATRIX_SHIFTS.map((tab) => {
              const isSelected = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${isSelected
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'border border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-white'
                    }`}
                >
                  {tab === 'All' ? 'All Shifts' : tab}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-400 font-medium flex items-center gap-2">
            <Clock size={14} className="text-indigo-400" />
            <span>Shift Timings: M (08–12) • A (12–16) • E (16–20) • N (20–06)</span>
          </div>
        </div>

        {/* Row 2: Status Dropdown + Search Input */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            {/* Status Filter Dropdown */}
            <div className="relative">
              <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                aria-label="Filter seats by status"
                className="pl-8 pr-7 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950/70 text-slate-200 font-semibold focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="all">All Statuses ({branchFilteredSeats.length})</option>
                <option value="free">Available Free ({branchFilteredSeats.filter((s) => s.status === 'free').length})</option>
                <option value="occupied">Occupied Only ({branchFilteredSeats.filter((s) => s.status === 'occupied').length})</option>
                <option value="expiring">Expiring Soon ({branchFilteredSeats.filter((s) => s.status === 'expiring').length})</option>
                <option value="maintenance">Maintenance ({branchFilteredSeats.filter((s) => s.status === 'maintenance').length})</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search seat (S-01), student, phone, plan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950/70 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Showing {visible.length} of {branchFilteredSeats.length} Desks
            </span>
          </div>
        </div>
      </div>

      {/* ── Legend & Shift LEDs Guide ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 text-xs">
        <div className="flex flex-wrap items-center gap-5">
          <span className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Armchair size={14} className="text-indigo-400" /> Desk Status:
          </span>
          {ADMIN_SEAT_MATRIX_LEGEND_ITEMS.map((item) => (
            <div key={item.label} className="inline-flex items-center gap-2">
              <span className={`size-3 rounded-full shrink-0 ${item.dotCls}`} aria-hidden="true" />
              <span className="font-medium text-slate-200">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
          <span className="font-semibold text-slate-300">4 Shift LEDs:</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">M/A/E/N = Free</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">M/A/E/N = Booked</span>
        </div>
      </div>

      {/* ── Main View (Grid View or Table View) ── */}
      {viewMode === 'grid' ? (
        /* Floor Plan Grid View */
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Armchair size={17} className="text-indigo-400" />
              {activeBranchFilter === 'All Branches' ? 'Library Network Floor Plan' : `${activeBranchFilter} Floor Plan`}
            </h2>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-emerald-400 font-semibold">{visible.filter((s) => s.status === 'free').length} Free</span>
              <span className="text-slate-600">•</span>
              <span className="text-rose-400 font-semibold">{visible.filter((s) => s.status === 'occupied').length} Occupied</span>
            </div>
          </div>

          {isPending ? (
            <div className="py-16 text-center text-slate-400" role="status">Loading library floor plan…</div>
          ) : visible.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Armchair size={36} className="mx-auto text-slate-600" />
              <p className="text-sm font-semibold text-white">No desks found matching active filters</p>
              <p className="text-xs text-slate-400">Try adjusting your search query, shift, or branch selector.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 min-[440px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
              {visible.map((seat) => {
                const dots = computeShiftOccupancy(seat);
                const isFree = seat.status === 'free';
                const isOccupied = seat.status === 'occupied';
                const isExpiring = seat.status === 'expiring';
                const isMaint = seat.status === 'maintenance';

                const cardBorderBg = isFree
                  ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-900/30 hover:shadow-emerald-950/40 hover:scale-[1.03]'
                  : isOccupied
                    ? 'border-rose-500/40 bg-rose-950/20 text-rose-300 hover:border-rose-400 hover:bg-rose-900/30 hover:shadow-rose-950/40 hover:scale-[1.03]'
                    : isExpiring
                      ? 'border-amber-500/40 bg-amber-950/20 text-amber-300 hover:border-amber-400 hover:bg-amber-900/30 hover:shadow-amber-950/40 hover:scale-[1.03]'
                      : 'border-slate-700 bg-slate-900/50 text-slate-400 border-dashed hover:border-slate-600 hover:scale-[1.02]';

                const statusBadge = isFree
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : isOccupied
                    ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                    : isExpiring
                      ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                      : 'border-slate-700 bg-slate-800 text-slate-400';

                return (
                  <button
                    key={seat.uuid ?? seat.id}
                    type="button"
                    data-testid={`admin_seat_matrix-seat-${seat.id}`}
                    onClick={() => setSelectedSeat(seat)}
                    className={`group relative flex flex-col justify-between rounded-xl border p-2.5 text-xs font-semibold transition-all duration-200 cursor-pointer shadow-xs min-h-[105px] text-left ${cardBorderBg}`}
                    title={
                      seat.student
                        ? `${seat.student} (${seat.smartId || 'ID'}) · ${seat.shift || 'Full Day'} · Expires: ${seat.expiry || 'Active'}`
                        : isMaint
                          ? 'Under Maintenance'
                          : `Seat S-${seat.id} Available for Allocation`
                    }
                  >
                    {/* Top Row: Seat ID + Status Badge */}
                    <div className="flex items-center justify-between w-full">
                      <span className="font-mono text-xs font-bold tracking-wider text-white">S-{seat.id}</span>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-bold uppercase ${statusBadge}`}>
                        <span className="size-1 rounded-full bg-current" />
                        {seat.status === 'maintenance' ? 'Maint' : seat.status}
                      </span>
                    </div>

                    {/* Middle Row: Student Name or Available Action */}
                    <div className="my-1 w-full truncate">
                      {seat.student ? (
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-200">
                          <User size={11} className="text-indigo-400 shrink-0" />
                          <span className="truncate">{seat.student}</span>
                        </div>
                      ) : isMaint ? (
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-normal">
                          <Wrench size={10} className="text-amber-400" />
                          <span>Out of Order</span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                          <span>+ Allocate</span>
                        </div>
                      )}
                      <div className="text-[9px] text-slate-400 truncate mt-0.5">
                        {seat.branchName || 'Downtown'}
                      </div>
                    </div>

                    {/* Bottom Row: 4 Shift Glowing LED Indicators (M, A, E, N) */}
                    <div className="flex items-center justify-between w-full pt-1.5 border-t border-white/10 text-[9px] font-mono font-bold">
                      <span
                        title={`Morning: ${dots.morning ? 'Booked' : 'Free'}`}
                        className={`px-1 rounded ${dots.morning
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                      >
                        M
                      </span>
                      <span
                        title={`Afternoon: ${dots.afternoon ? 'Booked' : 'Free'}`}
                        className={`px-1 rounded ${dots.afternoon
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                      >
                        A
                      </span>
                      <span
                        title={`Evening: ${dots.evening ? 'Booked' : 'Free'}`}
                        className={`px-1 rounded ${dots.evening
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                      >
                        E
                      </span>
                      <span
                        title={`Night: ${dots.night ? 'Booked' : 'Free'}`}
                        className={`px-1 rounded ${dots.night
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                      >
                        N
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Table / Roster View */
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-5 shadow-xl space-y-4">
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40">
            <DataGrid
              rowData={visible}
              columnDefs={tableColumns}
              pagination
              pageSize={25}
              emptyMessage="No desks found matching active criteria"
            />
          </div>
        </div>
      )}

      {/* ── Interactive Seat Modal ── */}
      {selectedSeat && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
          role="presentation"
          onClick={() => setSelectedSeat(null)}
        >
          <div
            ref={seatDetailDialogRef}
            className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-white space-y-5 my-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="seat-detail-title"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div id="seat-detail-title" className="flex items-center justify-between pb-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
                  <Armchair size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Desk S-{selectedSeat.id}</h2>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Building2 size={12} className="text-indigo-400" />
                    {selectedSeat.branchName || 'Downtown Central'}
                  </p>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase ${selectedSeat.status === 'free'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : selectedSeat.status === 'occupied'
                      ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                      : selectedSeat.status === 'expiring'
                        ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                        : 'border-slate-700 bg-slate-800 text-slate-400'
                  }`}
              >
                <span className="size-1.5 rounded-full bg-current" />
                {selectedSeat.status}
              </span>
            </div>

            {/* Modal Body: Depends on Status */}
            {selectedSeat.status === 'free' ? (
              /* ALLOCATION FORM */
              <form onSubmit={handleAllocateSeat} className="space-y-4">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-300">
                  ✨ <strong>Desk is Available:</strong> Enter student details below to allocate this desk instantly.
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="admin-seat-student">
                    Student Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="admin-seat-student"
                    type="text"
                    required
                    value={assignStudent}
                    onChange={(e) => setAssignStudent(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="admin-seat-phone">
                      Mobile Number
                    </label>
                    <input
                      id="admin-seat-phone"
                      type="text"
                      value={assignPhone}
                      onChange={(e) => setAssignPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="admin-seat-smartid">
                      Smart ID / Card
                    </label>
                    <input
                      id="admin-seat-smartid"
                      type="text"
                      value={assignSmartId}
                      onChange={(e) => setAssignSmartId(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="admin-seat-shift">
                      Shift Timing
                    </label>
                    <select
                      id="admin-seat-shift"
                      value={assignShift}
                      onChange={(e) => setAssignShift(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
                    >
                      {SHIFT_OPTIONS.map((sh) => (
                        <option key={sh} value={sh}>
                          {sh}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="admin-seat-plan">
                      Membership Plan
                    </label>
                    <select
                      id="admin-seat-plan"
                      value={assignPlan}
                      onChange={(e) => setAssignPlan(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
                    >
                      {PLAN_OPTIONS.map((pl) => (
                        <option key={pl} value={pl}>
                          {pl}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="admin-seat-locker">
                      Locker (Optional)
                    </label>
                    <input
                      id="admin-seat-locker"
                      type="text"
                      value={assignLocker}
                      onChange={(e) => setAssignLocker(e.target.value)}
                      placeholder="e.g. L-04"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="admin-seat-expiry">
                      Valid Until Date
                    </label>
                    <input
                      id="admin-seat-expiry"
                      type="date"
                      value={assignExpiry}
                      onChange={(e) => setAssignExpiry(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleToggleMaintenance('maintenance')}
                    className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
                  >
                    Mark Maintenance
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedSeat(null)}
                      className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all"
                    >
                      <CheckCircle2 size={15} />
                      <span>Allocate Seat</span>
                    </button>
                  </div>
                </div>
              </form>
            ) : selectedSeat.status === 'occupied' || selectedSeat.status === 'expiring' ? (
              /* OCCUPIED / EXPIRING MANAGEMENT VIEW */
              <div className="space-y-4">
                {/* Student Card */}
                <div className="flex items-center gap-3.5 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="size-11 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-sm">
                    {selectedSeat.student?.slice(0, 2).toUpperCase() || 'ST'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">{selectedSeat.student}</h3>
                    <p className="font-mono text-xs text-slate-400 mt-0.5">{selectedSeat.smartId || 'No ID'}</p>
                  </div>
                  {selectedSeat.status === 'expiring' && (
                    <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 uppercase">
                      Expiring Soon
                    </span>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3">
                    <p className="text-[10px] font-semibold uppercase text-slate-400">Branch</p>
                    <p className="mt-1 font-semibold text-white">{selectedSeat.branchName || 'Downtown Central'}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3">
                    <p className="text-[10px] font-semibold uppercase text-slate-400">Shift Timing</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <select
                        value={selectedSeat.shift || 'Full Day'}
                        onChange={(e) => handleQuickShiftChange(e.target.value)}
                        className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-0.5 text-xs font-semibold text-indigo-300 focus:outline-none"
                      >
                        {SHIFT_OPTIONS.map((sh) => (
                          <option key={sh} value={sh}>{sh}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3">
                    <p className="text-[10px] font-semibold uppercase text-slate-400">Mobile Phone</p>
                    <p className="mt-1 font-mono font-semibold text-white">{selectedSeat.phone || '9876543210'}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3">
                    <p className="text-[10px] font-semibold uppercase text-slate-400">Locker Assigned</p>
                    <p className="mt-1 font-mono font-semibold text-white">{selectedSeat.locker || 'None'}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3">
                    <p className="text-[10px] font-semibold uppercase text-slate-400">Plan</p>
                    <p className="mt-1 font-semibold text-white truncate">{selectedSeat.plan || 'Full Day Dedicated Desk'}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3">
                    <p className="text-[10px] font-semibold uppercase text-slate-400">Expires</p>
                    <p className="mt-1 font-semibold text-white">{selectedSeat.expiry || 'Active'}</p>
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleVacateSeat}
                      className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-colors"
                    >
                      Release Desk (Vacate)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleMaintenance('maintenance')}
                      className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
                    >
                      Maintenance
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedSeat(null)}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* MAINTENANCE VIEW */
              <div className="space-y-4">
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                    <Wrench size={16} /> Desk Under Maintenance
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    This desk is marked as broken or undergoing repair. Students cannot book or sit at this desk until maintenance is resolved.
                  </p>
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedSeat(null)}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleMaintenance('free')}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all"
                  >
                    <CheckCircle2 size={15} />
                    <span>Mark Fixed & Available</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bulk Generate Seats Modal */}
      <AdminSeatsMatrixBulkGenerateModal
        isOpen={isBulkGenerateOpen}
        onClose={() => setIsBulkGenerateOpen(false)}
        onGenerate={handleBulkGenerateSeats}
        defaultBranchName={selectedBranch?.name || activeBranchFilter !== 'All Branches' ? activeBranchFilter : 'Downtown Central'}
        existingSeatIds={rawSeats.map((s) => s.id)}
      />
    </div>
  );
}

export default AdminSeatMatrixSeatMatrixPage;
