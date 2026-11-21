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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-dialog text-foreground animate-in fade-in-0 zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-border/80">
          <h3 id="api-key-modal-title" className="text-sm font-bold text-foreground">
            Generate New Platform API Key
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            title="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-medium text-foreground mb-1">
              Key Name / Client Identifier
            </label>
            <input
              type="text"
              required
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder="e.g. Accounting Daemon, Mobile Sync Service"
              className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-foreground mb-1">Role & Permission Scope</label>
              <select
                value={roleScope}
                onChange={(e) => setRoleScope(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              >
                <option value="Platform Developer">Platform Developer (Standard)</option>
                <option value="SuperAdmin System Daemon">SuperAdmin System Daemon (Full Access)</option>
                <option value="Read-Only Reporting Agent">Read-Only Reporting Agent</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-foreground mb-1">
                Rate Limit (Requests / Min)
              </label>
              <input
                type="number"
                min={10}
                max={5000}
                value={rateLimitRpm}
                onChange={(e) => setRateLimitRpm(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-foreground mb-1">
              Restricted IP Allowlist (CIDR or IPv4)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newIpInput}
                onChange={(e) => setNewIpInput(e.target.value)}
                placeholder="e.g. 192.168.1.100/32"
                className="flex-1 font-mono rounded-xl border border-border bg-muted/30 px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              />
              <button
                type="button"
                onClick={handleAddIp}
                className="px-3 py-1.5 rounded-xl border border-border bg-muted/50 text-foreground font-semibold hover:bg-muted cursor-pointer transition-colors"
              >
                Add IP
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-6">
              {ipList.map((ip) => (
                <span
                  key={ip}
                  className="rounded-lg bg-muted px-2 py-0.5 text-[11px] font-mono text-foreground flex items-center gap-1.5"
                >
                  {ip}
                  <button
                    type="button"
                    onClick={() => handleRemoveIp(ip)}
                    className="text-muted-foreground hover:text-danger-text cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-border/80 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 font-semibold text-on-primary hover:opacity-90 cursor-pointer min-w-36 justify-center shadow-xs transition-opacity"
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
