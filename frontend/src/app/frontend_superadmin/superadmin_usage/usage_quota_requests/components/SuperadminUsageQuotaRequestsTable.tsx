// components/SuperadminUsageQuotaRequestsTable.tsx
// RESPONSIBILITY: Display interactive table of quota expansion requests with 1-click review action buttons.
import React from 'react';
import {
  Building2,
  HardDrive,
  MessageSquare,
  ShieldCheck,
  Zap,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import type {
  QuotaUpgradeRequestRecord,
  QuotaRequestResourceType,
} from '../types/SuperadminUsageQuotaRequestsTypes';
import {
  QUOTA_RESOURCE_TYPE_LABELS,
  QUOTA_STATUS_BADGES,
} from '../constants/SuperadminUsageQuotaRequestsConstants';

interface SuperadminUsageQuotaRequestsTableProps {
  requests: QuotaUpgradeRequestRecord[];
  onApprove: (req: QuotaUpgradeRequestRecord) => void;
  onReject: (req: QuotaUpgradeRequestRecord) => void;
}

function getResourceIcon(type: QuotaRequestResourceType) {
  switch (type) {
    case 'BRANCH':
      return <Building2 className="h-3.5 w-3.5" />;
    case 'STORAGE':
      return <HardDrive className="h-3.5 w-3.5" />;
    case 'SMS':
    case 'WHATSAPP':
      return <MessageSquare className="h-3.5 w-3.5" />;
    case 'ADMIN':
      return <ShieldCheck className="h-3.5 w-3.5" />;
    case 'STAFF':
    case 'MEMBER':
      return <Users className="h-3.5 w-3.5" />;
    case 'API':
    default:
      return <Zap className="h-3.5 w-3.5" />;
  }
}

export function SuperadminUsageQuotaRequestsTable({
  requests,
  onApprove,
  onReject,
}: SuperadminUsageQuotaRequestsTableProps) {
  return (
    <div className="rounded-2xl border border-indigo-500/25 bg-[#0a0d24]/90 overflow-hidden shadow-2xl backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-indigo-500/20 bg-[#060818]/90 text-slate-400 uppercase tracking-wider font-bold">
              <th className="py-3.5 px-4 whitespace-nowrap">Library & Plan</th>
              <th className="py-3.5 px-4 whitespace-nowrap">Resource Type</th>
              <th className="py-3.5 px-4 whitespace-nowrap">Current → Requested</th>
              <th className="py-3.5 px-4">Business Justification</th>
              <th className="py-3.5 px-4 whitespace-nowrap">Submitted By</th>
              <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
              <th className="py-3.5 px-4 whitespace-nowrap text-right">SuperAdmin Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-500/15">
            {requests.map((req) => {
              const resConfig = QUOTA_RESOURCE_TYPE_LABELS[req.resourceType];
              const statusConfig = QUOTA_STATUS_BADGES[req.status];
              const isPending = req.status === 'PENDING';

              return (
                <tr key={req.id} className="hover:bg-indigo-500/[0.06] transition-colors group">
                  {/* Library & Plan */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white group-hover:text-amber-300 transition-colors">
                      {req.libraryName}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-indigo-500/25">
                        {req.planName}
                      </span>
                    </div>
                  </td>

                  {/* Resource Type */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${resConfig.badgeClass}`}
                    >
                      {getResourceIcon(req.resourceType)}
                      {resConfig.label}
                    </span>
                  </td>

                  {/* Current vs Requested Limit */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-400 font-semibold">
                        {req.currentLimit} {req.unit}
                      </span>
                      <ArrowRight className="h-3 w-3 text-slate-500" />
                      <span className="text-emerald-400 font-bold">
                        {req.requestedLimit} {req.unit}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Used: {req.currentUsage} / {req.currentLimit}
                    </div>
                  </td>

                  {/* Business Justification */}
                  <td className="py-3.5 px-4 min-w-[220px] max-w-[320px]">
                    <p className="text-slate-300 line-clamp-2 leading-relaxed">
                      {req.businessJustification}
                    </p>
                    {req.reviewNotes && (
                      <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="h-2.5 w-2.5" /> {req.reviewNotes}
                      </p>
                    )}
                    {req.rejectionReason && (
                      <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
                        <XCircle className="h-2.5 w-2.5" /> {req.rejectionReason}
                      </p>
                    )}
                  </td>

                  {/* Submitted By */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-300">
                    <div className="font-semibold text-white">{req.submittedBy.name}</div>
                    <div className="text-[10px] text-slate-400">{req.submittedBy.role}</div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusConfig.badgeClass}`}
                    >
                      {isPending && <Clock className="h-2.5 w-2.5 animate-pulse" />}
                      {statusConfig.label}
                    </span>
                  </td>

                  {/* SuperAdmin Action */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    {isPending ? (
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => onApprove(req)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 text-[11px] font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => onReject(req)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 text-[11px] font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
                        >
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Resolved</span>
                    )}
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