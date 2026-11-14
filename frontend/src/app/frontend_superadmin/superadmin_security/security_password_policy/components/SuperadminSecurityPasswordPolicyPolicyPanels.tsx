'use client';
/** Responsibility: Superadmin Security Policy Panels; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSecurityPasswordPolicyPolicyPanels formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { useSuperadminSecurityPasswordPolicyValidationMessage } from '@/app/frontend_superadmin/superadmin_security/security_password_policy/hooks/useSuperadminSecurityPasswordPolicyValidationMessage';
import { ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminSecurityPolicyPanelsProps } from '@/app/frontend_superadmin/superadmin_security/security_password_policy/types/SuperadminSecurityPasswordPolicyPolicyPanelsComponentTypes';


/**
 * Renders the `superadmin_security` view owned by `SuperadminSecurityPasswordPolicyPolicyPanels`.
 * Keeps rendering and interaction state within the owning feature module; preserves the existing route and user-facing labels.
 */
export default function SuperadminSecurityPasswordPolicyPolicyPanels({ activeTab, loginRegister, loginErrors, passwordRegister, passwordErrors, twoFA, handleSave }: SuperadminSecurityPolicyPanelsProps) {
  const tCopy = useTranslations('SUPERADMIN_SECURITY');
  const translateValidationMessage = useSuperadminSecurityPasswordPolicyValidationMessage();
  return (
    <>
        

        {activeTab === 'Password Policy' && (
          <div className="flex-1 overflow-y-auto p-6 max-w-3xl space-y-6 motion-safe:animate-fade-in motion-reduce:animate-none">
            <div>
              <h2 className="text-lg font-bold text-primary mb-1">{tCopy("COPY.ENFORCED_PASSWORD_POLICY")}</h2>
              <p className="text-sm text-secondary mb-4">{tCopy("COPY.THESE_RULES_APPLY_TO_ALL_SUPERADMINS_ADMINS_AND_MANAGERS")}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-hover border border-border rounded-xl">
                <div>
                  <h3 className="text-sm font-bold text-primary">{tCopy("COPY.REQUIRE_UPPERCASE_LETTER")}</h3>
                  <p className="text-xs text-secondary mt-1">{tCopy("COPY.PASSWORDS_MUST_CONTAIN_AT_LEAST_ONE_UPPERCASE_LETTER_A_Z")}</p>
                </div>
                <label className="sa-toggle">
                  <input id="security-password-require-uppercase" aria-label={tCopy("COPY.REQUIRE_UPPERCASE_LETTERS")} type="checkbox" {...passwordRegister('upper')}  data-testid="superadmin-security-security-policy-panels-security-password-require-uppercase-6"/>
                  <span className="sa-slider"></span>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-hover border border-border rounded-xl">
                <div>
                  <h3 className="text-sm font-bold text-primary">{tCopy("COPY.REQUIRE_SPECIAL_CHARACTER")}</h3>
                  <p className="text-xs text-secondary mt-1">{tCopy("COPY.PASSWORDS_MUST_CONTAIN_AT_LEAST_ONE_SYMBOL")}</p>
                </div>
                <label className="sa-toggle">
                  <input id="security-password-require-symbol" aria-label={tCopy("COPY.REQUIRE_SPECIAL_CHARACTERS")} type="checkbox" {...passwordRegister('symbol')}  data-testid="superadmin-security-security-policy-panels-security-password-require-symbol-7"/>
                  <span className="sa-slider"></span>
                </label>
              </div>

              <div className="grid grid-cols-1 gap-6 p-4 bg-surface-hover border border-border rounded-xl mt-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="security-password-minimum-length" className="text-sm font-semibold text-primary">{tCopy("COPY.MINIMUM_LENGTH")}</label>
                  <input id="security-password-minimum-length" type="number" step={1} inputMode="numeric" min={8} max={128} className="sa-input bg-floating" aria-invalid={Boolean(passwordErrors.length)} aria-describedby={passwordErrors.length ? "security-password-minimum-length-error" : undefined} {...passwordRegister('length', { valueAsNumber: true })}  data-testid="superadmin-security-security-policy-panels-security-password-minimum-length-8"/>
                  {passwordErrors.length?.message && <p id="security-password-minimum-length-error" className="text-xs text-danger" role="alert">{translateValidationMessage(passwordErrors.length.message)}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="security-password-expiry-days" className="text-sm font-semibold text-primary">{tCopy("COPY.FORCE_PASSWORD_EXPIRY_DAYS")}</label>
                  <input id="security-password-expiry-days" type="number" step={1} inputMode="numeric" min={1} max={365} className="sa-input bg-floating" aria-invalid={Boolean(passwordErrors.expiry)} aria-describedby={passwordErrors.expiry ? "security-password-expiry-days-error" : undefined} {...passwordRegister('expiry', { valueAsNumber: true })}  data-testid="superadmin-security-security-policy-panels-security-password-expiry-days-9"/>
                  {passwordErrors.expiry?.message && <p id="security-password-expiry-days-error" className="text-xs text-danger" role="alert">{translateValidationMessage(passwordErrors.expiry.message)}</p>}
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button type="button" onClick={handleSave} className="sa-btn-primary bg-danger text-on-danger hover:bg-danger hover:text-on-danger border-none shadow-card" data-testid="superadmin-security-security-policy-panels-enforce-policy-10">{tCopy("COPY.ENFORCE_POLICY")}</button>
            </div>
          </div>
        )}

        

    </>
  );
}
