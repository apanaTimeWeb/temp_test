import type { ReactNode } from 'react';

// RESPONSIBILITY: Render layout boundary for SuperAdmin Integration & API Management.
// Payment gateways, SMS, WhatsApp, webhooks, APIs.

export default function SuperadminIntegrationsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-full min-w-0 p-0">
      {children}
    </div>
  );
}
