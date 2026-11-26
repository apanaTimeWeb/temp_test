// components/SuperadminDataOverviewStorageBreakdown.tsx
// RESPONSIBILITY: Renders the storage breakdown cards and visual distribution bars. No API calls.
'use client';

import React from 'react';
import { PieChart, HardDrive, CheckCircle2 } from 'lucide-react';
import type { SuperadminDataOverviewStorageCategory } from '@/app/frontend_superadmin/superadmin_data/data_overview/types/superadmin_data_overview.types';
import { formatGigabytes } from '@/app/frontend_superadmin/superadmin_data/data_overview/utils/superadmin_data_overview_formatters';

interface SuperadminDataOverviewStorageBreakdownProps {
  storage: SuperadminDataOverviewStorageCategory[] | undefined;
}

export function SuperadminDataOverviewStorageBreakdown({ storage }: SuperadminDataOverviewStorageBreakdownProps) {
  if (!storage || storage.length === 0) return null;

  return (
    <div className="p-5 rounded-xl border border-border bg-card shadow-xs space-y-4" data-testid="data_overview-storage-breakdown">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
            <PieChart size={18} />
          </span>
          <div>
            <h3 className="text-sm font-bold text-foreground">Storage Allocation by Component</h3>
            <p className="text-xs text-muted-foreground">Encrypted dual-cloud target (AWS S3 + Cloudflare R2)</p>
          </div>
        </div>
        <span className="text-xs text-muted-foreground font-mono">AES-256 Verified</span>
      </div>

      {/* Multi-segment visual bar */}
      <div className="w-full h-3 rounded-full bg-neutral-800 overflow-hidden flex">
        {storage.map((item) => (
          <div
            key={item.category}
            style={{ width: `${item.percentage}%`, backgroundColor: item.colorHex }}
            title={`${item.category}: ${item.percentage}%`}
            className="h-full motion-safe:transition-all"
          />
        ))}
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        {storage.map((item) => (
          <div key={item.category} className="p-3 rounded-lg bg-neutral-900/40 border border-border/50">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.colorHex }} />
              <span className="text-xs font-semibold text-foreground truncate">{item.category}</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-lg font-bold text-foreground">{formatGigabytes(item.sizeGb)}</span>
              <span className="text-xs font-semibold text-muted-foreground">{item.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
