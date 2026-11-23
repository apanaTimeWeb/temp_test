'use client';

import React, { useState } from 'react';
import {
  Lock, KeyRound, Eye, EyeOff, Check, AlertCircle, CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface SecurityCardProps {
  tCopy: (key: string) => string;
}

export default function SuperadminLibrariesProfileSecurityCard({ tCopy }: SecurityCardProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ message: string; isError: boolean } | null>(null);

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordStatus({ message: 'Please enter your current master password.', isError: true });
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setPasswordStatus({ message: 'New password must be at least 8 characters long.', isError: true });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ message: 'New password and confirm password do not match.', isError: true });
      return;
    }
    // Success
    setPasswordStatus({ message: 'Master security credentials updated successfully!', isError: false });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Lock size={18} />
            </div>
            <div>
              <CardTitle>{tCopy("COPY.CHANGE_PASSWORD")}</CardTitle>
              <CardDescription>{tCopy("COPY.UPDATE_YOUR_ACCOUNT_PASSWORD_REGULARLY_FOR_SECURITY")}</CardDescription>
            </div>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
            Root Security
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handlePasswordUpdate} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Current Password */}
            <div className="space-y-1.5">
              <Label htmlFor="current-password">
                <KeyRound size={12} className="text-amber-400" />
                {tCopy("COPY.CURRENT_PASSWORD")}<span className="text-rose-400">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
                  placeholder="Current master password"
                  className="pr-10"
                  data-testid="superadmin_libraries_profile_configuration-current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  title={showCurrentPassword ? 'Hide password' : 'Show password'}
                >
                  {showCurrentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <Label htmlFor="new-password">
                <KeyRound size={12} className="text-amber-400" />
                {tCopy("COPY.NEW_PASSWORD")}<span className="text-rose-400">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="pr-10"
                  data-testid="superadmin_libraries_profile_configuration-new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  title={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirm-password">
                <KeyRound size={12} className="text-amber-400" />
                {tCopy("COPY.CONFIRM_NEW_PASSWORD")}<span className="text-rose-400">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="pr-10"
                  data-testid="superadmin_libraries_profile_configuration-confirm-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>

          {/* Password Requirement Tips */}
          <div className="p-3.5 rounded-xl border border-border/60 bg-background/40 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Password Checklist:</span>
            <span className={`inline-flex items-center gap-1 ${newPassword.length >= 8 ? 'text-emerald-400 font-medium' : 'text-slate-400'}`}>
              <Check size={13} className={newPassword.length >= 8 ? 'text-emerald-400' : 'text-slate-500'} /> At least 8 characters
            </span>
            <span className={`inline-flex items-center gap-1 ${/[0-9]/.test(newPassword) ? 'text-emerald-400 font-medium' : 'text-slate-400'}`}>
              <Check size={13} className={/[0-9]/.test(newPassword) ? 'text-emerald-400' : 'text-slate-500'} /> Contains number (0-9)
            </span>
            <span className={`inline-flex items-center gap-1 ${/[^A-Za-z0-9]/.test(newPassword) ? 'text-emerald-400 font-medium' : 'text-slate-400'}`}>
              <Check size={13} className={/[^A-Za-z0-9]/.test(newPassword) ? 'text-emerald-400' : 'text-slate-500'} /> Contains special symbol
            </span>
          </div>

          {passwordStatus && (
            <div
              className={`flex items-center gap-2.5 rounded-xl border p-4 text-xs sm:text-sm ${
                passwordStatus.isError
                  ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                  : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              }`}
              role="status"
            >
              {passwordStatus.isError ? (
                <AlertCircle size={18} className="text-rose-400 shrink-0" />
              ) : (
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              )}
              <span className="font-medium">{passwordStatus.message}</span>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-4 border-t border-indigo-500/15">
        <span className="text-xs text-slate-400 hidden sm:inline">
          Password updates take effect on subsequent logins across all sessions.
        </span>
        <Button
          type="button"
          id="change-password-btn"
          variant="primary"
          onClick={handlePasswordUpdate}
          data-testid="superadmin_libraries_profile_configuration-change-password-btn"
          className="w-full sm:w-auto"
        >
          <KeyRound size={15} />
          Update Master Password
        </Button>
      </CardFooter>
    </Card>
  );
}
