// Canonical domain shell: direct submodule routes own all business screens.
import { redirect } from 'next/navigation';
import { ADMIN_FINANCE_COLLECT_FEE_CANONICAL_ROUTE } from './finance_collect_fee/config/admin_finance_collect_fee.url_config';

export default function AdminFinancePage() {
  redirect(ADMIN_FINANCE_COLLECT_FEE_CANONICAL_ROUTE);
}
