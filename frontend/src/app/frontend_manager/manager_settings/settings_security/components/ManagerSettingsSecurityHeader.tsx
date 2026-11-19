'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert, KeyRound, MonitorSmartphone, Building2, User } from 'lucide-react';
import type { ManagerProfileInfo, ManagerTwoFactorConfig, ManagerActiveSession } from '../types/ManagerSettingsSecurityTypes';

interface ManagerSettingsSecurityHeaderProps {
  profile: ManagerProfileInfo;
  twoFactor: ManagerTwoFactorConfig;
  activeSessions: ManagerActiveSession[];
}

export function ManagerSettingsSecurityHeader({
  profile,
  twoFactor,
  activeSessions,
}: ManagerSettingsSecurityHeaderProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-gradient-to-r from-[#0c0d24] via-[#0e1133] to-[#0a0c20] p-4 sm:p-5 shadow-lg relative overflow-hidden">
      {/* Subtle accent glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        {/* Left: Manager identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 shadow-md">
            <User size={22} />
          </div>

          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                {profile.name}
              </h1>
              <span className="rounded-full bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300">
                {profile.role}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 text-slate-300">
                <Building2 className="h-3.5 w-3.5 text-indigo-400" />
                {profile.branchName}
                <span className="rounded bg-white/10 px-1.5 py-0.2 font-mono text-[10px] text-indigo-300">
                  {profile.branchCode}
                </span>
              </span>
              <span>•</span>
              <span className="font-mono text-[11px] text-slate-400">{profile.email}</span>
            </div>
          </div>
        </div>

        {/* Right: Quick security status pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 2FA Status */}
          <div
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${
              twoFactor.enabled
                ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                : 'border-amber-500/40 bg-amber-500/15 text-amber-300'
            }`}
          >
            {twoFactor.enabled ? (
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
            )}
            <span>{twoFactor.enabled ? '2FA Active' : '2FA Off'}</span>
          </div>

          {/* Active Sessions count */}
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-300">
            <MonitorSmartphone className="h-3.5 w-3.5 text-indigo-400" />
            <span>{activeSessions.length} Devices Online</span>
          </div>

          {/* Password Age */}
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-400">
            <KeyRound className="h-3.5 w-3.5 text-slate-400" />
            <span>Pass changed {profile.lastPasswordChanged}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
