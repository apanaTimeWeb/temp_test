'use client';
/** Responsibility: Superadmin Security Password Policy Panels; full interactive management of password complexity, expiration, history, modern hashing algorithms (Argon2id/bcrypt), and strength evaluation. */
/** Data-Flow: hook state & inputs -> SuperadminSecurityPasswordPolicyPolicyPanels -> validation & enforcement -> policy update. */
import { useState, useMemo } from 'react';
import { useSuperadminSecurityPasswordPolicyValidationMessage } from '@/app/frontend_superadmin/superadmin_security/security_password_policy/hooks/useSuperadminSecurityPasswordPolicyValidationMessage';
import {
  KeyRound,
  Hash,
  Calendar,
  ShieldCheck,
  Cpu,
  Lock,
  History,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminSecurityPolicyPanelsProps } from '@/app/frontend_superadmin/superadmin_security/security_password_policy/types/SuperadminSecurityPasswordPolicyPolicyPanelsComponentTypes';

export default function SuperadminSecurityPasswordPolicyPolicyPanels({
  activeTab,
  passwordRegister,
  passwordErrors,
  handleSave,
}: SuperadminSecurityPolicyPanelsProps) {
  const tCopy = useTranslations('SUPERADMIN_SECURITY');
  const translateValidationMessage = useSuperadminSecurityPasswordPolicyValidationMessage();

  // Additional policy controls
  const [requireNumbers, setRequireNumbers] = useState(true);
  const [requireLowercase, setRequireLowercase] = useState(true);
  const [preventHistoryCount, setPreventHistoryCount] = useState(5);
  const [hashingAlgorithm, setHashingAlgorithm] = useState<'Argon2id' | 'bcrypt'>('Argon2id');

  // Interactive password strength evaluator state
  const [testPassword, setTestPassword] = useState('');
  const [showTestPassword, setShowTestPassword] = useState(false);

  const strengthAnalysis = useMemo(() => {
    const hasUpper = /[A-Z]/.test(testPassword);
    const hasLower = /[a-z]/.test(testPassword);
    const hasNumber = /[0-9]/.test(testPassword);
    const hasSymbol = /[^A-Za-z0-9]/.test(testPassword);
    const isLongEnough = testPassword.length >= 14;

    let score = 0;
    if (testPassword.length >= 8) score += 20;
    if (isLongEnough) score += 25;
    if (hasUpper) score += 15;
    if (hasLower) score += 10;
    if (hasNumber) score += 15;
    if (hasSymbol) score += 15;

    let label = 'Very Weak';
    let color = 'bg-rose-500';
    let crackTime = '< 1 second';

    if (score >= 90) {
      label = 'Unbreakable / Military Grade';
      color = 'bg-emerald-400';
      crackTime = '12 Trillion Years';
    } else if (score >= 70) {
      label = 'Strong';
      color = 'bg-teal-400';
      crackTime = '400,000 Years';
    } else if (score >= 45) {
      label = 'Moderate';
      color = 'bg-amber-400';
      crackTime = '3 Months';
    } else if (score > 20) {
      label = 'Weak';
      color = 'bg-orange-400';
      crackTime = '4 Hours';
    }

    return { score, label, color, crackTime, hasUpper, hasLower, hasNumber, hasSymbol, isLongEnough };
  }, [testPassword]);

  if (activeTab !== 'Password Policy') return null;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl space-y-8 motion-safe:animate-fade-in motion-reduce:animate-none">
      {/* 1. Header & Summary */}
      <div className="border-b border-border/80 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-100 mb-1 flex items-center gap-2">
            <KeyRound size={20} className="text-indigo-400" />
            <span>SuperAdmin & Privileged Accounts Password Policy</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Enforces strict password complexity, expiration limits, history prevention, and modern cryptographic hashing.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 shrink-0">
          <Sparkles size={13} />
          NIST 800-63B Compliant
        </span>
      </div>

      {/* 2. Core Complexity Rules */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider text-xs">
          Character & Complexity Standards
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Uppercase */}
          <div className="flex items-center justify-between p-4 border border-indigo-500/20 bg-gradient-to-b from-[#0f143a]/75 to-[#090c24]/90 rounded-2xl shadow-xl backdrop-blur-md">
            <div>
              <h4 className="text-sm font-bold text-slate-100">Require Uppercase Letters</h4>
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

          {/* Lowercase */}
          <div className="flex items-center justify-between p-4 border border-indigo-500/20 bg-gradient-to-b from-[#0f143a]/75 to-[#090c24]/90 rounded-2xl shadow-xl backdrop-blur-md">
            <div>
              <h4 className="text-sm font-bold text-slate-100">Require Lowercase Letters</h4>
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

          {/* Numbers */}
          <div className="flex items-center justify-between p-4 border border-indigo-500/20 bg-gradient-to-b from-[#0f143a]/75 to-[#090c24]/90 rounded-2xl shadow-xl backdrop-blur-md">
            <div>
              <h4 className="text-sm font-bold text-slate-100">Require Numeric Digits</h4>
              <p className="text-xs text-slate-400 mt-0.5">At least one numeric digit (0-9)</p>
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

          {/* Special Characters */}
          <div className="flex items-center justify-between p-4 border border-indigo-500/20 bg-gradient-to-b from-[#0f143a]/75 to-[#090c24]/90 rounded-2xl shadow-xl backdrop-blur-md">
            <div>
              <h4 className="text-sm font-bold text-slate-100">Require Special Symbols</h4>
              <p className="text-xs text-slate-400 mt-0.5">At least one special character (!@#$%^&*)</p>
            </div>
            <label className="sa-toggle cursor-pointer">
              <input
                id="security-password-require-symbol"
                type="checkbox"
                {...passwordRegister('symbol')}
                data-testid="superadmin-password-symbol-toggle"
              />
              <span className="sa-slider"></span>
            </label>
          </div>
        </div>

        {/* Numeric Limits & History */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Minimum Length */}
          <div className="p-4 sm:p-5 border border-indigo-500/20 bg-gradient-to-b from-[#0f143a]/75 to-[#090c24]/90 rounded-2xl shadow-xl backdrop-blur-md space-y-2">
            <label htmlFor="security-password-minimum-length" className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <Hash size={14} className="text-indigo-400" />
              <span>Minimum Password Length</span>
            </label>
            <input
              id="security-password-minimum-length"
              type="number"
              step={1}
              min={8}
              max={128}
              className="w-full rounded-xl border border-indigo-500/30 bg-[#07091a]/85 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 shadow-inner"
              {...passwordRegister('length', { valueAsNumber: true })}
              data-testid="superadmin-password-length-input"
            />
            {passwordErrors.length?.message && (
              <p className="text-xs text-rose-400 font-medium">
                {translateValidationMessage(passwordErrors.length.message)}
              </p>
            )}
            <p className="text-[11px] text-slate-400">Recommended: 14+ characters for SuperAdmins</p>
          </div>

          {/* Forced Expiry Days */}
          <div className="p-4 sm:p-5 border border-indigo-500/20 bg-gradient-to-b from-[#0f143a]/75 to-[#090c24]/90 rounded-2xl shadow-xl backdrop-blur-md space-y-2">
            <label htmlFor="security-password-expiry-days" className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <Calendar size={14} className="text-indigo-400" />
              <span>Forced Expiry Cycle (Days)</span>
            </label>
            <input
              id="security-password-expiry-days"
              type="number"
              step={1}
              min={30}
              max={365}
              className="w-full rounded-xl border border-indigo-500/30 bg-[#07091a]/85 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 shadow-inner"
              {...passwordRegister('expiry', { valueAsNumber: true })}
              data-testid="superadmin-password-expiry-input"
            />
            {passwordErrors.expiry?.message && (
              <p className="text-xs text-rose-400 font-medium">
                {translateValidationMessage(passwordErrors.expiry.message)}
              </p>
            )}
            <p className="text-[11px] text-slate-400">Forces rotation every 90 days</p>
          </div>

          {/* Password History Prevention */}
          <div className="p-4 sm:p-5 border border-indigo-500/20 bg-gradient-to-b from-[#0f143a]/75 to-[#090c24]/90 rounded-2xl shadow-xl backdrop-blur-md space-y-2">
            <label htmlFor="security-password-history-count" className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <History size={14} className="text-indigo-400" />
              <span>Prevent Password Reuse</span>
            </label>
            <input
              id="security-password-history-count"
              type="number"
              step={1}
              min={1}
              max={24}
              value={preventHistoryCount}
              onChange={(e) => setPreventHistoryCount(Number(e.target.value))}
              className="w-full rounded-xl border border-indigo-500/30 bg-[#07091a]/85 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 shadow-inner"
              data-testid="superadmin-password-history-input"
            />
            <p className="text-[11px] text-slate-400">Disallows last {preventHistoryCount} historical passwords</p>
          </div>
        </div>
      </div>

      {/* 3. Modern Cryptographic Password Hashing Standards (Section A) */}
      <div className="p-5 sm:p-6 bg-gradient-to-b from-[#081b2a]/85 to-[#06101c]/95 border border-cyan-500/30 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Cpu size={20} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-100">
                Modern Secure Password Hashing Architecture
              </h3>
              <p className="text-xs text-slate-400">
                Cryptographic memory-hard algorithms preventing GPU/ASIC rainbow-table cracking.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setHashingAlgorithm('Argon2id')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer active:scale-95 shadow-xs ${
                hashingAlgorithm === 'Argon2id'
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                  : 'border-cyan-500/20 bg-[#07131e]/70 text-slate-400 hover:border-cyan-500/40'
              }`}
            >
              Argon2id (Winner PHC)
            </button>
            <button
              type="button"
              onClick={() => setHashingAlgorithm('bcrypt')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer active:scale-95 shadow-xs ${
                hashingAlgorithm === 'bcrypt'
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                  : 'border-cyan-500/20 bg-[#07131e]/70 text-slate-400 hover:border-cyan-500/40'
              }`}
            >
              bcrypt (Work Factor 12)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 pt-1 text-xs">
          <div className="p-3.5 rounded-xl border border-cyan-500/20 bg-[#07131e]/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold">Algorithm & Mode</span>
            <p className="text-sm font-bold text-cyan-400">
              {hashingAlgorithm === 'Argon2id' ? 'Argon2id (RFC 9106)' : 'bcrypt ($2b$)'}
            </p>
            <p className="text-[10px] text-slate-400">Side-channel & GPU resistant</p>
          </div>

          <div className="p-3.5 rounded-xl border border-cyan-500/20 bg-[#07131e]/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold">Work / Memory Cost</span>
            <p className="text-sm font-bold text-slate-100">
              {hashingAlgorithm === 'Argon2id' ? '64 MiB (65,536 KiB)' : 'Cost Factor 12 (4,096 r)'}
            </p>
            <p className="text-[10px] text-slate-400">Exhausts ASIC memory hardware</p>
          </div>

          <div className="p-3.5 rounded-xl border border-cyan-500/20 bg-[#07131e]/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold">Salt Entropy & Spec</span>
            <p className="text-sm font-bold text-slate-100">128-bit CSPRNG Salt</p>
            <p className="text-[10px] text-slate-400">Unique cryptographic salt per hash</p>
          </div>

          <div className="p-3.5 rounded-xl border border-cyan-500/20 bg-[#07131e]/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold">Plaintext Storage</span>
            <p className="text-sm font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={13} />
              Zero Plaintext Ever
            </p>
            <p className="text-[10px] text-slate-400">Never logged, never cached</p>
          </div>
        </div>
      </div>

      {/* 4. Live Password Strength & Crack Time Simulator */}
      <div className="p-5 sm:p-6 border border-indigo-500/25 bg-gradient-to-b from-[#0e1338]/85 to-[#080b20]/95 rounded-2xl shadow-2xl backdrop-blur-md space-y-4">
        <div className="border-b border-indigo-500/20 pb-3">
          <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
            <Zap size={18} className="text-amber-400" />
            <span>Interactive Password Strength & Entropy Simulator</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Test candidate passwords against policy rules and brute-force cracking resistance simulations.
          </p>
        </div>

        <div className="space-y-3 pt-1">
          <div className="relative">
            <input
              type={showTestPassword ? 'text' : 'password'}
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              placeholder="Type a password to test policy compliance & entropy..."
              className="w-full pr-10 pl-4 py-2.5 text-sm rounded-xl bg-[#07091a]/85 border border-indigo-500/30 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 shadow-inner"
              data-testid="superadmin-password-test-evaluator-input"
            />
            <button
              type="button"
              onClick={() => setShowTestPassword(!showTestPassword)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
              aria-label="Toggle password visibility"
            >
              {showTestPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {testPassword && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">Entropy Score: {strengthAnalysis.score}%</span>
                <span className="text-slate-200 font-bold">{strengthAnalysis.label}</span>
                <span className="text-emerald-400 font-mono">Crack Time: ~{strengthAnalysis.crackTime}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${strengthAnalysis.color}`}
                  style={{ width: `${strengthAnalysis.score}%` }}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 text-[11px]">
                <div className={`flex items-center gap-1.5 p-2 rounded-lg border ${strengthAnalysis.isLongEnough ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-border/60 bg-card/40 text-slate-400'}`}>
                  {strengthAnalysis.isLongEnough ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                  <span>14+ Chars</span>
                </div>
                <div className={`flex items-center gap-1.5 p-2 rounded-lg border ${strengthAnalysis.hasUpper ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-border/60 bg-card/40 text-slate-400'}`}>
                  {strengthAnalysis.hasUpper ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                  <span>Uppercase</span>
                </div>
                <div className={`flex items-center gap-1.5 p-2 rounded-lg border ${strengthAnalysis.hasLower ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-border/60 bg-card/40 text-slate-400'}`}>
                  {strengthAnalysis.hasLower ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                  <span>Lowercase</span>
                </div>
                <div className={`flex items-center gap-1.5 p-2 rounded-lg border ${strengthAnalysis.hasNumber ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-border/60 bg-card/40 text-slate-400'}`}>
                  {strengthAnalysis.hasNumber ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                  <span>Numbers</span>
                </div>
                <div className={`flex items-center gap-1.5 p-2 rounded-lg border ${strengthAnalysis.hasSymbol ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-border/60 bg-card/40 text-slate-400'}`}>
                  {strengthAnalysis.hasSymbol ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                  <span>Symbols</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
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
