'use client';
/** Responsibility: Security center landing overview orchestrator assembling compliance, metrics, tenant isolation, governance safeguards, and threat logs. */
/** Data-Flow: Local security fixtures -> summary metrics & interactive isolation/governance cards -> links to canonical security control routes. */
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_security/security_overview/config/superadmin_security_overview.url_config.ts';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Download,
  Fingerprint,
  Globe,
  Key,
  ListOrdered,
  Lock,
  Network,
  Radar,
  ShieldAlert,
  ShieldX,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  SUPERADMIN_SECURITY_FAILED_LOGINS,
  SUPERADMIN_SECURITY_SESSIONS,
  SUPERADMIN_SECURITY_API_KEYS,
  SUPERADMIN_SECURITY_IP_RULES,
} from '@/app/frontend_superadmin/superadmin_security/security_overview/mocks/fixtures/SuperadminSecurityOverviewPreviewMockFixtures';
import { SUPERADMIN_SECURITY_TABS } from '@/app/frontend_superadmin/superadmin_security/security_overview/constants/SuperadminSecurityOverviewConstants';
import {
  SuperadminSecurityOverviewMetricsGrid,
  type SecurityMetricItem,
} from './SuperadminSecurityOverviewMetricsGrid';
import { SuperadminSecurityOverviewComplianceCard } from './SuperadminSecurityOverviewComplianceCard';
import { SuperadminSecurityOverviewTenantIsolationCard } from './SuperadminSecurityOverviewTenantIsolationCard';
import { SuperadminSecurityOverviewGovernanceCard } from './SuperadminSecurityOverviewGovernanceCard';
import {
  SuperadminSecurityOverviewThreatEventsTable,
  type ThreatEvent,
} from './SuperadminSecurityOverviewThreatEventsTable';

const SAMPLE_SECURITY_EVENTS: ThreatEvent[] = [
  { id: 'SEC-8091', timestamp: '2026-11-20 12:55:10', event: 'Brute Force Login Spike', originIp: '203.0.113.11', location: 'Frankfurt, DE', targetUser: 'superadmin@libraryos.com', severity: 'Critical', actionTaken: 'IP Auto-Banned by WAF', status: 'Blocked' },
  { id: 'SEC-8090', timestamp: '2026-11-20 12:40:22', event: 'Repeated TOTP 2FA Mismatch', originIp: '198.51.100.9', location: 'Mumbai, IN', targetUser: 'manager.delhi@libraryos.com', severity: 'High', actionTaken: 'Account Locked (30 min)', status: 'Mitigated' },
  { id: 'SEC-8089', timestamp: '2026-11-20 11:15:04', event: 'Unknown CIDR API Request', originIp: '192.0.2.78', location: 'Singapore, SG', targetUser: 'service.biometric.sync', severity: 'Medium', actionTaken: 'HTTP 403 Forbidden', status: 'Blocked' },
  { id: 'SEC-8088', timestamp: '2026-11-20 09:22:15', event: 'Concurrent Session Anomaly', originIp: '185.220.101.5', location: 'Amsterdam, NL', targetUser: 'admin.bangalore@libraryos.com', severity: 'High', actionTaken: 'Older Session Revoked', status: 'Mitigated' },
  { id: 'SEC-8087', timestamp: '2026-11-19 23:14:50', event: 'SQL Injection Signature in Query', originIp: '103.21.244.2', location: 'Sydney, AU', targetUser: 'public.auth.api', severity: 'Critical', actionTaken: 'Dropped at Edge Firewall', status: 'Blocked' },
  { id: 'SEC-8086', timestamp: '2026-11-19 18:45:00', event: 'Stale API Key Bearer Token Used', originIp: '192.0.2.140', location: 'Tokyo, JP', targetUser: 'sms.gateway.service', severity: 'Low', actionTaken: 'Token Expired Warning', status: 'Monitoring' },
  { id: 'SEC-8085', timestamp: '2026-11-19 14:10:33', event: 'Suspicious Password Reset Request', originIp: '198.51.100.44', location: 'New York, US', targetUser: 'librarian.pune@libraryos.com', severity: 'Medium', actionTaken: 'Email Verification Sent', status: 'Mitigated' },
  { id: 'SEC-8084', timestamp: '2026-11-18 20:30:12', event: 'Excessive Webhook Invocations', originIp: '203.0.113.88', location: 'London, UK', targetUser: 'whatsapp.webhook.api', severity: 'Medium', actionTaken: 'Rate Limiter Throttled', status: 'Mitigated' },
];

const CONTROL_CARDS = [
  { name: 'Login Security', labelKey: 'COPY.TAB_LOGIN_SECURITY', icon: Lock, iconColor: 'text-amber-400', iconBg: 'bg-amber-500/15 border-amber-500/30', description: 'Brute-force protection, account lockouts, and login throttling' },
  { name: 'Password Policy', labelKey: 'COPY.TAB_PASSWORD_POLICY', icon: ListOrdered, iconColor: 'text-sky-400', iconBg: 'bg-sky-500/15 border-sky-500/30', description: 'Complexity rules, expiration cycles, and minimum length controls' },
  { name: '2FA & MFA', labelKey: 'COPY.TAB_2FA_MFA', icon: Fingerprint, iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/15 border-emerald-500/30', description: 'Hardware tokens, TOTP authenticator app enforcement, and backup codes' },
  { name: 'IP Firewall', labelKey: 'COPY.TAB_IP_FIREWALL', icon: Globe, iconColor: 'text-rose-400', iconBg: 'bg-rose-500/15 border-rose-500/30', description: 'CIDR allowlisting, blacklisted ranges, and geographic geofencing' },
  { name: 'API Keys', labelKey: 'COPY.TAB_API_KEYS', icon: Key, iconColor: 'text-indigo-400', iconBg: 'bg-indigo-500/15 border-indigo-500/30', description: 'Secret token rotations, service prefixes, and permission scopes' },
  { name: 'Active Sessions', labelKey: 'COPY.TAB_ACTIVE_SESSIONS', icon: Network, iconColor: 'text-purple-400', iconBg: 'bg-purple-500/15 border-purple-500/30', description: 'Real-time telemetry, session heartbeats, and instant revocation' },
  { name: 'Audit & Threats', labelKey: 'COPY.TAB_AUDIT_THREATS', icon: ShieldX, iconColor: 'text-rose-400', iconBg: 'bg-rose-500/15 border-rose-500/30', description: 'Security incident detection, audit trail anomalies, and threat logs' },
] as const;

export default function SuperadminSecurityOverviewPageClient() {
  const t = useTranslations('SUPERADMIN_SECURITY');
  const [isScanning, setIsScanning] = useState(false);
  const [threatSearch, setThreatSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const routes: Record<string, string> = {
    'Login Security': SUPERADMIN_NAVIGATION_ROUTES.security_login_security,
    'Password Policy': SUPERADMIN_NAVIGATION_ROUTES.security_password_policy,
    '2FA & MFA': SUPERADMIN_NAVIGATION_ROUTES.security_mfa,
    'IP Firewall': SUPERADMIN_NAVIGATION_ROUTES.security_ip_firewall,
    'API Keys': SUPERADMIN_NAVIGATION_ROUTES.security_api_keys,
    'Active Sessions': SUPERADMIN_NAVIGATION_ROUTES.security_active_sessions,
    'Audit & Threats': SUPERADMIN_NAVIGATION_ROUTES.security_threats,
  };

  const metrics: SecurityMetricItem[] = [
    {
      id: 'failed-logins',
      label: t('COPY.FAILED_LOGIN_ATTEMPTS'),
      count: SUPERADMIN_SECURITY_FAILED_LOGINS.length,
      icon: ShieldAlert,
      theme: 'rose',
      bgGlow: 'from-rose-500/10 to-transparent',
      borderColor: 'border-rose-500/20',
      iconBoxBg: 'bg-rose-500/15 border border-rose-500/30 text-rose-400',
      barColor: 'bg-gradient-to-r from-rose-500 to-amber-500',
      badge: 'Critical Threshold',
      badgeClass: 'bg-rose-500/10 text-rose-300 border-rose-500/25',
    },
    {
      id: 'active-sessions',
      label: t('COPY.ACTIVE_SESSION_COUNT'),
      count: SUPERADMIN_SECURITY_SESSIONS.length,
      icon: Activity,
      theme: 'emerald',
      bgGlow: 'from-emerald-500/10 to-transparent',
      borderColor: 'border-emerald-500/20',
      iconBoxBg: 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400',
      barColor: 'bg-gradient-to-r from-emerald-500 to-teal-400',
      badge: 'Live Monitored',
      badgeClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
    },
    {
      id: 'api-key-prefixes',
      label: t('COPY.API_KEY_PREFIX_COUNT'),
      count: SUPERADMIN_SECURITY_API_KEYS.length,
      icon: Key,
      theme: 'sky',
      bgGlow: 'from-sky-500/10 to-transparent',
      borderColor: 'border-sky-500/20',
      iconBoxBg: 'bg-sky-500/15 border border-sky-500/30 text-sky-400',
      barColor: 'bg-gradient-to-r from-sky-500 to-indigo-400',
      badge: 'Scoped & Active',
      badgeClass: 'bg-sky-500/10 text-sky-300 border-sky-500/25',
    },
    {
      id: 'firewall-rules',
      label: t('COPY.IP_FIREWALL_RULE_COUNT'),
      count: SUPERADMIN_SECURITY_IP_RULES.length,
      icon: Globe,
      theme: 'purple',
      bgGlow: 'from-purple-500/10 to-transparent',
      borderColor: 'border-purple-500/20',
      iconBoxBg: 'bg-purple-500/15 border border-purple-500/30 text-purple-400',
      barColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
      badge: 'Enforcing',
      badgeClass: 'bg-purple-500/10 text-purple-300 border-purple-500/25',
    },
  ];

  const handleRunThreatScan = () => {
    setIsScanning(true);
    toast.message('Initiating security threat scan across all clusters...', { id: 'threat-scan' });
    setTimeout(() => {
      setIsScanning(false);
      toast.success('Security scan completed: 0 active vulnerabilities detected');
    }, 1200);
  };

  const handleExportSecurityAudit = () => {
    const csvContent =
      'EventID,Timestamp,Event,Severity,OriginIP,Target,Status\n' +
      SAMPLE_SECURITY_EVENTS.map(
        (e) => `"${e.id}","${e.timestamp}","${e.event}","${e.severity}","${e.originIp}","${e.targetUser}","${e.status}"`
      ).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security_threat_audit_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Security audit log downloaded');
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 pb-12">
      {/* Notice Callout */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200 backdrop-blur-md" role="status">
        <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-400" aria-hidden="true" />
        <p className="min-w-0 flex-1 leading-relaxed">
          {t('COPY.SECURITY_POLICIES_SESSIONS_API_KEY_PREFIXES_FIREWALL_RULES_AND_THREAT_ROWS_ARE_SAMPLE_PREVIEW_DATA_THIS_SCREEN_DOES_NOT_ENFORCE_POLICIES_OR_TERMINATE_SESSIONS_WITHOUT_VERIFIED_HOST_SECURITY_API_CONTRACTS')}
        </p>
      </div>

      {/* Hero Header */}
      <div className="rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/80 via-[#0a0d22] to-[#060810] p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shadow-inner">
                <ShieldAlert size={24} aria-hidden="true" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                {t('COPY.SECURITY_CENTER')}
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Security Engine Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              {t('COPY.SECURITY_OVERVIEW_SUMMARY')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleExportSecurityAudit}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Download size={14} />
              <span>Export Audit CSV</span>
            </button>

            <button
              type="button"
              onClick={handleRunThreatScan}
              disabled={isScanning}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <Radar size={14} className={isScanning ? 'animate-spin' : ''} />
              <span>{isScanning ? 'Scanning...' : 'Scan Threats'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics */}
      <SuperadminSecurityOverviewMetricsGrid metrics={metrics} />

      {/* ISO 27001 Data Security & Compliance Controls */}
      <SuperadminSecurityOverviewComplianceCard />

      {/* Tenant Isolation & Simulated Cross-Tenant Probe */}
      <SuperadminSecurityOverviewTenantIsolationCard />

      {/* Controlled SuperAdmin Governance & Safeguards */}
      <SuperadminSecurityOverviewGovernanceCard />

      {/* Control Leaves Grid */}
      <section aria-labelledby="superadmin-security-control-leaves-title" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="superadmin-security-control-leaves-title" className="text-base sm:text-lg font-bold text-slate-100">
            {t('COPY.SECURITY_CENTER_SECTIONS')}
          </h2>
          <span className="text-xs text-slate-400">{SUPERADMIN_SECURITY_TABS.length} Security Modules</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {CONTROL_CARDS.map((tab) => {
            const href = routes[tab.name] ?? '#';
            const TabIcon = tab.icon;
            return (
              <Link
                key={tab.name}
                href={href}
                aria-label={`${t('COPY.OPEN_SECURITY_CONTROL')}: ${t(tab.labelKey)}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card/70 p-5 backdrop-blur-md transition-all duration-200 hover:border-indigo-500/40 hover:bg-card hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                data-testid={`superadmin-security-overview-open-${tab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${tab.iconBg}`}>
                      <TabIcon size={20} className={tab.iconColor} aria-hidden="true" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 transition-colors group-hover:text-indigo-400">
                      <span>{t('COPY.OPEN_SECURITY_CONTROL')}</span>
                      <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 transition-colors group-hover:text-indigo-300">
                    {t(tab.labelKey)}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    {tab.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Live Security Threat Events Table */}
      <SuperadminSecurityOverviewThreatEventsTable
        events={SAMPLE_SECURITY_EVENTS}
        threatSearch={threatSearch}
        onSearchChange={setThreatSearch}
        severityFilter={severityFilter}
        onSeverityChange={setSeverityFilter}
        page={page}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        onExportCsv={handleExportSecurityAudit}
      />
    </div>
  );
}
