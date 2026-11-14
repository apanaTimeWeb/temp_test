// RESPONSIBILITY: Render the route loading state for accounting expense categories; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_accounting/accounting_expense_categories/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminAccountingExpenseCategoriesListSkeleton from './components/SuperadminAccountingExpenseCategoriesListSkeleton';

/**
 * Performs the module loading operation within accounting expense categories; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminAccountingExpenseCategoriesListSkeleton />;
}
