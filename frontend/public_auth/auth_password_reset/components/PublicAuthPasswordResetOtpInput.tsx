'use client';

import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react';

interface PublicAuthPasswordResetOtpInputProps {
  value: string;
  disabled: boolean;
  invalid: boolean;
  errorId?: string;
  label: string;
  digitLabel: string;
  requiredLabel: string;
  onChange: (value: string) => void;
}

/** RESPONSIBILITY: Own the six-digit OTP interaction. FLOW: keystroke/paste -> normalized six-slot state -> parent form value. */
export default function PublicAuthPasswordResetOtpInput({ value, disabled, invalid, errorId, label, digitLabel, requiredLabel, onChange }: PublicAuthPasswordResetOtpInputProps) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  // Data-flow rationale: parent form values may be updated by demo-fill or reset; keep six visible slots synchronized without emitting a second change.
  useEffect(() => {
    const normalized = value.padEnd(6, ' ').slice(0, 6).split('').map((digit) => digit.trim());
    if (normalized.join('') !== digits.join('')) setDigits(normalized);
  }, [value, digits]);

  const update = (nextDigits: string[]) => {
    setDigits(nextDigits);
    onChange(nextDigits.join(''));
  };
  const onDigitChange = (index: number, inputValue: string) => {
    const digit = inputValue.replace(/\D/g, '').slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = digit;
    update(nextDigits);
    if (digit && index < nextDigits.length - 1) refs.current[index + 1]?.focus();
  };
  const onDigitKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) refs.current[index - 1]?.focus();
    if (event.key === 'ArrowLeft' && index > 0) refs.current[index - 1]?.focus();
    if (event.key === 'ArrowRight' && index < digits.length - 1) refs.current[index + 1]?.focus();
  };
  const onOtpPaste = (event: ClipboardEvent<HTMLDivElement>) => {
    const pastedOtp = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedOtp.length > 0) {
      update([...pastedOtp.padEnd(6, ' ').slice(0, 6)].map((digit) => digit.trim()));
      refs.current[Math.min(pastedOtp.length - 1, 5)]?.focus();
    }
    event.preventDefault();
  };

  return (
    <>
      <p id="auth-reset-otp-label" className="text-sm font-medium text-secondary">{label}<span aria-hidden="true" className="ml-1">*</span><span className="sr-only">{requiredLabel}</span></p>
      <div className="flex justify-center gap-1 sm:gap-3" role="group" aria-labelledby="auth-reset-otp-label" onPaste={onOtpPaste} data-testid="auth-reset-otp-group">
        {digits.map((digit, index) => (
          <input
            key={`auth-reset-otp-${index + 1}`}
            ref={(element) => { refs.current[index] = element; }}
            id={`auth-reset-otp-${index + 1}`}
            data-testid={`auth-reset-otp-digit-${index + 1}-input`}
            required
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            value={digit}
            onChange={(event) => onDigitChange(index, event.target.value)}
            onKeyDown={(event) => onDigitKeyDown(index, event)}
            aria-label={`${digitLabel} ${index + 1}`}
            aria-invalid={invalid}
            aria-describedby={errorId}
            className={`h-11 w-11 shrink-0 rounded-lg border bg-input text-center text-lg font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${invalid ? 'border-danger' : 'border-border'} disabled:cursor-not-allowed disabled:bg-surface-highlight disabled:text-disabled`}
            disabled={disabled}
          />
        ))}
      </div>
    </>
  );
}
