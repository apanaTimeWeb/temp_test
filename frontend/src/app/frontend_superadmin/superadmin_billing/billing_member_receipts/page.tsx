// RESPONSIBILITY: Canonical route adapter for the autonomous member_receipts workflow.
// FLOW: canonical leaf URL -> standard Suspense fallback -> existing workflow Screen component.
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminBillingInvoicesMemberReceiptsScreen from '@/app/frontend_superadmin/superadmin_billing/billing_member_receipts/components/SuperadminBillingInvoicesMemberReceiptsScreen';
import SuperadminBillingInvoicesMemberReceiptsReceiptDetailScreen from '@/app/frontend_superadmin/superadmin_billing/billing_member_receipts/components/SuperadminBillingInvoicesMemberReceiptsReceiptDetailScreen';

type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }

/** Renders the leaf-owned route; the original parent query-view dispatcher remains as a compatibility path. */
export default async function BillingMemberReceiptsRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  // The page accepts both Next.js promise-shaped searchParams and the role adapter's object-shaped contract.
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const view = firstValue(query.view);
  const tCopy = await getTranslations('SUPERADMIN_BILLING');
  const fallback = <div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy('COPY.MODULE_ROUTE_LOADING')}</div>;
  if (view === 'detail') {
    return (
      <div className="min-w-0" data-feature-module="superadmin_billing" data-feature-route="billing_member_receipts" data-feature-view="detail">
        <Suspense fallback={fallback}>
          <SuperadminBillingInvoicesMemberReceiptsReceiptDetailScreen id={id} />
        </Suspense>
      </div>
    );
  }
  return (
    <div className="min-w-0" data-feature-module="superadmin_billing" data-feature-route="billing_member_receipts">
      <Suspense fallback={fallback}>
        <SuperadminBillingInvoicesMemberReceiptsScreen id={id} />
      </Suspense>
    </div>
  );
}
