'use client';
/** Responsibility: Superadmin Security Policy Panels; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSecurityMfaPolicyPanels formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { useSuperadminSecurityMfaValidationMessage } from '@/app/frontend_superadmin/superadmin_security/security_mfa/hooks/useSuperadminSecurityMfaValidationMessage';
import { ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminSecurityPolicyPanelsProps } from '@/app/frontend_superadmin/superadmin_security/security_mfa/types/SuperadminSecurityMfaPolicyPanelsComponentTypes';


/**
 * Renders the `superadmin_security` view owned by `SuperadminSecurityMfaPolicyPanels`.
 * Keeps rendering and interaction state within the owning feature module; preserves the existing route and user-facing labels.
 */
export default function SuperadminSecurityMfaPolicyPanels({ activeTab, loginRegister, loginErrors, passwordRegister, passwordErrors, twoFA, handleSave }: SuperadminSecurityPolicyPanelsProps) {
  const tCopy = useTranslations('SUPERADMIN_SECURITY');
  const translateValidationMessage = useSuperadminSecurityMfaValidationMessage();
  return (
    <>
        

        

        {activeTab === '2FA & MFA' && (
          <div className="flex-1 overflow-y-auto p-6 max-w-3xl space-y-6 motion-safe:animate-fade-in motion-reduce:animate-none">
            <div className="flex items-start gap-4 p-5 bg-danger-bg border border-border rounded-2xl">
              <div className="p-3 bg-danger-bg rounded-full text-danger"><ShieldCheck size={24} /></div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-danger">{tCopy("COPY.SYSTEM_WIDE_MFA_ENFORCEMENT")}</h3>
                <p className="text-xs text-warning mt-1">{tCopy("COPY.READ_ONLY_SAMPLE_CONFIGURATION_CHANGES_ARE_UNAVAILABLE_UNTIL_THE_HOST_MFA_SETTINGS_API_IS_CONNECTED")}</p>
                <p className="text-sm text-danger mt-1 mb-4">{tCopy("COPY.MANDATE_TWO_FACTOR_AUTHENTICATION_FOR_ALL_STAFF_ACCOUNTS_TO_PREVENT_UNAUTHORIZED_ACCESS_EVEN_IF_PASSWORDS_ARE_COMPROMISED")}</p>
                <label className="sa-toggle">
                  <input id="security-mfa-enabled" name="mfaEnabled" aria-label={tCopy("COPY.ENABLE_SYSTEM_WIDE_MFA")} type="checkbox" checked={twoFA.enabled} disabled title={tCopy("COPY.READ_ONLY_SAMPLE_SETTING_NO_MFA_SETTINGS_API_CONTRACT_IS_SUPPLIED")}   data-testid="superadmin-security-security-policy-panels-security-mfa-enabled-11"/>
                  <span className="sa-slider"></span>
                </label>
              </div>
            </div>

            {twoFA.enabled && (
              <div className="p-5 bg-surface-hover border border-border rounded-2xl">
                <fieldset className="space-y-3">
                  <legend className="text-sm font-semibold text-primary mb-3">{tCopy("COPY.PRIMARY_AUTHENTICATOR_METHOD")}</legend>
                  {([{ value: 'Authenticator App (Google/Authy)', key: 'COPY.AUTHENTICATOR_APP' }, { value: 'Email OTP', key: 'COPY.EMAIL_OTP' }, { value: 'SMS OTP', key: 'COPY.SMS_OTP' }] as const).map(({ value, key }) => (
                    <label key={value} className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-surface-hover">
                      <input type="radio" name="2fa" value={value} checked={twoFA.method === value} aria-label={tCopy(key)} disabled title={tCopy("COPY.READ_ONLY_SAMPLE_SETTING_NO_MFA_SETTINGS_API_CONTRACT_IS_SUPPLIED")}  className="accent-primary"  data-testid={`superadmin-security-security-policy-panels-field-2fa-12-${String(value)}`}/>
                      <span className="text-sm font-medium text-primary">{tCopy(key)}</span>
                    </label>
                  ))}
                </fieldset>
              </div>
            )}
            
            <div className="pt-6 flex justify-end">
              <button type="button" disabled title={tCopy("COPY.SECURITY_TAB_READ_ONLY_NO_API", { tab: tCopy("COPY.TAB_MFA") })} onClick={handleSave} className="sa-btn-primary bg-danger text-on-danger hover:bg-danger hover:text-on-danger border-none shadow-card opacity-60 cursor-not-allowed" data-testid="superadmin-security-security-policy-panels-update-mfa-rules-13">{tCopy("COPY.UPDATE_MFA_RULES")}</button>
            </div>
          </div>
        )}

    </>
  );
}
