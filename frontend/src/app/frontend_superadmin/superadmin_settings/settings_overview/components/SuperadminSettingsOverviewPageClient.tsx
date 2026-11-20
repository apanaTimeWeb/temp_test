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

const SAMPLE_AUDIT_LOGS: AuditLogEntry[] = [
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

/**
 * Renders the `superadmin_settings` view owned by `SuperadminSettingsOverviewPageClient`.
 * Owns local UI state for `activeTab`, `saved`.
 * Dirty form state is guarded before destructive or route-leaving actions.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
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

  // Audit table state with full pagination
  const [auditSearch, setAuditSearch] = useState('');
  const [auditCategory, setAuditCategory] = useState<string>('All');
  const [auditPage, setAuditPage] = useState(0);
  const [auditPageSize, setAuditPageSize] = useState(5);

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

  const handleExportJson = () => {
    const data = watch();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `platform_settings_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Platform configuration exported successfully');
  };

  const handleResetDefaults = () => {
    reset(SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS);
    toast.info('Form reset to default configuration');
  };

  // Filtered audit logs
  const filteredAuditLogs = useMemo(() => {
    return SAMPLE_AUDIT_LOGS.filter((log) => {
      const matchesCategory = auditCategory === 'All' || log.category === auditCategory;
      const q = auditSearch.toLowerCase();
      const matchesSearch =
        !q ||
        log.setting.toLowerCase().includes(q) ||
        log.modifiedBy.toLowerCase().includes(q) ||
        log.newVal.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [auditSearch, auditCategory]);

  const totalAuditPages = Math.max(1, Math.ceil(filteredAuditLogs.length / auditPageSize));
  const paginatedAuditLogs = useMemo(() => {
    const start = auditPage * auditPageSize;
    return filteredAuditLogs.slice(start, start + auditPageSize);
  }, [filteredAuditLogs, auditPage, auditPageSize]);

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 pb-12">
      <form onSubmit={handleSubmit(handleSave)} noValidate data-testid="superadmin-superadmin-settings-overview-page-client-form-line-50">

        {/* Hero Header */}
        <div className="rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/80 via-[#0a0d22] to-[#060810] p-5 sm:p-6 shadow-xl mb-6 backdrop-blur-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>{tCopy('COPY.LIBRARY_OS')}</span>
                <span>/</span>
                <span>{tCopy('COPY.SUPER_ADMIN')}</span>
                <span>/</span>
                <span className="text-indigo-300 font-medium">{tCopy('COPY.SYSTEM_SETTINGS')}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2.5">
                <Settings className="text-indigo-400" size={24} /> {tCopy('COPY.SYSTEM_SETTINGS')}
              </h1>
              <p className="text-xs text-slate-400">
                Global platform configuration, regional parameters, third-party credentials, and system operational mode.
              </p>
            </div>

            {/* Action Buttons with Admin/Manager Button Style */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border/80 bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
                title="Reset to defaults"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={handleExportJson}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
                title="Export Settings JSON"
              >
                <Download size={14} />
                <span>Export JSON</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                data-testid="superadmin-settings-settings-overview-save-changes-1"
              >
                <CheckCircle size={15} />
                <span>{tCopy('COPY.SAVE_CHANGES')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* System Overview 4-KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="rounded-2xl border border-indigo-500/20 bg-slate-900/60 p-4.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Platform Identity</span>
              <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
                <Globe size={16} />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-lg font-bold text-slate-100">{watch('generalConfig.platformName') || 'Library OS'}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                <span>{watch('generalConfig.currency')}</span>
                <span>•</span>
                <span>{watch('generalConfig.timezone')}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-sky-500/20 bg-slate-900/60 p-4.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gateway Integrations</span>
              <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/25">
                <Zap size={16} />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-lg font-bold text-slate-100">{currentEmailProvider} & {currentSmsProvider}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-emerald-400 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Gateways Operational</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-purple-500/20 bg-slate-900/60 p-4.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Storage & CDN</span>
              <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/25">
                <Database size={16} />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-lg font-bold text-slate-100">42.8 GB / 100 GB</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-purple-300">
                <span>AWS S3 Primary</span>
                <span>•</span>
                <span>99.2% Cache Hit</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-rose-500/20 bg-slate-900/60 p-4.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">System State</span>
              <div className={`p-2 rounded-xl ${maintenanceEnabled ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'}`}>
                <ShieldAlert size={16} />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-lg font-bold text-slate-100">
                {maintenanceEnabled ? tCopy('COPY.MAINTENANCE_OFFLINE') : tCopy('COPY.MAINTENANCE_ONLINE')}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                <span>MFA SuperAdmin Enforced</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center justify-between gap-2 mb-6 border-b border-indigo-500/20 pb-2 overflow-x-auto" role="navigation" aria-label={tCopy('COPY.SYSTEM_SETTINGS_SECTIONS')}>
          <div className="flex items-center gap-2">
            {SUPERADMIN_SETTINGS_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  type="button"
                  key={tab.name}
                  id={`settings-tab-${tab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  aria-controls={`settings-panel-${tab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  aria-current={activeTab === tab.name ? 'page' : undefined}
                  onClick={() => setActiveTab(tab.name)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.name
                      ? 'border border-indigo-500/40 bg-indigo-500/20 text-indigo-300 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                  data-testid={`superadmin-settings-settings-overview-set-active-tab-2-${String(tab.name)}`}
                >
                  <Icon size={14} />
                  <span>{tCopy(tab.labelKey)}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => navigateToWorkflow(activeTab)}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold px-2 py-1 rounded-lg hover:bg-indigo-500/10 transition-colors cursor-pointer"
          >
            <span>Open Dedicated View</span>
            <ExternalLink size={13} />
          </button>
        </div>

        {SUPERADMIN_SETTINGS_TABS.filter((tab) => tab.name !== activeTab).map((tab) => {
          const tabId = tab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return <div key={tab.name} id={`settings-panel-${tabId}`} aria-labelledby={`settings-tab-${tabId}`} hidden />;
        })}

        {/* Content Panels */}
        <div
          id={`settings-panel-${activeTab.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
          className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0a0d22] to-[#060810] p-6 shadow-xl mb-8 min-h-[420px]"
          aria-labelledby={`settings-tab-${activeTab.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
          aria-label={tCopy('COPY.ACTIVE_TAB_SETTINGS_ARIA_LABEL', { tab: tCopy(SUPERADMIN_SETTINGS_TABS.find((tab) => tab.name === activeTab)?.labelKey ?? 'COPY.TAB_GENERAL') })}
          tabIndex={0}
        >
          {/* General & Regional Panel */}
          {activeTab === 'General' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-100 mb-1">{tCopy('COPY.GENERAL_REGIONAL')}</h2>
                <p className="text-xs text-slate-400 mb-6">{tCopy('COPY.GLOBAL_CONFIGURATION_APPLIED_TO_ALL_NEWLY_REGISTERED_LIBRARIES_BY_DEFAULT')}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label htmlFor="settings-platform-name" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      {tCopy('COPY.PLATFORM_NAME')}
                    </label>
                    <input
                      id="settings-platform-name"
                      type="text"
                      className="w-full rounded-xl border border-indigo-500/30 bg-indigo-500/[0.07] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                      aria-invalid={Boolean(errors.generalConfig?.platformName)}
                      aria-describedby={errors.generalConfig?.platformName ? 'settings-platform-name-error' : undefined}
                      {...register('generalConfig.platformName')}
                      data-testid="superadmin-settings-settings-overview-settings-platform-name-3"
                    />
                    {translateValidationMessage(errors.generalConfig?.platformName?.message) && (
                      <p id="settings-platform-name-error" className="text-xs text-rose-400" role="alert">
                        {translateValidationMessage(errors.generalConfig.platformName.message)}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label htmlFor="settings-support-email" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      {tCopy('COPY.GLOBAL_SUPPORT_EMAIL')}
                    </label>
                    <input
                      id="settings-support-email"
                      type="email"
                      className="w-full rounded-xl border border-indigo-500/30 bg-indigo-500/[0.07] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                      aria-invalid={Boolean(errors.generalConfig?.supportEmail)}
                      aria-describedby={errors.generalConfig?.supportEmail ? 'settings-support-email-error' : undefined}
                      {...register('generalConfig.supportEmail')}
                      data-testid="superadmin-settings-settings-overview-settings-support-email-4"
                    />
                    {translateValidationMessage(errors.generalConfig?.supportEmail?.message) && (
                      <p id="settings-support-email-error" className="text-xs text-rose-400" role="alert">
                        {translateValidationMessage(errors.generalConfig.supportEmail.message)}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="settings-default-currency" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      {tCopy('COPY.DEFAULT_CURRENCY')}
                    </label>
                    <select
                      id="settings-default-currency"
                      className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/90 px-3.5 py-2.5 text-sm text-slate-200 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                      aria-invalid={Boolean(errors.generalConfig?.currency)}
                      {...register('generalConfig.currency')}
                      data-testid="superadmin-settings-settings-overview-settings-default-currency-5"
                    >
                      <option value="INR (₹)">{tCopy('COPY.INR')}</option>
                      <option value="USD ($)">{tCopy('COPY.USD')}</option>
                      <option value="AED (د.إ)">{tCopy('COPY.AED')}</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="settings-default-timezone" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      {tCopy('COPY.DEFAULT_TIMEZONE')}
                    </label>
                    <select
                      id="settings-default-timezone"
                      className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/90 px-3.5 py-2.5 text-sm text-slate-200 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                      aria-invalid={Boolean(errors.generalConfig?.timezone)}
                      {...register('generalConfig.timezone')}
                      data-testid="superadmin-settings-settings-overview-settings-default-timezone-6"
                    >
                      <option value="Asia/Kolkata">{tCopy('COPY.ASIA_KOLKATA')}</option>
                      <option value="UTC">{tCopy('COPY.UTC')}</option>
                      <option value="America/New_York">{tCopy('COPY.AMERICA_NEW_YORK')}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* APIs & Integrations Panel */}
          {isCurrentTab('APIs & Integrations') && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-100 mb-1">{tCopy('COPY.COMMUNICATION_APIS')}</h2>
                <p className="text-xs text-slate-400 mb-6">{tCopy('COPY.CONFIGURE_THE_GATEWAYS_USED_FOR_SENDING_TRANSACTIONAL_EMAILS_SMS_AND_WHATSAPP_MESSAGES')}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="settings-email-provider" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      {tCopy('COPY.EMAIL_PROVIDER')}
                    </label>
                    <select
                      id="settings-email-provider"
                      className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/90 px-3.5 py-2.5 text-sm text-slate-200 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                      {...register('apiConfig.emailProvider')}
                    >
                      <option value="AWS SES">{tCopy('COPY.AWS_SES')}</option>
                      <option value="SendGrid">{tCopy('COPY.SENDGRID')}</option>
                      <option value="SMTP Custom">{tCopy('COPY.SMTP_CUSTOM')}</option>
                    </select>
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
                      <CheckCircle size={12} /> Active connection verified (Latency: 45ms)
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="settings-sms-provider" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      {tCopy('COPY.SMS_GATEWAY')}
                    </label>
                    <select
                      id="settings-sms-provider"
                      className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/90 px-3.5 py-2.5 text-sm text-slate-200 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                      {...register('apiConfig.smsProvider')}
                    >
                      <option value="Twilio">{tCopy('COPY.TWILIO')}</option>
                      <option value="Fast2SMS">{tCopy('COPY.FAST2SMS')}</option>
                      <option value="Msg91">{tCopy('COPY.MSG91')}</option>
                    </select>
                    <span className="text-[11px] text-sky-400 flex items-center gap-1 mt-1">
                      <Zap size={12} /> Balance: ₹14,250 (Estimated 71,250 SMS credits)
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2 pt-2 border-t border-indigo-500/10">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      {tCopy('COPY.WHATSAPP_BUSINESS_API')}
                    </label>
                    <input
                      type="password"
                      defaultValue="eaab18923098f98a7c290123"
                      disabled
                      className="w-full rounded-xl border border-indigo-500/20 bg-slate-900/40 px-3.5 py-2.5 text-sm text-slate-400 font-mono cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-400">
                      {tCopy('COPY.CREDENTIAL_ENTRY_IS_DISABLED_IN_THIS_SOURCE_ONLY_PREVIEW_DO_NOT_ENTER_SECRETS_UNTIL_A_SECURE_APPROVED_SERVER_SIDE_INTEGRATION_IS_CONNECTED')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Maintenance Mode Panel */}
          {isCurrentTab('Maintenance Mode') && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-100 mb-1">{tCopy('COPY.SYSTEM_MAINTENANCE_MODE')}</h2>
                <p className="text-xs text-slate-400 mb-6">{tCopy('COPY.ENABLING_THIS_WILL_BLOCK_ALL_LIBRARY_ADMINS_AND_STUDENTS_FROM_LOGGING_IN_ONLY_SUPERADMINS_WILL_HAVE_ACCESS_TO_THE_PLATFORM')}</p>

                <div className="space-y-5">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-amber-500/30 bg-amber-500/10">
                    <div className="space-y-0.5">
                      <span className="text-sm font-bold text-amber-200">{tCopy('COPY.ENABLE_MAINTENANCE')}</span>
                      <p className="text-xs text-slate-400">{tCopy('COPY.ENABLE_MAINTENANCE_MODE_IN_LOCAL_PREVIEW')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('maintenance.enabled')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="settings-maintenance-message" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      {tCopy('COPY.MESSAGE_SHOWN_TO_USERS')}
                    </label>
                    <textarea
                      id="settings-maintenance-message"
                      rows={4}
                      className="w-full rounded-xl border border-indigo-500/30 bg-indigo-500/[0.07] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 resize-none"
                      placeholder="e.g. System is undergoing scheduled maintenance. Services will resume shortly."
                      {...register('maintenance.message')}
                    />
                    {translateValidationMessage(errors.maintenance?.message?.message) && (
                      <p className="text-xs text-rose-400" role="alert">
                        {translateValidationMessage(errors.maintenance.message.message)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Storage Panel */}
          {activeTab === 'Storage' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-100 mb-1">Object Storage & Media Configuration</h2>
                <p className="text-xs text-slate-400 mb-6">Manage cloud file storage buckets for digital books, student KYC documents, and library assets.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-4 rounded-xl border border-indigo-500/20 bg-slate-900/40">
                    <span className="text-xs font-semibold text-slate-400">Primary Cloud Bucket</span>
                    <p className="text-sm font-bold text-slate-200 mt-1">libraryos-production-media</p>
                    <span className="text-[11px] text-indigo-400 font-mono mt-0.5 block">ap-south-1 (Mumbai)</span>
                  </div>

                  <div className="p-4 rounded-xl border border-indigo-500/20 bg-slate-900/40">
                    <span className="text-xs font-semibold text-slate-400">Max File Size Limit</span>
                    <p className="text-sm font-bold text-slate-200 mt-1">50 MB per document</p>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">Allowed: PDF, JPG, PNG, WEBP</span>
                  </div>

                  <div className="p-4 rounded-xl border border-indigo-500/20 bg-slate-900/40 md:col-span-2 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-400">Cloudflare Edge Caching</span>
                      <p className="text-xs text-slate-300 mt-0.5">Asset delivery optimization & CDN edge cache enabled (TTL: 30 days)</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Panel */}
          {activeTab === 'Appearance' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-100 mb-1">Theme & Interface Customization</h2>
                <p className="text-xs text-slate-400 mb-6">Configure the default visual styling and color themes across the Superadmin portal.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-indigo-500/40 bg-indigo-500/10 flex flex-col justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-200">Cyber Dark (Active)</p>
                      <p className="text-xs text-slate-400 mt-1">Deep blue/slate background with indigo neon glow.</p>
                    </div>
                    <span className="mt-3 text-xs text-indigo-300 font-semibold">Default System Theme</span>
                  </div>

                  <div className="p-4 rounded-xl border border-border/80 bg-slate-900/40 flex flex-col justify-between opacity-60">
                    <div>
                      <p className="text-sm font-bold text-slate-200">Midnight Slate</p>
                      <p className="text-xs text-slate-400 mt-1">Neutral dark monochrome with high contrast text.</p>
                    </div>
                    <span className="mt-3 text-xs text-slate-400">Available</span>
                  </div>

                  <div className="p-4 rounded-xl border border-border/80 bg-slate-900/40 flex flex-col justify-between opacity-60">
                    <div>
                      <p className="text-sm font-bold text-slate-200">Aurora Indigo</p>
                      <p className="text-xs text-slate-400 mt-1">Vibrant purple & indigo gradient accents.</p>
                    </div>
                    <span className="mt-3 text-xs text-slate-400">Available</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Audit Trail & Configuration History with Complete Pagination */}
        <div className="rounded-2xl border border-border/80 bg-card/90 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 border-b border-border/80 bg-slate-900/50">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Clock size={16} className="text-indigo-400" />
                <span>Configuration Change History</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Audit log of system parameters modified across all modules</p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative w-full sm:w-56">
                <Search size={14} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={auditSearch}
                  onChange={(e) => {
                    setAuditSearch(e.target.value);
                    setAuditPage(0);
                  }}
                  placeholder="Filter change history..."
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/70 pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-400 focus:outline-none"
                />
              </div>

              <select
                value={auditCategory}
                onChange={(e) => {
                  setAuditCategory(e.target.value);
                  setAuditPage(0);
                }}
                className="rounded-xl border border-indigo-500/25 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-200 focus:border-indigo-400 focus:outline-none"
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
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-border/80">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Setting Modified</th>
                  <th className="px-4 py-3">Modified By</th>
                  <th className="px-4 py-3">Previous Value</th>
                  <th className="px-4 py-3">Updated Value</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-slate-200">
                {paginatedAuditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                      No configuration records match the search filter.
                    </td>
                  </tr>
                ) : (
                  paginatedAuditLogs.map((entry) => (
                    <tr key={entry.id} className="hover:bg-indigo-500/5 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-400 whitespace-nowrap">{entry.timestamp}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                          {entry.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-100">{entry.setting}</td>
                      <td className="px-4 py-3 text-slate-300">{entry.modifiedBy}</td>
                      <td className="px-4 py-3 text-slate-400 font-mono line-through">{entry.oldVal}</td>
                      <td className="px-4 py-3 text-emerald-300 font-mono font-medium">{entry.newVal}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                          <CheckCircle size={12} />
                          <span>{entry.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Interactive Pagination Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border/80 bg-slate-900/40 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span>
                {filteredAuditLogs.length === 0
                  ? 'Showing 0 records'
                  : `Showing ${auditPage * auditPageSize + 1} to ${Math.min((auditPage + 1) * auditPageSize, filteredAuditLogs.length)} of ${filteredAuditLogs.length} changes`}
              </span>
              <div className="flex items-center gap-1.5 ml-2">
                <span className="text-[11px] text-slate-500">Rows:</span>
                <select
                  value={auditPageSize}
                  onChange={(e) => {
                    setAuditPageSize(Number(e.target.value));
                    setAuditPage(0);
                  }}
                  className="rounded-lg border border-border/80 bg-slate-900 px-2 py-0.5 text-xs text-slate-300 focus:outline-none"
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
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold transition-all cursor-pointer"
                disabled={auditPage === 0}
                onClick={() => setAuditPage((p) => Math.max(0, p - 1))}
              >
                <ChevronLeft size={14} />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalAuditPages }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAuditPage(idx)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      auditPage === idx
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold transition-all cursor-pointer"
                disabled={auditPage + 1 >= totalAuditPages}
                onClick={() => setAuditPage((p) => Math.min(totalAuditPages - 1, p + 1))}
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
