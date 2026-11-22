// RESPONSIBILITY: Render the route error boundary for plans promotions; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_plans/plans_promotions/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry component with explicit props. */
'use client';

import SuperadminPlansPromotionsErrorFallback from './components/SuperadminPlansPromotionsErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

/**
 * Performs the module error operation within plans promotions; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: ModuleErrorProps.
 */
export default function ModuleError({ error, reset }: ModuleErrorProps) {
  return <SuperadminPlansPromotionsErrorFallback error={error} reset={reset} />;
}
