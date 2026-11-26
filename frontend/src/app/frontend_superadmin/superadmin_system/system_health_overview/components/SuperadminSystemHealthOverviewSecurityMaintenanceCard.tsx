'use client';
/**
 * Responsibility: Render Security Alerts, Scheduled Maintenance, Database/Storage Capacity, and Webhook/Delivery health telemetry.
 * Flow: System Health Dashboard -> SuperadminSystemHealthOverviewSecurityMaintenanceCard -> real-time metrics and alerts.
 */
import { ShieldCheck, ShieldAlert, Calendar, HardDrive, Database, Webhook, Mail, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export function SuperadminSystemHealthOverviewSecurityMaintenanceCard() {
  return (
    <section
      aria-labelledby="security-maintenance-heading"
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
    >
      {/* Security Alerts & Firewall Telemetry */}
      <div className="rounded-2xl border border-rose-500/25 bg-gradient-to-br from-rose-950/30 via-[#0a0d26] to-[#070914] p-5 sm:p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
                <ShieldCheck size={18} aria-hidden="true" />
              </div>
              <div>
                <h2 id="security-maintenance-heading" className="text-sm font-bold text-slate-100">
                  Security Defense & Edge Threat Telemetry
                </h2>
                <span className="text-[11px] text-slate-400">WAF, DDoS Shield & SSL/TLS Verification</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
              Threat Level: Nominal
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">WAF Blocked Probes (24H)</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-slate-100 font-mono">1,428</span>
                <span className="text-[10px] text-emerald-400 font-mono">0 breaches</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">Brute-Force Lockouts</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-slate-100 font-mono">0 Active</span>
                <span className="text-[10px] text-slate-400 font-mono">Rate-limited</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">SSL Wildcard Certificate</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-bold text-emerald-400 font-mono">Valid (284 Days)</span>
              </div>
              <span className="text-[10px] text-slate-500">Auto-renewal enabled</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">JWT Token Anomalies</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-bold text-emerald-400 font-mono">0 Revocations</span>
              </div>
              <span className="text-[10px] text-slate-500">ECDSA signed</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Delivery Failures: <strong className="text-slate-200">Email 0.04% · SMS 0.12%</strong></span>
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={11} />
            MFA Enforced
          </span>
        </div>
      </div>

      {/* Scheduled Maintenance & Storage Availability */}
      <div className="rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-950/30 via-[#0a0d26] to-[#070914] p-5 sm:p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <Calendar size={18} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-100">
                  Scheduled Maintenance & Storage Capacity
                </h2>
                <span className="text-[11px] text-slate-400">Next Service Window & Multi-Cloud Volume Caps</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center gap-1">
              <Clock size={10} />
              Planned Window: Sun 02:00 UTC
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-400">PostgreSQL Disk</span>
                <span className="font-bold text-slate-200 font-mono">42.8%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden mb-1">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-400" style={{ width: '42.8%' }} />
              </div>
              <span className="text-[10px] text-slate-500 font-mono">42.8 GB of 100 GB used</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-400">S3 Document Storage</span>
                <span className="font-bold text-slate-200 font-mono">32.0%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden mb-1">
                <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-400" style={{ width: '32.0%' }} />
              </div>
              <span className="text-[10px] text-slate-500 font-mono">640 GB of 2 TB allocated</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">Automated Daily Backup</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-bold text-emerald-400 font-mono">2h ago (02:00 UTC)</span>
              </div>
              <span className="text-[10px] text-slate-500">SHA-256 Verified · 100% Retained</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">Payment Webhook Ingress</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-bold text-emerald-400 font-mono">100% Processed</span>
              </div>
              <span className="text-[10px] text-slate-500">Razorpay & Stripe (0 queued)</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Planned Downtime: <strong className="text-amber-300">30 Mins (Zero Data Loss)</strong></span>
          <span className="text-slate-300">Bypass Token: <code className="text-[10px] bg-slate-800 px-1 py-0.5 rounded text-amber-300 font-mono">Active</code></span>
        </div>
      </div>
    </section>
  );
}
