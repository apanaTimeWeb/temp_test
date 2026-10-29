import '@/app/frontend_manager/manager_finance/finance_payment_promises/components/manager_finance_payment_promises_styles/ManagerFinancePaymentPromisesManager_payment_promises.css';

export default function FinanceModuleLayout({ children }: { children: React.ReactNode }) {
  return <div className="finance-theme h-full">{children}</div>;
}
