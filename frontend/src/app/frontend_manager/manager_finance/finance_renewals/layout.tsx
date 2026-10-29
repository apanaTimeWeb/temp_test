import '@/app/frontend_manager/manager_finance/finance_renewals/components/manager_finance_renewals_styles/ManagerFinanceRenewalsManager_renewals.css';

export default function FinanceModuleLayout({ children }: { children: React.ReactNode }) {
  return <div className="finance-theme h-full">{children}</div>;
}
