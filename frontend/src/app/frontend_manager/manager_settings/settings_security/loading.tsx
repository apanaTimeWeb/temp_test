export default function ManagerSettingsSecurityLoading() {
  return (
    <main
      className="min-h-screen bg-background p-6"
      aria-busy="true"
      aria-label="Loading Security Settings"
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-6 w-48 motion-safe:animate-pulse rounded-md bg-muted" />
        <div className="h-28 w-full motion-safe:animate-pulse rounded-2xl bg-card border border-border" />
        <div className="h-12 w-full motion-safe:animate-pulse rounded-xl bg-muted/60" />
        <div className="h-96 w-full motion-safe:animate-pulse rounded-2xl bg-card border border-border" />
      </div>
    </main>
  );
}
