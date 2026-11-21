// RESPONSIBILITY: Live backend API Denial Guard simulator demonstrating HTTP 403 FEATURE_DISABLED enforcement.
import React, { useState } from 'react';
import { X, Terminal, ShieldAlert, ShieldCheck, Play, CheckCircle2, Copy, Code, Layers } from 'lucide-react';
import type {
  ModuleDefinition,
  EffectiveAccessResult,
  ApiDenialSimulationResult,
} from '@/app/frontend_superadmin/superadmin_features/features_overview/types/superadmin_features_overview.types';
import { simulateApiGuardEvaluation } from '@/app/frontend_superadmin/superadmin_features/features_overview/utils/superadmin_features_overview_utils';

interface ApiGuardSimulatorModalProps {
  module: ModuleDefinition;
  effective: EffectiveAccessResult;
  tenantName: string;
  onClose: () => void;
}

export default function SuperadminFeaturesOverviewApiGuardSimulatorModal({
  module,
  effective,
  tenantName,
  onClose,
}: ApiGuardSimulatorModalProps) {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>(module.apiEndpoints[0] ?? '/api/v1');
  const [method, setMethod] = useState<'POST' | 'GET' | 'PUT'>('POST');
  const [simulationResult, setSimulationResult] = useState<ApiDenialSimulationResult | null>(null);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [activeTab, setActiveTab] = useState<'response' | 'curl' | 'headers'>('response');

  const handleRunSimulation = () => {
    const res = simulateApiGuardEvaluation(selectedEndpoint, effective, tenantName, {
      method,
    });
    setSimulationResult(res);
  };

  const handleCopyJson = () => {
    if (!simulationResult) return;
    navigator.clipboard.writeText(JSON.stringify(simulationResult.responsePayload, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handleCopyCurl = () => {
    if (!simulationResult?.curlCommand) return;
    navigator.clipboard.writeText(simulationResult.curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-neutral-900/70">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
              <Terminal size={18} />
            </span>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Backend API Guard Simulator
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 font-semibold uppercase">
                  Zero-Trust Gatekeeper
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Verifies that disabled features are strictly rejected at the API middleware layer (HTTP 403 Forbidden).
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Target Info */}
          <div className="p-3.5 rounded-xl border border-border bg-neutral-900/50 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-neutral-400 text-[11px] block">Target Module:</span>
              <span className="font-semibold text-white">{module.name}</span>
            </div>
            <div>
              <span className="text-neutral-400 text-[11px] block">Tenant Organization:</span>
              <span className="font-semibold text-white">{tenantName}</span>
            </div>
            <div>
              <span className="text-neutral-400 text-[11px] block">Effective Status:</span>
              <span
                className={`font-semibold inline-flex items-center gap-1 ${
                  effective.effectiveAllowed ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {effective.effectiveAllowed ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                {effective.effectiveAllowed ? 'ALLOWED' : 'DENIED'}
              </span>
            </div>
          </div>

          {/* Endpoint & Method Picker & Execute */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-300">
              Select API Endpoint & Method to Probe:
            </label>
            <div className="flex items-center gap-2">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as 'POST' | 'GET' | 'PUT')}
                className="w-24 px-2 py-2 text-xs font-mono font-bold rounded-lg border border-border bg-input text-teal-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="POST">POST</option>
                <option value="GET">GET</option>
                <option value="PUT">PUT</option>
              </select>

              <select
                value={selectedEndpoint}
                onChange={(e) => {
                  setSelectedEndpoint(e.target.value);
                  setSimulationResult(null);
                }}
                className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-border bg-input text-teal-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                {module.apiEndpoints.map((ep) => (
                  <option key={ep} value={ep}>
                    {ep}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleRunSimulation}
                className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
              >
                <Play size={14} />
                <span>Send Request Probe</span>
              </button>
            </div>
          </div>

          {/* Hierarchy Trace Breakdown */}
          <div className="p-3 rounded-lg border border-border bg-neutral-900/30 text-xs space-y-1.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              3-Level Governance Hierarchy Trace:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="p-2 rounded bg-neutral-800/60 border border-neutral-700/50">
                <span className="text-neutral-400 block">L1: Platform Default</span>
                <span className={effective.isPlatformAllowed ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                  {effective.isPlatformAllowed ? 'ACTIVE (Permitted)' : 'BLOCKED (Killswitch)'}
                </span>
              </div>
              <div className="p-2 rounded bg-neutral-800/60 border border-neutral-700/50">
                <span className="text-neutral-400 block">L2: Plan Entitlement</span>
                <span className={effective.isPlanAllowed ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                  {effective.isPlanAllowed ? 'INCLUDED' : 'NOT INCLUDED'}
                </span>
              </div>
              <div className="p-2 rounded bg-neutral-800/60 border border-neutral-700/50">
                <span className="text-neutral-400 block">L3: Custom Override</span>
                <span className="text-amber-400 font-semibold">
                  {effective.override ? effective.override.overrideStatus : 'NONE (Default)'}
                </span>
              </div>
            </div>
          </div>

          {/* Live Response Panel */}
          {simulationResult && (
            <div className="space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                      simulationResult.allowed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    HTTP {simulationResult.httpStatus} {simulationResult.allowed ? 'OK' : 'FORBIDDEN'}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {simulationResult.latencyMs}ms
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab('response')}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                      activeTab === 'response' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Response Body
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('curl')}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                      activeTab === 'curl' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    cURL Command
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('headers')}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                      activeTab === 'headers' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Request Headers
                  </button>
                </div>
              </div>

              {activeTab === 'response' && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="absolute top-2 right-2 px-2 py-1 rounded bg-neutral-800/80 hover:bg-neutral-700 text-xs text-neutral-300 flex items-center gap-1 transition-colors"
                  >
                    {copiedPayload ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedPayload ? 'Copied' : 'Copy'}</span>
                  </button>
                  <pre className="p-3.5 rounded-xl border border-border bg-neutral-950 text-neutral-200 text-xs font-mono overflow-x-auto leading-relaxed max-h-56">
                    {JSON.stringify(simulationResult.responsePayload, null, 2)}
                  </pre>
                </div>
              )}

              {activeTab === 'curl' && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={handleCopyCurl}
                    className="absolute top-2 right-2 px-2 py-1 rounded bg-neutral-800/80 hover:bg-neutral-700 text-xs text-neutral-300 flex items-center gap-1 transition-colors"
                  >
                    {copiedCurl ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedCurl ? 'Copied' : 'Copy'}</span>
                  </button>
                  <pre className="p-3.5 rounded-xl border border-border bg-neutral-950 text-teal-300 text-xs font-mono overflow-x-auto leading-relaxed max-h-56 whitespace-pre-wrap">
                    {simulationResult.curlCommand}
                  </pre>
                </div>
              )}

              {activeTab === 'headers' && (
                <pre className="p-3.5 rounded-xl border border-border bg-neutral-950 text-neutral-300 text-xs font-mono overflow-x-auto leading-relaxed max-h-56">
                  {JSON.stringify(simulationResult.requestHeaders, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-border bg-neutral-900/60 flex items-center justify-between">
          <p className="text-[11px] text-neutral-400">
            Enforced by <code className="text-teal-400">PlatformFeatureGuardMiddleware</code> before controller execution.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-border bg-input text-neutral-300 text-xs font-medium hover:bg-neutral-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
