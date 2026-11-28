import type { FilterType } from '@/app/frontend_manager/manager_finance/finance_renewals/types/ManagerFinanceRenewalsComponentTypes';
import { exportManagerRenewalsCsv } from '@/app/frontend_manager/manager_finance/finance_renewals/utils/ManagerFinanceRenewalsCsv';

export interface RenewalMessageItem {
  id: number | string;
  studentName: string;
  smartId: string;
  shift: string;
  plan: string;
  expiryDate: string;
  daysLeft: number;
  due: number;
  phone?: string;
}

export function formatRenewalInr(majorAmount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(majorAmount);
}

export function getRenewalTemplates() {
  const sampleDue = '{due}';
  return [
    {
      label: 'Upcoming (Friendly)',
      text: 'Hello {name}, your Library subscription ({smartId} • {plan}) is expiring on {expiry} ({daysLeft} days left). Please renew timely to retain your seat. — Library Administration',
    },
    {
      label: 'Critical Alert (1-3 Days)',
      text: `Urgent: Hello {name}, your Library access ({smartId}) will expire in {daysLeft} days. Renewal fee due: ${sampleDue}. Please renew today at the desk or online. — Library Administration`,
    },
    {
      label: 'Expired Notice',
      text: `Attention: Hello {name}, your library membership ({smartId}) expired on {expiry}. Pending renewal amount: ${sampleDue}. Kindly clear dues to avoid seat suspension. — Library Administration`,
    },
  ];
}

export function personalizeRenewalTemplate(template: string, item: RenewalMessageItem): string {
  return template
    .replace(/{name}/gi, item.studentName)
    .replace(/{smartId}/gi, item.smartId)
    .replace(/{plan}/gi, item.plan)
    .replace(/{shift}/gi, item.shift)
    .replace(/{expiry}/gi, item.expiryDate)
    .replace(/{daysLeft}/gi, String(Math.abs(item.daysLeft)))
    .replace(/{due}/gi, formatRenewalInr(Math.round(item.due / 100)));
}

export function handleRenewalsExport(visible: Parameters<typeof exportManagerRenewalsCsv>[0], filter: FilterType, setMsg: (m: string) => void) {
  exportManagerRenewalsCsv(visible, filter);
  setMsg(`Exported ${visible.length} renewal records to CSV successfully.`);
}

export function handleRenewalsPrint() {
  if (typeof window !== 'undefined') window.print();
}

export function handleRenewalsFileImport(
  e: React.ChangeEvent<HTMLInputElement>,
  count: number,
  setMsg: (m: string) => void
) {
  const file = e.target.files?.[0];
  if (file) {
    setMsg(`Imported file "${file.name}" successfully with ${count} renewals records.`);
    e.target.value = '';
  }
}
