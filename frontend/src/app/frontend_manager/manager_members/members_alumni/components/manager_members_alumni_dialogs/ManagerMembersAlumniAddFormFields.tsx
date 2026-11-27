'use client';

import type { MembersAlumniRow } from '@/app/frontend_manager/manager_members/members_alumni/types/ManagerMembersAlumniComponentTypes';
import { Award, Briefcase, Calendar, Clock, GraduationCap, Phone, Quote, User } from 'lucide-react';

interface AddFormFieldsProps {
  name: string; setName: (v: string) => void;
  phone: string; setPhone: (v: string) => void;
  exam: string; setExam: (v: string) => void;
  designation: string; setDesignation: (v: string) => void;
  currentStatus: MembersAlumniRow['currentStatus']; setCurrentStatus: (v: MembersAlumniRow['currentStatus']) => void;
  duration: string; setDuration: (v: string) => void;
  leftDate: string; setLeftDate: (v: string) => void;
  testimonial: string; setTestimonial: (v: string) => void;
}

export function ManagerMembersAlumniAddFormFields({
  name, setName, phone, setPhone, exam, setExam, designation, setDesignation,
  currentStatus, setCurrentStatus, duration, setDuration, leftDate, setLeftDate, testimonial, setTestimonial,
}: AddFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      <div>
        <label className="font-semibold text-primary block mb-1">Student Full Name *</label>
        <div className="mgr-input-icon-wrap relative">
          <User size={16} className="mgr-input-icon absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
          <input type="text" required maxLength={80} className="mgr-input mgr-input-with-icon !pl-10 text-xs w-full h-9" placeholder="Type student full name..." value={name} onChange={(e) => setName(e.target.value.slice(0, 80))} />
        </div>
      </div>

      <div>
        <label className="font-semibold text-primary block mb-1">Contact Phone (10 Digits) *</label>
        <div className="mgr-input-icon-wrap relative">
          <Phone size={16} className="mgr-input-icon absolute left-3 top-1/2 -translate-y-1/2 text-info pointer-events-none" />
          <input type="tel" inputMode="numeric" required maxLength={10} pattern="[6-9][0-9]{9}" className="mgr-input mgr-input-with-icon !pl-10 text-xs font-mono w-full h-9" placeholder="9876543210" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} />
        </div>
      </div>

      <div className="sm:col-span-2">
        <label className="font-semibold text-primary block mb-1">Qualified Exam / Achievement *</label>
        <div className="mgr-input-icon-wrap relative">
          <Award size={16} className="mgr-input-icon absolute left-3 top-1/2 -translate-y-1/2 text-success pointer-events-none" />
          <input type="text" required maxLength={100} className="mgr-input mgr-input-with-icon !pl-10 text-xs w-full h-9" placeholder="e.g. UPSC CSE 2026 (AIR 114) / SSC CGL / NEET PG / Banking PO" value={exam} onChange={(e) => setExam(e.target.value.slice(0, 100))} />
        </div>
      </div>

      <div>
        <label className="font-semibold text-primary block mb-1">Designation / Posting / Rank</label>
        <div className="mgr-input-icon-wrap relative">
          <Briefcase size={16} className="mgr-input-icon absolute left-3 top-1/2 -translate-y-1/2 text-info pointer-events-none" />
          <input type="text" maxLength={80} className="mgr-input mgr-input-with-icon !pl-10 text-xs w-full h-9" placeholder="e.g. IAS Officer / SDM / Assistant Manager" value={designation} onChange={(e) => setDesignation(e.target.value.slice(0, 80))} />
        </div>
      </div>

      <div>
        <label className="font-semibold text-primary block mb-1">Milestone Category</label>
        <div className="mgr-input-icon-wrap relative">
          <GraduationCap size={16} className="mgr-input-icon absolute left-3 top-1/2 -translate-y-1/2 text-warning pointer-events-none" />
          <select className="mgr-select !pl-10 text-xs w-full h-9" value={currentStatus} onChange={(e) => setCurrentStatus(e.target.value as MembersAlumniRow['currentStatus'])}>
            <option value="Cleared Exam">Cleared Exam (Rank Holder)</option>
            <option value="Employed">Employed in Govt / PSU / Corporate</option>
            <option value="Higher Studies">Higher Studies (Masters / Ph.D.)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="font-semibold text-primary block mb-1">Study Tenure at Library</label>
        <div className="mgr-input-icon-wrap relative">
          <Clock size={16} className="mgr-input-icon absolute left-3 top-1/2 -translate-y-1/2 text-warning pointer-events-none" />
          <input type="text" maxLength={40} className="mgr-input mgr-input-with-icon !pl-10 text-xs w-full h-9" placeholder="e.g. 14 Months" value={duration} onChange={(e) => setDuration(e.target.value.slice(0, 40))} />
        </div>
      </div>

      <div>
        <label className="font-semibold text-primary block mb-1">Achievement / Exit Date</label>
        <div className="mgr-input-icon-wrap relative">
          <Calendar size={16} className="mgr-input-icon absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
          <input maxLength={100} type="date" className="mgr-input mgr-input-with-icon !pl-10 text-xs w-full h-9" value={leftDate} onChange={(e) => setLeftDate(e.target.value)} />
        </div>
      </div>

      <div className="sm:col-span-2">
        <label className="font-semibold text-primary flex items-center gap-1.5 mb-1">
          <Quote size={13} className="text-primary shrink-0" />
          <span>Advice / Testimonial for Library Juniors</span>
        </label>
        <textarea rows={2} maxLength={500} className="mgr-input text-xs resize-none w-full p-2.5" placeholder="e.g. The 14-hour silent AC reading hall and disciplined environment were instrumental in my success!" value={testimonial} onChange={(e) => setTestimonial(e.target.value.slice(0, 500))} />
      </div>
    </div>
  );
}
