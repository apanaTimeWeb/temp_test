'use client';
import AdminPlansDeleteDialog from '@/app/frontend_admin/admin_members/members_plans/components/AdminMembersPlansDeleteDialog';
import AdminPlansFormDialog from '@/app/frontend_admin/admin_members/members_plans/components/AdminMembersPlansFormDialog';
import { ADMIN_PLANS_STATUS_VALUES } from '@/app/frontend_admin/admin_members/members_plans/config/admin_members_plans.url_config';
import { useAdminPlans } from '@/app/frontend_admin/admin_members/members_plans/hooks/useAdminMembersPlansMain';
import type { AdminPlansFormValues,AdminPlansPlan } from '@/app/frontend_admin/admin_members/members_plans/schemas/AdminMembersPlansSchema';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { Building2,CheckCircle,Clock,Download,FileSpreadsheet,Layers,Pencil,Plus,Printer,Search,Trash2,Users } from 'lucide-react';
import { useLocale,useTranslations } from 'next-intl';
import { useCallback,useMemo,useState } from 'react';
import { toast } from 'sonner';

import type { AdminPlansEmptyStateProps } from '@/app/frontend_admin/admin_members/members_plans/types/AdminMembersPlansComponentTypes';

// RESPONSIBILITY: Owns the admin membership-plans page composition and local demo-only actions.

/** Formats prices only when the source record explicitly declares currency and unit. */
export function formatAdminPlansPrice(amount: number, currencyCode: string | undefined, amountUnit: 'minor' | 'major' | undefined, locale: string): string {
  if (!currencyCode || !/^[A-Z]{3}$/.test(currencyCode) || amountUnit === undefined || !Number.isFinite(amount) || amount < 0) return '—';
  const resolvedLocale = locale === 'hi' ? 'hi-IN' : locale === 'en' ? 'en-IN' : locale;
  const formatter = new Intl.NumberFormat(resolvedLocale, { style: 'currency', currency: currencyCode });
  const fractionDigits = formatter.resolvedOptions().maximumFractionDigits ?? 2;
  if (amountUnit === 'minor' && !Number.isSafeInteger(amount)) return '—';
  const major = amountUnit === 'minor' ? amount / (10 ** fractionDigits) : amount;
  return formatter.format(major);
}

/** Performs an immutable insert-or-replace in page-local demo state. */
export function upsertAdminPlansDemoPlan(plans: readonly AdminPlansPlan[], nextPlan: AdminPlansPlan): AdminPlansPlan[] {
  const exists = plans.some((plan) => plan.id === nextPlan.id);
  return exists ? plans.map((plan) => plan.id === nextPlan.id ? nextPlan : plan) : [nextPlan, ...plans];
}

/** Removes only the requested plan from page-local demo state. */
export function removeAdminPlansDemoPlan(plans: readonly AdminPlansPlan[], planId: string): AdminPlansPlan[] {
  return plans.filter((plan) => plan.id !== planId);
}

const DEFAULT_DEMO_PLANS: AdminPlansPlan[] = [
  {
    id: 'demo-plan-1',
    name: 'Full Day Dedicated Desk',
    price: 6500,
    currencyCode: 'INR',
    amountUnit: 'major',
    duration: 'Monthly',
    durationDays: 30,
    features: ['Reserved personal desk & ergonomic chair', 'High-speed Wi-Fi & power socket', 'Free tea/coffee & locker included'],
    status: 'Active',
    subscribers: 28,
    branchApplicability: 'Downtown Central',
  },
  {
    id: 'demo-plan-2',
    name: 'Flexi Shift Half Day',
    price: 3800,
    currencyCode: 'INR',
    amountUnit: 'major',
    duration: 'Monthly',
    durationDays: 30,
    features: ['6-hour flexible access morning or evening', 'High-speed Wi-Fi & silent zone', 'Cafeteria access'],
    status: 'Active',
    subscribers: 42,
    branchApplicability: 'All Branches',
  },
  {
    id: 'demo-plan-3',
    name: 'Night Owl Special',
    price: 3200,
    currencyCode: 'INR',
    amountUnit: 'major',
    duration: 'Monthly',
    durationDays: 30,
    features: ['10 PM to 6 AM uninterrupted access', 'Dedicated charging slot', 'Security & CCTV guarded'],
    status: 'Active',
    subscribers: 15,
    branchApplicability: 'Westside Branch',
  },
  {
    id: 'demo-plan-4',
    name: 'Weekend Warrior Pass',
    price: 1800,
    currencyCode: 'INR',
    amountUnit: 'major',
    duration: 'Monthly',
    durationDays: 30,
    features: ['Saturday & Sunday unlimited access', 'High-speed Wi-Fi', 'Discussion room credits'],
    status: 'Active',
    subscribers: 19,
    branchApplicability: 'North Hub',
  },
];

export default function AdminPlansPage() {
  const t = useTranslations('ADMIN_PLANS');
  const locale = useLocale();
  const isDemoMode = isFrontendDemoModeEnabled();
  const { selectedBranch, isAllBranches } = useAdminBranch();
  const plansQuery = useAdminPlans(!isDemoMode);
  const [demoPlans, setDemoPlans] = useState<AdminPlansPlan[]>(() => isDemoMode ? [...DEFAULT_DEMO_PLANS] : []);
  const plans: AdminPlansPlan[] = isDemoMode ? demoPlans : plansQuery.data ?? [];
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');

  const visiblePlans = useMemo(() => {
    return plans.filter((plan) => {
      if (!isAllBranches && selectedBranch) {
        if (plan.branchApplicability && plan.branchApplicability !== 'All Branches') {
          const bName = plan.branchApplicability.toLowerCase();
          const sName = selectedBranch.name.toLowerCase();
          if (!bName.includes(sName) && !sName.includes(bName)) return false;
        }
      }
      if (statusFilter !== 'all' && plan.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = plan.name.toLowerCase().includes(q);
        const matchesDuration = plan.duration.toLowerCase().includes(q);
        const matchesPrice = String(plan.price).includes(q);
        const matchesFeature = plan.features.some((f) => f.toLowerCase().includes(q));
        const matchesBranch = plan.branchApplicability?.toLowerCase().includes(q) ?? false;
        if (!matchesName && !matchesDuration && !matchesPrice && !matchesFeature && !matchesBranch) return false;
      }
      return true;
    });
  }, [plans, selectedBranch, isAllBranches, statusFilter, searchQuery]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const editingPlan = editingId === null ? null : plans.find((plan) => plan.id === editingId) ?? null;
  const planToDelete = deleteId === null ? null : plans.find((plan) => plan.id === deleteId) ?? null;

  const closeForm = useCallback(() => setShowForm(false), []);
  const closeDeleteDialog = useCallback(() => setDeleteId(null), []);
  const handleCreate = () => { if (!isDemoMode) return; setEditingId(null); setShowForm(true); };
  const handleEdit = (plan: AdminPlansPlan) => { if (!isDemoMode) return; setEditingId(plan.id); setShowForm(true); };
  const handleValidatePlan = (values: AdminPlansFormValues) => {
    if (!isDemoMode) { toast.info(t('PERSISTENCE_BLOCKED'), { id: 'admin_members-members_plans-components-AdminMembersPlansPage-toast-35-1' }); return; }
    const editing = editingId !== null;
    const nextPlan: AdminPlansPlan = {
      id: editingId ?? `demo-plan-${Date.now()}`,
      name: values.name.trim(),
      price: Number(values.price),
      currencyCode: 'INR',
      amountUnit: 'major',
      duration: values.duration.trim(),
      durationDays: Number(values.durationDays),
      features: values.features.split('\n').map((feature) => feature.trim()).filter(Boolean),
      status: editingPlan?.status ?? ADMIN_PLANS_STATUS_VALUES[0],
      subscribers: editingPlan?.subscribers ?? 0,
      branchApplicability: values.branchApplicability || 'All Branches',
    };
    setDemoPlans((current) => upsertAdminPlansDemoPlan(current, nextPlan));
    toast.success(t(editing ? 'DEMO_PLAN_UPDATED' : 'DEMO_PLAN_CREATED', { name: nextPlan.name }), { id: 'admin_members-members_plans-components-AdminMembersPlansPage-toast-48-2' });
    setShowForm(false);
    setEditingId(null);
  };
  const handleDelete = () => {
    if (!isDemoMode || !deleteId) { if (!isDemoMode) toast.info(t('DELETE_BLOCKED'), { id: 'admin_members-members_plans-components-AdminMembersPlansPage-toast-53-3' }); return; }
    setDemoPlans((current) => removeAdminPlansDemoPlan(current, deleteId));
    toast.success(t('DEMO_PLAN_DELETED', { name: planToDelete?.name ?? '' }), { id: 'admin_members-members_plans-components-AdminMembersPlansPage-toast-55-4' });
    setDeleteId(null);
  };

  const downloadPlansCsv = () => {
    const headers = ['Plan ID', 'Name', 'Price', 'Currency', 'Duration', 'Duration Days', 'Status', 'Subscribers', 'Branch', 'Features'];
    const rows = visiblePlans.map((p) => [
      `"${p.id}"`,
      `"${p.name.replaceAll('"', '""')}"`,
      p.price,
      p.currencyCode || 'INR',
      `"${p.duration}"`,
      p.durationDays,
      `"${p.status}"`,
      p.subscribers,
      `"${(p.branchApplicability || 'All Branches').replaceAll('"', '""')}"`,
      `"${p.features.join('; ').replaceAll('"', '""')}"`,
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'smart-library-plans.csv';
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(`Exported ${visiblePlans.length} plans to CSV`);
  };

  const downloadPlansExcel = () => {
    const headers = ['Plan ID', 'Plan Name', 'Price (INR)', 'Duration', 'Days', 'Status', 'Subscribers', 'Branch', 'Features'];
    const rows = visiblePlans.map((p) => [
      p.id,
      p.name,
      p.price,
      p.duration,
      p.durationDays,
      p.status,
      p.subscribers,
      p.branchApplicability || 'All Branches',
      p.features.join(' | '),
    ]);
    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Plans</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
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
    anchor.download = 'smart-library-plans.xls';
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(`Exported ${visiblePlans.length} plans to Excel (.xls)`);
  };

  const printPlansCatalog = () => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) { window.print(); return; }
    const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Smart Library - Fee Structure & Plans Catalog</title>
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
            .badge-active { background: #dcfce7; color: #15803d; }
            .badge-inactive { background: #fee2e2; color: #b91c1c; }
            .footer { margin-top: 14px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 6px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">Smart Library Network · Membership Plans & Pricing Catalog</div>
              <div class="subtitle">Scope: ${selectedBranch ? selectedBranch.name : 'All Branches'} · Total Plans: ${visiblePlans.length}</div>
            </div>
            <div class="meta">
              <div><strong>Generated:</strong> ${dateStr}</div>
              <div><strong>Confidential:</strong> Admin Authorized View</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Plan Name</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Subscribers</th>
                <th>Branch</th>
                <th>Status</th>
                <th>Key Features</th>
              </tr>
            </thead>
            <tbody>
              ${visiblePlans.map((p) => `
                <tr>
                  <td><strong>${p.name}</strong></td>
                  <td>₹${p.price.toLocaleString('en-IN')}</td>
                  <td>${p.duration} (${p.durationDays} days)</td>
                  <td>${p.subscribers} members</td>
                  <td>${p.branchApplicability || 'All Branches'}</td>
                  <td><span class="badge badge-${p.status.toLowerCase()}">${p.status}</span></td>
                  <td>${p.features.join('; ')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <span>Smart Library Plans Catalog</span>
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
    <div className="w-full space-y-6 text-text-primary pb-10">
      {!isDemoMode && <p role="status" className="mb-4 rounded-xl border border-warning-bg bg-warning-bg p-4 text-warning-text">{t('PERSISTENCE_BLOCKED')}</p>}
      
      {/* EXECUTIVE HEADER */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-5 md:p-6 shadow-lg shadow-black/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{t('PAGE_TITLE')}</h1>
            <p className="text-xs sm:text-sm text-slate-400">{t('PAGE_SUBTITLE')}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              data-testid="admin_plans-AdminMembersPlansMain-control-001"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-600 hover:to-indigo-700 transition-all disabled:cursor-not-allowed disabled:opacity-40"
              onClick={handleCreate}
              disabled={!isDemoMode}
              title={!isDemoMode ? t('PERSISTENCE_BLOCKED') : undefined}
            >
              <Plus size={16} strokeWidth={2} />
              <span>{t('CREATE_PLAN')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Plans',
            value: visiblePlans.length,
            icon: Layers,
            cardBorderBg: 'border-cyan-500/25 bg-gradient-to-br from-[#081822]/95 via-[#081822]/90 to-[#0d2636]/80 shadow-cyan-950/30',
            iconBox: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
            strokeColor: '#22d3ee',
            badgeBg: 'border-cyan-500/30 bg-cyan-500/15 text-cyan-400',
            trend: 'Catalog Active',
          },
          {
            label: 'Active Plans',
            value: visiblePlans.filter((p) => p.status === ADMIN_PLANS_STATUS_VALUES[0]).length,
            icon: CheckCircle,
            cardBorderBg: 'border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 shadow-emerald-950/30',
            iconBox: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
            strokeColor: '#34d399',
            badgeBg: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400',
            trend: 'Live for Students',
          },
          {
            label: 'Avg Duration',
            value: visiblePlans.length > 0 ? `${Math.round(visiblePlans.reduce((a, b) => a + (b.durationDays || 30), 0) / visiblePlans.length)} Days` : '30 Days',
            icon: Clock,
            cardBorderBg: 'border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 shadow-amber-950/30',
            iconBox: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
            strokeColor: '#fbbf24',
            badgeBg: 'border-amber-500/30 bg-amber-500/15 text-amber-400',
            trend: 'Standard Term',
          },
          {
            label: 'Total Subscribers',
            value: visiblePlans.reduce((acc, p) => acc + (p.subscribers || 0), 0),
            icon: Users,
            cardBorderBg: 'border-purple-500/25 bg-gradient-to-br from-[#180c28]/95 via-[#180c28]/90 to-[#221238]/80 shadow-purple-950/30',
            iconBox: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
            strokeColor: '#c084fc',
            badgeBg: 'border-purple-500/30 bg-purple-500/15 text-purple-400',
            trend: 'Active Students',
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className={`group relative overflow-hidden rounded-2xl border p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${kpi.cardBorderBg}`}
          >
            <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
              <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke={kpi.strokeColor} strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div className="relative z-10 flex items-start justify-between gap-2">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">{kpi.label}</span>
              <div className={`p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs ${kpi.iconBox}`}>
                <kpi.icon size={18} strokeWidth={2.2} />
              </div>
            </div>
            <div className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white tabular-nums">{kpi.value}</div>
            <div className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 flex items-center gap-1.5">
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold shadow-xs ${kpi.badgeBg}`}>
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl p-3 shadow-lg">
        <div className="relative min-w-[260px] max-w-sm flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
          <input maxLength={100}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plans by name, feature, duration, or branch..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950/60 p-1">
            {(['all', 'Active', 'Inactive'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  statusFilter === status
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {status === 'all' ? 'All Plans' : status}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={downloadPlansCsv}
              disabled={visiblePlans.length === 0}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              title="Export Plans to CSV"
            >
              <Download size={14} strokeWidth={2} className="text-cyan-400" />
              <span>CSV</span>
            </button>
            <button
              type="button"
              onClick={downloadPlansExcel}
              disabled={visiblePlans.length === 0}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:text-white hover:bg-emerald-500/20 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              title="Export Plans to Excel (.xls)"
            >
              <FileSpreadsheet size={14} strokeWidth={2} className="text-emerald-400" />
              <span>Excel</span>
            </button>
            <button
              type="button"
              onClick={printPlansCatalog}
              disabled={visiblePlans.length === 0}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-300 hover:text-white hover:bg-sky-500/20 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              title="Print Plans Roster"
            >
              <Printer size={14} strokeWidth={2} className="text-sky-400" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      {!isDemoMode && plansQuery.isError ? (
        <div role="alert" className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-rose-400">
          {t('LOAD_ERROR')}
          <button type="button" className="ml-3 rounded-xl border border-rose-500/40 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20" onClick={() => window.location.reload()}>{t('RETRY')}</button>
        </div>
      ) : null}
      {!isDemoMode && plansQuery.isPending ? <div role="status" className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8 text-center text-slate-400">{t('LOADING')}</div> : null}
      {(isDemoMode || (!plansQuery.isPending && !plansQuery.isError)) && visiblePlans.length === 0 ? <div role="status" className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8 text-center text-slate-400">{t('EMPTY')}</div> : null}
      {(isDemoMode || (!plansQuery.isPending && !plansQuery.isError)) && visiblePlans.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {visiblePlans.map((plan) => {
            const localizedStatus = plan.status === ADMIN_PLANS_STATUS_VALUES[0]
              ? t('STATUS_ACTIVE')
              : plan.status === ADMIN_PLANS_STATUS_VALUES[1]
                ? t('STATUS_INACTIVE')
                : t('STATUS_UNKNOWN');
            const isActive = plan.status === ADMIN_PLANS_STATUS_VALUES[0];
            return (
              <div
                key={plan.id}
                className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-5 shadow-lg shadow-black/20 hover:-translate-y-1 hover:border-indigo-500/30 transition-all duration-300"
                data-admin-inactive={plan.status === ADMIN_PLANS_STATUS_VALUES[1] ? 'true' : 'false'}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-white tracking-tight leading-snug">{plan.name}</h3>
                    <span
                      data-testid={`admin_plans-AdminMembersPlansMain-plan-status-${plan.id}`}
                      aria-label={`${plan.name} ${t('STATUS_SUFFIX')}: ${localizedStatus}`}
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                        isActive
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {localizedStatus}
                    </span>
                  </div>

                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white" aria-label={t('PRICE')}>
                      {formatAdminPlansPrice(plan.price, plan.currencyCode, plan.amountUnit, locale)}
                    </span>
                    <span className="text-xs text-slate-400">/ {t('DURATION_DAYS', { count: plan.durationDays })}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span data-testid="admin_plans-AdminMembersPlansMain-state-004" className="inline-flex items-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-medium text-indigo-400">
                      👥 {plan.subscribers} {t('ACTIVE_SUBSCRIBERS')}
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                      !plan.branchApplicability || plan.branchApplicability === 'All Branches'
                        ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
                        : plan.branchApplicability.includes('Downtown')
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : plan.branchApplicability.includes('Westside')
                        ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                        : 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300'
                    }`}>
                      <Building2 size={11} className="shrink-0" />
                      <span>{plan.branchApplicability || 'All Branches'}</span>
                    </span>
                  </div>

                  <div className="mt-4 border-t border-slate-800/70 pt-3">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{t('FEATURES')}</p>
                    <ul className="m-0 flex list-none flex-col gap-2 p-0">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle size={14} className="mt-0.5 shrink-0 text-emerald-400" strokeWidth={2} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 flex justify-end gap-1.5 border-t border-slate-800/70 pt-3">
                  <button
                    type="button"
                    data-testid={`admin_plans-AdminMembersPlansMain-edit-${plan.id}`}
                    aria-label={`${t('EDIT')} ${plan.name}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800/50 text-indigo-400 hover:text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                    onClick={() => handleEdit(plan)}
                    disabled={!isDemoMode}
                    title={!isDemoMode ? t('PERSISTENCE_BLOCKED') : t('EDIT')}
                  >
                    <Pencil size={15} strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    data-testid={`admin_plans-AdminMembersPlansMain-delete-${plan.id}`}
                    aria-label={`${t('DELETE')} ${plan.name}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800/50 text-rose-400 hover:text-white hover:bg-rose-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                    onClick={() => setDeleteId(plan.id)}
                    disabled={!isDemoMode}
                    title={!isDemoMode ? t('DELETE_BLOCKED') : t('DELETE')}
                  >
                    <Trash2 size={15} strokeWidth={2} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
      <AdminPlansFormDialog open={showForm} editingPlan={editingPlan} onClose={closeForm} onValidated={handleValidatePlan} />
      <AdminPlansDeleteDialog open={deleteId !== null} planName={planToDelete?.name ?? ''} onClose={closeDeleteDialog} onConfirm={handleDelete} />
    </div>
  );
}
// Responsibility: AdminPlansEmptyState component owned by admin_plans; responsibility folder: admin_plans_empty_state.





// RESPONSIBILITY: Standardized empty state component for lists/tables in the admin_plans module.
// DATA FLOW: Parent -> AdminPlansEmptyState -> DOM

export function AdminPlansEmptyState({ title, description }: AdminPlansEmptyStateProps) {
  const t = useTranslations('ADMIN_PLANS');
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center text-text-secondary border border-dashed rounded-lg">
      <p className="font-medium text-text-primary">{title ?? t('EMPTY_STATE_TITLE')}</p>
      <p className="text-sm mt-1">{description ?? t('EMPTY_STATE_DESCRIPTION')}</p>
    </div>
  );
}
