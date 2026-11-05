'use client';
import { useState } from 'react';
import { Wrench, X } from 'lucide-react';
import { toast } from 'sonner';
import type { MaintenanceLogItem } from './ManagerAssetsMaintenanceTable';

interface ManagerAssetsMaintenanceAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOrder: (newLog: MaintenanceLogItem) => void;
}

export function ManagerAssetsMaintenanceAddModal({
  isOpen,
  onClose,
  onAddOrder,
}: ManagerAssetsMaintenanceAddModalProps) {
  const [assetName, setAssetName] = useState('');
  const [issue, setIssue] = useState('');
  const [vendor, setVendor] = useState('');
  const [cost, setCost] = useState('');
  const [scheduledDate, setScheduledDate] = useState(() => new Date().toISOString().slice(0, 10));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName.trim() || !issue.trim()) {
      toast.error('Asset name and issue description are required.');
      return;
    }
    const newLog: MaintenanceLogItem = {
      id: Date.now(),
      assetName: assetName.trim(),
      issue: issue.trim(),
      reportedDate: new Date().toISOString().slice(0, 10),
      scheduledDate,
      vendor: vendor.trim() || 'Internal Technician',
      cost: Number(cost) || 0,
      status: 'pending',
    };
    onAddOrder(newLog);
    setAssetName('');
    setIssue('');
    setVendor('');
    setCost('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-warning-bg text-warning border border-border flex items-center justify-center">
              <Wrench size={18} />
            </div>
            <h2 className="text-base font-bold text-primary">Log Maintenance Request</h2>
          </div>
          <button type="button" onClick={onClose} className="text-secondary hover:text-primary">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-secondary">Asset Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Inverter Battery Bank 2, AC Unit 4"
              className="mgr-input w-full mt-1"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-secondary">Issue Description *</label>
            <textarea
              required
              rows={2}
              placeholder="Describe breakdown or routine servicing requirement..."
              className="mgr-input w-full mt-1"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-secondary">Assigned Vendor / Tech</label>
              <input
                type="text"
                placeholder="e.g. Daikin Care Services"
                className="mgr-input w-full mt-1"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-secondary">Estimated Cost (₹)</label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 1500"
                className="mgr-input w-full mt-1"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-secondary">Scheduled Date</label>
            <input
              type="date"
              className="mgr-input w-full mt-1"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="mgr-btn-ghost text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="mgr-btn-primary text-xs"
            >
              Log Maintenance Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

