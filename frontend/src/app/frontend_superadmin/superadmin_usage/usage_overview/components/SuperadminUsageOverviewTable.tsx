// RESPONSIBILITY: Render 10-column data table displaying all 12 resource quotas per registered library account.
import React from 'react';
import { Eye, AlertCircle, Building2, HardDrive, MessageSquare, Database } from 'lucide-react';
import type { LibraryUsageRecord } from '../types/SuperadminUsageOverviewTypes';
import { calculateUsagePercent, getQuotaColorClasses } from '../utils/SuperadminUsageOverviewFormatters';
import { OVERAGE_POLICIES, USAGE_TABLE_COLUMNS } from '../constants/SuperadminUsageOverviewConstants';

interface SuperadminUsageOverviewTableProps {
  libraries: LibraryUsageRecord[];
  onSelectLibrary: (id: string) => void;
}

export function SuperadminUsageOverviewTable({
  libraries,
  onSelectLibrary,
}: SuperadminUsageOverviewTableProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase tracking-wider font-bold">
              {USAGE_TABLE_COLUMNS.map((col) => (
                <th key={col.id} className="py-3 px-3.5 whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {libraries.map((lib) => {
              const branchPct = calculateUsagePercent(lib.branchUsage.current, lib.branchUsage.limit);
              const branchColor = getQuotaColorClasses(lib.branchUsage.status);
              const memberPct = calculateUsagePercent(lib.memberUsage.current, lib.memberUsage.limit);
              const memberColor = getQuotaColorClasses(lib.memberUsage.status);
              const storagePct = calculateUsagePercent(lib.storageUsage.current, lib.storageUsage.limit);
              const storageColor = getQuotaColorClasses(lib.storageUsage.status);
              const policyConfig = OVERAGE_POLICIES[lib.overagePolicy] ?? OVERAGE_POLICIES.HARD_STOP;

              return (
                <tr
                  key={lib.id}
                  onClick={() => onSelectLibrary(lib.id)}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  {/* 1. Library Name */}
                  <td className="py-3 px-3.5">
                    <div className="font-bold text-white group-hover:text-sky-300 transition-colors flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[170px]">{lib.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{lib.id}</div>
                  </td>

                  {/* 2. Plan Tier */}
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                      {lib.planName}
                    </span>
                  </td>

                  {/* 3. Branch Usage (Allowed vs Current) */}
                  <td className="py-3 px-3.5">
                    <div className="flex items-center justify-between gap-2 min-w-[110px]">
                      <span className={`font-bold ${branchColor.text}`}>
                        {lib.branchUsage.current} / {lib.branchUsage.limit}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{branchPct}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div className={`h-full rounded-full ${branchColor.bar}`} style={{ width: `${branchPct}%` }} />
                    </div>
                    {lib.branchUsage.current >= lib.branchUsage.limit && (
                      <div className="flex items-center gap-1 text-[10px] text-red-400 mt-1 font-semibold">
                        <AlertCircle className="h-2.5 w-2.5" /> 4th branch blocked
                      </div>
                    )}
                  </td>

                  {/* 4. Admins & Staff */}
                  <td className="py-3 px-3.5 whitespace-nowrap text-slate-300">
                    <div>
                      <span className="text-white font-semibold">{lib.adminUsage.current}</span> / {lib.adminUsage.limit} Admins
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {lib.staffUsage.current} / {lib.staffUsage.limit} Staff
                    </div>
                  </td>

                  {/* 5. Members */}
                  <td className="py-3 px-3.5 min-w-[110px]">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`font-bold ${memberColor.text}`}>{lib.memberUsage.current}</span>
                      <span className="text-slate-400">/ {lib.memberUsage.limit}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div className={`h-full rounded-full ${memberColor.bar}`} style={{ width: `${memberPct}%` }} />
                    </div>
                  </td>

                  {/* 6. Storage & Files */}
                  <td className="py-3 px-3.5 min-w-[120px]">
                    <div className="flex items-center justify-between gap-1 text-slate-300">
                      <span className="font-semibold text-white">{lib.storageUsage.current} GB</span>
                      <span className="text-slate-400">/ {lib.storageUsage.limit} GB</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div className={`h-full rounded-full ${storageColor.bar}`} style={{ width: `${storagePct}%` }} />
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <HardDrive className="h-2.5 w-2.5" /> {lib.fileUploadUsage.fileCount} uploads
                    </div>
                  </td>

                  {/* 7. Communication (SMS & WhatsApp) */}
                  <td className="py-3 px-3.5 whitespace-nowrap text-slate-300">
                    <div>
                      <span className="text-white font-semibold">{lib.smsUsage.current.toLocaleString()}</span> / {lib.smsUsage.limit.toLocaleString()} SMS
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MessageSquare className="h-2.5 w-2.5" /> {lib.whatsappUsage.current.toLocaleString()} WA
                    </div>
                  </td>

                  {/* 8. API & Backups */}
                  <td className="py-3 px-3.5 whitespace-nowrap text-slate-300">
                    <div className="font-mono text-white font-semibold">
                      {(lib.apiUsage.monthlyCalls / 1000).toFixed(1)}k calls
                    </div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                      <Database className="h-2.5 w-2.5" /> {lib.backupUsage.backupStatus}
                    </div>
                  </td>

                  {/* 9. Overage Policy */}
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${policyConfig.badgeClass}`}>
                      {policyConfig.label}
                    </span>
                    {lib.hasPendingRequest && (
                      <div className="text-[10px] text-amber-400 font-semibold mt-1">
                        +1 Request Pending
                      </div>
                    )}
                  </td>

                  {/* 10. Action */}
                  <td className="py-3 px-3.5 whitespace-nowrap text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectLibrary(lib.id);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <Eye className="h-3 w-3 text-sky-400" /> View 12 Quotas
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
