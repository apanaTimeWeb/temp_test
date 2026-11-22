// RESPONSIBILITY: Render the route error boundary for plans pricing catalog; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_plans/plans_pricing_catalog/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry component with explicit props. */
'use client';

import SuperadminPlansPricingCatalogErrorFallback from './components/SuperadminPlansPricingCatalogErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

/**
 * Performs the module error operation within plans pricing catalog; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: ModuleErrorProps.
 */
export default function ModuleError({ error, reset }: ModuleErrorProps) {
  return <SuperadminPlansPricingCatalogErrorFallback error={error} reset={reset} />;
}
