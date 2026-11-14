/** Responsibility: Route adapter for the accounting_expenses screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminAccountingExpensesScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `expenses` inside the accounting_expenses autonomous module. */
import SuperadminAccountingExpensesPageClient from '@/app/frontend_superadmin/superadmin_accounting/accounting_expenses/components/SuperadminAccountingExpensesPageClient';

/**
 * Composes the accounting expenses screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminAccountingExpensesScreen({ id }: { id?: string }) {
  return <SuperadminAccountingExpensesPageClient />;
}
