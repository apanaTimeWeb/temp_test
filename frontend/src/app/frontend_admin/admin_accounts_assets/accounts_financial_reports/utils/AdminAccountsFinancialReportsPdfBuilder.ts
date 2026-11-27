'use client';

import type { FinancialReportExportSpec } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/utils/AdminAccountsFinancialReportsExportTypes';
import { buildFinancialReportPdfStream } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/utils/AdminAccountsFinancialReportsPdfStream';

export function buildFinancialReportPdfBlob(spec: FinancialReportExportSpec): Blob {
  const stream = buildFinancialReportPdfStream(spec);
  const header = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  const offsets: number[] = [];
  let currentOffset = header.length;

  const obj1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  offsets.push(currentOffset);
  currentOffset += obj1.length;

  const obj2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
  offsets.push(currentOffset);
  currentOffset += obj2.length;

  const obj3 =
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n';
  offsets.push(currentOffset);
  currentOffset += obj3.length;

  const obj4 = '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n';
  offsets.push(currentOffset);
  currentOffset += obj4.length;

  const obj5 = '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';
  offsets.push(currentOffset);
  currentOffset += obj5.length;

  const streamBytesLen = new TextEncoder().encode(stream).length;
  const obj6 = `6 0 obj\n<< /Length ${streamBytesLen} >>\nstream\n${stream}\nendstream\nendobj\n`;
  offsets.push(currentOffset);
  currentOffset += obj6.length;

  const startXref = currentOffset;
  let xref = 'xref\n0 7\n0000000000 65535 f \n';
  for (const off of offsets) {
    xref += `${String(off).padStart(10, '0')} 00000 n \n`;
  }
  const trailer = `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;

  const fullPdfString = header + obj1 + obj2 + obj3 + obj4 + obj5 + obj6 + xref + trailer;
  return new Blob([new TextEncoder().encode(fullPdfString)], { type: 'application/pdf' });
}

export function downloadFinancialReportPdf(spec: FinancialReportExportSpec): void {
  if (typeof window === 'undefined') return;
  const blob = buildFinancialReportPdfBlob(spec);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `admin-financial-statement-${spec.period}-${new Date().toISOString().slice(0, 10)}.pdf`;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
