'use client';
/** Responsibility: Superadmin Security Policy Panels; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSecurityLoginSecurityPolicyPanels formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { useSuperadminSecurityLoginSecurityValidationMessage } from '@/app/frontend_superadmin/superadmin_security/security_login_security/hooks/useSuperadminSecurityLoginSecurityValidationMessage';
import { ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminSecurityPolicyPanelsProps } from '@/app/frontend_superadmin/superadmin_security/security_login_security/types/SuperadminSecurityLoginSecurityPolicyPanelsComponentTypes';


/**
 * Renders the `superadmin_security` view owned by `SuperadminSecurityLoginSecurityPolicyPanels`.
 * Keeps rendering and interaction state within the owning feature module; preserves the existing route and user-facing labels.
 */
export default function SuperadminSecurityLoginSecurityPolicyPanels({ activeTab, loginRegister, loginErrors, passwordRegister, passwordErrors, twoFA, handleSave }: SuperadminSecurityPolicyPanelsProps) {
  const tCopy = useTranslations('SUPERADMIN_SECURITY');
  const translateValidationMessage = useSuperadminSecurityLoginSecurityValidationMessage();
  return (
    <>
        {activeTab === 'Login Security' && (
          <div className="flex-1 overflow-y-auto p-6 max-w-3xl space-y-8 motion-safe:animate-fade-in motion-reduce:animate-none">
            <div>
              <h2 className="text-lg font-bold text-primary mb-1">{tCopy("COPY.BRUTE_FORCE_PROTECTION")}</h2>
              <p className="text-sm text-secondary mb-4">{tCopy("COPY.CONFIGURE_THRESHOLDS_TO_PREVENT_AUTOMATED_PASSWORD_GUESSING_ATTACKS")}</p>
              
              <div className="grid grid-cols-2 gap-6 p-5 bg-surface-hover rounded-2xl border border-border">
                <div className="flex flex-col gap-2">
                  <label htmlFor="security-max-failed-attempts" className="text-sm font-semibold text-primary">{tCopy("COPY.MAX_FAILED_ATTEMPTS")}</label>
                  <input id="security-max-failed-attempts" type="number" step={1} inputMode="numeric" min={1} max={20} className="sa-input bg-floating" aria-invalid={Boolean(loginErrors.maxFailed)} aria-describedby={loginErrors.maxFailed ? "security-max-failed-attempts-error" : undefined} {...loginRegister('maxFailed', { valueAsNumber: true })}  data-testid="superadmin-security-security-policy-panels-security-max-failed-attempts-1"/>
                  {loginErrors.maxFailed?.message && <p id="security-max-failed-attempts-error" className="text-xs text-danger" role="alert">{translateValidationMessage(loginErrors.maxFailed.message)}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="security-lock-duration" className="text-sm font-semibold text-primary">{tCopy("COPY.ACCOUNT_LOCKOUT_DURATION_MINS")}</label>
                  <input id="security-lock-duration" type="number" step={1} inputMode="numeric" min={1} max={1440} className="sa-input bg-floating" aria-invalid={Boolean(loginErrors.lockDuration)} aria-describedby={loginErrors.lockDuration ? "security-lock-duration-error" : undefined} {...loginRegister('lockDuration', { valueAsNumber: true })}  data-testid="superadmin-security-security-policy-panels-security-lock-duration-2"/>
                  {loginErrors.lockDuration?.message && <p id="security-lock-duration-error" className="text-xs text-danger" role="alert">{translateValidationMessage(loginErrors.lockDuration.message)}</p>}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-primary mb-1">{tCopy("COPY.SESSION_MANAGEMENT")}</h2>
              <p className="text-sm text-secondary mb-4">{tCopy("COPY.CONTROL_HOW_LONG_USERS_STAY_LOGGED_IN")}</p>

              <div className="p-5 bg-surface-hover rounded-2xl border border-border space-y-6">
                <div className="flex flex-col gap-2 max-w-xs">
                  <label htmlFor="security-session-timeout" className="text-sm font-semibold text-primary">{tCopy("COPY.IDLE_SESSION_TIMEOUT_MINS")}</label>
                  <input id="security-session-timeout" type="number" step={1} inputMode="numeric" min={1} max={10080} className="sa-input bg-floating" aria-invalid={Boolean(loginErrors.sessionTimeout)} aria-describedby={loginErrors.sessionTimeout ? "security-session-timeout-error" : undefined} {...loginRegister('sessionTimeout', { valueAsNumber: true })}  data-testid="superadmin-security-security-policy-panels-security-session-timeout-3"/>
                  {loginErrors.sessionTimeout?.message && <p id="security-session-timeout-error" className="text-xs text-danger" role="alert">{translateValidationMessage(loginErrors.sessionTimeout.message)}</p>}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <h3 className="text-sm font-bold text-primary">{tCopy("COPY.FORCE_LOGOUT_ON_PASSWORD_RESET")}</h3>
                    <p className="text-xs text-secondary mt-1">{tCopy("COPY.AUTOMATICALLY_INVALIDATES_ALL_ACTIVE_TOKENS_ACROSS_DEVICES")}</p>
                  </div>
                  <label className="sa-toggle">
                    <input id="security-force-logout" aria-label={tCopy("COPY.FORCE_LOGOUT_ON_PASSWORD_RESET")} type="checkbox" {...loginRegister('forceLogout')}  data-testid="superadmin-security-security-policy-panels-security-force-logout-4"/>
                    <span className="sa-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button type="button" onClick={handleSave} className="sa-btn-primary bg-danger text-on-danger hover:bg-danger hover:text-on-danger border-none shadow-card" data-testid="superadmin-security-security-policy-panels-save-security-rules-5">{tCopy("COPY.SAVE_SECURITY_RULES")}</button>
            </div>
          </div>
        )}

        

        

    </>
  );
}
