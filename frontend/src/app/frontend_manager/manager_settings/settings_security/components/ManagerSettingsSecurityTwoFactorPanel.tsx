'use client';

import { ManagerSettingsSecurityTwoFactorSetup } from '@/app/frontend_manager/manager_settings/settings_security/components/ManagerSettingsSecurityTwoFactorSetup';
import { INITIAL_BACKUP_CODES } from '@/app/frontend_manager/manager_settings/settings_security/constants/ManagerSettingsSecurityConstants';
import type { ManagerTwoFactorConfig } from '@/app/frontend_manager/manager_settings/settings_security/types/ManagerSettingsSecurityTypes';
import {
  generateSecurityQrMatrix,
  generateSecurityQrSvgPath,
} from '@/app/frontend_manager/manager_settings/settings_security/utils/ManagerSettingsSecurityQr';
import {
  AlertTriangle,
  Check,
  Copy,
  Lock,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

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
  const secretTimerRef = useRef<number | null>(null);
  const codesTimerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (secretTimerRef.current !== null) window.clearTimeout(secretTimerRef.current);
    if (codesTimerRef.current !== null) window.clearTimeout(codesTimerRef.current);
  }, []);

  const qrSvg = useMemo(() => {
    try {
      const matrix = generateSecurityQrMatrix(twoFactor.qrPayload, 'M');
      return generateSecurityQrSvgPath(matrix, 2);
    } catch {
      return null;
    }
  }, [twoFactor.qrPayload]);

  const handleCopySecret = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(twoFactor.secretKey);
    }
    setCopiedSecret(true);
    toast.success('2FA Secret Key copied!', { id: 'manager-security-copy-secret' });
    if (secretTimerRef.current !== null) window.clearTimeout(secretTimerRef.current);
    secretTimerRef.current = window.setTimeout(() => { setCopiedSecret(false); secretTimerRef.current = null; }, 2000);
  };

  const handleCopyBackupCodes = () => {
    const text = backupCodes.join('\n');
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedCodes(true);
    toast.success('Backup codes copied!', { id: 'manager-security-copy-backup-codes' });
    if (codesTimerRef.current !== null) window.clearTimeout(codesTimerRef.current);
    codesTimerRef.current = window.setTimeout(() => { setCopiedCodes(false); codesTimerRef.current = null; }, 2000);
  };

  const handleRegenerateCodes = () => {
    const newCodes = Array.from({ length: 8 }, () => {
      const rand1 = Math.floor(1000 + Math.random() * 9000);
      const rand2 = Math.floor(1000 + Math.random() * 9000);
      return `${rand1}-${rand2}`;
    });
    setBackupCodes(newCodes);
    toast.success('8 fresh backup codes generated!', { id: 'manager-security-regen-backup-codes' });
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
    toast.success('Two-Factor Authentication enabled!', { id: 'manager-security-2fa-enabled' });
  };

  const handleConfirmDisable = () => {
    onUpdateTwoFactor({
      ...twoFactor,
      enabled: false,
      lastVerified: undefined,
    });
    setShowDisableModal(false);
    toast.success('Two-Factor Authentication disabled.', { id: 'manager-security-2fa-disabled' });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-900 p-4">
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
                ? 'Protected via Google / Microsoft Authenticator app.'
                : 'Add a 6-digit TOTP code layer for login protection.'}
            </p>
          </div>
        </div>

        <div className="shrink-0 self-start sm:self-auto">
          {twoFactor.enabled ? (
            <button
              type="button"
              onClick={() => setShowDisableModal(true)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 motion-safe:transition-all cursor-pointer"
            >
              Disable 2FA
            </button>
          ) : !isSettingUp ? (
            <button
              type="button"
              onClick={() => setIsSettingUp(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 text-white motion-safe:transition-all cursor-pointer shadow-md"
            >
              <Smartphone size={13} />
              <span>Enable 2FA Now</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsSettingUp(false)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white motion-safe:transition-all cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {!twoFactor.enabled && isSettingUp && (
        <ManagerSettingsSecurityTwoFactorSetup
          qrSvg={qrSvg}
          secretKey={twoFactor.secretKey}
          copiedSecret={copiedSecret}
          onCopySecret={handleCopySecret}
          verificationCode={verificationCode}
          onVerificationCodeChange={(val) => {
            setVerificationCode(val);
            setVerificationError('');
          }}
          verificationError={verificationError}
          onSubmitVerify={handleVerifyAndEnable}
        />
      )}

      {twoFactor.enabled && (
        <div className="mgr-sec-panel-surface rounded-xl border p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
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
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 motion-safe:transition-colors cursor-pointer"
              >
                {copiedCodes ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                <span>Copy All</span>
              </button>
              <button
                type="button"
                onClick={handleRegenerateCodes}
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 motion-safe:transition-colors cursor-pointer"
              >
                <RefreshCw size={11} />
                <span>Regenerate</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {backupCodes.map((code, index) => (
              <div
                key={`backup-code-${code}`}
                className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-xs font-semibold text-slate-200"
              >
                <span>{code}</span>
                <span className="text-[10px] text-slate-500">#{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showDisableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop backdrop-blur-xs p-4">
          <div className="mgr-sec-modal-surface w-full max-w-sm rounded-xl border p-5 space-y-4 shadow-xl">
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
                className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 hover:bg-slate-800"
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
