'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function AdminStaffAttendanceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error securely
  }, [error]);

  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-danger-text/20 bg-card p-6 text-center">
      <AlertCircle className="h-10 w-10 text-danger-text" />
      <h2 className="mt-3 text-lg font-bold text-text-primary">Unable to load Staff Attendance</h2>
      <p className="mt-1 text-sm text-text-secondary">
        An error occurred while loading staff shift attendance logs.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-hover"
      >
        Retry
      </button>
    </div>
  );
}

