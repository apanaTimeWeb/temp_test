'use client';

import { Smartphone, Wifi } from 'lucide-react';
import type { RefObject } from 'react';

interface ManagerSettingsBranchInfoStandeePreviewProps {
  svgRef: RefObject<SVGSVGElement>;
  branchName: string;
  branchCode: string;
  managerName?: string;
  ssid: string;
  password: string;
  initialFrequency: string;
  viewBox: string;
  path: string;
}

/** Printable front-desk Wi-Fi acrylic standee preview card with vector SVG QR code. */
export function ManagerSettingsBranchInfoStandeePreview({
  svgRef,
  branchName,
  branchCode,
  managerName,
  ssid,
  password,
  initialFrequency,
  viewBox,
  path,
}: ManagerSettingsBranchInfoStandeePreviewProps) {
  return (
    <div className="lg:col-span-6 flex flex-col items-center">
      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5 self-start">
        <Wifi size={12} />
        <span>Front Desk Acrylic Standee Preview</span>
      </span>

      <div
        id="wifi-standee-print-zone"
        className="w-full max-w-sm rounded-2xl bg-white text-slate-900 p-5 sm:p-6 shadow-2xl border-4 border-slate-900 flex flex-col items-center text-center relative overflow-hidden"
      >
        <div className="w-full pb-3 border-b-2 border-slate-900 flex flex-col items-center">
          <div className="flex items-center gap-2">
            <Wifi size={18} className="text-amber-600" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-900">
              High-Speed Student Wi-Fi
            </span>
          </div>
          <h3 className="text-base font-extrabold text-slate-900 mt-1 tracking-tight">
            {branchName}
          </h3>
          <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-300 text-[10px] font-mono font-bold text-slate-700">
            <span>{branchCode}</span>
            <span>•</span>
            <span>Study Zone Free Access</span>
          </div>
        </div>

        <div className="my-4 p-3 bg-white rounded-xl border-2 border-slate-900 shadow-md relative">
          <svg
            ref={svgRef}
            viewBox={viewBox}
            className="w-48 h-48 sm:w-52 sm:h-52 text-slate-900"
            shapeRendering="crispEdges"
          >
            <rect width="100%" height="100%" className="fill-white" />
            <path d={path} className="fill-slate-950" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-10 h-10 rounded-lg bg-white border-2 border-slate-900 shadow-md flex items-center justify-center text-slate-900">
              <Wifi size={18} />
            </div>
          </div>
        </div>

        <div className="w-full py-1.5 px-3 rounded-lg bg-amber-50 border border-amber-300 mb-3 flex items-center justify-center gap-1.5 text-[11px] font-bold text-amber-900">
          <Smartphone size={13} className="text-amber-700 shrink-0" />
          <span>Scan with Phone Camera to Auto-Connect</span>
        </div>

        <div className="w-full rounded-xl bg-slate-50 border border-slate-300 p-2.5 text-left space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-500">Wi-Fi Network (SSID):</span>
            <span className="font-mono font-black text-slate-900 text-xs">{ssid}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-500">Password:</span>
            <span className="font-mono font-black text-slate-900 text-xs">
              {password || '(No Password / Open)'}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[10px] text-slate-500">
            <span>Frequency: {initialFrequency}</span>
            <span className="font-semibold text-emerald-700">● 5G Online</span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-dashed border-slate-300 w-full text-[9px] text-slate-500 flex items-center justify-between">
          <span>Authorized Library Facility</span>
          {managerName && <span>Manager: {managerName}</span>}
        </div>
      </div>
    </div>
  );
}
