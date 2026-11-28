'use client';

import { ManagerCommunicationNotificationCenterFlyerPreview } from '@/app/frontend_manager/manager_communication/communication_notification_center/components/manager_communication_notification_center_modals/ManagerCommunicationNotificationCenterFlyerPreview';
import {
  NOTICEBOARD_PRESET_TEMPLATES,
  type NoticeboardTemplate,
} from '@/app/frontend_manager/manager_communication/communication_notification_center/components/manager_communication_notification_center_modals/ManagerCommunicationNotificationCenterFlyerTemplates';
import { Check, Copy, FileText, Printer, Tag, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export interface ManagerCommunicationNotificationCenterFlyerModalProps {
  isOpen: boolean;
  onClose: () => void;
  branchName?: string;
  branchCode?: string;
  customDraftTitle?: string;
  customDraftBody?: string;
}

export function ManagerCommunicationNotificationCenterFlyerModal({
  isOpen,
  onClose,
  branchName = 'Library OS — Central Branch',
  branchCode = 'SL360-CP-01',
  customDraftTitle,
  customDraftBody,
}: ManagerCommunicationNotificationCenterFlyerModalProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('diwali_holiday');
  const [noticeTitle, setNoticeTitle] = useState(customDraftTitle || NOTICEBOARD_PRESET_TEMPLATES[0].title);
  const [noticeSubtitle, setNoticeSubtitle] = useState(NOTICEBOARD_PRESET_TEMPLATES[0].subtitle);
  const [noticeCategory, setNoticeCategory] = useState(NOTICEBOARD_PRESET_TEMPLATES[0].category);
  const [noticeBody, setNoticeBody] = useState(customDraftBody || NOTICEBOARD_PRESET_TEMPLATES[0].body);
  const [effectiveDates, setEffectiveDates] = useState(NOTICEBOARD_PRESET_TEMPLATES[0].effectiveDates);
  const [reopenTime, setReopenTime] = useState(NOTICEBOARD_PRESET_TEMPLATES[0].reopenTime);
  const [instructions, setInstructions] = useState<string[]>(NOTICEBOARD_PRESET_TEMPLATES[0].instructions);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSelectTemplate = (tmpl: NoticeboardTemplate) => {
    setSelectedTemplateId(tmpl.id);
    setNoticeCategory(tmpl.category);
    setNoticeTitle(tmpl.title);
    setNoticeSubtitle(tmpl.subtitle);
    setNoticeBody(tmpl.body);
    setEffectiveDates(tmpl.effectiveDates);
    setReopenTime(tmpl.reopenTime);
    setInstructions(tmpl.instructions);
    setIsCustomizing(false);
  };

  const handlePrintFlyer = () => {
    toast.info('Preparing official A4 noticeboard flyer for printing...', { id: 'manager-flyer-print' });
    setTimeout(() => window.print(), 150);
  };

  const handleCopyNotice = () => {
    const text = [
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🏛️ ${branchName} [${branchCode}]`,
      `📢 ${noticeCategory}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📌 ${noticeTitle}`,
      `ℹ️ ${noticeSubtitle}`,
      ``,
      `${noticeBody}`,
      ``,
      `📅 प्रभावी अवधि: ${effectiveDates}`,
      `⏰ पुनः संचालन समय: ${reopenTime}`,
      ``,
      `निर्देश:`,
      ...instructions.map((inst, i) => `${i + 1}. ${inst}`),
      ``,
      `आदेशानुसार: शाखा प्रबंधक / Branch Facility Manager`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ].join('\n');

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopied(true);
    toast.success('Notice text copied to clipboard!', { id: 'manager-flyer-copy' });
    setTimeout(() => setCopied(false), 2000);
  };

  const currentDate = new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const noticeRefNo = `SL-NOT-${branchCode}-${new Date().getFullYear()}-042`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-overlay-backdrop backdrop-blur-md overflow-y-auto no-print"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="A4 Noticeboard Flyer Generator"
        className="relative w-full max-w-5xl rounded-2xl border border-border bg-card text-primary shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-surface shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center border border-amber-500/30">
              <FileText size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-primary">A4 Noticeboard Flyer Generator</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Printable Notice
                </span>
              </div>
              <p className="text-xs text-secondary">
                फिजिकल नोटिस बोर्ड या शीशे पर लगाने के लिए सुंदर A4 साइज का नोटिस प्रिंट करें
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary block">
                1. Select Official Notice Template
              </span>
              <div className="space-y-2">
                {NOTICEBOARD_PRESET_TEMPLATES.map((tmpl) => {
                  const isSelected = selectedTemplateId === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleSelectTemplate(tmpl)}
                      className={`w-full p-3 rounded-xl border text-left motion-safe:transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/40 text-primary shadow-xs'
                          : 'bg-card border-border hover:bg-surface-hover text-secondary'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tmpl.badgeColor}`}>
                          {tmpl.category.split('/')[0].trim()}
                        </span>
                        {isSelected && <Check size={14} className="text-amber-500" />}
                      </div>
                      <h4 className="text-xs font-bold text-primary">{tmpl.title.split('/')[0].trim()}</h4>
                      <p className="text-[11px] text-secondary truncate mt-0.5">{tmpl.subtitle}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setIsCustomizing(!isCustomizing)}
                className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-border bg-surface hover:bg-surface-hover text-primary flex items-center justify-between cursor-pointer"
              >
                <span>{isCustomizing ? 'Hide Customizer' : 'Edit Notice Text & Dates'}</span>
                <span className="text-[10px] text-amber-500 font-bold">{isCustomizing ? 'Close' : 'Customize'}</span>
              </button>

              {isCustomizing && (
                <div className="space-y-2.5 mt-2.5 p-3 rounded-xl bg-surface border border-border text-xs">
                  <div>
                    <label className="font-semibold block mb-1">Notice Title</label>
                    <input maxLength={100} type="text" value={noticeTitle} onChange={(e) => setNoticeTitle(e.target.value)} className="mgr-input text-xs w-full" />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Notice Category Badge</label>
                    <input maxLength={100} type="text" value={noticeCategory} onChange={(e) => setNoticeCategory(e.target.value)} className="mgr-input text-xs w-full" />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Effective Dates / अवधि</label>
                    <input maxLength={100} type="text" value={effectiveDates} onChange={(e) => setEffectiveDates(e.target.value)} className="mgr-input text-xs w-full" />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Reopen Time / पुनः संचालन</label>
                    <input maxLength={100} type="text" value={reopenTime} onChange={(e) => setReopenTime(e.target.value)} className="mgr-input text-xs w-full" />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Main Notice Description</label>
                    <textarea maxLength={1000} rows={3} value={noticeBody} onChange={(e) => setNoticeBody(e.target.value)} className="mgr-input text-xs w-full resize-none" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
              <Tag size={15} className="text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong>Noticeboard Tip:</strong> Word में टाइप करने की आवश्यकता नहीं है। &apos;Print A4 Flyer&apos; दबाकर सीधे प्रिंटर से निकालें और लाइब्रेरी के मुख्य द्वार अथवा नोटिस बोर्ड पर लगाएं।
              </p>
            </div>
          </div>

          <ManagerCommunicationNotificationCenterFlyerPreview
            branchName={branchName}
            branchCode={branchCode}
            noticeRefNo={noticeRefNo}
            currentDate={currentDate}
            noticeCategory={noticeCategory}
            noticeTitle={noticeTitle}
            noticeSubtitle={noticeSubtitle}
            noticeBody={noticeBody}
            effectiveDates={effectiveDates}
            reopenTime={reopenTime}
            instructions={instructions}
            templateKey={selectedTemplateId}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-border bg-surface shrink-0">
          <button
            type="button"
            onClick={handleCopyNotice}
            className="mgr-btn-outline inline-flex items-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl cursor-pointer"
          >
            {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
            <span>{copied ? 'Copied!' : 'Copy Notice Text'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl border border-border text-xs font-semibold text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrintFlyer}
              className="mgr-btn-primary inline-flex items-center gap-1.5 text-xs font-bold py-2 px-5 rounded-xl shadow-md cursor-pointer"
            >
              <Printer size={14} />
              <span>Print A4 Flyer (प्रिंट नोटिस)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
