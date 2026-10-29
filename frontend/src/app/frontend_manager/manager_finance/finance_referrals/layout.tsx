import '@/app/frontend_manager/manager_finance/finance_referrals/components/manager_finance_referrals_styles/ManagerFinanceReferralsManager_referrals.css';

export default function FinanceModuleLayout({ children }: { children: React.ReactNode }) {
  return <div className="finance-theme h-full">{children}</div>;
}
