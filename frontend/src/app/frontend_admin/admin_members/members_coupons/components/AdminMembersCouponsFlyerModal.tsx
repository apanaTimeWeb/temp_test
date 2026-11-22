'use client';
// RESPONSIBILITY: Printable Coupon Flyers & Vouchers modal for marketing campaigns.

import type { AdminCouponsCoupon } from '@/app/frontend_admin/admin_members/members_coupons/schemas/AdminMembersCouponsSchema';
import { Building2,Calendar,Check,Copy,Printer,Scissors,Sparkles,Tag,X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export interface AdminMembersCouponsFlyerModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupons: readonly AdminCouponsCoupon[];
}

export default function AdminMembersCouponsFlyerModal({
  isOpen,
  onClose,
  coupons,
}: AdminMembersCouponsFlyerModalProps) {
  const [filterActiveOnly, setFilterActiveOnly] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const displayCoupons = coupons.filter((c) => !filterActiveOnly || c.status === 'Active');

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied code ${code} to clipboard`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const printFlyers = () => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=950,height=800');
    if (!printWindow) {
      window.print();
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Smart Library - Printable Promotional Coupon Flyers</title>
          <style>
            @page { size: portrait; margin: 12mm; }
            * { box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; margin: 0; padding: 10px; background: #fff; }
            .print-header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
            .print-title { font-size: 20px; font-weight: 800; color: #4338ca; text-transform: uppercase; letter-spacing: 1px; }
            .print-subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
            .flyers-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
            .voucher { border: 2px dashed #a5b4fc; border-radius: 12px; padding: 16px; position: relative; background: #faf5ff; page-break-inside: avoid; }
            .voucher-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e0e7ff; padding-bottom: 8px; margin-bottom: 12px; }
            .brand-name { font-size: 11px; font-weight: 800; color: #4338ca; text-transform: uppercase; letter-spacing: 0.5px; }
            .branch-badge { font-size: 9px; font-weight: 700; background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 9999px; }
            .discount-amount { font-size: 26px; font-weight: 900; color: #312e81; text-align: center; margin: 8px 0; }
            .discount-type { font-size: 11px; font-weight: 700; color: #6366f1; text-transform: uppercase; letter-spacing: 0.5px; }
            .code-box { background: #fff; border: 2px solid #4338ca; border-radius: 8px; padding: 8px; text-align: center; font-family: monospace; font-size: 18px; font-weight: 800; color: #312e81; letter-spacing: 3px; margin: 10px 0; }
            .voucher-footer { display: flex; justify-content: space-between; align-items: flex-end; font-size: 9px; color: #64748b; border-top: 1px solid #e0e7ff; padding-top: 8px; margin-top: 10px; }
            .terms { font-size: 8px; color: #94a3b8; line-height: 1.3; }
            .cut-notice { text-align: center; font-size: 9px; color: #94a3b8; margin-top: 4px; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <div class="print-title">Smart Library Network · Promotional Voucher Sheets</div>
            <div class="print-subtitle">Official Student Discount Flyers · Cut along dashed lines to distribute</div>
          </div>
          <div class="flyers-grid">
            ${displayCoupons.map((c) => `
              <div class="voucher">
                <div class="voucher-header">
                  <span class="brand-name">★ Smart Library Network</span>
                  <span class="branch-badge">${c.branchApplicability || 'All Branches'}</span>
                </div>
                <div style="text-align: center;">
                  <div class="discount-type">Special Admission Offer</div>
                  <div class="discount-amount">${c.type === 'Percent' ? `${c.discount}% OFF` : `₹${c.discount} FLAT OFF`}</div>
                </div>
                <div class="code-box">${c.code}</div>
                <div class="voucher-footer">
                  <div class="terms">
                    • Valid on study desk plans<br>
                    • Present at front desk registration<br>
                    • Valid until: ${c.expiry || 'End of Month'}
                  </div>
                  <div style="text-align: right; font-weight: 700; color: #4338ca;">
                    Verified Pass<br>
                    <span style="font-size: 7px; color: #94a3b8;">SLN-PROM-2026</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="cut-notice" style="margin-top: 20px;">✂ - - - Cut each voucher card along the borders for desk handout distribution - - - ✂</div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/70 overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-6 py-4.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Promotional Coupon Flyers & Handout Cards</h2>
              <p className="text-xs text-slate-400">Generate, review, and print physical discount vouchers for student admissions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={printFlyers}
              className="inline-flex min-h-9 items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-purple-500/25 hover:from-purple-600 hover:to-indigo-700 transition-all"
            >
              <Printer size={14} />
              <span>Print Flyers Sheet</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
              title="Close modal"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* CONTROLS STRIP */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-950/40 px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Displaying: <strong className="text-white">{displayCoupons.length} vouchers</strong></span>
            <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={filterActiveOnly}
                onChange={(e) => setFilterActiveOnly(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-purple-500 focus:ring-purple-400"
              />
              <span>Active coupons only</span>
            </label>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Scissors size={13} className="text-purple-400" />
            <span>Formatted for A4 sheet printing with border cut marks</span>
          </div>
        </div>

        {/* FLYER CARDS GRID */}
        <div className="flex-1 overflow-y-auto p-6">
          {displayCoupons.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Tag size={36} className="mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-white">No coupons match the selected filter</p>
              <p className="text-xs mt-1">Uncheck "Active coupons only" to view archived or expired vouchers</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="relative rounded-2xl border-2 border-dashed border-purple-500/40 bg-gradient-to-br from-slate-900/95 via-purple-950/20 to-slate-900/90 p-5 shadow-xl hover:border-purple-500/70 transition-all flex flex-col justify-between"
                >
                  {/* Top Branding & Branch */}
                  <div>
                    <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-3">
                      <span className="text-[11px] font-bold tracking-wider text-purple-400 uppercase flex items-center gap-1">
                        <Sparkles size={11} className="text-purple-400" /> Smart Library
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold text-purple-300">
                        <Building2 size={10} />
                        {coupon.branchApplicability || 'All Branches'}
                      </span>
                    </div>

                    {/* Offer Headline */}
                    <div className="text-center my-3">
                      <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Special Admission Discount</span>
                      <div className="text-3xl font-extrabold tracking-tight text-white mt-1">
                        {coupon.type === 'Percent' ? `${coupon.discount}% OFF` : `₹${coupon.discount} FLAT`}
                      </div>
                    </div>

                    {/* Monospace Code Pill */}
                    <div className="relative my-3">
                      <div className="flex items-center justify-between rounded-xl border border-indigo-500/40 bg-indigo-500/10 p-2.5 px-3">
                        <span className="font-mono text-base font-extrabold tracking-widest text-indigo-300">
                          {coupon.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyCode(coupon.code)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/20 text-indigo-300 hover:text-white hover:bg-indigo-500/40 transition-colors"
                          title="Copy coupon code"
                        >
                          {copiedCode === coupon.code ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Fine Print / Footer */}
                  <div className="border-t border-slate-800/80 pt-3 mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Calendar size={11} className="text-slate-500" />
                      <span>Valid till: <strong className="text-slate-300">{coupon.expiry || 'End of Month'}</strong></span>
                    </div>
                    <span className="font-mono text-[9px] text-slate-500">AUTOPASS</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between border-t border-slate-800/80 bg-slate-900/90 px-6 py-3.5 text-xs text-slate-400">
          <span>Ready to print high-resolution vouchers for front desk flyers & campus distribution</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-1.5 font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
