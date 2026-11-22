'use client';
import type { ManagerMembersEnquiriesEnquiryActionsPanelProps } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesComponentTypes';
import { CheckCircle,MapPin,Ticket,XCircle } from 'lucide-react';

export function ManagerMembersEnquiriesEnquiryActionsPanel({
  status,
  statusOptions,
  statusLabels,
  unavailableMessage,
  currentStatusLabel,
  updateUnavailableLabel,
  actionsLabel,
  onConvert,
  alreadyConvertedLabel,
  convertLabel,
  alreadyLostLabel,
  markLostUnavailableLabel,
  onMarkLost,
  onSendDemoPass,
  onSendLocation,
}: ManagerMembersEnquiriesEnquiryActionsPanelProps) {
  return (
    <>
      <section className="crm-card rounded-2xl bg-[#0c0f28]/95 border border-indigo-500/25 p-5 shadow-lg mb-4" aria-labelledby="crm-detail-current-status-title">
        <h2 id="crm-detail-current-status-title" className="crm-section-label text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">{currentStatusLabel}</h2>
        <div className="crm-status-row flex items-center gap-3">
          <div className="crm-select-wrap flex-1">
            <select className="crm-select w-full bg-[#060818] border border-indigo-500/25 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 outline-none cursor-pointer" value={status} disabled aria-label={currentStatusLabel}>
              {statusOptions.map((option) => (
                <option key={option} value={option} className="bg-[#0b0c20]">
                  {statusLabels[option]}
                </option>
              ))}
            </select>
          </div>
          <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-xs font-semibold cursor-not-allowed opacity-80" disabled title={unavailableMessage}>
            <CheckCircle size={14} className="text-indigo-400" aria-hidden="true" />
            {updateUnavailableLabel}
          </button>
        </div>
      </section>

      <section className="crm-card crm-form-stack rounded-2xl bg-[#0c0f28]/95 border border-indigo-500/25 p-5 shadow-lg flex flex-col gap-3" aria-labelledby="crm-detail-actions-title">
        <h2 id="crm-detail-actions-title" className="crm-section-label text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">{actionsLabel}</h2>
        
        {/* 1. Convert to Admission */}
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-950/40 transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onConvert}
          disabled={status === 'Converted'}
        >
          <CheckCircle size={16} className="text-white" aria-hidden="true" />
          {status === 'Converted' ? alreadyConvertedLabel : convertLabel}
        </button>

        {/* 2. 1-Click WhatsApp 1-Day Demo Pass */}
        {onSendDemoPass && (
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 transition-all hover:scale-[1.01] cursor-pointer"
            onClick={onSendDemoPass}
          >
            <Ticket size={15} className="text-emerald-200" aria-hidden="true" />
            1-Click WhatsApp Demo Pass (Free Trial)
          </button>
        )}

        {/* 3. 1-Click WhatsApp Location & Timings Pin */}
        {onSendLocation && (
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-indigo-500/15 border border-indigo-500/35 hover:bg-indigo-500/25 text-indigo-300 hover:text-white font-bold text-xs transition-all cursor-pointer"
            onClick={onSendLocation}
          >
            <MapPin size={15} className="text-indigo-400" aria-hidden="true" />
            Send Location Pin & Timings (WhatsApp)
          </button>
        )}

        {/* 4. Mark as Lost Button */}
        {onMarkLost ? (
          <button
            type="button"
            className={`inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border text-xs font-bold transition-all ${
              status === 'Lost'
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 opacity-50 cursor-not-allowed'
                : 'bg-rose-500/15 border-rose-500/35 text-rose-400 hover:bg-rose-500/25 hover:border-rose-500/50 hover:text-rose-300 cursor-pointer'
            }`}
            disabled={status === 'Lost'}
            onClick={onMarkLost}
            title={status === 'Lost' ? alreadyLostLabel : 'Mark Enquiry as Lost'}
          >
            <XCircle size={15} className="text-rose-400" aria-hidden="true" />
            {status === 'Lost' ? alreadyLostLabel : 'Mark as Lost'}
          </button>
        ) : (
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 font-bold text-xs opacity-75 cursor-not-allowed"
            disabled
            title={unavailableMessage}
          >
            <XCircle size={15} className="text-rose-400" aria-hidden="true" />
            {status === 'Lost' ? alreadyLostLabel : markLostUnavailableLabel}
          </button>
        )}
      </section>
    </>
  );
}
