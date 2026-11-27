'use client';
// RESPONSIBILITY: AdminAccountsFinancialReportsKpiCards component owned by admin_accounting; responsibility folder: admin_accounts_financial_reports.

import type { AdminAccountsFinancialReportsKpiCardsProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/types/AdminAccountsFinancialReportsTypes';
import { formatAdminAccountingCurrency } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/utils/AdminAccountsFinancialReportsFormatCurrency';
import { BarChart2, TrendingDown, TrendingUp } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

const generateSparkline = (title: string) =>
  `M0,32 Q${15 + (title.length % 10)},${42 - (title.length % 15)} ${35 + (title.length % 10)},22 T${75 + (title.length % 10)},26 T${115 + (title.length % 10)},12 T150,6`;

export function AdminAccountsFinancialReportsKpiCards({ totalIncomeMinor, totalExpenseMinor, period }: AdminAccountsFinancialReportsKpiCardsProps) {
  const locale = useLocale();
  const t = useTranslations('ADMIN_ACCOUNTING.FINANCIAL_REPORTS');
  const netProfitMinor = totalIncomeMinor - totalExpenseMinor;
  const periodLabel = period === 'quarterly' ? 'Quarterly' : period === 'yearly' ? 'Yearly' : period === 'custom' ? 'Custom Range' : 'Monthly';

  const cards = [
    {
      label: t('TOTAL_INCOME'),
      value: formatAdminAccountingCurrency(totalIncomeMinor, locale),
      valueCls: 'text-text-primary',
      iconBox: 'border-success bg-success-bg text-success-text',
      badgeCls: 'bg-success-bg border-success text-success-text',
      stroke: 'var(--chart-success)',
      path: generateSparkline('total_income'),
      Icon: TrendingUp,
    },
    {
      label: t('TOTAL_EXPENSES'),
      value: formatAdminAccountingCurrency(totalExpenseMinor, locale),
      valueCls: 'text-text-primary',
      iconBox: 'border-danger bg-danger-bg text-danger-text',
      badgeCls: 'bg-danger-bg border-danger text-danger-text',
      stroke: 'var(--chart-danger)',
      path: generateSparkline('total_expense'),
      Icon: TrendingDown,
    },
    {
      label: t('NET_PROFIT'),
      value: formatAdminAccountingCurrency(netProfitMinor, locale),
      valueCls: netProfitMinor >= 0 ? 'text-primary' : 'text-danger-text',
      iconBox: 'border-border-focus bg-primary-subtle text-primary',
      badgeCls: 'bg-primary-subtle border-border-focus text-primary',
      stroke: 'var(--chart-primary)',
      path: generateSparkline('net_profit'),
      Icon: BarChart2,
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3" aria-label={t('REPORT_TOTALS')}>
      {cards.map(({ label, value, valueCls, iconBox, badgeCls, stroke, path, Icon }) => (
        <div
          key={label}
          className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-[1.01]"
        >
          <svg
            aria-hidden="true"
            className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 motion-safe:transition-opacity pointer-events-none"
            viewBox="0 0 150 45"
          >
            <path d={path} fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1.5 min-w-0">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-text-secondary truncate">{label}</span>
              <span className={`self-start rounded-full border px-2 py-0.5 text-[10px] font-bold shadow-card ${badgeCls}`}>
                {periodLabel}
              </span>
            </div>
            <div className={`p-2.5 rounded-xl border shrink-0 motion-safe:transition-transform motion-safe:group-hover:scale-110 shadow-card ${iconBox}`}>
              <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
            </div>
          </div>
          <p className={`relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight tabular-nums ${valueCls}`}>
            {value}
          </p>
        </div>
      ))}
    </section>
  );
}

export type { AdminAccountsFinancialReportsKpiCardsProps };
