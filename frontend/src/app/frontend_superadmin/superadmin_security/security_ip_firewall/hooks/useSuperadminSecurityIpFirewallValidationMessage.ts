// RESPONSIBILITY: Own module-local state or interaction logic for security ip firewall; it does not imply persistence beyond verified contracts.
// FLOW: Feature component -> superadmin_security/security_ip_firewall/hooks/useSuperadminSecurityIpFirewallValidationMessage.ts -> local state/typed dependencies -> returned state and actions.
"use client";

import { useTranslations } from 'next-intl';

/** Translate stable schema validation keys while preserving non-localized external messages. 
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function useSuperadminSecurityIpFirewallValidationMessage(): (message?: string) => string {
  const t = useTranslations();

  return (message?: string): string => {
    if (!message) return '';
    if (!message.startsWith('SUPERADMIN_')) return message;
    return t(message as never);
  };
}
