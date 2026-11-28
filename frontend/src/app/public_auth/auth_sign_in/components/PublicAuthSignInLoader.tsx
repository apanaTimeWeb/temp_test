'use client';

/**
 * Animated LibraryOS diamond loader rings for submit & post-login page transition states.
 */
export function PublicAuthSignInLoader() {
  return (
    <>
      <svg className="auth-loader-defs" aria-hidden="true">
        <defs>
          <linearGradient id="libGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" className="[stop-color:var(--chart-info)]" />
            <stop offset="50%" className="[stop-color:var(--primary)]" />
            <stop offset="100%" className="[stop-color:var(--chart-secondary)]" />
          </linearGradient>
        </defs>
      </svg>

      <div className="loader-box contra auth-loader-box" role="status" aria-label="Loading">
        <div className="loader-aura" />

        <svg className="loader-ring" viewBox="0 0 100 100" fill="none">
          <circle
            cx="50"
            cy="50"
            r="44"
            stroke="currentColor"
            className="text-indigo-500"
            strokeWidth="2.5"
            strokeDasharray="4 6"
            opacity="0.35"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx="50"
            cy="50"
            r="44"
            stroke="url(#libGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeDasharray="95 180"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <svg className="inner-svg" viewBox="0 0 100 100" fill="none">
          <circle
            cx="50"
            cy="50"
            r="35"
            stroke="currentColor"
            className="text-cyan-400"
            strokeWidth="1.8"
            strokeDasharray="6 10"
            opacity="0.75"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="loader-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </svg>
        </div>
      </div>
    </>
  );
}

/** Full-screen page blocker overlay for auth login transition. */
export function PublicAuthBlockerOverlay() {
  return (
    <div
      className="auth-loader-overlay fixed inset-0 z-50 flex items-center justify-center pointer-events-auto"
      role="status"
      aria-label="Loading"
    >
      <PublicAuthSignInLoader />
    </div>
  );
}

/** Compact button loader (20px) for submit button busy feedback. */
export function PublicAuthButtonLoader() {
  return (
    <div className="loader-box contra auth-loader-box auth-loader-box--sm button-loader">
      <div className="loader-aura" />
      <svg className="loader-ring" viewBox="0 0 100 100" fill="none">
        <circle
          cx="50"
          cy="50"
          r="44"
          stroke="currentColor"
          className="text-indigo-500"
          strokeWidth="2.5"
          strokeDasharray="4 6"
          opacity="0.4"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx="50"
          cy="50"
          r="44"
          stroke="currentColor"
          className="text-cyan-400"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="95 180"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <svg className="inner-svg" viewBox="0 0 100 100" fill="none">
        <circle
          cx="50"
          cy="50"
          r="35"
          stroke="currentColor"
          className="text-violet-400"
          strokeWidth="1.8"
          strokeDasharray="6 10"
          opacity="0.8"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="loader-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      </div>
    </div>
  );
}

export default PublicAuthSignInLoader;
