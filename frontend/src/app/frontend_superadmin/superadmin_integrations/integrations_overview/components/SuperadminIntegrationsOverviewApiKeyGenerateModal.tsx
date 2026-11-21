// components/SuperadminIntegrationsOverviewApiKeyGenerateModal.tsx
// RESPONSIBILITY: Modal for generating a new machine-to-machine API key with permissions and rate limits.
// DATA FLOW: Form inputs -> SuperadminIntegrationsOverviewApiKeyGenerateModal -> onCreateKey.
'use client';

import { Loader2, Plus, X } from 'lucide-react';
import React, { useState } from 'react';
import type { ApiKeyCreatePayload } from '../types/superadmin_integrations_overview.types';

interface SuperadminIntegrationsOverviewApiKeyGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateKey: (payload: ApiKeyCreatePayload) => void;
  isGenerating?: boolean;
}

export const SuperadminIntegrationsOverviewApiKeyGenerateModal: React.FC<
  SuperadminIntegrationsOverviewApiKeyGenerateModalProps
> = ({ isOpen, onClose, onCreateKey, isGenerating = false }) => {
  const [keyName, setKeyName] = useState('');
  const [roleScope, setRoleScope] = useState('Platform Developer');
  const [rateLimitRpm, setRateLimitRpm] = useState(300);
  const [newIpInput, setNewIpInput] = useState('');
  const [ipList, setIpList] = useState<string[]>(['10.0.0.0/16']);

  if (!isOpen) return null;

  const handleAddIp = () => {
    if (newIpInput.trim() && !ipList.includes(newIpInput.trim())) {
      setIpList([...ipList, newIpInput.trim()]);
      setNewIpInput('');
    }
  };

  const handleRemoveIp = (ip: string) => {
    setIpList(ipList.filter((item) => item !== ip));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;
    onCreateKey({
      name: keyName.trim(),
      roleScope,
      ipAllowlist: ipList,
      rateLimitRpm,
    });
    setKeyName('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#0c102b] via-[#090d24] to-[#050714] p-6 shadow-2xl text-slate-100 animate-in fade-in-0 zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
          <h3 id="api-key-modal-title" className="text-sm font-bold text-slate-100">
            Generate New Platform API Key
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 cursor-pointer transition-colors p-1"
            title="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1">
              Key Name / Client Identifier
            </label>
            <input
              type="text"
              required
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder="e.g. Accounting Daemon, Mobile Sync Service"
              className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 shadow-inner"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Role & Permission Scope</label>
              <select
                value={roleScope}
                onChange={(e) => setRoleScope(e.target.value)}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 shadow-inner"
              >
                <option value="Platform Developer" className="bg-slate-900 text-slate-100">Platform Developer (Standard)</option>
                <option value="SuperAdmin System Daemon" className="bg-slate-900 text-slate-100">SuperAdmin System Daemon (Full Access)</option>
                <option value="Read-Only Reporting Agent" className="bg-slate-900 text-slate-100">Read-Only Reporting Agent</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Rate Limit (Requests / Min)
              </label>
              <input
                type="number"
                min={10}
                max={5000}
                value={rateLimitRpm}
                onChange={(e) => setRateLimitRpm(Number(e.target.value))}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 shadow-inner"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">
              Restricted IP Allowlist (CIDR or IPv4)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newIpInput}
                onChange={(e) => setNewIpInput(e.target.value)}
                placeholder="e.g. 192.168.1.100/32"
                className="flex-1 font-mono rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3 py-1.5 text-xs text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 shadow-inner"
              />
              <button
                type="button"
                onClick={handleAddIp}
                className="px-3 py-1.5 rounded-xl border border-indigo-500/20 bg-slate-800/80 text-slate-200 font-semibold hover:bg-slate-700 cursor-pointer transition-colors shadow-xs"
              >
                Add IP
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-6">
              {ipList.map((ip) => (
                <span
                  key={ip}
                  className="rounded-lg bg-slate-900 border border-indigo-500/20 px-2 py-0.5 text-[11px] font-mono text-slate-200 flex items-center gap-1.5"
                >
                  {ip}
                  <button
                    type="button"
                    onClick={() => handleRemoveIp(ip)}
                    className="text-slate-400 hover:text-rose-400 cursor-pointer p-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-indigo-500/20 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl border border-indigo-500/20 bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-4 py-1.5 font-semibold text-white cursor-pointer min-w-36 justify-center shadow-md shadow-indigo-500/25 transition-opacity"
            >
              {isGenerating ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
              <span>Generate API Key</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
