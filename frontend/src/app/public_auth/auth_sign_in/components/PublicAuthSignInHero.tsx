'use client';

import { BookOpen } from 'lucide-react';

/** Displays the desktop LibraryOS multi-branch hero brand panel for Sign In. */
export default function PublicAuthSignInHero() {
  return (
    <section className="hidden lg:flex lg:w-7/12 xl:w-1/2 flex-col justify-between p-8 xl:p-12 h-full glass-left relative z-10">
      <div className="flex items-center gap-3">
        <span className="brand-logo-mark" aria-hidden="true">
          <BookOpen size={18} strokeWidth={2.2} className="text-white drop-shadow-xs" />
        </span>
        <span className="text-xl font-extrabold tracking-tight text-white flex items-center">
          <span>Library</span>
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-black ml-0.5">
            OS
          </span>
        </span>
      </div>

      <div className="max-w-xl space-y-6 my-auto">
        <div className="inline-flex items-center gap-2 bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 motion-safe:animate-pulse" />
          Multi-Branch Study Library Management System
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
            One Platform. Every Branch.
            <br />
            <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
              Complete Control.
            </span>
          </h1>

          <p className="text-slate-300 text-sm xl:text-base leading-relaxed">
            Manage your entire study library operation from one centralized platform. Oversee multiple branches, manage
            student admissions and memberships, organize seats and shifts, track attendance, assign smart lockers, and
            monitor fees, finance and daily operations — all in one place.
          </p>
        </div>

        <div className="pt-1">
          <div className="inline-flex items-center gap-2.5 rounded-xl border border-indigo-500/25 bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-transparent px-4 py-2.5 text-xs font-bold text-white shadow-sm">
            <span className="auth-hero-orb-glow flex h-2 w-2 rounded-full bg-indigo-400" />
            <span>Designed for Modern Study Libraries &amp; Reading Rooms.</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-3">
        <p>&copy; {new Date().getFullYear()} LibraryOS. All rights reserved.</p>
        <span className="text-xs text-slate-400">Multi-Branch Platform</span>
      </div>
    </section>
  );
}
