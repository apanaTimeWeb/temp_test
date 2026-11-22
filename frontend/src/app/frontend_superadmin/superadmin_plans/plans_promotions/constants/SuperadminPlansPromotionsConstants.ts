// FLOW: Feature consumers -> superadmin_plans/plans_promotions/constants/SuperadminPlansPromotionsConstants.ts -> typed constants -> component/hook/config behavior.
/** Responsibility: Superadmin Billing Constants; stable tab IDs and localized labels. */
import { FileText, Tag } from 'lucide-react';
export const SUPERADMIN_BILLING_TABS = [
  { id: 'invoices' as const, labelKey: 'COPY.INVOICES_AND_TRANSACTIONS', icon: FileText },
  { id: 'promos' as const, labelKey: 'COPY.PROMO_CODES_AND_OFFERS', icon: Tag },
];
