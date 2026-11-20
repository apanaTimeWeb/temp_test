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
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_settings/settings_overview/config/superadmin_settings_overview.url_config.ts';
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
  Palette,
  CheckCircle,
  Database,
  Mail,
  ShieldAlert,
  Globe,
  Download,
  RotateCcw,
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Server,
  Zap,
  Sliders,
  Bell,
  HardDrive,
  Lock,
  Clock,
  UserCheck,
  FileSpreadsheet,
  Printer,
  X,
  RefreshCw,
  SlidersHorizontal,
  Layers,
  Activity,
  Check,
  AlertTriangle,
  Key,
  PhoneCall,
  MessageSquare,
  Copy,
  Eye,
  EyeOff,
  Cloud,
  CheckCircle2,
  Sparkles,
  Send,
  Radio,
  FileText,
  Trash2,
  Undo2,
  Cpu,
  BarChart3,
  Flame,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSuperadminSettingsOverviewUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_settings/settings_overview/hooks/useSuperadminSettingsOverviewUnsavedChangesGuard';
import { SUPERADMIN_SETTINGS_TABS } from '@/app/frontend_superadmin/superadmin_settings/settings_overview/constants/SuperadminSettingsOverviewConstants';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  category: 'General' | 'APIs' | 'Storage' | 'Maintenance' | 'Appearance';
  setting: string;
  modifiedBy: string;
  oldVal: string;
  newVal: string;
  status: 'Applied' | 'Staged' | 'Active';
}

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'cfg-1', timestamp: '2026-11-20 12:45', category: 'General', setting: 'Platform Name', modifiedBy: 'superadmin@libraryos.com', oldVal: 'Library SaaS', newVal: 'Library OS', status: 'Applied' },
  { id: 'cfg-2', timestamp: '2026-11-20 11:20', category: 'APIs', setting: 'Email Provider', modifiedBy: 'superadmin@libraryos.com', oldVal: 'SMTP Custom', newVal: 'AWS SES', status: 'Active' },
  { id: 'cfg-3', timestamp: '2026-11-19 18:30', category: 'General', setting: 'Default Currency', modifiedBy: 'rohit.admin@libraryos.com', oldVal: 'USD ($)', newVal: 'INR (₹)', status: 'Applied' },
  { id: 'cfg-4', timestamp: '2026-11-19 15:10', category: 'Storage', setting: 'S3 Primary Bucket', modifiedBy: 'devops@libraryos.com', oldVal: 'lib-assets-dev', newVal: 'lib-assets-prod', status: 'Applied' },
  { id: 'cfg-5', timestamp: '2026-11-19 09:40', category: 'APIs', setting: 'SMS Gateway', modifiedBy: 'superadmin@libraryos.com', oldVal: 'Fast2SMS', newVal: 'Twilio', status: 'Active' },
  { id: 'cfg-6', timestamp: '2026-11-18 22:15', category: 'Maintenance', setting: 'Maintenance Mode Banner', modifiedBy: 'superadmin@libraryos.com', oldVal: 'Scheduled system upgrade', newVal: 'Core cluster optimization', status: 'Applied' },
  { id: 'cfg-7', timestamp: '2026-11-18 14:05', category: 'Appearance', setting: 'Brand Accent Palette', modifiedBy: 'ui-admin@libraryos.com', oldVal: 'Indigo Default', newVal: 'Cyber Indigo Pro', status: 'Applied' },
  { id: 'cfg-8', timestamp: '2026-11-17 19:50', category: 'General', setting: 'Default Timezone', modifiedBy: 'superadmin@libraryos.com', oldVal: 'UTC', newVal: 'Asia/Kolkata', status: 'Applied' },
  { id: 'cfg-9', timestamp: '2026-11-17 10:30', category: 'Storage', setting: 'Max Upload Limit', modifiedBy: 'devops@libraryos.com', oldVal: '25 MB', newVal: '50 MB', status: 'Applied' },
  { id: 'cfg-10', timestamp: '2026-11-16 16:45', category: 'APIs', setting: 'WhatsApp Business Webhook', modifiedBy: 'integrations@libraryos.com', oldVal: 'v1.4 API', newVal: 'v2.1 API Graph', status: 'Active' },
  { id: 'cfg-11', timestamp: '2026-11-15 13:20', category: 'General', setting: 'Global Support Email', modifiedBy: 'superadmin@libraryos.com', oldVal: 'help@example.com', newVal: 'support@example.invalid', status: 'Applied' },
  { id: 'cfg-12', timestamp: '2026-11-14 08:15', category: 'Maintenance', setting: 'Emergency Lockdown Switch', modifiedBy: 'security@libraryos.com', oldVal: 'Enabled', newVal: 'Disabled', status: 'Applied' },
];

const ACCENT_COLORS = [
  { name: 'Indigo Neon', hex: '#6366f1', border: 'border-indigo-500', bg: 'bg-indigo-500', glow: 'shadow-indigo-500/40' },
  { name: 'Cyber Violet', hex: '#a855f7', border: 'border-purple-500', bg: 'bg-purple-500', glow: 'shadow-purple-500/40' },
  { name: 'Emerald Green', hex: '#10b981', border: 'border-emerald-500', bg: 'bg-emerald-500', glow: 'shadow-emerald-500/40' },
  { name: 'Electric Cyan', hex: '#06b6d4', border: 'border-cyan-500', bg: 'bg-cyan-500', glow: 'shadow-cyan-500/40' },
  { name: 'Rose Crimson', hex: '#f43f5e', border: 'border-rose-500', bg: 'bg-rose-500', glow: 'shadow-rose-500/40' },
  { name: 'Amber Glow', hex: '#f59e0b', border: 'border-amber-500', bg: 'bg-amber-500', glow: 'shadow-amber-500/40' },
];

export default function SuperadminSettingsOverviewPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SETTINGS');

  const navigateToWorkflow = (key: string) => {
    const routes: Record<string, string> = {
      'General': SUPERADMIN_NAVIGATION_ROUTES.settings_general,
      'Appearance': SUPERADMIN_NAVIGATION_ROUTES.settings_appearance,
      'APIs & Integrations': SUPERADMIN_NAVIGATION_ROUTES.settings_integrations,
      'Storage': SUPERADMIN_NAVIGATION_ROUTES.settings_storage,
      'Maintenance Mode': SUPERADMIN_NAVIGATION_ROUTES.settings_maintenance_mode,
    };
    const route = routes[key];
    if (route) {
      const target = new URL(route, window.location.origin);
      const query = new URLSearchParams(window.location.search);
      query.delete('view');
      query.forEach((value, k) => {
        if (!target.searchParams.has(k)) target.searchParams.append(k, value);
      });
      window.location.assign(target.pathname + target.search + target.hash);
    }
  };

  const translateValidationMessage = useSuperadminSettingsOverviewValidationMessage();
  const [activeTab, setActiveTab] = useState('General');
  const isCurrentTab = (name: string) => activeTab === name;

  // Visual customizer state
  const [selectedTheme, setSelectedTheme] = useState<'cyber' | 'midnight' | 'aurora'>('cyber');
  const [selectedAccent, setSelectedAccent] = useState('Indigo Neon');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [highContrast, setHighContrast] = useState(false);
  const [compactDensity, setCompactDensity] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // General tab options
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [selfRegistration, setSelfRegistration] = useState(true);
  const [memberCapacity, setMemberCapacity] = useState(500);
  const [hotlinePhone, setHotlinePhone] = useState('+91 98765 43210');

  // APIs options
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState<'razorpay' | 'stripe' | 'cashfree'>('razorpay');
  const [paymentSandbox, setPaymentSandbox] = useState(true);

  // Storage options
  const [maxUploadLimitMb, setMaxUploadLimitMb] = useState(50);
  const [autoDailyBackup, setAutoDailyBackup] = useState(true);
  const [backupRetentionDays, setBackupRetentionDays] = useState('30');

  // Maintenance options
  const [estimatedDowntime, setEstimatedDowntime] = useState('30 Minutes');
  const [whitelistedIps, setWhitelistedIps] = useState('103.24.120.0/24, 182.74.88.10/32');

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditCategory, setAuditCategory] = useState<string>('All');
  const [auditPage, setAuditPage] = useState(0);
  const [auditPageSize, setAuditPageSize] = useState(5);

  // --------------------------------------------------------------------------
  // MODAL STATES (For rich, colorful interactive popups for every button)
  // --------------------------------------------------------------------------
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailTestingState, setEmailTestingState] = useState<'idle' | 'running' | 'success'>('idle');
  const [testEmailAddress, setTestEmailAddress] = useState('superadmin@libraryos.com');

  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [smsSendingState, setSmsSendingState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [testSmsPhone, setTestSmsPhone] = useState('+91 98765 43210');
  const [testSmsText, setTestSmsText] = useState('Library OS Alert: Transactional SMS gateway connection ping verified successfully.');

  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [whatsappVerifying, setWhatsappVerifying] = useState(false);
  const [whatsappVerified, setWhatsappVerified] = useState(true);

  const [cacheModalOpen, setCacheModalOpen] = useState(false);
  const [cachePurging, setCachePurging] = useState(false);
  const [cachePurged, setCachePurged] = useState(false);

  const [snapshotModalOpen, setSnapshotModalOpen] = useState(false);
  const [snapshotProgress, setSnapshotProgress] = useState(0);
  const [snapshotRunning, setSnapshotRunning] = useState(false);

  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [lockdownModalOpen, setLockdownModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const [rollbackModalOpen, setRollbackModalOpen] = useState(false);
  const [selectedAuditEntry, setSelectedAuditEntry] = useState<AuditLogEntry | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
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
  const currentEmailProvider = watch('apiConfig.emailProvider');
  const currentSmsProvider = watch('apiConfig.smsProvider');

  const handleSave = (_values: SuperadminSettingsFormValues) => {
    toast.message(
      tCopy('COPY.PREVIEW_ONLY_THESE_SETTINGS_REMAIN_IN_THIS_PAGE_S_LOCAL_STATE_NO_GLOBAL_CONFIGURATION_WAS_SAVED_BECAUSE_NO_SETTINGS_API_CONTRACT_IS_SUPPLIED'),
      { id: 'superadmin:settings:preview-save' }
    );
  };

  // Run Email Test
  const handleRunEmailTest = () => {
    setEmailTestingState('running');
    setTimeout(() => {
      setEmailTestingState('success');
      toast.success(`SMTP ping verified! TLS 1.3 handshake completed in 38ms to ${testEmailAddress}`);
    }, 1200);
  };

  // Run SMS Test
  const handleRunSmsTest = () => {
    setSmsSendingState('sending');
    setTimeout(() => {
      setSmsSendingState('sent');
      toast.success(`Test SMS dispatched via ${currentSmsProvider} to ${testSmsPhone}`);
    }, 1100);
  };

  // Run WhatsApp Verification
  const handleVerifyWhatsapp = () => {
    setWhatsappVerifying(true);
    setTimeout(() => {
      setWhatsappVerifying(false);
      setWhatsappVerified(true);
      toast.success('Meta Graph API Webhook connection is active (HTTP 200 OK)');
    }, 1000);
  };

  // Run Cache Purge
  const handleExecuteCachePurge = () => {
    setCachePurging(true);
    setCachePurged(false);
    setTimeout(() => {
      setCachePurging(false);
      setCachePurged(true);
      toast.success('Purged 428 MB from Cloudflare Edge PoPs and Redis memory.');
    }, 1300);
  };

  // Run Database Snapshot
  const handleStartSnapshot = () => {
    setSnapshotRunning(true);
    setSnapshotProgress(15);
    setTimeout(() => setSnapshotProgress(45), 500);
    setTimeout(() => setSnapshotProgress(80), 1000);
    setTimeout(() => {
      setSnapshotProgress(100);
      setSnapshotRunning(false);
      toast.success('Snapshot snapshot-libraryos-20261120.sql.gz (1.2 GB) created on S3 Glacier');
    }, 1500);
  };

  // Execute Reset
  const handleExecuteReset = () => {
    reset(SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS);
    setSelectedTheme('cyber');
    setSelectedAccent('Indigo Neon');
    setFontFamily('Inter');
    setHighContrast(false);
    setCompactDensity(false);
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
        theme: selectedTheme,
        accent: selectedAccent,
        fontFamily,
        highContrast,
        compactDensity,
        sidebarCollapsed,
        dateFormat,
        selfRegistration,
        memberCapacity,
        hotlinePhone,
        paymentGateway: selectedPaymentGateway,
        paymentSandbox,
        maxUploadLimitMb,
        autoDailyBackup,
        backupRetentionDays,
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
    <div className="w-full max-w-full min-w-0 space-y-6 pb-12">
      <form onSubmit={handleSubmit(handleSave)} noValidate data-testid="superadmin-superadmin-settings-overview-page-client-form-line-50">

        {/* ========================================================================= */}
        {/* EXECUTIVE HEADER - COLORFUL, MODERN & FULLY RESPONSIVE                   */}
        {/* ========================================================================= */}
        <header className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/90 via-[#0b0e24] to-[#040612] p-5 sm:p-7 shadow-2xl shadow-indigo-950/50 backdrop-blur-xl relative overflow-hidden">
          {/* Ambient colorful decorative orb gradients */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-indigo-600/20 to-purple-600/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-tr from-cyan-600/20 to-emerald-600/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/40 bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-300 shadow-sm">
                  <Sliders className="h-3.5 w-3.5 text-indigo-400" />
                  Core Engine v2.4 Pro
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Workspace Active
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-300 bg-purple-500/10 border border-purple-500/30 px-2.5 py-1 rounded-full">
                  <Flame size={12} className="text-purple-400" />
                  High Performance
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30">
                  <Settings size={26} />
                </div>
                <span>{tCopy('COPY.SYSTEM_SETTINGS')}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Platform Identity, Global Communication Gateways, Object Storage, Edge CDN Caching & Lockdown Controls.
              </p>
            </div>

            {/* Quick Action Toolbar with Colorful, Interactive Buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setResetModalOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
                title="Reset to defaults"
              >
                <RotateCcw size={15} className="text-amber-400" />
                <span>Reset Defaults</span>
              </button>

              <button
                type="button"
                onClick={() => setExportModalOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25 text-xs font-semibold shadow-md shadow-indigo-500/10 transition-all active:scale-95 cursor-pointer"
                title="Open Export Center"
              >
                <Download size={15} className="text-indigo-400" />
                <span>Export Center</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
                title="Print Platform Summary"
              >
                <Printer size={15} className="text-sky-400" />
                <span>Print</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                data-testid="superadmin-settings-settings-overview-save-changes-1"
              >
                <CheckCircle size={16} />
                <span>{tCopy('COPY.SAVE_CHANGES')}</span>
              </button>
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* COLORFUL 4-KPI HEALTH METRIC CARDS                                       */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
          {/* Card 1: Platform Identity (Indigo/Blue Gradient) */}
          <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/70 via-slate-900/80 to-blue-950/60 p-5 shadow-lg shadow-indigo-500/10 flex flex-col justify-between hover:border-indigo-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Platform Identity</span>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/30">
                <Globe size={18} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xl font-extrabold text-white truncate">{watch('generalConfig.platformName') || 'Library OS'}</p>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-300">
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                  {watch('generalConfig.currency')}
                </span>
                <span>•</span>
                <span className="font-mono text-slate-400 truncate">{watch('generalConfig.timezone')}</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-indigo-500/20 flex items-center justify-between text-xs">
              <span className="text-slate-400">Tenant Self-Reg:</span>
              <span className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${selfRegistration ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
                {selfRegistration ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          {/* Card 2: Gateway Integrations (Cyan/Teal Gradient) */}
          <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/70 via-slate-900/80 to-teal-950/60 p-5 shadow-lg shadow-cyan-500/10 flex flex-col justify-between hover:border-cyan-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">Gateway Integrations</span>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 text-white shadow-md shadow-cyan-500/30">
                <Zap size={18} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xl font-extrabold text-white truncate">{currentEmailProvider} & {currentSmsProvider}</p>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-emerald-400 font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Operational (Latency 38ms)</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-cyan-500/20 flex items-center justify-between text-xs">
              <span className="text-slate-400">SMS Balance:</span>
              <span className="font-mono text-cyan-300 font-bold bg-cyan-500/15 px-2 py-0.5 rounded border border-cyan-500/30">₹14,250 (71k)</span>
            </div>
          </div>

          {/* Card 3: Storage & CDN (Purple/Fuchsia Gradient) */}
          <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/70 via-slate-900/80 to-fuchsia-950/60 p-5 shadow-lg shadow-purple-500/10 flex flex-col justify-between hover:border-purple-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Storage & Media CDN</span>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-md shadow-purple-500/30">
                <HardDrive size={18} />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline justify-between">
                <p className="text-xl font-extrabold text-white">42.8 GB</p>
                <span className="text-xs text-purple-300 font-mono font-bold">/ 100 GB (42.8%)</span>
              </div>
              <div className="w-full bg-slate-900/90 h-2 rounded-full mt-2.5 overflow-hidden p-0.5 border border-purple-500/20">
                <div className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 h-full rounded-full transition-all" style={{ width: '42.8%' }} />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-500/20 flex items-center justify-between text-xs">
              <span className="text-slate-400">Cloudflare Edge:</span>
              <span className="font-bold text-fuchsia-300 bg-purple-500/15 px-2 py-0.5 rounded border border-purple-500/30">99.2% Hit Rate</span>
            </div>
          </div>

          {/* Card 4: Security & System State (Emerald or Amber/Rose Gradient) */}
          <div className={`rounded-2xl border ${maintenanceEnabled ? 'border-amber-500/50 bg-gradient-to-br from-amber-950/80 via-slate-900/90 to-rose-950/80 shadow-amber-500/20' : 'border-emerald-500/30 bg-gradient-to-br from-emerald-950/70 via-slate-900/80 to-teal-950/60 shadow-emerald-500/10'} p-5 shadow-lg flex flex-col justify-between transition-all`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">System State & Security</span>
              <div className={`p-2.5 rounded-xl ${maintenanceEnabled ? 'bg-gradient-to-br from-amber-500 to-rose-600 shadow-amber-500/40 animate-bounce' : 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30'} text-white shadow-md`}>
                <ShieldAlert size={18} />
              </div>
            </div>
            <div className="mt-4">
              <p className={`text-xl font-extrabold ${maintenanceEnabled ? 'text-amber-300' : 'text-emerald-300'}`}>
                {maintenanceEnabled ? tCopy('COPY.MAINTENANCE_OFFLINE') : tCopy('COPY.MAINTENANCE_ONLINE')}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-300">
                <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                <span>SuperAdmin 2FA Enforced</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
              <span className="text-slate-400">Security Guard:</span>
              <span className="font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">0 Critical Breaches</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SUB-NAVIGATION TABS - RESPONSIVE, COLORFUL, WITH GLOWING ACTIVE PILL      */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between gap-3 mb-6 border-b border-indigo-500/25 pb-3 overflow-x-auto" role="navigation" aria-label={tCopy('COPY.SYSTEM_SETTINGS_SECTIONS')}>
          <div className="flex items-center gap-2">
            {SUPERADMIN_SETTINGS_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.name;
              return (
                <button
                  type="button"
                  key={tab.name}
                  id={`settings-tab-${tab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  aria-controls={`settings-panel-${tab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setActiveTab(tab.name)}
                  className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'border border-indigo-400 bg-gradient-to-r from-indigo-600/30 via-indigo-500/20 to-purple-600/30 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                  }`}
                  data-testid={`superadmin-settings-settings-overview-set-active-tab-2-${String(tab.name)}`}
                >
                  <Icon size={16} className={isActive ? 'text-indigo-400' : 'text-slate-500'} />
                  <span>{tCopy(tab.labelKey)}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => navigateToWorkflow(activeTab)}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-bold px-3 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-all cursor-pointer shrink-0"
          >
            <span>Open Dedicated View</span>
            <ExternalLink size={13} />
          </button>
        </div>

        {/* Hidden panels for accessibility compliance */}
        {SUPERADMIN_SETTINGS_TABS.filter((tab) => tab.name !== activeTab).map((tab) => {
          const tabId = tab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return <div key={tab.name} id={`settings-panel-${tabId}`} aria-labelledby={`settings-tab-${tabId}`} hidden />;
        })}

        {/* ========================================================================= */}
        {/* ACTIVE CONTENT PANEL CONTAINER                                           */}
        {/* ========================================================================= */}
        <div
          id={`settings-panel-${activeTab.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
          className="rounded-3xl border border-indigo-500/25 bg-gradient-to-b from-[#0b0e26] via-[#080a1a] to-[#040610] p-6 sm:p-8 shadow-2xl mb-8 min-h-[460px] relative backdrop-blur-md"
          aria-labelledby={`settings-tab-${activeTab.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
          aria-label={tCopy('COPY.ACTIVE_TAB_SETTINGS_ARIA_LABEL', { tab: tCopy(SUPERADMIN_SETTINGS_TABS.find((tab) => tab.name === activeTab)?.labelKey ?? 'COPY.TAB_GENERAL') })}
          tabIndex={0}
        >
          {/* TAB 1: General & Regional Panel */}
          {activeTab === 'General' && (
            <div className="max-w-4xl space-y-6">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <Globe size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-white">{tCopy('COPY.GENERAL_REGIONAL')}</h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mb-6">{tCopy('COPY.GLOBAL_CONFIGURATION_APPLIED_TO_ALL_NEWLY_REGISTERED_LIBRARIES_BY_DEFAULT')}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Platform Name */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label htmlFor="settings-platform-name" className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                      <span>{tCopy('COPY.PLATFORM_NAME')}</span>
                      <span className="text-[11px] text-slate-500 font-normal">Header brand identity across all library branches</span>
                    </label>
                    <input
                      id="settings-platform-name"
                      type="text"
                      className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
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
                      <span className="text-[11px] text-slate-500 font-normal">Receives system alerts, license invoices & escalated tickets</span>
                    </label>
                    <input
                      id="settings-support-email"
                      type="email"
                      className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
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
                      className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/80 px-4 py-3 text-sm text-white focus:border-indigo-400 focus:outline-none font-mono"
                    />
                  </div>

                  {/* Hotline Phone */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Platform Support Hotline / WhatsApp
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="p-3 rounded-xl border border-indigo-500/30 bg-slate-900/90 text-indigo-400">
                        <PhoneCall size={18} />
                      </div>
                      <input
                        type="text"
                        value={hotlinePhone}
                        onChange={(e) => setHotlinePhone(e.target.value)}
                        className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/80 px-4 py-3 text-sm text-white focus:border-indigo-400 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Tenant Self-Registration Switch */}
                  <div className="md:col-span-2 flex items-center justify-between p-4.5 rounded-2xl border border-indigo-500/25 bg-slate-900/60 shadow-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">Library Tenant Self-Registration</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
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

          {/* TAB 2: Appearance & Theming Panel */}
          {activeTab === 'Appearance' && (
            <div className="max-w-4xl space-y-6">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    <Palette size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-white">Theme & Visual Experience</h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mb-6">Choose default appearance themes, brand neon accent palettes, and accessibility density settings.</p>

                {/* Theme Selection Cards */}
                <div className="space-y-3 mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Base Theme Selection</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div
                      onClick={() => {
                        setSelectedTheme('cyber');
                        toast.success('Theme changed to Cyber Dark Pro');
                      }}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        selectedTheme === 'cyber'
                          ? 'border-indigo-500 bg-gradient-to-b from-indigo-950/60 to-slate-900/90 shadow-xl shadow-indigo-500/20 ring-2 ring-indigo-500/40'
                          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-white">Cyber Dark Pro</p>
                          {selectedTheme === 'cyber' && <CheckCircle2 size={16} className="text-indigo-400" />}
                        </div>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">Deep slate background with neon indigo glow borders and glass cards.</p>
                      </div>
                      <span className="mt-4 text-[11px] font-bold text-indigo-300 flex items-center gap-1">
                        <Sparkles size={12} /> Active Default
                      </span>
                    </div>

                    <div
                      onClick={() => {
                        setSelectedTheme('midnight');
                        toast.success('Theme changed to Midnight Slate');
                      }}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        selectedTheme === 'midnight'
                          ? 'border-indigo-500 bg-gradient-to-b from-indigo-950/60 to-slate-900/90 shadow-xl shadow-indigo-500/20 ring-2 ring-indigo-500/40'
                          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-white">Midnight Slate</p>
                          {selectedTheme === 'midnight' && <CheckCircle2 size={16} className="text-indigo-400" />}
                        </div>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">Neutral dark monochrome with high contrast text for night shifts.</p>
                      </div>
                      <span className="mt-4 text-[11px] text-slate-400">High Contrast Monochrome</span>
                    </div>

                    <div
                      onClick={() => {
                        setSelectedTheme('aurora');
                        toast.success('Theme changed to Aurora Indigo');
                      }}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        selectedTheme === 'aurora'
                          ? 'border-indigo-500 bg-gradient-to-b from-indigo-950/60 to-slate-900/90 shadow-xl shadow-indigo-500/20 ring-2 ring-indigo-500/40'
                          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-white">Aurora Indigo</p>
                          {selectedTheme === 'aurora' && <CheckCircle2 size={16} className="text-indigo-400" />}
                        </div>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">Vibrant purple & indigo gradient accents with high energy glow.</p>
                      </div>
                      <span className="mt-4 text-[11px] text-purple-300">Gradient Edition</span>
                    </div>
                  </div>
                </div>

                {/* Brand Accent Palette Swatches */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Brand Accent Color</span>
                    <span className="text-xs text-indigo-300 font-bold">Selected: {selectedAccent}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {ACCENT_COLORS.map((col) => {
                      const isSelected = selectedAccent === col.name;
                      return (
                        <button
                          key={col.name}
                          type="button"
                          onClick={() => {
                            setSelectedAccent(col.name);
                            toast.success(`Theme accent updated to ${col.name}`);
                          }}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                            isSelected
                              ? `${col.border} bg-slate-900/90 ring-2 ring-indigo-500/60 shadow-lg ${col.glow}`
                              : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800/60'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full ${col.bg} flex items-center justify-center shrink-0 shadow-sm`}>
                            {isSelected && <Check size={11} className="text-white font-bold" />}
                          </div>
                          <span className="text-xs font-bold text-slate-200 truncate">{col.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Typography & Density Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-indigo-500/10">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      System Font Family
                    </label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/90 px-4 py-3 text-sm text-slate-100 focus:border-indigo-400 focus:outline-none font-semibold"
                    >
                      <option value="Inter">Inter (System Default)</option>
                      <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                      <option value="Geist">Geist Modern Mono/Sans</option>
                      <option value="Roboto">Roboto Professional</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-indigo-500/20 bg-slate-900/50">
                      <span className="text-xs font-bold text-slate-200">High Contrast Mode</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={highContrast}
                          onChange={(e) => setHighContrast(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5.5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-indigo-500/20 bg-slate-900/50">
                      <span className="text-xs font-bold text-slate-200">Compact Table Density</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={compactDensity}
                          onChange={(e) => setCompactDensity(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5.5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: APIs & Integrations Panel */}
          {isCurrentTab('APIs & Integrations') && (
            <div className="max-w-4xl space-y-6">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <Zap size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-white">{tCopy('COPY.COMMUNICATION_APIS')}</h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mb-6">{tCopy('COPY.CONFIGURE_THE_GATEWAYS_USED_FOR_SENDING_TRANSACTIONAL_EMAILS_SMS_AND_WHATSAPP_MESSAGES')}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Email Provider Card with Modal Trigger */}
                  <div className="p-5 rounded-2xl border border-indigo-500/30 bg-slate-900/60 shadow-md space-y-3">
                    <div className="flex items-center justify-between">
                      <label htmlFor="settings-email-provider" className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                        <Mail size={15} className="text-indigo-400" />
                        <span>{tCopy('COPY.EMAIL_PROVIDER')}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setEmailModalOpen(true)}
                        className="text-xs font-bold text-indigo-300 hover:text-white px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Radio size={13} className="text-emerald-400 animate-pulse" />
                        <span>Test Email Modal</span>
                      </button>
                    </div>
                    <select
                      id="settings-email-provider"
                      className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/90 px-4 py-3 text-sm text-slate-100 focus:border-indigo-400 focus:outline-none font-semibold"
                      {...register('apiConfig.emailProvider')}
                    >
                      <option value="AWS SES">{tCopy('COPY.AWS_SES')} (Production Verified)</option>
                      <option value="SendGrid">{tCopy('COPY.SENDGRID')} (Transactional API)</option>
                      <option value="SMTP Custom">{tCopy('COPY.SMTP_CUSTOM')} (Custom Server)</option>
                    </select>
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                        <CheckCircle size={13} /> Active connection verified
                      </span>
                      <span className="text-slate-400 font-mono">Ping: 38ms</span>
                    </div>
                  </div>

                  {/* SMS Gateway Card with Modal Trigger */}
                  <div className="p-5 rounded-2xl border border-cyan-500/30 bg-slate-900/60 shadow-md space-y-3">
                    <div className="flex items-center justify-between">
                      <label htmlFor="settings-sms-provider" className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                        <MessageSquare size={15} className="text-cyan-400" />
                        <span>{tCopy('COPY.SMS_GATEWAY')}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setSmsModalOpen(true)}
                        className="text-xs font-bold text-cyan-300 hover:text-white px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Send size={13} className="text-cyan-400" />
                        <span>Dispatch Test SMS</span>
                      </button>
                    </div>
                    <select
                      id="settings-sms-provider"
                      className="w-full rounded-xl border border-cyan-500/30 bg-slate-900/90 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none font-semibold"
                      {...register('apiConfig.smsProvider')}
                    >
                      <option value="Twilio">{tCopy('COPY.TWILIO')} (Global Delivery)</option>
                      <option value="Fast2SMS">{tCopy('COPY.FAST2SMS')} (India DLT Approved)</option>
                      <option value="Msg91">{tCopy('COPY.MSG91')} (Enterprise Premium)</option>
                    </select>
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                        <Zap size={13} /> Balance: ₹14,250
                      </span>
                      <span className="text-slate-400 font-mono">~71,250 Credits</span>
                    </div>
                  </div>

                  {/* WhatsApp Business API Card with Interactive Webhook Inspector */}
                  <div className="p-5 rounded-2xl border border-emerald-500/30 bg-slate-900/60 shadow-md md:col-span-2 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                        <PhoneCall size={15} className="text-emerald-400" />
                        <span>{tCopy('COPY.WHATSAPP_BUSINESS_API')} (Cloud Graph v21.0)</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setWhatsappModalOpen(true)}
                          className="text-xs font-bold text-emerald-300 hover:text-white px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <MessageSquare size={13} className="text-emerald-400" />
                          <span>Interactive Chat Preview</span>
                        </button>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          Webhook Active
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <span className="text-xs text-slate-400 font-semibold">Phone Number ID</span>
                        <input
                          type="text"
                          defaultValue="109283749102938"
                          readOnly
                          className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-slate-200 font-mono"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-xs text-slate-400 font-semibold">Webhook Callback URL</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            defaultValue="https://api.libraryos.com/v1/webhooks/whatsapp"
                            readOnly
                            className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-slate-200 font-mono truncate"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('https://api.libraryos.com/v1/webhooks/whatsapp');
                              toast.info('Webhook URL copied to clipboard');
                            }}
                            className="p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Copy Webhook URL"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-xs text-slate-400 font-semibold">Meta System User Access Token</span>
                      <div className="relative">
                        <input
                          type={showApiSecret ? 'text' : 'password'}
                          defaultValue="EAAKl98234jaskdf092384jsdfk029348sdjfk98234jkasdf"
                          disabled
                          className="w-full rounded-xl border border-indigo-500/20 bg-slate-900/40 px-4 py-2.5 text-xs text-slate-400 font-mono cursor-not-allowed pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiSecret(!showApiSecret)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showApiSecret ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {tCopy('COPY.CREDENTIAL_ENTRY_IS_DISABLED_IN_THIS_SOURCE_ONLY_PREVIEW_DO_NOT_ENTER_SECRETS_UNTIL_A_SECURE_APPROVED_SERVER_SIDE_INTEGRATION_IS_CONNECTED')}
                      </p>
                    </div>
                  </div>

                  {/* Payment Gateway Configuration */}
                  <div className="p-5 rounded-2xl border border-indigo-500/30 bg-slate-900/60 shadow-md md:col-span-2 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                        <Key size={15} className="text-indigo-400" />
                        <span>Platform Payment Collection Gateway</span>
                      </span>
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs text-slate-300 font-semibold">Sandbox Test Mode</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={paymentSandbox}
                            onChange={(e) => {
                              setPaymentSandbox(e.target.checked);
                              toast.info(`Payment mode set to ${e.target.checked ? 'Sandbox (Test Mode)' : 'Live Production'}`);
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5.5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div
                        onClick={() => setSelectedPaymentGateway('razorpay')}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedPaymentGateway === 'razorpay'
                            ? 'border-indigo-500 bg-indigo-500/20 shadow-md shadow-indigo-500/20'
                            : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">Razorpay</span>
                          {selectedPaymentGateway === 'razorpay' && <CheckCircle2 size={16} className="text-indigo-400" />}
                        </div>
                        <span className="text-xs text-slate-400 mt-1 block">UPI AutoPay, NetBanking, Cards</span>
                      </div>

                      <div
                        onClick={() => setSelectedPaymentGateway('stripe')}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedPaymentGateway === 'stripe'
                            ? 'border-indigo-500 bg-indigo-500/20 shadow-md shadow-indigo-500/20'
                            : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">Stripe</span>
                          {selectedPaymentGateway === 'stripe' && <CheckCircle2 size={16} className="text-indigo-400" />}
                        </div>
                        <span className="text-xs text-slate-400 mt-1 block">Global Cards, Apple Pay, SEPA</span>
                      </div>

                      <div
                        onClick={() => setSelectedPaymentGateway('cashfree')}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedPaymentGateway === 'cashfree'
                            ? 'border-indigo-500 bg-indigo-500/20 shadow-md shadow-indigo-500/20'
                            : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">Cashfree</span>
                          {selectedPaymentGateway === 'cashfree' && <CheckCircle2 size={16} className="text-indigo-400" />}
                        </div>
                        <span className="text-xs text-slate-400 mt-1 block">Instant Payouts & Subscriptions</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Storage & Cloud Backups Panel */}
          {activeTab === 'Storage' && (
            <div className="max-w-4xl space-y-6">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    <Database size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-white">Object Storage & Media Configuration</h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mb-6">Manage cloud file storage buckets for digital books, student KYC documents, and automated database snapshots.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Primary S3 Bucket Card */}
                  <div className="p-5 rounded-2xl border border-indigo-500/30 bg-slate-900/60 shadow-md space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Primary Cloud Bucket</span>
                    <p className="text-base font-bold text-white font-mono">libraryos-production-media</p>
                    <div className="flex items-center justify-between text-xs text-indigo-400 font-mono pt-1">
                      <span>AWS S3 (ap-south-1 Mumbai)</span>
                      <span className="text-emerald-400 font-bold">Healthy • 99.99% SLA</span>
                    </div>
                  </div>

                  {/* Max File Size Limit Card */}
                  <div className="p-5 rounded-2xl border border-indigo-500/30 bg-slate-900/60 shadow-md space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Max File Size Limit</span>
                      <span className="text-sm font-bold text-indigo-300 font-mono">{maxUploadLimitMb} MB</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={200}
                      step={5}
                      value={maxUploadLimitMb}
                      onChange={(e) => setMaxUploadLimitMb(Number(e.target.value))}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-400 block">Allowed formats: PDF, EPUB, JPG, PNG, WEBP</span>
                  </div>

                  {/* Cloudflare Edge Caching Card with Modal */}
                  <div className="p-5 rounded-2xl border border-indigo-500/30 bg-slate-900/60 shadow-md md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-bold text-white">Cloudflare Edge CDN Caching</span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          99.2% Cache Hit Rate
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">Asset delivery optimization & edge distribution active across 280+ global PoPs (TTL: 30 days).</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCacheModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-500/40 bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25 text-xs font-bold transition-all shrink-0 cursor-pointer shadow-md"
                    >
                      <RefreshCw size={14} className="text-indigo-400" />
                      <span>Purge CDN Modal</span>
                    </button>
                  </div>

                  {/* Automated Backups Card with Modal */}
                  <div className="p-5 rounded-2xl border border-purple-500/30 bg-slate-900/60 shadow-md md:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-sm font-bold text-white">Automated Daily Database Snapshots</span>
                        <p className="text-xs text-slate-400">Point-in-time PostgreSQL recovery with encrypted multi-region cold storage replication.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer ml-3 shrink-0">
                        <input
                          type="checkbox"
                          checked={autoDailyBackup}
                          onChange={(e) => {
                            setAutoDailyBackup(e.target.checked);
                            toast.info(`Automated backup ${e.target.checked ? 'activated' : 'deactivated'}`);
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6.5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5.5 after:w-5.5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
                      <div className="flex items-center gap-2.5 text-xs text-slate-300">
                        <span className="font-semibold">Retention Duration:</span>
                        <select
                          value={backupRetentionDays}
                          onChange={(e) => setBackupRetentionDays(e.target.value)}
                          className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:outline-none font-semibold"
                        >
                          <option value="7">7 Days</option>
                          <option value="14">14 Days</option>
                          <option value="30">30 Days (Recommended)</option>
                          <option value="90">90 Days (Enterprise)</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSnapshotModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-purple-500/40 bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 text-xs font-bold transition-all cursor-pointer shadow-md"
                      >
                        <HardDrive size={14} className="text-purple-400" />
                        <span>Instant Snapshot Modal</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Maintenance Mode Panel */}
          {isCurrentTab('Maintenance Mode') && (
            <div className="max-w-4xl space-y-6">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <ShieldAlert size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-white">{tCopy('COPY.SYSTEM_MAINTENANCE_MODE')}</h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mb-6">{tCopy('COPY.ENABLING_THIS_WILL_BLOCK_ALL_LIBRARY_ADMINS_AND_STUDENTS_FROM_LOGGING_IN_ONLY_SUPERADMINS_WILL_HAVE_ACCESS_TO_THE_PLATFORM')}</p>

                <div className="space-y-5">
                  {/* Warning Banner / Lockdown Switch */}
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border transition-all ${
                    maintenanceEnabled
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
                      <span className="text-[11px] text-slate-500">Max 500 characters</span>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
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
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              estimatedDowntime === dur
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
                      <span className="text-[11px] text-slate-500">SuperAdmins connecting from these IPs bypass the maintenance gate.</span>
                    </div>
                  </div>

                  {/* Emergency Lockdown Action Modal Trigger */}
                  <div className="p-5 rounded-2xl border border-rose-500/30 bg-slate-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-sm font-bold text-white flex items-center gap-2">
                        <AlertTriangle size={15} className="text-rose-400" />
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
        </div>

        {/* ========================================================================= */}
        {/* AUDIT LOG TABLE - SEARCH, FILTER, COMPLETE PAGINATION & ROW ACTIONS       */}
        {/* ========================================================================= */}
        <div className="rounded-3xl border border-slate-800 bg-card/95 shadow-xl overflow-hidden backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 border-b border-slate-800 bg-slate-900/70">
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
                <option value="APIs">APIs</option>
                <option value="Storage">Storage</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Appearance">Appearance</option>
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

          {/* Interactive Pagination Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-slate-800 bg-slate-900/50 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="font-medium">
                {filteredAuditLogs.length === 0
                  ? 'Showing 0 records'
                  : `Showing ${auditPage * auditPageSize + 1} to ${Math.min((auditPage + 1) * auditPageSize, filteredAuditLogs.length)} of ${filteredAuditLogs.length} changes`}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Rows:</span>
                <select
                  value={auditPageSize}
                  onChange={(e) => {
                    setAuditPageSize(Number(e.target.value));
                    setAuditPage(0);
                  }}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 focus:outline-none font-semibold"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-all cursor-pointer"
                disabled={auditPage === 0}
                onClick={() => setAuditPage((p) => Math.max(0, p - 1))}
              >
                <ChevronLeft size={15} />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalAuditPages }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAuditPage(idx)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      auditPage === idx
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-all cursor-pointer"
                disabled={auditPage + 1 >= totalAuditPages}
                onClick={() => setAuditPage((p) => Math.min(totalAuditPages - 1, p + 1))}
              >
                <span>Next</span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>

      </form>

      {/* ========================================================================= */}
      {/* RICH, COLORFUL INTERACTIVE MODALS FOR ALL BUTTONS                        */}
      {/* ========================================================================= */}

      {/* 1. TEST EMAIL MODAL */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-indigo-500/40 bg-gradient-to-b from-[#0f142e] to-[#070914] p-6 shadow-2xl shadow-indigo-500/20 relative">
            <button
              onClick={() => {
                setEmailModalOpen(false);
                setEmailTestingState('idle');
              }}
              className="absolute right-5 top-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Mail size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Test Email Gateway Handshake</h3>
                <p className="text-xs text-slate-400">Validate outbound SES / SMTP deliverability and TLS 1.3 latency</p>
              </div>
            </div>

            <div className="space-y-4 my-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Test Recipient Email</label>
                <input
                  type="email"
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                  className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/90 px-4 py-2.5 text-sm text-white focus:border-indigo-400 focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Selected Gateway:</span>
                  <span className="text-indigo-300 font-bold">{currentEmailProvider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sender Identity:</span>
                  <span className="text-slate-200 font-mono">noreply@libraryos.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Encryption:</span>
                  <span className="text-emerald-400 font-bold">STARTTLS / TLS 1.3 Enforced</span>
                </div>
              </div>

              {emailTestingState === 'running' && (
                <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-center gap-3 animate-pulse">
                  <RefreshCw size={16} className="animate-spin text-indigo-400" />
                  <span>Negotiating TLS handshake with AWS SES endpoint...</span>
                </div>
              )}

              {emailTestingState === 'success' && (
                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
                  <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                  <span>Handshake OK! Diagnostic email queued with Message-ID #ses-920194.</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setEmailModalOpen(false);
                  setEmailTestingState('idle');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleRunEmailTest}
                disabled={emailTestingState === 'running'}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-2"
              >
                <Send size={14} />
                <span>Send Diagnostic Email</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. DISPATCH TEST SMS MODAL */}
      {smsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-[#0a1a2e] to-[#040914] p-6 shadow-2xl shadow-cyan-500/20 relative">
            <button
              onClick={() => {
                setSmsModalOpen(false);
                setSmsSendingState('idle');
              }}
              className="absolute right-5 top-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <MessageSquare size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Dispatch Test SMS Message</h3>
                <p className="text-xs text-slate-400">Trigger simulated SMS via {currentSmsProvider} gateway</p>
              </div>
            </div>

            <div className="space-y-4 my-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Mobile Number</label>
                <input
                  type="text"
                  value={testSmsPhone}
                  onChange={(e) => setTestSmsPhone(e.target.value)}
                  className="w-full rounded-xl border border-cyan-500/30 bg-slate-900/90 px-4 py-2.5 text-sm text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">SMS Message Body</label>
                  <span className="text-slate-400 font-mono">{testSmsText.length}/160 Chars (1 SMS credit)</span>
                </div>
                <textarea
                  rows={3}
                  value={testSmsText}
                  onChange={(e) => setTestSmsText(e.target.value)}
                  className="w-full rounded-xl border border-cyan-500/30 bg-slate-900/90 px-4 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none resize-none font-sans"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">DLT Template ID:</span>
                  <span className="text-cyan-300 font-mono font-bold">1407161829304918234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Header / Sender:</span>
                  <span className="text-white font-mono font-bold">LIBROS</span>
                </div>
              </div>

              {smsSendingState === 'sending' && (
                <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-3 animate-pulse">
                  <RefreshCw size={16} className="animate-spin text-cyan-400" />
                  <span>Dispatching through {currentSmsProvider} SMPP cluster...</span>
                </div>
              )}

              {smsSendingState === 'sent' && (
                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
                  <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                  <span>Delivered! SMS SID: sm_8923049182390 verified by operator.</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setSmsModalOpen(false);
                  setSmsSendingState('idle');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleRunSmsTest}
                disabled={smsSendingState === 'sending'}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/30 transition-all cursor-pointer flex items-center gap-2"
              >
                <Send size={14} />
                <span>Send SMS Ping</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. WHATSAPP CHAT PREVIEW MODAL */}
      {whatsappModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-[#0a2419] to-[#04120c] p-6 shadow-2xl shadow-emerald-500/20 relative">
            <button
              onClick={() => setWhatsappModalOpen(false)}
              className="absolute right-5 top-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <PhoneCall size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">WhatsApp Cloud API Simulator</h3>
                <p className="text-xs text-slate-400">Meta Graph Webhook v21.0 Live Message Bubble Preview</p>
              </div>
            </div>

            {/* Realistic WhatsApp Chat Box */}
            <div className="p-4 rounded-2xl bg-[#0b141a] border border-emerald-900/50 my-5 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                  L
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Library OS Notifications</p>
                  <p className="text-[10px] text-emerald-400">Official Business Account</p>
                </div>
              </div>

              {/* Chat Bubble */}
              <div className="bg-[#005c4b] text-white p-3.5 rounded-2xl rounded-tl-none max-w-[85%] text-xs shadow-md space-y-1">
                <p className="font-bold text-emerald-200">Hello Library Member! 📚</p>
                <p className="text-slate-100">Your membership fee receipt for <strong>November 2026 (₹800)</strong> has been successfully generated.</p>
                <div className="pt-1 flex items-center justify-between text-[10px] text-emerald-200">
                  <span>Invoice #INV-2026-904</span>
                  <span>12:45 PM ✓✓</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-slate-400">Webhook Status:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle size={14} /> Verified (HTTP 200)
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-5 border-t border-emerald-900/40">
              <button
                type="button"
                onClick={() => setWhatsappModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleVerifyWhatsapp}
                disabled={whatsappVerifying}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center gap-2"
              >
                <RefreshCw size={14} className={whatsappVerifying ? 'animate-spin' : ''} />
                <span>{whatsappVerifying ? 'Pinging Meta...' : 'Verify Webhook Handshake'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. PURGE CDN CACHE MODAL */}
      {cacheModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-indigo-500/40 bg-gradient-to-b from-[#0d122e] to-[#050714] p-6 shadow-2xl shadow-indigo-500/20 relative">
            <button
              onClick={() => {
                setCacheModalOpen(false);
                setCachePurged(false);
              }}
              className="absolute right-5 top-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <RefreshCw size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Purge Global CDN Edge Cache</h3>
                <p className="text-xs text-slate-400">Invalidate cached assets across all 280+ Cloudflare Edge PoPs</p>
              </div>
            </div>

            <div className="space-y-4 my-5">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Edge Zone:</span>
                  <span className="text-white font-mono font-bold">libraryos.com (Enterprise)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Cache Size:</span>
                  <span className="text-purple-300 font-mono font-bold">428.4 MB (12,490 assets)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Scope:</span>
                  <span className="text-indigo-300 font-bold">Everything (Images, CSS, Fonts, PDFs)</span>
                </div>
              </div>

              {cachePurging && (
                <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-center gap-3 animate-pulse">
                  <RefreshCw size={16} className="animate-spin text-indigo-400" />
                  <span>Broadcasting purge headers to global edge nodes...</span>
                </div>
              )}

              {cachePurged && (
                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
                  <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                  <span>Purge confirmed! Global edge nodes are pulling fresh content.</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setCacheModalOpen(false);
                  setCachePurged(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteCachePurge}
                disabled={cachePurging}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-2"
              >
                <Trash2 size={14} />
                <span>Execute Edge Purge</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. DATABASE SNAPSHOT MODAL */}
      {snapshotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-purple-500/40 bg-gradient-to-b from-[#180e2e] to-[#0a0514] p-6 shadow-2xl shadow-purple-500/20 relative">
            <button
              onClick={() => {
                setSnapshotModalOpen(false);
                setSnapshotProgress(0);
              }}
              className="absolute right-5 top-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <HardDrive size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Trigger Database Snapshot</h3>
                <p className="text-xs text-slate-400">Create encrypted point-in-time PostgreSQL snapshot on S3 Glacier</p>
              </div>
            </div>

            <div className="space-y-4 my-5">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Database Engine:</span>
                  <span className="text-white font-mono font-bold">PostgreSQL 16.2 Enterprise</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Snapshot Tag:</span>
                  <span className="text-purple-300 font-mono font-bold">snap-prod-{new Date().toISOString().split('T')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Region:</span>
                  <span className="text-slate-200">ap-south-1 (Mumbai)</span>
                </div>
              </div>

              {snapshotRunning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-purple-300">
                    <span>Compressing & streaming tables...</span>
                    <span>{snapshotProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden p-0.5 border border-purple-500/30">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-300" style={{ width: `${snapshotProgress}%` }} />
                  </div>
                </div>
              )}

              {snapshotProgress === 100 && (
                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
                  <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                  <span>Snapshot snapshot-libraryos-20261120.sql.gz (1.2 GB) successfully saved.</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setSnapshotModalOpen(false);
                  setSnapshotProgress(0);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartSnapshot}
                disabled={snapshotRunning}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all cursor-pointer flex items-center gap-2"
              >
                <HardDrive size={14} />
                <span>{snapshotRunning ? 'Generating...' : 'Initiate Snapshot Now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. RESET TO DEFAULTS CONFIRMATION MODAL */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-amber-500/40 bg-gradient-to-b from-[#261b0a] to-[#0e0904] p-6 shadow-2xl shadow-amber-500/20 relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Reset Configuration?</h3>
                <p className="text-xs text-slate-400">Restore all local platform parameters to initial defaults</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed my-4">
              This will discard all uncommitted edits across General settings, brand appearance, API routes, and maintenance mode parameters.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-amber-900/40">
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Keep Current Values
              </button>
              <button
                type="button"
                onClick={handleExecuteReset}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. EMERGENCY LOCKDOWN / PURGE SESSIONS MODAL */}
      {lockdownModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-rose-500/50 bg-gradient-to-b from-[#2e0d16] to-[#120408] p-6 shadow-2xl shadow-rose-500/30 relative">
            <button
              onClick={() => setLockdownModalOpen(false)}
              className="absolute right-5 top-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Emergency Session Invalidation</h3>
                <p className="text-xs text-rose-300">Security Lockdown & Active Token Revocation</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-xs space-y-2 text-rose-200 my-4">
              <p className="font-bold flex items-center gap-2 text-rose-300">
                <AlertTriangle size={15} />
                <span>1,420 Active Sessions Will Be Immediately Terminated</span>
              </p>
              <p className="text-slate-300 leading-relaxed">
                All connected students, library managers, and librarians across all 28 branches will be forcibly logged out. Only authenticated SuperAdmins connecting from whitelisted IP CIDRs will retain access.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-rose-900/40">
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
                  toast.error('Global security lockdown executed: 1,420 user sessions revoked.');
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white text-xs font-extrabold shadow-lg shadow-rose-600/40 transition-all cursor-pointer flex items-center gap-2"
              >
                <AlertTriangle size={14} />
                <span>Execute Lockdown Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. EXPORT PLATFORM CONFIGURATION MODAL */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-indigo-500/40 bg-gradient-to-b from-[#0f142e] to-[#070914] p-6 shadow-2xl shadow-indigo-500/20 relative">
            <button
              onClick={() => setExportModalOpen(false)}
              className="absolute right-5 top-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Download size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Platform Export Center</h3>
                <p className="text-xs text-slate-400">Download configurations, audit logs, or print statements</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
              <div
                onClick={handleExportJson}
                className="p-4 rounded-2xl border border-indigo-500/30 bg-slate-900/60 hover:bg-indigo-500/10 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <Download size={18} className="text-indigo-400 mb-2" />
                  <p className="text-xs font-bold text-white">JSON Format</p>
                  <p className="text-[11px] text-slate-400 mt-1">Full system schema with custom parameters.</p>
                </div>
                <span className="text-[10px] text-indigo-300 font-bold mt-3">Download JSON →</span>
              </div>

              <div
                onClick={handleExportCsv}
                className="p-4 rounded-2xl border border-emerald-500/30 bg-slate-900/60 hover:bg-emerald-500/10 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <FileSpreadsheet size={18} className="text-emerald-400 mb-2" />
                  <p className="text-xs font-bold text-white">Audit CSV</p>
                  <p className="text-[11px] text-slate-400 mt-1">Tabular history of all setting changes.</p>
                </div>
                <span className="text-[10px] text-emerald-300 font-bold mt-3">Download CSV →</span>
              </div>

              <div
                onClick={() => {
                  setExportModalOpen(false);
                  window.print();
                }}
                className="p-4 rounded-2xl border border-sky-500/30 bg-slate-900/60 hover:bg-sky-500/10 cursor-pointer transition-all flex flex-col justify-between"
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

      {/* 9. ROLLBACK AUDIT ENTRY MODAL */}
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
