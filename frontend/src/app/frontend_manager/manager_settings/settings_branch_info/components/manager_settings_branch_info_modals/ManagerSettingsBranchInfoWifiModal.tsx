'use client';
// RESPONSIBILITY: Front Desk Student Wi-Fi QR Code Standee & Poster Modal.
// Provides a scannable Wi-Fi QR code, instant printable desk standee, 1-click copy, and live Wi-Fi configuration.

import React, { useState, useRef, useMemo } from 'react';
import { toast } from 'sonner';
import {
  Wifi,
  QrCode,
  Printer,
  Download,
  Copy,
  Check,
  Eye,
  EyeOff,
  X,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Radio,
  Edit3,
  RotateCcw,
  Info,
  CheckCircle2,
} from 'lucide-react';
import {
  generateQrMatrix,
  generateQrSvgPath,
  formatWifiQrPayload,
} from '@/app/frontend_manager/manager_settings/settings_branch_info/utils/ManagerSettingsBranchInfoWifiQr';

export interface ManagerSettingsBranchInfoWifiModalProps {
  isOpen: boolean;
  onClose: () => void;
  branchName: string;
  branchCode: string;
  managerName?: string;
  managerPhone?: string;
  initialSsid: string;
  initialPassword?: string;
  initialSecurity?: 'WPA' | 'WEP' | 'nopass';
  initialFrequency?: string;
  onUpdateWifi?: (updated: { ssid: string; password: string; security: 'WPA' | 'WEP' | 'nopass' }) => void;
}

export function ManagerSettingsBranchInfoWifiModal({
  isOpen,
  onClose,
  branchName,
  branchCode,
  managerName,
  managerPhone,
  initialSsid,
  initialPassword = '',
  initialSecurity = 'WPA',
  initialFrequency = 'Dual-Band 5 GHz / 2.4 GHz High-Speed',
  onUpdateWifi,
}: ManagerSettingsBranchInfoWifiModalProps) {
  const [ssid, setSsid] = useState(initialSsid);
  const [password, setPassword] = useState(initialPassword);
  const [security, setSecurity] = useState<'WPA' | 'WEP' | 'nopass'>(initialSecurity);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Compute QR Payload and SVG path
  const wifiPayload = useMemo(() => {
    return formatWifiQrPayload({
      ssid,
      password,
      security,
    });
  }, [ssid, password, security]);

  const { viewBox, path } = useMemo(() => {
    const matrix = generateQrMatrix(wifiPayload, 'M');
    return generateQrSvgPath(matrix, 3);
  }, [wifiPayload]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string, key: string) => {
    if (!text) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedKey(key);
    toast.success(`${label} copied!`, { id: `wifi-copy-${key}` });
    setTimeout(() => {
      setCopiedKey((curr) => (curr === key ? null : curr));
    }, 1800);
  };

  const copyFullShareText = () => {
    const text = [
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📶 ${branchName} — Student Wi-Fi`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `• Wi-Fi Network (SSID): ${ssid}`,
      `• Wi-Fi Password: ${password}`,
      `• Security: ${security}`,
      `• Speed Band: ${initialFrequency}`,
      `• Location: Front Desk / Study Desks`,
      `💡 Tip: Scan the front desk QR code with your phone camera to join automatically without typing!`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ].join('\n');

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    toast.success('Wi-Fi connection details copied for students!', { id: 'copy-wifi-share' });
  };

  const handlePrintStandee = () => {
    toast.info('Preparing Desk Standee for printing...', { id: 'print-standee' });
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleDownloadSvg = () => {
    if (!svgRef.current) return;
    try {
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(svgRef.current);
      if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${branchCode.toLowerCase()}-student-wifi-qr.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Wi-Fi QR Code vector SVG downloaded!');
    } catch {
      toast.error('Could not download QR Code file.');
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ssid.trim()) {
      toast.error('Wi-Fi SSID name cannot be empty');
      return;
    }
    setIsEditing(false);
    if (onUpdateWifi) {
      onUpdateWifi({ ssid: ssid.trim(), password, security });
    }
    toast.success('Wi-Fi configuration updated locally!');
  };

  const handleResetEdit = () => {
    setSsid(initialSsid);
    setPassword(initialPassword);
    setSecurity(initialSecurity);
    setIsEditing(false);
  };

  return (
    <>
      {/* ── PRINT-ONLY STYLES: Makes front desk standee print flawlessly ── */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #wifi-standee-print-zone, #wifi-standee-print-zone * {
            visibility: visible !important;
          }
          #wifi-standee-print-zone {
            position: fixed !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 90% !important;
            max-width: 520px !important;
            margin: 0 auto !important;
            padding: 32px !important;
            background: #ffffff !important;
            color: #0f172a !important;
            border: 3px double #0f172a !important;
            border-radius: 16px !important;
            box-shadow: none !important;
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
          className="relative w-full max-w-4xl rounded-2xl border border-white/15 bg-gradient-to-b from-[#0e1026] via-[#090b1c] to-[#060714] text-white shadow-2xl overflow-hidden my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* ── MODAL HEADER ── */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-cyan-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-xs">
                <Wifi size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Student Wi-Fi Connect QR Code
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Front Desk Standee
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Printable desk standee & scannable QR code for library students
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* ── MODAL BODY: 2-COLUMN VIEW (Left: Desk Standee Preview | Right: Controls & Details) ── */}
          <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ── LEFT COLUMN (6 cols): Live Desk Standee Card Preview ── */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90 mb-2 flex items-center gap-1.5 self-start">
                <Sparkles size={12} />
                <span>Front Desk Acrylic Standee Preview</span>
              </span>

              {/* ── THE PRINTABLE STANDEE / TENT CARD ── */}
              <div
                id="wifi-standee-print-zone"
                className="w-full max-w-sm rounded-2xl bg-white text-slate-900 p-5 sm:p-6 shadow-2xl border-4 border-slate-900 flex flex-col items-center text-center relative overflow-hidden"
              >
                {/* Decorative Top Banner */}
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

                {/* Scannable Vector QR Code */}
                <div className="my-4 p-3 bg-white rounded-xl border-2 border-slate-900 shadow-md relative">
                  <svg
                    ref={svgRef}
                    viewBox={viewBox}
                    className="w-48 h-48 sm:w-52 sm:h-52 text-slate-900"
                    shapeRendering="crispEdges"
                  >
                    <rect width="100%" height="100%" fill="#ffffff" />
                    <path d={path} fill="#000000" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-lg bg-white border-2 border-slate-900 shadow-md flex items-center justify-center text-slate-900">
                      <Wifi size={18} />
                    </div>
                  </div>
                </div>

                {/* Scan Instruction Callout */}
                <div className="w-full py-1.5 px-3 rounded-lg bg-amber-50 border border-amber-300 mb-3 flex items-center justify-center gap-1.5 text-[11px] font-bold text-amber-900">
                  <Smartphone size={13} className="text-amber-700 shrink-0" />
                  <span>Scan with Phone Camera to Auto-Connect</span>
                </div>

                {/* Credentials Badge for Manual Typing */}
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

                {/* Footer Notes on Standee */}
                <div className="mt-3 pt-2 border-t border-dashed border-slate-300 w-full text-[9px] text-slate-500 flex items-center justify-between">
                  <span>Authorized Library Facility</span>
                  {managerName && <span>Manager: {managerName}</span>}
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN (6 cols): Actions, Credentials & Quick Configuration ── */}
            <div className="lg:col-span-6 space-y-4">
              {/* Quick Actions Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {/* Print Button (Amber) */}
                <button
                  type="button"
                  onClick={handlePrintStandee}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer hover:shadow-amber-500/20"
                  title="Print Desk Standee for reception"
                >
                  <Printer size={15} />
                  <span>Print Standee</span>
                </button>

                {/* Download SVG */}
                <button
                  type="button"
                  onClick={handleDownloadSvg}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 font-semibold text-xs transition-all cursor-pointer"
                  title="Download vector SVG file"
                >
                  <Download size={14} className="text-cyan-400" />
                  <span>Download SVG</span>
                </button>

                {/* Share / Copy Details */}
                <button
                  type="button"
                  onClick={copyFullShareText}
                  className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 font-semibold text-xs transition-all cursor-pointer"
                  title="Copy formatted Wi-Fi text for WhatsApp"
                >
                  <Copy size={14} />
                  <span>Copy Text</span>
                </button>
              </div>

              {/* 3 Step Instructions Card */}
              <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3.5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Smartphone size={12} className="text-cyan-400" />
                  <span>Student Connect Instructions</span>
                </span>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-[10px] inline-flex items-center justify-center mb-1">
                      1
                    </span>
                    <p className="text-[10px] text-slate-300 font-medium">Open Camera or QR App</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px] inline-flex items-center justify-center mb-1">
                      2
                    </span>
                    <p className="text-[10px] text-slate-300 font-medium">Point at Front Desk QR</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] inline-flex items-center justify-center mb-1">
                      3
                    </span>
                    <p className="text-[10px] text-slate-300 font-medium">Tap &apos;Join Network&apos;</p>
                  </div>
                </div>
              </div>

              {/* Credentials & Copy Strips */}
              <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                    <Radio size={13} className="text-amber-400" />
                    <span>Active Wi-Fi Credentials</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 size={11} />
                    <span>{isEditing ? 'Cancel Edit' : 'Edit Credentials'}</span>
                  </button>
                </div>

                {!isEditing ? (
                  <div className="space-y-2 text-xs">
                    {/* SSID Row */}
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Network Name (SSID)</span>
                        <span className="font-mono font-bold text-amber-300 text-xs">{ssid}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(ssid, 'Network Name', 'modal_ssid')}
                        className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Copy SSID"
                      >
                        {copiedKey === 'modal_ssid' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>

                    {/* Password Row */}
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Wi-Fi Password</span>
                        <span className="font-mono font-bold text-white text-xs">
                          {showPassword ? password : '••••••••••••'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(password, 'Wi-Fi Password', 'modal_pwd')}
                          className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Copy Password"
                        >
                          {copiedKey === 'modal_pwd' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Security: <strong className="text-slate-200">{security}</strong></span>
                      <span>Frequency: <strong className="text-slate-200">5 GHz & 2.4 GHz</strong></span>
                    </div>
                  </div>
                ) : (
                  /* Edit Form */
                  <form onSubmit={handleSaveEdit} className="space-y-3 pt-1">
                    <div>
                      <label className="text-[10px] text-slate-300 font-semibold block mb-1">
                        Network Name (SSID) *
                      </label>
                      <input
                        type="text"
                        value={ssid}
                        onChange={(e) => setSsid(e.target.value)}
                        className="w-full text-xs px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-hidden focus:border-amber-400 font-mono"
                        placeholder="e.g. SmartLibrary_Student_5G"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-300 font-semibold block mb-1">
                        Wi-Fi Password
                      </label>
                      <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full text-xs px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-hidden focus:border-amber-400 font-mono"
                        placeholder="Leave blank for open network"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-300 font-semibold block mb-1">
                        Security Encryption
                      </label>
                      <select
                        value={security}
                        onChange={(e) => setSecurity(e.target.value as 'WPA' | 'WEP' | 'nopass')}
                        className="w-full text-xs px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-hidden focus:border-amber-400"
                      >
                        <option value="WPA">WPA / WPA2 / WPA3 (Recommended)</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">None (Open Network)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={handleResetEdit}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer"
                      >
                        Apply & Update QR
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Operational Impact Notice */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2.5">
                <Info size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Operations Tip:</strong> Place the printed standee at the reception desk. New students can connect their phones in seconds without asking the manager repeatedly for credentials.
                </p>
              </div>
            </div>
          </div>

          {/* ── MODAL FOOTER ── */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/10 bg-white/[0.02] text-xs">
            <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>Standard ISO/IEC 18004 Wi-Fi Connect Protocol</span>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-xs cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
