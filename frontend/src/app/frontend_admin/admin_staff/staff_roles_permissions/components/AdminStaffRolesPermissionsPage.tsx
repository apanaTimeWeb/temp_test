'use client';
// RESPONSIBILITY: AdminStaffRolesPermissionsPage presentation component owned by admin_staff_roles_permissions; responsibility folder: admin_staff_roles_permissions_components_views.

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  CheckCircle,
  Search,
  Shield,
  KeyRound,
  Lock,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Printer,
  RotateCcw,
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import AdminEmptyState from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveEmptyState';
import AdminStaffRolesPermissionsMatrixTable from '@/app/frontend_admin/admin_staff/staff_roles_permissions/components/AdminStaffRolesPermissionsMatrixTable';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import useAdminStaffRolesPermissionsState from '@/app/frontend_admin/admin_staff/staff_roles_permissions/hooks/useAdminStaffRolesPermissionsState';
import { saveAdminStaffRolesPermissionsDemoState } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/mocks/AdminStaffRolesPermissionsDemoState';

/** Shows permission definitions and an explicitly local demo preview; live permission edits require an approved host contract.
 * ACCESS_ROLES_NOTICE: Authorization remains a host/backend responsibility.
 */
export default function AdminStaffRolesPermissionsPage() {
  const t = useTranslations('ADMIN_STAFF_ROLES_PERMISSIONS');
  const demoMode = isFrontendDemoModeEnabled();
  const { permsQuery, perms, setPerms } = useAdminStaffRolesPermissionsState();
  const [searchQuery, setSearchQuery] = useState('');

  const kpis = useMemo(() => {
    let totalActions = 0;
    let enabledActions = 0;
    perms.forEach((mod) => {
      totalActions += mod.actions.length;
      mod.actions.forEach((act) => {
        if (act.roles && Object.values(act.roles).some(Boolean)) {
          enabledActions += 1;
        }
      });
    });
    return {
      moduleCount: perms.length,
      actionCount: totalActions,
      enabledCount: enabledActions,
    };
  }, [perms]);

  const filteredPerms = useMemo(() => {
    if (!searchQuery.trim()) return perms;
    const q = searchQuery.toLowerCase().trim();
    return perms
      .map((m) => {
        const matchesModule = m.module.toLowerCase().includes(q);
        const matchedActions = m.actions.filter(
          (a) => matchesModule || a.label.toLowerCase().includes(q) || a.key.toLowerCase().includes(q)
        );
        return {
          ...m,
          actions: matchedActions,
        };
      })
      .filter((m) => m.actions.length > 0);
  }, [perms, searchQuery]);

  const toggle = (moduleIndex: number, actionIndex: number, roleKey: string) => {
    if (!demoMode) return;
    setPerms((current) => current.map((module, currentModuleIndex) => currentModuleIndex === moduleIndex
      ? {
        ...module,
        actions: module.actions.map((action, currentActionIndex) => currentActionIndex === actionIndex
          ? { ...action, roles: { ...action.roles, [roleKey]: !action.roles[roleKey] } }
          : action),
      }
      : module));
  };

  const handleToggle = (filteredModIdx: number, filteredActIdx: number, roleKey: string) => {
    const mod = filteredPerms[filteredModIdx];
    if (!mod) return;
    const act = mod.actions[filteredActIdx];
    if (!act) return;
    const origModIdx = perms.findIndex((m) => m.module === mod.module);
    if (origModIdx === -1) return;
    const origActIdx = perms[origModIdx].actions.findIndex((a) => a.key === act.key);
    if (origActIdx === -1) return;
    toggle(origModIdx, origActIdx, roleKey);
  };

  const save = () => {
    if (!isFrontendDemoModeEnabled()) {
      toast.error(t('SAVE_HELP_BLOCKED'), { id: 'admin-permissions-save-blocked' });
      return;
    }
    saveAdminStaffRolesPermissionsDemoState(perms);
    toast.success(t('SAVE_DEMO_TOAST'), { id: 'admin-permissions-save-demo-only' });
  };

  const handleExportCsv = () => {
    if (perms.length === 0) return;
    const headers = ['Module', 'Action Key', 'Permission Label', 'Manager Access'];
    const rows: string[][] = [];
    perms.forEach((mod) => {
      mod.actions.forEach((act) => {
        const hasAccess = act.roles?.manager ?? false;
        rows.push([
          `"${mod.module}"`,
          `"${act.key}"`,
          `"${act.label.replace(/"/g, '""')}"`,
          hasAccess ? '"Enabled"' : '"Disabled"',
        ]);
      });
    });
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-staff-roles-permissions-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success('Exported Roles & Permissions matrix to CSV');
  };

  const handleExportExcel = () => {
    if (perms.length === 0) return;
    let tableRows = '';
    perms.forEach((mod) => {
      mod.actions.forEach((act) => {
        const hasAccess = act.roles?.manager ?? false;
        tableRows += `
          <tr>
            <td style="padding:6px;border:1px solid #ccc;font-weight:bold;">${mod.module}</td>
            <td style="padding:6px;border:1px solid #ccc;font-family:monospace;">${act.key}</td>
            <td style="padding:6px;border:1px solid #ccc;">${act.label}</td>
            <td style="padding:6px;border:1px solid #ccc;text-align:center;font-weight:bold;color:${hasAccess ? '#15803d' : '#b91c1c'};">${hasAccess ? 'GRANTED' : 'DENIED'}</td>
          </tr>`;
      });
    });

    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
          <title>Staff Roles & Permissions RBAC Matrix</title>
          <style>
            table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 11px; }
            th { background-color: #0f172a; color: #ffffff; padding: 8px; border: 1px solid #334155; text-align: left; }
            td { padding: 6px; border: 1px solid #cbd5e1; }
          </style>
        </head>
        <body>
          <h2>Smart Library Network · Staff RBAC Permissions Matrix</h2>
          <p>Generated: ${new Date().toLocaleString('en-IN')}</p>
          <table>
            <thead>
              <tr>
                <th>Module</th><th>Permission Key</th><th>Action Description</th><th>Manager Role</th>
              </tr>
            </thead>
            <tbody>${tableRows}</tbody>
          </table>
        </body>
      </html>`;
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-staff-roles-permissions-${new Date().toISOString().slice(0, 10)}.xls`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success('Exported Roles & Permissions matrix to Excel (.xls)');
  };

  const handlePrint = () => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) { window.print(); return; }
    const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    let tableRows = '';
    perms.forEach((mod) => {
      mod.actions.forEach((act) => {
        const hasAccess = act.roles?.manager ?? false;
        tableRows += `
          <tr>
            <td><strong>${mod.module}</strong></td>
            <td><code>${act.key}</code></td>
            <td>${act.label}</td>
            <td style="color:${hasAccess ? '#15803d' : '#b91c1c'};font-weight:bold;">${hasAccess ? '✓ Allowed' : '✕ Restricted'}</td>
          </tr>`;
      });
    });
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Smart Library - Staff RBAC Permissions Matrix</title>
          <style>
            body { font-family: system-ui, sans-serif; color: #0f172a; margin: 0; padding: 15px; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 8px; margin-bottom: 12px; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; }
            th { background: #f1f5f9; padding: 6px; border: 1px solid #cbd5e1; text-align: left; }
            td { padding: 6px; border: 1px solid #e2e8f0; }
            tr:nth-child(even) { background: #f8fafc; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h2 style="margin:0;">Smart Library Network · Staff Roles & Permissions</h2>
              <div style="font-size:12px;color:#64748b;">RBAC Matrix for Operations & Branch Management</div>
            </div>
            <div style="font-size:11px;text-align:right;">Date: ${dateStr}</div>
          </div>
          <table>
            <thead><tr><th>Module</th><th>Permission Key</th><th>Action</th><th>Manager Access</th></tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <>
      <Toaster position="bottom-right" richColors closeButton />
      <div className="space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-semibold text-text-secondary backdrop-blur-md">
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span>Access Control & Security</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{t('PAGE_TITLE')}</h1>
            <p className="text-sm text-text-secondary">{t('PAGE_SUBTITLE')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              disabled={perms.length === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-hover transition-colors shadow-xs"
              title="Print RBAC Permissions Matrix"
            >
              <Printer size={13} className="text-text-secondary" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={perms.length === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-hover transition-colors shadow-xs"
              title="Export Permissions Matrix (CSV)"
            >
              <Download size={13} className="text-text-secondary" />
              <span>CSV</span>
            </button>
            <button
              type="button"
              onClick={handleExportExcel}
              disabled={perms.length === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors shadow-xs"
              title="Export Permissions Matrix (Excel .xls)"
            >
              <FileSpreadsheet size={13} />
              <span>Excel</span>
            </button>
            <button
              type="button"
              className="admin-btn-primary min-h-11 self-start sm:self-auto"
              onClick={save}
              disabled={!demoMode || permsQuery.isPending || permsQuery.isError || perms.length === 0}
              aria-describedby="admin-permissions-save-help"
            >
              <CheckCircle size={18} strokeWidth={2} /> {t('SAVE_CHANGES')}
            </button>
          </div>
        </header>

        {/* Permission KPI Summary Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {/* Modules - Indigo */}
          <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 p-5 shadow-lg shadow-indigo-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-950/40">
            <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-indigo-500/10 blur-2xl transition-all duration-500 group-hover:bg-indigo-500/20" />
            <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
              <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <div className="relative flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Modules</span>
              <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-indigo-500/15 border-indigo-500/30 text-indigo-400">
                <Shield size={18} strokeWidth={2.2} />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-white">{kpis.moduleCount}</p>
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-indigo-300 bg-indigo-500/10 border-indigo-500/25">
                Domain Areas
              </span>
            </div>
          </div>

          {/* Actions - Cyan */}
          <div className="group relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-[#081822]/95 via-[#081822]/90 to-[#0d2636]/80 p-5 shadow-lg shadow-cyan-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-950/40">
            <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-cyan-500/10 blur-2xl transition-all duration-500 group-hover:bg-cyan-500/20" />
            <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
              <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <div className="relative flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Actions</span>
              <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-cyan-500/15 border-cyan-500/30 text-cyan-400">
                <KeyRound size={18} strokeWidth={2.2} />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-cyan-400">{kpis.actionCount}</p>
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-cyan-300 bg-cyan-500/10 border-cyan-500/25">
                Granular Permissions
              </span>
            </div>
          </div>

          {/* Active Rules - Emerald */}
          <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 p-5 shadow-lg shadow-emerald-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-950/40">
            <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl transition-all duration-500 group-hover:bg-emerald-500/20" />
            <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
              <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <div className="relative flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Rules</span>
              <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-emerald-500/15 border-emerald-500/30 text-emerald-400">
                <CheckCircle2 size={18} strokeWidth={2.2} />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-emerald-400">{kpis.enabledCount}</p>
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-emerald-300 bg-emerald-500/10 border-emerald-500/25">
                Enabled for Manager
              </span>
            </div>
          </div>

          {/* Model - Purple */}
          <div className="group relative overflow-hidden rounded-2xl border border-purple-500/25 bg-gradient-to-br from-[#180c28]/95 via-[#180c28]/90 to-[#221238]/80 p-5 shadow-lg shadow-purple-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-950/40">
            <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-purple-500/10 blur-2xl transition-all duration-500 group-hover:bg-purple-500/20" />
            <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
              <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <div className="relative flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Model</span>
              <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-purple-500/15 border-purple-500/30 text-purple-400">
                <Lock size={18} strokeWidth={2.2} />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-purple-400">RBAC</p>
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-purple-300 bg-purple-500/10 border-purple-500/25">
                Role Based Access
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p id="admin-permissions-save-help" className="text-sm text-text-secondary" role="status">
            {demoMode ? t('SAVE_HELP_DEMO') : t('SAVE_HELP_BLOCKED')}
          </p>
          <div className="relative min-w-[260px] max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search permissions by action or module..."
              className="w-full rounded-lg border border-border bg-card py-1.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {permsQuery.isError ? (
          <div role="alert" className="rounded-lg border border-border bg-card p-6 text-danger-text">
            <p>{demoMode ? t('LOAD_ERROR') : t('LIVE_UNAVAILABLE')}</p>
            <button type="button" className="mt-3 min-h-11 rounded border border-border px-3 py-2 text-primary" onClick={() => { void permsQuery.refetch(); }}>
              {t('RETRY')}
            </button>
          </div>
        ) : permsQuery.isPending ? (
          <div role="status" aria-live="polite" className="rounded-lg border border-border bg-card p-8 text-center text-text-secondary">
            {t('LOADING')}
          </div>
        ) : perms.length === 0 ? (
          <AdminEmptyState showIcon={false} title={t('EMPTY_TITLE')} description={t('EMPTY_DESCRIPTION')} />
        ) : filteredPerms.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center text-text-secondary">
            No permissions found matching "{searchQuery}".
          </div>
        ) : (
          <AdminStaffRolesPermissionsMatrixTable modules={filteredPerms} demoMode={demoMode} onToggle={handleToggle} />
        )}
      </div>
    </>
  );
}
