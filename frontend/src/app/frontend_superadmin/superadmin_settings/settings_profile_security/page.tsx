// RESPONSIBILITY: Adapt the canonical route for settings profile security to its leaf-owned screen or redirect; it does not implement sibling workflows.
// FLOW: App Router -> superadmin_settings/settings_profile_security/page.tsx -> canonical URL contract -> owning feature screen or redirect.
/** Canonical, directly refreshable route for the Security Settings workflow. */
import SuperadminProfileSecurityChangePasswordScreen from '@/app/frontend_superadmin/superadmin_settings/settings_profile_security/components/SuperadminProfileSecurityChangePasswordScreen.tsx';
import SuperadminProfileSecurityTwoFactorScreen from '@/app/frontend_superadmin/superadmin_settings/settings_profile_security/components/SuperadminProfileSecurityTwoFactorScreen.tsx';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminProfileSecuritySettingsScreen from '@/app/frontend_superadmin/superadmin_settings/settings_profile_security/components/SuperadminProfileSecuritySettingsScreen.tsx';

type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }
/**
 * Resolves the canonical route for profile security and dispatches the selected view to its leaf-owned screen.
 * @param parameter Input required by the declared feature contract. Declared type: { searchParams?: Promise<SearchParams> | SearchParams; }.
 */
export default async function SuperadminProfileSecuritySettingsRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const view = firstValue(query.view);
  if (view === 'two-factor') return <div className="min-w-0" data-feature-module="superadmin_settings" data-feature-route="settings_profile_security" data-feature-view="two-factor"><SuperadminProfileSecurityTwoFactorScreen id={id} /></div>;
  if (view === 'change-password') return <div className="min-w-0" data-feature-module="superadmin_settings" data-feature-route="settings_profile_security" data-feature-view="change-password"><SuperadminProfileSecurityChangePasswordScreen id={id} /></div>;
  const tCopy = await getTranslations("SUPERADMIN_PROFILE");
  return <div className="min-w-0" data-feature-module="superadmin_settings" data-feature-route="settings_profile_security">
    <Suspense fallback={<div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy("COPY.MODULE_ROUTE_LOADING")}</div>}>
      <SuperadminProfileSecuritySettingsScreen id={id} />
    </Suspense>
  </div>;
}
