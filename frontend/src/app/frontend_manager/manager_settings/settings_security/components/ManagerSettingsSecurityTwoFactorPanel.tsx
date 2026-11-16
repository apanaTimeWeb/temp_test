'use client';

import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Copy,
  Check,
  RefreshCw,
  QrCode,
  Lock,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import type { ManagerTwoFactorConfig } from '../types/ManagerSettingsSecurityTypes';
import {
  generateQrMatrix,
  generateQrSvgPath,
} from '@/app/frontend_manager/manager_settings/settings_branch_info/utils/ManagerSettingsBranchInfoWifiQr';
import { INITIAL_BACKUP_CODES } from '../constants/ManagerSettingsSecurityConstants';

interface ManagerSettingsSecurityTwoFactorPanelProps {
  twoFactor: ManagerTwoFactorConfig;
  onUpdateTwoFactor: (updated: ManagerTwoFactorConfig) => void;
}

export function ManagerSettingsSecurityTwoFactorPanel({
  twoFactor,
  onUpdateTwoFactor,
}: ManagerSettingsSecurityTwoFactorPanelProps) {
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>(INITIAL_BACKUP_CODES);
  const [showDisableModal, setShowDisableModal] = useState(false);

  // Generate SVG QR Code path for TOTP URI
  const qrSvg = useMemo(() => {
    try {
      const matrix = generateQrMatrix(twoFactor.qrPayload, 'M');
      return generateQrSvgPath(matrix, 2);
    } catch {
      return null;
    }
  }, [twoFactor.qrPayload]);

  const handleCopySecret = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(twoFactor.secretKey);
    }
    setCopiedSecret(true);
    toast.success('2FA Secret Key copied!');
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleCopyBackupCodes = () => {
    const text = backupCodes.join('\n');
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedCodes(true);
    toast.success('Backup codes copied!');
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  const handleRegenerateCodes = () => {
    const newCodes = Array.from({ length: 8 }, () => {
      const rand1 = Math.floor(1000 + Math.random() * 9000);
      const rand2 = Math.floor(1000 + Math.random() * 9000);
      return `${rand1}-${rand2}`;
    });
    setBackupCodes(newCodes);
    toast.success('8 fresh backup codes generated!');
  };

  const handleVerifyAndEnable = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError('');

    const cleanCode = verificationCode.replace(/\s+/g, '');
    if (!/^\d{6}$/.test(cleanCode)) {
      setVerificationError('Enter a valid 6-digit code.');
      return;
    }

    onUpdateTwoFactor({
      ...twoFactor,
      enabled: true,
      lastVerified: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      backupCodesRemaining: backupCodes.length,
    });

    setIsSettingUp(false);
    setVerificationCode('');
    toast.success('Two-Factor Authentication enabled!');
  };

  const handleConfirmDisable = () => {
    onUpdateTwoFactor({
      ...twoFactor,
      enabled: false,
      lastVerified: undefined,
    });
    setShowDisableModal(false);
    toast.success('Two-Factor Authentication disabled.');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              twoFactor.enabled
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}
          >
            {twoFactor.enabled ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                {twoFactor.enabled ? 'Two-Factor Authentication is ON' : 'Two-Factor Authentication is OFF'}
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              {twoFactor.enabled
                ? `Protected via Google / Microsoft Authenticator app.`
                : 'Add a 6-digit TOTP code layer for login protection.'}
            </p>
          </div>
        </div>

        <div className="shrink-0 self-start sm:self-auto">
          {twoFactor.enabled ? (
            <button
              type="button"
              onClick={() => setShowDisableModal(true)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition-all cursor-pointer"
            >
              Disable 2FA
            </button>
          ) : !isSettingUp ? (
            <button
              type="button"
              onClick={() => setIsSettingUp(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all cursor-pointer shadow-xs"
            >
              <Smartphone size={13} />
              <span>Enable 2FA Now</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsSettingUp(false)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Setup View */}
      {!twoFactor.enabled && isSettingUp && (
        <div className="rounded-xl border border-white/10 bg-[#0c0d24] p-4 sm:p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
            {/* QR Code */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-36 h-36 bg-white p-2.5 rounded-xl border border-white/20 shadow-md flex items-center justify-center">
                {qrSvg ? (
                  <svg
                    viewBox={qrSvg.viewBox}
                    className="w-full h-full shape-rendering-crispEdges"
                    aria-label="2FA QR Code"
                  >
                    <path d={qrSvg.path} fill="#0f172a" />
                  </svg>
                ) : (
                  <span className="text-xs text-slate-500">Loading QR...</span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Scan with <strong>Google Authenticator</strong> or <strong>Microsoft Authenticator</strong>
              </p>
            </div>

            {/* Secret & Code Input */}
            <div className="space-y-3">
              {/* Manual Secret Key */}
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Or enter Secret Key manually:
                </label>
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 rounded-lg border border-white/10 bg-slate-900/60 px-2.5 py-1.5 font-mono text-xs font-bold tracking-wider text-amber-300">
                    {twoFactor.secretKey}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopySecret}
                    title="Copy Secret Key"
                    aria-label="Copy Secret Key"
                    className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 text-xs text-slate-300 transition-colors cursor-pointer"
                  >
                    {copiedSecret ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  </button>
                </div>
              </div>

              {/* 6-digit Code Entry */}
              <form onSubmit={handleVerifyAndEnable} className="space-y-3 pt-1">
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
                    onChange={(e) => {
                      setVerificationCode(e.target.value);
                      setVerificationError('');
                    }}
                    placeholder="000000"
                    className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-center font-mono text-base font-bold tracking-widest text-white placeholder:text-slate-600 focus:border-amber-400 focus:outline-none"
                    required
                  />
                  {verificationError && (
                    <p className="text-xs text-rose-400 mt-1">{verificationError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={verificationCode.trim().length !== 6}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 text-xs font-bold text-slate-950 transition-all cursor-pointer"
                >
                  <ShieldCheck size={14} />
                  Verify and Enable 2FA
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Backup Codes (When 2FA is active) */}
      {twoFactor.enabled && (
        <div className="rounded-xl border border-white/10 bg-[#0c0d24] p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
            <div className="flex items-center gap-2">
              <Lock size={15} className="text-emerald-400" />
              <h4 className="text-xs sm:text-sm font-bold text-white">
                Emergency Backup Codes ({backupCodes.length})
              </h4>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyBackupCodes}
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
              >
                {copiedCodes ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                <span>Copy All</span>
              </button>
              <button
                type="button"
                onClick={handleRegenerateCodes}
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
              >
                <RefreshCw size={11} />
                <span>Regenerate</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {backupCodes.map((code, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-slate-900/40 px-2.5 py-1.5 font-mono text-xs font-semibold text-slate-200"
              >
                <span>{code}</span>
                <span className="text-[10px] text-slate-500">#{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disable Modal */}
      {showDisableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#0e1133] p-5 space-y-4 shadow-xl">
            <div className="flex items-center gap-2.5 text-rose-400">
              <AlertTriangle size={20} />
              <h4 className="text-sm font-bold text-white">Disable Two-Factor Authentication?</h4>
            </div>
            <p className="text-xs text-slate-300">
              Your account will only require a password to sign in. Are you sure?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDisableModal(false)}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDisable}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white"
              >
                Yes, Disable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
