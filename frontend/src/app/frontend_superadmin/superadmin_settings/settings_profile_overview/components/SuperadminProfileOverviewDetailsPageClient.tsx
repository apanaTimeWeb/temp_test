'use client';

import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_settings/settings_profile_overview/config/superadmin_profile_overview.url_config.ts';
import { useSuperadminProfileOverviewDetailsConfirm } from '@/app/frontend_superadmin/superadmin_settings/settings_profile_overview/hooks/useSuperadminProfileOverviewDetailsConfirm';
/** Responsibility: renders the superadmin_profile overview route UI; the module Main remains a thin composition boundary. */
/** Data-Flow: canonical route -> SuperadminProfileOverviewDetailsPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { SUPERADMIN_SETTINGS_PROFILE_OVERVIEW_ROUTES as __SUPERADMIN_SETTINGS_PROFILE_OVERVIEW_ROUTES } from "@/app/frontend_superadmin/superadmin_settings/settings_profile_overview/config/superadmin_profile_overview.url_config";
import { useState, useMemo, useEffect, useRef } from 'react';
import { User, UserCog, KeyRound, Fingerprint, History, MonitorSmartphone, LogOut, CheckCircle, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { SemanticColumnDef as ColDef, SemanticCellParams as ICellRendererParams } from '@/app/frontend_superadmin/superadmin_settings/settings_profile_overview/components/SuperadminProfileOverviewDetailsSemanticTable';
import { clearAuthState } from '@/lib/auth';
import SuperadminProfileOverviewDetailsBasicPanels from '@/app/frontend_superadmin/superadmin_settings/settings_profile_overview/components/SuperadminProfileOverviewDetailsBasicPanels';
import SuperadminProfileOverviewDetailsSecurityPanels from '@/app/frontend_superadmin/superadmin_settings/settings_profile_overview/components/SuperadminProfileOverviewDetailsSecurityPanels';
import type { SuperadminProfileLoginHistoryItem, SuperadminProfileTab } from '@/app/frontend_superadmin/superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewDetailsTypes';
import { SUPERADMIN_PROFILE_TABS } from '@/app/frontend_superadmin/superadmin_settings/settings_profile_overview/constants/SuperadminProfileOverviewDetailsConstants';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_PROFILE_OVERVIEW_PAGE_CLIENT_TAB_ICONS } from '@/app/frontend_superadmin/superadmin_settings/settings_profile_overview/constants/SuperadminProfileOverviewDetailsStaticConstants';


import { SUPERADMIN_PROFILE_SAMPLE_LOGIN_HISTORY, SUPERADMIN_PROFILE_SAMPLE_SESSIONS } from '@/app/frontend_superadmin/superadmin_settings/settings_profile_overview/mocks/fixtures/SuperadminProfileOverviewDetailsSecurityMockFixtures';
/**
 * Renders the `superadmin_profile` view owned by `SuperadminProfileOverviewDetailsPageClient`.
 * Owns local UI state for `activeTab`, `notice`, `showLogout`.
 * Effect lifecycle boundaries are `[showLogout]`; listeners/timers/focus are cleaned up by their owning effects.
 */
export default function SuperadminProfileOverviewDetailsPageClient() {
  const confirm = useSuperadminProfileOverviewDetailsConfirm();
  const tCopy = useTranslations('SUPERADMIN_PROFILE');
  
  const navigateToWorkflow = (key: string) => {
    const routes: Record<string, string> = {
    "Profile": SUPERADMIN_NAVIGATION_ROUTES.profile_overview__details,
    "Edit Profile": SUPERADMIN_NAVIGATION_ROUTES.profile_overview__edit,
    "Change Password": SUPERADMIN_NAVIGATION_ROUTES.profile_security__change_password,
    "2FA": SUPERADMIN_NAVIGATION_ROUTES.profile_security__two_factor,
    "Login History": SUPERADMIN_NAVIGATION_ROUTES.profile_login_history,
    "Active Sessions": SUPERADMIN_NAVIGATION_ROUTES.profile_active_sessions,
    "Security Settings": SUPERADMIN_NAVIGATION_ROUTES.profile_security
    };
    const route = routes[key];
    if (route) { const target = new URL(route, window.location.origin); const query = new URLSearchParams(window.location.search); query.delete('view'); query.forEach((value, key) => { if (!target.searchParams.has(key)) target.searchParams.append(key, value); }); window.location.assign(target.pathname + target.search + target.hash); }
  };
const router = useRouter();
  const [activeTab] = useState<SuperadminProfileTab>("Profile");
  const [notice, setNotice] = useState('');
  const [showLogout, setShowLogout] = useState(false);
  const [profileFormDirty, setProfileFormDirty] = useState(false);
  const requestTabChange = async (nextTab: SuperadminProfileTab) => {
    if (profileFormDirty && !await confirm(tCopy('COPY.UNSAVED_CHANGES_WARNING'))) return;
    if (profileFormDirty) setProfileFormDirty(false);
    navigateToWorkflow(nextTab);
  };
  const confirmLogout = async () => {
    if (profileFormDirty && !await confirm(tCopy('COPY.UNSAVED_CHANGES_WARNING'))) return;
    clearAuthState();
    router.replace(__SUPERADMIN_SETTINGS_PROFILE_OVERVIEW_ROUTES.SUPERADMIN_PROFILE_URLS.AUTH_LOGIN);
  };
  const logoutDialogRef = useRef<HTMLDivElement>(null);

  // Effect contract: attach keyboard handling for the active interactive surface and remove it during cleanup; dependency set [showLogout] is the deliberate re-run boundary.
  useEffect(() => {
    if (!showLogout) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    logoutDialogRef.current?.querySelector<HTMLButtonElement>('button:not([disabled])')?.focus();
    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setShowLogout(false); return; }
      if (event.key !== 'Tab' || !logoutDialogRef.current) return;
      const controls = Array.from<HTMLElement>(logoutDialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled])'));
      const first = controls[0]; const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', handleDialogKeyDown);
    return () => { document.removeEventListener('keydown', handleDialogKeyDown); previouslyFocused?.focus(); };
  }, [showLogout]);
  const [twoFactorEnabled] = useState(true);
  const [loginAlerts] = useState(true);
  
  
  


  
  const tabs = SUPERADMIN_PROFILE_TABS.map(({ name, iconName }) => ({
    name,
    label: tCopy(({ Profile: 'COPY.TAB_PROFILE', 'Edit Profile': 'COPY.TAB_EDIT_PROFILE', 'Change Password': 'COPY.TAB_CHANGE_PASSWORD', '2FA': 'COPY.TAB_TWO_FACTOR', 'Login History': 'COPY.TAB_LOGIN_HISTORY', 'Active Sessions': 'COPY.TAB_ACTIVE_SESSIONS', 'Security Settings': 'COPY.TAB_SECURITY_SETTINGS' } as const)[name]),
    icon: ({
      user: SUPERADMIN_PROFILE_OVERVIEW_PAGE_CLIENT_TAB_ICONS.User,
      'user-cog': SUPERADMIN_PROFILE_OVERVIEW_PAGE_CLIENT_TAB_ICONS.UserCog,
      'key-round': SUPERADMIN_PROFILE_OVERVIEW_PAGE_CLIENT_TAB_ICONS.KeyRound,
      fingerprint: SUPERADMIN_PROFILE_OVERVIEW_PAGE_CLIENT_TAB_ICONS.Fingerprint,
      history: SUPERADMIN_PROFILE_OVERVIEW_PAGE_CLIENT_TAB_ICONS.History,
      'monitor-smartphone': SUPERADMIN_PROFILE_OVERVIEW_PAGE_CLIENT_TAB_ICONS.MonitorSmartphone,
      shield: SUPERADMIN_PROFILE_OVERVIEW_PAGE_CLIENT_TAB_ICONS.Shield,
    } as const)[iconName],
  }));

  const handleSave = () => {
    setNotice(tCopy('COPY.UNAVAILABLE_PROFILE_WRITE_NOTICE'));
  };

  const handleUnavailableSecurityAction = (_actionKey: 'REVOKE_SESSION') => {
    setNotice(tCopy('COPY.UNAVAILABLE_SECURITY_ACTION_NOTICE'));
  };

  const handleRevokeSession = (id: string) => {
    void id;
    handleUnavailableSecurityAction('REVOKE_SESSION');
  };

  const colDefs = useMemo<ColDef<SuperadminProfileLoginHistoryItem>[]>(() => [
    { headerName: tCopy('COPY.TABLE_COLUMN_DATE_TIME'), field: 'date', flex: 1.5, cellClass: 'text-primary font-medium' },
    { headerName: tCopy('COPY.TABLE_COLUMN_IP_ADDRESS'), field: 'ip', flex: 1, cellClass: 'text-secondary' },
    { headerName: tCopy('COPY.TABLE_COLUMN_LOCATION'), field: 'location', flex: 1.5, cellClass: 'text-primary' },
    { headerName: tCopy('COPY.TABLE_COLUMN_BROWSER'), field: 'browser', flex: 1, cellClass: 'text-secondary' },
    { headerName: tCopy('COPY.TABLE_COLUMN_STATUS'), field: 'status', flex: 1,
      cellRenderer: (p: ICellRendererParams<SuperadminProfileLoginHistoryItem>) => (
        <span className={`sa-badge ${p.value === 'Success' ? 'sa-badge--success' : 'sa-badge--danger'}`}>
          {p.value === 'Success' ? tCopy('COPY.LOGIN_STATUS_SUCCESS') : tCopy('COPY.LOGIN_STATUS_FAILED')}
        </span>
      )
    },
  ], [tCopy]);

  return (
    <div className="sa-page-animate relative">
      {showLogout && (
        <div className="sa-wizard-modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowLogout(false); }}>
          <div ref={logoutDialogRef} className="sa-wizard-modal sa-wizard-modal--narrow" role="dialog" aria-modal="true" aria-labelledby="superadmin-profile-logout-title" aria-describedby="superadmin-profile-logout-description" tabIndex={-1}>
            <div className="sa-wizard-modal-icon">
              <LogOut size={20} className="sa-metric--warning" />
            </div>
            <p id="superadmin-profile-logout-title" className="sa-wizard-modal-title">{tCopy("COPY.ARE_YOU_SURE_YOU_WANT_TO_LOGOUT")}</p>
            <p id="superadmin-profile-logout-description" className="sr-only">{tCopy("COPY.CONFIRM_WHETHER_TO_END_THE_CURRENT_SESSION")}</p>
            <div className="flex gap-3 mt-6">
              <button type="button" className="sa-btn-ghost sa-btn-ghost--sm flex-1" onClick={() => setShowLogout(false)} data-testid="superadmin-profile-profile-overview-cancel-1">{tCopy("COPY.CANCEL")}</button>
              <button type="button" className="sa-btn-ghost sa-btn-ghost--danger flex-1" onClick={confirmLogout} data-testid="superadmin-profile-profile-overview-logout-2">{tCopy("COPY.LOGOUT")}</button>
            </div>
          </div>
        </div>
      )}

      {notice && <p className="mb-5 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="alert">{notice}</p>}

      <p className="mb-5 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy("COPY.SESSION_LOGIN_HISTORY_AND_RECOVERY_CODE_PLACEHOLDERS_ARE_SAMPLE_DATA_NOT_VALID_CREDENTIALS_OR_CURRENT_ACCOUNT_TELEMETRY_PROFILE_PASSWORD_MFA_CHANGES_AND_SESSION_REVOCATION_REMAIN_UNAVAILABLE_UNTIL_THE_HOST_API_CONTRACT_IS_PROVIDED")}</p>
      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>{tCopy("COPY.LIBRARY_OS")}</span><span>/</span><span>{tCopy("COPY.SUPER_ADMIN")}</span><span>/</span><span>{tCopy("COPY.MY_PROFILE")}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title flex items-center gap-3">
            <User className="text-primary" size={28} /> {tCopy("COPY.MY_PROFILE")}
          </h1>
          <button type="button" onClick={() => setShowLogout(true)} className="sa-btn-ghost sa-btn-ghost--danger text-sm font-bold" data-testid="superadmin-profile-profile-overview-logout-3">
            <LogOut size={16} /> {tCopy("COPY.LOGOUT")}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div role="navigation" aria-label={tCopy("COPY.PROFILE_AND_SECURITY_SETTINGS")} className="flex items-center gap-2 mb-6 border-b border-border pb-2 overflow-x-auto hide-scrollbar"  data-testid="superadmin-superadmin-profile-overview-page-client-div-line-147">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            type="button"
            id={`superadmin-profile-tab-${tab.name.toLowerCase().replaceAll(' ', '-')}`}
            aria-current={activeTab === tab.name ? 'page' : undefined}
            aria-controls="superadmin-profile-tabpanel"
            onClick={() => requestTabChange(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold motion-safe:transition-all motion-reduce:transition-none whitespace-nowrap ${
              activeTab === tab.name 
                ? 'bg-primary-subtle text-primary border border-focus shadow-card' 
                : 'text-secondary hover:bg-surface-hover hover:text-primary'
            }`}
           data-testid={`superadmin-profile-profile-overview-set-active-tab-4-${String(tab.name)}`}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Sidebar Profile Card (Always visible) */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="sa-card p-6 flex flex-col items-center text-center sticky top-6">
            <div className="relative group mb-4" aria-label={tCopy("COPY.PROFILE_AVATAR_PREVIEW_UPLOAD_UNAVAILABLE")}>
              <div className="w-32 h-32 rounded-full bg-primary-subtle flex items-center justify-center text-primary text-4xl font-bold border-2 border-focus">
                {tCopy("COPY.SA")}</div>
              <div className="absolute inset-0 bg-overlay rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center motion-safe:transition-opacity motion-reduce:transition-none">
                <span className="text-xs text-primary text-center px-2">{tCopy("COPY.AVATAR_UPLOAD_UNAVAILABLE")}</span>
              </div>
            </div>
            <h2 className="text-xl font-bold text-primary">{tCopy("COPY.SUPER_ADMIN")}</h2>
            <p className="text-xs text-primary font-bold tracking-widest uppercase mt-1">{tCopy("COPY.PLATFORM_OWNER")}</p>
            
            <div className="w-full h-px bg-surface-hover my-5" />
            
            <div className="w-full space-y-4 text-left">
              <div>
                <p className="text-xs text-secondary mb-1">{tCopy("COPY.EMAIL_ADDRESS")}</p>
                <p className="text-sm text-primary font-medium">{tCopy("COPY.ADMIN_EXAMPLE_INVALID")}</p>
              </div>
              <div>
                <p className="text-xs text-secondary mb-1">{tCopy("COPY.PHONE_NUMBER")}</p>
                <p className="text-sm text-primary font-medium">+91 0000000000</p>
              </div>
              <div>
                <p className="text-xs text-secondary mb-1">{tCopy("COPY.ACCOUNT_STATUS")}</p>
                <p className="text-sm text-success font-medium flex items-center gap-1">
                  <CheckCircle size={14} /> {tCopy("COPY.ACTIVE")}
                </p>
              </div>
              <div>
                <p className="text-xs text-secondary mb-1">{tCopy("COPY.LAST_PASSWORD_RESET")}</p>
                <p className="text-sm text-primary font-medium">{tCopy("COPY.45_DAYS_AGO")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div id="superadmin-profile-tabpanel"  aria-labelledby={`superadmin-profile-tab-${activeTab.toLowerCase().replaceAll(' ', '-')}`} tabIndex={0} className="md:col-span-8 lg:col-span-9 sa-card p-6 min-h-136">
          
          {['Profile', 'Edit Profile', 'Change Password'].includes(activeTab) ? (
            <SuperadminProfileOverviewDetailsBasicPanels activeTab={activeTab} onSave={handleSave} onDirtyChange={setProfileFormDirty} />
          ) : (
            <SuperadminProfileOverviewDetailsSecurityPanels
              activeTab={activeTab}
              twoFactorEnabled={twoFactorEnabled}
              loginAlerts={loginAlerts}
              loginHistory={SUPERADMIN_PROFILE_SAMPLE_LOGIN_HISTORY}
              colDefs={colDefs}
              sessions={SUPERADMIN_PROFILE_SAMPLE_SESSIONS}
              onRevokeSession={handleRevokeSession}
            />
          )}

        </div>
      </div>
    </div>
  );
}
