// components/SuperadminIntegrationsOverviewScreen.tsx
// RESPONSIBILITY: Entry-level client component wrapper for integrations_overview route.
// DATA FLOW: App Router -> SuperadminIntegrationsOverviewScreen -> SuperadminIntegrationsOverviewMain.
'use client';

import React from 'react';
import { SuperadminIntegrationsOverviewMain } from './SuperadminIntegrationsOverviewMain';

export default function SuperadminIntegrationsOverviewScreen() {
  return (
    <div
      className="w-full max-w-full min-w-0 space-y-6 text-slate-100 pb-12"
      data-feature-submodule="integrations_overview"
    >
      <SuperadminIntegrationsOverviewMain />
    </div>
  );
}
