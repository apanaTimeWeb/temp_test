import '@/app/frontend_manager/manager_finance/finance_security_deposits/components/manager_finance_security_deposits_styles/ManagerFinanceSecurityDepositsManager_security_deposits.css';

export default function FinanceModuleLayout({ children }: { children: React.ReactNode }) {
  return <div className="finance-theme h-full">{children}</div>;
}
