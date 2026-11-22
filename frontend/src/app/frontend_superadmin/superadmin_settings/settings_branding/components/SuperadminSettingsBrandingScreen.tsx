/** Responsibility: Route adapter for the settings_branding screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminSettingsBrandingScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `branding` inside the settings_branding autonomous module. */
import SuperadminSystemBrandingPageClient from '@/app/frontend_superadmin/superadmin_settings/settings_branding/components/SuperadminSettingsBrandingPageClient';

/**
 * Composes the settings branding screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminSettingsBrandingScreen({ id }: { id?: string }) {
  return <SuperadminSystemBrandingPageClient />;
}
