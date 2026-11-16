'use client';
// RESPONSIBILITY: Provide the compact, luxury-styled, multi-accented branch information view.
// It applies semantic color coding (Gold, Emerald, Purple, Cyan, Rose) and high-density, sleek layout hierarchy.
// Includes Student Wi-Fi Connect QR Code generation, printable front desk standee, and quick credential management.

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useManagerBranchInfoForm } from '@/app/frontend_manager/manager_settings/settings_branch_info/hooks/useManagerSettingsBranchInfoForm';
import {
  Building2,
  Building,
  MapPin,
  Phone,
  Mail,
  User,
  Clock,
  Hash,
  ShieldCheck,
  Calendar,
  Armchair,
  Layers,
  PhoneCall,
  LifeBuoy,
  History,
  Sparkles,
  Copy,
  Check,
  CalendarCheck,
  Share2,
  ArrowUpRight,
  Sun,
  Moon,
  Compass,
  Wifi,
  QrCode,
  Printer,
  Eye,
  EyeOff,
  Radio,
} from 'lucide-react';
import { ManagerSettingsBranchInfoWifiModal } from '@/app/frontend_manager/manager_settings/settings_branch_info/components/manager_settings_branch_info_modals/ManagerSettingsBranchInfoWifiModal';
import {
  generateQrMatrix,
  generateQrSvgPath,
  formatWifiQrPayload,
} from '@/app/frontend_manager/manager_settings/settings_branch_info/utils/ManagerSettingsBranchInfoWifiQr';

export default function ManagerSettingsBranchInfoPage() {
  const tManagerUi = useTranslations('manager.manager_branch_info.ui');
  const { branchData } = useManagerBranchInfoForm();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Student Wi-Fi Standee & Modal States
  const [isWifiModalOpen, setIsWifiModalOpen] = useState(false);
  const [showPagePassword, setShowPagePassword] = useState(false);
  const [wifiConfig, setWifiConfig] = useState<{
    ssid: string;
    password: string;
    security: 'WPA' | 'WEP' | 'nopass';
  }>({
    ssid: branchData.wifiSsid || 'SmartLibrary_Student_5G',
    password: branchData.wifiPassword || 'StudyHub@2026',
    security: (branchData.wifiSecurity || 'WPA') as 'WPA' | 'WEP' | 'nopass',
  });

  // Real-time on-page QR SVG generation
  const pageWifiPayload = useMemo(() => {
    return formatWifiQrPayload({
      ssid: wifiConfig.ssid,
      password: wifiConfig.password,
      security: wifiConfig.security,
    });
  }, [wifiConfig]);

  const pageQrSvg = useMemo(() => {
    const matrix = generateQrMatrix(pageWifiPayload, 'M');
    return generateQrSvgPath(matrix, 2);
  }, [pageWifiPayload]);

  const t = (key: string, fallback: string): string => {
    try {
      const val = tManagerUi(key);
      if (!val || val.startsWith('manager.manager_branch_info')) return fallback;
      return val;
    } catch {
      return fallback;
    }
  };

  const copyToClipboard = (text: string, label: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`${label} copied!`, { id: `copy-${key}` });
    setTimeout(() => {
      setCopiedKey((curr) => (curr === key ? null : curr));
    }, 1800);
  };

  const copyAllBranchDetails = () => {
    const fullSummary = [
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🏛️ ${branchData.branchName} [${branchData.branchCode}]`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `• Type: ${branchData.libraryType || 'Private Facility'}`,
      `• Capacity: ${branchData.totalSeatingCapacity} | Floors: ${branchData.totalFloors}`,
      `• Shifts: ${branchData.totalShifts}`,
      `• Schedule: ${branchData.workingHours}`,
      `• Address: ${branchData.address}`,
      `• Desk Phone: ${branchData.phone}`,
      `• Helpline Phone: ${branchData.supportPhone}`,
      `• Support Email: ${branchData.supportEmail}`,
      `• Student Wi-Fi (SSID): ${wifiConfig.ssid}`,
      `• Wi-Fi Password: ${wifiConfig.password}`,
      `• Manager: ${branchData.managerName}`,
      `• Established: ${branchData.establishmentDate}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ].join('\n');

    navigator.clipboard.writeText(fullSummary);
    toast.success('Complete branch summary copied!', { id: 'copy-all-branch-summary' });
  };

  return (
    <div className="mgr-page-animate relative pb-8 space-y-4 max-w-7xl mx-auto">
      {/* ── TOP COMPACT HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1 border-b border-white/5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5 tracking-tight">
            <Building2 className="text-amber-400 shrink-0" size={24} />
            <span>{t('branch_information', 'Branch Information')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('branch_info_subtitle', 'View branch details, seating capacity, operating shifts, and contact information.')}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Quick Wi-Fi Standee Button */}
          <button
            type="button"
            onClick={() => setIsWifiModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all cursor-pointer shadow-xs"
            title="Open Student Wi-Fi Front Desk Standee"
          >
            <Wifi size={13} className="text-amber-400" />
            <span>Wi-Fi Standee QR</span>
          </button>

          {/* Share Profile Button */}
          <button
            type="button"
            onClick={copyAllBranchDetails}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer shadow-xs"
            title="Copy complete branch profile to clipboard"
          >
            <Share2 size={13} className="text-amber-400" />
            <span>Share Profile</span>
          </button>
        </div>
      </div>

      {/* ── COMPACT LUXURY FACILITY HERO BANNER ── */}
      <div className="rounded-xl border border-white/10 bg-gradient-to-r from-[#0c0d24] via-[#0e1133] to-[#0a0c20] p-4 sm:p-5 shadow-lg relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            {/* Emblem / Logo */}
            {branchData.libraryLogo ? (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border border-amber-500/30 overflow-hidden shrink-0 bg-slate-900/80 flex items-center justify-center shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={branchData.libraryLogo}
                  alt={branchData.branchName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-indigo-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-md">
                <Building size={24} />
              </div>
            )}

            {/* Title & Badges */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {branchData.branchName}
                </h2>
                {/* Active Status Badge */}
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Branch
                </span>
              </div>

              {/* Meta pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                {/* Code Pill (Amber) */}
                <button
                  type="button"
                  onClick={() => copyToClipboard(branchData.branchCode, 'Branch Code', 'hero_code')}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-mono font-semibold border border-amber-500/25 transition-colors cursor-pointer group"
                  title="Click to copy code"
                >
                  <Hash size={11} className="text-amber-400" />
                  <span>{branchData.branchCode}</span>
                  {copiedKey === 'hero_code' ? (
                    <Check size={11} className="text-emerald-400 ml-0.5" />
                  ) : (
                    <Copy size={10} className="text-amber-400/60 group-hover:text-amber-300 ml-0.5" />
                  )}
                </button>

                {/* Facility Type (Purple) */}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 font-medium border border-purple-500/25">
                  <Sparkles size={11} className="text-purple-400" />
                  {branchData.libraryType || 'Private Study Hub'}
                </span>

                {/* Established Date (Slate) */}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 font-medium border border-slate-700/60">
                  <Calendar size={11} className="text-slate-400" />
                  Est. {branchData.establishmentDate || '2021'}
                </span>

                {/* Quick Wi-Fi Standee Badge (Cyan) */}
                <button
                  type="button"
                  onClick={() => setIsWifiModalOpen(true)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-medium border border-cyan-500/25 transition-all cursor-pointer"
                  title="Open Student Wi-Fi Front Desk Standee"
                >
                  <Wifi size={11} className="text-cyan-400" />
                  <span>Wi-Fi Standee QR</span>
                </button>
              </div>
            </div>
          </div>

          {/* Central Governance Badge */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-900/70 border border-slate-800 text-[11px] shrink-0 self-start md:self-auto">
            <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
            <div className="leading-tight">
              <span className="text-slate-200 font-semibold block">Central Master Record</span>
              <span className="text-slate-400 text-[10px] block">Governed by SuperAdmin</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4 COMPACT REFINED KPI METRICS CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* KPI 1: Seating Capacity (Warm Amber / Gold) */}
        <div className="rounded-xl border border-amber-500/20 bg-gradient-to-b from-[#161208]/80 to-[#0e0e1a]/90 p-3.5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300/80">
              Total Seating
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <Armchair size={14} />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-base sm:text-lg font-black text-white font-mono tracking-tight">
              {branchData.totalSeatingCapacity || '120 Seats'}
            </p>
            <p className="text-[11px] text-amber-200/60 mt-0.5">AC Study Desks</p>
          </div>
        </div>

        {/* KPI 2: Floor Layout (Royal Violet / Purple) */}
        <div className="rounded-xl border border-purple-500/20 bg-gradient-to-b from-[#140b22]/80 to-[#0e0e1a]/90 p-3.5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300/80">
              Floor Count
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
              <Layers size={14} />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-base sm:text-lg font-black text-white tracking-tight">
              {branchData.totalFloors || '2 Floors'}
            </p>
            <p className="text-[11px] text-purple-200/60 mt-0.5">Ground + 1st Floor</p>
          </div>
        </div>

        {/* KPI 3: Daily Shifts (Cyan / Sky) */}
        <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-b from-[#081724]/80 to-[#0e0e1a]/90 p-3.5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300/80">
              Daily Shifts
            </span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
              <Clock size={14} />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-base sm:text-lg font-black text-white tracking-tight">
              {branchData.totalShifts || '3 Shifts'}
            </p>
            <p className="text-[11px] text-cyan-200/60 mt-0.5">Morning · Eve · Night</p>
          </div>
        </div>

        {/* KPI 4: Operating Days & Schedule (Emerald Green) */}
        <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-b from-[#081a14]/80 to-[#0e0e1a]/90 p-3.5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
              Operating Schedule
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <CalendarCheck size={14} />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-base sm:text-lg font-black text-emerald-300 tracking-tight">
              All 7 Days Open
            </p>
            <p className="text-[11px] text-emerald-200/60 mt-0.5 truncate" title={branchData.workingHours}>
              {branchData.workingHours || '08:00 AM – 10:00 PM'}
            </p>
          </div>
        </div>
      </div>

      {/* ── 2-COLUMN MAIN CONTENT WORKSPACE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ── LEFT COLUMN (7 Cols): Operations, Shifts & Location ── */}
        <div className="lg:col-span-7 space-y-4">
          {/* Card: Facility Overview & Regional Parameters */}
          <div className="rounded-xl border border-white/10 bg-[#0b0c20]/90 p-4 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="flex items-center gap-2">
                <Compass size={15} className="text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Facility & Regional Parameters
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Read-Only</span>
            </div>

            {/* 4 Multi-Color Parameter Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {/* Branch Code (Amber) */}
              <div className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 flex flex-col justify-between">
                <span className="text-[10px] text-amber-300/80 font-medium">Branch Code</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono font-bold text-amber-300">{branchData.branchCode}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(branchData.branchCode, 'Code', 'inner_code')}
                    className="text-amber-400/70 hover:text-amber-300 cursor-pointer p-0.5"
                    title="Copy code"
                  >
                    {copiedKey === 'inner_code' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>

              {/* Facility Type (Purple) */}
              <div className="p-2.5 rounded-lg bg-purple-500/5 border border-purple-500/20 flex flex-col justify-between">
                <span className="text-[10px] text-purple-300/80 font-medium">Facility Classification</span>
                <span className="font-bold text-purple-200 mt-1">{branchData.libraryType || 'Private Study Hub'}</span>
              </div>

              {/* Time Zone (Cyan) */}
              <div className="p-2.5 rounded-lg bg-cyan-500/5 border border-cyan-500/20 flex flex-col justify-between">
                <span className="text-[10px] text-cyan-300/80 font-medium">Time Zone (IST)</span>
                <span className="font-semibold text-cyan-200 mt-1">{branchData.timezone || 'Asia/Kolkata (IST)'}</span>
              </div>

              {/* Currency (Emerald) */}
              <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 flex flex-col justify-between">
                <span className="text-[10px] text-emerald-300/80 font-medium">Billing Currency</span>
                <span className="font-bold font-mono text-emerald-300 mt-1">{branchData.currency || 'INR (₹)'}</span>
              </div>
            </div>

            {/* Shift Breakdown Section (Color Coded by Time of Day) */}
            <div className="space-y-2 pt-1 border-t border-white/5">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Clock size={12} className="text-cyan-400" />
                <span>Operating Shift Slots</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {/* Morning (Amber) */}
                <div className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-300 uppercase tracking-wide">
                    <Sun size={11} /> Morning Shift
                  </div>
                  <span className="font-bold text-white block text-xs mt-1">06:00 AM – 02:00 PM</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">8h Duration</span>
                </div>

                {/* Evening (Purple) */}
                <div className="p-2.5 rounded-lg bg-purple-500/5 border border-purple-500/20">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-300 uppercase tracking-wide">
                    <Moon size={11} /> Evening Shift
                  </div>
                  <span className="font-bold text-white block text-xs mt-1">02:00 PM – 10:00 PM</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">8h Duration</span>
                </div>

                {/* Full Day (Cyan) */}
                <div className="p-2.5 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-300 uppercase tracking-wide">
                    <Clock size={11} /> Full Day (24h)
                  </div>
                  <span className="font-bold text-white block text-xs mt-1">Dedicated Desks</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Reserved Seat</span>
                </div>
              </div>
            </div>

            {/* Physical Location Card */}
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <MapPin size={12} className="text-amber-400" />
                  <span>Physical Address</span>
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(branchData.address, 'Address', 'address_btn')}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'address_btn' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  <span>{copiedKey === 'address_btn' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {branchData.address}
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN (5 Cols): Wi-Fi QR Standee, Actionable Contacts & Audit ── */}
        <div className="lg:col-span-5 space-y-4">
          {/* ── HIGHLIGHTED CARD: STUDENT WI-FI CONNECT & FRONT DESK QR STANDEE ── */}
          <div className="rounded-xl border border-amber-500/30 bg-gradient-to-b from-[#181308]/90 via-[#0e0e1c]/95 to-[#0b0c20]/95 p-4 space-y-3.5 shadow-md relative overflow-hidden">
            {/* Subtle Golden Glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5 relative z-10">
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
                <Radio size={10} className="animate-pulse text-amber-400" />
                <span>5G Active</span>
              </span>
            </div>

            {/* Body: Live QR Code Thumbnail & Quick Credentials */}
            <div className="flex items-center gap-3.5 relative z-10">
              {/* Clickable QR Code Standee Preview Thumbnail */}
              <button
                type="button"
                onClick={() => setIsWifiModalOpen(true)}
                className="relative w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-xl p-2 shrink-0 border-2 border-amber-500/40 hover:border-amber-400 transition-all shadow-lg group cursor-pointer flex items-center justify-center"
                title="Click to view full standee & print"
              >
                <svg
                  viewBox={pageQrSvg.viewBox}
                  className="w-full h-full text-slate-900 group-hover:scale-105 transition-transform"
                  shapeRendering="crispEdges"
                >
                  <path d={pageQrSvg.path} fill="#0f172a" />
                </svg>
                {/* Center Badge Icon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-5 h-5 rounded-md bg-white border border-slate-900 shadow-xs flex items-center justify-center text-slate-900">
                    <Wifi size={10} />
                  </div>
                </div>
                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity flex flex-col items-center justify-center text-[10px] font-bold text-amber-300 gap-1">
                  <QrCode size={16} />
                  <span>Enlarge</span>
                </div>
              </button>

              {/* Wi-Fi Credentials Pill Box */}
              <div className="flex-1 min-w-0 space-y-2 text-xs">
                {/* Network SSID Row */}
                <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-amber-300/80 font-medium">
                      {t('wifi_ssid', 'Network Name (SSID)')}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(wifiConfig.ssid, 'Wi-Fi SSID', 'card_ssid')}
                      className="text-amber-400/80 hover:text-amber-300 cursor-pointer p-0.5"
                      title="Copy SSID"
                    >
                      {copiedKey === 'card_ssid' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    </button>
                  </div>
                  <span className="font-mono font-bold text-white text-xs truncate block mt-0.5">
                    {wifiConfig.ssid}
                  </span>
                </div>

                {/* Password Row */}
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
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
                        onClick={() => copyToClipboard(wifiConfig.password, 'Wi-Fi Password', 'card_pwd')}
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

            {/* Quick Actions Strip */}
            <div className="flex items-center gap-2 pt-1 border-t border-white/5 relative z-10">
              <button
                type="button"
                onClick={() => setIsWifiModalOpen(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-sm cursor-pointer"
              >
                <Printer size={13} />
                <span>{t('print_front_desk_standee', 'Print Desk Standee')}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsWifiModalOpen(true)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-semibold text-xs transition-all cursor-pointer"
                title="Open full standee view & scan instructions"
              >
                <QrCode size={13} className="text-cyan-400" />
                <span>Standee Preview</span>
              </button>
            </div>

            {/* Operational Impact Notice */}
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-300/90 flex items-center gap-1.5 relative z-10">
              <Sparkles size={11} className="text-emerald-400 shrink-0" />
              <span>{t('wifi_operations_hint', 'Eliminates repeated Wi-Fi queries to branch manager.')}</span>
            </div>
          </div>

          {/* Card: Contact Channels (Actionable with Semantic Colors) */}
          <div className="rounded-xl border border-white/10 bg-[#0b0c20]/90 p-4 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="flex items-center gap-2">
                <PhoneCall size={15} className="text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Contact & Support Channels
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-emerald-400">Direct Lines</span>
            </div>

            <div className="space-y-2 text-xs">
              {/* Branch Desk Phone (Sky Blue) */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-sky-500/5 border border-sky-500/20 gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-md bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0">
                    <Phone size={13} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 block">Branch Contact</span>
                    <span className="font-mono font-bold text-white text-xs truncate block">{branchData.phone}</span>
                  </div>
                </div>
                <a
                  href={`tel:${branchData.phone.replace(/\D/g, '')}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-[11px] font-semibold transition-all shrink-0 cursor-pointer"
                >
                  <span>Call</span>
                  <ArrowUpRight size={11} />
                </a>
              </div>

              {/* Branch Desk Email (Indigo) */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-indigo-500/5 border border-indigo-500/20 gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-md bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0">
                    <Mail size={13} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 block">Branch Email</span>
                    <span className="font-medium text-white text-xs truncate block">{branchData.email}</span>
                  </div>
                </div>
                <a
                  href={`mailto:${branchData.email}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[11px] font-semibold transition-all shrink-0 cursor-pointer"
                >
                  <span>Email</span>
                  <ArrowUpRight size={11} />
                </a>
              </div>

              {/* Student Support Phone Helpline (Rose / Warm) */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-rose-500/5 border border-rose-500/20 gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-md bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
                    <PhoneCall size={13} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-rose-300/80 font-medium block">Helpline / Support</span>
                    <span className="font-mono font-bold text-white text-xs truncate block">{branchData.supportPhone}</span>
                  </div>
                </div>
                <a
                  href={`tel:${branchData.supportPhone.replace(/\D/g, '')}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-semibold transition-all shrink-0 cursor-pointer"
                >
                  <span>Help</span>
                  <ArrowUpRight size={11} />
                </a>
              </div>

              {/* Student Support Email Helpdesk (Teal / Emerald) */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-teal-500/5 border border-teal-500/20 gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-md bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0">
                    <LifeBuoy size={13} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-teal-300/80 font-medium block">Support Desk</span>
                    <span className="font-medium text-white text-xs truncate block">{branchData.supportEmail}</span>
                  </div>
                </div>
                <a
                  href={`mailto:${branchData.supportEmail}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-[11px] font-semibold transition-all shrink-0 cursor-pointer"
                >
                  <span>Ticket</span>
                  <ArrowUpRight size={11} />
                </a>
              </div>
            </div>
          </div>

          {/* Card: Administration & Personnel In-Charge */}
          <div className="rounded-xl border border-white/10 bg-[#0b0c20]/90 p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <User size={15} className="text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Administration & Audit
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">Authorized</span>
            </div>

            {/* In-Charge Personnel Profile Strip */}
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                {branchData.managerName
                  ? branchData.managerName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                  : 'M'}
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <span className="text-xs font-bold text-white block truncate">{branchData.managerName}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Designated Branch Facility Manager</span>
              </div>
            </div>

            {/* 3 Compact Audit Rows */}
            <div className="space-y-1.5 text-[11px] pt-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-amber-400" />
                  <span>Establishment Date:</span>
                </span>
                <span className="font-semibold text-slate-200">{branchData.establishmentDate || '15 Aug 2021'}</span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <History size={12} className="text-purple-400" />
                  <span>Profile Created:</span>
                </span>
                <span className="font-semibold text-slate-200">{branchData.profileCreatedDate || '15 Jan 2023'}</span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock size={12} className="text-cyan-400" />
                  <span>Last System Sync:</span>
                </span>
                <span className="font-semibold text-slate-200">{branchData.lastUpdatedDate || '25 Oct 2026'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STUDENT WI-FI QR & DESK STANDEE MODAL ── */}
      <ManagerSettingsBranchInfoWifiModal
        isOpen={isWifiModalOpen}
        onClose={() => setIsWifiModalOpen(false)}
        branchName={branchData.branchName}
        branchCode={branchData.branchCode}
        managerName={branchData.managerName}
        managerPhone={branchData.phone}
        initialSsid={wifiConfig.ssid}
        initialPassword={wifiConfig.password}
        initialSecurity={wifiConfig.security}
        initialFrequency={branchData.wifiFrequency || 'Dual-Band 5 GHz / 2.4 GHz High-Speed'}
        onUpdateWifi={(updated) => setWifiConfig(updated)}
      />
    </div>
  );
}
