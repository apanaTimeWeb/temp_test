import '@/app/frontend_manager/manager_finance/finance_fines_payments/components/manager_finance_fines_payments_styles/ManagerFinanceFinesPaymentsManager_fines_payments.css';

export default function FinanceModuleLayout({ children }: { children: React.ReactNode }) {
  return <div className="finance-theme h-full">{children}</div>;
}
