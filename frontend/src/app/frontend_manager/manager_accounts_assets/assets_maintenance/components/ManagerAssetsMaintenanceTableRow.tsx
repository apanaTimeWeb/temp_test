'use client';

import type { MaintenanceLogItem } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/components/ManagerAssetsMaintenanceTable';
import { AlertTriangle, Building2, Calendar, CheckCircle2, Clock, Eye, Trash2, Wrench } from 'lucide-react';

interface ManagerAssetsMaintenanceTableRowProps {
  logItem: MaintenanceLogItem;
  formatCurrency: (val: number) => string;
  onUpdateStatus: (id: number, currentStatus: string) => void;
  onViewDetails?: (log: MaintenanceLogItem) => void;
  onDeleteLog?: (id: number) => void;
  statusLabels: { pending: string; inProgress: string; completed: string };
}

export function ManagerAssetsMaintenanceTableRow({
  logItem: l,
  formatCurrency,
  onUpdateStatus,
  onViewDetails,
  onDeleteLog,
  statusLabels,
}: ManagerAssetsMaintenanceTableRowProps) {
  const priorityBadge =
    l.priority === 'emergency'
      ? { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30' }
      : l.priority === 'urgent'
      ? { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' }
      : { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' };

  return (
    <tr className="hover:bg-surface-hover motion-safe:transition-colors group h-14">
      <td className="py-3 px-4">
        <div className="flex flex-col">
          <span className="font-semibold text-primary text-xs">{l.assetName}</span>
          {l.priority && (
            <span className={`inline-flex items-center gap-1 w-fit mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase border ${priorityBadge.bg} ${priorityBadge.text} ${priorityBadge.border}`}>
              {l.priority === 'emergency' ? <AlertTriangle size={9} /> : <Clock size={9} />}
              {l.priority}
            </span>
          )}
        </div>
      </td>

      <td className="py-3 px-4 max-w-[220px]">
        <div className="flex flex-col">
          <span className="text-xs text-primary font-medium line-clamp-1" title={l.issue}>{l.issue}</span>
          {l.type && <span className="text-[10px] text-secondary capitalize mt-0.5">{l.type} maintenance</span>}
        </div>
      </td>

      <td className="py-3 px-4 text-xs text-secondary whitespace-nowrap">
        <div className="flex items-center gap-1.5"><Calendar size={12} className="text-secondary shrink-0" /><span>{l.reportedDate}</span></div>
      </td>

      <td className="py-3 px-4 text-xs text-secondary whitespace-nowrap">
        <div className="flex items-center gap-1.5"><Clock size={12} className="text-secondary shrink-0" /><span>{l.scheduledDate}</span></div>
      </td>

      <td className="py-3 px-4 text-xs text-secondary">
        <div className="flex items-center gap-1.5"><Building2 size={12} className="text-secondary shrink-0" /><span className="truncate max-w-[120px]" title={l.vendor}>{l.vendor}</span></div>
      </td>

      <td className="py-3 px-4 text-right font-semibold text-xs whitespace-nowrap">
        <span className="text-emerald-400 font-mono font-bold">{formatCurrency(l.cost)}</span>
        {l.cost > 0 && <span className="text-[10px] text-emerald-400 font-medium block">✓ Auto-Expense</span>}
      </td>

      <td className="py-3 px-4 whitespace-nowrap">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${l.status === 'pending' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : l.status === 'in-progress' ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'}`}>
          {l.status === 'pending' ? <><Clock size={12} aria-hidden="true" /><span>{statusLabels.pending}</span></> : l.status === 'in-progress' ? <><Wrench size={12} aria-hidden="true" /><span>{statusLabels.inProgress}</span></> : <><CheckCircle2 size={12} aria-hidden="true" /><span>{statusLabels.completed}</span></>}
        </span>
      </td>

      <td className="py-3 px-4 text-right whitespace-nowrap">
        <div className="inline-flex items-center justify-end gap-1.5">
          {onViewDetails && (
            <button type="button" onClick={() => onViewDetails(l)} className="p-1.5 rounded-lg text-sky-400 hover:text-sky-300 hover:bg-sky-500/15 motion-safe:transition-colors cursor-pointer" title="View Ticket Details" aria-label={`View details for ${l.assetName}`}>
              <Eye size={15} />
            </button>
          )}
          {l.status !== 'completed' && (
            <button
              type="button"
              onClick={() => onUpdateStatus(l.id, l.status)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-xs motion-safe:transition-all cursor-pointer ${l.status === 'pending' ? 'border border-amber-500/40 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25' : 'border border-emerald-500/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25'}`}
              title={l.status === 'pending' ? 'Start work on maintenance order' : 'Mark maintenance order as completed'}
            >
              {l.status === 'pending' ? <><Wrench size={12} /><span>Start Work</span></> : <><CheckCircle2 size={12} /><span>Complete</span></>}
            </button>
          )}
          {onDeleteLog && (
            <button type="button" onClick={() => onDeleteLog(l.id)} className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/15 motion-safe:transition-colors cursor-pointer" title="Delete maintenance record" aria-label={`Delete record for ${l.assetName}`}>
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
