'use client';

import { ManagerSeatsMatrixStudentPhotoLightbox } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/components/manager_seats_matrix_dialogs/ManagerSeatsMatrixStudentPhotoLightbox';
import { ManagerSeatsMatrixStudentProfileBento } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/components/manager_seats_matrix_dialogs/ManagerSeatsMatrixStudentProfileBento';
import { MANAGER_SEATS_MATRIX_ROUTES } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/config/manager_seats_matrix.url_config';
import { REGISTERED_STUDENT_CANDIDATES } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/constants/ManagerSeatsMatrixConstants';
import type { SeatData } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixTypes';
import { CheckCircle2, ExternalLink, GraduationCap, MessageCircle, ShieldCheck, X, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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

  const candidate = REGISTERED_STUDENT_CANDIDATES.find(
    (c) =>
      c.name.toLowerCase() === studentName.toLowerCase() ||
      (seat.smartId && c.smartId.toLowerCase() === seat.smartId.toLowerCase())
  );

  const gender = candidate?.gender || seat.studentGender || 'Male';
  const targetExam = candidate?.exam || 'UPSC Civil Services / State PSC';

  const shiftTimingMap: Record<string, string> = {
    Morning: '06:00 AM – 12:00 PM (Morning)',
    Afternoon: '12:00 PM – 04:00 PM (Afternoon)',
    Evening: '04:00 PM – 08:00 PM (Evening)',
    Night: '08:00 PM – 06:00 AM (Night)',
    'Full Day': '24 Hours (Full Day All Shifts)',
  };
  const shiftDisplay = shiftTimingMap[shift] || `${shift} Shift`;

  const seedNum = seatId.replace(/\D/g, '') || '12';
  const rawPhone = `98${seedNum.padStart(2, '7')}452190`;
  const maskedPhone = `+91 ${rawPhone.slice(0, 2)}••• ••${rawPhone.slice(-3)}`;

  const mockPhotoUrl =
    gender === 'Female'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80'
      : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&h=400&q=80';

  return (
    <>
      <div
        className="fixed inset-0 z-70 flex items-center justify-center bg-overlay-backdrop p-3 sm:p-4 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-profile-card-title"
        onClick={onClose}
      >
        <div
          className="w-full max-w-lg sm:max-w-xl rounded-3xl border border-border bg-card shadow-2xl overflow-hidden my-auto motion-safe:transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative p-5 sm:p-6 bg-gradient-to-br from-indigo-500/10 via-primary-subtle to-surface border-b border-border">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border text-[11px] font-semibold text-secondary shadow-xs">
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
                  className="p-1.5 rounded-full text-secondary hover:text-primary hover:bg-card motion-safe:transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="relative group w-20 h-22 sm:w-22 sm:h-24 rounded-2xl border-2 border-primary overflow-hidden shadow-md bg-surface shrink-0 cursor-pointer"
                onClick={() => setIsZoomed(true)}
                title="Click to zoom student photo"
              >
                <Image
                  src={mockPhotoUrl}
                  alt={studentName}
                  fill
                  unoptimized
                  sizes="96px"
                  className="object-cover group-hover:scale-105 motion-safe:transition-transform motion-safe:duration-200"
                />
                <div className="absolute inset-0 bg-overlay-backdrop opacity-0 group-hover:opacity-100 flex items-center justify-center motion-safe:transition-opacity text-white text-[10px] font-semibold gap-1">
                  <ZoomIn size={13} /> Zoom
                </div>
              </div>

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

          <div className="p-5 sm:p-6 space-y-4">
            <ManagerSeatsMatrixStudentProfileBento
              seatId={seatId}
              shift={shift}
              shiftDisplay={shiftDisplay}
              expiry={expiry}
              isExpiring={isExpiring}
              maskedPhone={maskedPhone}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
              <a
                href={`https://wa.me/91${rawPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 hover:text-emerald-300 motion-safe:transition-all cursor-pointer"
              >
                <MessageCircle size={14} /> Send WhatsApp
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-border bg-surface hover:bg-surface-hover text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer"
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-sm motion-safe:transition-all cursor-pointer"
                >
                  <ExternalLink size={13} /> View in Directory
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isZoomed && (
        <ManagerSeatsMatrixStudentPhotoLightbox
          photoUrl={mockPhotoUrl}
          studentName={studentName}
          smartId={smartId}
          onClose={() => setIsZoomed(false)}
        />
      )}
    </>
  );
}
