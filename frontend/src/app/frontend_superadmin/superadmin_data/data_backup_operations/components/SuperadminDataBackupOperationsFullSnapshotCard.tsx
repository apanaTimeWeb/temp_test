// components/SuperadminDataBackupOperationsFullSnapshotCard.tsx
// RESPONSIBILITY: Renders the full platform recovery trigger banner card with RPO/RTO indicators. No direct API calls.
'use client';

import React from 'react';
import { ShieldCheck, Play, Server, Cloud, Lock } from 'lucide-react';

interface SuperadminDataBackupOperationsFullSnapshotCardProps {
  onTriggerFullBackup: () => void;
}

export function SuperadminDataBackupOperationsFullSnapshotCard({
  onTriggerFullBackup,
}: SuperadminDataBackupOperationsFullSnapshotCardProps) {
  return (
    <div
      className="p-5 rounded-xl border border-pink-500/30 bg-gradient-to-r from-pink-950/20 via-card to-card shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      data-testid="data_backup-full-snapshot-banner"
    >
      <div className="space-y-1.5 max-w-2xl">
        <div className="flex items-center gap-2 text-foreground font-bold text-sm">
          <span className="p-1 rounded-md bg-pink-500/20 text-pink-400">
            <ShieldCheck size={16} />
          </span>
          <span>Full Platform Disaster Recovery Snapshot</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
            RPO Target ≤ 15m
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Generates an atomic, point-in-time image of all 48 tenant PostgreSQL databases, binary object storage, and active WAL records. Replicated synchronously to secondary disaster recovery regions with hardware-level AES-256-GCM encryption.
        </p>
        <div className="flex items-center gap-4 pt-1 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Cloud size={12} className="text-pink-400" /> Dual-Region Cloud Sync
          </span>
          <span className="inline-flex items-center gap-1">
            <Lock size={12} className="text-emerald-400" /> AES-256-GCM Encrypted
          </span>
          <span className="inline-flex items-center gap-1">
            <Server size={12} className="text-sky-400" /> Zero Tenant Bleed Partition
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onTriggerFullBackup}
        className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-extrabold bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 hover:from-pink-500 hover:to-rose-400 text-white motion-safe:transition-all motion-safe:duration-300 shadow-lg shadow-pink-600/30 hover:shadow-pink-500/50 hover:scale-[1.02] active:scale-[0.97] shrink-0 cursor-pointer"
        data-testid="data_backup-trigger-full-btn"
      >
        <span className="p-1 rounded-md bg-white/20 text-white border border-white/30 group-hover:scale-110 transition-transform">
          <Play size={13} className="fill-white" />
        </span>
        <span>Trigger Full Platform Backup</span>
      </button>
    </div>
  );
}
