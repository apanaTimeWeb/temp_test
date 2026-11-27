'use client';

function escapePdfString(str: unknown): string {
  return String(str ?? '')
    .replaceAll('\\', '\\\\')
    .replaceAll('(', '\\(')
    .replaceAll(')', '\\)');
}

export interface AdminFinancePaymentsPdfMeta {
  label: string;
  value: string;
}

export interface AdminFinancePaymentsPdfLineItem {
  desc: string;
  amount: string;
}

export interface AdminFinancePaymentsPdfSpec {
  title: string;
  subtitle: string;
  meta: AdminFinancePaymentsPdfMeta[];
  items: AdminFinancePaymentsPdfLineItem[];
  totals: { label: string; value: string };
  footer: string;
  themeColor?: [number, number, number];
}

export function buildSimplePdfBlob(spec: AdminFinancePaymentsPdfSpec): Blob {
  const [r, g, b] = spec.themeColor ?? [0.02, 0.47, 0.34];
  let stream = `${r} ${g} ${b} rg\n50 760 495 55 re f\n`;
  stream += `1 1 1 rg\nBT\n/F1 15 Tf\n65 792 Td\n(${escapePdfString(spec.title)}) Tj\nET\n`;
  stream += `BT\n/F2 9 Tf\n65 774 Td\n(${escapePdfString(spec.subtitle)}) Tj\nET\n0 0 0 rg\n`;

  let y = 725;
  for (const m of spec.meta) {
    stream += `BT\n/F1 9 Tf\n50 ${y} Td\n(${escapePdfString(m.label)}:) Tj\nET\n`;
    stream += `BT\n/F2 9 Tf\n170 ${y} Td\n(${escapePdfString(m.value)}) Tj\nET\n`;
    y -= 15;
  }

  y -= 8;
  stream += `0.82 0.85 0.88 RG\n50 ${y} m 545 ${y} l S\n`;
  y -= 18;
  stream += `0.94 0.96 0.98 rg\n50 ${y - 4} 495 20 re f\n0.1 0.1 0.1 rg\n`;
  stream += `BT\n/F1 9 Tf\n60 ${y} Td\n(DESCRIPTION / PARTICULARS) Tj\nET\nBT\n/F1 9 Tf\n470 ${y} Td\n(AMOUNT) Tj\nET\n`;
  y -= 18;
  for (const item of spec.items) {
    stream += `BT\n/F2 9 Tf\n60 ${y} Td\n(${escapePdfString(item.desc)}) Tj\nET\nBT\n/F1 9 Tf\n470 ${y} Td\n(${escapePdfString(item.amount)}) Tj\nET\n`;
    y -= 16;
  }

  y -= 12;
  stream += `0.93 0.98 0.95 rg\n330 ${y - 10} 215 32 re f\n${r} ${g} ${b} RG\n330 ${y - 10} 215 32 re S\n`;
  stream += `${r} ${g} ${b} rg\nBT\n/F1 11 Tf\n342 ${y} Td\n(${escapePdfString(spec.totals.label)}: ${escapePdfString(spec.totals.value)}) Tj\nET\n`;
  stream += '0.3 0.3 0.3 RG\n380 90 m 545 90 l S\n0.2 0.2 0.2 rg\nBT\n/F2 8 Tf\n400 76 Td\n(Authorized Accounts Officer) Tj\nET\n';
  stream += `0.45 0.45 0.45 rg\nBT\n/F2 8 Tf\n50 55 Td\n(${escapePdfString(spec.footer)}) Tj\nET\n`;

  const header = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  const offsets: number[] = [];
  let currentOffset = header.length;
  const obj1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  offsets.push(currentOffset); currentOffset += obj1.length;
  const obj2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
  offsets.push(currentOffset); currentOffset += obj2.length;
  const obj3 = '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n';
  offsets.push(currentOffset); currentOffset += obj3.length;
  const obj4 = '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n';
  offsets.push(currentOffset); currentOffset += obj4.length;
  const obj5 = '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';
  offsets.push(currentOffset); currentOffset += obj5.length;
  const streamBytesLen = new TextEncoder().encode(stream).length;
  const obj6 = `6 0 obj\n<< /Length ${streamBytesLen} >>\nstream\n${stream}\nendstream\nendobj\n`;
  offsets.push(currentOffset); currentOffset += obj6.length;

  const startXref = currentOffset;
  let xref = 'xref\n0 7\n0000000000 65535 f \n';
  for (const off of offsets) xref += `${String(off).padStart(10, '0')} 00000 n \n`;
  const trailer = `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;
  return new Blob([new TextEncoder().encode(header + obj1 + obj2 + obj3 + obj4 + obj5 + obj6 + xref + trailer)], { type: 'application/pdf' });
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
  return digits.length === 10 ? `91${digits}` : digits;
}

export function buildWhatsAppLink(phone: string | undefined, message: string): string {
  const cleanPhone = formatCleanPhoneNumber(phone);
  const encodedText = encodeURIComponent(message);
  return cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodedText}` : `https://wa.me/?text=${encodedText}`;
}
