'use client';

import { SuperadminTablePagination } from '@/components/ui/table/SuperadminTablePagination';
// components/SuperadminIntegrationsOverviewLogsPanel.tsx
// RESPONSIBILITY: Render searchable live integration logs and inspect HTTP request/response payloads.
// DATA FLOW: Logs array -> SuperadminIntegrationsOverviewLogsPanel -> Inspector Modal.
import { Activity, Copy, Eye, Filter, Search, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import type { IntegrationLogItem } from '@/app/frontend_superadmin/superadmin_integrations/integrations_overview/types/superadmin_integrations_overview.types';
import {
  formatLatency,
  formatRelativeTimestamp,
  formatStatusCodeBadge,
} from '@/app/frontend_superadmin/superadmin_integrations/integrations_overview/utils/superadmin_integrations_overviewFormatters';

interface SuperadminIntegrationsOverviewLogsPanelProps {
  logs: IntegrationLogItem[];
  selectedLog: IntegrationLogItem | null;
  onSelectLog: (log: IntegrationLogItem | null) => void;
}

export const SuperadminIntegrationsOverviewLogsPanel: React.FC<
  SuperadminIntegrationsOverviewLogsPanelProps
> = ({ logs, selectedLog, onSelectLog }) => {
  const [filterProvider, setFilterProvider] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const providersList = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => set.add(l.provider));
    return Array.from(set);
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const matchProvider = filterProvider === 'all' || l.provider === filterProvider;
      const matchSearch =
        search.trim() === '' ||
        l.endpoint.toLowerCase().includes(search.toLowerCase()) ||
        l.requestId.toLowerCase().includes(search.toLowerCase()) ||
        l.provider.toLowerCase().includes(search.toLowerCase());
      return matchProvider && matchSearch;
    });
  }, [logs, filterProvider, search]);

  const paginatedLogs = useMemo(() => {
    return filteredLogs.slice(page * pageSize, (page + 1) * pageSize);
  }, [filteredLogs, page, pageSize]);

  return (
    <div className="space-y-4" data-testid="superadmin-integration-logs-panel">
      {/* Search & Provider Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-slate-400" />
          <select
            value={filterProvider}
            onChange={(e) => { setFilterProvider(e.target.value); setPage(0); }}
            className="rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3 py-1.5 text-xs text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 shadow-inner"
          >
            <option value="all" className="bg-slate-900 text-slate-100">All Providers</option>
            {providersList.map((p) => (
              <option key={p} value={p} className="bg-slate-900 text-slate-100">
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input maxLength={100}
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search endpoint, request ID..."
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 shadow-inner"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0c102b]/95 via-[#090d24]/95 to-[#050714]/95 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 border-b border-indigo-500/20 font-semibold text-slate-300">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Direction</th>
                <th className="px-4 py-3">Method & Endpoint</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Latency</th>
                <th className="px-4 py-3 text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-500/10">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    No integration log entries match the filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => {
                  const statusInfo = formatStatusCodeBadge(log.statusCode);
                  const latencyInfo = formatLatency(log.latencyMs);
                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-indigo-950/30 transition-colors cursor-pointer"
                      onClick={() => onSelectLog(log)}
                    >
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {formatRelativeTimestamp(log.timestamp)}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-100 whitespace-nowrap">
                        {log.provider}
                      </td>
                      <td className="px-4 py-3">
                        <span className="capitalize text-[11px] px-2 py-0.5 rounded-md bg-slate-900 border border-indigo-500/20 text-slate-300 font-mono">
                          {log.direction}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-200">
                        <span className="font-bold text-purple-400 mr-1.5">{log.method}</span>
                        <span>{log.endpoint}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${statusInfo.bgClass} ${statusInfo.textClass}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-md font-mono text-[11px] ${latencyInfo.bgClass} ${latencyInfo.textClass}`}>
                          {latencyInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectLog(log);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border border-indigo-500/20 bg-slate-800/80 text-slate-200 hover:bg-slate-700/80 hover:text-white text-[11px] font-medium cursor-pointer transition-colors shadow-xs"
                        >
                          <Eye size={12} /> Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <SuperadminTablePagination
          page={page}
          pageSize={pageSize}
          totalItems={filteredLogs.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          itemLabel="integration logs"
        />
      </div>

      {/* Payload Inspector Modal */}
      {selectedLog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#0c102b] via-[#090d24] to-[#050714] p-6 shadow-2xl text-slate-100 animate-in zoom-in-95 motion-safe:duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-indigo-500/20">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Activity size={16} className="text-purple-400" />
                  Integration Log Payload Inspector
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">Request ID: {selectedLog.requestId}</p>
              </div>
              <button
                type="button"
                onClick={() => onSelectLog(null)}
                className="text-slate-400 hover:text-slate-100 cursor-pointer transition-colors p-1"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs max-h-[70vh] overflow-y-auto pr-1">
              {/* Metadata row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 rounded-xl border border-indigo-500/20 bg-slate-950/70 p-3 font-mono text-[11px] shadow-inner">
                <div>
                  <span className="text-slate-400 block text-[10px]">Provider:</span>
                  <span className="font-semibold text-slate-100">{selectedLog.provider}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Method:</span>
                  <span className="font-semibold text-purple-400">{selectedLog.method}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Status:</span>
                  <span className="font-semibold text-slate-100">{selectedLog.statusCode}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Latency:</span>
                  <span className="font-semibold text-slate-100">{selectedLog.latencyMs} ms</span>
                </div>
              </div>

              {/* Request Payload */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">Request Payload Body</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedLog.requestPayload, 'req')}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-100 cursor-pointer"
                  >
                    <Copy size={11} /> {copiedSection === 'req' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="rounded-xl border border-indigo-500/20 bg-slate-950/90 p-3 font-mono text-[11px] text-purple-200 overflow-x-auto shadow-inner">
                  {selectedLog.requestPayload}
                </pre>
              </div>

              {/* Response Payload */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">Response Payload Body</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedLog.responsePayload, 'res')}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-100 cursor-pointer"
                  >
                    <Copy size={11} /> {copiedSection === 'res' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="rounded-xl border border-indigo-500/20 bg-slate-950/90 p-3 font-mono text-[11px] text-purple-200 overflow-x-auto shadow-inner">
                  {selectedLog.responsePayload}
                </pre>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-indigo-500/20 flex justify-end">
              <button
                type="button"
                onClick={() => onSelectLog(null)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/25 cursor-pointer transition-opacity"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
