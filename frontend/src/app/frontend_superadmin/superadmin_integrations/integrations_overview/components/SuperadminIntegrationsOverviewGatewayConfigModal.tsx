// components/SuperadminIntegrationsOverviewGatewayConfigModal.tsx
// RESPONSIBILITY: Modal for editing provider credentials, environment, and testing live ping.
// DATA FLOW: Selected gateway -> SuperadminIntegrationsOverviewGatewayConfigModal -> onSave.
'use client';

import { Activity, AlertCircle, Key, Loader2, Save, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import type {
  GatewayUpdatePayload,
  IntegrationEnvironment,
  IntegrationGatewayItem,
} from '../types/superadmin_integrations_overview.types';

interface SuperadminIntegrationsOverviewGatewayConfigModalProps {
  gateway: IntegrationGatewayItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, payload: GatewayUpdatePayload) => void;
  onTestPing: (id: string) => void;
  isSaving?: boolean;
  isPinging?: boolean;
}

export const SuperadminIntegrationsOverviewGatewayConfigModal: React.FC<
  SuperadminIntegrationsOverviewGatewayConfigModalProps
> = ({ gateway, isOpen, onClose, onSave, onTestPing, isSaving = false, isPinging = false }) => {
  const [environment, setEnvironment] = useState<IntegrationEnvironment>('Production');
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [isEnabled, setIsEnabled] = useState(true);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (gateway) {
      setEnvironment(gateway.environment);
      setCredentials({ ...gateway.credentialsMasked });
      setIsEnabled(gateway.isEnabled);
      setNotes(gateway.notes ?? '');
    }
  }, [gateway]);

  if (!isOpen || !gateway) return null;

  const handleCredentialChange = (key: string, val: string) => {
    setCredentials((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(gateway.id, {
      environment,
      credentials,
      isEnabled,
      notes,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gateway-config-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#0c102b] via-[#090d24] to-[#050714] p-6 shadow-2xl text-slate-100 animate-in fade-in-0 zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-indigo-500/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-inner">
              <Key size={18} />
            </div>
            <div>
              <h2 id="gateway-config-modal-title" className="text-base font-bold text-slate-100">
                Configure {gateway.name}
              </h2>
              <p className="text-xs text-slate-400">Manage API keys, environment, and operational parameters</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800/60 hover:text-slate-100 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {/* Environment and Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Environment</label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as IntegrationEnvironment)}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 shadow-inner"
              >
                <option value="Production" className="bg-slate-900 text-slate-100">Production (Live)</option>
                <option value="Sandbox" className="bg-slate-900 text-slate-100">Sandbox (Test Mode)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Integration Status</label>
              <select
                value={isEnabled ? 'enabled' : 'disabled'}
                onChange={(e) => setIsEnabled(e.target.value === 'enabled')}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 shadow-inner"
              >
                <option value="enabled" className="bg-slate-900 text-slate-100">Active / Enabled</option>
                <option value="disabled" className="bg-slate-900 text-slate-100">Inactive / Disabled</option>
              </select>
            </div>
          </div>

          {/* Credentials Key-Values */}
          <div className="space-y-2.5 pt-1">
            <label className="block font-semibold text-slate-200">API Credentials & Secrets</label>
            <div className="space-y-2 rounded-xl border border-indigo-500/20 bg-slate-950/90 p-3 shadow-inner">
              {Object.entries(credentials).map(([key, val]) => (
                <div key={key} className="space-y-1">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{key}</span>
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => handleCredentialChange(key, e.target.value)}
                    placeholder={`Enter ${key}...`}
                    className="w-full font-mono rounded-lg border border-indigo-500/25 bg-slate-900/90 px-3 py-1.5 text-xs text-purple-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 shadow-inner"
                  />
                </div>
              ))}
            </div>
            <p className="text-[11px] text-amber-300/90 flex items-center gap-1.5">
              <AlertCircle size={13} className="text-amber-400 shrink-0" />
              Secrets are encrypted with AES-GCM-256 before storage and never returned in plain-text.
            </p>
          </div>

          {/* Operational Notes */}
          <div>
            <label className="block font-medium text-slate-300 mb-1">Operational Notes / Webhook URL</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Callback URL, account limits, dedicated cluster details..."
              className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 shadow-inner"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-indigo-500/20 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => onTestPing(gateway.id)}
              disabled={isPinging}
              className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-500/20 bg-slate-800/80 px-3 py-2 font-medium text-slate-200 hover:bg-slate-700/80 cursor-pointer transition-colors min-w-28 justify-center shadow-xs disabled:opacity-50"
            >
              {isPinging ? <Loader2 size={13} className="animate-spin text-indigo-400" /> : <Activity size={13} />}
              <span>Test Ping</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl border border-indigo-500/20 bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-4 py-2 font-semibold text-white cursor-pointer transition-opacity min-w-32 justify-center shadow-md shadow-indigo-500/25"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                <span>Save Config</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
