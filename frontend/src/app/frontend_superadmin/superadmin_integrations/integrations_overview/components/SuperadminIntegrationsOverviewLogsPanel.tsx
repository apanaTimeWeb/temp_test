// components/SuperadminIntegrationsOverviewLogsPanel.tsx
// RESPONSIBILITY: Render searchable live integration logs and inspect HTTP request/response payloads.
// DATA FLOW: Logs array -> SuperadminIntegrationsOverviewLogsPanel -> Inspector Modal.
'use client';

import { Activity, Clock, Copy, Eye, Filter, Search, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import type { IntegrationLogItem } from '../types/superadmin_integrations_overview.types';
import {
  formatLatency,
  formatRelativeTimestamp,
  formatStatusCodeBadge,
} from '../utils/superadmin_integrations_overviewFormatters';

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

  return (
    <div className="space-y-4" data-testid="superadmin-integration-logs-panel">
      {/* Search & Provider Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-muted-foreground" />
          <select
            value={filterProvider}
            onChange={(e) => setFilterProvider(e.target.value)}
            className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            <option value="all">All Providers</option>
            {providersList.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search endpoint, request ID..."
            className="w-full rounded-xl border border-border bg-card pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border/80 font-semibold text-muted-foreground">
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
            <tbody className="divide-y divide-border/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No integration log entries match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const statusInfo = formatStatusCodeBadge(log.statusCode);
                  const latencyInfo = formatLatency(log.latencyMs);
                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => onSelectLog(log)}
                    >
                      <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                        {formatRelativeTimestamp(log.timestamp)}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                        {log.provider}
                      </td>
                      <td className="px-4 py-3">
                        <span className="capitalize text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono">
                          {log.direction}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-foreground">
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
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-card text-foreground hover:bg-muted text-[11px] font-medium cursor-pointer"
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
      </div>

      {/* Payload Inspector Modal */}
      {selectedLog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-dialog text-foreground animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-border/80">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Activity size={16} className="text-purple-400" />
                  Integration Log Payload Inspector
                </h3>
                <p className="text-xs font-mono text-muted-foreground mt-0.5">Request ID: {selectedLog.requestId}</p>
              </div>
              <button
                type="button"
                onClick={() => onSelectLog(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs max-h-[70vh] overflow-y-auto pr-1">
              {/* Metadata row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 rounded-xl border border-border/80 bg-muted/20 p-3 font-mono text-[11px]">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Provider:</span>
                  <span className="font-semibold text-foreground">{selectedLog.provider}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Method:</span>
                  <span className="font-semibold text-purple-400">{selectedLog.method}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Status:</span>
                  <span className="font-semibold text-foreground">{selectedLog.statusCode}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Latency:</span>
                  <span className="font-semibold text-foreground">{selectedLog.latencyMs} ms</span>
                </div>
              </div>

              {/* Request Payload */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Request Payload Body</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedLog.requestPayload, 'req')}
                    className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <Copy size={11} /> {copiedSection === 'req' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="rounded-xl border border-border bg-muted/40 p-3 font-mono text-[11px] text-foreground overflow-x-auto">
                  {selectedLog.requestPayload}
                </pre>
              </div>

              {/* Response Payload */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Response Payload Body</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedLog.responsePayload, 'res')}
                    className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <Copy size={11} /> {copiedSection === 'res' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="rounded-xl border border-border bg-muted/40 p-3 font-mono text-[11px] text-foreground overflow-x-auto">
                  {selectedLog.responsePayload}
                </pre>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/80 flex justify-end">
              <button
                type="button"
                onClick={() => onSelectLog(null)}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary font-semibold text-xs hover:opacity-90 cursor-pointer"
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
