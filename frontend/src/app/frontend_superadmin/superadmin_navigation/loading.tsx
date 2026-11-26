export default function SuperadminNavigationLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center p-8" role="status" aria-label="Loading navigation">
      <div className="h-8 w-8 motion-safe:animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <span className="sr-only">Loading navigation...</span>
    </div>
  );
}
