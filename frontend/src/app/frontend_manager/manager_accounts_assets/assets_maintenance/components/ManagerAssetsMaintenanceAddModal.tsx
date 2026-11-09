'use client';
import { useState, useMemo } from 'react';
import { Wrench, X } from 'lucide-react';
import { toast } from 'sonner';
import type { MaintenanceLogItem } from './ManagerAssetsMaintenanceTable';
import { SearchableCombobox, type ComboboxOption } from '@/components/ui/combobox/SearchableCombobox';
import { MANAGER_ACCOUNTING_SAMPLE_ASSETS } from '@/app/frontend_manager/manager_accounts_assets/assets_register/mocks/manager_assets_register_fixtures/ManagerAssetsRegisterAssetSampleFixtures';

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

  const assetOptions: ComboboxOption[] = useMemo(() => {
    return MANAGER_ACCOUNTING_SAMPLE_ASSETS.map((a) => ({
      value: a.name,
      label: a.name,
      subLabel: `${a.category} · Location: ${a.location}`,
      badge: a.status,
    }));
  }, []);

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
          <button type="button" onClick={onClose} className="text-secondary hover:text-primary p-1 rounded-lg hover:bg-surface-hover">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-secondary block mb-1">Select Registered Asset *</label>
            <SearchableCombobox
              options={assetOptions}
              value={assetName}
              onChange={(val) => setAssetName(val)}
              placeholder="Search library assets (e.g. AC Unit, CCTV, Water Purifier)..."
              searchPlaceholder="Type asset name or category..."
              aria-label="Select registered library asset for maintenance"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-secondary block mb-1">Issue Description *</label>
            <textarea
              required
              rows={2}
              placeholder="Describe breakdown or routine servicing requirement..."
              className="mgr-input w-full mt-1 text-xs"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-secondary block mb-1">Assigned Vendor / Tech (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Daikin Care Services"
                className="mgr-input w-full text-xs"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-secondary block mb-1">Estimated Cost (₹) (Optional)</label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 1500"
                className="mgr-input w-full text-xs"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-secondary block mb-1">Scheduled Date (Optional)</label>
            <input
              type="date"
              className="mgr-input w-full text-xs"
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
              disabled={!assetName.trim()}
              className="mgr-btn-primary text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Log Maintenance Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
