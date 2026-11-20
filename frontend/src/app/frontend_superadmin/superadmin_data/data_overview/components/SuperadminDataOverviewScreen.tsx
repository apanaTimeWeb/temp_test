'use client';

import React, { useState } from 'react';
import {
  Archive,
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle2,
  Clock,
  Database,
  Download,
  HardDrive,
  History,
  Play,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

interface BackupSnapshot {
  id: string;
  name: string;
  type: 'Automated Daily' | 'Manual Snapshot' | 'Pre-migration';
  size: string;
  timestamp: string;
  status: 'Ready' | 'Verified' | 'Archived';
}

const SNAPSHOTS: BackupSnapshot[] = [
  {
    id: 'snap-1',
    name: 'auto-backup-prod-2026-11-20-0000',
    type: 'Automated Daily',
    size: '1.42 GB',
    timestamp: 'Today at 00:00 AM',
    status: 'Verified',
  },
  {
    id: 'snap-2',
    name: 'auto-backup-prod-2026-11-19-0000',
    type: 'Automated Daily',
    size: '1.40 GB',
    timestamp: 'Yesterday at 00:00 AM',
    status: 'Ready',
  },
  {
    id: 'snap-3',
    name: 'manual-pre-schema-upgrade',
    type: 'Manual Snapshot',
    size: '1.38 GB',
    timestamp: '18 Nov 2026, 04:30 PM',
    status: 'Verified',
  },
];

export default function SuperadminDataOverviewScreen() {
  const [activeTab, setActiveTab] = useState<'backup' | 'import_export' | 'retention'>('backup');
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);

  const handleTriggerBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      setBackupSuccess(true);
      setTimeout(() => setBackupSuccess(false), 4000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
              <Database size={22} />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                14. Data & Backup Management
                <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 font-semibold">
                  Disaster Recovery
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400">
                Backup, restore, import, export, archive, retention operations
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['backup', 'import_export', 'retention'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-pink-600 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {tab === 'backup' ? 'Backups & Recovery' : tab === 'import_export' ? 'Import & Export' : 'Retention & Archiving'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'backup' && (
        <div className="space-y-6">
          {/* Quick Action Card */}
          <div className="p-5 rounded-xl border border-border bg-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <ShieldCheck size={18} className="text-pink-400" />
                Automated Disaster Recovery Engine
              </div>
              <p className="text-xs text-neutral-400 mt-1 max-w-xl">
                Encrypted PostgreSQL & document storage backups execute daily at 00:00 UTC. Secondary replicas reside across dual cloud zones.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {backupSuccess && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 size={14} /> Snapshot Created!
                </span>
              )}
              <button
                onClick={handleTriggerBackup}
                disabled={isBackingUp}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-pink-600 hover:bg-pink-700 text-white transition-colors disabled:opacity-50"
              >
                <Play size={13} />
                {isBackingUp ? 'Creating Snapshot...' : 'Trigger Instant Backup'}
              </button>
            </div>
          </div>

          {/* Snapshots Table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <History size={16} className="text-pink-400" />
                Platform Recovery Snapshots
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-neutral-900/40 text-neutral-400 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Snapshot Identifier</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">File Size</th>
                    <th className="py-3 px-4">Created Time</th>
                    <th className="py-3 px-4">Integrity</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {SNAPSHOTS.map((s) => (
                    <tr key={s.id} className="hover:bg-neutral-800/20 transition-colors">
                      <td className="py-3 px-4 font-mono text-pink-300 font-semibold">{s.name}</td>
                      <td className="py-3 px-4 text-neutral-300">{s.type}</td>
                      <td className="py-3 px-4 text-neutral-300">{s.size}</td>
                      <td className="py-3 px-4 text-neutral-400">{s.timestamp}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400">
                          <CheckCircle2 size={11} /> {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button className="text-pink-400 hover:text-pink-300 font-medium">
                            Download
                          </button>
                          <span className="text-neutral-700">|</span>
                          <button className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1">
                            <RotateCcw size={11} /> Restore
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'import_export' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-border bg-card space-y-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-lg bg-pink-500/10 text-pink-400">
                <ArrowDownToLine size={20} />
              </span>
              <div>
                <h3 className="font-bold text-white text-sm">Bulk Data Importer</h3>
                <p className="text-xs text-neutral-400">Batch onboard libraries, books, or historical data</p>
              </div>
            </div>
            <div className="p-6 rounded-lg border-2 border-dashed border-border hover:border-pink-500/50 text-center cursor-pointer transition-colors bg-neutral-900/20">
              <HardDrive size={24} className="mx-auto text-neutral-500 mb-2" />
              <div className="text-xs text-neutral-300 font-medium">Click to select CSV / Excel archive</div>
              <div className="text-[11px] text-neutral-500 mt-1">Supports schema validation before import</div>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-border bg-card space-y-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <ArrowUpFromLine size={20} />
              </span>
              <div>
                <h3 className="font-bold text-white text-sm">Full Platform Data Export</h3>
                <p className="text-xs text-neutral-400">Generate GDPR & compliance data dumps</p>
              </div>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Export encrypted JSON/CSV archives of tenant records, audit trails, and financial transactions.
            </p>
            <button className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors">
              <Download size={14} /> Request Full Export Archive
            </button>
          </div>
        </div>
      )}

      {activeTab === 'retention' && (
        <div className="p-5 rounded-xl border border-border bg-card space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Archive size={18} className="text-pink-400" />
            Data Retention & Purging Policies
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
            <div className="p-4 rounded-lg bg-neutral-900/40 border border-border">
              <div className="font-semibold text-white">Audit Log Retention</div>
              <div className="text-neutral-400 mt-1">Kept for 365 days, then compressed into cold S3 storage.</div>
              <div className="text-pink-400 font-mono mt-3 text-[11px]">Status: Active (365d)</div>
            </div>
            <div className="p-4 rounded-lg bg-neutral-900/40 border border-border">
              <div className="font-semibold text-white">Temporary Session Purge</div>
              <div className="text-neutral-400 mt-1">Expired JWT tokens & sessions purged every 7 days.</div>
              <div className="text-pink-400 font-mono mt-3 text-[11px]">Status: Active (Every Sun 03:00)</div>
            </div>
            <div className="p-4 rounded-lg bg-neutral-900/40 border border-border">
              <div className="font-semibold text-white">Closed Library Archives</div>
              <div className="text-neutral-400 mt-1">Decommissioned libraries retained in read-only for 3 years.</div>
              <div className="text-pink-400 font-mono mt-3 text-[11px]">Status: Compliance Policy</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
