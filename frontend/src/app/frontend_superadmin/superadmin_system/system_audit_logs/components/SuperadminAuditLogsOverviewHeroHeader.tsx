'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ScrollText, ShieldCheck } from 'lucide-react';

interface SuperadminAuditLogsOverviewHeroHeaderProps {
  t: (key: string, values?: Record<string, string | number>) => string;
}

export default function SuperadminAuditLogsOverviewHeroHeader({
  t,
}: SuperadminAuditLogsOverviewHeroHeaderProps) {
  return (
    <div className="rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/80 via-[#0a0d22] to-[#060810] p-5 sm:p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shadow-inner">
              <ScrollText size={24} aria-hidden="true" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
              {t('COPY.SYSTEM_AUDIT_LOGS_SAMPLE')}
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              HMAC SHA-256 Tamper-Proof Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Append-only immutable system ledger tracking administrative operations, tenant data lifecycle changes, and critical security events with cryptographic verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/superadmin/superadmin_security/security_overview"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-[0.98]"
          >
            <ShieldCheck size={14} />
            <span>Security Center</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
