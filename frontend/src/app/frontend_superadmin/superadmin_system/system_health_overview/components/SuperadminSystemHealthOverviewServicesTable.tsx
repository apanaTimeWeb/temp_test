'use client';
import { useState, useMemo } from 'react';
import { Server, Activity, Search, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle, RefreshCw, Cpu, HardDrive, Eye, RotateCw, Sparkles, Filter } from 'lucide-react';
import { toast } from 'sonner';
import SuperadminSystemHealthOverviewInspectModal from './SuperadminSystemHealthOverviewInspectModal';
import SuperadminSystemHealthOverviewRestartModal from './SuperadminSystemHealthOverviewRestartModal';

export interface ServiceNode {
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

export const SAMPLE_SERVICE_NODES: ServiceNode[] = [
  { id: 'srv-1', name: 'PostgreSQL Primary Cluster', category: 'Database', node: 'db-master-01 (ap-south-1a)', latency: '3.2ms', cpu: 42, memory: '12.4 GB / 32 GB', status: 'Healthy', uptime: '99.99%' },
  { id: 'srv-2', name: 'Redis Sentinel Cache', category: 'Cache', node: 'redis-node-01 (ap-south-1a)', latency: '0.8ms', cpu: 18, memory: '4.1 GB / 8 GB', status: 'Healthy', uptime: '100%' },
  { id: 'srv-3', name: 'Auth Gateway & Session Validator', category: 'Security', node: 'auth-edge-01 (global)', latency: '18ms', cpu: 34, memory: '1.8 GB / 4 GB', status: 'Healthy', uptime: '99.98%' },
  { id: 'srv-4', name: 'Background Job Worker Pool', category: 'Compute', node: 'worker-pool-a (ap-south-1b)', latency: '45ms', cpu: 78, memory: '7.2 GB / 16 GB', status: 'Healthy', uptime: '99.95%' },
  { id: 'srv-5', name: 'WhatsApp Business Graph Bridge', category: 'Integration', node: 'comm-gw-01 (ap-south-1a)', latency: '110ms', cpu: 22, memory: '1.2 GB / 2 GB', status: 'Healthy', uptime: '99.90%' },
  { id: 'srv-6', name: 'Media Asset CDN & Transcoder', category: 'Storage', node: 'storage-cdn-02 (global)', latency: '24ms', cpu: 68, memory: '11.8 GB / 16 GB', status: 'Healthy', uptime: '99.85%' },
  { id: 'srv-7', name: 'Full-text Search Indexer', category: 'Search', node: 'es-cluster-01 (ap-south-1b)', latency: '12ms', cpu: 29, memory: '6.5 GB / 16 GB', status: 'Healthy', uptime: '99.99%' },
  { id: 'srv-8', name: 'Telemetry Log Aggregator', category: 'Observability', node: 'prom-loki-01 (ap-south-1a)', latency: '32ms', cpu: 15, memory: '3.1 GB / 8 GB', status: 'Idle', uptime: '99.99%' },
];

const CATEGORIES = ['All', 'Database', 'Cache', 'Security', 'Compute', 'Integration', 'Storage', 'Search', 'Observability'] as const;

export default function SuperadminSystemHealthOverviewServicesTable() {
  const [services, setServices] = useState<ServiceNode[]>(SAMPLE_SERVICE_NODES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const [pingingId, setPingingId] = useState<string | null>(null);
  const [pingAllActive, setPingAllActive] = useState(false);
  const [inspectingService, setInspectingService] = useState<ServiceNode | null>(null);
  const [restartingService, setRestartingService] = useState<ServiceNode | null>(null);

  const filteredNodes = useMemo(() => {
    return services.filter((item) => {
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.node.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [services, search, statusFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredNodes.length / pageSize));
  const paginatedNodes = useMemo(() => {
    const start = page * pageSize;
    return filteredNodes.slice(start, start + pageSize);
  }, [filteredNodes, page, pageSize]);

  const handlePing = (name: string, id?: string) => {
    const targetId = id || services.find((s) => s.name === name)?.id;
    if (targetId) setPingingId(targetId);

    setTimeout(() => {
      const randomPing = (Math.random() * 20 + 2).toFixed(1) + 'ms';
      setServices((prev) =>
        prev.map((s) => (s.name === name ? { ...s, latency: randomPing } : s))
      );
      setPingingId(null);
      toast.success(`Service check: ${name} responded OK (200 in ${randomPing})`);
    }, 400);
  };

  const handlePingAll = () => {
    setPingAllActive(true);
    toast.info('Pinging all 8 cluster services simultaneously...');

    setTimeout(() => {
      setServices((prev) =>
        prev.map((s) => ({
          ...s,
          latency: (Math.random() * 25 + 1.5).toFixed(1) + 'ms',
          status: 'Healthy' as const,
        }))
      );
      setPingAllActive(false);
      toast.success('All cluster services responded OK (HTTP 200)');
    }, 800);
  };

  const handleRestartComplete = (serviceId: string) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === serviceId
          ? { ...s, status: 'Healthy', cpu: Math.max(12, Math.floor(s.cpu * 0.7)), latency: '4.2ms' }
          : s
      )
    );
  };

  return (
    <>
      <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-[#0b0e24] via-slate-900/90 to-[#080b1a] shadow-xl overflow-hidden mb-6">
        {/* Table Header Controls */}
        <div className="flex flex-col gap-4 p-5 sm:p-6 border-b border-border/80 bg-slate-900/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2.5">
                <Server size={20} className="text-emerald-400" />
                <span>Core Microservices & Server Telemetry</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  {services.filter((s) => s.status === 'Healthy').length}/{services.length} Healthy
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time heartbeat probes, memory allocation & latency benchmarks across AWS ap-south-1 nodes
              </p>
            </div>

            <button
              type="button"
              onClick={handlePingAll}
              disabled={pingAllActive}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
            >
              <RefreshCw size={13} className={pingAllActive ? 'animate-spin' : ''} />
              <span>{pingAllActive ? 'Pinging All Nodes...' : 'Ping All Services'}</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {CATEGORIES.map((cat) => {
              const count = cat === 'All' ? services.length : services.filter((s) => s.category === cat).length;
              const active = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategoryFilter(cat);
                    setPage(0);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-sm'
                      : 'border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {cat} <span className="text-[10px] opacity-70 ml-1">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Search & Status Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-border/40">
            <div className="relative flex-1 sm:max-w-xs">
              <Search size={14} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                placeholder="Search service, cluster node, or tag..."
                className="w-full rounded-xl border border-emerald-500/25 bg-slate-900/80 pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-400 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Filter size={13} />
                <span>Status:</span>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
                className="rounded-xl border border-emerald-500/25 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-200 focus:border-emerald-400 focus:outline-none cursor-pointer"
              >
                <option value="All">All Statuses ({services.length})</option>
                <option value="Healthy">Healthy ({services.filter((s) => s.status === 'Healthy').length})</option>
                <option value="Degraded">Degraded ({services.filter((s) => s.status === 'Degraded').length})</option>
                <option value="Idle">Idle ({services.filter((s) => s.status === 'Idle').length})</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-border/80">
              <tr>
                <th className="px-5 py-3.5">Service Name & Layer</th>
                <th className="px-5 py-3.5">Cluster Instance</th>
                <th className="px-5 py-3.5">Ping Latency</th>
                <th className="px-5 py-3.5">CPU & Memory Load</th>
                <th className="px-5 py-3.5">Uptime (30D)</th>
                <th className="px-5 py-3.5">Health Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-slate-200">
              {paginatedNodes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold text-slate-300">No services match the active filter</p>
                    <p className="text-xs text-slate-500 mt-1">Try resetting your search query or category filter</p>
                  </td>
                </tr>
              ) : (
                paginatedNodes.map((item) => (
                  <tr key={item.id} className="hover:bg-emerald-500/5 transition-colors group">
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
                          className={`h-full rounded-full transition-all duration-300 ${
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
                            item.status === 'Healthy' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                          }`}
                        />
                        <span>{item.status}</span>
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handlePing(item.name, item.id)}
                          disabled={pingingId === item.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                          title="Send ping heartbeat probe"
                        >
                          <RefreshCw size={11} className={pingingId === item.id ? 'animate-spin' : ''} />
                          <span>{pingingId === item.id ? 'Pinging' : 'Ping'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setInspectingService(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
                          title="Inspect node telemetry & logs"
                        >
                          <Eye size={11} />
                          <span>Inspect</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setRestartingService(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
                          title="Graceful restart worker"
                        >
                          <RotateCw size={11} />
                          <span>Restart</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-border/80 bg-slate-900/40 text-xs text-slate-400">
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
                className="rounded-lg border border-border/80 bg-slate-900 px-2 py-0.5 text-xs text-slate-300 focus:outline-none cursor-pointer"
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

      {/* Inspect Modal */}
      <SuperadminSystemHealthOverviewInspectModal
        service={inspectingService}
        onClose={() => setInspectingService(null)}
        onPing={(name) => handlePing(name)}
        onRestartRequest={(svc) => setRestartingService(svc)}
      />

      {/* Restart Confirmation Modal */}
      <SuperadminSystemHealthOverviewRestartModal
        service={restartingService}
        onClose={() => setRestartingService(null)}
        onRestartComplete={handleRestartComplete}
      />
    </>
  );
}
