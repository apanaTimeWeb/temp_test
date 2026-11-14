// RESPONSIBILITY: Define stable module-owned constants for users member trust score; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_users/users_member_trust_score/constants/SuperadminUsersOverviewMemberTrustScoreStaticConstants.ts -> typed constants -> component/hook/config behavior.



/** Static module-owned options/status mapping extracted from SuperadminUsersOverviewMemberTrustScorePageClient.tsx. */
export const SUPERADMIN_FINANCE_TRUST_SCORE_PAGE_CLIENT_TRUST_TONE_TEXT_CLASS = {
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
};

import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
/** Static module-owned options/status mapping extracted from SuperadminUsersOverviewMemberTrustScorePageClient.tsx. */
export const SUPERADMIN_FINANCE_TRUST_SCORE_PAGE_CLIENT_BADGE_ICON = {
  reliable: ShieldCheck,
  moderate: ShieldAlert,
  low:      ShieldX,
};


/** Static module-owned options/status mapping extracted from SuperadminUsersOverviewMemberTrustScorePageClient.tsx. */
export const SUPERADMIN_FINANCE_TRUST_SCORE_PAGE_CLIENT_BADGE_CLASS = {
  reliable: 'fin-badge fin-badge--success',
  moderate: 'fin-badge fin-badge--warning',
  low:      'fin-badge fin-badge--danger',
};

export const SUPERADMIN_MEMBER_TRUST_SCORE_THRESHOLDS = { RELIABLE_MIN: 70, LOW_MAX_EXCLUSIVE: 40 } as const;
