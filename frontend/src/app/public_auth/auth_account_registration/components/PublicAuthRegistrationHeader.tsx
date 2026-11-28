'use client';

import { BookOpen, CheckCircle2 } from 'lucide-react';

interface PublicAuthRegistrationBrandHeaderProps {
  title: string;
  description: string;
  demoFillLabel: string;
  demoFillEnabled: boolean;
  isBusy: boolean;
  onDemoFill: () => void;
}

/** Top brand identity badge + card title bar for account registration. */
export function PublicAuthRegistrationBrandBanner() {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="flex items-center gap-3">
        <div className="relative w-11 h-11">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl blur-md opacity-80" />
          <div className="relative w-11 h-11 bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg border border-white/20">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
        </div>
        <span className="text-2xl font-black tracking-tight text-white">
          Library<span className="reg-gradient-text">OS</span>
        </span>
      </div>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/60 px-3 py-1 text-xs font-semibold text-indigo-300">
        <CheckCircle2 size={12} className="text-cyan-400" />
        Empowering Modern Indian Study Libraries
      </span>
    </div>
  );
}

/** Card header with localized title, subtitle, and opt-in non-production demo fill trigger. */
export default function PublicAuthRegistrationHeader({
  title,
  description,
  demoFillLabel,
  demoFillEnabled,
  isBusy,
  onDemoFill,
}: PublicAuthRegistrationBrandHeaderProps) {
  return (
    <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/5 pb-5">
      <div>
        <h1 id="auth-signup-title" className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          {title}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">{description}</p>
      </div>
      {demoFillEnabled && (
        <button
          data-testid="auth-signup-demo-fill"
          type="button"
          disabled={isBusy}
          onClick={onDemoFill}
          className="self-start rounded-lg border border-indigo-500/30 bg-indigo-950/60 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/60 motion-safe:transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {demoFillLabel}
        </button>
      )}
    </header>
  );
}
