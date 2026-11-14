// RESPONSIBILITY: Render the route error boundary for subscriptions active subscribers; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_subscriptions/subscriptions_active_subscribers/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry component with explicit props. */
'use client';

import SuperadminSubscriptionsActiveSubscribersErrorFallback from './components/SuperadminSubscriptionsActiveSubscribersErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

/**
 * Performs the module error operation within subscriptions active subscribers; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: ModuleErrorProps.
 */
export default function ModuleError({ error, reset }: ModuleErrorProps) {
  return <SuperadminSubscriptionsActiveSubscribersErrorFallback error={error} reset={reset} />;
}
