// RESPONSIBILITY: Render the route error boundary for accounting financial reports; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_accounting/accounting_financial_reports/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry component with explicit props. */
'use client';

import SuperadminAccountingFinancialReportsErrorFallback from './components/SuperadminAccountingFinancialReportsErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

/**
 * Performs the module error operation within accounting financial reports; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: ModuleErrorProps.
 */
export default function ModuleError({ error, reset }: ModuleErrorProps) {
  return <SuperadminAccountingFinancialReportsErrorFallback error={error} reset={reset} />;
}
