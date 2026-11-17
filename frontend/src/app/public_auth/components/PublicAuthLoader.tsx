'use client';

import React from 'react';

/**
 * PublicAuthLoginLoader
 * Exact Library Loader implementation for Auth module.
 */
export function PublicAuthLoginLoader() {
  return (
    <>
      <style>{`
        .auth-loader-box {
          position: relative;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .auth-loader-box .loader-aura {
          position: absolute; inset: 0; border-radius: 50%;
          filter: blur(12px); opacity: 0.4; pointer-events: none;
          background: radial-gradient(circle, #F4D03F 0%, #C8912A 50%, transparent 80%);
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
          color: #1E3A5F;
        }
        .auth-loader-box .loader-icon svg {
          width: 45%; height: 45%;
          filter: drop-shadow(0 0 4px rgba(200,145,42,0.45));
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
          <linearGradient id="libGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F4D03F" />
            <stop offset="50%" stopColor="#C8912A" />
            <stop offset="100%" stopColor="#1E3A5F" />
          </linearGradient>
        </defs>
      </svg>

      <div className="loader-box contra auth-loader-box" style={{ width: '96px', height: '96px' }} role="status" aria-label="Loading">
        <div className="loader-aura" />

        {/* Outer CW ring (golden gradient) */}
        <svg className="loader-ring" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="44" stroke="#C8912A" strokeWidth="2.5"
            strokeDasharray="4 6" opacity="0.3" vectorEffect="non-scaling-stroke" />
          <circle cx="50" cy="50" r="44" stroke="url(#libGrad)" strokeWidth="3"
            strokeLinecap="round" strokeDasharray="95 180" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* Inner CCW ring (navy dashed) */}
        <svg className="inner-svg" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="35" stroke="#1E3A5F" strokeWidth="1.5"
            strokeDasharray="6 10" opacity="0.4" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* Dashboard icon */}
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
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background: 'rgba(3, 7, 18, 0.6)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        cursor: 'wait',
      }}
      role="status"
      aria-label="Loading"
    >
      <PublicAuthLoginLoader />
    </div>
  );
}

/** Button loader (20px) for submit button */
export function PublicAuthButtonLoader() {
  return (
    <div className="loader-box contra auth-loader-box button-loader" style={{ width: 20, height: 20 }}>
      <div className="loader-aura" style={{ opacity: 0.2 }} />
      <svg className="loader-ring" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="44" stroke="#C8912A" strokeWidth="2.5" strokeDasharray="4 6" opacity="0.5" vectorEffect="non-scaling-stroke" />
        <circle cx="50" cy="50" r="44" stroke="#F4D03F" strokeWidth="3" strokeLinecap="round" strokeDasharray="95 180" vectorEffect="non-scaling-stroke" />
      </svg>
      <svg className="inner-svg" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="35" stroke="#1E3A5F" strokeWidth="1.5" strokeDasharray="6 10" opacity="0.4" vectorEffect="non-scaling-stroke" />
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

export default PublicAuthLoginLoader;
