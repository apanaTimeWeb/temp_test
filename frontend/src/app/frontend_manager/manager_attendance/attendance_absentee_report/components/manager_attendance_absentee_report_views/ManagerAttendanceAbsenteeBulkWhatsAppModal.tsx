'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, MessageSquare, Send, X, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import type { ManagerAttendanceAbsenteeReportSampleAbsentee } from '../../hooks/ManagerAttendanceAbsenteeReportDemoRepository';

interface ManagerAttendanceAbsenteeBulkWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  absentees: ManagerAttendanceAbsenteeReportSampleAbsentee[];
  onComplete: () => void;
}

const ABSENTEE_TEMPLATES = [
  {
    label: 'Standard Absentee Alert',
    text: 'Dear Parent / Student, this is an official attendance notice from Central Library. {name} ({smartId}, {shift} Shift) has been absent for {daysAbsent} consecutive days. Last attended date: {lastSeen}. Kindly ensure regular study attendance. — Central Library Administration',
  },
  {
    label: 'Critical Notice (7+ Days)',
    text: 'Urgent Attendance Notice: {name} ({smartId}) has exceeded 7 consecutive days of unexcused absence ({daysAbsent} days) from Central Library. Please contact branch administration immediately to retain your allocated seat. — Central Library Administration',
  },
  {
    label: 'Check-in / Well-being Inquiry',
    text: 'Hello {name}, we noticed you have been absent from Central Library for {daysAbsent} days since {lastSeen}. We hope everything is well. Please let us know if you need any study material support or leave extension. — Central Library Administration',
  },
];

export function ManagerAttendanceAbsenteeBulkWhatsAppModal({
  isOpen,
  onClose,
  absentees,
  onComplete,
}: ManagerAttendanceAbsenteeBulkWhatsAppModalProps) {
  const [openedKeys, setOpenedKeys] = useState<Set<string>>(new Set());
  const [selectedTemplate, setSelectedTemplate] = useState(ABSENTEE_TEMPLATES[0].text);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || absentees.length === 0) return null;

  const personalize = (template: string, item: ManagerAttendanceAbsenteeReportSampleAbsentee) => {
    return template
      .replace(/{name}/gi, item.name)
      .replace(/{smartId}/gi, item.smartId)
      .replace(/{shift}/gi, item.shift)
      .replace(/{daysAbsent}/gi, String(item.daysAbsent))
      .replace(/{lastSeen}/gi, item.lastSeen);
  };

  const handleSendSingle = (item: ManagerAttendanceAbsenteeReportSampleAbsentee) => {
    const rawPhone = item.parentPhone || '9876543210';
    let cleanPhone = rawPhone.replace(/\D/g, '');
    if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
      cleanPhone = cleanPhone.slice(1);
    }
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const body = encodeURIComponent(personalize(selectedTemplate, item));

    const url = `https://wa.me/${targetPhone}?text=${body}`;
    const popup = window.open(url, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;

    setOpenedKeys((prev) => {
      const next = new Set(prev);
      next.add(item.smartId);
      return next;
    });

    toast.success(`Absentee WhatsApp alert opened for ${item.name} (+91 ${cleanPhone})`);
  };

  const openedCount = openedKeys.size;
  const totalCount = absentees.length;
  const progressPct = Math.round((openedCount / totalCount) * 100);
  const isComplete = openedCount === totalCount;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay-backdrop backdrop-blur-sm animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-absentee-whatsapp-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <MessageSquare size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="bulk-absentee-whatsapp-title" className="text-base font-bold text-foreground">
                  Bulk Absentee WhatsApp Alerts
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                  {absentees.length} Absent Students
                </span>
              </div>
              <p className="text-xs text-secondary mt-0.5">
                Dispatch attendance notices directly to parents/students via WhatsApp click-to-chat
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-secondary hover:text-foreground hover:bg-surface-hover transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Progress */}
          <div className="p-3.5 rounded-xl bg-surface border border-border flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-secondary uppercase tracking-wider block">
                Alerts Dispatched
              </span>
              <span className="text-sm font-bold text-foreground">
                {openedCount} of {totalCount} Alerts Sent ({progressPct}%)
              </span>
            </div>
            <div className="w-32 bg-surface-highlight rounded-full h-2.5 overflow-hidden border border-border">
              <div
                className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Template presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-secondary">Choose Alert Template:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {ABSENTEE_TEMPLATES.map((tmpl) => (
                <button
                  type="button"
                  key={tmpl.label}
                  onClick={() => setSelectedTemplate(tmpl.text)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                    selectedTemplate === tmpl.text
                      ? 'bg-primary text-on-primary border-primary font-semibold'
                      : 'bg-surface border-border text-secondary hover:text-foreground'
                  }`}
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Template textarea */}
          <div>
            <label htmlFor="absentee-template" className="text-xs font-semibold text-secondary block mb-1">
              Message Template:
            </label>
            <textarea
              id="absentee-template"
              rows={3}
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Queue List */}
          <div className="border border-border rounded-xl divide-y divide-border overflow-hidden bg-surface max-h-60 overflow-y-auto">
            {absentees.map((item) => {
              const isOpened = openedKeys.has(item.smartId);
              const isCritical = item.daysAbsent >= 7;
              return (
                <div
                  key={item.smartId}
                  className="p-3 flex items-center justify-between gap-3 hover:bg-surface-hover transition-colors"
                >
                  <div>
                    <p className="text-sm font-bold text-foreground leading-tight">
                      {item.name}
                    </p>
                    <p className="text-xs text-secondary mt-0.5">
                      <span className="font-mono">{item.smartId}</span> • {item.shift} •{' '}
                      <span className={isCritical ? 'text-red-500 font-semibold' : 'text-amber-500 font-semibold'}>
                        {item.daysAbsent} Days Absent
                      </span>{' '}
                      • Last Seen: {item.lastSeen} • Parent: {item.parentPhone}
                    </p>
                  </div>

                  <div>
                    {isOpened ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white shadow-sm">
                        <CheckCircle2 size={13} />
                        <span>Notified</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSendSingle(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
                        title={`Send attendance alert to ${item.name}'s parent`}
                      >
                        <Send size={12} />
                        <span>Send WhatsApp</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-surface">
          <div className="flex items-center gap-1.5 text-xs text-secondary">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Anti-spam click-to-chat protected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-secondary hover:text-foreground hover:bg-surface-hover transition-colors"
            >
              Close
            </button>
            {isComplete && (
              <button
                type="button"
                onClick={onComplete}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
              >
                All Done & Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

