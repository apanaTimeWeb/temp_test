'use client';

import Link from 'next/link';
import { Eye, EyeOff, Lock, MessageCircle } from 'lucide-react';
import type { FieldErrors, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import { PublicAuthButtonLoader } from '@/app/public_auth/auth_sign_in/components/PublicAuthSignInLoader';
import type { PublicAuthLoginFormData } from '@/app/public_auth/auth_sign_in/schemas/PublicAuthSignInValidationSchemas';
import type { PublicAuthRole } from '@/app/public_auth/auth_sign_in/utils/PublicAuthSignInConstants';

interface PublicAuthSignInFormProps {
  selectedRoleId: PublicAuthRole;
  isBusy: boolean;
  loginSuccess: boolean;
  showPw: boolean;
  onTogglePw: () => void;
  forgotPasswordHref: string;
  requiredLabel: string;
  hidePasswordLabel: string;
  showPasswordLabel: string;
  register: UseFormRegister<PublicAuthLoginFormData>;
  errors: FieldErrors<PublicAuthLoginFormData>;
  handleSubmit: UseFormHandleSubmit<PublicAuthLoginFormData>;
  onSubmit: (data: PublicAuthLoginFormData) => Promise<void>;
}

/** Accessible Sign-In credential form, error feedback, submit loader, and WhatsApp enquiry link. */
export default function PublicAuthSignInForm({
  selectedRoleId,
  isBusy,
  loginSuccess,
  showPw,
  onTogglePw,
  forgotPasswordHref,
  requiredLabel,
  hidePasswordLabel,
  showPasswordLabel,
  register,
  errors,
  handleSubmit,
  onSubmit,
}: PublicAuthSignInFormProps) {
  return (
    <>
      <form data-testid="auth-login-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
        <input type="hidden" data-testid="auth-login-role-value" {...register('role')} value={selectedRoleId} />

        <div className="space-y-1">
          <label htmlFor="login-email" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            Email Address
            <span aria-hidden="true" className="ml-1 text-indigo-400">
              *
            </span>
            <span className="sr-only">{requiredLabel}</span>
          </label>
          <input
            maxLength={30}
            id="login-email"
            data-testid="auth-login-email-input"
            type="email"
            required
            autoComplete="username"
            placeholder="Enter your email"
            disabled={isBusy}
            {...register('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'auth-login-email-error' : undefined}
            className={`input-field w-full rounded-lg px-3.5 py-2.5 text-sm ${errors.email ? 'input-error' : ''}`}
          />
          {errors.email && (
            <p
              id="auth-login-email-error"
              data-testid="auth-login-email-validation-error"
              className="text-rose-400 text-xs font-medium mt-1 flex items-center gap-1"
              role="alert"
            >
              <span>⚠</span>
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label
              htmlFor="login-password"
              className="block text-xs font-bold text-slate-300 uppercase tracking-wider"
            >
              Password
              <span aria-hidden="true" className="ml-1 text-indigo-400">
                *
              </span>
              <span className="sr-only">{requiredLabel}</span>
            </label>
            <Link
              href={forgotPasswordHref}
              className="text-xs text-indigo-400 font-medium hover:text-indigo-300 motion-safe:transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              maxLength={30}
              id="login-password"
              data-testid="auth-login-password-input"
              type={showPw ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              disabled={isBusy}
              {...register('password')}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'auth-login-password-error' : undefined}
              className={`input-field w-full rounded-lg px-3.5 py-2.5 text-sm pr-10 ${errors.password ? 'input-error' : ''}`}
            />
            <button
              type="button"
              data-testid="auth-login-password-toggle"
              disabled={isBusy}
              aria-label={showPw ? hidePasswordLabel : showPasswordLabel}
              aria-pressed={showPw}
              onClick={onTogglePw}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white motion-safe:transition-colors cursor-pointer"
            >
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && (
            <p
              id="auth-login-password-error"
              data-testid="auth-login-password-validation-error"
              className="text-rose-400 text-xs font-medium mt-1 flex items-center gap-1"
              role="alert"
            >
              <span>⚠</span>
              {errors.password.message}
            </p>
          )}
        </div>

        {errors.root?.server?.message && (
          <div
            data-testid="auth-login-server-error-state"
            className="bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs px-3 py-2 rounded-lg flex items-start gap-2"
            role="alert"
          >
            <span className="shrink-0 mt-0.5">⚠️</span>
            <span>{errors.root.server.message}</span>
          </div>
        )}

        <button
          id="login-submit-btn"
          data-testid="auth-login-submit"
          type="submit"
          disabled={isBusy || loginSuccess}
          className="submit-btn w-full text-white font-bold text-sm py-2.5 rounded-xl motion-safe:transition-all mt-1 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {isBusy || loginSuccess ? (
            <PublicAuthButtonLoader />
          ) : (
            <>
              <Lock size={14} />
              <span>Sign In</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
        <span className="text-slate-400 text-xs">Need access or have an enquiry?</span>
        <a
          href="https://wa.me/?text=Hello%20LibraryOS%2C%20I%20would%20like%20to%20enquire%20about%20LibraryOS%20Multi-Branch%20Study%20Library%20Management%20System."
          target="_blank"
          rel="noopener noreferrer"
          data-testid="auth-login-whatsapp-enquiry"
          aria-label="Enquire on WhatsApp"
          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/60 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-500/50 motion-safe:transition-all cursor-pointer shadow-xs"
        >
          <MessageCircle size={13} className="text-emerald-400" />
          <span>WhatsApp Enquiry</span>
        </a>
      </div>
    </>
  );
}
