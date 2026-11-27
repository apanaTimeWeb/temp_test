'use client';

import Image from 'next/image';

interface ManagerSeatsMatrixStudentPhotoLightboxProps {
  photoUrl: string;
  studentName: string;
  smartId: string;
  onClose: () => void;
}

/** Zoomed student photo lightbox modal overlay for seat profile inspection. */
export function ManagerSeatsMatrixStudentPhotoLightbox({
  photoUrl,
  studentName,
  smartId,
  onClose,
}: ManagerSeatsMatrixStudentPhotoLightboxProps) {
  return (
    <div
      className="fixed inset-0 z-80 flex items-center justify-center bg-overlay-backdrop p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-sm w-full p-3.5 bg-card rounded-2xl border border-border shadow-2xl text-center space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-72 rounded-xl overflow-hidden bg-surface">
          <Image src={photoUrl} alt={studentName} fill unoptimized sizes="384px" className="object-cover" />
        </div>
        <div className="flex justify-between items-center px-1">
          <div>
            <span className="font-bold text-xs text-primary block text-left">{studentName}</span>
            <span className="font-mono text-[11px] text-secondary block text-left">{smartId}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs px-3 py-1 rounded-lg border border-border text-secondary hover:text-primary cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
