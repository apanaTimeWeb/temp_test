import type { SuperadminBillingInvoiceSample } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/types/SuperadminBillingInvoicesTypes';

export function generateSuperadminInvoicePrintHtml(invoice: SuperadminBillingInvoiceSample): string {
  const isPaid = invoice.status === 'Paid';
  const subtotal = invoice.subtotal ?? (invoice.amount ? Math.round(invoice.amount / 1.18) : 2999);
  const totalTax = invoice.amount ? invoice.amount - subtotal : Math.round(subtotal * 0.18);
  const isIntraState = Boolean(invoice.cgst && invoice.sgst);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Tax Invoice - #${invoice.id}</title>
        <style>
          @page { size: portrait; margin: 12mm 10mm; }
          * { box-sizing: border-box; }
          body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; margin: 0; padding: 15px; font-size: 9pt; line-height: 1.4; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #312e81; padding-bottom: 12px; margin-bottom: 12px; }
          .company-name { font-size: 16px; font-weight: 800; color: #312e81; }
          .muted { color: #64748b; font-size: 8.5pt; }
          .grid-2 { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 16px; }
          .box { flex: 1; padding: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; }
          .box-title { font-size: 8pt; font-weight: 700; text-transform: uppercase; color: #475569; margin-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; font-size: 8.5pt; margin-bottom: 14px; }
          th { background: #f1f5f9; color: #0f172a; padding: 6px 8px; border: 1px solid #cbd5e1; text-align: left; font-size: 8pt; text-transform: uppercase; }
          td { padding: 6px 8px; border: 1px solid #e2e8f0; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .totals-table { width: 280px; margin-left: auto; border-collapse: collapse; }
          .totals-table td { padding: 4px 8px; border: none; }
          .totals-table tr.grand-total td { font-size: 11pt; font-weight: 800; border-top: 2px solid #312e81; color: #312e81; }
          .footer { margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 8px; font-size: 8pt; color: #94a3b8; display: flex; justify-content: space-between; }
          .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 8pt; text-transform: uppercase; }
          .badge-paid { background: #dcfce7; color: #15803d; }
          .badge-due { background: #fee2e2; color: #b91c1c; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="company-name">SMART LIBRARY SAAS PLATFORM</div>
            <div class="muted">Cloud Library ERP & Management Solutions</div>
            <div class="muted">GSTIN: 07AAACS9988D1Z2 · SAC: 998313 (IT SaaS Provisioning)</div>
          </div>
          <div class="text-right">
            <div style="font-size: 14px; font-weight: 800; color: #0f172a;">TAX INVOICE #${invoice.id}</div>
            <div class="muted">Date: <strong>${invoice.date}</strong></div>
            <div class="muted">Due Date: <strong>${invoice.dueDate || 'Upon Receipt'}</strong></div>
            <div style="margin-top: 4px;"><span class="badge ${isPaid ? 'badge-paid' : 'badge-due'}">${invoice.status}</span></div>
          </div>
        </div>

        <div class="grid-2">
          <div class="box">
            <div class="box-title">Billed To (Customer)</div>
            <div style="font-weight: 700; font-size: 10pt;">${invoice.tenant}</div>
            ${invoice.legalName ? `<div>${invoice.legalName}</div>` : ''}
            <div class="muted">${invoice.billingAddress || 'Central Premises'}</div>
            <div class="muted">${invoice.cityStatePin || 'India'}</div>
          </div>
          <div class="box">
            <div class="box-title">Tax & Payment Profile</div>
            <div><strong>GSTIN:</strong> ${invoice.gst || 'URP / Not Registered'}</div>
            <div><strong>Contact:</strong> ${invoice.contact || 'Account Admin'}</div>
            <div class="muted"><strong>Email:</strong> ${invoice.email || 'billing@customer.com'}</div>
            <div class="muted"><strong>Payment Mode:</strong> ${invoice.method || 'Online'} (${invoice.gateway || 'Razorpay'})</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item & Description</th>
              <th class="text-center" style="width: 14%;">SAC Code</th>
              <th class="text-center" style="width: 10%;">Qty</th>
              <th class="text-right" style="width: 18%;">Rate</th>
              <th class="text-right" style="width: 20%;">Taxable Amount</th>
            </tr>
          </thead>
          <tbody>
            ${(invoice.items || [{ description: invoice.planName || 'Platform SaaS Subscription', quantity: 1, rate: subtotal, amount: subtotal, sacCode: '998313' }]).map((item) => `
              <tr>
                <td><strong>${item.description}</strong></td>
                <td class="text-center">${item.sacCode || '998313'}</td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-right">₹${item.rate.toLocaleString('en-IN')}</td>
                <td class="text-right"><strong>₹${item.amount.toLocaleString('en-IN')}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <table class="totals-table">
          <tr>
            <td>Subtotal:</td>
            <td class="text-right">₹${subtotal.toLocaleString('en-IN')}</td>
          </tr>
          ${isIntraState ? `
            <tr>
              <td>CGST (9%):</td>
              <td class="text-right">₹${(invoice.cgst ?? Math.round(totalTax / 2)).toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td>SGST (9%):</td>
              <td class="text-right">₹${(invoice.sgst ?? Math.round(totalTax / 2)).toLocaleString('en-IN')}</td>
            </tr>
          ` : `
            <tr>
              <td>IGST (18%):</td>
              <td class="text-right">₹${(invoice.igst ?? totalTax).toLocaleString('en-IN')}</td>
            </tr>
          `}
          <tr class="grand-total">
            <td>Total Amount:</td>
            <td class="text-right">₹${invoice.amount.toLocaleString('en-IN')}</td>
          </tr>
        </table>

        <div class="footer">
          <span>Computer Generated Invoice · Valid without Physical Signature</span>
          <span>Page 1 of 1</span>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `;
}
