// RESPONSIBILITY: Own the locally expanded referral row for the member-referrals preview; no referral or bonus data is mutated.
// FLOW: Member-referrals page -> module-owned expansion state -> local leaderboard preview.
import { useState } from 'react';

/**
 * Returns the currently expanded local referral row; it does not mutate referral or bonus data.
 * @returns Module-local UI state and stable React state setters.
 */
export function useSuperadminUsersMemberReferralsExpandedState() {
  const [expanded, setExpanded] = useState<number | null>(null);
  return { expanded, setExpanded };
}
