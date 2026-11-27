'use client';
// RESPONSIBILITY: Bulk Generate / Add Seats modal for Admin Seats Matrix.

import type { AdminSeatMatrixSeatMatrixViewModel } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/types/AdminSeatsMatrixTypes';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { Armchair, Building2, Layers, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export interface AdminSeatsMatrixBulkGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (newSeats: AdminSeatMatrixSeatMatrixViewModel[]) => void;
  defaultBranchName?: string;
  existingSeatIds: string[];
}

const BRANCH_OPTIONS = [
  { id: 'BR-01', name: 'Downtown Central' },
  { id: 'BR-02', name: 'Westside Branch' },
  { id: 'BR-03', name: 'North Hub' },
];

type DefaultSeatStatus = 'free' | 'maintenance';

export default function AdminSeatsMatrixBulkGenerateModal({
  isOpen,
  onClose,
  onGenerate,
  defaultBranchName = 'Downtown Central',
  existingSeatIds,
}: AdminSeatsMatrixBulkGenerateModalProps) {
  const [selectedBranch, setSelectedBranch] = useState(defaultBranchName);
  const [prefix, setPrefix] = useState('');
  const [startNum, setStartNum] = useState(1);
  const [endNum, setEndNum] = useState(50);
  const [defaultStatus, setDefaultStatus] = useState<DefaultSeatStatus>('free');
  const [hallCategory, setHallCategory] = useState('Standard Dedicated');

  const totalSeatsToGenerate = Math.max(0, endNum - startNum + 1);

  const applyPreset = (presetPrefix: string, start: number, end: number, cat: string) => {
    setPrefix(presetPrefix);
    setStartNum(start);
    setEndNum(end);
    setHallCategory(cat);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (endNum < startNum) {
      toast.error('End number must be greater than or equal to start number.', { id: 'admin-seats-bulk-invalid-range' });
      return;
    }
    if (totalSeatsToGenerate > 200) {
      toast.error('Maximum 200 seats can be generated in a single batch.', { id: 'admin-seats-bulk-limit' });
      return;
    }

    const branchObj = BRANCH_OPTIONS.find((b) => b.name === selectedBranch) || { id: 'BR-01', name: selectedBranch };
    const generatedSeats: AdminSeatMatrixSeatMatrixViewModel[] = [];
    const duplicates: string[] = [];

    for (let i = startNum; i <= endNum; i++) {
      const paddedNum = i < 10 ? `0${i}` : String(i);
      const seatId = prefix ? `${prefix}${paddedNum}` : String(i);
      if (existingSeatIds.includes(seatId)) duplicates.push(seatId);
      generatedSeats.push({
        id: seatId,
        uuid: `seat-${Date.now()}-${seatId}`,
        status: defaultStatus,
        branchId: branchObj.id,
        branchName: branchObj.name,
        plan: hallCategory,
      });
    }

    if (duplicates.length > 0 && duplicates.length === generatedSeats.length) {
      toast.error(`All ${duplicates.length} seats already exist in the matrix. Choose a different range or prefix.`, { id: 'admin-seats-bulk-duplicates' });
      return;
    }

    onGenerate(generatedSeats);
    toast.success(`Successfully generated ${generatedSeats.length} seats for ${branchObj.name}!`, { id: 'admin-seats-bulk-success' });
    onClose();
  };

  const previewList = Array.from({ length: Math.min(6, totalSeatsToGenerate) }, (_, idx) => {
    const num = startNum + idx;
    const padded = num < 10 ? `0${num}` : String(num);
    return prefix ? `${prefix}${padded}` : String(num);
  });

  return (
    <Dialog open={isOpen} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-border bg-overlay shadow-dialog overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-focus bg-primary-subtle text-primary">
              <Layers size={20} aria-hidden="true" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
                Bulk Generate Study Desks &amp; Cabins
              </DialogTitle>
              <p className="text-xs text-text-secondary">
                Instantly generate consecutive desks 1 to 50 for a new hall or branch expansion
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            title="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleGenerate} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Quick Presets</span>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => applyPreset('', 1, 50, 'Standard Dedicated')} className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-text-secondary hover:text-text-primary hover:border-border-focus motion-safe:transition-colors">
                Seats 1 – 50
              </button>
              <button type="button" onClick={() => applyPreset('', 51, 100, 'Standard Dedicated')} className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-text-secondary hover:text-text-primary hover:border-border-focus motion-safe:transition-colors">
                Seats 51 – 100
              </button>
              <button type="button" onClick={() => applyPreset('CAB-', 1, 20, 'Premium Reserved Cabin')} className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-text-secondary hover:text-text-primary hover:border-border-focus motion-safe:transition-colors">
                20 Cabins (CAB-01..20)
              </button>
              <button type="button" onClick={() => applyPreset('A-', 1, 30, 'AC Silent Hall A')} className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-text-secondary hover:text-text-primary hover:border-success motion-safe:transition-colors">
                Hall A (A-01..30)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="bulk-seat-branch" className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                <Building2 size={13} className="text-primary" aria-hidden="true" />
                <span>Target Branch</span>
              </label>
              <select
                id="bulk-seat-branch"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full rounded-xl border border-border bg-input px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {BRANCH_OPTIONS.map((b) => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="bulk-seat-category" className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                <Armchair size={13} className="text-purple-text" aria-hidden="true" />
                <span>Desk Category / Zone</span>
              </label>
              <select
                id="bulk-seat-category"
                value={hallCategory}
                onChange={(e) => setHallCategory(e.target.value)}
                className="w-full rounded-xl border border-border bg-input px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Standard Dedicated">Standard Dedicated Desk</option>
                <option value="Premium Reserved Cabin">Premium Private Cabin</option>
                <option value="AC Silent Hall A">AC Silent Study Zone</option>
                <option value="Night Owl Special Desk">Night Owl Special Desk</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="bulk-seat-prefix" className="text-xs font-semibold text-text-secondary">Seat Prefix (Optional)</label>
              <input
                id="bulk-seat-prefix"
                maxLength={100}
                type="text"
                placeholder="e.g. S-, A-, CAB-"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="w-full rounded-xl border border-border bg-input px-3 py-2 text-xs text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary font-mono"
              />
              <span className="text-[10px] text-text-secondary">Leave blank for numeric seats (1, 2, 3...)</span>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="bulk-seat-status" className="text-xs font-semibold text-text-secondary">Initial Status</label>
              <select
                id="bulk-seat-status"
                value={defaultStatus}
                onChange={(e) => setDefaultStatus(e.target.value === 'maintenance' ? 'maintenance' : 'free')}
                className="w-full rounded-xl border border-border bg-input px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="free">Available Free (Ready for Allotment)</option>
                <option value="maintenance">Under Maintenance / Inspection</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="bulk-seat-start" className="text-xs font-semibold text-text-secondary">From Seat Number</label>
              <input id="bulk-seat-start" type="number" min={1} max={9999} value={startNum} onChange={(e) => setStartNum(Number(e.target.value))} className="w-full rounded-xl border border-border bg-input px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary font-mono" />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="bulk-seat-end" className="text-xs font-semibold text-text-secondary">To Seat Number</label>
              <input id="bulk-seat-end" type="number" min={startNum} max={9999} value={endNum} onChange={(e) => setEndNum(Number(e.target.value))} className="w-full rounded-xl border border-border bg-input px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary font-mono" />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface-highlight p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-primary flex items-center gap-1.5">
                <Layers size={13} aria-hidden="true" />
                <span>Batch Generation Summary</span>
              </span>
              <span className="font-bold text-primary bg-primary-subtle border border-border-focus px-2.5 py-0.5 rounded-full">
                {totalSeatsToGenerate} Desks
              </span>
            </div>
            <div className="text-xs text-text-secondary">
              Sample IDs preview:
              <div className="flex flex-wrap gap-1.5 mt-2">
                {previewList.map((id) => (
                  <span key={id} className="rounded-md border border-border bg-card px-2 py-0.5 text-xs font-mono font-bold text-text-primary">
                    S-{id}
                  </span>
                ))}
                {totalSeatsToGenerate > 6 && (
                  <span className="text-xs text-text-secondary self-center">
                    ... up to S-{prefix ? `${prefix}${endNum}` : endNum}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-surface-highlight px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={totalSeatsToGenerate <= 0}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-on-primary shadow-card hover:bg-primary-hover motion-safe:transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus size={15} aria-hidden="true" />
              <span>Generate {totalSeatsToGenerate} Seats</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
