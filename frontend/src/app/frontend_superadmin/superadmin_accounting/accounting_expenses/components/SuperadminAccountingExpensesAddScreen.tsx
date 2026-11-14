/** Responsibility: Route adapter for the accounting_expenses_add screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminAccountingExpensesAddScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `expenses_add` inside the accounting_expenses_add autonomous module. */
import SuperadminAccountingExpensesAddPageClient from '@/app/frontend_superadmin/superadmin_accounting/accounting_expenses/components/SuperadminAccountingExpensesAddPageClient';

/**
 * Composes the accounting expenses screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminAccountingExpensesAddScreen({ id }: { id?: string }) {
  return <SuperadminAccountingExpensesAddPageClient />;
}
