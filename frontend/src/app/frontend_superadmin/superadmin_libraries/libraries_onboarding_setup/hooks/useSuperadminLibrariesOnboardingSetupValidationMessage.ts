// RESPONSIBILITY: Own module-local state or interaction logic for libraries onboarding setup; it does not imply persistence beyond verified contracts.
// FLOW: Feature component -> superadmin_libraries/libraries_onboarding_setup/hooks/useSuperadminLibrariesOnboardingSetupValidationMessage.ts -> local state/typed dependencies -> returned state and actions.
"use client";

import { useTranslations } from 'next-intl';

/** Translate stable schema validation keys while preserving non-localized external messages. 
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function useSuperadminLibrariesOnboardingSetupValidationMessage(): (message?: string) => string {
  const t = useTranslations();

  return (message?: string): string => {
    if (!message) return '';
    if (!message.startsWith('SUPERADMIN_')) return message;
    return t(message as never);
  };
}
