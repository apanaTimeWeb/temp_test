'use client';

import { ManagerSettingsBranchInfoStandeePreview } from '@/app/frontend_manager/manager_settings/settings_branch_info/components/manager_settings_branch_info_modals/ManagerSettingsBranchInfoStandeePreview';
import { ManagerSettingsBranchInfoWifiCredentialsCard } from '@/app/frontend_manager/manager_settings/settings_branch_info/components/manager_settings_branch_info_modals/ManagerSettingsBranchInfoWifiCredentialsCard';
import '@/app/frontend_manager/manager_settings/settings_branch_info/components/manager_settings_branch_info_styles/ManagerSettingsBranchInfoStyles.css';
import {
  formatWifiQrPayload,
  generateQrMatrix,
  generateQrSvgPath,
} from '@/app/frontend_manager/manager_settings/settings_branch_info/utils/ManagerSettingsBranchInfoWifiQr';
import { Copy, Download, Info, Printer, ShieldCheck, Smartphone, Wifi, X } from 'lucide-react';
import React, { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

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

const CONNECT_STEPS = [
  { step: 1, text: 'Open Camera or QR App', badgeCls: 'bg-cyan-500/20 text-cyan-400' },
  { step: 2, text: 'Point at Front Desk QR', badgeCls: 'bg-amber-500/20 text-amber-400' },
  { step: 3, text: "Tap 'Join Network'", badgeCls: 'bg-emerald-500/20 text-emerald-400' },
] as const;

export function ManagerSettingsBranchInfoWifiModal({
  isOpen,
  onClose,
  branchName,
  branchCode,
  managerName,
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

  const wifiPayload = useMemo(
    () => formatWifiQrPayload({ ssid, password, security }),
    [ssid, password, security]
  );

  const { viewBox, path } = useMemo(
    () => generateQrSvgPath(generateQrMatrix(wifiPayload, 'M'), 3),
    [wifiPayload]
  );

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
      toast.success('Wi-Fi QR Code vector SVG downloaded!', { id: 'wifi-qr-download-success' });
    } catch {
      toast.error('Could not download QR Code file.', { id: 'wifi-qr-download-error' });
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ssid.trim()) {
      toast.error('Wi-Fi SSID name cannot be empty', { id: 'wifi-config-ssid-error' });
      return;
    }
    setIsEditing(false);
    if (onUpdateWifi) {
      onUpdateWifi({ ssid: ssid.trim(), password, security });
    }
    toast.success('Wi-Fi configuration updated locally!', { id: 'wifi-config-updated' });
  };

  const handleResetEdit = () => {
    setSsid(initialSsid);
    setPassword(initialPassword);
    setSecurity(initialSecurity);
    setIsEditing(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-overlay-backdrop backdrop-blur-md overflow-y-auto no-print"
      onClick={onClose}
    >
      <div
        className="mgr-wifi-modal-surface relative w-full max-w-4xl rounded-2xl border text-white shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="mgr-wifi-modal-header flex items-center justify-between px-5 py-4 border-b">
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
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
                  Front Desk Standee
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Printable desk standee &amp; scannable QR code for library students
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center motion-safe:transition-colors cursor-pointer"
            title="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <ManagerSettingsBranchInfoStandeePreview
            svgRef={svgRef}
            branchName={branchName}
            branchCode={branchCode}
            managerName={managerName}
            ssid={ssid}
            password={password}
            initialFrequency={initialFrequency}
            viewBox={viewBox}
            path={path}
          />

          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handlePrintStandee}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 border border-indigo-500 text-white font-bold text-xs motion-safe:transition-all shadow-md cursor-pointer"
                title="Print Desk Standee for reception"
              >
                <Printer size={15} />
                <span>Print Standee</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadSvg}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs motion-safe:transition-all cursor-pointer"
                title="Download vector SVG file"
              >
                <Download size={14} className="text-cyan-400" />
                <span>Download SVG</span>
              </button>

              <button
                type="button"
                onClick={copyFullShareText}
                className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 font-semibold text-xs motion-safe:transition-all cursor-pointer"
                title="Copy formatted Wi-Fi text for WhatsApp"
              >
                <Copy size={14} />
                <span>Copy Text</span>
              </button>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-900 p-3.5 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Smartphone size={12} className="text-cyan-400" />
                <span>Student Connect Instructions</span>
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {CONNECT_STEPS.map((item) => (
                  <div key={item.step} className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                    <span className={`w-5 h-5 rounded-full font-bold text-[10px] inline-flex items-center justify-center mb-1 ${item.badgeCls}`}>
                      {item.step}
                    </span>
                    <p className="text-[10px] text-slate-300 font-medium">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <ManagerSettingsBranchInfoWifiCredentialsCard
              ssid={ssid}
              setSsid={setSsid}
              password={password}
              setPassword={setPassword}
              security={security}
              setSecurity={setSecurity}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              copiedKey={copiedKey}
              onCopy={copyToClipboard}
              onSaveEdit={handleSaveEdit}
              onResetEdit={handleResetEdit}
            />

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2.5">
              <Info size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong>Operations Tip:</strong> Place the printed standee at the reception desk. New students can connect their phones in seconds without asking the manager repeatedly for credentials.
              </p>
            </div>
          </div>
        </div>

        <div className="mgr-wifi-modal-footer flex items-center justify-between px-5 py-3 border-t text-xs">
          <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>Standard ISO/IEC 18004 Wi-Fi Connect Protocol</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs cursor-pointer motion-safe:transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
