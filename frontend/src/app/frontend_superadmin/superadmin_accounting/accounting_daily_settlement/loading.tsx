// RESPONSIBILITY: Render the route loading state for accounting daily settlement; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_accounting/accounting_daily_settlement/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminAccountingDailySettlementListSkeleton from './components/SuperadminAccountingDailySettlementListSkeleton';

/**
 * Performs the module loading operation within accounting daily settlement; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminAccountingDailySettlementListSkeleton />;
}
