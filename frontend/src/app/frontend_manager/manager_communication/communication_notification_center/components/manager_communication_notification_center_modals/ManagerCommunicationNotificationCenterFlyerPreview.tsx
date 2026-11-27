'use client';

import { Printer } from 'lucide-react';

interface ManagerCommunicationNotificationCenterFlyerPreviewProps {
  branchName: string;
  branchCode: string;
  noticeRefNo: string;
  currentDate: string;
  noticeCategory: string;
  noticeTitle: string;
  noticeSubtitle: string;
  noticeBody: string;
  effectiveDates: string;
  reopenTime: string;
  instructions: string[];
  templateKey: string;
}

/** Printable A4 letterhead noticeboard sheet preview. */
export function ManagerCommunicationNotificationCenterFlyerPreview({
  branchName,
  branchCode,
  noticeRefNo,
  currentDate,
  noticeCategory,
  noticeTitle,
  noticeSubtitle,
  noticeBody,
  effectiveDates,
  reopenTime,
  instructions,
  templateKey,
}: ManagerCommunicationNotificationCenterFlyerPreviewProps) {
  return (
    <div className="lg:col-span-7 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
          <Printer size={13} className="text-amber-500" />
          <span>A4 Physical Notice Preview</span>
        </span>
        <span className="text-[10px] text-secondary font-mono">Standard A4 Sheet Layout</span>
      </div>

      <div
        id="printable-a4-notice-zone"
        className="w-full max-w-md rounded-2xl bg-white text-slate-900 p-6 sm:p-7 shadow-2xl border-4 border-slate-900 flex flex-col justify-between relative min-h-[580px]"
      >
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
                  Authorized Self-Study &amp; Knowledge Center • Code: {branchCode}
                </p>
              </div>
            </div>
            <div className="text-right text-[9px] font-mono text-slate-600">
              <div>Ref: {noticeRefNo}</div>
              <div>Date: {currentDate}</div>
            </div>
          </div>
        </div>

        <div className="my-3 text-center space-y-1.5">
          <div className="inline-block px-3 py-1 rounded-full bg-slate-900 text-white font-extrabold text-[10px] uppercase tracking-widest shadow-xs">
            {noticeCategory}
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight leading-snug">
            {noticeTitle}
          </h2>
          <p className="text-[11px] font-semibold text-slate-600 italic">{noticeSubtitle}</p>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-slate-800">
          <p className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium">{noticeBody}</p>

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

          <div className="p-3 rounded-xl border border-slate-300 bg-white space-y-1.5 text-[11px]">
            <span className="font-bold text-slate-950 uppercase tracking-wider block text-[10px]">
              छात्रों हेतु आवश्यक दिशा-निर्देश:
            </span>
            <ul className="space-y-1 text-slate-700 pl-4 list-disc">
              {instructions.map((inst) => (
                <li key={`${templateKey}-${inst}`}>{inst}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t-2 border-slate-900 flex items-center justify-between text-[10px] text-slate-700">
          <div className="space-y-0.5">
            <span className="font-bold text-slate-950 block">आदेशानुसार / By Order:</span>
            <span>शाखा प्रबंधक (Branch Manager)</span>
            <span className="block text-[9px] text-slate-500">Helpline: +91 9876543210</span>
          </div>

          <div className="border-2 border-dashed border-slate-400 rounded-lg p-1.5 text-center w-24 h-12 flex flex-col items-center justify-center text-[8px] font-bold uppercase text-slate-600">
            <span>CENTRAL LIBRARY</span>
            <span>OFFICIAL SEAL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
