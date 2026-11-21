'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Ticket, Building2, User, Mail, Phone, FileText } from 'lucide-react';
import type { SuperadminSupportTicket, SuperadminSupportTicketCategory, SuperadminSupportTicketPriority } from '@/app/frontend_superadmin/superadmin_support/support_tickets/types/SuperadminSupportTicketsOverviewTypes';
import { SUPERADMIN_SUPPORT_TICKET_TYPES } from '@/app/frontend_superadmin/superadmin_support/support_tickets/constants/SuperadminSupportTicketsOverviewConstants';
import { useModalScrollLock } from '@/lib/useModalScrollLock';

interface SuperadminSupportTicketsCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTicket: (ticket: SuperadminSupportTicket) => void;
}

export default function SuperadminSupportTicketsCreateModal({
  isOpen,
  onClose,
  onCreateTicket,
}: SuperadminSupportTicketsCreateModalProps) {
  const [tenant, setTenant] = useState('');
  const [contact, setContact] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SuperadminSupportTicketCategory>('Technical issue');
  const [priority, setPriority] = useState<SuperadminSupportTicketPriority>('Medium');
  const [desc, setDesc] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);

  useModalScrollLock(isOpen);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!tenant.trim()) newErrors.tenant = 'Library/Tenant name is required';
    if (!subject.trim()) newErrors.subject = 'Subject is required';
    if (!desc.trim()) newErrors.desc = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const targetHours = priority === 'Urgent' ? 2 : priority === 'High' ? 4 : priority === 'Medium' ? 12 : 24;

    const newTicket: SuperadminSupportTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: subject.trim(),
      tenant: tenant.trim(),
      contact: contact.trim() || undefined,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      category,
      priority,
      status: 'Open',
      assignee: 'Unassigned',
      slaBreach: false,
      age: 'Just now',
      replies: 1,
      hasAttachment: false,
      desc: desc.trim(),
      slaTargetHours: targetHours,
      slaRemaining: `${targetHours}h 00m remaining`,
      messages: [
        {
          id: `msg-${Date.now()}-1`,
          sender: contact.trim() || tenant.trim(),
          role: 'tenant_admin',
          timestamp: 'Just now',
          text: desc.trim(),
        },
      ],
      internalNotes: [],
      attachmentsList: [],
      timeLimitedAccess: {
        hasActiveAccess: false,
      },
    };

    onCreateTicket(newTicket);
    onClose();
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-ticket-title"
        className="w-full max-w-xl rounded-2xl border border-indigo-500/30 bg-[#0a0d22] shadow-2xl shadow-indigo-950/80 flex flex-col max-h-[90vh] my-auto overflow-hidden text-white animate-in zoom-in-95 duration-200 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed at Top */}
        <div className="flex items-center justify-between border-b border-indigo-500/20 p-4 sm:p-5 shrink-0 bg-[#0c102a]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Ticket size={20} />
            </div>
            <div>
              <h2 id="create-ticket-title" className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                Log Support Ticket
              </h2>
              <p className="text-xs text-slate-400">
                Log a software issue, branch request, billing discrepancy, or security ticket for a Library Admin
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body - Scrollable Form Container */}
        <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col overflow-hidden" noValidate>
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tenant/Library */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Building2 size={13} className="text-indigo-400" />
                  <span>Library / Tenant Name</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex Central Library"
                  value={tenant}
                  onChange={(e) => setTenant(e.target.value)}
                  className={`w-full rounded-xl border bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-all ${
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
                  type="text"
                  placeholder="e.g. Anil Kumar (Admin)"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Phone size={13} className="text-indigo-400" />
                  <span>Phone / WhatsApp</span>
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Mail size={13} className="text-indigo-400" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  placeholder="owner@library.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category / Ticket Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Ticket Type (9 Categories)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SuperadminSupportTicketCategory)}
                  className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/90 px-3.5 py-2 text-xs text-white focus:border-indigo-400 focus:outline-none cursor-pointer"
                >
                  {SUPERADMIN_SUPPORT_TICKET_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Priority Level
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as SuperadminSupportTicketPriority)}
                  className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/90 px-3.5 py-2 text-xs text-white focus:border-indigo-400 focus:outline-none cursor-pointer"
                >
                  <option value="Urgent">Urgent - Complete Blocker / Outage</option>
                  <option value="High">High - Major Feature Blocked</option>
                  <option value="Medium">Medium - Operational Blocker</option>
                  <option value="Low">Low - Normal Request / Question</option>
                </select>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <FileText size={13} className="text-indigo-400" />
                <span>Ticket Subject</span>
                <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Biometric QR scanner not connecting after power outage"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={`w-full rounded-xl border bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-all ${
                  errors.subject ? 'border-rose-500 focus:border-rose-400' : 'border-indigo-500/30 focus:border-indigo-400'
                }`}
              />
              {errors.subject && <p className="text-[11px] text-rose-400 mt-1">{errors.subject}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Issue Details & Steps to Reproduce <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Describe the issue, device model, affected students/seats, and error messages..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className={`w-full rounded-xl border bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-all resize-none min-h-[90px] ${
                  errors.desc ? 'border-rose-500 focus:border-rose-400' : 'border-indigo-500/30 focus:border-indigo-400'
                }`}
              />
              {errors.desc && <p className="text-[11px] text-rose-400 mt-1">{errors.desc}</p>}
            </div>
          </div>

          {/* Actions - Fixed at Bottom */}
          <div className="flex items-center justify-end gap-3 p-4 border-t border-indigo-500/20 bg-[#070919] shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer active:scale-[0.97]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 text-xs font-bold text-white hover:from-rose-500 hover:to-indigo-500 shadow-lg shadow-rose-950/40 hover:shadow-rose-500/30 transition-all duration-150 cursor-pointer active:scale-[0.97] group"
            >
              <Plus size={15} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
              <span>Create Ticket</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (!mounted || typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
}
