'use client';

import React from 'react';
import { Building2, User, Phone, Mail } from 'lucide-react';

interface SuperadminSupportTicketsCreateContactFieldsProps {
  tenant: string;
  setTenant: (v: string) => void;
  contact: string;
  setContact: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  errors: Record<string, string>;
}

export default function SuperadminSupportTicketsCreateContactFields({
  tenant,
  setTenant,
  contact,
  setContact,
  phone,
  setPhone,
  email,
  setEmail,
  errors,
}: SuperadminSupportTicketsCreateContactFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Tenant/Library */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
          <Building2 size={13} className="text-indigo-400" />
          <span>Library / Tenant Name</span>
          <span className="text-rose-400">*</span>
        </label>
        <input
          maxLength={100}
          type="text"
          placeholder="e.g. Apex Central Library"
          value={tenant}
          onChange={(e) => setTenant(e.target.value)}
          className={`w-full rounded-xl border bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none motion-safe:transition-all ${
            errors.tenant ? 'border-rose-500 focus:border-rose-400' : 'border-indigo-500/30 focus:border-indigo-400'
          }`}
        />
        {errors.tenant && <p className="text-[11px] text-rose-400 mt-1">{errors.tenant}</p>}
      </div>

      {/* Contact Person */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
          <User size={13} className="text-indigo-400" />
          <span>Contact Person (Optional)</span>
        </label>
        <input
          maxLength={100}
          type="text"
          placeholder="e.g. Anil Kumar (Admin)"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none motion-safe:transition-all"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
          <Phone size={13} className="text-indigo-400" />
          <span>Phone / WhatsApp</span>
        </label>
        <input
          maxLength={15}
          type="tel"
          placeholder="+91 98765 43210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none motion-safe:transition-all"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
          <Mail size={13} className="text-indigo-400" />
          <span>Email Address</span>
        </label>
        <input
          maxLength={254}
          type="email"
          placeholder="owner@library.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none motion-safe:transition-all"
        />
      </div>
    </div>
  );
}
