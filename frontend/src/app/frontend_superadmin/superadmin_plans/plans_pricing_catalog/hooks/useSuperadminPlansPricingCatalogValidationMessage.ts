// RESPONSIBILITY: Own module-local state or interaction logic for plans pricing catalog; it does not imply persistence beyond verified contracts.
// FLOW: Feature component -> superadmin_plans/plans_pricing_catalog/hooks/useSuperadminPlansPricingCatalogValidationMessage.ts -> local state/typed dependencies -> returned state and actions.
"use client";

import { useTranslations } from 'next-intl';

/** Translate stable schema validation keys while preserving non-localized external messages. 
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function useSuperadminPlansPricingCatalogValidationMessage(): (message?: string) => string {
  const t = useTranslations();

  return (message?: string): string => {
    if (!message) return '';
    if (!message.startsWith('SUPERADMIN_')) return message;
    return t(message as never);
  };
}
