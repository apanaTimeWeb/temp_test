'use client';

import {
  createDefaultCustomProfile,
  DEMO_CUSTOM_AMOUNT_PLACEHOLDER,
  type StudentSampleProfile,
} from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/config/manager_communication_whatsapp_templates.demo_data';
import { Armchair, BookOpen, Calendar, IndianRupee, MapPin, RotateCcw, SlidersHorizontal, User } from 'lucide-react';
import React from 'react';

interface ManagerCommunicationWhatsappTemplatesCustomPersonaCardProps {
  customProfile: StudentSampleProfile;
  setCustomProfile: React.Dispatch<React.SetStateAction<StudentSampleProfile>>;
}

export function ManagerCommunicationWhatsappTemplatesCustomPersonaCard({
  customProfile,
  setCustomProfile,
}: ManagerCommunicationWhatsappTemplatesCustomPersonaCardProps) {
  return (
    <div className="p-3.5 rounded-xl border border-border bg-card backdrop-blur-xs space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-primary flex items-center gap-1.5">
          <SlidersHorizontal size={13} className="text-sky-400" />
          <span>Test with Custom Student Values (लाइव टेस्ट डेटा)</span>
        </p>
        <button
          type="button"
          onClick={() => setCustomProfile(createDefaultCustomProfile())}
          className="text-[11px] text-secondary hover:text-primary flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw size={11} />
          <span>Reset Values</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
        <div>
          <label className="text-[11px] text-secondary block mb-1 flex items-center gap-1">
            <User size={11} className="text-emerald-400" />
            <span>Student Name &#123;name&#125;</span>
          </label>
          <input
            maxLength={100}
            type="text"
            value={customProfile.name}
            onChange={(e) => setCustomProfile((prev) => ({ ...prev, name: e.target.value }))}
            className="mgr-input w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background"
            placeholder="e.g. Rohit Verma"
          />
        </div>

        <div>
          <label className="text-[11px] text-secondary block mb-1 flex items-center gap-1">
            <IndianRupee size={11} className="text-amber-400" />
            <span>Amount &#123;amount&#125;</span>
          </label>
          <input
            maxLength={100}
            type="text"
            value={customProfile.amount}
            onChange={(e) => setCustomProfile((prev) => ({ ...prev, amount: e.target.value }))}
            className="mgr-input w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background"
            placeholder={DEMO_CUSTOM_AMOUNT_PLACEHOLDER}
          />
        </div>

        <div>
          <label className="text-[11px] text-secondary block mb-1 flex items-center gap-1">
            <Calendar size={11} className="text-rose-400" />
            <span>Due Date &#123;duedate&#125;</span>
          </label>
          <input
            maxLength={100}
            type="text"
            value={customProfile.duedate}
            onChange={(e) => setCustomProfile((prev) => ({ ...prev, duedate: e.target.value }))}
            className="mgr-input w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background"
            placeholder="e.g. 25-Apr-2026"
          />
        </div>

        <div>
          <label className="text-[11px] text-secondary block mb-1 flex items-center gap-1">
            <BookOpen size={11} className="text-purple-400" />
            <span>Plan &#123;planname&#125;</span>
          </label>
          <input
            maxLength={100}
            type="text"
            value={customProfile.planname}
            onChange={(e) => setCustomProfile((prev) => ({ ...prev, planname: e.target.value }))}
            className="mgr-input w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background"
            placeholder="e.g. Morning Shift"
          />
        </div>

        <div>
          <label className="text-[11px] text-secondary block mb-1 flex items-center gap-1">
            <Armchair size={11} className="text-sky-400" />
            <span>Seat Tag &#123;seat&#125;</span>
          </label>
          <input
            maxLength={100}
            type="text"
            value={customProfile.seat}
            onChange={(e) => setCustomProfile((prev) => ({ ...prev, seat: e.target.value }))}
            className="mgr-input w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background"
            placeholder="e.g. Seat S-14 (Hall A)"
          />
        </div>

        <div>
          <label className="text-[11px] text-secondary block mb-1 flex items-center gap-1">
            <MapPin size={11} className="text-indigo-400" />
            <span>Library &#123;libraryname&#125;</span>
          </label>
          <input
            maxLength={100}
            type="text"
            value={customProfile.libraryname}
            onChange={(e) => setCustomProfile((prev) => ({ ...prev, libraryname: e.target.value }))}
            className="mgr-input w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background"
            placeholder="e.g. Central Study Hub"
          />
        </div>
      </div>
    </div>
  );
}
