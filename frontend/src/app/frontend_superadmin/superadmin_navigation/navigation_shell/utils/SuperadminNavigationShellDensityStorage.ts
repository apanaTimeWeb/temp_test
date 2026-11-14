// RESPONSIBILITY: Read or write the module-owned versioned UI preference through the browser storage boundary; it does not store credentials or business records.
// FLOW: Feature UI -> superadmin_navigation/navigation_shell/utils/SuperadminNavigationShellDensityStorage.ts -> validated preference value -> browser storage with a safe fallback.
/**
 * Defines the public SuperadminNavigationDensity contract for the Superadmin navigation shell. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminNavigationDensity = 'compact' | 'comfortable';

const SUPERADMIN_NAVIGATION_DENSITY_STORAGE_KEY = 'superadmin_navigation:v1:table-density';

/** Reads only a non-sensitive display preference through the shell-owned storage boundary. 
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function readSuperadminNavigationDensity(): SuperadminNavigationDensity {
  if (typeof window === 'undefined') return 'comfortable';
  try {
    return window.localStorage.getItem(SUPERADMIN_NAVIGATION_DENSITY_STORAGE_KEY) === 'compact' ? 'compact' : 'comfortable';
  } catch {
    return 'comfortable';
  }
}

/** Persists the validated, versioned display preference; storage failure never blocks navigation. 
 * @param density - Input supplied by the caller under the declared TypeScript contract.
 * @returns No value; this function wires lifecycle behavior for the owning feature.
 */
export function writeSuperadminNavigationDensity(density: SuperadminNavigationDensity): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SUPERADMIN_NAVIGATION_DENSITY_STORAGE_KEY, density);
  } catch {
    // Private browsing or storage restrictions leave the preference session-local.
  }
}
