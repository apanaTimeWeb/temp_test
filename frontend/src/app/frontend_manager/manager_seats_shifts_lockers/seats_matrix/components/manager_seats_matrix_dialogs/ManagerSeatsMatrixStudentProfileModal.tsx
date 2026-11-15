'use client';

import React, { useEffect } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  Armchair,
  ExternalLink,
  MessageCircle,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
} from 'lucide-react';
import type { SeatData } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixTypes';
import { MANAGER_SEATS_MATRIX_ROUTES } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/config/manager_seats_matrix.url_config';

interface ManagerSeatsMatrixStudentProfileModalProps {
  isOpen: boolean;
  seat: SeatData | null;
  onClose: () => void;
  onNavigateToDirectory?: (smartId: string) => void;
}

export function ManagerSeatsMatrixStudentProfileModal({
  isOpen,
  seat,
  onClose,
  onNavigateToDirectory,
}: ManagerSeatsMatrixStudentProfileModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !seat || !seat.student) return null;

  const studentName = seat.student;
  const smartId = seat.smartId || `LIB-${seat.id.padStart(5, '0')}`;
  const gender = seat.studentGender || 'Male';
  const shift = seat.shift || 'Morning';
  const expiry = seat.expiry || 'Active';
  const seatId = seat.id;
  const wing = seat.wing || 'Ground Floor — AC Silent Reading Hall';
  const isExpiring = seat.status === 'expiring';

  // Derived shift timings
  const shiftTimingMap: Record<string, string> = {
    Morning: '06:00 AM – 12:00 PM',
    Afternoon: '12:00 PM – 04:00 PM',
    Evening: '04:00 PM – 08:00 PM',
    Night: '08:00 PM – 06:00 AM',
    'Full Day': '24 Hours (All Shifts Access)',
  };
  const timing = shiftTimingMap[shift] || '06:00 AM – 12:00 PM';

  // Derived sample contact info
  const sanitizedSeed = seatId.replace(/\D/g, '') || '12';
  const phone = `+91 98${sanitizedSeed.padStart(2, '1')}4 52190`;
  const email = `${studentName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@gmail.com`;
  const emergencyPhone = `+91 98765 ${sanitizedSeed.padStart(4, '8')}`;

  const initials = studentName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-overlay-backdrop p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-profile-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-5 max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-subtle text-primary flex items-center justify-center shrink-0">
              <ShieldCheck size={20} className="text-primary" />
            </div>
            <div>
              <h2 id="student-profile-modal-title" className="text-base font-bold text-primary">
                Student Member Profile
              </h2>
              <p className="text-xs text-secondary">
                Verified Library Member & Seat Allocation Details
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-secondary hover:text-primary hover:bg-floating rounded-xl transition-colors cursor-pointer"
            aria-label="Close profile modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {/* Hero Profile Card */}
          <div className="p-4 rounded-2xl bg-surface border border-border flex items-start gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-primary-subtle text-primary border border-primary/20 flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-primary truncate">{studentName}</h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-card font-semibold text-primary border border-border">
                  {smartId}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    isExpiring
                      ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                      : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isExpiring ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  {isExpiring ? 'Expiring Soon' : 'Active Member'}
                </span>

                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-card border border-border text-secondary">
                  {gender === 'Female' ? '👩 Female' : '👨 Male'}
                </span>

                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary-subtle text-primary border border-primary/20">
                  <CheckCircle2 size={11} /> KYC Verified
                </span>
              </div>
            </div>
          </div>

          {/* Quick Contact Action Bar */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-surface hover:bg-card border border-border text-xs font-semibold text-primary transition-colors cursor-pointer"
            >
              <Phone size={14} className="text-primary" />
              <span>Call ({phone.split(' ')[1] || 'Mobile'})</span>
            </a>
            <a
              href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/30 text-xs font-semibold text-emerald-500 transition-colors cursor-pointer"
            >
              <MessageCircle size={14} className="text-emerald-500" />
              <span>WhatsApp Chat</span>
            </a>
          </div>

          {/* Seat & Shift Allotment Specs */}
          <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
              <Armchair size={14} className="text-primary" /> Current Seat & Shift Allotment
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-[11px] text-secondary font-semibold block mb-0.5">Assigned Desk</span>
                <span className="text-sm font-bold text-primary font-mono">Seat S-{seatId}</span>
                <span className="text-[10px] text-secondary block mt-0.5 truncate">{wing}</span>
              </div>

              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-[11px] text-secondary font-semibold block mb-0.5">Shift Allotment</span>
                <span className="text-sm font-bold text-primary">{shift} Shift</span>
                <span className="text-[10px] text-secondary font-mono block mt-0.5 flex items-center gap-1">
                  <Clock size={11} className="text-primary shrink-0" /> {timing}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-[11px] text-secondary font-semibold block mb-0.5">Assigned Locker</span>
                <span className="font-semibold text-primary font-mono flex items-center gap-1">
                  <Lock size={12} className="text-secondary" /> Locker L-{seatId.padStart(3, '0')}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-[11px] text-secondary font-semibold block mb-0.5">Desk Power Socket</span>
                <span className="font-semibold text-emerald-500 flex items-center gap-1">
                  <Sparkles size={12} className="text-emerald-500" /> Available & Active
                </span>
              </div>
            </div>
          </div>

          {/* Membership & Subscription Details */}
          <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
              <Calendar size={14} className="text-primary" /> Subscription & Validity
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-[11px] text-secondary font-semibold block mb-0.5">Plan Type</span>
                <span className="font-semibold text-primary">Monthly Dedicated Reserve</span>
              </div>

              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-[11px] text-secondary font-semibold block mb-0.5">Expiry Date</span>
                <span className={`font-bold ${isExpiring ? 'text-amber-500' : 'text-primary'}`}>
                  {expiry}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-[11px] text-secondary font-semibold block mb-0.5">Admission Date</span>
                <span className="font-semibold text-primary">01 Aug 2026</span>
              </div>

              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-[11px] text-secondary font-semibold block mb-0.5">Fee Status</span>
                <span className="font-semibold text-emerald-500">Paid (₹3,300/mo)</span>
              </div>
            </div>
          </div>

          {/* Personal & Emergency Contact */}
          <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
              <User size={14} className="text-primary" /> Personal & Emergency Details
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border">
                <span className="text-secondary flex items-center gap-1.5">
                  <Mail size={13} className="text-secondary" /> Email:
                </span>
                <span className="font-semibold text-primary">{email}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border">
                <span className="text-secondary flex items-center gap-1.5">
                  <Phone size={13} className="text-secondary" /> Emergency Contact:
                </span>
                <span className="font-semibold text-primary">Guardian ({emergencyPhone})</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border">
                <span className="text-secondary flex items-center gap-1.5">
                  <MapPin size={13} className="text-secondary" /> Branch:
                </span>
                <span className="font-semibold text-primary">North Reading Hall, Block A</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-border shrink-0">
          <button
            type="button"
            onClick={() => {
              if (onNavigateToDirectory) {
                onNavigateToDirectory(smartId);
              } else {
                window.location.href = MANAGER_SEATS_MATRIX_ROUTES.STUDENTS_FILTER_BY_SMART_ID(smartId);
              }
            }}
            className="flex-1 mgr-btn-ghost h-9 text-xs font-semibold flex items-center justify-center gap-1.5 rounded-xl border border-border text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <ExternalLink size={13} />
            <span>Open in Members Directory</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="mgr-btn-primary px-5 h-9 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
