/** Responsibility: Route adapter for the accounting_financial_reports screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminAccountingFinancialReportsScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `financial_reports` inside the accounting_financial_reports autonomous module. */
import SuperadminAccountingFinancialReportsPageClient from '@/app/frontend_superadmin/superadmin_accounting/accounting_financial_reports/components/SuperadminAccountingFinancialReportsPageClient';

/**
 * Composes the accounting financial reports screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminAccountingFinancialReportsScreen({ id }: { id?: string }) {
  return <SuperadminAccountingFinancialReportsPageClient />;
}
