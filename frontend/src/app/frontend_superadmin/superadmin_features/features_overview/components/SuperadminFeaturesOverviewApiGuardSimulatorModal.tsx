// RESPONSIBILITY: Live backend API Denial Guard simulator demonstrating HTTP 403 FEATURE_DISABLED enforcement.
import React, { useState, useEffect } from 'react';
import { X, Terminal, ShieldAlert, ShieldCheck, Play, CheckCircle2, Copy } from 'lucide-react';
import type {
  ModuleDefinition,
  EffectiveAccessResult,
  ApiDenialSimulationResult,
} from '@/app/frontend_superadmin/superadmin_features/features_overview/types/superadmin_features_overview.types';
import { simulateApiGuardEvaluation } from '@/app/frontend_superadmin/superadmin_features/features_overview/utils/superadmin_features_overview_utils';
import { useModalScrollLock } from '@/lib/useModalScrollLock';

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
  useModalScrollLock(true);

  const [selectedEndpoint, setSelectedEndpoint] = useState<string>(module.apiEndpoints[0] ?? '/api/v1');
  const [method, setMethod] = useState<'POST' | 'GET' | 'PUT'>('POST');
  const [simulationResult, setSimulationResult] = useState<ApiDenialSimulationResult | null>(null);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [activeTab, setActiveTab] = useState<'response' | 'curl' | 'headers'>('response');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleRunSimulation = () => {
    setSimulationResult(simulateApiGuardEvaluation(selectedEndpoint, effective, tenantName, { method }));
  };

  const copyToClipboard = (text: string, isCurl: boolean) => {
    navigator.clipboard.writeText(text);
    if (isCurl) {
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    } else {
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-hidden animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl rounded-3xl border border-teal-500/30 bg-[#0a0d24] text-white shadow-2xl shadow-teal-950/80 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-indigo-500/20 bg-[#060818]/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400">
              <Terminal size={20} />
            </span>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Backend API Guard Simulator
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold uppercase border border-teal-500/30">
                  Zero-Trust Gatekeeper
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Verifies that disabled features are strictly rejected at the API middleware layer (HTTP 403 Forbidden).
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 scrollbar-thin">
          {/* Target Info */}
          <div className="p-4 rounded-2xl border border-indigo-500/20 bg-slate-950/70 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-400 text-[11px] block">Target Module:</span>
              <span className="font-bold text-white">{module.name}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Tenant Organization:</span>
              <span className="font-bold text-white">{tenantName}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Effective Status:</span>
              <span className={`font-bold inline-flex items-center gap-1 ${effective.effectiveAllowed ? 'text-emerald-400' : 'text-rose-400'}`}>
                {effective.effectiveAllowed ? <ShieldCheck size={13} /> : <ShieldAlert size={13} />}
                {effective.effectiveAllowed ? 'ALLOWED' : 'DENIED'}
              </span>
            </div>
          </div>

          {/* Endpoint & Method Picker & Execute */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              Select API Endpoint & Method to Probe:
            </label>
            <div className="flex items-center gap-2">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as 'POST' | 'GET' | 'PUT')}
                className="w-24 px-2.5 py-2 text-xs font-mono font-bold rounded-xl border border-indigo-500/25 bg-slate-950/80 text-teal-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
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
                className="flex-1 px-3.5 py-2 text-xs font-mono rounded-xl border border-indigo-500/25 bg-slate-950/80 text-teal-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                {module.apiEndpoints.map((ep) => (
                  <option key={ep} value={ep}>{ep}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleRunSimulation}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-teal-500/25 shrink-0 cursor-pointer active:scale-95"
              >
                <Play size={14} />
                <span>Send Request Probe</span>
              </button>
            </div>
          </div>

          {/* Hierarchy Trace Breakdown */}
          <div className="p-3.5 rounded-2xl border border-indigo-500/20 bg-slate-950/60 text-xs space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              3-Level Governance Hierarchy Trace:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-indigo-500/15">
                <span className="text-slate-400 block">L1: Platform Default</span>
                <span className={effective.isPlatformAllowed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {effective.isPlatformAllowed ? 'ACTIVE (Permitted)' : 'BLOCKED (Killswitch)'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-indigo-500/15">
                <span className="text-slate-400 block">L2: Plan Entitlement</span>
                <span className={effective.isPlanAllowed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {effective.isPlanAllowed ? 'INCLUDED' : 'NOT INCLUDED'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-indigo-500/15">
                <span className="text-slate-400 block">L3: Custom Override</span>
                <span className="text-amber-400 font-bold">
                  {effective.override ? effective.override.overrideStatus : 'NONE (Default)'}
                </span>
              </div>
            </div>
          </div>

          {/* Live Response Panel */}
          {simulationResult && (
            <div className="space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                      simulationResult.allowed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    HTTP {simulationResult.httpStatus} {simulationResult.allowed ? 'OK' : 'FORBIDDEN'}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {simulationResult.latencyMs}ms
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs">
                  {(['response', 'curl', 'headers'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                        activeTab === tab ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab === 'response' ? 'Response Body' : tab === 'curl' ? 'cURL Command' : 'Request Headers'}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === 'response' && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(JSON.stringify(simulationResult.responsePayload, null, 2), false)}
                    className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedPayload ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedPayload ? 'Copied' : 'Copy'}</span>
                  </button>
                  <pre className="p-4 rounded-2xl border border-indigo-500/20 bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto leading-relaxed max-h-56 scrollbar-thin">
                    {JSON.stringify(simulationResult.responsePayload, null, 2)}
                  </pre>
                </div>
              )}

              {activeTab === 'curl' && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(simulationResult.curlCommand, true)}
                    className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedCurl ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedCurl ? 'Copied' : 'Copy'}</span>
                  </button>
                  <pre className="p-4 rounded-2xl border border-indigo-500/20 bg-slate-950 text-teal-300 text-xs font-mono overflow-x-auto leading-relaxed max-h-56 whitespace-pre-wrap scrollbar-thin">
                    {simulationResult.curlCommand}
                  </pre>
                </div>
              )}

              {activeTab === 'headers' && (
                <pre className="p-4 rounded-2xl border border-indigo-500/20 bg-slate-950 text-slate-300 text-xs font-mono overflow-x-auto leading-relaxed max-h-56 scrollbar-thin">
                  {JSON.stringify(simulationResult.requestHeaders, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-indigo-500/20 bg-[#060818]/95 backdrop-blur-md flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            Enforced by <code className="text-teal-400">PlatformFeatureGuardMiddleware</code> before controller execution.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
