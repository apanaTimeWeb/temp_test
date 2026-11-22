'use client';
// RESPONSIBILITY: Professional Cyber-Luxury Modal Popup displaying 12-resource quota breakdown.
// Fixed header, scrollable body (all 12 resources), and fixed footer ensure first-to-last content visibility.

import React, { useEffect } from 'react';
import {
  X,
  Building2,
  Users,
  HardDrive,
  MessageSquare,
  Mail,
  Zap,
  Download,
  Database,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  Gauge,
  CheckCircle2,
  AlertOctagon,
} from 'lucide-react';
import Link from 'next/link';
import type { LibraryUsageRecord } from '../types/SuperadminUsageOverviewTypes';
import { calculateUsagePercent, getQuotaColorClasses } from '../utils/SuperadminUsageOverviewFormatters';
import { OVERAGE_POLICIES } from '../constants/SuperadminUsageOverviewConstants';
import { SUPERADMIN_USAGE_OVERVIEW_ROUTES } from '../config/superadmin_usage_overview.url_config';

interface SuperadminUsageOverviewDetailDrawerProps {
  library: LibraryUsageRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SuperadminUsageOverviewDetailDrawer({
  library,
  isOpen,
  onClose,
}: SuperadminUsageOverviewDetailDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !library) return null;

  const policy = OVERAGE_POLICIES[library.overagePolicy] ?? OVERAGE_POLICIES.HARD_STOP;

  const resources = [
    { num: '01', title: 'Branch Usage', cur: library.branchUsage.current, max: library.branchUsage.limit, unit: 'branches', icon: Building2, status: library.branchUsage.status, extra: library.branchUsage.details },
    { num: '02', title: 'Admin Accounts', cur: library.adminUsage.current, max: library.adminUsage.limit, unit: 'admins', icon: ShieldCheck, status: library.adminUsage.status },
    { num: '03', title: 'Staff Accounts', cur: library.staffUsage.current, max: library.staffUsage.limit, unit: 'staff', icon: Users, status: library.staffUsage.status },
    { num: '04', title: 'Active Members', cur: library.memberUsage.current, max: library.memberUsage.limit, unit: 'members', icon: Users, status: library.memberUsage.status },
    { num: '05', title: 'Cloud Storage', cur: library.storageUsage.current, max: library.storageUsage.limit, unit: 'GB', icon: HardDrive, status: library.storageUsage.status },
    { num: '06', title: 'File Uploads', cur: library.fileUploadUsage.fileCount, max: library.fileUploadUsage.fileCountLimit, unit: 'files', icon: HardDrive, status: library.fileUploadUsage.status, extra: `${library.fileUploadUsage.current} GB volume` },
    { num: '07', title: 'SMS Credits', cur: library.smsUsage.current, max: library.smsUsage.limit, unit: 'credits', icon: MessageSquare, status: library.smsUsage.status },
    { num: '08', title: 'WhatsApp Messages', cur: library.whatsappUsage.current, max: library.whatsappUsage.limit, unit: 'messages', icon: MessageSquare, status: library.whatsappUsage.status },
    { num: '09', title: 'Email Sending', cur: library.emailUsage.sentCount, max: library.emailUsage.monthlyLimit, unit: 'emails/mo', icon: Mail, status: library.emailUsage.status, extra: `Delivery: ${library.emailUsage.deliveryRatePercent}% • Bounce: ${library.emailUsage.bounceRatePercent}%` },
    { num: '10', title: 'API Requests', cur: library.apiUsage.monthlyCalls, max: library.apiUsage.monthlyLimit, unit: 'calls/mo', icon: Zap, status: library.apiUsage.status, extra: `Daily: ${library.apiUsage.dailyCalls.toLocaleString()} • Rate Limit: ${library.apiUsage.rateLimitPerMinute}/min` },
    { num: '11', title: 'Data Exports', cur: library.exportUsage.monthlyExportsCount, max: library.exportUsage.monthlyExportsLimit, unit: 'exports/mo', icon: Download, status: library.exportUsage.status, extra: `Volume: ${library.exportUsage.dataExportedMb} MB` },
    { num: '12', title: 'Automated Backups', cur: library.backupUsage.backupSizeGb, max: library.backupUsage.backupSizeLimitGb, unit: 'GB', icon: Database, status: library.backupUsage.status, extra: `Snapshots: ${library.backupUsage.snapshotCount} • Status: ${library.backupUsage.backupStatus}` },
  ];

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="usage-detail-modal-title"
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-indigo-500/30 bg-[#0a0d24] text-white shadow-2xl shadow-indigo-950/80 backdrop-blur-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Fixed Modal Header (First Content - Always Visible) ── */}
        <div className="shrink-0 p-5 sm:p-6 border-b border-indigo-500/20 bg-[#060818]/95 backdrop-blur-md flex items-center justify-between gap-3 shadow-md z-10">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center shadow-lg shadow-sky-500/20 shrink-0">
              <Gauge size={22} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 id="usage-detail-modal-title" className="text-base sm:text-lg font-black text-white tracking-tight truncate">
                  {library.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30 shrink-0">
                  {library.planName}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium truncate">
                12-Resource Granular Quota Breakdown • ID: <span className="font-mono text-slate-300">{library.id}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer shrink-0"
            aria-label="Close quota inspection modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Scrollable Body Content (All 12 Resources + Overage Status) ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-5 scrollbar-thin">
          {/* Active Overage Policy & Hard-Stop Box */}
          <div className="rounded-2xl border border-indigo-500/25 bg-slate-950/70 p-4 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> Active Overage Policy
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-xs ${policy.badgeClass}`}>
                {policy.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{policy.description}</p>
            
            {library.pendingRequestNote && (
              <div className="mt-2.5 p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-200 flex items-start gap-2.5 shadow-xs">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-300">Pending Add-On Request:</span> {library.pendingRequestNote}
                </div>
              </div>
            )}
          </div>

          {/* Quick 4-Metric Telemetry Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl border border-sky-500/25 bg-sky-950/20 text-center">
              <span className="text-[10px] uppercase font-bold text-sky-400">Branches</span>
              <div className="text-sm sm:text-base font-black text-white mt-0.5">
                {library.branchUsage.current} / {library.branchUsage.limit}
              </div>
            </div>
            <div className="p-3 rounded-xl border border-indigo-500/25 bg-indigo-950/20 text-center">
              <span className="text-[10px] uppercase font-bold text-indigo-400">Admins & Staff</span>
              <div className="text-sm sm:text-base font-black text-white mt-0.5">
                {library.adminUsage.current + library.staffUsage.current} / {library.adminUsage.limit + library.staffUsage.limit}
              </div>
            </div>
            <div className="p-3 rounded-xl border border-emerald-500/25 bg-emerald-950/20 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-400">Members</span>
              <div className="text-sm sm:text-base font-black text-white mt-0.5">
                {library.memberUsage.current} / {library.memberUsage.limit}
              </div>
            </div>
            <div className="p-3 rounded-xl border border-purple-500/25 bg-purple-950/20 text-center">
              <span className="text-[10px] uppercase font-bold text-purple-400">Cloud Storage</span>
              <div className="text-sm sm:text-base font-black text-white mt-0.5">
                {library.storageUsage.current} / {library.storageUsage.limit} GB
              </div>
            </div>
          </div>

          {/* 12 Resources Granular Utilization Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                <span>12 Resource Utilization Monitors</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-500">All Live telemetry</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {resources.map((res) => {
                const pct = calculateUsagePercent(res.cur, res.max);
                const colors = getQuotaColorClasses(res.status);
                const Icon = res.icon;

                return (
                  <div
                    key={res.num}
                    className="p-3.5 rounded-2xl border border-indigo-500/20 bg-slate-950/60 space-y-2 hover:border-indigo-500/40 transition-colors shadow-xs"
                  >
                    <div className="flex items-center justify-between text-xs flex-wrap gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400 font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-indigo-500/20">
                          {res.num}
                        </span>
                        <Icon className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-bold text-slate-200">{res.title}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className={`font-bold ${colors.text}`}>
                          {res.cur.toLocaleString()} / {res.max.toLocaleString()} {res.unit}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">({pct}%)</span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-900 border border-indigo-500/15 h-2 rounded-full overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 shadow-xs ${colors.bar}`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>

                    {res.extra && (
                      <div className="text-[10px] text-slate-400 flex items-center justify-between pt-0.5 flex-wrap gap-1">
                        <span>{res.extra}</span>
                        {pct >= 100 ? (
                          <span className="text-rose-400 font-bold px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center gap-1">
                            <AlertOctagon size={11} /> Hard Limit Hit
                          </span>
                        ) : pct >= 80 ? (
                          <span className="text-amber-400 font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center gap-1">
                            <AlertTriangle size={11} /> High Utilization
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle2 size={11} /> Normal
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Fixed Modal Footer (Last Content - Always Visible) ── */}
        <div className="shrink-0 p-4 sm:p-5 border-t border-indigo-500/20 bg-[#060818]/95 backdrop-blur-md flex items-center justify-between gap-3 shadow-lg z-10">
          <Link
            href={SUPERADMIN_USAGE_OVERVIEW_ROUTES.quotaRequests}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border border-amber-500/40 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            Review Quota Requests <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-white transition-all cursor-pointer shadow-xs active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}