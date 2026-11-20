// components/SuperadminIntegrationsOverviewApiKeysPanel.tsx
// RESPONSIBILITY: Manage API keys (masked storage, rotate, revoke) and configure global rate limits and IP allowlisting.
// DATA FLOW: ApiKeys & RateLimits -> SuperadminIntegrationsOverviewApiKeysPanel -> mutation triggers.
'use client';

import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Gauge,
  Key,
  Loader2,
  Lock,
  Plus,
  RefreshCw,
  RotateCcw,
  Shield,
  Trash2,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import type {
  ApiKeyCreatePayload,
  ApiKeyCreatedResult,
  ApiKeyItem,
  RateLimitPolicy,
} from '../types/superadmin_integrations_overview.types';

interface SuperadminIntegrationsOverviewApiKeysPanelProps {
  apiKeys: ApiKeyItem[];
  rateLimits?: RateLimitPolicy;
  newKeyResult: ApiKeyCreatedResult | null;
  onClearNewKeyResult: () => void;
  onCreateKey: (payload: ApiKeyCreatePayload) => void;
  onRotateKey: (id: string) => void;
  onRevokeKey: (id: string) => void;
  onSaveRateLimits: (payload: RateLimitPolicy) => void;
  onConfirmRevoke: (message: string) => Promise<boolean>;
  isGenerating?: boolean;
  isSavingLimits?: boolean;
}

export const SuperadminIntegrationsOverviewApiKeysPanel: React.FC<
  SuperadminIntegrationsOverviewApiKeysPanelProps
> = ({
  apiKeys,
  rateLimits,
  newKeyResult,
  onClearNewKeyResult,
  onCreateKey,
  onRotateKey,
  onRevokeKey,
  onSaveRateLimits,
  onConfirmRevoke,
  isGenerating = false,
  isSavingLimits = false,
}) => {
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [roleScope, setRoleScope] = useState('Platform Developer');
  const [rateLimitRpm, setRateLimitRpm] = useState(300);
  const [newIpInput, setNewIpInput] = useState('');
  const [ipList, setIpList] = useState<string[]>(['10.0.0.0/16']);

  // Rate limits editable state
  const [rpm, setRpm] = useState(rateLimits?.requestsPerMinute ?? 300);
  const [dailyQuota, setDailyQuota] = useState(rateLimits?.dailyQuota ?? 50000);
  const [burstLimit, setBurstLimit] = useState(rateLimits?.burstLimit ?? 50);
  const [enforceIp, setEnforceIp] = useState(rateLimits?.enforceIpAllowlist ?? true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
    setIsGenerateModalOpen(false);
  };

  const handleRevokeClick = async (k: ApiKeyItem) => {
    const ok = await onConfirmRevoke(
      `Are you sure you want to permanently revoke API Key "${k.name}" (${k.prefix})? Any active daemons or clients using this key will immediately receive HTTP 401 Unauthorized.`
    );
    if (ok) {
      onRevokeKey(k.id);
    }
  };

  const handleSaveLimitsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveRateLimits({
      requestsPerMinute: Number(rpm),
      dailyQuota: Number(dailyQuota),
      burstLimit: Number(burstLimit),
      enforceIpAllowlist: enforceIp,
      globalIpAllowlist: ipList,
    });
  };

  return (
    <div className="space-y-6" data-testid="superadmin-apikeys-panel">
      {/* ── Section 1: Active API Keys ── */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/80">
          <div>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Key size={16} className="text-purple-400" />
              Machine & Platform API Keys
            </h2>
            <p className="text-xs text-muted-foreground">
              Keys are securely stored as hashed credentials. Secret keys can be rotated or revoked with immediate effect.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsGenerateModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-on-primary hover:opacity-90 cursor-pointer min-w-36 justify-center shadow-xs"
          >
            <Plus size={14} /> Generate API Key
          </button>
        </div>

        <div className="space-y-3">
          {apiKeys.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4 text-center">No active API keys found.</p>
          ) : (
            apiKeys.map((k) => (
              <div
                key={k.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/20 p-4 text-xs"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-foreground text-xs">{k.name}</span>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground font-mono">
                      {k.roleScope}
                    </span>
                    {k.status === 'active' ? (
                      <span className="rounded-full bg-success-bg px-2 py-0.5 text-[10px] font-semibold text-success-text">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-danger-bg px-2 py-0.5 text-[10px] font-semibold text-danger-text">
                        Revoked
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs text-purple-400">
                    <Lock size={12} className="text-muted-foreground" />
                    <span>{k.maskedKey}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(k.maskedKey, k.id)}
                      className="text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Copy Key Reference"
                    >
                      <Copy size={12} />
                    </button>
                    {copiedId === k.id && <span className="text-success-text text-[10px]">Copied!</span>}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
                    <span>Limit: {k.rateLimitRpm} RPM</span>
                    <span>•</span>
                    <span>Used: {k.lastUsedAt}</span>
                    <span>•</span>
                    <span>IP Allowlist: {k.ipAllowlist.length > 0 ? k.ipAllowlist.join(', ') : 'Any IP (Open)'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/60">
                  <button
                    type="button"
                    onClick={() => onRotateKey(k.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium text-foreground hover:bg-muted/60 cursor-pointer transition-colors"
                    title="Rotate Key (Old key expires in 24h)"
                  >
                    <RotateCcw size={12} /> Rotate
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRevokeClick(k)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-danger/30 bg-danger-bg px-2.5 py-1.5 text-[11px] font-medium text-danger-text hover:opacity-90 cursor-pointer transition-opacity"
                    title="Revoke Key Immediately"
                  >
                    <Trash2 size={12} /> Revoke
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Section 2: Global API Rate Limits & IP Firewall ── */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-xs">
        <div className="pb-3 border-b border-border/80">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Gauge size={16} className="text-purple-400" />
            API Usage Quotas, Rate Limits & IP Allowlisting
          </h2>
          <p className="text-xs text-muted-foreground">
            Configure DDoS throttling, burst limits, and restrict access to trusted corporate IP subnets.
          </p>
        </div>

        <form onSubmit={handleSaveLimitsSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-foreground mb-1">Requests / Minute (RPM)</label>
              <input
                type="number"
                min={10}
                max={10000}
                value={rpm}
                onChange={(e) => setRpm(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              />
            </div>
            <div>
              <label className="block font-medium text-foreground mb-1">Daily Request Quota</label>
              <input
                type="number"
                min={1000}
                max={1000000}
                value={dailyQuota}
                onChange={(e) => setDailyQuota(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              />
            </div>
            <div>
              <label className="block font-medium text-foreground mb-1">Burst Limit Allowance</label>
              <input
                type="number"
                min={5}
                max={500}
                value={burstLimit}
                onChange={(e) => setBurstLimit(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              />
            </div>
          </div>

          {/* IP Allowlist Tags */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-foreground flex items-center gap-2">
                <Shield size={14} className="text-purple-400" />
                Trusted IP & CIDR Subnet Allowlist
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enforceIp}
                  onChange={(e) => setEnforceIp(e.target.checked)}
                  className="rounded border-border text-purple-600 focus:ring-purple-400"
                />
                <span className="text-xs text-foreground font-medium">Strictly Enforce IP Firewall</span>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl border border-border bg-muted/20 min-h-12">
              {ipList.map((ip) => (
                <span
                  key={ip}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-card border border-border px-2.5 py-1 text-xs font-mono text-foreground"
                >
                  {ip}
                  <button
                    type="button"
                    onClick={() => handleRemoveIp(ip)}
                    className="text-muted-foreground hover:text-danger-text cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newIpInput}
                onChange={(e) => setNewIpInput(e.target.value)}
                placeholder="Add IPv4 or CIDR (e.g. 192.168.1.1/32)..."
                className="w-full sm:w-72 font-mono rounded-xl border border-border bg-muted/30 px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              />
              <button
                type="button"
                onClick={handleAddIp}
                className="px-3 py-1.5 rounded-xl border border-border bg-card text-foreground font-semibold hover:bg-muted/50 text-xs cursor-pointer"
              >
                Add IP
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-border/80 flex justify-end">
            <button
              type="submit"
              disabled={isSavingLimits}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 font-semibold text-on-primary hover:opacity-90 cursor-pointer min-w-36 justify-center shadow-xs"
            >
              {isSavingLimits ? <Loader2 size={13} className="animate-spin" /> : <Shield size={13} />}
              <span>Save Policy</span>
            </button>
          </div>
        </form>
      </div>

      {/* ── 1-Time Revealed Secret Key Modal ── */}
      {newKeyResult && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-warning/40 bg-card p-6 shadow-dialog text-foreground animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 pb-3 border-b border-border/80">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-bg text-warning-text">
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Save Your Secret API Key</h3>
                <p className="text-xs text-muted-foreground">This secret key will NEVER be shown again.</p>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <p className="text-muted-foreground leading-relaxed">
                Please copy your API key and store it in a secure password manager or encrypted environment vault.
              </p>

              <div className="rounded-xl border border-warning-bg bg-warning-bg/10 p-3 flex items-center justify-between gap-2 font-mono text-xs text-foreground font-semibold">
                <span className="break-all">{newKeyResult.plainTextSecret}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(newKeyResult.plainTextSecret, 'new-secret')}
                  className="px-2.5 py-1 rounded-lg bg-card border border-border text-foreground hover:bg-muted text-xs shrink-0 cursor-pointer"
                >
                  {copiedId === 'new-secret' ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={onClearNewKeyResult}
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary font-semibold text-xs hover:opacity-90 cursor-pointer"
                >
                  I Have Saved This Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Generate API Key Modal ── */}
      {isGenerateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-dialog text-foreground">
            <div className="flex items-center justify-between pb-3 border-b border-border/80">
              <h3 className="text-sm font-bold text-foreground">Generate New API Key</h3>
              <button
                type="button"
                onClick={() => setIsGenerateModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-foreground mb-1">Key Descriptive Name</label>
                <input
                  type="text"
                  required
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="e.g. Analytics ETL Pipeline Token"
                  className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Role / Access Scope</label>
                <select
                  value={roleScope}
                  onChange={(e) => setRoleScope(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                >
                  <option value="SuperAdmin System Daemon">SuperAdmin System Daemon (Full Write)</option>
                  <option value="Read-Only Reporting Agent">Read-Only Reporting Agent</option>
                  <option value="Biometric Attendance Device Sync">Biometric Attendance Device Sync</option>
                  <option value="External Developer Integration">External Developer Integration</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Dedicated Rate Limit (RPM)</label>
                <input
                  type="number"
                  min={10}
                  max={5000}
                  value={rateLimitRpm}
                  onChange={(e) => setRateLimitRpm(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                />
              </div>

              <div className="pt-3 border-t border-border/80 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 font-semibold text-on-primary hover:opacity-90 cursor-pointer min-w-32 justify-center shadow-xs"
                >
                  {isGenerating ? <Loader2 size={13} className="animate-spin" /> : <Key size={13} />}
                  <span>Generate Key</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
