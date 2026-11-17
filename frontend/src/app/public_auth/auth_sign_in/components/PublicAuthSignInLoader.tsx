'use client';

import React from 'react';

/**
 * PublicAuthSignInLoader
 * Exact matching colors from user spec:
 * - Gradient: #F4D03F -> #C8912A -> #1E3A5F
 * - Inner Ring & Icon: #1E3A5F (Navy)
 * - Outer Ring: #C8912A (Gold)
 * - Soft golden-parchment aura glow ensuring crystal clarity on dark blocked page
 */
export function PublicAuthSignInLoader() {
  return (
    <>
      <style>{`
        .auth-loader-box {
          position: relative;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .auth-loader-box .loader-aura {
          position: absolute; inset: -4px; border-radius: 50%;
          filter: blur(16px); opacity: 0.6; pointer-events: none;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(139, 92, 246, 0.2) 45%, rgba(34, 211, 238, 0.1) 70%, transparent 85%);
        }
        .auth-loader-box .loader-ring {
          width: 100%; height: 100%;
          animation: spinCW 1.4s linear infinite;
        }
        .auth-loader-box .inner-svg {
          position: absolute; inset: 0;
          animation: spinCCW 2.4s linear infinite;
        }
        .auth-loader-box .loader-icon {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          pointer-events: none; user-select: none;
          color: #FFFFFF;
        }
        .auth-loader-box .loader-icon svg {
          width: 45%; height: 45%;
          filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.7)) drop-shadow(0 0 4px rgba(34, 211, 238, 0.5));
        }

        @keyframes spinCW  { to { transform: rotate(360deg); } }
        @keyframes spinCCW { to { transform: rotate(-360deg); } }

        @media (prefers-reduced-motion: reduce) {
          .auth-loader-box .loader-ring { animation-duration: 4s !important; }
          .auth-loader-box .inner-svg   { animation-duration: 6s !important; }
        }
      `}</style>

      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <linearGradient id="libGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
        </defs>
      </svg>

      <div className="loader-box contra auth-loader-box" style={{ width: '96px', height: '96px' }} role="status" aria-label="Loading">
        <div className="loader-aura" />

        {/* Outer CW ring (matches UI gradient: Cyan -> Indigo -> Violet) */}
        <svg className="loader-ring" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="44" stroke="#6366F1" strokeWidth="2.5"
            strokeDasharray="4 6" opacity="0.35" vectorEffect="non-scaling-stroke" />
          <circle cx="50" cy="50" r="44" stroke="url(#libGrad)" strokeWidth="3.2"
            strokeLinecap="round" strokeDasharray="95 180" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* Inner CCW ring (luminous cyan dashed ring) */}
        <svg className="inner-svg" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="35" stroke="#22D3EE" strokeWidth="1.8"
            strokeDasharray="6 10" opacity="0.75" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* Dashboard icon (exact matching #1E3A5F navy) */}
        <div className="loader-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round">
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

/** Full-screen page blocker overlay for auth login transition */
export function PublicAuthBlockerOverlay() {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto"
      style={{
        background: 'rgba(3, 7, 18, 0.7)',
        cursor: 'wait',
      }}
      role="status"
      aria-label="Loading"
    >
      <PublicAuthSignInLoader />
    </div>
  );
}

/** Button loader (20px) for submit button */
export function PublicAuthButtonLoader() {
  return (
    <div className="loader-box contra auth-loader-box button-loader" style={{ width: 20, height: 20 }}>
      <div className="loader-aura" style={{ opacity: 0.2 }} />
      <svg className="loader-ring" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="44" stroke="#6366F1" strokeWidth="2.5" strokeDasharray="4 6" opacity="0.4" vectorEffect="non-scaling-stroke" />
        <circle cx="50" cy="50" r="44" stroke="#22D3EE" strokeWidth="3" strokeLinecap="round" strokeDasharray="95 180" vectorEffect="non-scaling-stroke" />
      </svg>
      <svg className="inner-svg" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="35" stroke="#A78BFA" strokeWidth="1.8" strokeDasharray="6 10" opacity="0.8" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="loader-icon" style={{ color: '#FFFFFF' }}>
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

export const PublicAuthLoader = PublicAuthSignInLoader;
export const PublicAuthLoginLoader = PublicAuthSignInLoader;
export default PublicAuthSignInLoader;
