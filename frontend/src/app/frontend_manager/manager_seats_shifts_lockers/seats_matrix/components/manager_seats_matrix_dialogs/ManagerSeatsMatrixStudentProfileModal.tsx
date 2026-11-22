'use client';

import {Armchair, Calendar, CheckCircle2, Clock, ExternalLink, GraduationCap, MessageCircle, Phone, ShieldCheck, X, ZoomIn} from 'lucide-react';
import { useEffect,useState } from 'react';
import { MANAGER_SEATS_MATRIX_ROUTES } from '../../config/manager_seats_matrix.url_config';
import { REGISTERED_STUDENT_CANDIDATES } from '../../constants/ManagerSeatsMatrixConstants';
import type { SeatData } from '../../types/ManagerSeatsMatrixTypes';

export interface ManagerSeatsMatrixStudentProfileModalProps {
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
  const [isZoomed, setIsZoomed] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isZoomed, onClose]);

  if (!isOpen || !seat || !seat.student) return null;

  const studentName = seat.student;
  const smartId = seat.smartId || `LIB-${seat.id.padStart(5, '0')}`;
  const seatId = seat.id;
  const shift = seat.shift || 'Morning';
  const expiry = seat.expiry || 'Active';
  const isExpiring = seat.status === 'expiring';
  const statusLabel = isExpiring ? 'Expiring Soon' : 'Active Member';

  // Candidate matching
  const candidate = REGISTERED_STUDENT_CANDIDATES.find(
    (c) =>
      c.name.toLowerCase() === studentName.toLowerCase() ||
      (seat.smartId && c.smartId.toLowerCase() === seat.smartId.toLowerCase())
  );

  const gender = candidate?.gender || seat.studentGender || 'Male';
  const targetExam = candidate?.exam || 'UPSC Civil Services / State PSC';

  // Derived shift timings
  const shiftTimingMap: Record<string, string> = {
    Morning: '06:00 AM – 12:00 PM (Morning)',
    Afternoon: '12:00 PM – 04:00 PM (Afternoon)',
    Evening: '04:00 PM – 08:00 PM (Evening)',
    Night: '08:00 PM – 06:00 AM (Night)',
    'Full Day': '24 Hours (Full Day All Shifts)',
  };
  const shiftDisplay = shiftTimingMap[shift] || `${shift} Shift`;

  // Contact details
  const seedNum = seatId.replace(/\D/g, '') || '12';
  const rawPhone = `98${seedNum.padStart(2, '7')}452190`;
  const maskedPhone = `+91 ${rawPhone.slice(0, 2)}••• ••${rawPhone.slice(-3)}`;

  const mockPhotoUrl =
    gender === 'Female'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80'
      : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&h=400&q=80';

  return (
    <>
      {/* Top-level Direct Popover Backdrop (z-70 guarantees it sits cleanly above all drawers/modals) */}
      <div
        className="fixed inset-0 z-70 flex items-center justify-center bg-overlay-backdrop p-3 sm:p-4 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-profile-card-title"
        onClick={onClose}
      >
        <div
          className="w-full max-w-lg sm:max-w-xl rounded-3xl border border-border bg-card shadow-2xl overflow-hidden my-auto transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Top Hero Banner (Redesigned ID Card Header) ── */}
          <div className="relative p-5 sm:p-6 bg-gradient-to-br from-indigo-500/10 via-primary-subtle/50 to-surface border-b border-border">
            {/* Top Row: Library Pill & Close Button */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card/80 border border-border text-[11px] font-semibold text-secondary shadow-xs">
                <ShieldCheck size={13} className="text-primary" />
                <span>Verified Library Pass</span>
                <span className="text-border">•</span>
                <span className="font-mono text-primary font-bold">{smartId}</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                    isExpiring
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {statusLabel}
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-full text-secondary hover:text-primary hover:bg-card/80 transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Hero Profile Row: Photo + Name + Target Exam */}
            <div className="flex items-center gap-4">
              {/* Photo with Click-to-Zoom */}
              <div
                className="relative group w-20 h-22 sm:w-22 sm:h-24 rounded-2xl border-2 border-primary/50 overflow-hidden shadow-md bg-surface shrink-0 cursor-pointer"
                onClick={() => setIsZoomed(true)}
                title="Click to zoom student photo"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mockPhotoUrl}
                  alt={studentName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-overlay-backdrop/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-semibold gap-1">
                  <ZoomIn size={13} /> Zoom
                </div>
              </div>

              {/* Student Identity Information */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 id="student-profile-card-title" className="text-lg sm:text-xl font-black text-primary tracking-tight truncate">
                    {studentName}
                  </h2>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0 border border-emerald-500/20">
                    <CheckCircle2 size={11} /> Verified
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-secondary mt-1">
                  <GraduationCap size={14} className="text-primary shrink-0" />
                  <span className="font-semibold text-primary truncate">{targetExam}</span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-secondary mt-1.5 font-mono">
                  <span>Gender: <strong className="text-primary font-sans">{gender}</strong></span>
                  <span>•</span>
                  <span>Contact: <strong className="text-primary">{maskedPhone}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* ── 4-Block Bento Grid: Desk & Subscription Details ── */}
          <div className="p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Card 1: Assigned Desk */}
              <div className="p-3.5 rounded-2xl bg-surface border border-border flex items-start gap-3 hover:border-primary/40 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                  <Armchair size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                    Assigned Desk
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-black font-mono text-primary bg-primary-subtle px-2 py-0.5 rounded-md">
                      S-{seatId}
                    </span>
                    <span className="text-[11px] font-semibold text-secondary truncate">
                      AC Silent Hall
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Shift Allotted */}
              <div className="p-3.5 rounded-2xl bg-surface border border-border flex items-start gap-3 hover:border-primary/40 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Clock size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                    Shift Timings
                  </span>
                  <p className="text-xs font-bold text-primary mt-0.5 truncate">
                    {shift} Slot
                  </p>
                  <p className="text-[11px] text-secondary font-mono mt-0.5 truncate">
                    {shiftDisplay}
                  </p>
                </div>
              </div>

              {/* Card 3: Membership Expiry */}
              <div className="p-3.5 rounded-2xl bg-surface border border-border flex items-start gap-3 hover:border-primary/40 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Calendar size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                    Plan Expiry
                  </span>
                  <p className={`text-xs font-bold mt-0.5 ${isExpiring ? 'text-amber-400' : 'text-primary'}`}>
                    {expiry}
                  </p>
                  <p className="text-[11px] text-secondary mt-0.5">
                    Monthly Reserved Plan
                  </p>
                </div>
              </div>

              {/* Card 4: Emergency / Desk Connectivity */}
              <div className="p-3.5 rounded-2xl bg-surface border border-border flex items-start gap-3 hover:border-primary/40 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                  <Phone size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                    Phone & SMS Alerts
                  </span>
                  <p className="text-xs font-bold text-primary font-mono mt-0.5">
                    {maskedPhone}
                  </p>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 size={11} /> Auto Reminders Enabled
                  </p>
                </div>
              </div>
            </div>

            {/* ── Footer Actions ── */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
              <a
                href={`https://wa.me/91${rawPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 hover:text-emerald-300 transition-all cursor-pointer"
              >
                <MessageCircle size={14} /> Send WhatsApp
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-border bg-surface hover:bg-surface-hover text-secondary hover:text-primary transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onNavigateToDirectory) {
                      onNavigateToDirectory(smartId);
                    } else {
                      window.location.href = MANAGER_SEATS_MATRIX_ROUTES.STUDENTS_FILTER_BY_SMART_ID(smartId);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  <ExternalLink size={13} /> View in Directory
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal (Zoom Photo at z-80) */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-80 flex items-center justify-center bg-overlay-backdrop p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-w-sm w-full p-3.5 bg-card rounded-2xl border border-border shadow-2xl text-center space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mockPhotoUrl} alt={studentName} className="w-full h-72 object-cover rounded-xl" />
            <div className="flex justify-between items-center px-1">
              <div>
                <span className="font-bold text-xs text-primary block text-left">
                  {studentName}
                </span>
                <span className="font-mono text-[11px] text-secondary block text-left">
                  {smartId}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="text-xs px-3 py-1 rounded-lg border border-border text-secondary hover:text-primary cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
