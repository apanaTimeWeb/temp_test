import '@/app/frontend_manager/manager_finance/finance_receipts/components/manager_finance_receipts_styles/ManagerFinanceReceiptsManager_receipt.css';

export default function FinanceModuleLayout({ children }: { children: React.ReactNode }) {
  return <div className="finance-theme h-full">{children}</div>;
}
