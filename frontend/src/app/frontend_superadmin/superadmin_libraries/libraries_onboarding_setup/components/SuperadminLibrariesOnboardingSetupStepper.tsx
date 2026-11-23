'use client';

import React from 'react';
import {
  BookOpen, Check, SkipForward, Building2, Clock, Armchair, CreditCard, Rocket, Lightbulb,
} from 'lucide-react';
import { SUPERADMIN_SETUP_WIZARD_STEPS as STEPS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/constants/SuperadminLibrariesOnboardingSetupConstants';

const STEP_ICONS = [Building2, Clock, Armchair, CreditCard, Rocket] as const;

interface StepperProps {
  step: number;
  setStep: (step: number) => void;
  openSkipModal: () => void;
  tCopy: (key: string) => string;
  progress: number;
}

export default function SuperadminLibrariesOnboardingSetupStepper({
  step,
  setStep,
  openSkipModal,
  tCopy,
  progress,
}: StepperProps) {
  return (
    <section
      aria-label="Onboarding Progress Stepper"
      className="rounded-2xl border border-indigo-500/20 bg-card/70 backdrop-blur-md p-4 sm:p-6 shadow-xl shadow-black/20"
    >
      {/* Header strip inside stepper */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-4 border-b border-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shadow-md shadow-indigo-500/10">
            <BookOpen size={20} className="text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-100">{tCopy("COPY.SETUP_WIZARD")}</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                {tCopy("COPY.STEP")} {step} {tCopy("COPY.OF")} {STEPS.length}
              </span>
            </div>
            <p className="text-xs text-slate-400">Library Onboarding Pipeline</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            id="skip-setup-btn"
            type="button"
            onClick={openSkipModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700/60 bg-slate-800/60 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-600 transition-all cursor-pointer shadow-xs"
            data-testid="superadmin-setup-wizard-setup-wizard-overview-skip-setup-btn-2"
          >
            <SkipForward size={13} className="text-slate-400" /> {tCopy("COPY.SKIP_SETUP")}
          </button>
          <button
            id="skip-setup-sidebar-btn"
            type="button"
            onClick={openSkipModal}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700/40 bg-transparent text-xs text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
            data-testid="superadmin-setup-wizard-setup-wizard-overview-skip-setup-sidebar-btn-1"
          >
            {tCopy("COPY.SKIP_SETUP_FOR_NOW")}
          </button>
        </div>
      </div>

      {/* Dynamic Progress Track */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="text-indigo-300 font-medium flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            {tCopy(STEPS[step - 1].titleKey)}
          </span>
          <span className="font-semibold text-slate-300">{Math.round(progress)}% Completed</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-800/80 overflow-hidden p-0.5 border border-slate-700/40">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${Math.max(6, progress)}%` }}
          />
        </div>
        <progress className="sr-only" max={100} value={progress} aria-label={tCopy("COPY.SETUP_WIZARD_COMPLETION")} />
      </div>

      {/* 5-Step Horizontal Grid Stepper */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
        {STEPS.map((s, idx) => {
          const Icon = STEP_ICONS[idx] ?? Building2;
          void Icon;
          const isActive = s.num === step;
          const isDone   = s.num < step;

          return (
            <div
              key={s.num}
              onClick={() => { if (isDone) setStep(s.num); }}
              className={`group relative flex flex-col items-center text-center p-2 sm:p-2.5 rounded-xl transition-all ${
                isDone
                  ? 'cursor-pointer hover:bg-slate-800/50'
                  : isActive
                  ? 'bg-indigo-500/10 border border-indigo-500/30 shadow-md shadow-indigo-500/10'
                  : 'opacity-50 cursor-default'
              }`}
            >
              {/* Horizontal connector line */}
              {idx < STEPS.length - 1 && (
                <div
                  className={`hidden sm:block absolute top-5 sm:top-6 left-[calc(50%+16px)] sm:left-[calc(50%+20px)] w-[calc(100%-32px)] sm:w-[calc(100%-40px)] h-0.5 z-0 transition-colors ${
                    isDone ? 'bg-emerald-500/70' : 'bg-slate-700/40'
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Step Circle Badge */}
              <div
                className={`relative z-10 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full text-xs font-bold transition-all duration-200 ${
                  isDone
                    ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/20'
                    : isActive
                    ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 border-2 border-indigo-400 text-white shadow-lg shadow-indigo-500/50 ring-4 ring-indigo-500/20 scale-105'
                    : 'bg-slate-900 border-2 border-slate-700/80 text-slate-400'
                }`}
              >
                {isDone ? (
                  <Check size={16} className="text-emerald-400" />
                ) : (
                  <span className="sa-wizard-step-num-badge font-bold">{s.num}</span>
                )}
              </div>

              {/* Step Title & Subtitle */}
              <div className="mt-2 min-w-0 max-w-full">
                <p
                  className={`text-xs sm:text-sm font-semibold truncate ${
                    isActive
                      ? 'text-indigo-300 font-bold'
                      : isDone
                      ? 'text-slate-200 group-hover:text-white'
                      : 'text-slate-400'
                  }`}
                >
                  {tCopy(s.titleKey)}
                </p>
                <p className="hidden md:block text-[11px] text-slate-400 truncate mt-0.5">
                  {tCopy(s.descKey)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tip hint underneath horizontal stepper */}
      <div className="mt-4 pt-3 border-t border-indigo-500/10 flex items-center gap-2 text-xs text-amber-200/90 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl">
        <Lightbulb size={15} className="text-amber-400 shrink-0" />
        <span>{tCopy("COPY.YOU_CAN_UPDATE_THESE_SETTINGS_ANYTIME_FROM_YOUR_DASHBOARD")}</span>
      </div>
    </section>
  );
}
