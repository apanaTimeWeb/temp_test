// RESPONSIBILITY: Render the route loading state for accounting expenses; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_accounting/accounting_expenses/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminAccountingExpensesListSkeleton from './components/SuperadminAccountingExpensesListSkeleton';

/**
 * Performs the module loading operation within accounting expenses; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminAccountingExpensesListSkeleton />;
}
