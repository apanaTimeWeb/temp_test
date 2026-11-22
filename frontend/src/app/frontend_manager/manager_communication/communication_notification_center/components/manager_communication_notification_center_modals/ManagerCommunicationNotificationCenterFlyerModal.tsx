'use client';

import {
Check,
Copy,
FileText,
Printer,
Tag,
X
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export interface NoticeboardTemplate {
  id: string;
  category: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  body: string;
  effectiveDates: string;
  reopenTime: string;
  instructions: string[];
}

export const NOTICEBOARD_PRESET_TEMPLATES: NoticeboardTemplate[] = [
  {
    id: 'diwali_holiday',
    category: 'HOLIDAY NOTICE / अवकाश सूचना',
    badgeColor: 'border-amber-600 text-amber-800 bg-amber-50',
    title: 'दीपावली अवकाश सूचना / Diwali Vacation Notice',
    subtitle: 'पुस्तकालय अध्ययन कक्ष बंद रहने की आधिकारिक सूचना',
    body: 'समस्त विद्यार्थियों एवं सदस्यों को सूचित किया जाता है कि दीपावली एवं गोवर्धन पूजा के पावन पर्व के उपलक्ष्य में पुस्तकालय के सभी अध्ययन कक्ष (Study Halls) एवं शिफ्ट्स बंद रहेंगी।',
    effectiveDates: '31 अक्टूबर 2026 से 03 नवंबर 2026 तक',
    reopenTime: '04 नवंबर 2026 (सुबह 06:00 AM से सभी शिफ्ट्स सामान्य रूप से संचालित होंगी)',
    instructions: [
      'अवकाश अवधि के दौरान अपनी बहुमूल्य वस्तुएं अथवा लैपटॉप डेस्क पर न छोड़ें।',
      'लॉकर सुविधा एवं ऑनलाइन सीट रिन्यूअल मोबाइल पोर्टल पर 24 घंटे उपलब्ध रहेगा।',
      'अवकाश के बाद सभी छात्र अपनी निर्धारित शिफ्ट में समय पर पधारें।',
    ],
  },
  {
    id: 'maintenance_notice',
    category: 'MAINTENANCE DOWNTIME / रखरखाव सूचना',
    badgeColor: 'border-rose-600 text-rose-800 bg-rose-50',
    title: 'विद्युत व AC रखरखाव सूचना / AC & Power Maintenance',
    subtitle: 'मासिक तकनीकी सर्विसिंग एवं डीप क्लीनिंग सूचना',
    body: 'पुस्तकालय के हॉल-A एवं हॉल-B में एयर कंडीशनिंग डक्ट्स, इलेक्ट्रिकल बैकअप तथा कीटनाशक छिड़काव (Pest Control) का कार्य निर्धारित है।',
    effectiveDates: 'रविवार, 22 नवंबर 2026 (प्रातः 08:00 AM से दोपहर 02:00 PM)',
    reopenTime: 'रविवार दोपहर 02:30 PM (Evening Shift समय पर शुरू होगी)',
    instructions: [
      'रखरखाव कार्य के समय अध्ययन हॉल में प्रवेश प्रतिबंधित रहेगा।',
      'मॉर्निंग शिफ्ट के छात्र अपनी पढ़ाई हेतु सामान्य डिस्कशन कैबिन का उपयोग कर सकते हैं।',
      'किसी भी असुविधा के लिए रिसेप्शन डेस्क पर संपर्क करें।',
    ],
  },
  {
    id: 'discipline_silence',
    category: 'CODE OF CONDUCT / अनुशासन व शांत क्षेत्र',
    badgeColor: 'border-indigo-600 text-indigo-800 bg-indigo-50',
    title: 'शांत क्षेत्र नियम व अनुशासन निर्देशिका / Silent Zone Protocol',
    subtitle: 'गंभीर प्रतियोगी परीक्षाओं की तैयारी हेतु अनिवार्य नियम',
    body: 'पुस्तकालय पूर्णतः शांत अध्ययन क्षेत्र (Strict Silent Study Zone) है। सभी सदस्यों से अनुशासन एवं मर्यादा बनाए रखने का विनम्र अनुरोध है।',
    effectiveDates: 'तत्काल प्रभाव से सभी शिफ्ट्स में लागू',
    reopenTime: 'नियमित संचालन (06:00 AM - 10:00 PM)',
    instructions: [
      'हॉल के अंदर मोबाइल फ़ोन पूर्ण रूप से Silent / Vibrate मोड पर रखें।',
      'फ़ोन पर बातचीत केवल रिसेप्शन लॉबी अथवा सीढ़ियों पर ही अनुमत है।',
      'डेस्क पर ग्रुप डिस्कशन, कानाफूसी अथवा शोर मचाने पर सदस्यता निलंबित की जा सकती है।',
      'अपनी सीट की सफाई स्वयं बनाए रखें एवं कचरा डस्टबिन में ही डालें।',
    ],
  },
  {
    id: 'exam_special_hours',
    category: 'EXAM SPECIAL / परीक्षा विशेष संचालन',
    badgeColor: 'border-emerald-600 text-emerald-800 bg-emerald-50',
    title: 'आगामी परीक्षाओं हेतु 24x7 अध्ययन सुविधा / 24x7 Exam Study Hours',
    subtitle: 'UPSC / SSC / Banking मुख्य परीक्षाओं हेतु विशेष व्यवस्था',
    body: 'छात्रों की मांग एवं आगामी प्रतियोगी परीक्षाओं को ध्यान में रखते हुए पुस्तकालय में 24 घंटे विशेष अध्ययन सत्र उपलब्ध कराया जा रहा है।',
    effectiveDates: '15 दिसंबर 2026 से 15 जनवरी 2027 तक',
    reopenTime: 'निरंतर 24 घंटे खुला रहेगा (Dedicated Night Shift Pass Holder)',
    instructions: [
      'नाइट शिफ्ट में अध्ययन करने वाले छात्रों के पास वैध बायोमेट्रिक / QR एक्सेस पास अनिवार्य है।',
      'रात के समय गरम चाय, कॉफ़ी एवं RO पेयजल व्यवस्था पैंट्री में उपलब्ध रहेगी।',
      'अतिरिक्त सहायता हेतु नाइट केयरटेकर से संपर्क करें।',
    ],
  },
];

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
  const [noticeTitle, setNoticeTitle] = useState(
    customDraftTitle || NOTICEBOARD_PRESET_TEMPLATES[0].title
  );
  const [noticeSubtitle, setNoticeSubtitle] = useState(
    NOTICEBOARD_PRESET_TEMPLATES[0].subtitle
  );
  const [noticeCategory, setNoticeCategory] = useState(
    NOTICEBOARD_PRESET_TEMPLATES[0].category
  );
  const [noticeBody, setNoticeBody] = useState(
    customDraftBody || NOTICEBOARD_PRESET_TEMPLATES[0].body
  );
  const [effectiveDates, setEffectiveDates] = useState(
    NOTICEBOARD_PRESET_TEMPLATES[0].effectiveDates
  );
  const [reopenTime, setReopenTime] = useState(
    NOTICEBOARD_PRESET_TEMPLATES[0].reopenTime
  );
  const [instructions, setInstructions] = useState<string[]>(
    NOTICEBOARD_PRESET_TEMPLATES[0].instructions
  );
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
    toast.info('Preparing official A4 noticeboard flyer for printing...');
    setTimeout(() => {
      window.print();
    }, 150);
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
    toast.success('Notice text copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const currentDate = new Date().toLocaleDateString('hi-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const noticeRefNo = `SL-NOT-${branchCode}-${new Date().getFullYear()}-042`;

  return (
    <>
      {/* ── PRINT-ONLY STYLES: Makes the A4 Flyer print cleanly without headers or background ── */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-a4-notice-zone, #printable-a4-notice-zone * {
            visibility: visible !important;
          }
          #printable-a4-notice-zone {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 28px !important;
            background: #ffffff !important;
            color: #0f172a !important;
            box-shadow: none !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* ── MODAL BACKDROP ── */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto no-print"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-5xl rounded-2xl border border-border bg-card text-primary shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-surface/50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center border border-amber-500/30">
                <FileText size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-primary">
                    A4 Noticeboard Flyer Generator
                  </h2>
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
              className="p-1.5 rounded-lg border border-border text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ── LEFT COLUMN (5 Cols): Template Selectors & Quick Customizer ── */}
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
                        className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500/40 text-primary shadow-xs'
                            : 'bg-card border-border hover:bg-surface-hover text-secondary'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tmpl.badgeColor}`}
                          >
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

              {/* Customization Toggle */}
              <div className="pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsCustomizing(!isCustomizing)}
                  className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-border bg-surface/50 hover:bg-surface text-primary flex items-center justify-between cursor-pointer"
                >
                  <span>{isCustomizing ? 'Hide Customizer' : 'Edit Notice Text & Dates'}</span>
                  <span className="text-[10px] text-amber-500 font-bold">{isCustomizing ? 'Close' : 'Customize'}</span>
                </button>

                {isCustomizing && (
                  <div className="space-y-2.5 mt-2.5 p-3 rounded-xl bg-surface/50 border border-border text-xs">
                    <div>
                      <label className="font-semibold block mb-1">Notice Title</label>
                      <input maxLength={100}
                        type="text"
                        value={noticeTitle}
                        onChange={(e) => setNoticeTitle(e.target.value)}
                        className="mgr-input text-xs w-full"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Notice Category Badge</label>
                      <input maxLength={100}
                        type="text"
                        value={noticeCategory}
                        onChange={(e) => setNoticeCategory(e.target.value)}
                        className="mgr-input text-xs w-full"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Effective Dates / अवधि</label>
                      <input maxLength={100}
                        type="text"
                        value={effectiveDates}
                        onChange={(e) => setEffectiveDates(e.target.value)}
                        className="mgr-input text-xs w-full"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Reopen Time / पुनः संचालन</label>
                      <input maxLength={100}
                        type="text"
                        value={reopenTime}
                        onChange={(e) => setReopenTime(e.target.value)}
                        className="mgr-input text-xs w-full"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Main Notice Description</label>
                      <textarea maxLength={1000}
                        rows={3}
                        value={noticeBody}
                        onChange={(e) => setNoticeBody(e.target.value)}
                        className="mgr-input text-xs w-full resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Operations Callout */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300/90 flex items-start gap-2">
                <Tag size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Noticeboard Tip:</strong> Word में टाइप करने की आवश्यकता नहीं है। &apos;Print A4 Flyer&apos; दबाकर सीधे प्रिंटर से निकालें और लाइब्रेरी के मुख्य द्वार अथवा नोटिस बोर्ड पर लगाएं।
                </p>
              </div>
            </div>

            {/* ── RIGHT COLUMN (7 Cols): Official A4 Notice Flyer Preview ── */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                  <Printer size={13} className="text-amber-500" />
                  <span>A4 Physical Notice Preview</span>
                </span>
                <span className="text-[10px] text-secondary font-mono">Standard A4 Sheet Layout</span>
              </div>

              {/* ── THE PRINTABLE A4 FLYER SHEET ── */}
              <div
                id="printable-a4-notice-zone"
                className="w-full max-w-md rounded-2xl bg-white text-slate-900 p-6 sm:p-7 shadow-2xl border-4 border-slate-900 flex flex-col justify-between relative min-h-[580px]"
              >
                {/* Official Letterhead Header */}
                <div className="border-b-2 border-slate-900 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                        LO
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight text-slate-900">
                          {branchName}
                        </h3>
                        <p className="text-[9px] text-slate-600 font-medium">
                          Authorized Self-Study & Knowledge Center • Code: {branchCode}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-[9px] font-mono text-slate-600">
                      <div>Ref: {noticeRefNo}</div>
                      <div>Date: {currentDate}</div>
                    </div>
                  </div>
                </div>

                {/* Notice Banner */}
                <div className="my-3 text-center space-y-1.5">
                  <div className="inline-block px-3 py-1 rounded-full bg-slate-900 text-white font-extrabold text-[10px] uppercase tracking-widest shadow-xs">
                    {noticeCategory}
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight leading-snug">
                    {noticeTitle}
                  </h2>
                  <p className="text-[11px] font-semibold text-slate-600 italic">
                    {noticeSubtitle}
                  </p>
                </div>

                {/* Notice Body */}
                <div className="space-y-3 text-xs leading-relaxed text-slate-800">
                  <p className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium">
                    {noticeBody}
                  </p>

                  {/* Highlights Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-lg border border-slate-300 bg-slate-100">
                      <span className="font-bold text-slate-900 block">📅 प्रभावी अवधि:</span>
                      <span className="text-slate-800 font-semibold">{effectiveDates}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-300 bg-slate-100">
                      <span className="font-bold text-slate-900 block">⏰ पुनः संचालन:</span>
                      <span className="text-slate-800 font-semibold">{reopenTime}</span>
                    </div>
                  </div>

                  {/* Instructions Bullet Points */}
                  <div className="p-3 rounded-xl border border-slate-300 bg-white space-y-1.5 text-[11px]">
                    <span className="font-bold text-slate-950 uppercase tracking-wider block text-[10px]">
                      छात्रों हेतु आवश्यक दिशा-निर्देश:
                    </span>
                    <ul className="space-y-1 text-slate-700 pl-4 list-disc">
                      {instructions.map((inst, i) => (
                        <li key={i}>{inst}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Official Sign-off Footer */}
                <div className="mt-4 pt-3 border-t-2 border-slate-900 flex items-center justify-between text-[10px] text-slate-700">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-950 block">आदेशानुसार / By Order:</span>
                    <span>शाखा प्रबंधक (Branch Manager)</span>
                    <span className="block text-[9px] text-slate-500">Helpline: +91 9876543210</span>
                  </div>

                  {/* Stamp simulation */}
                  <div className="border-2 border-dashed border-slate-400 rounded-lg p-1.5 text-center w-24 h-12 flex flex-col items-center justify-center text-[8px] font-bold uppercase text-slate-600">
                    <span>CENTRAL LIBRARY</span>
                    <span>OFFICIAL SEAL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-border bg-surface/50 shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyNotice}
                className="mgr-btn-outline inline-flex items-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl cursor-pointer"
              >
                {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                <span>{copied ? 'Copied!' : 'Copy Notice Text'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-xl border border-border text-xs font-semibold text-secondary hover:text-primary transition-colors cursor-pointer"
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
    </>
  );
}
