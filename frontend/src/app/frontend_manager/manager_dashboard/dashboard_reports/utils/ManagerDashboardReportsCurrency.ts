/** Currency and percentage formatting helpers for Manager Dashboard Reports. */
export function formatManagerDashboardReportsCurrency(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(safeAmount);
}

export function formatManagerDashboardReportsPercent(value: number): string {
  const safeVal = Number.isFinite(value) ? value : 0;
  return `${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(safeVal)}%`;
}
