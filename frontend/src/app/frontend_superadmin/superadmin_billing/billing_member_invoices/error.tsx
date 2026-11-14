// RESPONSIBILITY: Render the route error boundary for billing member invoices; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_billing/billing_member_invoices/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry fallback. */
'use client';

import SuperadminBillingInvoicesMemberInvoicesInvoiceDetailErrorFallback from './components/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

export default function ModuleError({ reset }: ModuleErrorProps) {
  return <SuperadminBillingInvoicesMemberInvoicesInvoiceDetailErrorFallback onRetry={reset} />;
}
