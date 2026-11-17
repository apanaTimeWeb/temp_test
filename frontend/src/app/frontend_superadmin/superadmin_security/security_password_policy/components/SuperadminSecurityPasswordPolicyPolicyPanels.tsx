'use client';
/** Responsibility: Superadmin Security Policy Panels; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSecurityPasswordPolicyPolicyPanels formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { useSuperadminSecurityPasswordPolicyValidationMessage } from '@/app/frontend_superadmin/superadmin_security/security_password_policy/hooks/useSuperadminSecurityPasswordPolicyValidationMessage';
import { KeyRound, Sparkles, Hash, Calendar, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminSecurityPolicyPanelsProps } from '@/app/frontend_superadmin/superadmin_security/security_password_policy/types/SuperadminSecurityPasswordPolicyPolicyPanelsComponentTypes';

/**
 * Renders the `superadmin_security` view owned by `SuperadminSecurityPasswordPolicyPolicyPanels`.
 * Keeps rendering and interaction state within the owning feature module; preserves the existing route and user-facing labels.
 */
export default function SuperadminSecurityPasswordPolicyPolicyPanels({
  activeTab,
  passwordRegister,
  passwordErrors,
  handleSave,
}: SuperadminSecurityPolicyPanelsProps) {
  const tCopy = useTranslations('SUPERADMIN_SECURITY');
  const translateValidationMessage = useSuperadminSecurityPasswordPolicyValidationMessage();

  return (
    <>
      {activeTab === 'Password Policy' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-3xl space-y-6 motion-safe:animate-fade-in motion-reduce:animate-none">
          <div className="border-b border-border/80 pb-5">
            <h2 className="text-base sm:text-lg font-bold text-slate-100 mb-1 flex items-center gap-2">
              <KeyRound size={20} className="text-indigo-400" />
              <span>{tCopy("COPY.ENFORCED_PASSWORD_POLICY")}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {tCopy("COPY.THESE_RULES_APPLY_TO_ALL_SUPERADMINS_ADMINS_AND_MANAGERS")}
            </p>
          </div>

          <div className="space-y-4">
            {/* Uppercase Toggle */}
            <div className="flex items-center justify-between p-4 sm:p-5 bg-card/70 border border-border/80 rounded-2xl backdrop-blur-md transition-all hover:border-indigo-500/30">
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/15 text-sky-400">
                  <KeyRound size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">{tCopy("COPY.REQUIRE_UPPERCASE_LETTER")}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{tCopy("COPY.PASSWORDS_MUST_CONTAIN_AT_LEAST_ONE_UPPERCASE_LETTER_A_Z")}</p>
                </div>
              </div>
              <label className="sa-toggle cursor-pointer">
                <input
                  id="security-password-require-uppercase"
                  aria-label={tCopy("COPY.REQUIRE_UPPERCASE_LETTERS")}
                  type="checkbox"
                  {...passwordRegister('upper')}
                  data-testid="superadmin-security-security-policy-panels-security-password-require-uppercase-6"
                />
                <span className="sa-slider"></span>
              </label>
            </div>

            {/* Special Character Toggle */}
            <div className="flex items-center justify-between p-4 sm:p-5 bg-card/70 border border-border/80 rounded-2xl backdrop-blur-md transition-all hover:border-indigo-500/30">
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400">
                  <Sparkles size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">{tCopy("COPY.REQUIRE_SPECIAL_CHARACTER")}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{tCopy("COPY.PASSWORDS_MUST_CONTAIN_AT_LEAST_ONE_SYMBOL")}</p>
                </div>
              </div>
              <label className="sa-toggle cursor-pointer">
                <input
                  id="security-password-require-symbol"
                  aria-label={tCopy("COPY.REQUIRE_SPECIAL_CHARACTERS")}
                  type="checkbox"
                  {...passwordRegister('symbol')}
                  data-testid="superadmin-security-security-policy-panels-security-password-require-symbol-7"
                />
                <span className="sa-slider"></span>
              </label>
            </div>

            {/* Numeric Complexity Configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-5 bg-card/70 border border-border/80 rounded-2xl backdrop-blur-md">
              <div className="flex flex-col gap-2">
                <label htmlFor="security-password-minimum-length" className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                  <Hash size={14} className="text-indigo-400" />
                  <span>{tCopy("COPY.MINIMUM_LENGTH")}</span>
                </label>
                <input
                  id="security-password-minimum-length"
                  type="number"
                  step={1}
                  inputMode="numeric"
                  min={8}
                  max={128}
                  className="rounded-xl border border-indigo-500/25 bg-card px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                  aria-invalid={Boolean(passwordErrors.length)}
                  aria-describedby={passwordErrors.length ? "security-password-minimum-length-error" : undefined}
                  {...passwordRegister('length', { valueAsNumber: true })}
                  data-testid="superadmin-security-security-policy-panels-security-password-minimum-length-8"
                />
                {passwordErrors.length?.message && (
                  <p id="security-password-minimum-length-error" className="text-xs text-rose-400 font-medium" role="alert">
                    {translateValidationMessage(passwordErrors.length.message)}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="security-password-expiry-days" className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                  <Calendar size={14} className="text-indigo-400" />
                  <span>{tCopy("COPY.FORCE_PASSWORD_EXPIRY_DAYS")}</span>
                </label>
                <input
                  id="security-password-expiry-days"
                  type="number"
                  step={1}
                  inputMode="numeric"
                  min={1}
                  max={365}
                  className="rounded-xl border border-indigo-500/25 bg-card px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                  aria-invalid={Boolean(passwordErrors.expiry)}
                  aria-describedby={passwordErrors.expiry ? "security-password-expiry-days-error" : undefined}
                  {...passwordRegister('expiry', { valueAsNumber: true })}
                  data-testid="superadmin-security-security-policy-panels-security-password-expiry-days-9"
                />
                {passwordErrors.expiry?.message && (
                  <p id="security-password-expiry-days-error" className="text-xs text-rose-400 font-medium" role="alert">
                    {translateValidationMessage(passwordErrors.expiry.message)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-indigo-600 active:scale-95 cursor-pointer"
              data-testid="superadmin-security-security-policy-panels-enforce-policy-10"
            >
              <ShieldCheck size={16} />
              <span>{tCopy("COPY.ENFORCE_POLICY")}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
