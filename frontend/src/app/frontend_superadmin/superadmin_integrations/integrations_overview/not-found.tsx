// src/app/frontend_superadmin/superadmin_integrations/integrations_overview/not-found.tsx
// RESPONSIBILITY: Next.js App Router route-level 404 handler.
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <h2 className="text-lg font-bold text-foreground">Integration Resource Not Found</h2>
      <p className="mt-1 text-xs text-muted-foreground">The requested integration view or provider does not exist.</p>
      <Link
        href="/superadmin/superadmin_integrations/integrations_overview"
        className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-on-primary hover:opacity-90 transition-opacity"
      >
        Back to Integrations Hub
      </Link>
    </div>
  );
}
