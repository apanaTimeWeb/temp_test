'use client';

import type { ManagerAssetsRegisterAsset } from '@/app/frontend_manager/manager_accounts_assets/assets_register/hooks/ManagerAssetsRegisterDemoRepository';
import { Archive, Calendar, CheckCircle2, Eye, MapPin, Trash2, Wrench } from 'lucide-react';

interface ManagerAssetsRegisterTableRowProps {
  asset: ManagerAssetsRegisterAsset;
  formatCurrency: (val: number) => string;
  categoryLabel: (category: string) => string;
  statusLabel: (status: ManagerAssetsRegisterAsset['status']) => string;
  onViewDetails?: (asset: ManagerAssetsRegisterAsset) => void;
  onToggleStatus?: (asset: ManagerAssetsRegisterAsset) => void;
  onDeleteAsset?: (id: number) => void;
}

export function ManagerAssetsRegisterTableRow({
  asset: a,
  formatCurrency,
  categoryLabel,
  statusLabel,
  onViewDetails,
  onToggleStatus,
  onDeleteAsset,
}: ManagerAssetsRegisterTableRowProps) {
  const categoryColor =
    a.category === 'Appliance'
      ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
      : a.category === 'Electronics'
      ? 'bg-violet-500/10 text-violet-400 border-violet-500/20'
      : a.category === 'Furniture'
      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

  return (
    <tr className={`hover:bg-surface-hover motion-safe:transition-colors group h-14 ${a.status === 'disposed' ? 'opacity-65' : ''}`}>
      <td className="py-3 px-4">
        <div className="flex flex-col">
          <span className="font-semibold text-primary text-xs">{a.name}</span>
          <span className="text-[10px] text-secondary font-mono">ID: #{String(a.id).slice(-4)}</span>
        </div>
      </td>

      <td className="py-3 px-4">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${categoryColor}`}>
          {categoryLabel(a.category)}
        </span>
      </td>

      <td className="py-3 px-4 text-xs text-secondary whitespace-nowrap">
        <div className="flex items-center gap-1.5"><Calendar size={12} className="text-secondary shrink-0" /><span>{a.purchaseDate}</span></div>
      </td>

      <td className="py-3 px-4 text-right font-semibold text-xs text-emerald-400 font-mono whitespace-nowrap">
        {formatCurrency(a.purchaseValue)}
      </td>

      <td className="py-3 px-4 text-xs text-secondary">
        <div className="flex items-center gap-1.5">
          <MapPin size={12} className="text-secondary shrink-0" />
          <span className="truncate max-w-[140px]" title={a.location}>{a.location}</span>
        </div>
      </td>

      <td className="py-3 px-4 whitespace-nowrap">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${a.status === 'active' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : a.status === 'maintenance' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-slate-500/15 text-slate-400 border border-slate-500/30'}`}>
          {a.status === 'active' ? <><CheckCircle2 size={12} aria-hidden="true" /><span>{statusLabel(a.status)}</span></> : a.status === 'maintenance' ? <><Wrench size={12} aria-hidden="true" /><span>{statusLabel(a.status)}</span></> : <><Archive size={12} aria-hidden="true" /><span>{statusLabel(a.status)}</span></>}
        </span>
      </td>

      <td className="py-3 px-4 text-right whitespace-nowrap">
        <div className="inline-flex items-center justify-end gap-1.5">
          {onViewDetails && (
            <button type="button" onClick={() => onViewDetails(a)} className="p-1.5 rounded-lg text-sky-400 hover:text-sky-300 hover:bg-sky-500/15 motion-safe:transition-colors cursor-pointer" title="View Asset Details" aria-label={`View details for ${a.name}`}>
              <Eye size={15} />
            </button>
          )}
          {onToggleStatus && a.status !== 'disposed' && (
            <button
              type="button"
              onClick={() => onToggleStatus(a)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-xs motion-safe:transition-all cursor-pointer ${a.status === 'active' ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40' : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40'}`}
              title={a.status === 'active' ? 'Send asset for maintenance' : 'Mark asset as active & operational'}
            >
              {a.status === 'active' ? <><Wrench size={12} /><span>Service</span></> : <><CheckCircle2 size={12} /><span>Restore</span></>}
            </button>
          )}
          {onDeleteAsset && (
            <button type="button" onClick={() => onDeleteAsset(a.id)} className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/15 motion-safe:transition-colors cursor-pointer" title="Remove asset" aria-label={`Delete ${a.name}`}>
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
