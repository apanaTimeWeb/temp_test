// components/SuperadminIntegrationsOverviewRateLimitForm.tsx
// RESPONSIBILITY: Configure global API usage quotas, rate limits (RPM/daily/burst), and IP allowlisting.
// DATA FLOW: RateLimitPolicy -> SuperadminIntegrationsOverviewRateLimitForm -> onSaveRateLimits.
'use client';

import { Gauge, Loader2, Lock, Save, Shield } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import type { RateLimitPolicy } from '../types/superadmin_integrations_overview.types';

interface SuperadminIntegrationsOverviewRateLimitFormProps {
  rateLimits?: RateLimitPolicy | null;
  onSaveRateLimits: (payload: RateLimitPolicy) => void;
  isSavingLimits?: boolean;
}

export const SuperadminIntegrationsOverviewRateLimitForm: React.FC<
  SuperadminIntegrationsOverviewRateLimitFormProps
> = ({ rateLimits, onSaveRateLimits, isSavingLimits = false }) => {
  const [rpm, setRpm] = useState(rateLimits?.requestsPerMinute ?? 300);
  const [dailyQuota, setDailyQuota] = useState(rateLimits?.dailyQuota ?? 50000);
  const [burstLimit, setBurstLimit] = useState(rateLimits?.burstLimit ?? 50);
  const [enforceIp, setEnforceIp] = useState(rateLimits?.enforceIpAllowlist ?? true);
  const [globalIps, setGlobalIps] = useState<string[]>(
    rateLimits?.globalIpAllowlist ?? ['10.0.0.0/16', '192.168.1.0/24']
  );
  const [newGlobalIp, setNewGlobalIp] = useState('');

  useEffect(() => {
    if (rateLimits) {
      setRpm(rateLimits.requestsPerMinute);
      setDailyQuota(rateLimits.dailyQuota);
      setBurstLimit(rateLimits.burstLimit);
      setEnforceIp(rateLimits.enforceIpAllowlist);
      setGlobalIps(rateLimits.globalIpAllowlist);
    }
  }, [rateLimits]);

  const handleAddGlobalIp = () => {
    if (newGlobalIp.trim() && !globalIps.includes(newGlobalIp.trim())) {
      setGlobalIps([...globalIps, newGlobalIp.trim()]);
      setNewGlobalIp('');
    }
  };

  const handleRemoveGlobalIp = (ip: string) => {
    setGlobalIps(globalIps.filter((item) => item !== ip));
  };

  const handleSaveLimitsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveRateLimits({
      requestsPerMinute: Number(rpm),
      dailyQuota: Number(dailyQuota),
      burstLimit: Number(burstLimit),
      enforceIpAllowlist: enforceIp,
      globalIpAllowlist: globalIps,
    });
  };

  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0c102b]/95 via-[#090d24]/95 to-[#050714]/95 p-5 space-y-4 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-indigo-500/20">
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Gauge size={16} className="text-purple-400" />
            API Usage Quotas, Rate Limits & IP Allowlisting
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Enforces perimeter rate limits, token bucket burst capacities, and CIDR subnet firewalls
          </p>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full border border-purple-500/30 bg-purple-500/15 text-purple-300 font-semibold flex items-center gap-1 shrink-0">
          <Shield size={11} /> WAF Protected
        </span>
      </div>

      <form onSubmit={handleSaveLimitsSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-indigo-500/20 bg-slate-950/70 p-3.5 space-y-1.5 shadow-inner">
            <label className="block font-semibold text-slate-200">Requests Per Minute (RPM)</label>
            <input
              type="number"
              min={10}
              max={10000}
              value={rpm}
              onChange={(e) => setRpm(Number(e.target.value))}
              className="w-full font-mono rounded-lg border border-indigo-500/25 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 shadow-inner"
            />
            <span className="text-[10px] text-slate-400 block">
              Global limit per tenant or developer token
            </span>
          </div>

          <div className="rounded-xl border border-indigo-500/20 bg-slate-950/70 p-3.5 space-y-1.5 shadow-inner">
            <label className="block font-semibold text-slate-200">Daily Request Quota</label>
            <input
              type="number"
              min={1000}
              max={1000000}
              value={dailyQuota}
              onChange={(e) => setDailyQuota(Number(e.target.value))}
              className="w-full font-mono rounded-lg border border-indigo-500/25 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 shadow-inner"
            />
            <span className="text-[10px] text-slate-400 block">
              24-hour rolling window quota cap
            </span>
          </div>

          <div className="rounded-xl border border-indigo-500/20 bg-slate-950/70 p-3.5 space-y-1.5 shadow-inner">
            <label className="block font-semibold text-slate-200">Burst Capacity</label>
            <input
              type="number"
              min={5}
              max={500}
              value={burstLimit}
              onChange={(e) => setBurstLimit(Number(e.target.value))}
              className="w-full font-mono rounded-lg border border-indigo-500/25 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 shadow-inner"
            />
            <span className="text-[10px] text-slate-400 block">
              Token bucket buffer for concurrent spikes
            </span>
          </div>
        </div>

        {/* Global IP Allowlist */}
        <div className="rounded-xl border border-indigo-500/20 bg-slate-950/70 p-4 space-y-3 shadow-inner">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Lock size={12} className="text-purple-400" />
              Global Platform IP Firewall Allowlist
            </span>
            <label className="inline-flex items-center gap-2 cursor-pointer text-[11px]">
              <input
                type="checkbox"
                checked={enforceIp}
                onChange={(e) => setEnforceIp(e.target.checked)}
                className="rounded border-indigo-500/30 bg-slate-900 text-indigo-500 focus:ring-indigo-400"
              />
              <span className="font-medium text-slate-300">Enforce Subnet Filtering</span>
            </label>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newGlobalIp}
              onChange={(e) => setNewGlobalIp(e.target.value)}
              placeholder="e.g. 10.0.0.0/16 or 203.0.113.195/32"
              className="flex-1 font-mono rounded-xl border border-indigo-500/25 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 shadow-inner"
            />
            <button
              type="button"
              onClick={handleAddGlobalIp}
              className="px-3.5 py-1.5 rounded-xl border border-indigo-500/20 bg-slate-800/80 font-semibold text-slate-200 hover:bg-slate-700/80 hover:text-white cursor-pointer transition-colors shadow-xs"
            >
              Add Subnet
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 min-h-6">
            {globalIps.map((ip) => (
              <span
                key={ip}
                className="rounded-lg bg-slate-900 border border-indigo-500/20 px-2 py-0.5 text-[11px] font-mono text-slate-200 flex items-center gap-1.5"
              >
                {ip}
                <button
                  type="button"
                  onClick={() => handleRemoveGlobalIp(ip)}
                  className="text-slate-400 hover:text-rose-400 cursor-pointer transition-colors p-0.5"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSavingLimits}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-4 py-2 font-semibold text-xs text-white cursor-pointer min-w-36 justify-center shadow-md shadow-indigo-500/25 transition-opacity"
          >
            {isSavingLimits ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            <span>Save Policy Rules</span>
          </button>
        </div>
      </form>
    </div>
  );
};
