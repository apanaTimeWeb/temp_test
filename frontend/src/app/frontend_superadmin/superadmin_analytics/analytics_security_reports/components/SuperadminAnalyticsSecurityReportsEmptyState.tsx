'use client';
// RESPONSIBILITY: Display placeholder when security audit logs or events have 0 matches.

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function SuperadminAnalyticsSecurityReportsEmptyState() {
  return (
    <div
      className="p-12 text-center rounded-2xl border border-dashed border-border/70 bg-card/40 backdrop-blur-xs space-y-3"
      data-testid="security-reports-empty-state"
    >
      <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
        <ShieldCheck size={24} />
      </div>
      <h3 className="text-sm font-bold text-foreground">No Security Events Found</h3>
      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
        No login attempts, lockout incidents, or threat anomalies match the selected query criteria.
        Try adjusting your search keywords or filter criteria.
      </p>
    </div>
  );
}
