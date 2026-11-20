// RESPONSIBILITY: Render slide-over drawer showing granular 12-resource breakdown for a selected library.
import React from 'react';
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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl h-full bg-slate-950 border-l border-slate-800 flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">{library.name}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-sky-300 border border-slate-700">
                {library.planName}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Comprehensive 12-Resource Quota Breakdown</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Overage Policy Box */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">Active Overage Policy</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${policy.badgeClass}`}>
                {policy.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{policy.description}</p>
            {library.pendingRequestNote && (
              <div className="mt-3 p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-xs text-amber-200 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Pending Expansion Request:</span> {library.pendingRequestNote}
                </div>
              </div>
            )}
          </div>

          {/* 12 Resources List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              12 Resource Utilization Monitors
            </h3>

            <div className="grid grid-cols-1 gap-2.5">
              {resources.map((res) => {
                const pct = calculateUsagePercent(res.cur, res.max);
                const colors = getQuotaColorClasses(res.status);
                const Icon = res.icon;

                return (
                  <div key={res.num} className="p-3 rounded-xl border border-slate-800/80 bg-slate-900/50 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500">{res.num}</span>
                        <Icon className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-200">{res.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${colors.text}`}>
                          {res.cur.toLocaleString()} / {res.max.toLocaleString()} {res.unit}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">({pct}%)</span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${colors.bar}`} style={{ width: `${pct}%` }} />
                    </div>

                    {res.extra && (
                      <div className="text-[10px] text-slate-400 flex items-center justify-between">
                        <span>{res.extra}</span>
                        {pct >= 100 && <span className="text-red-400 font-bold">Hard Limit Hit</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between gap-3">
          <Link
            href={SUPERADMIN_USAGE_OVERVIEW_ROUTES.quotaRequests}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-colors"
          >
            Review Quota Requests <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
