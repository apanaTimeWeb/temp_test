import { sanitizeManagerTrustScoresCsvCell } from '@/app/frontend_manager/manager_finance/finance_trust_scores/utils/ManagerFinanceTrustScoresCsv';

export interface TrustScoreCsvRow {
  rank: number;
  studentName: string;
  smartId: string;
  shift: string;
  trustScore: number;
  totalPromises: number;
  timesChanged: number;
  fulfilledCount: number;
  badge: string;
}

/**
 * Exports sorted student trust scores to a CSV file download.
 */
export function exportTrustScoresCsv(
  rows: readonly TrustScoreCsvRow[],
  shiftLabels: Record<string, string>,
): void {
  const headers = ['Rank', 'Student Name', 'Smart ID', 'Shift', 'Trust Score', 'Total Promises', 'Times Changed', 'Fulfilled Count', 'Reliability Badge'];
  const csvLines = [headers.join(',')];
  for (const s of rows) {
    csvLines.push([
      sanitizeManagerTrustScoresCsvCell(String(s.rank)),
      sanitizeManagerTrustScoresCsvCell(s.studentName),
      sanitizeManagerTrustScoresCsvCell(s.smartId),
      sanitizeManagerTrustScoresCsvCell(shiftLabels[s.shift] ?? s.shift),
      sanitizeManagerTrustScoresCsvCell(String(s.trustScore)),
      sanitizeManagerTrustScoresCsvCell(String(s.totalPromises)),
      sanitizeManagerTrustScoresCsvCell(String(s.timesChanged)),
      sanitizeManagerTrustScoresCsvCell(String(s.fulfilledCount)),
      sanitizeManagerTrustScoresCsvCell(s.badge),
    ].join(','));
  }
  const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `trust_scores_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
