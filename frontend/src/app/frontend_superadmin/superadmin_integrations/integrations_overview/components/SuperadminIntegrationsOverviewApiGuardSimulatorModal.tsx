// RESPONSIBILITY: Developer and SuperAdmin API Guard Simulator demonstrating Zero-Trust API gatekeeping, rate-limiting, and HTTP 403/429 enforcement.
'use client';

import React, { useState, useEffect } from 'react';
import { X, Terminal, Play, CheckCircle2, Copy } from 'lucide-react';
import { useModalScrollLock } from '@/lib/useModalScrollLock';

interface ApiGuardSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_ENDPOINTS = [
  { path: '/api/v1/integrations/gateways/ping', name: 'Gateway Health Probe', method: 'GET' },
  { path: '/api/v1/integrations/webhooks/dispatch', name: 'Webhook Event Dispatch', method: 'POST' },
  { path: '/api/v1/integrations/api-keys/validate', name: 'API Key & Token Validator', method: 'POST' },
  { path: '/api/v1/integrations/rate-limits/check', name: 'Rate Limiter Token Bucket', method: 'GET' },
  { path: '/api/v1/tenants/modules/guard', name: 'Zero-Trust Module Guard', method: 'POST' },
  { path: '/api/v1/finance/payments/collect', name: 'Payment Gateway Execution', method: 'POST' },
] as const;

type ProbeScenario = 'authorized' | 'feature_disabled' | 'rate_limit' | 'unauthorized' | 'ip_restricted';
type HttpMethod = 'POST' | 'GET' | 'PUT' | 'DELETE';

interface ApiGuardSimulationResult {
  status: number;
  allowed: boolean;
  latencyMs: number;
  curlCommand: string;
  requestHeaders: Record<string, string>;
  responsePayload: Record<string, unknown>;
}

function buildSimulationResponse(scenario: ProbeScenario, endpoint: string, tenant: string, method: string): ApiGuardSimulationResult {
  const isOk = scenario === 'authorized';
  const status = isOk ? 200 : scenario === 'feature_disabled' ? 403 : scenario === 'rate_limit' ? 429 : scenario === 'ip_restricted' ? 403 : 401;
  const domain = `${tenant.toLowerCase().replace(/\s+/g, '-')}.libraryos.app`;
  const curlCommand = `curl -X ${method} "https://api.libraryos.app${endpoint}" \\\n  -H "Authorization: Bearer sa_live_${scenario === 'unauthorized' ? 'expired' : 'valid_token'}" \\\n  -H "X-Tenant-Domain: ${domain}" \\\n  -H "Content-Type: application/json"`;

  const requestHeaders = {
    'Authorization': `Bearer sa_live_${scenario === 'unauthorized' ? 'expired' : 'valid_token'}`,
    'X-Tenant-Domain': domain,
    'X-Enforcement-Layer': 'PlatformZeroTrustGatekeeper',
  };

  const payloads: Record<ProbeScenario, Record<string, unknown>> = {
    authorized: { success: true, statusCode: 200, message: `Authorized. Endpoint [${endpoint}] executed successfully.`, tenant, verdict: 'ALLOW' },
    feature_disabled: { success: false, statusCode: 403, errorCode: 'FEATURE_DISABLED', error: 'Feature Disabled', message: `Target feature disabled for "${tenant}".`, verdict: 'KILLSWITCH' },
    rate_limit: { success: false, statusCode: 429, errorCode: 'RATE_LIMIT_EXCEEDED', error: 'Too Many Requests', message: 'Quota of 120 RPM exceeded.', retryAfter: 42 },
    ip_restricted: { success: false, statusCode: 403, errorCode: 'IP_FIREWALL_BLOCK', error: 'Forbidden Client IP', message: 'Client IP is not permitted.' },
    unauthorized: { success: false, statusCode: 401, errorCode: 'INVALID_API_KEY', error: 'Unauthorized Access', message: 'API key is invalid or expired.' },
  };

  return { status, allowed: isOk, latencyMs: isOk ? 28 : 9, curlCommand, requestHeaders, responsePayload: payloads[scenario] };
}

export const SuperadminIntegrationsOverviewApiGuardSimulatorModal: React.FC<ApiGuardSimulatorModalProps> = ({ isOpen, onClose }) => {
  useModalScrollLock(isOpen);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>(API_ENDPOINTS[0].path);
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [scenario, setScenario] = useState<ProbeScenario>('authorized');
  const [tenantName, setTenantName] = useState<string>('Patna Central Reading Rooms');
  const [activeTab, setActiveTab] = useState<'response' | 'curl' | 'headers'>('response');
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [simulationResult, setSimulationResult] = useState<ApiGuardSimulationResult | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleRunSimulation = () => {
    setSimulationResult(buildSimulationResponse(scenario, selectedEndpoint, tenantName, method));
  };

  const copy = (text: string, isCurl: boolean) => {
    navigator.clipboard.writeText(text);
    if (isCurl) { setCopiedCurl(true); setTimeout(() => setCopiedCurl(false), 2000); }
    else { setCopiedPayload(true); setTimeout(() => setCopiedPayload(false), 2000); }
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in motion-safe:duration-200" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-2xl rounded-3xl border border-teal-500/30 bg-[#0a0d24] text-white shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 motion-safe:duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-indigo-500/20 bg-[#060818]/95">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400"><Terminal size={20} /></span>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">API Guard & Gatekeeper Simulator <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold uppercase border border-teal-500/30">Developer Sandbox</span></h2>
              <p className="text-xs text-slate-400">Simulate API invocations, rate limits, and Zero-Trust policy gatekeeping (HTTP 200 / 403 / 429).</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close modal" className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"><X size={18} /></button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 scrollbar-thin">
          <div className="p-4 rounded-2xl border border-indigo-500/20 bg-slate-950/70 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 text-[11px] font-bold block mb-1">Target Tenant:</label>
                <input maxLength={100} type="text" value={tenantName} onChange={(e) => setTenantName(e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-indigo-500/25 bg-slate-900 text-slate-200 text-xs focus:ring-1 focus:ring-teal-500" />
              </div>
              <div>
                <label className="text-slate-400 text-[11px] font-bold block mb-1">Simulation Scenario:</label>
                <select value={scenario} onChange={(e) => { setScenario(e.target.value as ProbeScenario); setSimulationResult(null); }} className="w-full px-3 py-1.5 rounded-xl border border-indigo-500/25 bg-slate-900 text-teal-300 font-semibold text-xs focus:ring-1 focus:ring-teal-500">
                  <option value="authorized">Authorized Request (200 OK)</option>
                  <option value="feature_disabled">Feature/Module Disabled (403 Forbidden)</option>
                  <option value="rate_limit">Rate Limit Exceeded (429 Too Many Requests)</option>
                  <option value="ip_restricted">IP Firewall Denied (403 Forbidden)</option>
                  <option value="unauthorized">Invalid / Revoked Key (401 Unauthorized)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-400 text-[11px] font-bold block mb-1">Probe Endpoint & Method:</label>
              <div className="flex items-center gap-2">
                <select value={method} onChange={(e) => setMethod(e.target.value as HttpMethod)} className="w-24 px-2.5 py-2 text-xs font-mono font-bold rounded-xl border border-indigo-500/25 bg-slate-950 text-teal-300 focus:ring-1 focus:ring-teal-500">
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
                <select value={selectedEndpoint} onChange={(e) => { setSelectedEndpoint(e.target.value); setSimulationResult(null); }} className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-indigo-500/25 bg-slate-950 text-teal-300 focus:ring-1 focus:ring-teal-500">
                  {API_ENDPOINTS.map((ep) => (<option key={ep.path} value={ep.path}>{ep.name} ({ep.path})</option>))}
                </select>
                <button type="button" onClick={handleRunSimulation} className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 motion-safe:transition-all shadow-md shrink-0 cursor-pointer active:scale-95">
                  <Play size={14} /><span>Send Request</span>
                </button>
              </div>
            </div>
          </div>

          {simulationResult && (
            <div className="space-y-2 animate-in fade-in motion-safe:duration-150">
              <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${simulationResult.status === 200 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : simulationResult.status === 429 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                    HTTP {simulationResult.status} {simulationResult.status === 200 ? 'OK' : simulationResult.status === 429 ? 'RATE LIMITED' : 'REJECTED'}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{simulationResult.latencyMs}ms</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {(['response', 'curl', 'headers'] as const).map((tab) => (
                    <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${activeTab === tab ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>
                      {tab === 'response' ? 'Response Body' : tab === 'curl' ? 'cURL Command' : 'Request Headers'}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === 'response' && (
                <div className="relative">
                  <button type="button" onClick={() => copy(JSON.stringify(simulationResult.responsePayload, null, 2), false)} className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1 cursor-pointer">
                    {copiedPayload ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}<span>{copiedPayload ? 'Copied' : 'Copy'}</span>
                  </button>
                  <pre className="p-4 rounded-2xl border border-indigo-500/20 bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto max-h-52">{JSON.stringify(simulationResult.responsePayload, null, 2)}</pre>
                </div>
              )}
              {activeTab === 'curl' && (
                <div className="relative">
                  <button type="button" onClick={() => copy(simulationResult.curlCommand ?? '', true)} className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1 cursor-pointer">
                    {copiedCurl ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}<span>{copiedCurl ? 'Copied' : 'Copy'}</span>
                  </button>
                  <pre className="p-4 rounded-2xl border border-indigo-500/20 bg-slate-950 text-teal-300 text-xs font-mono overflow-x-auto max-h-52 whitespace-pre-wrap">{simulationResult.curlCommand}</pre>
                </div>
              )}
              {activeTab === 'headers' && (
                <pre className="p-4 rounded-2xl border border-indigo-500/20 bg-slate-950 text-slate-300 text-xs font-mono overflow-x-auto max-h-52">{JSON.stringify(simulationResult.requestHeaders, null, 2)}</pre>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-indigo-500/20 bg-[#060818]/95 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">Enforced by <code className="text-teal-400">PlatformZeroTrustGatekeeper</code> at API gateway edge.</p>
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800 cursor-pointer">Close</button>
        </div>
      </div>
    </div>
  );
};
export default SuperadminIntegrationsOverviewApiGuardSimulatorModal;
