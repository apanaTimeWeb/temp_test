'use client';

import Link from 'next/link';
import { BookOpen } from 'lucide-react';

/** Top brand header shown above the password reset card. */
export function PublicAuthPasswordResetBrandBanner() {
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
          Library<span className="reset-gradient-text">OS</span>
        </span>
      </div>
    </div>
  );
}

interface PublicAuthPasswordResetSuccessViewProps {
  title: string;
  description: string;
  backToLoginLabel: string;
  loginHref: string;
}

/** Confirmation panel displayed after a successful password reset. */
export default function PublicAuthPasswordResetSuccessView({
  title,
  description,
  backToLoginLabel,
  loginHref,
}: PublicAuthPasswordResetSuccessViewProps) {
  return (
    <div data-testid="auth-reset-completed-state" className="space-y-4 text-center py-2" role="status" aria-live="polite">
      <span
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 mx-auto text-xl font-black"
        aria-hidden="true"
      >
        ✓
      </span>
      <h1 id="auth-reset-title" className="text-2xl font-black text-white tracking-tight">
        {title}
      </h1>
      <p className="text-xs sm:text-sm leading-relaxed text-slate-300">{description}</p>
      <div className="pt-2">
        <Link
          data-testid="auth-reset-back-to-login-link"
          href={loginHref}
          className="reset-shimmer-btn reset-glow-indigo flex min-h-11 items-center justify-center rounded-xl px-4 py-3 font-bold text-sm text-white hover:opacity-95 motion-safe:transition-all"
        >
          {backToLoginLabel}
        </Link>
      </div>
    </div>
  );
}
