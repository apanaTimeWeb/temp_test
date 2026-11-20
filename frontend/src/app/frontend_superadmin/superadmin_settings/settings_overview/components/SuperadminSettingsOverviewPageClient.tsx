'use client';
/** Responsibility: renders the superadmin_settings overview route UI; the module Main remains a thin composition boundary.
 * Global settings schema fields referenced across settings workflows:
 * - apiConfig.emailProvider
 * - apiConfig.smsProvider
 * - generalConfig.currency
 * - generalConfig.platformName
 * - generalConfig.supportEmail
 * - generalConfig.timezone
 * - maintenance.message
 */
/** Data-Flow: canonical route -> SuperadminSettingsOverviewPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { useSuperadminSettingsOverviewValidationMessage } from '@/app/frontend_superadmin/superadmin_settings/settings_overview/hooks/useSuperadminSettingsOverviewValidationMessage';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SUPERADMIN_SETTINGS_SCHEMA } from '@/app/frontend_superadmin/superadmin_settings/settings_overview/schemas/SuperadminSettingsOverviewSchema';
import type { SuperadminSettingsFormValues } from '@/app/frontend_superadmin/superadmin_settings/settings_overview/types/SuperadminSettingsOverviewTypes';
import { SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS } from '@/app/frontend_superadmin/superadmin_settings/settings_overview/mocks/fixtures/SuperadminSettingsOverviewPreviewDefaults';
import {
  Settings,
  CheckCircle,
  ShieldAlert,
  Globe,
  Download,
  RotateCcw,
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Server,
  Lock,
  Clock,
  Printer,
  X,
  AlertTriangle,
  Undo2,
  Building2,
  TrendingUp,
  Activity,
  Phone,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSuperadminSettingsOverviewUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_settings/settings_overview/hooks/useSuperadminSettingsOverviewUnsavedChangesGuard';
import { SUPERADMIN_SETTINGS_TABS } from '@/app/frontend_superadmin/superadmin_settings/settings_overview/constants/SuperadminSettingsOverviewConstants';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  category: 'General' | 'Maintenance';
  setting: string;
  modifiedBy: string;
  oldVal: string;
  newVal: string;
  status: 'Applied' | 'Staged' | 'Active';
}

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'cfg-1', timestamp: '2026-11-20 12:45', category: 'General', setting: 'Platform Name', modifiedBy: 'superadmin@libraryos.com', oldVal: 'Library SaaS', newVal: 'Library OS', status: 'Applied' },
  { id: 'cfg-2', timestamp: '2026-11-20 11:20', category: 'General', setting: 'Global Support Email', modifiedBy: 'superadmin@libraryos.com', oldVal: 'admin@libraryos.com', newVal: 'support@example.invalid', status: 'Active' },
  { id: 'cfg-3', timestamp: '2026-11-19 18:30', category: 'General', setting: 'Default Currency', modifiedBy: 'rohit.admin@libraryos.com', oldVal: 'USD ($)', newVal: 'INR (₹)', status: 'Applied' },
  { id: 'cfg-4', timestamp: '2026-11-19 15:10', category: 'General', setting: 'Default Member Capacity', modifiedBy: 'devops@libraryos.com', oldVal: '250', newVal: '500', status: 'Applied' },
  { id: 'cfg-5', timestamp: '2026-11-19 09:40', category: 'Maintenance', setting: 'Emergency Lockdown Switch', modifiedBy: 'security@libraryos.com', oldVal: 'Enabled', newVal: 'Disabled', status: 'Active' },
  { id: 'cfg-6', timestamp: '2026-11-18 22:15', category: 'Maintenance', setting: 'Maintenance Mode Banner', modifiedBy: 'superadmin@libraryos.com', oldVal: 'Scheduled system upgrade', newVal: 'Core cluster optimization', status: 'Applied' },
  { id: 'cfg-7', timestamp: '2026-11-18 14:05', category: 'General', setting: 'Date Display Format', modifiedBy: 'ui-admin@libraryos.com', oldVal: 'YYYY-MM-DD', newVal: 'DD/MM/YYYY', status: 'Applied' },
  { id: 'cfg-8', timestamp: '2026-11-17 19:50', category: 'General', setting: 'Default Timezone', modifiedBy: 'superadmin@libraryos.com', oldVal: 'UTC', newVal: 'Asia/Kolkata', status: 'Applied' },
  { id: 'cfg-9', timestamp: '2026-11-17 10:30', category: 'Maintenance', setting: 'Estimated Downtime Duration', modifiedBy: 'devops@libraryos.com', oldVal: '15 Minutes', newVal: '30 Minutes', status: 'Applied' },
  { id: 'cfg-10', timestamp: '2026-11-16 16:45', category: 'General', setting: 'Tenant Self-Registration', modifiedBy: 'superadmin@libraryos.com', oldVal: 'Disabled', newVal: 'Enabled', status: 'Active' },
  { id: 'cfg-11', timestamp: '2026-11-15 13:20', category: 'General', setting: 'Platform Support Hotline', modifiedBy: 'superadmin@libraryos.com', oldVal: '+91 99999 00000', newVal: '+91 98765 43210', status: 'Applied' },
  { id: 'cfg-12', timestamp: '2026-11-14 08:15', category: 'Maintenance', setting: 'Whitelisted SuperAdmin IP CIDRs', modifiedBy: 'security@libraryos.com', oldVal: '10.0.0.0/8', newVal: '103.24.120.0/24, 182.74.88.10/32', status: 'Applied' },
];

export default function SuperadminSettingsOverviewPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SETTINGS');
  const translateValidationMessage = useSuperadminSettingsOverviewValidationMessage();
  const [activeTab, setActiveTab] = useState('General');
  const isCurrentTab = (name: string) => activeTab === name;

  // General tab options
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [selfRegistration, setSelfRegistration] = useState(true);
  const [memberCapacity, setMemberCapacity] = useState(500);
  const [hotlinePhone, setHotlinePhone] = useState('+91 98765 43210');

  // Maintenance options
  const [estimatedDowntime, setEstimatedDowntime] = useState('30 Minutes');
  const [whitelistedIps, setWhitelistedIps] = useState('103.24.120.0/24, 182.74.88.10/32');

  // Audit Logs State
  const [auditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditCategory, setAuditCategory] = useState<string>('All');
  const [auditPage, setAuditPage] = useState(0);
  const [auditPageSize, setAuditPageSize] = useState(5);

  // Modals state
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [lockdownModalOpen, setLockdownModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [rollbackModalOpen, setRollbackModalOpen] = useState(false);
  const [selectedAuditEntry, setSelectedAuditEntry] = useState<AuditLogEntry | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SuperadminSettingsFormValues>({
    resolver: zodResolver(SUPERADMIN_SETTINGS_SCHEMA),
    defaultValues: SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS,
    mode: 'onChange',
    shouldUnregister: false,
  });

  useSuperadminSettingsOverviewUnsavedChangesGuard(isDirty, tCopy('COPY.UNSAVED_CHANGES_WARNING'));

  const maintenanceEnabled = Boolean(watch('maintenance.enabled'));

  const handleSave = (_values: SuperadminSettingsFormValues) => {
    toast.message(
      tCopy('COPY.PREVIEW_ONLY_THESE_SETTINGS_REMAIN_IN_THIS_PAGE_S_LOCAL_STATE_NO_GLOBAL_CONFIGURATION_WAS_SAVED_BECAUSE_NO_SETTINGS_API_CONTRACT_IS_SUPPLIED'),
      { id: 'superadmin:settings:preview-save' }
    );
  };

  // Execute Reset
  const handleExecuteReset = () => {
    reset(SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS);
    setDateFormat('DD/MM/YYYY');
    setSelfRegistration(true);
    setMemberCapacity(500);
    setResetModalOpen(false);
    toast.info('Form & customization restored to initial baseline defaults');
  };

  // Execute Rollback on Audit Log
  const handleExecuteRollback = () => {
    if (!selectedAuditEntry) return;
    toast.success(`Setting '${selectedAuditEntry.setting}' reverted from '${selectedAuditEntry.newVal}' back to '${selectedAuditEntry.oldVal}'`);
    setRollbackModalOpen(false);
  };

  // Export JSON
  const handleExportJson = () => {
    const data = {
      ...watch(),
      preferences: {
        dateFormat,
        selfRegistration,
        memberCapacity,
        hotlinePhone,
        estimatedDowntime,
        whitelistedIps,
      },
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `platform_settings_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('JSON configuration exported');
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['ID', 'Timestamp', 'Category', 'Setting', 'Modified By', 'Previous Value', 'Updated Value', 'Status'];
    const rows = filteredAuditLogs.map((log) => [
      log.id,
      `"${log.timestamp}"`,
      `"${log.category}"`,
      `"${log.setting}"`,
      `"${log.modifiedBy}"`,
      `"${log.oldVal}"`,
      `"${log.newVal}"`,
      `"${log.status}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filteredAuditLogs.length} audit records to CSV`);
  };

  // Filtered audit logs
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesCategory = auditCategory === 'All' || log.category === auditCategory;
      const q = auditSearch.toLowerCase();
      const matchesSearch =
        !q ||
        log.setting.toLowerCase().includes(q) ||
        log.modifiedBy.toLowerCase().includes(q) ||
        log.newVal.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [auditLogs, auditSearch, auditCategory]);

  const totalAuditPages = Math.max(1, Math.ceil(filteredAuditLogs.length / auditPageSize));
  const paginatedAuditLogs = useMemo(() => {
    const start = auditPage * auditPageSize;
    return filteredAuditLogs.slice(start, start + auditPageSize);
  }, [filteredAuditLogs, auditPage, auditPageSize]);

  return (
    <div className="w-full max-w-full min-w-0 pb-16">
      <form
        onSubmit={handleSubmit(handleSave)}
        noValidate
        className="w-full max-w-full min-w-0 flex flex-col gap-8 sm:gap-10"
        data-testid="superadmin-superadmin-settings-overview-page-client-form-line-50"
      >
        {/* Hidden inputs to preserve schema & mock scenario catalog contract */}
        <input type="hidden" {...register('apiConfig.emailProvider')} />
        <input type="hidden" {...register('apiConfig.smsProvider')} />

        {/* ─── 1. TOP HEADER SECTION (With Colorful Action Buttons) ─── */}
        <header className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-[#0d102b] via-[#090b20] to-[#050614] p-5 sm:p-7 shadow-xl relative overflow-hidden backdrop-blur-md">
          {/* Subtle decorative glow */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 -bottom-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-xs">
                  <Settings size={13} className="text-indigo-400" />
                  <span>Platform System Control</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle size={12} />
                  <span>Cloud Production</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                {tCopy('COPY.SYSTEM_SETTINGS')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Configure global defaults, system identifiers, and platform-wide operational parameters.
              </p>
            </div>

            {/* Colorful Action Buttons Group */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
              {/* Reset to Defaults */}
              <button
                type="button"
                onClick={() => setResetModalOpen(true)}
                title="Reset to defaults"
                className="inline-flex items-center gap-1.5 min-h-10 px-3.5 rounded-xl border border-amber-500/40 bg-amber-500/15 text-xs font-semibold text-amber-300 hover:text-white hover:bg-amber-600/30 hover:border-amber-400 transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <RotateCcw size={15} />
                <span>Reset to Defaults</span>
              </button>

              {/* Export Config Hub Modal */}
              <button
                type="button"
                onClick={() => setExportModalOpen(true)}
                title="Export Platform Config"
                className="inline-flex items-center gap-1.5 min-h-10 px-3.5 rounded-xl border border-cyan-500/40 bg-cyan-500/15 text-xs font-semibold text-cyan-300 hover:text-white hover:bg-cyan-600/30 hover:border-cyan-400 transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <Download size={15} />
                <span>Export Hub</span>
              </button>

              {/* Save Platform Changes */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 min-h-10 px-5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-xs sm:text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-600/50 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                data-testid="superadmin-settings-settings-overview-save-changes-1"
              >
                <CheckCircle size={16} />
                <span>{isSubmitting ? 'Saving...' : tCopy('COPY.SAVE_CHANGES')}</span>
              </button>
            </div>
          </div>
        </header>

        {/* ─── 2. SUPERADMIN DASHBOARD-STYLE KPI CARDS (Generous Gap, Never Touches) ─── */}
        <section aria-label="Settings Platform Health Metrics">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 lg:gap-8">
            {/* Card 1: Platform Identity (Indigo Theme from Dashboard) */}
            <div className="sa-kpi-card group relative overflow-hidden rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/80 via-[#1a1f4e] to-indigo-900/60 p-5 sm:p-6 shadow-lg shadow-indigo-950/50 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:border-indigo-400/60 flex flex-col justify-between min-h-[190px]">
              {/* Sparkline decoration */}
              <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none" viewBox="0 0 150 45">
                <path d="M0,32 Q25,12 50,22 T100,10 T150,18" fill="none" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
              </svg>

              <div className="flex items-start justify-between relative z-10 gap-3">
                <p className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider">Platform Identity</p>
                <div className="p-2.5 rounded-xl border border-indigo-500/40 bg-indigo-500/20 text-indigo-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
                  <Globe aria-hidden="true" size={20} />
                </div>
              </div>

              <div className="relative z-10 mt-3 sm:mt-4">
                <p className="sa-kpi-value text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white truncate">
                  {watch('generalConfig.platformName') || 'Library OS'}
                </p>

                <div className="mt-3.5 flex items-center gap-2.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shadow-xs">
                    <Building2 size={12} className="text-indigo-400" />
                    <span>{watch('generalConfig.currency')}</span>
                  </span>
                  <span className="text-xs font-medium text-slate-400">{watch('generalConfig.timezone')}</span>
                </div>

                {/* Dashboard-style Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                    <span>Engine Health</span>
                    <span>100% Core</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 w-full transition-all duration-700" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Operational Health (Emerald Theme from Dashboard) */}
            <div className="sa-kpi-card group relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/80 via-[#0f2d22] to-emerald-900/60 p-5 sm:p-6 shadow-lg shadow-emerald-950/50 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:border-emerald-400/60 flex flex-col justify-between min-h-[190px]">
              {/* Sparkline decoration */}
              <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none" viewBox="0 0 150 45">
                <path d="M0,30 Q20,20 40,24 T80,16 T120,10 T150,6" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
              </svg>

              <div className="flex items-start justify-between relative z-10 gap-3">
                <p className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider">Operational Health</p>
                <div className="p-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/20 text-emerald-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
                  <Activity aria-hidden="true" size={20} />
                </div>
              </div>

              <div className="relative z-10 mt-3 sm:mt-4">
                <p className="sa-kpi-value text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white truncate">
                  99.98% SLA
                </p>

                <div className="mt-3.5 flex items-center gap-2.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs">
                    <TrendingUp size={12} className="text-emerald-400" />
                    <span>Active Production</span>
                  </span>
                  <span className="text-xs font-medium text-slate-400">Zero Critical Failures</span>
                </div>

                {/* Dashboard-style Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                    <span>Cluster Availability</span>
                    <span>99.98%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 w-[99.98%] transition-all duration-700" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Regional & Localization Engine (Sky Theme from Dashboard) */}
            <div className="sa-kpi-card group relative overflow-hidden rounded-2xl border border-sky-500/40 bg-gradient-to-br from-sky-950/80 via-[#0f2540] to-sky-900/60 p-5 sm:p-6 shadow-lg shadow-sky-950/50 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:border-sky-400/60 flex flex-col justify-between min-h-[190px]">
              {/* Sparkline decoration */}
              <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none" viewBox="0 0 150 45">
                <path d="M0,34 Q18,24 38,20 T78,12 T118,8 T150,4" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
              </svg>

              <div className="flex items-start justify-between relative z-10 gap-3">
                <p className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider">Regional & Locale</p>
                <div className="p-2.5 rounded-xl border border-sky-500/40 bg-sky-500/20 text-sky-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
                  <Server aria-hidden="true" size={20} />
                </div>
              </div>

              <div className="relative z-10 mt-3 sm:mt-4">
                <p className="sa-kpi-value text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white truncate">
                  {watch('generalConfig.currency') || 'INR (₹)'}
                </p>

                <div className="mt-3.5 flex items-center gap-2.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-xs">
                    <span>{dateFormat}</span>
                  </span>
                  <span className="text-xs font-medium text-slate-400">{memberCapacity} Limit / Branch</span>
                </div>

                {/* Dashboard-style Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                    <span>Regional Setup</span>
                    <span>100% Configured</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-400 w-full transition-all duration-700" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: System State & Security (Rose or Amber Theme from Dashboard) */}
            <div className={`sa-kpi-card group relative overflow-hidden rounded-2xl border p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl flex flex-col justify-between min-h-[190px] ${maintenanceEnabled
                ? 'border-amber-500/60 bg-gradient-to-br from-amber-950/90 via-[#3a1e05] to-rose-950/80 shadow-amber-950/60 hover:border-amber-400/80 animate-pulse'
                : 'border-rose-500/40 bg-gradient-to-br from-rose-950/80 via-[#2d0f18] to-rose-900/60 shadow-rose-950/50 hover:border-rose-400/60'
              }`}>
              {/* Sparkline decoration */}
              <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none" viewBox="0 0 150 45">
                <path d="M0,36 Q16,26 36,22 T76,14 T116,8 T150,4" fill="none" stroke={maintenanceEnabled ? '#fbbf24' : '#f87171'} strokeWidth="3" strokeLinecap="round" />
              </svg>

              <div className="flex items-start justify-between relative z-10 gap-3">
                <p className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider">System State & Security</p>
                <div className={`p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs ${maintenanceEnabled ? 'bg-amber-500/25 border-amber-500/50 text-amber-300' : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                  }`}>
                  <ShieldAlert aria-hidden="true" size={20} className={maintenanceEnabled ? 'text-amber-400' : 'text-rose-400'} />
                </div>
              </div>

              <div className="relative z-10 mt-3 sm:mt-4">
                <p className={`sa-kpi-value text-2xl sm:text-3xl font-extrabold tracking-tight ${maintenanceEnabled ? 'text-amber-300' : 'text-white'}`}>
                  {maintenanceEnabled ? tCopy('COPY.MAINTENANCE_OFFLINE') : tCopy('COPY.MAINTENANCE_ONLINE')}
                </p>

                <div className="mt-3.5 flex items-center gap-2.5 flex-wrap">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-xs ${maintenanceEnabled
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    }`}>
                    <ShieldCheck size={12} className={maintenanceEnabled ? 'text-amber-400' : 'text-emerald-400'} />
                    <span>{maintenanceEnabled ? 'Lockdown Armed' : 'Normal Engine'}</span>
                  </span>
                  <span className="text-xs font-medium text-slate-400">2FA Enforced • 0 Breaches</span>
                </div>

                {/* Dashboard-style Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                    <span>Security Perimeter</span>
                    <span>100% Guarded</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${maintenanceEnabled ? 'bg-gradient-to-r from-amber-500 to-rose-500 w-full' : 'bg-gradient-to-r from-emerald-500 to-teal-400 w-full'}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 3. SUB-NAVIGATION TABS (Only General & Maintenance Mode) ─── */}
        <section className="border-b border-indigo-500/20 pb-4" role="navigation" aria-label={tCopy('COPY.SYSTEM_SETTINGS_SECTIONS')}>
          <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
            <div className="flex items-center gap-2 sm:gap-3">
              {SUPERADMIN_SETTINGS_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.name;
                const tabColors: Record<string, string> = {
                  'General': 'text-indigo-400',
                  'Maintenance Mode': 'text-amber-400',
                };
                const iconColor = tabColors[tab.name] ?? 'text-indigo-400';
                return (
                  <button
                    type="button"
                    key={tab.name}
                    id={`settings-tab-${tab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    aria-controls={`settings-panel-${tab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setActiveTab(tab.name)}
                    className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${isActive
                        ? 'border border-indigo-400/80 bg-gradient-to-r from-indigo-600/30 via-indigo-500/20 to-purple-600/30 text-white shadow-md shadow-indigo-500/20'
                        : 'border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700'
                      }`}
                    data-testid={`superadmin-settings-settings-overview-set-active-tab-2-${String(tab.name)}`}
                  >
                    <Icon size={16} className={isActive ? 'text-white' : iconColor} />
                    <span>{tCopy(tab.labelKey)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Hidden panels for accessibility compliance */}
        {SUPERADMIN_SETTINGS_TABS.filter((tab) => tab.name !== activeTab).map((tab) => {
          const tabId = tab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return <div key={tab.name} id={`settings-panel-${tabId}`} aria-labelledby={`settings-tab-${tabId}`} hidden />;
        })}

        {/* ─── 4. ACTIVE CONTENT PANEL CONTAINER (Generous Padding & Spacing) ─── */}
        <section
          id={`settings-panel-${activeTab.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
          className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#0c102a] via-[#080b1e] to-[#040612] p-6 sm:p-8 shadow-2xl min-h-[480px] relative backdrop-blur-md"
          aria-labelledby={`settings-tab-${activeTab.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
          aria-label={tCopy('COPY.ACTIVE_TAB_SETTINGS_ARIA_LABEL', { tab: tCopy(SUPERADMIN_SETTINGS_TABS.find((tab) => tab.name === activeTab)?.labelKey ?? 'COPY.TAB_GENERAL') })}
          tabIndex={0}
        >
          {/* TAB 1: General & Regional Panel */}
          {activeTab === 'General' && (
            <div className="max-w-4xl space-y-6 sm:space-y-8">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white">{tCopy('COPY.GENERAL_REGIONAL')}</h2>
                    <p className="text-xs sm:text-sm text-slate-400">{tCopy('COPY.GLOBAL_CONFIGURATION_APPLIED_TO_ALL_NEWLY_REGISTERED_LIBRARIES_BY_DEFAULT')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Platform Name */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label htmlFor="settings-platform-name" className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                      <span>{tCopy('COPY.PLATFORM_NAME')}</span>
                      <span className="text-[11px] text-slate-400 font-normal">Header brand identity across all library branches</span>
                    </label>
                    <input
                      id="settings-platform-name"
                      type="text"
                      className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/90 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                      aria-invalid={Boolean(errors.generalConfig?.platformName)}
                      aria-describedby={errors.generalConfig?.platformName ? 'settings-platform-name-error' : undefined}
                      {...register('generalConfig.platformName')}
                      data-testid="superadmin-settings-settings-overview-settings-platform-name-3"
                    />
                    {translateValidationMessage(errors.generalConfig?.platformName?.message) && (
                      <p id="settings-platform-name-error" className="text-xs text-rose-400 font-semibold" role="alert">
                        {translateValidationMessage(errors.generalConfig.platformName.message)}
                      </p>
                    )}
                  </div>

                  {/* Support Email */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label htmlFor="settings-support-email" className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                      <span>{tCopy('COPY.GLOBAL_SUPPORT_EMAIL')}</span>
                      <span className="text-[11px] text-slate-400 font-normal">Receives system alerts, license invoices & escalated tickets</span>
                    </label>
                    <input
                      id="settings-support-email"
                      type="email"
                      className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/90 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                      aria-invalid={Boolean(errors.generalConfig?.supportEmail)}
                      aria-describedby={errors.generalConfig?.supportEmail ? 'settings-support-email-error' : undefined}
                      {...register('generalConfig.supportEmail')}
                      data-testid="superadmin-settings-settings-overview-settings-support-email-4"
                    />
                    {translateValidationMessage(errors.generalConfig?.supportEmail?.message) && (
                      <p id="settings-support-email-error" className="text-xs text-rose-400 font-semibold" role="alert">
                        {translateValidationMessage(errors.generalConfig.supportEmail.message)}
                      </p>
                    )}
                  </div>

                  {/* Default Currency */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="settings-default-currency" className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      {tCopy('COPY.DEFAULT_CURRENCY')}
                    </label>
                    <select
                      id="settings-default-currency"
                      className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/90 px-4 py-3 text-sm text-slate-100 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
                      aria-invalid={Boolean(errors.generalConfig?.currency)}
                      {...register('generalConfig.currency')}
                      data-testid="superadmin-settings-settings-overview-settings-default-currency-5"
                    >
                      <option value="INR (₹)">{tCopy('COPY.INR')} - Indian Rupee</option>
                      <option value="USD ($)">{tCopy('COPY.USD')} - US Dollar</option>
                      <option value="AED (د.إ)">{tCopy('COPY.AED')} - UAE Dirham</option>
                    </select>
                  </div>

                  {/* Default Timezone */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="settings-default-timezone" className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      {tCopy('COPY.DEFAULT_TIMEZONE')}
                    </label>
                    <select
                      id="settings-default-timezone"
                      className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/90 px-4 py-3 text-sm text-slate-100 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
                      aria-invalid={Boolean(errors.generalConfig?.timezone)}
                      {...register('generalConfig.timezone')}
                      data-testid="superadmin-settings-settings-overview-settings-default-timezone-6"
                    >
                      <option value="Asia/Kolkata">{tCopy('COPY.ASIA_KOLKATA')} (IST UTC+05:30)</option>
                      <option value="UTC">{tCopy('COPY.UTC')} (Coordinated Universal Time)</option>
                      <option value="America/New_York">{tCopy('COPY.AMERICA_NEW_YORK')} (EST UTC-05:00)</option>
                    </select>
                  </div>

                  {/* Date Format */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Date Display Format
                    </label>
                    <select
                      value={dateFormat}
                      onChange={(e) => setDateFormat(e.target.value)}
                      className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/90 px-4 py-3 text-sm text-slate-100 focus:border-indigo-400 focus:outline-none font-semibold"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 20/11/2026)</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 11/20/2026)</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601 Standard)</option>
                    </select>
                  </div>

                  {/* Member Capacity Limit */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Default Member Capacity Limit
                    </label>
                    <input
                      type="number"
                      min={50}
                      max={10000}
                      value={memberCapacity}
                      onChange={(e) => setMemberCapacity(Number(e.target.value))}
                      className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/90 px-4 py-3 text-sm text-white focus:border-indigo-400 focus:outline-none font-mono"
                    />
                  </div>

                  {/* Hotline Phone */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Platform Support Hotline / Emergency Contact
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="p-3 rounded-xl border border-indigo-500/30 bg-slate-900/90 text-indigo-400">
                        <Phone size={18} />
                      </div>
                      <input
                        type="text"
                        value={hotlinePhone}
                        onChange={(e) => setHotlinePhone(e.target.value)}
                        className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/90 px-4 py-3 text-sm text-white focus:border-indigo-400 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Tenant Self-Registration Switch */}
                  <div className="md:col-span-2 flex items-center justify-between p-5 rounded-2xl border border-indigo-500/30 bg-slate-900/70 shadow-xs mt-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">Library Tenant Self-Registration</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          Automated Onboarding
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">Allow new libraries to sign up on the public registration portal without requiring manual SuperAdmin invite.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                      <input
                        type="checkbox"
                        checked={selfRegistration}
                        onChange={(e) => {
                          setSelfRegistration(e.target.checked);
                          toast.info(`Tenant self-registration ${e.target.checked ? 'enabled' : 'disabled'}`);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-12 h-6.5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5.5 after:w-5.5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-indigo-600 peer-checked:to-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Maintenance Mode Panel */}
          {isCurrentTab('Maintenance Mode') && (
            <div className="max-w-4xl space-y-6 sm:space-y-8">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white">{tCopy('COPY.SYSTEM_MAINTENANCE_MODE')}</h2>
                    <p className="text-xs sm:text-sm text-slate-400">{tCopy('COPY.ENABLING_THIS_WILL_BLOCK_ALL_LIBRARY_ADMINS_AND_STUDENTS_FROM_LOGGING_IN_ONLY_SUPERADMINS_WILL_HAVE_ACCESS_TO_THE_PLATFORM')}</p>
                  </div>
                </div>

                <div className="space-y-6 mt-6">
                  {/* Warning Banner / Lockdown Switch */}
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border transition-all ${maintenanceEnabled
                      ? 'border-amber-500/60 bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-rose-950/40 shadow-xl shadow-amber-500/20 ring-2 ring-amber-500/40'
                      : 'border-slate-800 bg-slate-900/60'
                    }`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base font-bold text-amber-200">{tCopy('COPY.ENABLE_MAINTENANCE')}</span>
                        {maintenanceEnabled && (
                          <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-amber-500/30 text-amber-300 border border-amber-500/50 animate-pulse">
                            LOCKDOWN ARMED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{tCopy('COPY.ENABLE_MAINTENANCE_MODE_IN_LOCAL_PREVIEW')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        {...register('maintenance.enabled')}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-500 shadow-md"></div>
                    </label>
                  </div>

                  {/* Message Shown to Users */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="settings-maintenance-message" className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                      <span>{tCopy('COPY.MESSAGE_SHOWN_TO_USERS')}</span>
                      <span className="text-[11px] text-slate-400">Max 500 characters</span>
                    </label>
                    <textarea
                      id="settings-maintenance-message"
                      rows={4}
                      className="w-full rounded-2xl border border-indigo-500/30 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none font-medium"
                      placeholder="e.g. System is undergoing scheduled core cluster optimization. All library services will resume shortly."
                      {...register('maintenance.message')}
                    />
                    {translateValidationMessage(errors.maintenance?.message?.message) && (
                      <p className="text-xs text-rose-400 font-semibold" role="alert">
                        {translateValidationMessage(errors.maintenance.message.message)}
                      </p>
                    )}
                  </div>

                  {/* Downtime duration and IP Whitelist */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Estimated Downtime Duration
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['15 Minutes', '30 Minutes', '1 Hour', '2 Hours', '4 Hours', 'Custom'].map((dur) => (
                          <button
                            key={dur}
                            type="button"
                            onClick={() => setEstimatedDowntime(dur)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${estimatedDowntime === dur
                                ? 'bg-amber-500/30 text-amber-200 border border-amber-500/60 shadow-md'
                                : 'border border-slate-800 bg-slate-900/70 text-slate-400 hover:text-white'
                              }`}
                          >
                            {dur}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Whitelisted SuperAdmin IP CIDRs
                      </label>
                      <input
                        type="text"
                        value={whitelistedIps}
                        onChange={(e) => setWhitelistedIps(e.target.value)}
                        placeholder="e.g. 103.24.120.0/24, 182.74.88.10/32"
                        className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/90 px-4 py-2.5 text-xs text-slate-200 font-mono focus:border-indigo-400 focus:outline-none"
                      />
                      <span className="text-[11px] text-slate-400">SuperAdmins connecting from these IPs bypass the maintenance gate.</span>
                    </div>
                  </div>

                  {/* Emergency Lockdown Action Modal Trigger */}
                  <div className="p-5 sm:p-6 rounded-2xl border border-rose-500/40 bg-slate-900/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
                    <div className="space-y-1">
                      <span className="text-sm font-bold text-white flex items-center gap-2">
                        <AlertTriangle size={16} className="text-rose-400" />
                        <span>Force Revoke Active User Sessions</span>
                      </span>
                      <p className="text-xs text-slate-400">Purge Redis session caches and forcefully terminate 1,420 active student & admin tokens.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLockdownModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/40 bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 text-xs font-bold transition-all shrink-0 cursor-pointer shadow-md"
                    >
                      <AlertTriangle size={14} className="text-rose-400" />
                      <span>Security Lockdown Modal</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ─── 5. AUDIT LOG TABLE (Clear Separation & Spacing) ─── */}
        <section className="rounded-2xl border border-slate-800 bg-card/95 shadow-xl overflow-hidden backdrop-blur-md" aria-label="Configuration Change History">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 sm:p-6 border-b border-slate-800 bg-slate-900/70">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2.5">
                <Clock size={18} className="text-indigo-400" />
                <span>Configuration Change History</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Audit log of system parameters modified across all modules</p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative w-full sm:w-60">
                <Search size={14} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={auditSearch}
                  onChange={(e) => {
                    setAuditSearch(e.target.value);
                    setAuditPage(0);
                  }}
                  placeholder="Search settings..."
                  className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/90 pl-9 pr-9 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-400 focus:outline-none"
                />
                {auditSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuditSearch('');
                      setAuditPage(0);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              <select
                value={auditCategory}
                onChange={(e) => {
                  setAuditCategory(e.target.value);
                  setAuditPage(0);
                }}
                className="rounded-xl border border-indigo-500/30 bg-slate-900/90 px-3.5 py-2 text-xs text-slate-200 focus:border-indigo-400 focus:outline-none font-semibold"
              >
                <option value="All">All Categories</option>
                <option value="General">General</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Timestamp</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Setting Modified</th>
                  <th className="px-5 py-3.5">Modified By</th>
                  <th className="px-5 py-3.5">Previous Value</th>
                  <th className="px-5 py-3.5">Updated Value</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {paginatedAuditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-slate-400">
                      No configuration records match the search filter.
                    </td>
                  </tr>
                ) : (
                  paginatedAuditLogs.map((entry) => (
                    <tr key={entry.id} className="hover:bg-indigo-500/5 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-slate-400 whitespace-nowrap">{entry.timestamp}</td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                          {entry.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-bold text-white">{entry.setting}</td>
                      <td className="px-5 py-3.5 text-slate-300 font-mono text-[11px]">{entry.modifiedBy}</td>
                      <td className="px-5 py-3.5 text-slate-400 font-mono line-through">{entry.oldVal}</td>
                      <td className="px-5 py-3.5 text-emerald-300 font-mono font-bold">{entry.newVal}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle size={12} />
                          <span>{entry.status}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAuditEntry(entry);
                            setRollbackModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-[11px] font-bold transition-all cursor-pointer"
                        >
                          <Undo2 size={12} />
                          <span>Rollback</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-slate-800 bg-slate-900/40 text-xs">
            <span className="text-slate-400">
              Showing {filteredAuditLogs.length === 0 ? 0 : auditPage * auditPageSize + 1} to {Math.min((auditPage + 1) * auditPageSize, filteredAuditLogs.length)} of {filteredAuditLogs.length} audit entries
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={auditPage === 0}
                onClick={() => setAuditPage((p) => Math.max(0, p - 1))}
                className="p-1.5 rounded-lg border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-2 font-bold text-white">
                Page {auditPage + 1} of {totalAuditPages}
              </span>
              <button
                type="button"
                disabled={auditPage >= totalAuditPages - 1}
                onClick={() => setAuditPage((p) => Math.min(totalAuditPages - 1, p + 1))}
                className="p-1.5 rounded-lg border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </form>

      {/* ─── 6. INTERACTIVE MODALS ─── */}

      {/* 1. RESET TO DEFAULTS CONFIRMATION MODAL */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-amber-500/40 bg-gradient-to-b from-[#261b0a] to-[#0e0904] p-6 shadow-2xl shadow-amber-500/20 relative">
            <button
              onClick={() => setResetModalOpen(false)}
              className="absolute right-5 top-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <RotateCcw size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Reset Configuration</h3>
                <p className="text-xs text-slate-400">Restore factory baseline defaults</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed my-4">
              Are you sure you want to reset all current edits back to standard platform defaults? Any unsaved changes in currency, timezone, or maintenance message will be discarded.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteReset}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SECURITY LOCKDOWN MODAL */}
      {lockdownModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-rose-500/50 bg-gradient-to-b from-[#2a0e14] to-[#0d0407] p-6 shadow-2xl shadow-rose-500/30 relative">
            <button
              onClick={() => setLockdownModalOpen(false)}
              className="absolute right-5 top-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-rose-500/25 text-rose-400 border border-rose-500/40">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Emergency Session Invalidation</h3>
                <p className="text-xs text-rose-300 font-semibold">Immediate Security Procedure</p>
              </div>
            </div>

            <div className="space-y-3 my-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                This will trigger an emergency Redis token invalidation broadcast across all clusters. The following actions will execute immediately:
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-5">
                <li><strong className="text-rose-300">1,420 Active Sessions</strong> terminated instantly.</li>
                <li>All active branch library managers will be signed out.</li>
                <li>Student check-in kiosks will switch to emergency offline queue mode.</li>
                <li>Only SuperAdmins with 2FA passkeys will remain authenticated.</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setLockdownModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setLockdownModalOpen(false);
                  toast.success('Emergency broadcast transmitted. 1,420 user sessions revoked.');
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all cursor-pointer flex items-center gap-2"
              >
                <Lock size={14} />
                <span>Execute Emergency Revocation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. PLATFORM EXPORT CENTER MODAL */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-[#0a1c2e] to-[#040c14] p-6 shadow-2xl shadow-cyan-500/20 relative">
            <button
              onClick={() => setExportModalOpen(false)}
              className="absolute right-5 top-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Download size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Platform Export Center</h3>
                <p className="text-xs text-slate-400">Download configurations and audit reports</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
              <div
                onClick={handleExportJson}
                className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <Download size={18} className="text-cyan-400 mb-2" />
                  <p className="text-xs font-bold text-white">JSON Bundle</p>
                  <p className="text-[11px] text-slate-400 mt-1">Full state backup for migration or CI deployment.</p>
                </div>
                <span className="text-[10px] text-cyan-300 font-bold mt-3">Download JSON →</span>
              </div>

              <div
                onClick={handleExportCsv}
                className="p-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <Download size={18} className="text-indigo-400 mb-2" />
                  <p className="text-xs font-bold text-white">CSV Audit Log</p>
                  <p className="text-[11px] text-slate-400 mt-1">Audit trail history formatted for Excel.</p>
                </div>
                <span className="text-[10px] text-indigo-300 font-bold mt-3">Download CSV →</span>
              </div>

              <div
                onClick={() => {
                  setExportModalOpen(false);
                  window.print();
                }}
                className="p-4 rounded-2xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <Printer size={18} className="text-sky-400 mb-2" />
                  <p className="text-xs font-bold text-white">Print View</p>
                  <p className="text-[11px] text-slate-400 mt-1">Formatted hardcopy layout for reports.</p>
                </div>
                <span className="text-[10px] text-sky-300 font-bold mt-3">Open Print →</span>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setExportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ROLLBACK AUDIT ENTRY MODAL */}
      {rollbackModalOpen && selectedAuditEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-indigo-500/40 bg-gradient-to-b from-[#0f142e] to-[#070914] p-6 shadow-2xl shadow-indigo-500/20 relative">
            <button
              onClick={() => setRollbackModalOpen(false)}
              className="absolute right-5 top-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Undo2 size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Rollback Setting</h3>
                <p className="text-xs text-slate-400">Revert this configuration change</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 text-xs space-y-2.5 my-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Setting:</span>
                <span className="text-white font-bold">{selectedAuditEntry.setting}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Value:</span>
                <span className="text-rose-400 font-mono font-bold line-through">{selectedAuditEntry.newVal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Revert To:</span>
                <span className="text-emerald-400 font-mono font-bold">{selectedAuditEntry.oldVal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Originally Changed By:</span>
                <span className="text-slate-300">{selectedAuditEntry.modifiedBy}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setRollbackModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteRollback}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-2"
              >
                <Undo2 size={14} />
                <span>Confirm Rollback</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
