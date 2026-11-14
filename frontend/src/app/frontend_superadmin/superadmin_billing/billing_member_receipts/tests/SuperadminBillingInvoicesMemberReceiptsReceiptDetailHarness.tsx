// RESPONSIBILITY: Define source-level test coverage for billing member receipts using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_member_receipts/tests/SuperadminBillingInvoicesMemberReceiptsReceiptDetailHarness.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';

/** Minimal isolated provider harness. Next.js navigation hooks require a host router/mock when used. */
export default function SuperadminBillingInvoicesMemberReceiptsReceiptDetailHarness({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }));
  return (
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale="en" messages={{}} onError={() => undefined}>
        {children}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
}
