'use client';

import { useTranslations } from 'next-intl';
import { PUBLIC_AUTH_REGISTRATION_PASSWORD_STRENGTH_SEGMENT_IDS } from '@/app/frontend_public/public_auth/auth_account_registration/utils/PublicAuthRegistrationConstants';

type PublicAuthPasswordStrengthScore = 0 | 1 | 2 | 3 | 4;

function calculatePublicAuthPasswordStrength(password: string): PublicAuthPasswordStrengthScore {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score as PublicAuthPasswordStrengthScore;
}

/**
 * Renders a localized, accessible password-complexity hint without enforcing server policy.
 * Dependencies: the `AUTH` locale namespace and the current password string from the owning form.
 * Edge cases: an empty password renders nothing; complexity is a display hint only and cannot confirm that a password will be accepted by the server.
 */
export default function PublicAuthRegistrationPasswordStrengthMeter({ password }: { password: string }) {
  const t = useTranslations('AUTH');
  if (!password) return null;

  const score = calculatePublicAuthPasswordStrength(password);
  const strengthLabels = [
    t('PASSWORD.strength.weak'),
    t('PASSWORD.strength.weak'),
    t('PASSWORD.strength.fair'),
    t('PASSWORD.strength.good'),
    t('PASSWORD.strength.strong'),
  ];
  const labelClasses = ['text-danger', 'text-danger', 'text-warning', 'text-info', 'text-success'];
  const segmentClasses = ['', 'bg-danger', 'bg-warning', 'bg-info', 'bg-success'];

  return (
    <div className="mt-2 space-y-2">
      <div
        className="flex gap-1.5"
        data-testid="auth-password-strength-meter-status"
        role="progressbar"
        aria-label={t('PASSWORD.strength.label')}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={score}
        aria-valuetext={strengthLabels[score]}
      >
        {PUBLIC_AUTH_REGISTRATION_PASSWORD_STRENGTH_SEGMENT_IDS.map((segmentId, index) => (
          <span
            key={segmentId}
            aria-hidden="true"
            className={`h-1.5 flex-1 rounded-full ${index < score ? segmentClasses[score] : 'bg-surface-highlight'}`}
          />
        ))}
      </div>
      <p className={`text-xs font-semibold ${labelClasses[score]}`} aria-live="polite" data-testid="auth-password-strength-description">
        {t('PASSWORD.strength.prefix')} {strengthLabels[score]}
      </p>
    </div>
  );
}
