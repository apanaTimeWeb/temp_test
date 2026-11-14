/** Responsibility: SuperadminSecurityPasswordPolicyEmptyState; provides a localized, accessible empty-state message for security_overview lists. */
/** Data-Flow: owning feature collection/filter -> zero-result decision -> localized accessible empty state; no server write is inferred. */
'use client';

import { Inbox } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminSecurityPasswordPolicyEmptyStateProps } from '@/app/frontend_superadmin/superadmin_security/security_password_policy/types/SuperadminSecurityPasswordPolicyEmptyStateTypes';

/**
 * Renders the empty collection state for security password policy; it does not imply that a backend operation succeeded.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSecurityPasswordPolicyEmptyStateProps.
 */
export default function SuperadminSecurityPasswordPolicyEmptyState({ filtered = false }: SuperadminSecurityPasswordPolicyEmptyStateProps) {
  const tCopy = useTranslations('SUPERADMIN_SECURITY');
  return (
    <span role="status" aria-live="polite" data-testid="superadmin-security-security-password-policy-empty-state" className="inline-flex items-center justify-center gap-2 text-sm text-secondary">
      <Inbox aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span>{tCopy(filtered ? 'COPY.TABLE_EMPTY_FILTERED' : 'COPY.TABLE_EMPTY')}</span>
    </span>
  );
}
