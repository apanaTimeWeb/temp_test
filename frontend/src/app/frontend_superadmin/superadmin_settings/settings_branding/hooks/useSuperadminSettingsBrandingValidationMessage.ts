// RESPONSIBILITY: Own module-local state or interaction logic for settings branding; it does not imply persistence beyond verified contracts.
// FLOW: Feature component -> superadmin_settings/settings_branding/hooks/useSuperadminSettingsBrandingValidationMessage.ts -> local state/typed dependencies -> returned state and actions.
"use client";

import { useTranslations } from 'next-intl';
import english from '@/app/frontend_superadmin/superadmin_settings/settings_branding/locales/superadmin_settings_branding_en.json';

type SystemValidationKey = keyof typeof english.SUPERADMIN_SYSTEM.VALIDATION;
const SYSTEM_VALIDATION_KEYS = new Set<string>(Object.keys(english.SUPERADMIN_SYSTEM.VALIDATION));
const GENERIC_VALIDATION_KEY: SystemValidationKey = 'PROVIDE_VALID_FORM_DATA';

/**
 * Translate stable schema validation keys while preserving non-localized external messages.
 * Only catalog-backed SUPERADMIN_SYSTEM.VALIDATION keys are translated; unknown module keys
 * fall back to the catalog's generic validation message rather than reaching next-intl unchecked.
 
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function useSuperadminSettingsBrandingValidationMessage(): (message?: string) => string {
  const t = useTranslations();

  return (message?: string): string => {
    if (!message) return '';
    const prefix = 'SUPERADMIN_SYSTEM.VALIDATION.';
    if (!message.startsWith(prefix)) return message;
    const key = message.slice(prefix.length);
    const safeKey: SystemValidationKey = SYSTEM_VALIDATION_KEYS.has(key) ? key as SystemValidationKey : GENERIC_VALIDATION_KEY;
    return t(('SUPERADMIN_SYSTEM.VALIDATION.' + String(safeKey)) as never);
  };
}
