import '@/app/frontend_manager/manager_finance/finance_auto_suspend/components/manager_finance_auto_suspend_styles/ManagerFinanceAutoSuspendManager_auto_suspend.css';

export default function FinanceModuleLayout({ children }: { children: React.ReactNode }) {
  return <div className="finance-theme h-full">{children}</div>;
}
