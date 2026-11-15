'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Armchair,
  Clock,
  Phone,
  MessageCircle,
  FileText,
  ExternalLink,
  ZoomIn,
  GraduationCap,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import type { SeatData } from '../../types/ManagerSeatsMatrixTypes';
import { MANAGER_SEATS_MATRIX_ROUTES } from '../../config/manager_seats_matrix.url_config';
import { REGISTERED_STUDENT_CANDIDATES } from '../../constants/ManagerSeatsMatrixConstants';

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
  const [selectedDocPreview, setSelectedDocPreview] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isZoomed) {
          setIsZoomed(false);
        } else if (selectedDocPreview) {
          setSelectedDocPreview(null);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isZoomed, selectedDocPreview, onClose]);

  if (!isOpen || !seat || !seat.student) return null;

  const studentName = seat.student;
  const smartId = seat.smartId || `LIB-${seat.id.padStart(5, '0')}`;
  const seatId = seat.id;
  const shift = seat.shift || 'Morning';
  const expiry = seat.expiry || 'Active';
  const isExpiring = seat.status === 'expiring';
  const statusLabel = isExpiring ? 'Expiring' : 'Active';

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
    Morning: 'Morning (06:00 AM – 12:00 PM)',
    Afternoon: 'Afternoon (12:00 PM – 04:00 PM)',
    Evening: 'Evening (04:00 PM – 08:00 PM)',
    Night: 'Night (08:00 PM – 06:00 AM)',
    'Full Day': 'Full Day (24 Hours All Shifts)',
  };
  const shiftDisplay = shiftTimingMap[shift] || `${shift} Shift`;

  // Contact details
  const seedNum = seatId.replace(/\D/g, '') || '12';
  const rawPhone = `98${seedNum.padStart(2, '7')}452190`;
  const maskedPhone = `+91 ${rawPhone.slice(0, 2)}••• ••${rawPhone.slice(-3)}`;
  const joinDate = '01 Aug 2026';

  const mockPhotoUrl =
    gender === 'Female'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80'
      : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&h=400&q=80';

  return (
    <>
      {/* Top-level Direct Popover Backdrop (z-70 guarantees it floats cleanly above all drawers/modals) */}
      <div
        className="fixed inset-0 z-70 flex items-center justify-center bg-overlay-backdrop p-3 sm:p-4 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="kyc-modal-title"
        onClick={onClose}
      >
        <div
          className="w-full max-w-xl sm:max-w-2xl rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-2xl space-y-3.5 my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-2.5 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary-subtle text-primary flex items-center justify-center shrink-0">
                <ShieldCheck size={19} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 id="kyc-modal-title" className="text-sm sm:text-base font-bold text-primary">
                    {studentName}
                  </h2>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface font-semibold text-primary border border-border">
                    {smartId}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isExpiring
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-success-bg text-success'
                    }`}
                  >
                    {statusLabel}
                  </span>
                </div>
                <p className="text-[11px] text-secondary">Verified Student Identity & KYC Card</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-secondary hover:text-primary transition-colors p-1 rounded-lg hover:bg-surface-hover cursor-pointer"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
          </div>

          {/* Compact Main Content Grid (100% visible at once without scrolling) */}
          <div className="space-y-3 text-xs">
            {/* Top Row: Photo & Essential Desk Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 p-3 sm:p-3.5 rounded-xl bg-surface border border-border">
              {/* Student Photo Column */}
              <div className="sm:col-span-4 flex flex-col items-center justify-center text-center space-y-1.5">
                <div
                  className="relative group w-24 sm:w-28 h-28 sm:h-32 rounded-xl border-2 border-primary overflow-hidden shadow-sm bg-surface-zebra flex items-center justify-center cursor-pointer shrink-0"
                  onClick={() => setIsZoomed(true)}
                  title="Click to Zoom Photo"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mockPhotoUrl}
                    alt={studentName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-overlay-backdrop opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white gap-1 font-semibold text-[10px]">
                    <ZoomIn size={13} /> Zoom
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success bg-success-bg px-2 py-0.5 rounded-full">
                  <CheckCircle2 size={11} /> Photo Verified
                </span>
              </div>

              {/* Quick Desk Parameters */}
              <div className="sm:col-span-8 space-y-1.5">
                <div className="flex items-center justify-between py-0.5 border-b border-border">
                  <span className="text-secondary flex items-center gap-1.5">
                    <Armchair size={13} /> Assigned Seat:
                  </span>
                  <span className="font-bold text-primary font-mono text-xs bg-primary-subtle px-2 py-0.5 rounded">
                    S-{seatId}
                  </span>
                </div>

                <div className="flex items-center justify-between py-0.5 border-b border-border">
                  <span className="text-secondary flex items-center gap-1.5">
                    <Clock size={13} /> Shift Timing:
                  </span>
                  <span className="font-semibold text-primary truncate max-w-[210px] text-right">
                    {shiftDisplay}
                  </span>
                </div>

                <div className="flex items-center justify-between py-0.5 border-b border-border">
                  <span className="text-secondary flex items-center gap-1.5">
                    <GraduationCap size={13} /> Target Exam:
                  </span>
                  <span className="font-semibold text-primary truncate max-w-[210px] text-right">
                    {targetExam}
                  </span>
                </div>

                <div className="flex items-center justify-between py-0.5 border-b border-border">
                  <span className="text-secondary flex items-center gap-1.5">
                    <Phone size={13} /> Student Contact:
                  </span>
                  <span className="font-mono text-primary font-semibold">
                    {maskedPhone}
                  </span>
                </div>

                <div className="flex items-center justify-between py-0.5">
                  <span className="text-secondary flex items-center gap-1.5">
                    <Calendar size={13} /> Plan Expiry:
                  </span>
                  <span className={`font-semibold ${isExpiring ? 'text-amber-400 font-bold' : 'text-primary'}`}>
                    {expiry} (Monthly Reserve Plan)
                  </span>
                </div>
              </div>
            </div>

            {/* Verified KYC Documents Section */}
            <div className="space-y-1.5">
              <h3 className="font-bold text-primary flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-secondary">
                <FileText size={13} className="text-primary" /> Verified KYC Documents (2 Attached)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-xl border border-border bg-card flex items-center justify-between hover:border-primary transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-surface flex items-center justify-center text-primary shrink-0">
                      <FileText size={15} />
                    </div>
                    <div>
                      <p className="font-semibold text-primary text-xs leading-tight">Aadhaar Card (Front/Back)</p>
                      <p className="text-[10px] text-secondary font-mono">•••• •••• {seedNum.padStart(4, '48')} · PDF</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedDocPreview(`Aadhaar Card (Verified Document #${seedNum.padStart(4, '48')})`)}
                    className="px-2 py-1 text-[11px] font-semibold rounded-lg border border-border hover:bg-surface text-secondary hover:text-primary transition-colors cursor-pointer"
                  >
                    Preview
                  </button>
                </div>

                <div className="p-2.5 rounded-xl border border-border bg-card flex items-center justify-between hover:border-primary transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-surface flex items-center justify-center text-primary shrink-0">
                      <FileText size={15} />
                    </div>
                    <div>
                      <p className="font-semibold text-primary text-xs leading-tight">Student / College ID</p>
                      <p className="text-[10px] text-secondary">Verified Student Pass · PDF</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedDocPreview('Student / College ID Card (Verified Document)')}
                    className="px-2 py-1 text-[11px] font-semibold rounded-lg border border-border hover:bg-surface text-secondary hover:text-primary transition-colors cursor-pointer"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-border pt-3 shrink-0">
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/91${rawPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/35 hover:text-emerald-200 transition-all cursor-pointer"
              >
                <MessageCircle size={13} /> Send WhatsApp
              </a>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 hover:text-white hover:bg-indigo-600/30 transition-all cursor-pointer"
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
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <ExternalLink size={12} /> View in Directory
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modals (Zoom & Document Preview at z-80) */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-80 flex items-center justify-center bg-overlay-backdrop p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-w-sm w-full p-3 bg-card rounded-2xl border border-border shadow-2xl text-center space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mockPhotoUrl} alt={studentName} className="w-full h-72 object-cover rounded-xl" />
            <div className="flex justify-between items-center px-1">
              <span className="font-bold text-xs text-primary">
                {studentName} ({smartId})
              </span>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="text-xs px-2.5 py-1 rounded-lg border border-border text-secondary hover:text-primary cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedDocPreview && (
        <div
          className="fixed inset-0 z-80 flex items-center justify-center bg-overlay-backdrop p-4"
          onClick={() => setSelectedDocPreview(null)}
        >
          <div
            className="relative max-w-md w-full p-5 bg-card rounded-2xl border border-border shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="font-bold text-xs text-primary">{selectedDocPreview}</span>
              <button
                type="button"
                onClick={() => setSelectedDocPreview(null)}
                className="text-secondary hover:text-primary cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="h-40 rounded-xl bg-surface-zebra border border-dashed border-border flex flex-col items-center justify-center text-center p-3">
              <FileText size={32} className="text-primary mb-1.5" />
              <p className="text-xs font-semibold text-primary">Verified Official Identity Proof Attached</p>
              <p className="text-[10px] text-secondary mt-0.5">Uploaded during admission on {joinDate}</p>
            </div>
            <div className="text-right">
              <button
                type="button"
                onClick={() => setSelectedDocPreview(null)}
                className="mgr-btn-primary mgr-btn-sm text-xs px-3 py-1 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
