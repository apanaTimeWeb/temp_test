// components/SuperadminDataBackupOperationsSkeleton.tsx
// RESPONSIBILITY: Renders skeleton placeholder layout mimicking final UI to stabilize CLS (<0.1). No API calls.
'use client';

import React from 'react';

export function SuperadminDataBackupOperationsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" data-testid="data_backup-skeleton">
      <div className="h-28 rounded-xl border border-border bg-card/60 p-5 space-y-3" />
      <div className="h-10 w-full max-w-sm bg-neutral-800 rounded-lg" />
      <div className="h-64 rounded-xl border border-border bg-card/60 p-4 space-y-4">
        <div className="h-6 w-48 bg-neutral-800 rounded" />
        <div className="h-44 w-full bg-neutral-800/40 rounded" />
      </div>
    </div>
  );
}
