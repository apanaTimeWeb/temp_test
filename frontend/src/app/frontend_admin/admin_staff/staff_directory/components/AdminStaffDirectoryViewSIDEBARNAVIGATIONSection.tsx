'use client';
import AdminStaffDirectoryAuditSection from '@/app/frontend_admin/admin_staff/staff_directory/components/AdminStaffDirectoryAuditSection';
import AdminStaffDirectoryCreateManagerForm from '@/app/frontend_admin/admin_staff/staff_directory/components/AdminStaffDirectoryCreateManagerForm';
import AdminStaffDirectoryDetailLogsSection from '@/app/frontend_admin/admin_staff/staff_directory/components/AdminStaffDirectoryDetailLogsSection';
import { ADMIN_STAFF_DIRECTORY_STATUS_BADGE_CLASSES } from '@/app/frontend_admin/admin_staff/staff_directory/config/admin_staff_directory.url_config';
import type { AdminStaffDirectoryManager } from '@/app/frontend_admin/admin_staff/staff_directory/schemas/AdminStaffDirectorySchema';
import type { AdminStaffDirectoryManagerTableProps,AdminStaffDirectoryViewSIDEBARNAVIGATIONSectionMAINLISTVIEWSSectionProps,AdminStaffDirectoryViewSIDEBARNAVIGATIONSectionProps } from '@/app/frontend_admin/admin_staff/staff_directory/types/AdminStaffDirectoryComponentTypes';
import { getAdminStaffDirectoryLastActiveLabel,maskAdminStaffDirectoryEmail,maskAdminStaffDirectoryPhone } from '@/app/frontend_admin/admin_staff/staff_directory/utils/AdminStaffDirectoryDisplayUtils';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';
import { AlertCircle, ArrowDown, ArrowUp, ArrowUpDown, Download, Eye, FileSpreadsheet, Mail, MessageSquare, Printer, Search, UserCheck, Users, UserX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo,useState } from 'react';

// RESPONSIBILITY: AdminStaffDirectoryViewSIDEBARNAVIGATIONSection component owned by admin_staff_directory; responsibility folder: admin_staff_directory_view_sections.

/** Owns primary navigation buttons; the selected view is delegated to the feature's section orchestrator. */
export default function AdminStaffDirectoryViewSIDEBARNAVIGATIONSection({ model }: AdminStaffDirectoryViewSIDEBARNAVIGATIONSectionProps) {
  const t = useTranslations('ADMIN_STAFF_DIRECTORY');
  const { activeTab, setActiveTab, viewingManager, navItems, managerCounts } = model;

  return (
      <div className="space-y-6">
        {!viewingManager && (
          <>
            {/* Executive KPI Summary Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {/* Total Directory Count - Indigo */}
              <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 p-5 shadow-lg shadow-indigo-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-950/40">
                <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-indigo-500/10 blur-2xl transition-all duration-500 group-hover:bg-indigo-500/20" />
                <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
                  <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <div className="relative flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('PANEL_ALL')}</span>
                  <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-indigo-500/15 border-indigo-500/30 text-indigo-400">
                    <Users size={18} strokeWidth={2.2} />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold tracking-tight text-white">{managerCounts.all}</p>
                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-indigo-300 bg-indigo-500/10 border-indigo-500/25">
                    Total Directory Count
                  </span>
                </div>
              </div>

              {/* Active On-Duty - Emerald */}
              <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 p-5 shadow-lg shadow-emerald-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-950/40">
                <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl transition-all duration-500 group-hover:bg-emerald-500/20" />
                <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
                  <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <div className="relative flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('STATUS_ACTIVE')}</span>
                  <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-emerald-500/15 border-emerald-500/30 text-emerald-400">
                    <UserCheck size={18} strokeWidth={2.2} />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold tracking-tight text-emerald-400">{managerCounts.active}</p>
                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-emerald-300 bg-emerald-500/10 border-emerald-500/25">
                    Active On-Duty
                  </span>
                </div>
              </div>

              {/* Access Paused - Amber */}
              <div className="group relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 p-5 shadow-lg shadow-amber-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-950/40">
                <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-amber-500/10 blur-2xl transition-all duration-500 group-hover:bg-amber-500/20" />
                <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
                  <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <div className="relative flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('STATUS_SUSPENDED')}</span>
                  <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-amber-500/15 border-amber-500/30 text-amber-400">
                    <AlertCircle size={18} strokeWidth={2.2} />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold tracking-tight text-amber-400">{managerCounts.suspended}</p>
                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-amber-300 bg-amber-500/10 border-amber-500/25">
                    Access Paused
                  </span>
                </div>
              </div>

              {/* Offboarded - Rose */}
              <div className="group relative overflow-hidden rounded-2xl border border-rose-500/25 bg-gradient-to-br from-[#1f0a10]/95 via-[#1f0a10]/90 to-[#2d0e17]/80 p-5 shadow-lg shadow-rose-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-rose-500/40 hover:shadow-xl hover:shadow-rose-950/40">
                <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-rose-500/10 blur-2xl transition-all duration-500 group-hover:bg-rose-500/20" />
                <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
                  <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <div className="relative flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('STATUS_DEACTIVATED')}</span>
                  <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-rose-500/15 border-rose-500/30 text-rose-400">
                    <UserX size={18} strokeWidth={2.2} />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold tracking-tight text-rose-400">{managerCounts.deactivated}</p>
                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-rose-300 bg-rose-500/10 border-rose-500/25">
                    Offboarded
                  </span>
                </div>
              </div>
            </div>

            <nav aria-label={t('NAVIGATION_LABEL')} className="admin-card flex flex-wrap gap-2">
              {navItems.map((item) => (
                <button type="button" data-testid={`admin_staff_directory-AdminStaffDirectoryViewSIDEBARNAVIGATIONSection-navigation-${item.id}`} key={item.id}
                  aria-current={activeTab === item.id ? 'page' : undefined} aria-pressed={activeTab === item.id}
                  onClick={() => setActiveTab(item.id)} className={`admin-tab-button min-h-11 ${activeTab === item.id ? 'admin-tab-button-active' : ''}`}>
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md transition-transform ${activeTab === item.id ? 'bg-primary/20 text-primary shadow-xs' : 'bg-muted/60 text-text-secondary'}`}>
                    <item.icon size={15} aria-hidden="true" />
                  </span>
                  {t(item.labelKey)}
                </button>
              ))}
            </nav>
          </>
        )}
        <AdminStaffDirectoryViewSIDEBARNAVIGATIONSectionMAINLISTVIEWSSection model={model} />
      </div>
      );
}

      export type { AdminStaffDirectoryViewSIDEBARNAVIGATIONSectionProps };

      // RESPONSIBILITY: AdminStaffDirectoryViewSIDEBARNAVIGATIONSectionMAINLISTVIEWSSection component owned by admin_staff_directory; responsibility folder: admin_staff_directory_view_sidebarnavigationsection_sections.

      /** Route-level composition only; list, audit, form and selected-manager detail visual sections are independently owned. */
      export function AdminStaffDirectoryViewSIDEBARNAVIGATIONSectionMAINLISTVIEWSSection({model}: AdminStaffDirectoryViewSIDEBARNAVIGATIONSectionMAINLISTVIEWSSectionProps) {
  const t = useTranslations('ADMIN_STAFF_DIRECTORY');
      const {activeTab, viewingManager, managerDetailTab, setManagerDetailTab, dummyManagers, isDemoMode, handleAddManager, openManagerDetails} = model;
      const listTab = activeTab === 'all' || activeTab === 'staff' || activeTab === 'active' || activeTab === 'suspended' || activeTab === 'deactivated' ? activeTab : null;
      const auditTab = activeTab === 'sessions' || activeTab === 'history' || activeTab === 'activity' ? activeTab : null;

      return (
      <div>
        {!viewingManager && listTab && <AdminStaffDirectoryManagerTable tab={listTab} managers={dummyManagers} onSelectManager={openManagerDetails} onUpdateStatus={model.handleUpdateManagerStatus} />}

        {!viewingManager && activeTab === 'add' && !isDemoMode && (
          <section className="admin-card p-5" role="status" aria-labelledby="admin-staff-users-create-blocked-title">
            <h2 id="admin-staff-users-create-blocked-title" className="text-lg font-semibold text-text-primary">{t('ADD_BLOCKED_TITLE')}</h2>
            <p className="mt-2 text-text-secondary">{t('ADD_BLOCKED_DESCRIPTION')}</p>
          </section>
        )}
        {!viewingManager && activeTab === 'add' && isDemoMode && <AdminStaffDirectoryCreateManagerForm onCreate={handleAddManager} canCreate={model.isDemoMode} />}

        {!viewingManager && auditTab && (isDemoMode
          ? <AdminStaffDirectoryAuditSection tab={auditTab} />
          : <section className="admin-card p-5" role="status"><h2 className="text-lg font-semibold text-text-primary">{t('AUDIT_UNAVAILABLE_TITLE')}</h2><p className="mt-2 text-text-secondary">{t('AUDIT_UNAVAILABLE_DESCRIPTION')}</p></section>)}

        {!isDemoMode && viewingManager && managerDetailTab !== 'overview' && <div className="admin-card mt-4 p-4 text-warning-text" role="status">{t('DETAIL_HISTORY_BLOCKED')}</div>}
        {viewingManager && <AdminStaffDirectoryDetailLogsSection model={model} onBack={() => setManagerDetailTab('overview')} />}
      </div>
      );
}

      export type { AdminStaffDirectoryViewSIDEBARNAVIGATIONSectionMAINLISTVIEWSSectionProps };

      // RESPONSIBILITY: AdminStaffDirectoryManagerTable component owned by admin_staff_directory; responsibility folder: admin_staff_directory_components_tables.

      /** Renders one manager status table; unsupported row actions remain disabled until their API behavior is verified. */
      export function AdminStaffDirectoryManagerTable({managers, filterStatus, tab, onSelectManager, onUpdateStatus}: AdminStaffDirectoryManagerTableProps) {
  const t = useTranslations('ADMIN_STAFF_DIRECTORY');
      type ManagerSortField = 'name' | 'email' | 'branch' | 'lastActive' | 'status';
      const [sortField, setSortField] = useState<ManagerSortField | null>(null);
      const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
      const [page, setPage] = useAdminApplicationInfrastructureUrlQueryState<number>('page', 0);
        const [pageSize, setPageSize] = useState(10);
        const [search, setSearch] = useState('');

  const toggleSort = (field: ManagerSortField) => {
          setPage(0);
        if (sortField === field) {
          setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
          setSortField(field);
        setSortDirection('asc');
    }
  };

  const handleExportCsv = () => {
    if (sortedManagers.length === 0) return;
    const headers = ['Staff ID', 'Name', 'Username', 'Role', 'Email', 'Phone', 'Branch', 'Status', 'Last Active'];
    const rows = sortedManagers.map((m) => [
      `"${m.id}"`,
      `"${m.name.replace(/"/g, '""')}"`,
      `"${m.username}"`,
      `"${m.role || 'Staff'}"`,
      `"${m.email}"`,
      `"${m.phone}"`,
      `"${m.branch}"`,
      `"${m.status}"`,
      `"${m.lastActive}"`,
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-staff-roster-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleExportExcel = () => {
    if (sortedManagers.length === 0) return;
    const rows = sortedManagers
      .map(
        (m) => `
      <tr>
        <td style="padding:6px;border:1px solid #ccc;font-family:monospace;">${m.id}</td>
        <td style="padding:6px;border:1px solid #ccc;font-weight:bold;">${m.name}</td>
        <td style="padding:6px;border:1px solid #ccc;">@${m.username}</td>
        <td style="padding:6px;border:1px solid #ccc;">${m.role || 'Staff'}</td>
        <td style="padding:6px;border:1px solid #ccc;">${m.email}</td>
        <td style="padding:6px;border:1px solid #ccc;font-family:monospace;">${m.phone}</td>
        <td style="padding:6px;border:1px solid #ccc;">${m.branch}</td>
        <td style="padding:6px;border:1px solid #ccc;font-weight:bold;">${m.status}</td>
        <td style="padding:6px;border:1px solid #ccc;">${m.lastActive}</td>
      </tr>`
      )
      .join('');
    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="utf-8"/><title>Staff Directory Roster</title></head>
        <body>
          <h2>Smart Library Network - Staff Directory Roster</h2>
          <p>Generated: ${new Date().toLocaleString('en-IN')}</p>
          <table border="1" style="border-collapse:collapse;font-family:sans-serif;font-size:12px;">
            <thead>
              <tr style="background-color:#1e293b;color:#ffffff;font-weight:bold;text-align:left;">
                <th style="padding:8px;border:1px solid #ccc;">Staff ID</th>
                <th style="padding:8px;border:1px solid #ccc;">Name</th>
                <th style="padding:8px;border:1px solid #ccc;">Username</th>
                <th style="padding:8px;border:1px solid #ccc;">Role</th>
                <th style="padding:8px;border:1px solid #ccc;">Email</th>
                <th style="padding:8px;border:1px solid #ccc;">Phone</th>
                <th style="padding:8px;border:1px solid #ccc;">Branch</th>
                <th style="padding:8px;border:1px solid #ccc;">Status</th>
                <th style="padding:8px;border:1px solid #ccc;">Last Active</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>`;
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-staff-roster-${new Date().toISOString().slice(0, 10)}.xls`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handlePrint = () => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) { window.print(); return; }
    const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Smart Library - Staff Directory Roster</title>
          <style>
            @page { size: landscape; margin: 10mm; }
            body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 8px; margin-bottom: 12px; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; }
            th { background: #f1f5f9; padding: 6px; border: 1px solid #cbd5e1; text-align: left; }
            td { padding: 6px; border: 1px solid #e2e8f0; }
            tr:nth-child(even) { background: #f8fafc; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h2 style="margin:0;">Smart Library Network · Staff Roster</h2>
              <div style="font-size:12px;color:#64748b;">Total Staff Records: ${sortedManagers.length}</div>
            </div>
            <div style="font-size:11px;text-align:right;">
              <div>Date: ${dateStr}</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Staff Name</th><th>Role</th><th>Email</th><th>Phone</th><th>Branch</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${sortedManagers.map((m) => `
                <tr>
                  <td><code>${m.id}</code></td>
                  <td><strong>${m.name}</strong> (@${m.username})</td>
                  <td>${m.role || 'Staff'}</td>
                  <td>${m.email}</td>
                  <td>${m.phone}</td>
                  <td>${m.branch}</td>
                  <td><strong>${m.status}</strong></td>
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

        const tabTitleKey = {all: 'PANEL_ALL', staff: 'PANEL_STAFF', active: 'PANEL_ACTIVE', suspended: 'PANEL_SUSPENDED', deactivated: 'PANEL_DEACTIVATED' } as const;
        const tabFilterStatus: Partial<Record<NonNullable<typeof tab>, AdminStaffDirectoryManager['status']>> = {active: 'Active', suspended: 'Suspended', deactivated: 'Deactivated' };
          const effectiveFilterStatus = filterStatus ?? (tab ? tabFilterStatus[tab] : undefined);
  const filteredManagers = useMemo(() => {
            let result = managers;
          if (tab === 'all') {
            result = result.filter((m) => !m.id.startsWith('STF'));
    } else if (tab === 'staff') {
            result = result.filter((m) => m.id.startsWith('STF') || (m.role && m.role !== 'Branch Manager'));
    }
          if (effectiveFilterStatus) {
            result = result.filter((m) => m.status === effectiveFilterStatus);
    }
          const q = search.trim().toLowerCase();
          if (q) {
            result = result.filter((m) =>
              m.name.toLowerCase().includes(q) ||
              m.username.toLowerCase().includes(q) ||
              m.email.toLowerCase().includes(q) ||
              m.phone.toLowerCase().includes(q) ||
              m.branch.toLowerCase().includes(q) ||
              (m.role ? m.role.toLowerCase().includes(q) : false)
            );
    }
          return result;
  }, [effectiveFilterStatus, managers, tab, search]);

  const sortedManagers = useMemo(() => {
    if (!sortField) return filteredManagers;
    return [...filteredManagers].sort((a, b) => {
      const aVal = a[sortField];
          const bVal = b[sortField];
          if (typeof aVal === 'string' && typeof bVal === 'string') {
        const cmp = aVal.localeCompare(bVal, undefined, {numeric: true, sensitivity: 'base' });
          return sortDirection === 'asc' ? cmp : -cmp;
      }
          return 0;
    });
  }, [filteredManagers, sortField, sortDirection]);

          const pageCount = Math.max(1, Math.ceil(sortedManagers.length / pageSize));
          const currentPage = Math.min(page, pageCount - 1);
          const visibleManagers = sortedManagers.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const renderSortableHeader = (field: ManagerSortField, label: string) => {
    const isActive = sortField === field;
          return (
          <th scope="col" aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} className="px-4 py-3 whitespace-nowrap">
            <button
              type="button"
              onClick={() => toggleSort(field)}
              className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1"
              aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
            >
              <span>{label}</span>
              {isActive ? (
                sortDirection === 'asc' ? (
                  <ArrowUp className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
                ) : (
                  <ArrowDown className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
                )
              ) : (
                <ArrowUpDown className="text-text-secondary opacity-40 group-hover:opacity-100 transition-opacity shrink-0" size={14} aria-hidden="true" />
              )}
            </button>
          </th>
          );
  };

          const tableContent = (
          <div>
            <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[240px] max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input maxLength={100}
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(0);
                  }}
                  placeholder="Search staff by name, email, phone, branch..."
                  aria-label="Search staff directory"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-input text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Roster Controls: Export & Print */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  disabled={sortedManagers.length === 0}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-hover transition-colors disabled:opacity-40"
                  title="Print Staff Roster"
                >
                  <Printer size={13} className="text-text-secondary" />
                  <span>Print Roster</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportCsv}
                  disabled={sortedManagers.length === 0}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-hover transition-colors disabled:opacity-40"
                  title="Export Staff CSV"
                >
                  <Download size={13} className="text-text-secondary" />
                  <span>CSV</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportExcel}
                  disabled={sortedManagers.length === 0}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-40"
                  title="Export Staff Excel"
                >
                  <FileSpreadsheet size={13} />
                  <span>Excel</span>
                </button>
              </div>
            </div>
            {filteredManagers.length === 0 ? (
              <p className="p-6 text-text-secondary" role="status">{t('NO_RECORDS')}</p>
            ) : (
        <>
                <div className="space-y-3 p-3 md:hidden">
                  {visibleManagers.map((manager) => (
                    <article key={manager.id} className="rounded-lg border border-border p-4">
                      <div className="flex items-start justify-between gap-3"><div className="min-w-0"><button type="button" className="break-words font-semibold text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => onSelectManager(manager)}>{manager.name}</button><p className="text-xs text-text-secondary">@{manager.username}{manager.role ? ` · ${manager.role}` : ''}</p></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${ADMIN_STAFF_DIRECTORY_STATUS_BADGE_CLASSES[manager.status]}`}>{({ Active: t('STATUS_ACTIVE'), Suspended: t('STATUS_SUSPENDED'), Deactivated: t('STATUS_DEACTIVATED') } as const)[manager.status]}</span></div>
                      <dl className="mt-3 grid grid-cols-1 gap-2 text-sm"><div><dt className="text-text-secondary">{t('TABLE_CONTACT')}</dt><dd className="break-words">{maskAdminStaffDirectoryEmail(manager.email)} · {maskAdminStaffDirectoryPhone(manager.phone)}</dd></div><div><dt className="text-text-secondary">{t('TABLE_BRANCH')}</dt><dd>{manager.branch}</dd></div><div><dt className="text-text-secondary">{t('TABLE_LAST_ACTIVE')}</dt><dd>{getAdminStaffDirectoryLastActiveLabel(manager.lastActive, t)}</dd></div></dl>
                      <div className="mt-3 flex flex-wrap gap-2 items-center">
                        <button type="button" className="min-h-10 rounded-md border border-border px-3 text-sm font-medium" onClick={() => onSelectManager(manager)}>{t('VIEW_MANAGER', { name: manager.name })}</button>
                        <a
                          href={`https://wa.me/91${manager.phone.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(`Hello ${manager.name}, this is regarding Library Administration.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-10 px-3 items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20"
                          title={`WhatsApp ${manager.name}`}
                          aria-label={`WhatsApp ${manager.name}`}
                        >
                          <MessageSquare size={13} />
                          <span>WhatsApp</span>
                        </a>
                        <a
                          href={`mailto:${manager.email}?subject=${encodeURIComponent('Official Communication - Library Administration')}`}
                          className="inline-flex min-h-10 px-3 items-center gap-1.5 rounded-md border border-sky-500/30 bg-sky-500/10 text-xs font-semibold text-sky-400 hover:bg-sky-500/20"
                          title={`Email ${manager.name}`}
                          aria-label={`Email ${manager.name}`}
                        >
                          <Mail size={13} />
                          <span>Email</span>
                        </a>
                        {onUpdateStatus && manager.status === 'Active' && (
                          <>
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(manager.id, 'Suspended')}
                              className="inline-flex min-h-10 px-2.5 items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 text-xs font-semibold text-amber-300 hover:bg-amber-500/20"
                              title="Suspend staff account"
                            >
                              <AlertCircle size={13} />
                              <span>Suspend</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(manager.id, 'Deactivated')}
                              className="inline-flex min-h-10 px-2.5 items-center gap-1 rounded-md border border-rose-500/30 bg-rose-500/10 text-xs font-semibold text-rose-300 hover:bg-rose-500/20"
                              title="Deactivate staff account"
                            >
                              <UserX size={13} />
                              <span>Deactivate</span>
                            </button>
                          </>
                        )}
                        {onUpdateStatus && manager.status === 'Suspended' && (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(manager.id, 'Active')}
                            className="inline-flex min-h-10 px-2.5 items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20"
                            title="Activate staff account"
                          >
                            <UserCheck size={13} />
                            <span>Activate</span>
                          </button>
                        )}
                        {onUpdateStatus && manager.status === 'Deactivated' && (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(manager.id, 'Active')}
                            className="inline-flex min-h-10 px-2.5 items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20"
                            title="Reactivate staff account"
                          >
                            <UserCheck size={13} />
                            <span>Reactivate</span>
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="h-12 bg-muted/60 uppercase text-xs text-text-secondary font-semibold border-b border-border">
                          {renderSortableHeader('name', t('TABLE_MANAGER'))}
                          {renderSortableHeader('email', t('TABLE_CONTACT'))}
                          {renderSortableHeader('branch', t('TABLE_BRANCH'))}
                          {renderSortableHeader('lastActive', t('TABLE_LAST_ACTIVE'))}
                          {renderSortableHeader('status', t('TABLE_STATUS'))}
                          <th scope="col" className="px-4 py-3 text-right">{t('TABLE_ACTIONS')}</th>
                        </tr>
                    </thead>
                    <tbody>{visibleManagers.map((manager) => (
                      <tr key={manager.id} className="h-12 border-b border-border text-text-primary motion-safe:transition-colors hover:bg-surface-hover even:bg-surface-zebra">
                        <th scope="row" className="px-4 py-3 font-medium text-text-primary">
                          <button type="button" className="underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => onSelectManager(manager)}>{manager.name}</button>
                          <span className="block text-xs font-normal text-text-secondary">@{manager.username}{manager.role ? ` · ${manager.role}` : ''}</span>
                        </th>
                        <td className="px-4 py-3"><span className="block">{maskAdminStaffDirectoryEmail(manager.email)}</span><span className="text-text-secondary">{maskAdminStaffDirectoryPhone(manager.phone)}</span></td>
                        <td className="px-4 py-3">{manager.branch}</td>
                        <td className="px-4 py-3">{getAdminStaffDirectoryLastActiveLabel(manager.lastActive, t)}</td>
                        <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ADMIN_STAFF_DIRECTORY_STATUS_BADGE_CLASSES[manager.status]}`}>{({ Active: t('STATUS_ACTIVE'), Suspended: t('STATUS_SUSPENDED'), Deactivated: t('STATUS_DEACTIVATED') } as const)[manager.status]}</span></td>
                          <td className="px-4 py-3"><div className="flex justify-end items-center gap-1.5">
                            {/* WhatsApp Staff */}
                            <a
                              href={`https://wa.me/91${manager.phone.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(`Hello ${manager.name}, this is regarding Library Administration.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 hover:text-white transition-all shadow-xs"
                              title={`WhatsApp ${manager.name}`}
                              aria-label={`WhatsApp ${manager.name}`}
                            >
                              <MessageSquare size={14} />
                            </a>

                            {/* Email Staff */}
                            <a
                              href={`mailto:${manager.email}?subject=${encodeURIComponent('Official Communication - Library Administration')}`}
                              className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 hover:border-sky-500/50 hover:text-white transition-all shadow-xs"
                              title={`Email ${manager.name}`}
                              aria-label={`Email ${manager.name}`}
                            >
                              <Mail size={14} />
                            </a>

                            {/* View Manager */}
                            <button type="button" aria-label={t('VIEW_MANAGER', { name: manager.name })} className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-lg border border-border bg-card text-text-secondary hover:text-text-primary hover:bg-surface-hover hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:transition-all" onClick={() => onSelectManager(manager)}><Eye size={15} strokeWidth={2} /></button>

                            {/* Status Control Actions */}
                            {onUpdateStatus && manager.status === 'Active' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => onUpdateStatus(manager.id, 'Suspended')}
                                  className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[11px] font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
                                  title="Suspend staff account"
                                >
                                  <AlertCircle size={12} />
                                  <span>Suspend</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onUpdateStatus(manager.id, 'Deactivated')}
                                  className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-[11px] font-semibold text-rose-300 hover:bg-rose-500/20 transition-colors"
                                  title="Deactivate staff account"
                                >
                                  <UserX size={12} />
                                  <span>Deactivate</span>
                                </button>
                              </>
                            )}
                            {onUpdateStatus && manager.status === 'Suspended' && (
                              <button
                                type="button"
                                onClick={() => onUpdateStatus(manager.id, 'Active')}
                                className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                                title="Activate staff account"
                              >
                                <UserCheck size={12} />
                                <span>Activate</span>
                              </button>
                            )}
                            {onUpdateStatus && manager.status === 'Deactivated' && (
                              <button
                                type="button"
                                onClick={() => onUpdateStatus(manager.id, 'Active')}
                                className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                                title="Reactivate staff account"
                              >
                                <UserCheck size={12} />
                                <span>Reactivate</span>
                              </button>
                            )}
                          </div></td>
                        </tr>
              ))}</tbody>
                      </table>
          </div>
                    <p id="admin-staff-users-row-actions-help" className="sr-only">{t('ROW_ACTIONS_BLOCKED')}</p>
                    <AdminTablePagination
                      page={currentPage}
                      pageSize={pageSize}
                      totalRows={filteredManagers.length}
                      onPageChange={setPage}
                      onPageSizeChange={(newPageSize) => {
                        setPageSize(newPageSize);
                        setPage(0);
                      }}
                    />
                  </>
      )}
                </div>
                );
                return tab ? <section className="admin-card"><h2 className="p-4 text-lg font-semibold text-text-primary">{t(tabTitleKey[tab])}</h2>{tableContent}</section> : tableContent;
}

                export type { AdminStaffDirectoryManagerTableProps };
