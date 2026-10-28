import signInEn from '../app/frontend_public/public_auth/auth_sign_in/locales/public_auth_en.json';
import regEn from '../app/frontend_public/public_auth/auth_account_registration/locales/public_auth_en.json';
import recoveryEn from '../app/frontend_public/public_auth/auth_password_recovery/locales/public_auth_en.json';
import resetEn from '../app/frontend_public/public_auth/auth_password_reset/locales/public_auth_en.json';

import signInHi from '../app/frontend_public/public_auth/auth_sign_in/locales/public_auth_hi.json';
import regHi from '../app/frontend_public/public_auth/auth_account_registration/locales/public_auth_hi.json';
import recoveryHi from '../app/frontend_public/public_auth/auth_password_recovery/locales/public_auth_hi.json';
import resetHi from '../app/frontend_public/public_auth/auth_password_reset/locales/public_auth_hi.json';

function isPlainObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Recursively deep merge multiple objects without mutating the targets.
 */
export function deepMerge(...objects: Record<string, any>[]): Record<string, any> {
  const result: Record<string, any> = {};

  for (const obj of objects) {
    if (!isPlainObject(obj)) continue;
    for (const [key, value] of Object.entries(obj)) {
      if (isPlainObject(value)) {
        if (!isPlainObject(result[key])) {
          result[key] = {};
        }
        result[key] = deepMerge(result[key], value);
      } else {
        result[key] = value;
      }
    }
  }

  return result;
}

function expandNamespaces(obj: Record<string, any>, prefix = ''): Record<string, any> {
  const expanded: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (isPlainObject(value)) {
      expanded[fullKey] = value;
      Object.assign(expanded, expandNamespaces(value, fullKey));
    }
  }
  return expanded;
}

const baseMergedEn = deepMerge(signInEn, regEn, recoveryEn, resetEn);
const baseMergedHi = deepMerge(signInHi, regHi, recoveryHi, resetHi);

export const mergedEnMessages = baseMergedEn;
export const mergedHiMessages = baseMergedHi;

export function getMergedMessages(locale: string) {
  if (locale === 'hi') {
    return mergedHiMessages;
  }
  return mergedEnMessages;
}
