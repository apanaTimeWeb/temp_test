'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PlusCircle, X, Check, Building2 } from 'lucide-react';
import type { SuperadminBillingInvoiceSample } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/types/SuperadminBillingInvoicesTypes';
import { useModalScrollLock } from '@/lib/useModalScrollLock';
import {
  CANONICAL_LIBRARY_TENANTS,
  type LibraryTenantOption,
} from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/constants/SuperadminBillingCanonicalTenants';
import SuperadminBillingCreateInvoiceAddressSection from './SuperadminBillingCreateInvoiceAddressSection';
import SuperadminBillingCreateInvoiceTaxSection from './SuperadminBillingCreateInvoiceTaxSection';

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

  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!tenant.trim()) {
      setFormError('Tenant name is required.');
      return;
    }

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
      className="fixed inset-0 z-40 flex items-center justify-center bg-overlay-backdrop backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl border border-border bg-overlay p-5 sm:p-6 shadow-dialog space-y-4"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <PlusCircle size={20} className="text-primary" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-primary">Create Platform Tax Invoice</h2>
              <p className="text-[11px] text-secondary">Generate GST-compliant SaaS invoice with automated tax calculations</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-secondary hover:text-primary p-1 rounded-lg hover:bg-surface-hover motion-safe:transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {formError && (
          <div className="rounded-xl border border-border bg-danger-bg p-3 text-xs text-danger" role="alert">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-secondary mb-1">
                Invoice Number (Sequential)
              </label>
              <input maxLength={30}
                type="text"
                required
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
                className="w-full rounded-xl border border-border bg-input px-3 py-2 text-primary focus:border-primary focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-secondary mb-1 flex items-center gap-1">
                <Building2 size={12} className="text-primary" />
                <span>Tenant / Library *</span>
              </label>
              <select
                value={selectedLibraryOption}
                onChange={(e) => handleLibraryChange(e.target.value)}
                data-testid="superadmin-billing-create-invoice-tenant-select"
                className="w-full rounded-xl border border-border bg-input px-3 py-2 text-primary focus:border-primary focus:outline-none cursor-pointer"
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

          {selectedLibraryOption === '__custom__' && (
            <div className="p-3 rounded-xl border border-border bg-card">
              <label className="block font-semibold text-primary mb-1">
                Custom Library Name *
              </label>
              <input maxLength={100}
                type="text"
                required
                placeholder="e.g. Apex Knowledge Lounge"
                value={tenant}
                onChange={(e) => setTenant(e.target.value)}
                data-testid="superadmin-billing-create-invoice-custom-tenant-input"
                className="w-full rounded-xl border border-border bg-input px-3 py-2 text-primary focus:border-primary focus:outline-none"
              />
            </div>
          )}

          <SuperadminBillingCreateInvoiceAddressSection
            legalName={legalName}
            setLegalName={setLegalName}
            gst={gst}
            setGst={setGst}
            billingAddress={billingAddress}
            setBillingAddress={setBillingAddress}
            cityStatePin={cityStatePin}
            setCityStatePin={setCityStatePin}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
          />

          <SuperadminBillingCreateInvoiceTaxSection
            taxType={taxType}
            setTaxType={setTaxType}
            subtotal={subtotal}
            setSubtotal={setSubtotal}
            discount={discount}
            setDiscount={setDiscount}
            totalAmount={totalAmount}
          />

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

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-input px-4 py-2 font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 font-semibold text-on-primary shadow-card hover:bg-primary-hover motion-safe:active:scale-95 motion-safe:transition-all cursor-pointer"
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
