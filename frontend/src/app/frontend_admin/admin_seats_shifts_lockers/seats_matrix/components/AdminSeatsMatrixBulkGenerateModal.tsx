'use client';
// RESPONSIBILITY: Bulk Generate / Add Seats modal for Admin Seats Matrix.

import { useState } from 'react';
import { Armchair, Building2, Check, Layers, Plus, Sparkles, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { AdminSeatMatrixSeatMatrixViewModel } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/types/AdminSeatsMatrixTypes';

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
  const [defaultStatus, setDefaultStatus] = useState<'free' | 'maintenance'>('free');
  const [hallCategory, setHallCategory] = useState('Standard Dedicated');

  if (!isOpen) return null;

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
      toast.error('End number must be greater than or equal to start number.');
      return;
    }
    if (totalSeatsToGenerate > 200) {
      toast.error('Maximum 200 seats can be generated in a single batch.');
      return;
    }

    const branchObj = BRANCH_OPTIONS.find((b) => b.name === selectedBranch) || {
      id: 'BR-01',
      name: selectedBranch,
    };

    const generatedSeats: AdminSeatMatrixSeatMatrixViewModel[] = [];
    const duplicates: string[] = [];

    for (let i = startNum; i <= endNum; i++) {
      const paddedNum = i < 10 ? `0${i}` : String(i);
      const seatId = prefix ? `${prefix}${paddedNum}` : String(i);

      if (existingSeatIds.includes(seatId)) {
        duplicates.push(seatId);
      }

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
      toast.error(`All ${duplicates.length} seats already exist in the matrix. Choose a different range or prefix.`);
      return;
    }

    onGenerate(generatedSeats);
    toast.success(`Successfully generated ${generatedSeats.length} seats for ${branchObj.name}!`);
    onClose();
  };

  // Sample Preview IDs
  const previewList = Array.from({ length: Math.min(6, totalSeatsToGenerate) }, (_, idx) => {
    const num = startNum + idx;
    const padded = num < 10 ? `0${num}` : String(num);
    return prefix ? `${prefix}${padded}` : String(num);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/70 overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-6 py-4.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
              <Layers size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Bulk Generate Study Desks & Cabins</h2>
              <p className="text-xs text-slate-400">Instantly generate consecutive desks 1 to 50 for a new hall or branch expansion</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleGenerate} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Presets Strip */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Presets</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset('', 1, 50, 'Standard Dedicated')}
                className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:border-indigo-500 transition-colors"
              >
                Seats 1 – 50
              </button>
              <button
                type="button"
                onClick={() => applyPreset('', 51, 100, 'Standard Dedicated')}
                className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:border-indigo-500 transition-colors"
              >
                Seats 51 – 100
              </button>
              <button
                type="button"
                onClick={() => applyPreset('CAB-', 1, 20, 'Premium Reserved Cabin')}
                className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:border-purple-500 transition-colors"
              >
                20 Cabins (CAB-01..20)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('A-', 1, 30, 'AC Silent Hall A')}
                className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:border-emerald-500 transition-colors"
              >
                Hall A (A-01..30)
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Branch Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Building2 size={13} className="text-indigo-400" />
                <span>Target Branch</span>
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {BRANCH_OPTIONS.map((b) => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Hall / Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Armchair size={13} className="text-purple-400" />
                <span>Desk Category / Zone</span>
              </label>
              <select
                value={hallCategory}
                onChange={(e) => setHallCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="Standard Dedicated">Standard Dedicated Desk</option>
                <option value="Premium Reserved Cabin">Premium Private Cabin</option>
                <option value="AC Silent Hall A">AC Silent Study Zone</option>
                <option value="Night Owl Special Desk">Night Owl Special Desk</option>
              </select>
            </div>

            {/* Prefix */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Seat Prefix (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. S-, A-, CAB-"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono"
              />
              <span className="text-[10px] text-slate-400">Leave blank for numeric seats (1, 2, 3...)</span>
            </div>

            {/* Initial Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Initial Status
              </label>
              <select
                value={defaultStatus}
                onChange={(e) => setDefaultStatus(e.target.value as any)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="free">Available Free (Ready for Allotment)</option>
                <option value="maintenance">Under Maintenance / Inspection</option>
              </select>
            </div>

            {/* Range Start */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                From Seat Number
              </label>
              <input
                type="number"
                min={1}
                max={9999}
                value={startNum}
                onChange={(e) => setStartNum(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono"
              />
            </div>

            {/* Range End */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                To Seat Number
              </label>
              <input
                type="number"
                min={startNum}
                max={9999}
                value={endNum}
                onChange={(e) => setEndNum(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono"
              />
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
                <Sparkles size={13} className="text-indigo-400" />
                <span>Batch Generation Summary</span>
              </span>
              <span className="font-bold text-white bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                {totalSeatsToGenerate} Desks
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Sample IDs preview:
              <div className="flex flex-wrap gap-1.5 mt-2">
                {previewList.map((id) => (
                  <span key={id} className="rounded-md border border-slate-800 bg-slate-900 px-2 py-0.5 text-xs font-mono font-bold text-white">
                    S-{id}
                  </span>
                ))}
                {totalSeatsToGenerate > 6 && (
                  <span className="text-xs text-slate-500 self-center">
                    ... up to S-{prefix ? `${prefix}${endNum}` : endNum}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex items-center justify-end gap-2.5 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={totalSeatsToGenerate <= 0}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-600 hover:to-indigo-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus size={15} />
              <span>Generate {totalSeatsToGenerate} Seats</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
