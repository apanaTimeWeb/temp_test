// Responsibility: AdminFinanceEmptyState component owned by admin_finance; responsibility folder: components.
'use client';
import type { AdminFinanceEmptyStateProps } from '@/app/frontend_admin/admin_finance/finance_invoices/types/AdminFinanceInvoicesTypes';


// RESPONSIBILITY: Standardized empty state component for lists/tables in the admin_finance module.
// DATA FLOW: Parent -> AdminFinanceEmptyState -> DOM

export default function AdminFinanceEmptyState({ title, description }: AdminFinanceEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center text-text-secondary border border-dashed rounded-lg">
      <p className="font-medium text-text-primary">{title}</p>
      {description ? <p className="text-sm mt-1">{description}</p> : null}
    </div>
  );
}
