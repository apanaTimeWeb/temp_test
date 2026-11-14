// RESPONSIBILITY: Adapt the canonical route for security mfa to its leaf-owned screen or redirect; it does not implement sibling workflows.
// FLOW: App Router -> superadmin_security/security_mfa/page.tsx -> canonical URL contract -> owning feature screen or redirect.
/** Canonical, directly refreshable route for the 2FA & MFA workflow. */
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminSecurityMfaScreen from '@/app/frontend_superadmin/superadmin_security/security_mfa/components/SuperadminSecurityMfaScreen.tsx';

type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }
/**
 * Resolves the canonical route for security mfa and dispatches the selected view to its leaf-owned screen.
 * @param parameter Input required by the declared feature contract. Declared type: { searchParams?: Promise<SearchParams> | SearchParams; }.
 */
export default async function SuperadminSecurityMfaRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const tCopy = await getTranslations("SUPERADMIN_SECURITY");
  return <div className="min-w-0" data-feature-module="superadmin_security" data-feature-route="security_mfa">
    <Suspense fallback={<div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy("COPY.MODULE_ROUTE_LOADING")}</div>}>
      <SuperadminSecurityMfaScreen id={id} />
    </Suspense>
  </div>;
}
