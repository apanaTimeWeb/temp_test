// RESPONSIBILITY: Formatting and data utility functions for Superadmin Branch Management.
import type { SuperadminBranchRecord } from '@/app/frontend_superadmin/superadmin_branches/branches_overview/types/SuperadminBranchesOverviewTypes';
export { printSuperadminBranchesRoster } from '@/app/frontend_superadmin/superadmin_branches/branches_overview/utils/superadmin_branches_overview_print_utils';
export { buildSuperadminBranchesExcel, downloadSuperadminBranchesExcel } from '@/app/frontend_superadmin/superadmin_branches/branches_overview/utils/superadmin_branches_overview_export_utils';

export function formatBranchStatusLabel(status: SuperadminBranchRecord['status']): string {
  switch (status) {
    case 'active':
      return 'Operational';
    case 'suspended':
      return 'Temporarily Suspended';
    case 'deactivated':
      return 'Deactivated';
    case 'closed':
      return 'Archived / Closed';
    default:
      return status;
  }
}

export function formatCurrencyInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function filterBranchesByTerm(
  branches: SuperadminBranchRecord[],
  searchTerm: string,
  libraryId: string,
  status: string,
): SuperadminBranchRecord[] {
  const term = searchTerm.trim().toLowerCase();
  return branches.filter((b) => {
    if (libraryId !== 'all' && b.libraryId !== libraryId) return false;
    if (status !== 'all' && b.status !== status) return false;
    if (!term) return true;
    return (
      b.name.toLowerCase().includes(term) ||
      b.code.toLowerCase().includes(term) ||
      b.city.toLowerCase().includes(term) ||
      b.libraryName.toLowerCase().includes(term) ||
      b.managerName.toLowerCase().includes(term)
    );
  });
}

function quoteCsvCell(value: unknown): string {
  const str = String(value ?? '');
  const formulaSafe = /^[\u0000-\u0020]*[=+\-@]/.test(str) ? `'${str}` : str;
  return `"${formulaSafe.replaceAll('"', '""')}"`;
}

/** Builds RFC-4180 compliant CSV string for Superadmin Branches with UTF-8 BOM. */
export function buildSuperadminBranchesCsv(branches: readonly SuperadminBranchRecord[]): string {
  const headerLabels = ['ID', 'Branch Code', 'Branch Name', 'Tenant / Library', 'City', 'Status', 'Capacity', 'Enrolled Students', 'Member Dues (INR)'];
  const rows = [
    headerLabels.map(quoteCsvCell).join(','),
    ...branches.map((b) => [
      b.id,
      b.code,
      b.name,
      b.libraryName,
      b.city,
      formatBranchStatusLabel(b.status),
      b.capacity,
      b.activeMembers,
      b.memberDues,
    ].map(quoteCsvCell).join(',')),
  ];
  return `\uFEFF${rows.join('\r\n')}`;
}

/** Downloads branches CSV file in browser. */
export function downloadSuperadminBranchesCsv(branches: readonly SuperadminBranchRecord[], filename = 'superadmin_branches_export.csv'): void {
  if (typeof window === 'undefined') return;
  const content = buildSuperadminBranchesCsv(branches);
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.hidden = true;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
