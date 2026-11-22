'use client';
/**
 * Responsibility: Render responsive, realistic multi-surface mockups for settings branding preview.
 * Data-Flow: Parent form state -> SuperadminSettingsBrandingLivePreviewCards -> dynamic CSS variable consumption.
 */
import type { FC } from 'react';
import { CreditCard, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

interface SuperadminSettingsBrandingLivePreviewCardsProps {
  libraryName: string;
  tagline?: string;
  activeTab: 'all' | 'sidebar' | 'login' | 'idcard';
  tCopy: (key: string) => string;
}

export const SuperadminSettingsBrandingLivePreviewCards: FC<SuperadminSettingsBrandingLivePreviewCardsProps> = ({
  libraryName,
  tagline,
  activeTab,
  tCopy,
}) => {
  const displayTitle = libraryName.trim() || tCopy('COPY.BRANDING_DEFAULT_LIBRARY');
  const displayTagline = tagline?.trim() || tCopy('COPY.YOUR_TAGLINE_HERE');

  const showSidebar = activeTab === 'all' || activeTab === 'sidebar';
  const showLogin = activeTab === 'all' || activeTab === 'login';
  const showIdCard = activeTab === 'all' || activeTab === 'idcard';

  return (
    <div className="w-full space-y-6">
      {/* Mini Sidebar Preview */}
      {showSidebar && (
        <div className="rounded-2xl border border-indigo-500/25 bg-slate-950/60 p-4 sm:p-5 backdrop-blur-md shadow-lg transition-all hover:border-indigo-500/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              {tCopy('COPY.SIDEBAR')} Preview
            </span>
            <span className="text-[11px] font-medium text-slate-400">Navigation Shell</span>
          </div>
          <div className="w-full max-w-sm rounded-xl border border-indigo-500/20 bg-slate-950 shadow-2xl overflow-hidden">
            <div className="p-3.5 flex items-center gap-3 border-b border-indigo-500/15">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center text-xl font-bold sys-preview-icon shrink-0 shadow-lg">
                📚
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-100 leading-tight truncate">{displayTitle}</p>
                {tagline && <p className="text-[11px] text-slate-400 leading-tight truncate mt-0.5">{tagline}</p>}
              </div>
            </div>
            <div className="p-2 space-y-1">
              {['Dashboard', 'Students', 'Finance', 'Reports'].map((item, i) => (
                <div
                  key={item}
                  className={`px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    i === 0
                      ? 'sys-preview-nav-active font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`h-2 w-2 rounded-full ${i === 0 ? 'sys-preview-dot-active' : 'sys-preview-dot-inactive'}`} />
                    <span>{item}</span>
                  </div>
                  {i === 0 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">Live</span>}
                </div>
              ))}
            </div>
            <div className="p-3 bg-slate-900/40 border-t border-indigo-500/15 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Online
              </span>
              <span className="font-mono text-slate-500">v2.4 Enterprise</span>
            </div>
          </div>
        </div>
      )}

      {/* Mini Login Preview */}
      {showLogin && (
        <div className="rounded-2xl border border-indigo-500/25 bg-slate-950/60 p-4 sm:p-5 backdrop-blur-md shadow-lg transition-all hover:border-indigo-500/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Lock size={13} className="text-purple-400" />
              {tCopy('COPY.LOGIN_PAGE')} Mockup
            </span>
            <span className="text-[11px] font-medium text-slate-400">Public Portal</span>
          </div>
          <div className="w-full max-w-sm rounded-xl border border-indigo-500/25 bg-slate-950 shadow-2xl overflow-hidden">
            {/* Browser chrome header */}
            <div className="px-3 py-2 bg-slate-900/90 border-b border-indigo-500/20 flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-[10px] text-indigo-300 font-mono bg-slate-950/80 px-3 py-0.5 rounded-full border border-indigo-500/20">
                  https://app.libraryos.com/login
                </span>
              </div>
            </div>

            {/* Login card body */}
            <div className="p-5 flex flex-col items-center bg-slate-950/80">
              <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-2xl font-bold sys-preview-icon mb-3 shadow-md">
                📚
              </div>
              <h4 className="text-sm font-extrabold text-slate-100 text-center">{displayTitle}</h4>
              <p className="text-[11px] text-slate-400 text-center mt-0.5 mb-4 line-clamp-1">{displayTagline}</p>

              {/* Login inputs: UNIFORMLY DARK, NEVER WHITE */}
              <div className="w-full space-y-2.5 mb-4">
                <div className="h-9 rounded-xl bg-slate-900 border border-indigo-500/25 px-3 flex items-center text-xs text-slate-300">
                  admin@library.org
                </div>
                <div className="h-9 rounded-xl bg-slate-900 border border-indigo-500/25 px-3 flex items-center justify-between text-xs text-slate-300">
                  <span>••••••••••••</span>
                  <Lock size={12} className="text-indigo-400" />
                </div>
              </div>

              <div
                className="sys-preview-login-btn w-full py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer text-center"
                role="button"
                tabIndex={0}
              >
                {tCopy('COPY.LOGIN')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mini ID Card Preview */}
      {showIdCard && (
        <div className="rounded-2xl border border-indigo-500/25 bg-slate-950/60 p-4 sm:p-5 backdrop-blur-md shadow-lg transition-all hover:border-indigo-500/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <CreditCard size={13} className="text-purple-400" />
              {tCopy('COPY.STUDENT_ID_CARD')} Pass
            </span>
            <span className="text-[11px] font-medium text-slate-400">NFC / Barcode PVC</span>
          </div>

          <div className="w-full max-w-sm rounded-2xl border border-indigo-500/30 bg-slate-950 shadow-2xl overflow-hidden relative">
            {/* Lanyard punch slot */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-1.5 rounded-full bg-slate-900 border border-white/20 z-10" />

            {/* Header banner */}
            <div className="sys-preview-id-header pt-4 pb-3 px-4 flex items-center justify-between relative shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-black/20 backdrop-blur-md flex items-center justify-center text-base shrink-0 shadow-xs">
                  📚
                </div>
                <div>
                  <p className="sys-preview-id-title font-black tracking-tight">{displayTitle}</p>
                  <p className="sys-preview-id-subtitle tracking-wider uppercase font-semibold">{tCopy('COPY.STUDENT_IDENTITY_CARD')}</p>
                </div>
              </div>
              <ShieldCheck size={18} className="text-black/80 shrink-0" />
            </div>

            {/* Card Main Body */}
            <div className="p-4 flex items-center gap-3.5 bg-slate-950">
              <div className="relative shrink-0">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 border-2 border-indigo-500/30 flex items-center justify-center text-2xl shadow-inner">
                  👤
                </div>
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-[9px] text-white font-bold">
                  ✓
                </div>
              </div>

              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="text-sm font-extrabold text-slate-100 leading-tight truncate">{tCopy('COPY.SAMPLE_STUDENT')}</p>
                <p className="text-xs font-semibold text-slate-400">{tCopy('COPY.SAMPLE_ID_SAMPLE_0042_SAMPLE_SHIFT')}</p>
                <div className="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-md bg-slate-900 border border-indigo-500/25">
                  <span className="text-[10px] text-slate-400">{tCopy('COPY.SAMPLE_VALIDITY_DATE_JUNE_2026')}</span>
                </div>
              </div>
            </div>

            {/* Barcode & Security Strip Footer */}
            <div className="px-4 py-2.5 bg-slate-900/70 border-t border-indigo-500/20 flex items-center justify-between">
              <div className="flex items-center gap-1 font-mono text-[9px] text-slate-500 tracking-widest">
                |||||| | |||| || |||||
              </div>
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-1">
                <CheckCircle2 size={11} className="text-amber-400" />
                VERIFIED PASS
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
