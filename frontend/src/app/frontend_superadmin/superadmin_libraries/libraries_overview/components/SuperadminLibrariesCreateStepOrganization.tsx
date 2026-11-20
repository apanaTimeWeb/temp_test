'use client';
/** Responsibility: Step A of Library Creation Wizard; captures organization identity, unique code, contact details, and location. */
import { Building2, Sparkles, Globe, MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';
import type { LibraryOrganizationDetails } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/types/SuperadminLibrariesCreateAccountTypes';

interface StepOrganizationProps {
  data: LibraryOrganizationDetails;
  onChange: (updated: LibraryOrganizationDetails) => void;
  existingCodes: string[];
}

export default function SuperadminLibrariesCreateStepOrganization({
  data,
  onChange,
  existingCodes,
}: StepOrganizationProps) {
  const generateUniqueCode = () => {
    const cityPrefix = data.city ? data.city.slice(0, 3).toUpperCase() : 'LIB';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const candidate = `${cityPrefix}-${randomNum}`;
    onChange({ ...data, libraryCode: candidate });
  };

  const isDuplicateCode = Boolean(
    data.libraryCode && existingCodes.includes(data.libraryCode.trim().toUpperCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-indigo-500/20">
        <Building2 size={18} className="text-indigo-400" />
        <h3 className="text-sm font-bold text-white">Section A: Library & Organization Details</h3>
      </div>

      {/* Row 1: Name and Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Library Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Apex Knowledge Hub"
            value={data.libraryName}
            onChange={(e) => onChange({ ...data, libraryName: e.target.value })}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-300">
              Unique Library Code <span className="text-rose-400">*</span>
            </label>
            <button
              type="button"
              onClick={generateUniqueCode}
              className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <Sparkles size={11} />
              <span>Auto-Generate</span>
            </button>
          </div>
          <input
            type="text"
            required
            placeholder="e.g. APX-DEL-101"
            value={data.libraryCode}
            onChange={(e) => onChange({ ...data, libraryCode: e.target.value.toUpperCase() })}
            className={`w-full rounded-xl border px-3.5 py-2 text-xs font-mono font-bold focus:outline-none focus:ring-1 ${
              isDuplicateCode
                ? 'border-rose-500 bg-rose-500/10 text-rose-300 focus:ring-rose-500'
                : 'border-slate-700/80 bg-slate-900/90 text-indigo-300 focus:border-indigo-400 focus:ring-indigo-400'
            }`}
          />
          {isDuplicateCode && (
            <p className="text-[10px] text-rose-400 mt-1 font-semibold">
              Warning: This library code is already assigned. Please choose or auto-generate a unique code.
            </p>
          )}
        </div>
      </div>

      {/* Row 2: Legal Name and Owner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Legal / Business Registered Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Apex Reading Spaces Pvt Ltd"
            value={data.legalBusinessName}
            onChange={(e) => onChange({ ...data, legalBusinessName: e.target.value })}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Organization Owner Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Rajesh Kumar Sharma"
            value={data.ownerName}
            onChange={(e) => onChange({ ...data, ownerName: e.target.value })}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* Row 3: Contact Number and Email Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-1 text-xs font-semibold text-slate-300 mb-1">
            <Phone size={11} className="text-indigo-400" />
            <span>Main Contact Number</span> <span className="text-rose-400">*</span>
          </label>
          <input
            type="tel"
            required
            placeholder="+91 98765 43210"
            value={data.contactNumber}
            onChange={(e) => onChange({ ...data, contactNumber: e.target.value })}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label className="flex items-center gap-1 text-xs font-semibold text-slate-300 mb-1">
            <Mail size={11} className="text-indigo-400" />
            <span>Official Email Address</span> <span className="text-rose-400">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="admin@apexlibrary.in"
            value={data.emailAddress}
            onChange={(e) => onChange({ ...data, emailAddress: e.target.value })}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* Row 4: Registered Address */}
      <div>
        <label className="flex items-center gap-1 text-xs font-semibold text-slate-300 mb-1">
          <MapPin size={11} className="text-indigo-400" />
          <span>Registered Office Address</span> <span className="text-rose-400">*</span>
        </label>
        <textarea
          rows={2}
          required
          placeholder="Building, street, landmark, commercial area..."
          value={data.address}
          onChange={(e) => onChange({ ...data, address: e.target.value })}
          className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 resize-none"
        />
      </div>

      {/* Row 5: City, State, PIN, Country */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
          <input
            type="text"
            required
            placeholder="New Delhi"
            value={data.city}
            onChange={(e) => onChange({ ...data, city: e.target.value })}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-2 text-xs text-white focus:border-indigo-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">State</label>
          <input
            type="text"
            required
            placeholder="Delhi"
            value={data.state}
            onChange={(e) => onChange({ ...data, state: e.target.value })}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-2 text-xs text-white focus:border-indigo-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">PIN Code</label>
          <input
            type="text"
            placeholder="110001"
            value={data.pincode}
            onChange={(e) => onChange({ ...data, pincode: e.target.value })}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-2 text-xs text-white focus:border-indigo-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Country</label>
          <input
            type="text"
            value={data.country}
            onChange={(e) => onChange({ ...data, country: e.target.value })}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-2 text-xs text-white focus:border-indigo-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Row 6: Website, Timezone, Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="flex items-center gap-1 text-xs font-semibold text-slate-300 mb-1">
            <Globe size={11} className="text-slate-400" />
            <span>Website (Optional)</span>
          </label>
          <input
            type="url"
            placeholder="https://apexlibrary.in"
            value={data.website || ''}
            onChange={(e) => onChange({ ...data, website: e.target.value })}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-2 text-xs text-white focus:border-indigo-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="flex items-center gap-1 text-xs font-semibold text-slate-300 mb-1">
            <Clock size={11} className="text-slate-400" />
            <span>Time Zone</span>
          </label>
          <select
            value={data.timeZone}
            onChange={(e) => onChange({ ...data, timeZone: e.target.value })}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-2 text-xs text-slate-200 focus:border-indigo-400 focus:outline-none cursor-pointer"
          >
            <option value="Asia/Kolkata (IST, UTC+05:30)">Asia/Kolkata (IST, UTC+05:30)</option>
            <option value="Asia/Dubai (GST, UTC+04:00)">Asia/Dubai (GST, UTC+04:00)</option>
            <option value="UTC (UTC+00:00)">UTC (UTC+00:00)</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-1 text-xs font-semibold text-slate-300 mb-1">
            <ShieldCheck size={11} className="text-emerald-400" />
            <span>Account Status</span>
          </label>
          <select
            value={data.status}
            onChange={(e) => onChange({ ...data, status: e.target.value as 'Active' | 'Trial' | 'Suspended' })}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-2 text-xs text-slate-200 focus:border-indigo-400 focus:outline-none cursor-pointer"
          >
            <option value="Active">Active (Full Access)</option>
            <option value="Trial">Trial (14-Day Evaluation)</option>
            <option value="Suspended">Suspended (Pre-Hold)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
