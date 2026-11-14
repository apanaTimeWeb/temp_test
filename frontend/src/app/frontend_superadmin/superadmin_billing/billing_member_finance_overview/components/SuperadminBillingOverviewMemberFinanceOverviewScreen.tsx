/** Responsibility: Route adapter for the member_finance_overview screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminBillingOverviewMemberFinanceOverviewScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `finance_dashboard` inside the member_finance_overview autonomous module. */
import SuperadminBillingOverviewMemberFinanceOverviewPageClient from '@/app/frontend_superadmin/superadmin_billing/billing_member_finance_overview/components/SuperadminBillingOverviewMemberFinanceOverviewPageClient';

/**
 * Composes the billing overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminBillingOverviewMemberFinanceOverviewScreen({ id }: { id?: string }) {
  return <SuperadminBillingOverviewMemberFinanceOverviewPageClient />;
}
