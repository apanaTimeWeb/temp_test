/** Responsibility: Route adapter for the accounting_daily_settlement screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminAccountingDailySettlementScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `daily_settlement` inside the accounting_daily_settlement autonomous module. */
import SuperadminAccountingDailySettlementPageClient from '@/app/frontend_superadmin/superadmin_accounting/accounting_daily_settlement/components/SuperadminAccountingDailySettlementPageClient';

/**
 * Composes the accounting daily settlement screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminAccountingDailySettlementScreen({ id }: { id?: string }) {
  return <SuperadminAccountingDailySettlementPageClient />;
}
