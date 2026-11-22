'use client';

import type { AdminFinancePayment } from '@/app/frontend_admin/admin_finance/finance_payments/types/AdminFinancePaymentsComponentTypes';
import type { AdminFinanceRefund } from '@/app/frontend_admin/admin_finance/finance_refunds/types/AdminFinanceRefundsComponentTypes';

function escapePdfString(str: unknown): string {
  return String(str ?? '')
    .replaceAll('\\', '\\\\')
    .replaceAll('(', '\\(')
    .replaceAll(')', '\\)');
}

interface PdfSectionMeta {
  label: string;
  value: string;
}

interface PdfLineItem {
  desc: string;
  amount: string;
}

interface SimplePdfSpec {
  title: string;
  subtitle: string;
  meta: PdfSectionMeta[];
  items: PdfLineItem[];
  totals: { label: string; value: string };
  footer: string;
  themeColor?: [number, number, number]; // RGB 0-1
}

export function buildSimplePdfBlob(spec: SimplePdfSpec): Blob {
  const [r, g, b] = spec.themeColor ?? [0.02, 0.47, 0.34]; // Emerald default

  let stream = '';
  // Background header band
  stream += `${r} ${g} ${b} rg\n50 760 495 55 re f\n`;

  // Title & Subtitle in white
  stream += `1 1 1 rg\nBT\n/F1 15 Tf\n65 792 Td\n(${escapePdfString(spec.title)}) Tj\nET\n`;
  stream += `BT\n/F2 9 Tf\n65 774 Td\n(${escapePdfString(spec.subtitle)}) Tj\nET\n`;

  // Metadata rows
  stream += '0 0 0 rg\n';
  let y = 725;
  for (const m of spec.meta) {
    stream += `BT\n/F1 9 Tf\n50 ${y} Td\n(${escapePdfString(m.label)}:) Tj\nET\n`;
    stream += `BT\n/F2 9 Tf\n170 ${y} Td\n(${escapePdfString(m.value)}) Tj\nET\n`;
    y -= 15;
  }

  // Divider
  y -= 8;
  stream += `0.82 0.85 0.88 RG\n50 ${y} m 545 ${y} l S\n`;

  // Table header
  y -= 18;
  stream += `0.94 0.96 0.98 rg\n50 ${y - 4} 495 20 re f\n`;
  stream += `0.1 0.1 0.1 rg\nBT\n/F1 9 Tf\n60 ${y} Td\n(DESCRIPTION / PARTICULARS) Tj\nET\n`;
  stream += `BT\n/F1 9 Tf\n470 ${y} Td\n(AMOUNT) Tj\nET\n`;

  // Table rows
  y -= 18;
  for (const item of spec.items) {
    stream += `BT\n/F2 9 Tf\n60 ${y} Td\n(${escapePdfString(item.desc)}) Tj\nET\n`;
    stream += `BT\n/F1 9 Tf\n470 ${y} Td\n(${escapePdfString(item.amount)}) Tj\nET\n`;
    y -= 16;
  }

  // Grand Total callout box
  y -= 12;
  stream += `0.93 0.98 0.95 rg\n330 ${y - 10} 215 32 re f\n`;
  stream += `${r} ${g} ${b} RG\n330 ${y - 10} 215 32 re S\n`;
  stream += `${r} ${g} ${b} rg\nBT\n/F1 11 Tf\n342 ${y} Td\n(${escapePdfString(spec.totals.label)}: ${escapePdfString(spec.totals.value)}) Tj\nET\n`;

  // Signature line
  stream += '0.3 0.3 0.3 RG\n380 90 m 545 90 l S\n';
  stream += '0.2 0.2 0.2 rg\nBT\n/F2 8 Tf\n400 76 Td\n(Authorized Accounts Officer) Tj\nET\n';

  // Bottom footer note
  stream += `0.45 0.45 0.45 rg\nBT\n/F2 8 Tf\n50 55 Td\n(${escapePdfString(spec.footer)}) Tj\nET\n`;

  const header = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  const offsets: number[] = [];
  let currentOffset = header.length;

  const obj1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  offsets.push(currentOffset);
  currentOffset += obj1.length;

  const obj2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
  offsets.push(currentOffset);
  currentOffset += obj2.length;

  const obj3 = '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n';
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

export function downloadPdfBlob(blob: Blob, fileName: string): void {
  if (typeof window === 'undefined') return;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.hidden = true;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function formatCleanPhoneNumber(rawPhone?: string): string {
  const digits = (rawPhone ?? '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

export function buildWhatsAppLink(phone: string | undefined, message: string): string {
  const cleanPhone = formatCleanPhoneNumber(phone);
  const encodedText = encodeURIComponent(message);
  if (cleanPhone) {
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  }
  return `https://wa.me/?text=${encodedText}`;
}

export function downloadPaymentInvoicePdf(payment: AdminFinancePayment): void {
  const invoiceNumber = `INV-${payment.receiptNumber.replace(/^REC-/, '')}`;
  const totalAmount = payment.amount;
  const taxableAmount = Math.round(totalAmount / 1.18);
  const gstAmount = totalAmount - taxableAmount;
  const cgst = Math.round(gstAmount / 2);
  const sgst = gstAmount - cgst;

  const blob = buildSimplePdfBlob({
    title: 'SMART LIBRARY NETWORK - GST TAX INVOICE',
    subtitle: `Branch: ${payment.branch ?? 'Downtown Central'} | GSTIN: 07AABCS1429B1Z8`,
    themeColor: [0.03, 0.45, 0.65], // Cyan / Blue theme
    meta: [
      { label: 'Invoice Number', value: invoiceNumber },
      { label: 'Receipt Reference', value: payment.receiptNumber },
      { label: 'Invoice Date', value: payment.date },
      { label: 'Billed Student', value: payment.studentName },
      { label: 'Student Smart ID', value: payment.smartId },
      { label: 'Payment Mode', value: `${payment.mode.toUpperCase()}${payment.txnId ? ` (Ref: ${payment.txnId})` : ''}` },
      { label: 'Authorized Collector', value: payment.receivedBy },
    ],
    items: [
      { desc: 'Library Reading Room Access & Desk Subscription (SAC: 999293)', amount: `INR ${taxableAmount.toLocaleString('en-IN')}` },
      { desc: 'Central GST (CGST @ 9%)', amount: `INR ${cgst.toLocaleString('en-IN')}` },
      { desc: 'State GST (SGST @ 9%)', amount: `INR ${sgst.toLocaleString('en-IN')}` },
    ],
    totals: { label: 'TOTAL INVOICE AMOUNT', value: `INR ${totalAmount.toLocaleString('en-IN')}` },
    footer: 'Digitally verified tax invoice generated by Smart Library Cloud Treasury. Thank you for studying with us!',
  });

  downloadPdfBlob(blob, `invoice-${invoiceNumber}.pdf`);
}

export function downloadPaymentReceiptPdf(payment: AdminFinancePayment): void {
  const blob = buildSimplePdfBlob({
    title: 'SMART LIBRARY NETWORK - OFFICIAL RECEIPT',
    subtitle: `Branch: ${payment.branch ?? 'Downtown Central'} | Study Desk & Membership`,
    themeColor: [0.02, 0.47, 0.34], // Emerald theme
    meta: [
      { label: 'Receipt Number', value: payment.receiptNumber },
      { label: 'Payment Date', value: payment.date },
      { label: 'Student Name', value: payment.studentName },
      { label: 'Smart ID', value: payment.smartId },
      { label: 'Payment Mode', value: payment.mode.toUpperCase() },
      { label: 'Transaction Reference', value: payment.txnId || 'Cash Counter Entry' },
      { label: 'Received By', value: payment.receivedBy },
      { label: 'Status', value: 'PAID & VERIFIED' },
    ],
    items: [
      { desc: 'Library Desk & Study Room Access Subscription', amount: `INR ${payment.amount.toLocaleString('en-IN')}` },
      ...(payment.lateFee && payment.lateFee > 0
        ? [{ desc: 'Late Payment Fee Assessment', amount: `INR ${payment.lateFee.toLocaleString('en-IN')}` }]
        : []),
    ],
    totals: { label: 'TOTAL AMOUNT PAID', value: `INR ${payment.amount.toLocaleString('en-IN')}` },
    footer: 'This is an electronically generated receipt verified by Smart Library Treasury. No signature required.',
  });

  downloadPdfBlob(blob, `receipt-${payment.receiptNumber}.pdf`);
}

export function downloadRefundVoucherPdf(refund: AdminFinanceRefund): void {
  const blob = buildSimplePdfBlob({
    title: 'SMART LIBRARY - SECURITY DEPOSIT REFUND VOUCHER',
    subtitle: `Branch: ${refund.branchName ?? 'Downtown Central'} | Treasury Clearance Division`,
    themeColor: [0.05, 0.4, 0.3], // Dark teal theme
    meta: [
      { label: 'Voucher Ref ID', value: String(refund.id) },
      { label: 'Student Name', value: refund.studentName },
      { label: 'Student Smart ID', value: refund.smartId },
      { label: 'Exit Clearance Date', value: refund.exitDate ?? 'Current Session' },
      { label: 'Refund Status', value: refund.status.toUpperCase() },
      { label: 'Disbursement Method', value: refund.paymentMethod ?? 'Direct UPI / Bank Transfer' },
    ],
    items: [
      { desc: 'Caution / Security Deposit Held on Admission', amount: `INR ${refund.depositHeld.toLocaleString('en-IN')}` },
      {
        desc: refund.deductionAmount > 0
          ? `Deductions (Damages/Dues): ${refund.rejectionReason ?? 'Key/Book/Asset recovery'}`
          : 'Deductions (Damages / Key / Asset Dues)',
        amount: refund.deductionAmount > 0 ? `-INR ${refund.deductionAmount.toLocaleString('en-IN')}` : 'INR 0',
      },
    ],
    totals: { label: 'NET REFUND DISBURSED', value: `INR ${refund.netRefund.toLocaleString('en-IN')}` },
    footer: 'Clearance Voucher verified by Library Manager. Subject to desk handover & key return audit.',
  });

  downloadPdfBlob(blob, `refund-voucher-${refund.id}.pdf`);
}
