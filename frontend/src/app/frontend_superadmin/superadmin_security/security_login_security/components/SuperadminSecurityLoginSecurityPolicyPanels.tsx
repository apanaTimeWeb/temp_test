'use client';
/** Responsibility: Superadmin Security Policy Panels; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSecurityLoginSecurityPolicyPanels formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { useSuperadminSecurityLoginSecurityValidationMessage } from '@/app/frontend_superadmin/superadmin_security/security_login_security/hooks/useSuperadminSecurityLoginSecurityValidationMessage';
import { Lock, ShieldAlert, Clock, LogOut, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminSecurityPolicyPanelsProps } from '@/app/frontend_superadmin/superadmin_security/security_login_security/types/SuperadminSecurityLoginSecurityPolicyPanelsComponentTypes';

/**
 * Renders the `superadmin_security` view owned by `SuperadminSecurityLoginSecurityPolicyPanels`.
 * Keeps rendering and interaction state within the owning feature module; preserves the existing route and user-facing labels.
 */
export default function SuperadminSecurityLoginSecurityPolicyPanels({
  activeTab,
  loginRegister,
  loginErrors,
  handleSave,
}: SuperadminSecurityPolicyPanelsProps) {
  const tCopy = useTranslations('SUPERADMIN_SECURITY');
  const translateValidationMessage = useSuperadminSecurityLoginSecurityValidationMessage();

  return (
    <>
      {activeTab === 'Login Security' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-3xl space-y-8 motion-safe:animate-fade-in motion-reduce:animate-none">
          {/* Section 1: Brute Force Protection */}
          <div>
            <div className="border-b border-border/80 pb-3 mb-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-100 mb-1 flex items-center gap-2">
                <ShieldAlert size={20} className="text-amber-400" />
                <span>{tCopy("COPY.BRUTE_FORCE_PROTECTION")}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {tCopy("COPY.CONFIGURE_THRESHOLDS_TO_PREVENT_AUTOMATED_PASSWORD_GUESSING_ATTACKS")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-5 bg-card/70 border border-border/80 rounded-2xl backdrop-blur-md">
              <div className="flex flex-col gap-2">
                <label htmlFor="security-max-failed-attempts" className="text-xs sm:text-sm font-semibold text-slate-200">
                  {tCopy("COPY.MAX_FAILED_ATTEMPTS")}
                </label>
                <input
                  id="security-max-failed-attempts"
                  type="number"
                  step={1}
                  inputMode="numeric"
                  min={1}
                  max={20}
                  className="rounded-xl border border-indigo-500/25 bg-card px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                  aria-invalid={Boolean(loginErrors.maxFailed)}
                  aria-describedby={loginErrors.maxFailed ? "security-max-failed-attempts-error" : undefined}
                  {...loginRegister('maxFailed', { valueAsNumber: true })}
                  data-testid="superadmin-security-security-policy-panels-security-max-failed-attempts-1"
                />
                {loginErrors.maxFailed?.message && (
                  <p id="security-max-failed-attempts-error" className="text-xs text-rose-400 font-medium" role="alert">
                    {translateValidationMessage(loginErrors.maxFailed.message)}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="security-lock-duration" className="text-xs sm:text-sm font-semibold text-slate-200">
                  {tCopy("COPY.ACCOUNT_LOCKOUT_DURATION_MINS")}
                </label>
                <input
                  id="security-lock-duration"
                  type="number"
                  step={1}
                  inputMode="numeric"
                  min={1}
                  max={1440}
                  className="rounded-xl border border-indigo-500/25 bg-card px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                  aria-invalid={Boolean(loginErrors.lockDuration)}
                  aria-describedby={loginErrors.lockDuration ? "security-lock-duration-error" : undefined}
                  {...loginRegister('lockDuration', { valueAsNumber: true })}
                  data-testid="superadmin-security-security-policy-panels-security-lock-duration-2"
                />
                {loginErrors.lockDuration?.message && (
                  <p id="security-lock-duration-error" className="text-xs text-rose-400 font-medium" role="alert">
                    {translateValidationMessage(loginErrors.lockDuration.message)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Session Management */}
          <div>
            <div className="border-b border-border/80 pb-3 mb-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-100 mb-1 flex items-center gap-2">
                <Clock size={20} className="text-sky-400" />
                <span>{tCopy("COPY.SESSION_MANAGEMENT")}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {tCopy("COPY.CONTROL_HOW_LONG_USERS_STAY_LOGGED_IN")}
              </p>
            </div>

            <div className="p-4 sm:p-5 bg-card/70 border border-border/80 rounded-2xl backdrop-blur-md space-y-5">
              <div className="flex flex-col gap-2 max-w-sm">
                <label htmlFor="security-session-timeout" className="text-xs sm:text-sm font-semibold text-slate-200">
                  {tCopy("COPY.IDLE_SESSION_TIMEOUT_MINS")}
                </label>
                <input
                  id="security-session-timeout"
                  type="number"
                  step={1}
                  inputMode="numeric"
                  min={1}
                  max={10080}
                  className="rounded-xl border border-indigo-500/25 bg-card px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                  aria-invalid={Boolean(loginErrors.sessionTimeout)}
                  aria-describedby={loginErrors.sessionTimeout ? "security-session-timeout-error" : undefined}
                  {...loginRegister('sessionTimeout', { valueAsNumber: true })}
                  data-testid="superadmin-security-security-policy-panels-security-session-timeout-3"
                />
                {loginErrors.sessionTimeout?.message && (
                  <p id="security-session-timeout-error" className="text-xs text-rose-400 font-medium" role="alert">
                    {translateValidationMessage(loginErrors.sessionTimeout.message)}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/70">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-400">
                    <LogOut size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{tCopy("COPY.FORCE_LOGOUT_ON_PASSWORD_RESET")}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{tCopy("COPY.AUTOMATICALLY_INVALIDATES_ALL_ACTIVE_TOKENS_ACROSS_DEVICES")}</p>
                  </div>
                </div>
                <label className="sa-toggle cursor-pointer">
                  <input
                    id="security-force-logout"
                    aria-label={tCopy("COPY.FORCE_LOGOUT_ON_PASSWORD_RESET")}
                    type="checkbox"
                    {...loginRegister('forceLogout')}
                    data-testid="superadmin-security-security-policy-panels-security-force-logout-4"
                  />
                  <span className="sa-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-indigo-600 active:scale-95 cursor-pointer"
              data-testid="superadmin-security-security-policy-panels-save-security-rules-5"
            >
              <ShieldCheck size={16} />
              <span>{tCopy("COPY.SAVE_SECURITY_RULES")}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
