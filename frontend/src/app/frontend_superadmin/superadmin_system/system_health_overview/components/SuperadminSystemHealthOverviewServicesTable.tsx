'use client';
import { useState, useMemo } from 'react';
import { Server, Activity, Search, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle, RefreshCw, Cpu, HardDrive } from 'lucide-react';
import { toast } from 'sonner';

interface ServiceNode {
  id: string;
  name: string;
  category: string;
  node: string;
  latency: string;
  cpu: number;
  memory: string;
  status: 'Healthy' | 'Degraded' | 'Idle';
  uptime: string;
}

const SAMPLE_SERVICE_NODES: ServiceNode[] = [
  { id: 'srv-1', name: 'PostgreSQL Primary Cluster', category: 'Database', node: 'db-master-01 (ap-south-1a)', latency: '3.2ms', cpu: 42, memory: '12.4 GB / 32 GB', status: 'Healthy', uptime: '99.99%' },
  { id: 'srv-2', name: 'Redis Sentinel Cache', category: 'Cache', node: 'redis-node-01 (ap-south-1a)', latency: '0.8ms', cpu: 18, memory: '4.1 GB / 8 GB', status: 'Healthy', uptime: '100%' },
  { id: 'srv-3', name: 'Auth Gateway & Session Validator', category: 'Security', node: 'auth-edge-01 (global)', latency: '18ms', cpu: 34, memory: '1.8 GB / 4 GB', status: 'Healthy', uptime: '99.98%' },
  { id: 'srv-4', name: 'Background Job Worker Pool', category: 'Compute', node: 'worker-pool-a (ap-south-1b)', latency: '45ms', cpu: 78, memory: '7.2 GB / 16 GB', status: 'Healthy', uptime: '99.95%' },
  { id: 'srv-5', name: 'WhatsApp Business Graph Bridge', category: 'Integration', node: 'comm-gw-01 (ap-south-1a)', latency: '120ms', cpu: 22, memory: '1.2 GB / 2 GB', status: 'Healthy', uptime: '99.90%' },
  { id: 'srv-6', name: 'Media Asset CDN & Transcoder', category: 'Storage', node: 'storage-cdn-02 (global)', latency: '24ms', cpu: 86, memory: '14.8 GB / 16 GB', status: 'Degraded', uptime: '99.75%' },
  { id: 'srv-7', name: 'Full-text Search Indexer', category: 'Search', node: 'es-cluster-01 (ap-south-1b)', latency: '12ms', cpu: 29, memory: '6.5 GB / 16 GB', status: 'Healthy', uptime: '99.99%' },
  { id: 'srv-8', name: 'Telemetry Log Aggregator', category: 'Observability', node: 'prom-loki-01 (ap-south-1a)', latency: '32ms', cpu: 15, memory: '3.1 GB / 8 GB', status: 'Idle', uptime: '99.99%' },
];

export default function SuperadminSystemHealthOverviewServicesTable() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const filteredNodes = useMemo(() => {
    return SAMPLE_SERVICE_NODES.filter((item) => {
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.node.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredNodes.length / pageSize));
  const paginatedNodes = useMemo(() => {
    const start = page * pageSize;
    return filteredNodes.slice(start, start + pageSize);
  }, [filteredNodes, page, pageSize]);

  const handlePing = (name: string) => {
    toast.success(`Service check: ${name} responded OK (200)`);
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card/90 shadow-lg overflow-hidden mb-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-5 border-b border-border/80 bg-slate-900/50">
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Server size={18} className="text-emerald-400" />
            <span>Core Microservices & Server Telemetry</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Live heartbeat telemetry, memory allocation, and latency benchmarks across clusters</p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-56">
            <Search size={14} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder="Filter service or cluster node..."
              className="w-full rounded-xl border border-emerald-500/25 bg-slate-900/70 pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            className="rounded-xl border border-emerald-500/25 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-200 focus:border-emerald-400 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Healthy">Healthy</option>
            <option value="Degraded">Degraded</option>
            <option value="Idle">Idle</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-border/80">
            <tr>
              <th className="px-4 py-3">Service Name</th>
              <th className="px-4 py-3">Cluster Instance</th>
              <th className="px-4 py-3">Ping Latency</th>
              <th className="px-4 py-3">CPU / Memory Load</th>
              <th className="px-4 py-3">Uptime</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 text-slate-200">
            {paginatedNodes.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  No services match the current filter.
                </td>
              </tr>
            ) : (
              paginatedNodes.map((item) => (
                <tr key={item.id} className="hover:bg-emerald-500/5 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-semibold text-slate-100 block">{item.name}</span>
                    <span className="text-[11px] text-slate-400">{item.category}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-300">{item.node}</td>
                  <td className="px-4 py-3 font-mono font-medium text-emerald-400">{item.latency}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-400">{item.memory}</span>
                      <span className={`font-bold ${item.cpu > 80 ? 'text-amber-400' : 'text-slate-300'}`}>{item.cpu}% CPU</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.cpu > 80 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                        style={{ width: `${item.cpu}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-300">{item.uptime}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        item.status === 'Healthy'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : item.status === 'Degraded'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-slate-500/15 text-slate-300 border-slate-500/30'
                      }`}
                    >
                      {item.status === 'Healthy' ? <CheckCircle size={11} /> : <AlertTriangle size={11} />}
                      <span>{item.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handlePing(item.name)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      <RefreshCw size={11} />
                      <span>Ping</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border/80 bg-slate-900/40 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span>
            {filteredNodes.length === 0
              ? 'Showing 0 services'
              : `Showing ${page * pageSize + 1} to ${Math.min((page + 1) * pageSize, filteredNodes.length)} of ${filteredNodes.length} services`}
          </span>
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-[11px] text-slate-500">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(0);
              }}
              className="rounded-lg border border-border/80 bg-slate-900 px-2 py-0.5 text-xs text-slate-300 focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold transition-all cursor-pointer"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            <ChevronLeft size={14} />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPage(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  page === idx ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold transition-all cursor-pointer"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          >
            <span>Next</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
