'use client';

interface Props {
  method: string;
  setMethod: (v: string) => void;
  status: 'Paid' | 'Pending' | 'Overdue';
  setStatus: (v: 'Paid' | 'Pending' | 'Overdue') => void;
  billingCycle: 'Monthly' | 'Annual';
  setBillingCycle: (v: 'Monthly' | 'Annual') => void;
}

export default function SuperadminBillingCreateInvoicePaymentControls({
  method,
  setMethod,
  status,
  setStatus,
  billingCycle,
  setBillingCycle,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div>
        <label className="block font-semibold text-secondary mb-1">Payment Method</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full rounded-xl border border-border bg-input px-3 py-2 text-primary cursor-pointer"
        >
          <option value="UPI">UPI (GooglePay / PhonePe)</option>
          <option value="Card">Credit / Debit Card</option>
          <option value="NetBanking">Net Banking</option>
          <option value="Bank Transfer">Direct NEFT/RTGS</option>
        </select>
      </div>
      <div>
        <label className="block font-semibold text-secondary mb-1">Invoice Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as 'Paid' | 'Pending' | 'Overdue')}
          className="w-full rounded-xl border border-border bg-input px-3 py-2 text-primary cursor-pointer"
        >
          <option value="Paid">Paid</option>
          <option value="Pending">Pending Verification</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>
      <div>
        <label className="block font-semibold text-secondary mb-1">Billing Cadence</label>
        <select
          value={billingCycle}
          onChange={(e) => setBillingCycle(e.target.value as 'Monthly' | 'Annual')}
          className="w-full rounded-xl border border-border bg-input px-3 py-2 text-primary cursor-pointer"
        >
          <option value="Monthly">Monthly</option>
          <option value="Annual">Annual Pre-paid</option>
        </select>
      </div>
    </div>
  );
}
