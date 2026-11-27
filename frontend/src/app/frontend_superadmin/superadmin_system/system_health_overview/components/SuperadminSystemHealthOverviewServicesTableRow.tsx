'use client';
import { Activity, RefreshCw, Eye, RotateCw } from 'lucide-react';
import type { ServiceNode } from '@/app/frontend_superadmin/superadmin_system/system_health_overview/components/SuperadminSystemHealthOverviewServicesTable';

interface ServicesTableRowProps {
  item: ServiceNode;
  pingingId: string | null;
  onPing: (name: string, id: string) => void;
  onInspect: (item: ServiceNode) => void;
  onRestart: (item: ServiceNode) => void;
}

export function SuperadminSystemHealthOverviewServicesTableRow({
  item,
  pingingId,
  onPing,
  onInspect,
  onRestart,
}: ServicesTableRowProps) {
  const isPinging = pingingId === item.id;

  return (
    <tr className="hover:bg-emerald-500/5 transition-colors group">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <div>
            <span className="font-bold text-slate-100 block group-hover:text-emerald-300 transition-colors">
              {item.name}
            </span>
            <span className="text-[11px] text-slate-400">{item.category}</span>
          </div>
        </div>
      </td>

      <td className="px-5 py-3.5 font-mono text-slate-300 text-[11px]">
        <span className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60">
          {item.node}
        </span>
      </td>

      <td className="px-5 py-3.5 font-mono font-bold text-emerald-400">
        <span className="flex items-center gap-1.5">
          <Activity size={12} className="text-emerald-500" />
          {item.latency}
        </span>
      </td>

      <td className="px-5 py-3.5 min-w-44">
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="text-slate-400">{item.memory}</span>
          <span className={`font-bold ${item.cpu > 80 ? 'text-amber-400' : 'text-slate-200'}`}>
            {item.cpu}% CPU
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full motion-safe:transition-all motion-safe:duration-300 ${
              item.cpu > 80
                ? 'bg-amber-400'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400'
            }`}
            style={{ width: `${item.cpu}%` }}
          />
        </div>
      </td>

      <td className="px-5 py-3.5 font-mono text-slate-300 font-semibold">{item.uptime}</td>

      <td className="px-5 py-3.5">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
            item.status === 'Healthy'
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              : item.status === 'Degraded'
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              : 'bg-slate-500/15 text-slate-300 border-slate-500/30'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              item.status === 'Healthy' ? 'bg-emerald-400 motion-safe:animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span>{item.status}</span>
        </span>
      </td>

      <td className="px-5 py-3.5 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => onPing(item.name, item.id)}
            disabled={isPinging}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold motion-safe:transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
            title="Send ping heartbeat probe"
          >
            <RefreshCw size={11} className={isPinging ? 'motion-safe:animate-spin' : ''} />
            <span>{isPinging ? 'Pinging' : 'Ping'}</span>
          </button>

          <button
            type="button"
            onClick={() => onInspect(item)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 text-xs font-semibold motion-safe:transition-all cursor-pointer shadow-xs active:scale-95"
            title="Inspect node telemetry & logs"
          >
            <Eye size={11} />
            <span>Inspect</span>
          </button>

          <button
            type="button"
            onClick={() => onRestart(item)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold motion-safe:transition-all cursor-pointer shadow-xs active:scale-95"
            title="Graceful restart worker"
          >
            <RotateCw size={11} />
            <span>Restart</span>
          </button>
        </div>
      </td>
    </tr>
  );
}
