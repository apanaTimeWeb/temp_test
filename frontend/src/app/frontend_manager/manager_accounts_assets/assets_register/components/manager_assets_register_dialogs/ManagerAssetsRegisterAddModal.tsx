'use client';
import { useState } from 'react';
import { ShieldCheck, X, IndianRupee, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { ManagerAssetsRegisterAsset } from '@/app/frontend_manager/manager_accounts_assets/assets_register/hooks/ManagerAssetsRegisterDemoRepository';

interface ManagerAssetsRegisterAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAsset: (newAsset: ManagerAssetsRegisterAsset) => void;
}

export function ManagerAssetsRegisterAddModal({
  isOpen,
  onClose,
  onAddAsset,
}: ManagerAssetsRegisterAddModalProps) {
  const [assetName, setAssetName] = useState('');
  const [assetCategory, setAssetCategory] = useState<string>('Appliance');
  const [assetValue, setAssetValue] = useState('');
  const [assetLocation, setAssetLocation] = useState('North Reading Hall (AC)');
  const [assetDate, setAssetDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [assetStatus, setAssetStatus] = useState<ManagerAssetsRegisterAsset['status']>('active');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName.trim()) {
      toast.error('Asset name is required.');
      return;
    }
    const val = Number(assetValue);
    if (!val || val <= 0) {
      toast.error('Valid purchase value is required.');
      return;
    }

    const newAsset: ManagerAssetsRegisterAsset = {
      id: Date.now(),
      name: assetName.trim(),
      category: assetCategory,
      purchaseDate: assetDate,
      purchaseValue: Math.round(val * 100),
      currentValue: Math.round(val * 100),
      location: assetLocation.trim() || 'Floor 1',
      status: assetStatus,
    };

    onAddAsset(newAsset);
    setAssetName('');
    setAssetValue('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-primary" />
            <h2 className="text-base font-bold text-primary">Add Library Physical Asset</h2>
          </div>
          <button type="button" onClick={onClose} className="text-secondary hover:text-primary">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-primary block mb-1">Asset Name / Model *</label>
            <input
              type="text"
              required
              className="mgr-input text-xs"
              placeholder="e.g. Daikin Inverter Split AC 1.5 Ton"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">Category *</label>
              <select
                className="mgr-select text-xs"
                value={assetCategory}
                onChange={(e) => setAssetCategory(e.target.value as ManagerAssetsRegisterAsset['category'])}
              >
                <option value="Appliance">Appliance (AC, RO, Water Cooler)</option>
                <option value="Electronics">Electronics (Inverter, Wi-Fi)</option>
                <option value="Furniture">Furniture (Chairs, Desks)</option>
                <option value="Security">Security (CCTV, Biometric)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">Purchase Cost (INR) *</label>
              <div className="relative">
                <IndianRupee size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                  type="number"
                  required
                  min="1"
                  className="mgr-input pl-8 text-xs font-mono font-bold"
                  placeholder="0.00"
                  value={assetValue}
                  onChange={(e) => setAssetValue(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">Installation Location</label>
              <input
                type="text"
                className="mgr-input text-xs"
                placeholder="e.g. North Hall / 2nd Floor"
                value={assetLocation}
                onChange={(e) => setAssetLocation(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">Purchase Date</label>
              <input
                type="date"
                className="mgr-input text-xs"
                value={assetDate}
                onChange={(e) => setAssetDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-primary block mb-1">Initial Condition Status</label>
            <select
              className="mgr-select text-xs"
              value={assetStatus}
              onChange={(e) => setAssetStatus(e.target.value as ManagerAssetsRegisterAsset['status'])}
            >
              <option value="active">Active & Operational</option>
              <option value="maintenance">Under Maintenance / AMC</option>
            </select>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
            <button type="button" onClick={onClose} className="mgr-btn-ghost text-xs">
              Cancel
            </button>
            <button type="submit" className="mgr-btn-primary text-xs flex items-center gap-1.5">
              <CheckCircle size={14} /> Register Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

