'use client';
/** Responsibility: Superadmin Profile Security Panels; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminProfileOverviewSecurityPanels formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import SuperadminProfileOverviewSemanticTable from '@/app/frontend_superadmin/superadmin_settings/settings_profile_overview/components/SuperadminProfileOverviewSemanticTable';

import { Fingerprint, History, MonitorSmartphone, Smartphone, Monitor, Globe, Clock, AlertTriangle, Shield } from 'lucide-react';
import type { SuperadminProfileSecurityPanelsProps } from '@/app/frontend_superadmin/superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewTypes';
import { useTranslations } from 'next-intl';

/**
 * Renders the `superadmin_profile` view owned by `SuperadminProfileOverviewSecurityPanels`.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminProfileOverviewSecurityPanels(props: SuperadminProfileSecurityPanelsProps) {
  const tCopy = useTranslations('SUPERADMIN_PROFILE');
  const { activeTab, twoFactorEnabled, loginAlerts, loginHistory, colDefs, sessions, onRevokeSession } = props;
  return (
    <>
          {activeTab === '2FA' && (
            <div className="max-w-3xl space-y-6 motion-safe:animate-fade-in motion-reduce:animate-none">
              <div className="flex items-center gap-4 border-b border-border pb-4 mb-6">
                <div className="p-3 rounded-lg bg-info-bg text-info">
                  <Fingerprint size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-primary">{tCopy("COPY.TWO_FACTOR_AUTHENTICATION")}</h2>
                  <p className="text-sm text-secondary">{tCopy("COPY.ADD_AN_EXTRA_LAYER_OF_SECURITY_TO_YOUR_ACCOUNT")}</p>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-border bg-surface-hover flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-primary mb-1">{tCopy("COPY.AUTHENTICATOR_APP")}</h3>
                  <p className="text-sm text-secondary">{tCopy("COPY.USE_AN_APP_LIKE_GOOGLE_AUTHENTICATOR_TO_GENERATE_CODES")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold ${twoFactorEnabled ? 'text-success' : 'text-secondary'}`}>
                    {twoFactorEnabled ? tCopy('COPY.MFA_ENABLED') : tCopy('COPY.MFA_DISABLED')}
                  </span>
                  <label className="relative inline-flex items-center cursor-not-allowed opacity-70">
                    <input type="checkbox" className="sr-only peer" checked={twoFactorEnabled} disabled aria-label={tCopy("COPY.AUTHENTICATOR_APP_TWO_FACTOR_SETTING_PREVIEW_ONLY")}  data-testid="superadmin-profile-profile-security-panels-authenticator-app-two-factor-setting-preview-only-1"/>
                    <div className="w-11 h-6 bg-surface-hover peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-border after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-surface-highlight after:rounded-full after:h-5 after:w-5 after:motion-safe:transition-all motion-reduce:transition-none peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>

              {twoFactorEnabled && (
                <div className="p-6 rounded-xl border border-focus bg-primary-subtle">
                  <h4 className="text-sm font-bold text-primary mb-4">{tCopy("COPY.RECOVERY_CODES")}</h4>
                  <p className="text-sm text-secondary mb-4">{tCopy("COPY.RECOVERY_CODES_ARE_NOT_AVAILABLE_IN_THIS_SOURCE_ONLY_PREVIEW_DO_NOT_USE_SAMPLE_CODES_FOR_ACCOUNT_RECOVERY")}</p>
                  <button type="button" disabled title={tCopy("COPY.UNAVAILABLE_RECOVERY_CODE_RETRIEVAL_AND_REGENERATION_REQUIRE_A_VERIFIED_SECURITY_API")} className="sa-btn-ghost sa-btn-ghost--sm text-xs opacity-60 cursor-not-allowed" data-testid="superadmin-profile-profile-security-panels-unavailable-recovery-code-retrieval-and-regeneration-require-a-verified-security-api-2"><History size={14} aria-hidden="true" /> {tCopy("COPY.RECOVERY_CODES_UNAVAILABLE")}</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Login History' && (
            <div className="h-full flex flex-col motion-safe:animate-fade-in motion-reduce:animate-none">
              <div className="flex items-center gap-4 border-b border-border pb-4 mb-6">
                <div className="p-3 rounded-lg bg-purple-bg text-purple">
                  <History size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-primary">{tCopy("COPY.LOGIN_HISTORY")}</h2>
                  <p className="text-sm text-secondary">{tCopy("COPY.REVIEW_YOUR_RECENT_ACCOUNT_LOGIN_ACTIVITY")}</p>
                </div>
              </div>
              <div className="flex-1 w-full mt-2">
                <SuperadminProfileOverviewSemanticTable
                 
                  rowData={loginHistory}
                  columnDefs={colDefs}
                  headerHeight={48}
                  rowHeight={56}
                  suppressCellFocus={false}
                  getRowId={(params) => String(params.data.id)}
                />
              </div>
            </div>
          )}

          {activeTab === 'Active Sessions' && (
            <div className="motion-safe:animate-fade-in motion-reduce:animate-none space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-purple-bg text-purple">
                    <MonitorSmartphone size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-primary">{tCopy("COPY.ACTIVE_SESSIONS")}</h2>
                    <p className="text-sm text-secondary">{tCopy("COPY.DEVICES_CURRENTLY_LOGGED_INTO_YOUR_ACCOUNT")}</p>
                  </div>
                </div>
                <button type="button" className="sa-btn-ghost sa-btn-ghost--danger text-sm" disabled title={tCopy("COPY.UNAVAILABLE_SESSION_REVOCATION_REQUIRES_A_VERIFIED_HOST_SECURITY_API")} data-testid="superadmin-profile-profile-security-panels-unavailable-session-revocation-requires-a-verified-host-security-api-3">{tCopy("COPY.LOG_OUT_ALL_OTHER_DEVICES")}</button>
              </div>

              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="p-5 rounded-xl border border-border bg-surface-hover flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${session.isCurrent ? 'bg-success-bg text-success' : 'bg-surface-hover text-secondary'}`}>
                        {session.device.includes('iPhone') ? <Smartphone size={20} /> : <Monitor size={20} />}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-primary flex items-center gap-2">
                          {session.device}
                          {session.isCurrent && <span className="text-xs bg-success-bg text-success px-2 py-0.5 rounded uppercase tracking-wider">{tCopy("COPY.CURRENT")}</span>}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-secondary mt-1">
                          <span className="flex items-center gap-1"><Globe size={12}/> {session.browser}</span>
                          <span className="w-1 h-1 rounded-full bg-surface-hover"></span>
                          <span>{tCopy("COPY.IP")} {session.ip}</span>
                          <span className="w-1 h-1 rounded-full bg-surface-hover"></span>
                          <span>{session.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-secondary mt-2">
                          <Clock size={12}/> {tCopy("COPY.LAST_ACTIVE")} {session.lastActive}
                        </div>
                      </div>
                    </div>
                    {!session.isCurrent && (
                      <button type="button" disabled title={tCopy("COPY.UNAVAILABLE_SESSION_REVOCATION_REQUIRES_A_VERIFIED_HOST_SECURITY_API")} aria-label={`${tCopy("COPY.LOG_OUT_DEVICE")}: ${session.device}. ${tCopy("COPY.UNAVAILABLE_SESSION_REVOCATION_REQUIRES_A_VERIFIED_HOST_SECURITY_API")}`} className="sa-btn-secondary text-sm border-border text-danger opacity-60 cursor-not-allowed" data-testid={`superadmin-profile-profile-security-panels-log-out-device-unavailable-4-${String(session.id)}`}>
                        {tCopy("COPY.LOG_OUT_DEVICE")}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Security Settings' && (
            <div className="max-w-3xl space-y-6 motion-safe:animate-fade-in motion-reduce:animate-none">
              <div className="flex items-center gap-4 border-b border-border pb-4 mb-6">
                <div className="p-3 rounded-lg bg-info-bg text-info">
                  <Shield size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-primary">{tCopy("COPY.SECURITY_SETTINGS")}</h2>
                  <p className="text-sm text-secondary">{tCopy("COPY.MANAGE_SECURITY_ALERTS_AND_ACCOUNT_PROTECTION")}</p><p className="mt-1 text-xs text-warning">{tCopy("COPY.SETTINGS_ARE_SAMPLE_STATE_AND_ARE_DISABLED_UNTIL_A_VERIFIED_HOST_SECURITY_API_IS_AVAILABLE")}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-xl border border-border bg-surface-hover flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle size={20} className="text-primary" />
                    <div>
                      <h3 className="text-base font-bold text-primary mb-1">{tCopy("COPY.UNRECOGNIZED_LOGIN_ALERTS")}</h3>
                      <p className="text-sm text-secondary">{tCopy("COPY.RECEIVE_AN_EMAIL_WHEN_YOUR_ACCOUNT_IS_LOGGED_INTO_FROM_A_NEW_DEVICE")}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-not-allowed opacity-70 ml-4">
                    <input type="checkbox" className="sr-only peer" checked={loginAlerts} disabled aria-label={tCopy("COPY.UNRECOGNIZED_LOGIN_ALERTS_PREVIEW_ONLY")}  data-testid="superadmin-profile-profile-security-panels-unrecognized-login-alerts-preview-only-5"/>
                    <div className="w-11 h-6 bg-surface-hover peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-border after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-surface-highlight after:rounded-full after:h-5 after:w-5 after:motion-safe:transition-all motion-reduce:transition-none peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="p-5 rounded-xl border border-border bg-surface-hover flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-primary mb-1">{tCopy("COPY.PASSWORD_EXPIRY")}</h3>
                    <p className="text-sm text-secondary">{tCopy("COPY.FORCE_PASSWORD_CHANGE_EVERY_90_DAYS_FOR_BETTER_SECURITY")}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-not-allowed opacity-70 ml-4">
                    <input type="checkbox" className="sr-only peer" checked disabled aria-label={tCopy("COPY.PASSWORD_EXPIRY_POLICY_SAMPLE_STATE_ONLY_HOST_SETTING_UNAVAILABLE")}  data-testid="superadmin-profile-profile-security-panels-password-expiry-policy-sample-state-only-host-setting-unavailable-6"/>
                    <div className="w-11 h-6 bg-primary peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-border after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-surface-highlight after:rounded-full after:h-5 after:w-5 after:motion-safe:transition-all motion-reduce:transition-none"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
    </>
  );
}
