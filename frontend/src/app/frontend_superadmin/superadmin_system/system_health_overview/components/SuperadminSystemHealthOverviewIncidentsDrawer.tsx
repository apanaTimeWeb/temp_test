'use client';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, Clock, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface IncidentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IncidentEvent {
  id: string;
  title: string;
  severity: 'minor' | 'resolved' | 'maintenance';
  time: string;
  duration: string;
  description: string;
  servicesAffected: string[];
}

const RECENT_INCIDENTS: IncidentEvent[] = [
  {
    id: 'inc-104',
    title: 'CDN Cache Eviction Threshold Auto-Mitigated',
    severity: 'resolved',
    time: '2 hours ago',
    duration: '4m 12s',
    description: 'Media CDN memory exceeded 85% threshold. LRU eviction algorithm executed successfully and cleared 2.4 GB stale cache.',
    servicesAffected: ['Media Asset CDN & Transcoder'],
  },
  {
    id: 'inc-103',
    title: 'Automated TLS Certificate Wildcard Renewal',
    severity: 'maintenance',
    time: '14 hours ago',
    duration: '1m 05s',
    description: 'Let’s Encrypt wildcard certificate for *.libraryos.com was auto-renewed and pushed across all edge gateway proxies.',
    servicesAffected: ['Auth Gateway & Session Validator'],
  },
  {
    id: 'inc-102',
    title: 'PostgreSQL Read-Replica Connection Pool Resized',
    severity: 'resolved',
    time: 'Yesterday at 18:30 UTC',
    duration: '2m 45s',
    description: 'High student login traffic during evening peak. PgBouncer pool dynamically expanded from 600 to 1,000 connections.',
    servicesAffected: ['PostgreSQL Primary Cluster'],
  },
  {
    id: 'inc-101',
    title: 'Daily Cold Storage Snapshot Archive Complete',
    severity: 'maintenance',
    time: '2 days ago',
    duration: '6m 20s',
    description: 'Encrypted daily database backup uploaded to Cloudflare R2 bucket with checksum sha256 validation verified.',
    servicesAffected: ['Daily DB Snapshot Backup'],
  },
];

export default function SuperadminSystemHealthOverviewIncidentsDrawer({ isOpen, onClose }: IncidentsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-[#0c1022] border-l border-emerald-500/30 p-6 flex flex-col shadow-2xl text-slate-100 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">System Incident & Audit Log</h2>
              <p className="text-xs text-slate-400">Platform operational history & resolutions</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Status Indicator */}
        <div className="my-4 p-3.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-300">Zero Active Unresolved Incidents</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">100% Uptime (48h)</span>
        </div>

        {/* Timeline */}
        <div className="space-y-4 flex-1 py-2">
          {RECENT_INCIDENTS.map((item) => (
            <div key={item.id} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {item.severity === 'resolved' ? (
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  ) : (
                    <Clock size={14} className="text-sky-400 shrink-0" />
                  )}
                  <h3 className="text-xs font-bold text-slate-200">{item.title}</h3>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">{item.time}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{item.description}</p>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-500">
                <span>Duration: <strong className="text-slate-300">{item.duration}</strong></span>
                <span className="text-emerald-400/90">{item.servicesAffected[0]}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-auto border-t border-border/80 flex items-center justify-between">
          <Link
            href="/superadmin/superadmin_system/audit_logs"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>View Full Audit Logs</span>
            <ArrowUpRight size={13} />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
