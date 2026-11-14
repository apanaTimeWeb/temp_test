import { BarChart2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

/** Responsibility: render a no-data state for the selected report period without implying that live reports were fetched. */
/** Data-Flow: owning feature collection/filter -> zero-result decision -> localized accessible empty state; no server write is inferred. */
/** Flow: selected report period -> feature-owned report arrays -> accessible localized no-data presentation. */
export function SuperadminAccountingFinancialReportsEmptyState() {
  const tCopy = useTranslations('SUPERADMIN_ACCOUNTING');
  return (
    <div className="acct-card flex flex-col items-center gap-3 p-8 text-center" role="status" data-testid="superadmin-accounting-accounting-financial-reports-empty-state">
      <BarChart2 size={18} aria-hidden="true" className="acct-icon-muted" />
      <h2 className="acct-section-label">{tCopy('COPY.NO_FINANCIAL_REPORT_DATA')}</h2>
      <p className="acct-cell-subtext">{tCopy('COPY.NO_FINANCIAL_REPORT_DATA_DESCRIPTION')}</p>
    </div>
  );
}
