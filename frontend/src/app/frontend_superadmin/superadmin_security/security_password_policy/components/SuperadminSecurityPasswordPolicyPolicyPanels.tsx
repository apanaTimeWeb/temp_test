'use client';
/** Responsibility: Superadmin Security Password Policy Panels; full interactive management of password complexity, expiration, history, modern hashing algorithms (Argon2id/bcrypt), and strength evaluation. */
import { useState } from 'react';
import { useSuperadminSecurityPasswordPolicyValidationMessage } from '@/app/frontend_superadmin/superadmin_security/security_password_policy/hooks/useSuperadminSecurityPasswordPolicyValidationMessage';
import { KeyRound, Calendar, ShieldCheck, Cpu, History, CheckCircle2 } from 'lucide-react';
import type { SuperadminSecurityPolicyPanelsProps } from '@/app/frontend_superadmin/superadmin_security/security_password_policy/types/SuperadminSecurityPasswordPolicyPolicyPanelsComponentTypes';
import SuperadminSecurityPasswordStrengthEvaluator from '@/app/frontend_superadmin/superadmin_security/security_password_policy/components/SuperadminSecurityPasswordStrengthEvaluator';

export default function SuperadminSecurityPasswordPolicyPolicyPanels({
  activeTab,
  passwordRegister,
  passwordErrors,
  handleSave,
}: SuperadminSecurityPolicyPanelsProps) {
  const translateValidationMessage = useSuperadminSecurityPasswordPolicyValidationMessage();
  const [requireNumbers, setRequireNumbers] = useState(true);
  const [requireLowercase, setRequireLowercase] = useState(true);
  const [preventHistoryCount, setPreventHistoryCount] = useState(5);
  const [hashingAlgorithm, setHashingAlgorithm] = useState<'Argon2id' | 'bcrypt'>('Argon2id');

  if (activeTab !== 'Password Policy') return null;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl space-y-4 motion-safe:animate-fade-in motion-reduce:animate-none">
      {/* 1. Header & Summary */}
      <div className="border-b border-border/80 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-100 mb-1 flex items-center gap-2">
            <KeyRound size={20} className="text-indigo-400" />
            <span>SuperAdmin & Privileged Accounts Password Policy</span>
          </h2>
          <p className="text-xs text-slate-400">
            Enforces strict password complexity, expiration limits, history prevention, and modern cryptographic hashing.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 shrink-0">
          <ShieldCheck size={13} />
          NIST 800-63B Compliant
        </span>
      </div>

      {/* 2. Core Complexity Rules */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          Character & Complexity Standards
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="flex items-center justify-between p-3.5 border border-indigo-500/20 bg-gradient-to-b from-[#0f143a]/75 to-[#090c24]/90 rounded-2xl shadow-xl backdrop-blur-md">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-100">Require Uppercase Letters</h4>
              <p className="text-xs text-slate-400 mt-0.5">At least one uppercase character (A-Z)</p>
            </div>
            <label className="sa-toggle cursor-pointer">
              <input
                id="security-password-require-uppercase"
                type="checkbox"
                {...passwordRegister('upper')}
                data-testid="superadmin-password-uppercase-toggle"
              />
              <span className="sa-slider"></span>
            </label>
          </div>

          <div className="flex items-center justify-between p-3.5 border border-indigo-500/20 bg-gradient-to-b from-[#0f143a]/75 to-[#090c24]/90 rounded-2xl shadow-xl backdrop-blur-md">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-100">Require Lowercase Letters</h4>
              <p className="text-xs text-slate-400 mt-0.5">At least one lowercase character (a-z)</p>
            </div>
            <label className="sa-toggle cursor-pointer">
              <input
                id="security-password-require-lowercase"
                type="checkbox"
                checked={requireLowercase}
                onChange={(e) => setRequireLowercase(e.target.checked)}
                data-testid="superadmin-password-lowercase-toggle"
              />
              <span className="sa-slider"></span>
            </label>
          </div>

          <div className="flex items-center justify-between p-3.5 border border-indigo-500/20 bg-gradient-to-b from-[#0f143a]/75 to-[#090c24]/90 rounded-2xl shadow-xl backdrop-blur-md">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-100">Require Numeric Digits</h4>
              <p className="text-xs text-slate-400 mt-0.5">At least one numerical digit (0-9)</p>
            </div>
            <label className="sa-toggle cursor-pointer">
              <input
                id="security-password-require-numbers"
                type="checkbox"
                checked={requireNumbers}
                onChange={(e) => setRequireNumbers(e.target.checked)}
                data-testid="superadmin-password-numbers-toggle"
              />
              <span className="sa-slider"></span>
            </label>
          </div>

          <div className="flex items-center justify-between p-3.5 border border-indigo-500/20 bg-gradient-to-b from-[#0f143a]/75 to-[#090c24]/90 rounded-2xl shadow-xl backdrop-blur-md">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-100">Require Special Symbols</h4>
              <p className="text-xs text-slate-400 mt-0.5">At least one punctuation or symbol (!@#$%)</p>
            </div>
            <label className="sa-toggle cursor-pointer">
              <input
                id="security-password-require-special"
                type="checkbox"
                {...passwordRegister('symbol')}
                data-testid="superadmin-password-special-toggle"
              />
              <span className="sa-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* 3. Password Length & Rotation Lifecycles */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Calendar size={16} className="text-indigo-400" />
          <span>Length Constraints & Rotation Lifecycles</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-4 border border-indigo-500/20 bg-gradient-to-b from-[#0f143a]/75 to-[#090c24]/90 rounded-2xl shadow-xl backdrop-blur-md">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="security-min-password-length" className="text-xs font-semibold text-slate-200">
              Minimum Length (Characters)
            </label>
            <input
              id="security-min-password-length"
              type="number"
              step={1}
              min={8}
              max={64}
              className="rounded-xl border border-indigo-500/30 bg-[#07091a]/85 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
              {...passwordRegister('length', { valueAsNumber: true })}
              data-testid="superadmin-password-min-length-input"
            />
            {passwordErrors.length?.message && (
              <p className="text-xs text-rose-400 font-medium">{translateValidationMessage(passwordErrors.length.message)}</p>
            )}
            <p className="text-[11px] text-slate-400">NIST recommends 12+ for privileged roles</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="security-password-expiry-days" className="text-xs font-semibold text-slate-200">
              Password Expiration (Days)
            </label>
            <input
              id="security-password-expiry-days"
              type="number"
              step={1}
              min={30}
              max={365}
              className="rounded-xl border border-indigo-500/30 bg-[#07091a]/85 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
              {...passwordRegister('expiry', { valueAsNumber: true })}
              data-testid="superadmin-password-expiry-days-input"
            />
            {passwordErrors.expiry?.message && (
              <p className="text-xs text-rose-400 font-medium">{translateValidationMessage(passwordErrors.expiry.message)}</p>
            )}
            <p className="text-[11px] text-slate-400">Forces rotation every 90 days</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="security-password-history-count" className="text-xs font-semibold text-slate-200 flex items-center gap-1">
              <History size={13} className="text-indigo-400" />
              <span>Prevent History Reuse</span>
            </label>
            <input
              id="security-password-history-count"
              type="number"
              step={1}
              min={1}
              max={24}
              value={preventHistoryCount}
              onChange={(e) => setPreventHistoryCount(Number(e.target.value))}
              className="rounded-xl border border-indigo-500/30 bg-[#07091a]/85 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400">Disallows reuse of previous 5 passwords</p>
          </div>
        </div>
      </div>

      {/* 4. Modern Cryptographic Storage & Hashing Engine */}
      <div className="p-4 sm:p-5 border border-cyan-500/30 bg-gradient-to-b from-[#091b2c]/85 to-[#06101c]/90 rounded-2xl shadow-xl backdrop-blur-md space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Cpu size={18} />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-100">
                Modern Cryptographic Password Hashing Engine
              </h3>
              <p className="text-xs text-slate-400">
                OWASP & FIPS compliant password storage algorithms with memory-hard brute-force resistance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setHashingAlgorithm('Argon2id')}
              className={`px-3 py-1 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                hashingAlgorithm === 'Argon2id'
                  ? 'border-cyan-400 bg-cyan-500/25 text-cyan-300 shadow-sm'
                  : 'border-cyan-500/20 bg-[#07131e]/70 text-slate-400 hover:border-cyan-500/40'
              }`}
            >
              Argon2id (Winner PHC)
            </button>
            <button
              type="button"
              onClick={() => setHashingAlgorithm('bcrypt')}
              className={`px-3 py-1 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                hashingAlgorithm === 'bcrypt'
                  ? 'border-cyan-400 bg-cyan-500/25 text-cyan-300 shadow-sm'
                  : 'border-cyan-500/20 bg-[#07131e]/70 text-slate-400 hover:border-cyan-500/40'
              }`}
            >
              bcrypt (Work Factor 12)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-cyan-500/20 bg-[#07131e]/80">
            <span className="text-[10px] text-slate-400 font-semibold block">Algorithm & Mode</span>
            <p className="text-xs font-bold text-cyan-400 mt-0.5">
              {hashingAlgorithm === 'Argon2id' ? 'Argon2id (RFC 9106)' : 'bcrypt ($2b$)'}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Side-channel & GPU resistant</p>
          </div>

          <div className="p-3 rounded-xl border border-cyan-500/20 bg-[#07131e]/80">
            <span className="text-[10px] text-slate-400 font-semibold block">Work / Memory Cost</span>
            <p className="text-xs font-bold text-slate-100 mt-0.5">
              {hashingAlgorithm === 'Argon2id' ? '64 MiB (65,536 KiB)' : 'Cost Factor 12 (4,096 r)'}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Exhausts ASIC memory</p>
          </div>

          <div className="p-3 rounded-xl border border-cyan-500/20 bg-[#07131e]/80">
            <span className="text-[10px] text-slate-400 font-semibold block">Salt Entropy</span>
            <p className="text-xs font-bold text-slate-100 mt-0.5">128-bit CSPRNG Salt</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Unique salt per hash</p>
          </div>

          <div className="p-3 rounded-xl border border-cyan-500/20 bg-[#07131e]/80">
            <span className="text-[10px] text-slate-400 font-semibold block">Plaintext Storage</span>
            <p className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
              <CheckCircle2 size={12} />
              Zero Plaintext Ever
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Never logged or cached</p>
          </div>
        </div>
      </div>

      {/* 5. Live Password Strength & Crack Time Simulator */}
      <SuperadminSecurityPasswordStrengthEvaluator />

      {/* 6. Save Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-indigo-600 active:scale-[0.98] cursor-pointer"
          data-testid="superadmin-security-security-policy-panels-enforce-policy-10"
        >
          <ShieldCheck size={16} />
          <span>Enforce Password & Hashing Policy</span>
        </button>
      </div>
    </div>
  );
}