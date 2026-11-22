'use client';

import { useState, useMemo } from 'react';
import { Zap, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';

export default function SuperadminSecurityPasswordStrengthEvaluator() {
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

  return (
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
          <input maxLength={100}
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
  );
}