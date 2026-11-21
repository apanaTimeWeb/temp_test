'use client';
// RESPONSIBILITY: Render slide-over drawer showing granular 12-resource breakdown for a selected library.

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
    { num: '06', title: 'File Uploads', cur: library.fileUploadUsage.fileCount, max: library.fileUploadUsage.fileCountLimit, unit: 'files', icon: HardDrive, status: library.fileUploadUsage.status, extra: `${library.fileUploadUsage.current} GB size` },
    { num: '07', title: 'SMS Credits', cur: library.smsUsage.current, max: library.smsUsage.limit, unit: 'credits', icon: MessageSquare, status: library.smsUsage.status },
    { num: '08', title: 'WhatsApp Messages', cur: library.whatsappUsage.current, max: library.whatsappUsage.limit, unit: 'messages', icon: MessageSquare, status: library.whatsappUsage.status },
    { num: '09', title: 'Email Sending', cur: library.emailUsage.sentCount, max: library.emailUsage.monthlyLimit, unit: 'emails/mo', icon: Mail, status: library.emailUsage.status, extra: `Delivery: ${library.emailUsage.deliveryRatePercent}% • Bounce: ${library.emailUsage.bounceRatePercent}%` },
    { num: '10', title: 'API Requests', cur: library.apiUsage.monthlyCalls, max: library.apiUsage.monthlyLimit, unit: 'calls/mo', icon: Zap, status: library.apiUsage.status, extra: `Daily: ${library.apiUsage.dailyCalls.toLocaleString()} • Rate Limit: ${library.apiUsage.rateLimitPerMinute}/min` },
    { num: '11', title: 'Data Exports', cur: library.exportUsage.monthlyExportsCount, max: library.exportUsage.monthlyExportsLimit, unit: 'exports/mo', icon: Download, status: library.exportUsage.status, extra: `Volume: ${library.exportUsage.dataExportedMb} MB` },
    { num: '12', title: 'Automated Backups', cur: library.backupUsage.backupSizeGb, max: library.backupUsage.backupSizeLimitGb, unit: 'GB', icon: Database, status: library.backupUsage.status, extra: `Snapshots: ${library.backupUsage.snapshotCount} • Status: ${library.backupUsage.backupStatus}` },
  ];

  return (
    <div
      className="fixed inset-0 z-[120] flex justify-end bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-xl h-full bg-[#0a0d24] border-l border-indigo-500/30 flex flex-col shadow-2xl shadow-indigo-950/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Sticky Drawer Header (Never hidden on scroll) ── */}
        <div className="shrink-0 sticky top-0 z-20 p-5 border-b border-indigo-500/20 flex items-center justify-between bg-[#0a0d24]/95 backdrop-blur-md shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center shadow-lg shadow-sky-500/20 shrink-0">
              <Gauge size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">{library.name}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                  {library.planName}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">12-Resource Granular Quota Breakdown</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
            aria-label="Close quota inspection drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Scrollable Body Content ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-5 scrollbar-thin">
          {/* Active Overage Policy Box */}
          <div className="rounded-2xl border border-indigo-500/25 bg-slate-950/60 p-4 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">Active Overage Policy</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-xs ${policy.badgeClass}`}>
                {policy.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{policy.description}</p>
            {library.pendingRequestNote && (
              <div className="mt-3 p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-200 flex items-start gap-2 shadow-xs">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-300">Pending Expansion Request:</span> {library.pendingRequestNote}
                </div>
              </div>
            )}
          </div>

          {/* 12 Resources List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span>12 Resource Utilization Monitors</span>
            </h3>

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
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500 font-bold">{res.num}</span>
                        <Icon className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-200">{res.title}</span>
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
                      <div className="text-[10px] text-slate-400 flex items-center justify-between pt-0.5">
                        <span>{res.extra}</span>
                        {pct >= 100 && (
                          <span className="text-rose-400 font-bold px-1.5 py-0.2 rounded bg-rose-500/10 border border-rose-500/20">
                            Hard Limit Hit
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

        {/* ── Sticky Footer Actions ── */}
        <div className="shrink-0 sticky bottom-0 z-20 p-4 border-t border-indigo-500/20 bg-[#0a0d24]/95 backdrop-blur-md flex items-center justify-between gap-3 shadow-lg">
          <Link
            href={SUPERADMIN_USAGE_OVERVIEW_ROUTES.quotaRequests}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-amber-500/40 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 transition-all shadow-xs cursor-pointer active:scale-95"
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
