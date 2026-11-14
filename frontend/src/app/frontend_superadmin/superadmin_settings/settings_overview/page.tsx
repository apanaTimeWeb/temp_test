// RESPONSIBILITY: Adapt the canonical route for settings overview to its leaf-owned screen or redirect; it does not implement sibling workflows.
// FLOW: App Router -> superadmin_settings/settings_overview/page.tsx -> canonical URL contract -> owning feature screen or redirect.
/** Canonical overview route; preserves the existing overview UI and its local feature lifecycle. */
import SuperadminSettingsOverviewScreen from '@/app/frontend_superadmin/superadmin_settings/settings_overview/components/SuperadminSettingsOverviewScreen';

/**
 * Renders the settings overview route boundary and delegates business presentation to feature-local components.
 */
export default function SuperadminSettingsOverviewPage() {
  return <div data-feature-module="superadmin_settings" data-feature-route="settings_overview"><SuperadminSettingsOverviewScreen /></div>;
}
