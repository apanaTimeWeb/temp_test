// RESPONSIBILITY: Adapt the canonical route for security overview to its leaf-owned screen or redirect; it does not implement sibling workflows.
// FLOW: App Router -> superadmin_security/security_overview/page.tsx -> canonical URL contract -> owning feature screen or redirect.
/** Canonical overview route; preserves the existing overview UI and its local feature lifecycle. */
import SuperadminSecurityOverviewScreen from '@/app/frontend_superadmin/superadmin_security/security_overview/components/SuperadminSecurityOverviewScreen';

/**
 * Renders the security overview route boundary and delegates business presentation to feature-local components.
 */
export default function SuperadminSecurityOverviewPage() {
  return <div data-feature-module="superadmin_security" data-feature-route="security_overview"><SuperadminSecurityOverviewScreen /></div>;
}
