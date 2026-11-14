/** Responsibility: Route adapter for the accounting_expense_categories screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminAccountingExpenseCategoriesScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `expense_categories` inside the accounting_expense_categories autonomous module. */
import SuperadminAccountingExpenseCategoriesPageClient from '@/app/frontend_superadmin/superadmin_accounting/accounting_expense_categories/components/SuperadminAccountingExpenseCategoriesPageClient';

/**
 * Composes the accounting expense categories screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminAccountingExpenseCategoriesScreen({ id }: { id?: string }) {
  return <SuperadminAccountingExpenseCategoriesPageClient />;
}
