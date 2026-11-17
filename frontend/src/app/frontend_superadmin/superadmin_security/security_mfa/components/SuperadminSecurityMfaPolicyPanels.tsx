'use client';
/** Responsibility: Superadmin Security Policy Panels; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSecurityMfaPolicyPanels formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { ShieldCheck, Smartphone, Mail, MessageSquare, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminSecurityPolicyPanelsProps } from '@/app/frontend_superadmin/superadmin_security/security_mfa/types/SuperadminSecurityMfaPolicyPanelsComponentTypes';

/**
 * Renders the `superadmin_security` view owned by `SuperadminSecurityMfaPolicyPanels`.
 * Keeps rendering and interaction state within the owning feature module; preserves the existing route and user-facing labels.
 */
export default function SuperadminSecurityMfaPolicyPanels({
  activeTab,
  twoFA,
  handleSave,
}: SuperadminSecurityPolicyPanelsProps) {
  const tCopy = useTranslations('SUPERADMIN_SECURITY');

  const methods = [
    { value: 'Authenticator App (Google/Authy)', key: 'COPY.AUTHENTICATOR_APP', icon: Smartphone, iconColor: 'text-indigo-400' },
    { value: 'Email OTP', key: 'COPY.EMAIL_OTP', icon: Mail, iconColor: 'text-sky-400' },
    { value: 'SMS OTP', key: 'COPY.SMS_OTP', icon: MessageSquare, iconColor: 'text-emerald-400' },
  ] as const;

  return (
    <>
      {activeTab === '2FA & MFA' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-3xl space-y-6 motion-safe:animate-fade-in motion-reduce:animate-none">
          {/* Main MFA Card */}
          <div className="flex items-start gap-4 p-5 bg-card/70 border border-emerald-500/30 rounded-2xl backdrop-blur-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/20 text-emerald-400 shadow-inner">
              <ShieldCheck size={26} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-slate-100">{tCopy("COPY.SYSTEM_WIDE_MFA_ENFORCEMENT")}</h3>
              <p className="text-xs text-amber-300 font-medium mt-1">
                {tCopy("COPY.READ_ONLY_SAMPLE_CONFIGURATION_CHANGES_ARE_UNAVAILABLE_UNTIL_THE_HOST_MFA_SETTINGS_API_IS_CONNECTED")}
              </p>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 mb-4 leading-relaxed">
                {tCopy("COPY.MANDATE_TWO_FACTOR_AUTHENTICATION_FOR_ALL_STAFF_ACCOUNTS_TO_PREVENT_UNAUTHORIZED_ACCESS_EVEN_IF_PASSWORDS_ARE_COMPROMISED")}
              </p>
              <label className="sa-toggle cursor-not-allowed">
                <input
                  id="security-mfa-enabled"
                  name="mfaEnabled"
                  aria-label={tCopy("COPY.ENABLE_SYSTEM_WIDE_MFA")}
                  type="checkbox"
                  checked={twoFA.enabled}
                  disabled
                  title={tCopy("COPY.READ_ONLY_SAMPLE_SETTING_NO_MFA_SETTINGS_API_CONTRACT_IS_SUPPLIED")}
                  data-testid="superadmin-security-security-policy-panels-security-mfa-enabled-11"
                />
                <span className="sa-slider"></span>
              </label>
            </div>
          </div>

          {/* Primary Authenticator Method Selection */}
          {twoFA.enabled && (
            <div className="p-5 bg-card/70 border border-border/80 rounded-2xl backdrop-blur-md space-y-4">
              <fieldset className="space-y-3">
                <legend className="text-sm font-bold text-slate-100 mb-3 flex items-center gap-2">
                  <Smartphone size={16} className="text-indigo-400" />
                  <span>{tCopy("COPY.PRIMARY_AUTHENTICATOR_METHOD")}</span>
                </legend>
                <div className="grid gap-2.5">
                  {methods.map(({ value, key, icon: Icon, iconColor }) => {
                    const isSelected = twoFA.method === value;
                    return (
                      <label
                        key={value}
                        className={`flex items-center gap-3.5 p-3.5 rounded-xl border transition-all cursor-not-allowed ${
                          isSelected
                            ? 'border-indigo-500/40 bg-indigo-500/10'
                            : 'border-border/80 bg-card/40 opacity-70'
                        }`}
                      >
                        <input
                          type="radio"
                          name="2fa"
                          value={value}
                          checked={isSelected}
                          aria-label={tCopy(key)}
                          disabled
                          title={tCopy("COPY.READ_ONLY_SAMPLE_SETTING_NO_MFA_SETTINGS_API_CONTRACT_IS_SUPPLIED")}
                          className="accent-indigo-500"
                          data-testid={`superadmin-security-security-policy-panels-field-2fa-12-${String(value)}`}
                        />
                        <Icon size={16} className={iconColor} />
                        <span className="text-sm font-medium text-slate-200">{tCopy(key)}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              disabled
              title={tCopy("COPY.SECURITY_TAB_READ_ONLY_NO_API", { tab: tCopy("COPY.TAB_MFA") })}
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-500/25 opacity-60 cursor-not-allowed"
              data-testid="superadmin-security-security-policy-panels-update-mfa-rules-13"
            >
              <ShieldCheck size={16} />
              <span>{tCopy("COPY.UPDATE_MFA_RULES")}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
