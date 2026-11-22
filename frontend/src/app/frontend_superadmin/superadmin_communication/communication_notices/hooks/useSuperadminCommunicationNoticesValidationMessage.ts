// RESPONSIBILITY: Own module-local state or interaction logic for communication notices; it does not imply persistence beyond verified contracts.
// FLOW: Feature component -> superadmin_communication/communication_notices/hooks/useSuperadminCommunicationNoticesValidationMessage.ts -> local state/typed dependencies -> returned state and actions.
"use client";

import { useTranslations } from 'next-intl';

/** Translate stable schema validation keys while preserving non-localized external messages. 
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function useSuperadminCommunicationNoticesValidationMessage(): (message?: string) => string {
  const t = useTranslations();

  return (message?: string): string => {
    if (!message) return '';
    if (!message.startsWith('SUPERADMIN_')) return message;
    return t(message as never);
  };
}
