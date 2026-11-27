'use client';

import { CheckCircle2, XCircle } from 'lucide-react';

interface PasswordChecks {
  length: boolean;
  upper: boolean;
  lower: boolean;
  number: boolean;
  symbol: boolean;
}

const PASSWORD_RULE_ITEMS: Array<{ key: keyof PasswordChecks; label: string }> = [
  { key: 'length', label: '8+ chars' },
  { key: 'upper', label: 'Uppercase' },
  { key: 'lower', label: 'Lowercase' },
  { key: 'number', label: 'Number' },
  { key: 'symbol', label: 'Symbol' },
];

/** Real-time password strength requirements checklist badges. */
export function ManagerSettingsSecurityPasswordRules({ checks }: { checks: PasswordChecks }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2 text-[11px]">
      {PASSWORD_RULE_ITEMS.map(({ key, label }) => {
        const passed = checks[key];
        return (
          <span
            key={key}
            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-medium ${
              passed ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {passed ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
            {label}
          </span>
        );
      })}
    </div>
  );
}
