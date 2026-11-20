// RESPONSIBILITY: Formatting and data utility functions for Superadmin Branch Management.
import type { SuperadminBranchRecord } from '../types/SuperadminBranchesOverviewTypes';

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
