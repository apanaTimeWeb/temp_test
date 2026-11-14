// RESPONSIBILITY: Render the route loading state for accounting financial reports; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_accounting/accounting_financial_reports/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminAccountingFinancialReportsListSkeleton from './components/SuperadminAccountingFinancialReportsListSkeleton';

/**
 * Performs the module loading operation within accounting financial reports; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminAccountingFinancialReportsListSkeleton />;
}
