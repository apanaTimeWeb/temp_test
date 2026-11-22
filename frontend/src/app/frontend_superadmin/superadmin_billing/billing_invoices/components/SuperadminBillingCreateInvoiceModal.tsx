'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PlusCircle, X, Check, Calculator, Building2 } from 'lucide-react';
import type { SuperadminBillingInvoiceSample } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/types/SuperadminBillingInvoicesTypes';
import { useModalScrollLock } from '@/lib/useModalScrollLock';
import {
  CANONICAL_LIBRARY_TENANTS,
  type LibraryTenantOption,
} from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/constants/SuperadminBillingCanonicalTenants';

export { CANONICAL_LIBRARY_TENANTS, type LibraryTenantOption };

interface SuperadminBillingCreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (invoice: SuperadminBillingInvoiceSample) => void;
  nextInvoiceSequence: number;
}

export default function SuperadminBillingCreateInvoiceModal({
  isOpen,
  onClose,
  onCreate,
  nextInvoiceSequence,
}: SuperadminBillingCreateInvoiceModalProps) {
  const [mounted, setMounted] = useState(false);
  const defaultLib = CANONICAL_LIBRARY_TENANTS[0];

  const [invoiceId, setInvoiceId] = useState(`INV-2026-${String(nextInvoiceSequence).padStart(4, '0')}`);
  const [selectedLibraryOption, setSelectedLibraryOption] = useState<string>(defaultLib.name);
  const [tenant, setTenant] = useState(defaultLib.name);
  const [legalName, setLegalName] = useState(defaultLib.legalName);
  const [billingAddress, setBillingAddress] = useState(defaultLib.billingAddress);
  const [cityStatePin, setCityStatePin] = useState(defaultLib.cityStatePin);
  const [gst, setGst] = useState(defaultLib.gst);
  const [taxType, setTaxType] = useState<'intra' | 'inter'>(defaultLib.defaultTaxType);
  const [subtotal, setSubtotal] = useState(15000);
  const [discount, setDiscount] = useState(0);
  const [method, setMethod] = useState('UPI');
  const [status, setStatus] = useState<'Paid' | 'Pending' | 'Overdue'>('Paid');
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Annual'>('Annual');
  const [email, setEmail] = useState(defaultLib.email);
  const [phone, setPhone] = useState(defaultLib.phone);

  useEffect(() => {
    setMounted(true);
  }, []);

  useModalScrollLock(Boolean(isOpen && mounted));

  // Sync sequence id when nextInvoiceSequence changes
  useEffect(() => {
    setInvoiceId(`INV-2026-${String(nextInvoiceSequence).padStart(4, '0')}`);
  }, [nextInvoiceSequence]);

  const handleLibraryChange = (selectedName: string) => {
    setSelectedLibraryOption(selectedName);
    if (selectedName === '__custom__') {
      setTenant('');
      setLegalName('');
      setGst('');
      setBillingAddress('');
      setCityStatePin('');
      setEmail('');
      setPhone('');
    } else {
      const match = CANONICAL_LIBRARY_TENANTS.find((lib) => lib.name === selectedName);
      if (match) {
        setTenant(match.name);
        setLegalName(match.legalName);
        setGst(match.gst);
        setBillingAddress(match.billingAddress);
        setCityStatePin(match.cityStatePin);
        setEmail(match.email);
        setPhone(match.phone);
        setTaxType(match.defaultTaxType);
      }
    }
  };

  if (!isOpen || !mounted) return null;

  const taxableAmount = Math.max(0, subtotal - discount);
  const cgst = taxType === 'intra' ? Math.round(taxableAmount * 0.09) : 0;
  const sgst = taxType === 'intra' ? Math.round(taxableAmount * 0.09) : 0;
  const igst = taxType === 'inter' ? Math.round(taxableAmount * 0.18) : 0;
  const totalAmount = taxableAmount + cgst + sgst + igst;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant.trim()) return;

    const newInvoice: SuperadminBillingInvoiceSample = {
      id: invoiceId.trim(),
      tenant: tenant.trim(),
      legalName: legalName.trim() || tenant.trim(),
      billingAddress: billingAddress.trim() || 'Central Office',
      cityStatePin: cityStatePin.trim() || 'New Delhi - 110001',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      dueDate: new Date(Date.now() + 10 * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      amount: totalAmount,
      subtotal,
      discount,
      cgst: cgst > 0 ? cgst : undefined,
      sgst: sgst > 0 ? sgst : undefined,
      igst: igst > 0 ? igst : undefined,
      status,
      method,
      gateway: method === 'Card' ? 'Stripe' : 'Razorpay',
      gst: gst.trim() || '09AAATC1234F1Z5',
      email: email.trim() || 'billing@library.org',
      phone: phone.trim() || '+91 98765 43210',
      contact: 'Finance Manager',
      planName: `${billingCycle} Platform SaaS Subscription`,
      billingCycle,
      webhookVerified: true,
      items: [
        {
          description: `Platform SaaS Subscription (${billingCycle})`,
          quantity: 1,
          rate: subtotal,
          amount: subtotal,
          sacCode: '998313',
        },
      ],
    };

    onCreate(newInvoice);
    onClose();
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl border border-indigo-500/30 bg-[#0c0f28] p-5 sm:p-6 shadow-2xl space-y-4"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
          <div className="flex items-center gap-2">
            <PlusCircle size={20} className="text-indigo-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100">Create Platform Tax Invoice</h2>
              <p className="text-[11px] text-slate-400">Generate GST-compliant SaaS invoice with automated tax calculations</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Invoice ID & Tenant / Library Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Invoice Number (Sequential)
              </label>
              <input
                type="text"
                required
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
                <Building2 size={12} className="text-indigo-400" />
                <span>Tenant / Library *</span>
              </label>
              <select
                value={selectedLibraryOption}
                onChange={(e) => handleLibraryChange(e.target.value)}
                data-testid="superadmin-billing-create-invoice-tenant-select"
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/90 px-3 py-2 text-slate-100 focus:border-indigo-500 cursor-pointer"
              >
                {CANONICAL_LIBRARY_TENANTS.map((lib) => (
                  <option key={lib.name} value={lib.name}>
                    {lib.name} ({lib.cityStatePin.split(',')[0]})
                  </option>
                ))}
                <option value="__custom__">➕ Other / Custom Library...</option>
              </select>
            </div>
          </div>

          {/* Custom Tenant Name Input (if custom selected) */}
          {selectedLibraryOption === '__custom__' && (
            <div className="p-3 rounded-xl border border-indigo-500/20 bg-indigo-950/20">
              <label className="block font-semibold text-indigo-300 mb-1">
                Custom Library Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Knowledge Lounge"
                value={tenant}
                onChange={(e) => setTenant(e.target.value)}
                data-testid="superadmin-billing-create-invoice-custom-tenant-input"
                className="w-full rounded-xl border border-indigo-500/35 bg-slate-900/80 px-3 py-2 text-slate-100 focus:border-indigo-500"
              />
            </div>
          )}

          {/* Legal Business Name & GSTIN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Legal / Registered Entity Name</label>
              <input
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
              <input
                type="text"
                placeholder="e.g. Plot 15, Knowledge Park"
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">City, State & PIN</label>
              <input
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
              <input
                type="email"
                placeholder="e.g. accounts@library.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Billing Contact Phone</label>
              <input
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Tax Calculation & Subtotal */}
          <div className="p-3 rounded-xl border border-indigo-500/20 bg-slate-900/50 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Calculator size={13} className="text-indigo-400" /> GST Tax Calculation
              </span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="taxType"
                    checked={taxType === 'intra'}
                    onChange={() => setTaxType('intra')}
                    className="text-indigo-600"
                  />
                  <span className="text-slate-300">Intra-State (CGST 9% + SGST 9%)</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="taxType"
                    checked={taxType === 'inter'}
                    onChange={() => setTaxType('inter')}
                    className="text-indigo-600"
                  />
                  <span className="text-slate-300">Inter-State (IGST 18%)</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Base Price (₹)</label>
                <input
                  type="number"
                  min={1}
                  value={subtotal}
                  onChange={(e) => setSubtotal(Number(e.target.value))}
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900 px-3 py-1.5 text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Discount (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900 px-3 py-1.5 text-slate-100 font-mono"
                />
              </div>
              <div className="text-right flex flex-col justify-end">
                <span className="text-[11px] text-slate-400">Total with 18% GST:</span>
                <span className="text-base font-black text-emerald-400 font-mono">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Payment Method, Status & Cadence */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Payment Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/90 px-3 py-2 text-slate-100 cursor-pointer"
              >
                <option value="UPI">UPI (GooglePay / PhonePe)</option>
                <option value="Card">Credit / Debit Card</option>
                <option value="NetBanking">Net Banking</option>
                <option value="Bank Transfer">Direct NEFT/RTGS</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Invoice Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'Paid' | 'Pending' | 'Overdue')}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/90 px-3 py-2 text-slate-100 cursor-pointer"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending Verification</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Billing Cadence</label>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value as 'Monthly' | 'Annual')}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/90 px-3 py-2 text-slate-100 cursor-pointer"
              >
                <option value="Monthly">Monthly</option>
                <option value="Annual">Annual Pre-paid</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-indigo-500/20">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border/80 bg-card/80 px-4 py-2 font-semibold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-2 font-semibold text-white shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Check size={14} />
              <span>Generate Tax Invoice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
