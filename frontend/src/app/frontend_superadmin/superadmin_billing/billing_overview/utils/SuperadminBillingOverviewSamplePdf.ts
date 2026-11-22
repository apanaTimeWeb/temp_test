// FLOW: Feature caller -> superadmin_billing/billing_overview/utils/SuperadminBillingOverviewSamplePdf.ts -> typed local sample input -> generated preview/export output.
/** Responsibility: Superadmin Billing Sample Pdf; provides focused module-owned formatting or pure utility behavior. */
export interface SuperadminBillingSampleInvoicePdfData {
  id: string;
  tenant: string;
  date: string;
  amount: number;
  status: string;
  method: string;
  gst: string;
}

function SuperadminBillingAscii(value: string): string {
  if (/[^\x20-\x7E]/.test(value)) throw new Error('Sample PDF fields must contain printable ASCII only; Unicode PDF fonts are not bundled in this source slice.');
  return value;
}

function SuperadminBillingEscapePdfText(value: string): string {
  return SuperadminBillingAscii(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

/** Creates a sample-only PDF. This minimal Helvetica writer explicitly accepts printable ASCII only; Unicode input is rejected rather than corrupted. 
 * @param data - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 * @example SuperadminBillingCreateSampleInvoicePdf(data) uses the declared inputs to produce the module's canonical output.
 */
export function SuperadminBillingCreateSampleInvoicePdf(data: SuperadminBillingSampleInvoicePdfData): string {
  const lines = [
    'SAMPLE BILLING PREVIEW - NOT A TAX INVOICE',
    'This document contains local demonstration data only.',
    '',
    `Invoice ID: ${data.id}`,
    `Tenant: ${data.tenant}`,
    `Date: ${data.date}`,
    `Amount: ${data.amount}`,
    `Status: ${data.status}`,
    `Method: ${data.method}`,
    `GST field (sample): ${data.gst}`,
    '',
    'Not evidence of a charge, payment, tax liability, or live tenant record.',
  ];
  const content = lines.map((line, index) => {
    const y = 790 - index * 34;
    const fontSize = index === 0 ? 16 : index === 1 ? 10 : 12;
    return `BT /F1 ${fontSize} Tf 48 ${y} Td (${SuperadminBillingEscapePdfText(line)}) Tj ET`;
  }).join('\n');

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((body, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return pdf;
}

/** Downloads a clearly marked sample PDF; this is not a server invoice or tax document. 
 * @param data - Input supplied by the caller under the declared TypeScript contract.
 * @returns No value; this function wires lifecycle behavior for the owning feature.
 * @example SuperadminBillingDownloadSampleInvoicePdf(data) uses the declared inputs to produce the module's canonical output.
 */
export function SuperadminBillingDownloadSampleInvoicePdf(data: SuperadminBillingSampleInvoicePdfData): void {
  const pdf = SuperadminBillingCreateSampleInvoicePdf(data);
  const url = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }));
  const anchor = document.createElement('a');
  const safeInvoiceId = data.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  anchor.href = url;
  anchor.download = `sample_invoice_preview_${safeInvoiceId}.pdf`;
  anchor.hidden = true;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
