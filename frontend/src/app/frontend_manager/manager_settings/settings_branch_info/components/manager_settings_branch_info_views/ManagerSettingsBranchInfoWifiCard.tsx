'use client';

import { Check, CheckCircle2, Copy, Eye, EyeOff, Printer, QrCode, Radio, Wifi } from 'lucide-react';

interface ManagerSettingsBranchInfoWifiCardProps {
  wifiConfig: { ssid: string; password: string; security: 'WPA' | 'WEP' | 'nopass' };
  pageQrSvg: { viewBox: string; path: string };
  showPagePassword: boolean;
  setShowPagePassword: (val: boolean) => void;
  copiedKey: string | null;
  onCopy: (text: string, label: string, key: string) => void;
  onOpenModal: () => void;
  t: (key: string, fallback: string) => string;
}

/** Highlighted card showing student Wi-Fi QR thumbnail, credentials, and standee modal actions. */
export function ManagerSettingsBranchInfoWifiCard({
  wifiConfig,
  pageQrSvg,
  showPagePassword,
  setShowPagePassword,
  copiedKey,
  onCopy,
  onOpenModal,
  t,
}: ManagerSettingsBranchInfoWifiCardProps) {
  return (
    <div className="mgr-branch-wifi-surface rounded-xl border p-4 space-y-3.5 shadow-md relative overflow-hidden">
      <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Wifi size={14} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>{t('student_wifi_connect', 'Student Wi-Fi Connect')}</span>
            </h3>
            <span className="text-[10px] text-slate-400 block">
              {t('wifi_qr_code', 'Front Desk QR Code Standee')}
            </span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
          <Radio size={10} className="motion-safe:animate-pulse text-amber-400" />
          <span>5G Active</span>
        </span>
      </div>

      <div className="flex items-center gap-3.5 relative z-10">
        <button
          type="button"
          onClick={onOpenModal}
          className="relative w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-xl p-2 shrink-0 border-2 border-amber-500/40 hover:border-amber-400 motion-safe:transition-all shadow-lg group cursor-pointer flex items-center justify-center"
          title="Click to view full standee & print"
        >
          <svg
            viewBox={pageQrSvg.viewBox}
            className="w-full h-full text-slate-900 group-hover:scale-105 motion-safe:transition-transform"
            shapeRendering="crispEdges"
          >
            <path d={pageQrSvg.path} className="fill-slate-900" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-5 h-5 rounded-md bg-white border border-slate-900 shadow-xs flex items-center justify-center text-slate-900">
              <Wifi size={10} />
            </div>
          </div>
          <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 rounded-xl motion-safe:transition-opacity flex flex-col items-center justify-center text-[10px] font-bold text-amber-300 gap-1">
            <QrCode size={16} />
            <span>Enlarge</span>
          </div>
        </button>

        <div className="flex-1 min-w-0 space-y-2 text-xs">
          <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-amber-300 font-medium">
                {t('wifi_ssid', 'Network Name (SSID)')}
              </span>
              <button
                type="button"
                onClick={() => onCopy(wifiConfig.ssid, 'Wi-Fi SSID', 'card_ssid')}
                className="text-amber-400 hover:text-amber-300 cursor-pointer p-0.5"
                title="Copy SSID"
              >
                {copiedKey === 'card_ssid' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
              </button>
            </div>
            <span className="font-mono font-bold text-white text-xs truncate block mt-0.5">
              {wifiConfig.ssid}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-medium">
                {t('wifi_password', 'Password')}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowPagePassword(!showPagePassword)}
                  className="text-slate-400 hover:text-slate-200 cursor-pointer p-0.5"
                  title={showPagePassword ? 'Hide password' : 'Show password'}
                >
                  {showPagePassword ? <EyeOff size={11} /> : <Eye size={11} />}
                </button>
                <button
                  type="button"
                  onClick={() => onCopy(wifiConfig.password, 'Wi-Fi Password', 'card_pwd')}
                  className="text-slate-400 hover:text-amber-300 cursor-pointer p-0.5"
                  title="Copy Password"
                >
                  {copiedKey === 'card_pwd' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                </button>
              </div>
            </div>
            <span className="font-mono font-bold text-amber-300 text-xs truncate block mt-0.5">
              {showPagePassword ? wifiConfig.password : '••••••••••••'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1 border-t border-slate-800 relative z-10">
        <button
          type="button"
          onClick={onOpenModal}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 text-white font-bold text-xs motion-safe:transition-all shadow-md cursor-pointer"
        >
          <Printer size={13} />
          <span>{t('print_front_desk_standee', 'Print Desk Standee')}</span>
        </button>
        <button
          type="button"
          onClick={onOpenModal}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs motion-safe:transition-all cursor-pointer"
          title="Open full standee view & scan instructions"
        >
          <QrCode size={13} className="text-cyan-400" />
          <span>Standee Preview</span>
        </button>
      </div>

      <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-300 flex items-center gap-1.5 relative z-10">
        <CheckCircle2 size={11} className="text-emerald-400 shrink-0" />
        <span>{t('wifi_operations_hint', 'Eliminates repeated Wi-Fi queries to branch manager.')}</span>
      </div>
    </div>
  );
}
