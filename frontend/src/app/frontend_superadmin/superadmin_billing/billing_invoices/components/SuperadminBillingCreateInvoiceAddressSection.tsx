'use client';

interface SuperadminBillingCreateInvoiceAddressSectionProps {
  legalName: string;
  setLegalName: (v: string) => void;
  gst: string;
  setGst: (v: string) => void;
  billingAddress: string;
  setBillingAddress: (v: string) => void;
  cityStatePin: string;
  setCityStatePin: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
}

export default function SuperadminBillingCreateInvoiceAddressSection({
  legalName,
  setLegalName,
  gst,
  setGst,
  billingAddress,
  setBillingAddress,
  cityStatePin,
  setCityStatePin,
  email,
  setEmail,
  phone,
  setPhone,
}: SuperadminBillingCreateInvoiceAddressSectionProps) {
  return (
    <>
      {/* Legal Business Name & GSTIN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-semibold text-slate-300 mb-1">Legal / Registered Entity Name</label>
          <input maxLength={100}
            type="text"
            placeholder="e.g. Apex Knowledge Systems Pvt Ltd"
            value={legalName}
            onChange={(e) => setLegalName(e.target.value)}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block font-semibold text-slate-300 mb-1">GSTIN (15-Digit Format)</label>
          <input
            type="text"
            placeholder="e.g. 27AABCT3518Q1ZV"
            maxLength={15}
            value={gst}
            onChange={(e) => setGst(e.target.value.toUpperCase())}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-2 text-slate-100 uppercase font-mono focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Billing Address */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-semibold text-slate-300 mb-1">Billing Street Address</label>
          <input maxLength={250}
            type="text"
            placeholder="e.g. Plot 15, Knowledge Park"
            value={billingAddress}
            onChange={(e) => setBillingAddress(e.target.value)}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block font-semibold text-slate-300 mb-1">City, State & PIN</label>
          <input maxLength={100}
            type="text"
            placeholder="e.g. Lucknow, Uttar Pradesh - 226001"
            value={cityStatePin}
            onChange={(e) => setCityStatePin(e.target.value)}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-semibold text-slate-300 mb-1">Billing Contact Email</label>
          <input maxLength={254}
            type="email"
            placeholder="e.g. accounts@library.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block font-semibold text-slate-300 mb-1">Billing Contact Phone</label>
          <input maxLength={15}
            type="tel"
            placeholder="e.g. +91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-indigo-500"
          />
        </div>
      </div>
    </>
  );
}
