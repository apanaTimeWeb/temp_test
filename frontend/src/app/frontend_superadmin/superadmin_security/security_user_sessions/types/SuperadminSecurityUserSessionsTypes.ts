// FLOW: Feature source -> security_user_sessions types -> read-only local session row contract.
/** Relative-time labels are finite copy identifiers, not hard-coded language strings. */
export type SuperadminSessionRelativeTimeKey = 'JUST_NOW' | 'TWO_HOURS_AGO' | 'TEN_MINUTES_AGO' | 'ONE_MONTH_AGO';

/** Declares the safe illustrative row shape rendered by the User Sessions route. */
export interface SuperadminSessionData {
  id: string;
  user: string;
  device: string;
  ip: string;
  location: string;
  lastActive: SuperadminSessionRelativeTimeKey;
  status: 'Active' | 'Revoked';
}
