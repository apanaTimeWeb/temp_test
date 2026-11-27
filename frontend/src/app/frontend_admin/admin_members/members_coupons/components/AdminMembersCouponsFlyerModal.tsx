'use client';
// RESPONSIBILITY: Printable Coupon Flyers & Vouchers modal for marketing campaigns.

import type { AdminCouponsCoupon } from '@/app/frontend_admin/admin_members/members_coupons/schemas/AdminMembersCouponsSchema';
import { printCouponFlyersHtml } from '@/app/frontend_admin/admin_members/members_coupons/utils/adminMembersCouponsExports';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { Building2, Calendar, Check, Copy, Printer, Scissors, Tag, X } from 'lucide-react';
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

  const displayCoupons = coupons.filter((c) => !filterActiveOnly || c.status === 'Active');

  const copyCode = (code: string) => {
    void navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied code ${code} to clipboard`, { id: 'admin-coupons-copy-code' });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl border border-border bg-overlay shadow-dialog overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-purple-bg text-purple">
              <Tag size={20} aria-hidden="true" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
                Promotional Coupon Flyers & Handout Cards
              </DialogTitle>
              <p className="text-xs text-text-secondary">
                Generate, review, and print physical discount vouchers for student admissions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => printCouponFlyersHtml(displayCoupons)}
              className="inline-flex min-h-9 items-center gap-2 rounded-xl bg-primary px-4 py-1.5 text-xs font-semibold text-on-primary shadow-card hover:bg-primary-hover motion-safe:transition-colors"
            >
              <Printer size={14} aria-hidden="true" />
              <span>Print Flyers Sheet</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors ml-1"
              title="Close modal"
              aria-label="Close flyer modal"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface-highlight px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-secondary">
              Displaying: <strong className="text-text-primary">{displayCoupons.length} vouchers</strong>
            </span>
            <label className="inline-flex items-center gap-2 text-xs text-text-primary cursor-pointer">
              <input
                type="checkbox"
                checked={filterActiveOnly}
                onChange={(e) => setFilterActiveOnly(e.target.checked)}
                className="rounded border-border bg-input accent-primary"
              />
              <span>Active coupons only</span>
            </label>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-text-secondary">
            <Scissors size={13} className="text-purple" aria-hidden="true" />
            <span>Formatted for A4 sheet printing with border cut marks</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {displayCoupons.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              <Tag size={36} className="mx-auto text-text-disabled mb-2" aria-hidden="true" />
              <p className="text-sm font-semibold text-text-primary">No coupons match the selected filter</p>
              <p className="text-xs mt-1">Uncheck &ldquo;Active coupons only&rdquo; to view archived or expired vouchers</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="relative rounded-2xl border-2 border-dashed border-border-focus bg-card p-5 shadow-card hover:border-primary motion-safe:transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 border-b border-border pb-3 mb-3">
                      <span className="text-[11px] font-bold tracking-wider text-purple uppercase flex items-center gap-1">
                        <Tag size={11} aria-hidden="true" /> Smart Library
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-purple-bg px-2 py-0.5 text-[10px] font-semibold text-purple">
                        <Building2 size={10} aria-hidden="true" />
                        {coupon.branchApplicability || 'All Branches'}
                      </span>
                    </div>

                    <div className="text-center my-3">
                      <span className="text-[10px] font-semibold tracking-wider text-text-secondary uppercase">
                        Special Admission Discount
                      </span>
                      <div className="text-3xl font-extrabold tracking-tight text-text-primary mt-1">
                        {coupon.type === 'Percent' ? `${coupon.discount}% OFF` : `₹${coupon.discount} FLAT`}
                      </div>
                    </div>

                    <div className="relative my-3">
                      <div className="flex items-center justify-between rounded-xl border border-border-focus bg-primary-subtle p-2.5 px-3">
                        <span className="font-mono text-base font-extrabold tracking-widest text-primary">
                          {coupon.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyCode(coupon.code)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border-focus bg-card text-primary hover:bg-surface-hover motion-safe:transition-colors"
                          title="Copy coupon code"
                          aria-label={`Copy ${coupon.code}`}
                        >
                          {copiedCode === coupon.code ? (
                            <Check size={13} className="text-success-text" aria-hidden="true" />
                          ) : (
                            <Copy size={13} aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-3 mt-2 text-[10px] text-text-secondary flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Calendar size={11} aria-hidden="true" />
                      <span>
                        Valid till: <strong className="text-text-primary">{coupon.expiry || 'End of Month'}</strong>
                      </span>
                    </div>
                    <span className="font-mono text-[9px] text-text-secondary">AUTOPASS</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border bg-card px-6 py-3.5 text-xs text-text-secondary">
          <span>Ready to print high-resolution vouchers for front desk flyers & campus distribution</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border bg-surface-highlight px-4 py-1.5 font-semibold text-text-primary hover:bg-surface-hover motion-safe:transition-colors"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
