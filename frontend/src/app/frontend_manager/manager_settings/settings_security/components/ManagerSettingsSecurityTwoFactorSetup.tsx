'use client';

import { LibraryLoader } from '@/app/frontend_manager/components/ManagerLoader';
import { Check, Copy, ShieldCheck } from 'lucide-react';
import React from 'react';

interface ManagerSettingsSecurityTwoFactorSetupProps {
  qrSvg: { viewBox: string; path: string } | null;
  secretKey: string;
  copiedSecret: boolean;
  onCopySecret: () => void;
  verificationCode: string;
  onVerificationCodeChange: (val: string) => void;
  verificationError: string;
  onSubmitVerify: (e: React.FormEvent) => void;
}

/** Authenticator app QR enrollment, secret key copy, and 6-digit code verification panel. */
export function ManagerSettingsSecurityTwoFactorSetup({
  qrSvg,
  secretKey,
  copiedSecret,
  onCopySecret,
  verificationCode,
  onVerificationCodeChange,
  verificationError,
  onSubmitVerify,
}: ManagerSettingsSecurityTwoFactorSetupProps) {
  return (
    <div className="mgr-sec-panel-surface rounded-xl border p-4 sm:p-5 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-36 h-36 bg-white p-2.5 rounded-xl border border-slate-300 shadow-md flex items-center justify-center">
            {qrSvg ? (
              <svg
                viewBox={qrSvg.viewBox}
                className="w-full h-full shape-rendering-crispEdges"
                aria-label="2FA QR Code"
              >
                <path d={qrSvg.path} className="fill-slate-900" />
              </svg>
            ) : (
              <div className="flex items-center justify-center w-full h-full" role="status">
                <LibraryLoader size="sm" icon="key-round" variant="contra" />
              </div>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            Scan with <strong>Google Authenticator</strong> or <strong>Microsoft Authenticator</strong>
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Or enter Secret Key manually:
            </label>
            <div className="flex items-center gap-1.5">
              <div className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 font-mono text-xs font-bold tracking-wider text-indigo-300">
                {secretKey}
              </div>
              <button
                type="button"
                onClick={onCopySecret}
                title="Copy Secret Key"
                aria-label="Copy Secret Key"
                className="rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 text-xs text-slate-300 motion-safe:transition-colors cursor-pointer"
              >
                {copiedSecret ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              </button>
            </div>
          </div>

          <form onSubmit={onSubmitVerify} className="space-y-3 pt-1">
            <div>
              <label htmlFor="twoFactorCode" className="text-xs font-semibold text-slate-300 block mb-1">
                Enter 6-digit Code from App:
              </label>
              <input
                id="twoFactorCode"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => onVerificationCodeChange(e.target.value)}
                placeholder="000000"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-center font-mono text-base font-bold tracking-widest text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
              {verificationError && (
                <p className="text-xs text-rose-400 mt-1">{verificationError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={verificationCode.trim().length !== 6}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 border border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 text-xs font-bold text-white motion-safe:transition-all cursor-pointer shadow-md"
            >
              <ShieldCheck size={14} />
              Verify and Enable 2FA
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
