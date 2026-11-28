import type { AdminCouponsCoupon } from '@/app/frontend_admin/admin_members/members_coupons/schemas/AdminMembersCouponsSchema';
import { escapeCouponHtml } from '@/app/frontend_admin/admin_members/members_coupons/utils/adminMembersCouponsCsvExcel';

const ROSTER_STYLE = `
  @page { size: landscape; margin: 10mm; }
  body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #7e22ce; padding-bottom: 10px; margin-bottom: 12px; }
  .title { font-size: 18px; font-weight: 800; text-transform: uppercase; color: #7e22ce; letter-spacing: 0.5px; }
  .subtitle { font-size: 12px; color: #64748b; margin-top: 2px; } .meta { font-size: 11px; text-align: right; color: #475569; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  th { background-color: #f3e8ff; color: #6b21a8; text-align: left; padding: 6px; border: 1px solid #e9d5ff; font-weight: 700; text-transform: uppercase; font-size: 10px; }
  td { padding: 6px; border: 1px solid #e2e8f0; } tr:nth-child(even) { background-color: #faf5ff; }
  .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 600; text-transform: uppercase; }
  .badge-active { background: #dcfce7; color: #15803d; } .badge-expired { background: #fee2e2; color: #b91c1c; } .badge-disabled { background: #f1f5f9; color: #475569; }
  .footer { margin-top: 14px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 6px; }
`;

const FLYER_STYLE = `
  @page { size: portrait; margin: 12mm; } * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; margin: 0; padding: 10px; background: #fff; }
  .print-header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
  .print-title { font-size: 20px; font-weight: 800; color: #4338ca; text-transform: uppercase; letter-spacing: 1px; }
  .print-subtitle { font-size: 12px; color: #64748b; margin-top: 4px; } .flyers-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .voucher { border: 2px dashed #a5b4fc; border-radius: 12px; padding: 16px; position: relative; background: #faf5ff; page-break-inside: avoid; }
  .voucher-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e0e7ff; padding-bottom: 8px; margin-bottom: 12px; }
  .brand-name { font-size: 11px; font-weight: 800; color: #4338ca; text-transform: uppercase; letter-spacing: 0.5px; }
  .branch-badge { font-size: 9px; font-weight: 700; background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 9999px; }
  .discount-amount { font-size: 26px; font-weight: 900; color: #312e81; text-align: center; margin: 8px 0; }
  .discount-type { font-size: 11px; font-weight: 700; color: #6366f1; text-transform: uppercase; letter-spacing: 0.5px; }
  .code-box { background: #fff; border: 2px solid #4338ca; border-radius: 8px; padding: 8px; text-align: center; font-family: monospace; font-size: 18px; font-weight: 800; color: #312e81; letter-spacing: 3px; margin: 10px 0; }
  .voucher-footer { display: flex; justify-content: space-between; align-items: flex-end; font-size: 9px; color: #64748b; border-top: 1px solid #e0e7ff; padding-top: 8px; margin-top: 10px; }
  .terms { font-size: 8px; color: #94a3b8; line-height: 1.3; } .cut-notice { text-align: center; font-size: 9px; color: #94a3b8; margin-top: 4px; }
  @media print { .no-print { display: none; } }
`;

export function printCouponsRosterHtml(filteredCoupons: readonly AdminCouponsCoupon[]): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=900,height=700,noopener,noreferrer');
  if (!printWindow) { window.print(); return; }
  printWindow.opener = null;
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const html = `
    <!DOCTYPE html><html><head><title>Smart Library - Promotional Coupons & Discounts</title><style>${ROSTER_STYLE}</style></head>
      <body>
        <div class="header"><div><div class="title">Smart Library Network · Promotional Coupons Registry</div><div class="subtitle">Discounts & Referral Codes · Total Coupons: ${filteredCoupons.length}</div></div>
        <div class="meta"><div><strong>Generated:</strong> ${dateStr}</div><div><strong>Scope:</strong> Admin Authorized View</div></div></div>
        <table><thead><tr><th>Coupon Code</th><th>Discount</th><th>Type</th><th>Valid Until</th><th>Max Uses</th><th>Redeemed</th><th>Branch</th><th>Status</th></tr></thead>
          <tbody>${filteredCoupons.map((c) => `<tr><td><strong style="font-family:monospace; color:#6b21a8;">${escapeCouponHtml(c.code)}</strong></td><td>${c.type === 'Percent' ? `${c.discount}%` : `₹${c.discount}`}</td><td>${escapeCouponHtml(c.type)}</td><td>${escapeCouponHtml(c.expiry || '—')}</td><td>${c.maxUses ?? 'Unlimited'}</td><td>${c.usedCount ?? 0}</td><td>${escapeCouponHtml(c.branchApplicability || 'All Branches')}</td><td><span class="badge badge-${(c.status || 'Active').toLowerCase()}">${escapeCouponHtml(c.status || 'Active')}</span></td></tr>`).join('')}</tbody>
        </table>
        <div class="footer"><span>Smart Library Marketing & Promotions</span><span>Page 1 of 1</span></div>
        <script>window.onload = function() { window.print(); };</script>
      </body></html>
  `;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

export function printCouponFlyersHtml(displayCoupons: readonly AdminCouponsCoupon[]): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=950,height=800,noopener,noreferrer');
  if (!printWindow) { window.print(); return; }
  printWindow.opener = null;
  const html = `
    <!DOCTYPE html><html><head><title>Smart Library - Printable Promotional Coupon Flyers</title><style>${FLYER_STYLE}</style></head>
      <body>
        <div class="print-header"><div class="print-title">Smart Library Network · Promotional Voucher Sheets</div><div class="print-subtitle">Official Student Discount Flyers · Cut along dashed lines to distribute</div></div>
        <div class="flyers-grid">${displayCoupons.map((c) => `
          <div class="voucher">
            <div class="voucher-header"><span class="brand-name">★ Smart Library Network</span><span class="branch-badge">${escapeCouponHtml(c.branchApplicability || 'All Branches')}</span></div>
            <div style="text-align: center;"><div class="discount-type">Special Admission Offer</div><div class="discount-amount">${c.type === 'Percent' ? `${c.discount}% OFF` : `₹${c.discount} FLAT OFF`}</div></div>
            <div class="code-box">${escapeCouponHtml(c.code)}</div>
            <div class="voucher-footer"><div class="terms">• Valid on study desk plans<br>• Present at front desk registration<br>• Valid until: ${escapeCouponHtml(c.expiry || 'End of Month')}</div><div style="text-align: right; font-weight: 700; color: #4338ca;">Verified Pass<br><span style="font-size: 7px; color: #94a3b8;">SLN-PROM-2026</span></div></div>
          </div>`).join('')}</div>
        <div class="cut-notice" style="margin-top: 20px;">✂ - - - Cut each voucher card along the borders for desk handout distribution - - - ✂</div>
        <script>window.onload = function() { window.print(); };</script>
      </body></html>
  `;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
