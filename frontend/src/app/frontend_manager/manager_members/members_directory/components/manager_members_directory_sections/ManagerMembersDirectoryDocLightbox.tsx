'use client';

import React from 'react';
import { X, FileText } from 'lucide-react';

export interface ManagerMembersDirectoryDocLightboxProps {
  isZoomed: boolean;
  setIsZoomed: (val: boolean) => void;
  selectedDocPreview: string | null;
  setSelectedDocPreview: (val: string | null) => void;
  mockPhotoUrl: string;
  memberName: string;
  memberId: string;
  memberJoinDate: string;
}

export function ManagerMembersDirectoryDocLightbox({
  isZoomed,
  setIsZoomed,
  selectedDocPreview,
  setSelectedDocPreview,
  mockPhotoUrl,
  memberName,
  memberId,
  memberJoinDate,
}: ManagerMembersDirectoryDocLightboxProps) {
  return (
    <>
      {isZoomed && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-overlay-backdrop p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-w-md w-full p-2 bg-card rounded-2xl border border-border shadow-2xl text-center space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mockPhotoUrl} alt={memberName} className="w-full h-80 object-cover rounded-xl" />
            <div className="flex justify-between items-center px-2">
              <span className="font-bold text-sm text-primary">
                {memberName} ({memberId})
              </span>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="text-xs px-2.5 py-1 rounded-lg border border-border text-secondary hover:text-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedDocPreview && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-overlay-backdrop p-4"
          onClick={() => setSelectedDocPreview(null)}
        >
          <div
            className="relative max-w-lg w-full p-6 bg-card rounded-2xl border border-border shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="font-bold text-sm text-primary">{selectedDocPreview}</span>
              <button
                type="button"
                onClick={() => setSelectedDocPreview(null)}
                className="text-secondary hover:text-primary"
              >
                <X size={18} />
              </button>
            </div>
            <div className="h-48 rounded-xl bg-surface-zebra border border-dashed border-border flex flex-col items-center justify-center text-center p-4">
              <FileText size={36} className="text-primary mb-2" />
              <p className="text-xs font-semibold text-primary">Verified Official Identity Proof Attached</p>
              <p className="text-[11px] text-secondary mt-1">Uploaded during admission on {memberJoinDate}</p>
            </div>
            <div className="text-right">
              <button
                type="button"
                onClick={() => setSelectedDocPreview(null)}
                className="mgr-btn-primary mgr-btn-sm text-xs"
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

