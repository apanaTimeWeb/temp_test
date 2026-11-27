'use client';

// RESPONSIBILITY: AdminSettingsProfileSubscriptionPanel component owned by admin_settings/settings_profile.

import { ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION } from '@/app/frontend_admin/admin_settings/settings_profile/config/admin_settings_profile.demo_data';
import {
  Armchair,
  Building2,
  CheckCircle2,
  Clock,
  Crown,
  FileText,
  Layers,
  MessageSquare,
  ShieldCheck,
  Users,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminSettingsProfileSubscriptionPanel() {
  const { quotas } = ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION;

  return (
    <div className="space-y-6" data-testid="admin-superadmin-plan-section">
      <section
        className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8"
        aria-labelledby="superadmin-saas-plan-title"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary-subtle blur-2xl" aria-hidden="true" />

        <div className="relative flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary shadow-card">
              <Crown size={24} strokeWidth={2.2} aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-micro font-bold uppercase tracking-wider text-primary bg-primary-subtle border border-border-focus px-2.5 py-0.5 rounded-full">
                  SuperAdmin SaaS License
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-success bg-success-bg px-2.5 py-0.5 text-xs font-semibold text-success-text">
                  <span className="h-1.5 w-1.5 rounded-full bg-success motion-safe:animate-pulse" />
                  Active Plan • Auto-Renew Enabled
                </span>
              </div>
              <h2 id="superadmin-saas-plan-title" className="text-xl sm:text-2xl font-extrabold text-text-primary">
                {ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.planName}
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary">
                Issued by <strong className="text-primary font-semibold">{ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.provider}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-1 shrink-0 rounded-xl bg-surface-highlight border border-border p-3.5">
            <span className="text-xs text-text-secondary font-medium">Subscription Fee</span>
            <span className="text-lg sm:text-xl font-extrabold text-text-primary font-mono">
              {ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.priceFormatted}
            </span>
            <span className="text-micro font-medium text-warning-text flex items-center gap-1">
              <Clock size={12} aria-hidden="true" /> Valid till {ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.expiryDate} ({ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.daysRemaining} days left)
            </span>
          </div>
        </div>

        <div className="relative mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-surface-highlight p-3.5 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary-subtle text-primary flex items-center justify-center shrink-0">
              <ShieldCheck size={18} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-micro text-text-secondary uppercase font-semibold">License Key</p>
              <p className="text-xs font-mono font-bold text-text-primary truncate">{ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.licenseKey}</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface-highlight p-3.5 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-success-bg text-success-text flex items-center justify-center shrink-0">
              <CheckCircle2 size={18} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-micro text-text-secondary uppercase font-semibold">SLA Guarantee</p>
              <p className="text-xs font-semibold text-text-primary truncate">{ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.slaUptime}</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface-highlight p-3.5 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-purple-bg text-purple flex items-center justify-center shrink-0">
              <Zap size={18} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-micro text-text-secondary uppercase font-semibold">Billing Mode</p>
              <p className="text-xs font-semibold text-text-primary truncate">{ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.billingCycle} • Active</p>
            </div>
          </div>
        </div>

        <div className="relative mt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3 flex items-center gap-2">
            <Layers size={14} className="text-primary" aria-hidden="true" />
            Resource Usage & Quotas
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {[
              { label: 'Branch Licenses', Icon: Building2, used: quotas.branches.used, total: quotas.branches.total, note: '2 branch slots available', fmt: `${quotas.branches.used}/${quotas.branches.total}`, accent: 'text-primary' },
              { label: 'Total Seats Allotted', Icon: Armchair, used: quotas.seats.used, total: quotas.seats.total, note: '120 seats headroom', fmt: `${quotas.seats.used}/${quotas.seats.total}`, accent: 'text-info-text' },
              { label: 'WhatsApp / SMS API', Icon: MessageSquare, used: quotas.messages.used, total: quotas.messages.total, note: '1,550 messages remaining', fmt: `${quotas.messages.used.toLocaleString()}/${quotas.messages.total.toLocaleString()}`, accent: 'text-success-text' },
              { label: 'Staff & Managers', Icon: Users, used: quotas.staff.used, total: quotas.staff.total, note: '8 account slots open', fmt: `${quotas.staff.used}/${quotas.staff.total}`, accent: 'text-purple' },
            ].map((q) => (
              <div key={q.label} className="rounded-xl border border-border bg-surface-highlight p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-text-secondary font-medium flex items-center gap-1.5">
                      <q.Icon size={13} className={q.accent} aria-hidden="true" /> {q.label}
                    </span>
                    <span className="font-bold text-text-primary font-mono">{q.fmt}</span>
                  </div>
                  <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(q.used / q.total) * 100}%` }} />
                  </div>
                </div>
                <p className="text-micro text-text-secondary mt-2">{q.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-6 pt-5 border-t border-border">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-warning-text" aria-hidden="true" />
            Included Platform Capabilities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION.features.slice(0, 4).map((feat) => (
              <div key={feat} className="flex items-center gap-2 text-xs text-text-secondary bg-surface-highlight border border-border rounded-lg px-3 py-2">
                <CheckCircle2 size={14} className="text-success-text shrink-0" aria-hidden="true" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-6 pt-5 border-t border-border flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-text-secondary">
            Manage multi-branch scaling and license renewals via SuperAdmin.
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => toast.success('Downloading SuperAdmin SaaS Invoice #INV-2026-092...', { id: 'admin-profile-download-invoice' })}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary bg-card hover:bg-surface-hover border border-border rounded-xl motion-safe:transition-colors cursor-pointer shadow-card"
            >
              <FileText size={14} aria-hidden="true" />
              <span>Download Invoice</span>
            </button>
            <button
              type="button"
              onClick={() => toast.success('Upgrade request sent to SuperAdmin! Our team will contact you shortly.', { id: 'admin-profile-upgrade-request' })}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-on-primary bg-primary hover:bg-primary-hover rounded-xl shadow-card motion-safe:transition-colors cursor-pointer"
            >
              <Crown size={14} aria-hidden="true" />
              <span>Contact SuperAdmin to Upgrade</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
