'use client';

import { ButtonLoader } from '@/app/frontend_manager/components/ManagerLoader';
import { ManagerSettingsSecurityPasswordRules } from '@/app/frontend_manager/manager_settings/settings_security/components/ManagerSettingsSecurityPasswordRules';
import { changePasswordSchema } from '@/app/frontend_manager/manager_settings/settings_security/schemas/ManagerSettingsSecuritySchema';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';

export function ManagerSettingsSecurityPasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const checks = useMemo(() => ({
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    symbol: /[^A-Za-z0-9]/.test(newPassword),
    matches: Boolean(newPassword && newPassword === confirmPassword),
  }), [newPassword, confirmPassword]);

  const strengthScore = useMemo(() => {
    if (!newPassword) return 0;
    let score = 0;
    if (checks.length) score += 25;
    if (checks.upper) score += 20;
    if (checks.lower) score += 15;
    if (checks.number) score += 20;
    if (checks.symbol) score += 20;
    return Math.min(100, score);
  }, [newPassword, checks]);

  const strengthLabel = useMemo(() => {
    if (strengthScore === 0) return { label: 'Empty', color: 'text-slate-500' };
    if (strengthScore < 40) return { label: 'Weak', color: 'text-rose-400' };
    if (strengthScore < 75) return { label: 'Medium', color: 'text-amber-400' };
    return { label: 'Strong', color: 'text-emerald-400' };
  }, [strengthScore]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const result = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      const firstError = result.error.errors[0]?.message || 'Please check the form inputs.';
      setStatusMessage({ type: 'error', text: firstError });
      toast.error(firstError, { id: 'manager-security-password-validation-error' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStatusMessage({
        type: 'success',
        text: 'Password updated successfully.',
      });
      toast.success('Manager password updated successfully!', { id: 'manager-security-password-updated' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 500);
  };

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-indigo-400" />
          <h2 className="text-sm sm:text-base font-bold text-white">Change Password</h2>
        </div>
        {newPassword && (
          <span className={`text-xs font-semibold ${strengthLabel.color}`}>
            Strength: {strengthLabel.label}
          </span>
        )}
      </div>

      {statusMessage && (
        <div
          className={`flex items-center gap-2.5 rounded-lg border p-3 text-xs font-medium ${
            statusMessage.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
          }`}
          role="alert"
        >
          {statusMessage.type === 'success' ? (
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="currentPassword" className="block text-xs font-semibold text-slate-300 mb-1">
            Current Password
          </label>
          <div className="relative">
            <input
              maxLength={30}
              id="currentPassword"
              name="currentPassword"
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
              aria-label={showCurrent ? 'Hide password' : 'Show password'}
            >
              {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-xs font-semibold text-slate-300 mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              maxLength={30}
              id="newPassword"
              name="newPassword"
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters with symbol & number"
              autoComplete="new-password"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
              aria-label={showNew ? 'Hide password' : 'Show password'}
            >
              {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <ManagerSettingsSecurityPasswordRules checks={checks} />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-300 mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              maxLength={30}
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              autoComplete="new-password"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {confirmPassword && (
            <div className="mt-1">
              <span
                className={`text-[11px] font-medium inline-flex items-center gap-1 ${
                  checks.matches ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {checks.matches ? (
                  <>
                    <CheckCircle2 size={11} /> Passwords match
                  </>
                ) : (
                  <>
                    <XCircle size={11} /> Passwords do not match
                  </>
                )}
              </span>
            </div>
          )}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !checks.length || !checks.matches}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-xs font-bold text-white motion-safe:transition-all cursor-pointer shadow-md"
          >
            {isSubmitting ? <ButtonLoader icon="key-round" /> : <ShieldCheck size={14} />}
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
}
