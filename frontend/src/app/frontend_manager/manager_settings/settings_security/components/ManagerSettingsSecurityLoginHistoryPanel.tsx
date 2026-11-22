'use client';

import {
AlertTriangle,
CheckCircle2,
Globe,
History,
Laptop,
MapPin,
XCircle,
} from 'lucide-react';
import { useMemo,useState } from 'react';
import type { ManagerLoginHistoryEntry } from '../types/ManagerSettingsSecurityTypes';

interface ManagerSettingsSecurityLoginHistoryPanelProps {
  history: ManagerLoginHistoryEntry[];
}

export function ManagerSettingsSecurityLoginHistoryPanel({
  history,
}: ManagerSettingsSecurityLoginHistoryPanelProps) {
  const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all');

  const filteredHistory = useMemo(() => {
    if (filter === 'all') return history;
    return history.filter((item) => item.status === filter);
  }, [history, filter]);

  const counts = useMemo(() => {
    const success = history.filter((h) => h.status === 'success').length;
    const failed = history.filter((h) => h.status === 'failed').length;
    return { all: history.length, success, failed };
  }, [history]);

  return (
    <div className="space-y-4">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <History size={18} className="text-amber-400" />
            <span>Recent Login Activity</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Security audit logs of authentication attempts to your manager profile.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setFilter('success')}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'success'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Success ({counts.success})
          </button>
          <button
            type="button"
            onClick={() => setFilter('failed')}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'failed'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Blocked / Failed ({counts.failed})
          </button>
        </div>
      </div>

      {/* Responsive View */}
      {filteredHistory.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 p-6 text-center">
          <p className="text-xs text-slate-500">
            No login records found for this filter.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-xl border border-white/10 bg-[#0c0d24]">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/5 bg-white/5 text-[11px] font-semibold text-slate-400">
                <tr>
                  <th className="px-4 py-2.5">Timestamp</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Device & Browser</th>
                  <th className="px-4 py-2.5">IP Address</th>
                  <th className="px-4 py-2.5">Location</th>
                  <th className="px-4 py-2.5">Security Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-200">
                      {item.timestamp}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3">
                      {item.status === 'success' ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.2 text-[10px] font-bold text-emerald-300">
                          <CheckCircle2 size={10} />
                          Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/15 px-2 py-0.2 text-[10px] font-bold text-rose-300">
                          <XCircle size={10} />
                          Failed
                        </span>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Laptop size={13} className="text-slate-500" />
                        <span>{item.device}</span>
                        <span className="text-slate-500">({item.browser})</span>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-slate-400">
                      <div className="flex items-center gap-1">
                        <Globe size={11} className="text-slate-500" />
                        <span>{item.ip}</span>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-slate-400">
                      <div className="flex items-center gap-1">
                        <MapPin size={11} className="text-slate-500" />
                        <span>{item.location}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-xs">
                      {item.failureReason ? (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-medium">
                          <AlertTriangle size={12} className="shrink-0" />
                          {item.failureReason}
                        </span>
                      ) : (
                        <span className="text-slate-500">Authorized login session</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-2">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-white/10 bg-[#0c0d24] p-3 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{item.timestamp}</span>
                  {item.status === 'success' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.2 text-[10px] font-bold text-emerald-300">
                      <CheckCircle2 size={10} /> Success
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/30 px-2 py-0.2 text-[10px] font-bold text-rose-300">
                      <XCircle size={10} /> Failed
                    </span>
                  )}
                </div>

                <div className="text-slate-300 flex items-center gap-1.5">
                  <Laptop size={12} className="text-slate-500" />
                  <span>{item.device}</span>
                  <span className="text-slate-500">({item.browser})</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1 border-t border-white/5">
                  <span className="font-mono">{item.ip}</span>
                  <span>•</span>
                  <span>{item.location}</span>
                </div>

                {item.failureReason && (
                  <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1">
                    <AlertTriangle size={11} />
                    {item.failureReason}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
