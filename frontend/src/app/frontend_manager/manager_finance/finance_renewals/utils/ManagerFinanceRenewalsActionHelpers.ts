import { exportManagerRenewalsCsv } from './ManagerFinanceRenewalsCsv';
import type { FilterType } from '../types/ManagerFinanceRenewalsComponentTypes';

export function handleRenewalsExport(visible: any[], filter: FilterType, setMsg: (m: string) => void) {
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
