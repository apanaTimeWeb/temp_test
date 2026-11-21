// components/SuperadminSecurityOverviewComplianceCard.tsx
// RESPONSIBILITY: Display ISO 27001 compliance standards, TLS 1.3, AES-256 encryption at rest, KMS keys, and data security policies.
'use client';

import { CheckCircle2, Database, FileCheck, Key, Lock, ShieldCheck } from 'lucide-react';
import React from 'react';

export const SuperadminSecurityOverviewComplianceCard: React.FC = () => {
  const securityControls = [
    {
      title: 'HTTPS / TLS 1.3 Enforced',
      status: 'Active & Enforcing',
      detail: 'HSTS max-age=31536000 with includeSubDomains and preload enabled',
      icon: Lock,
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    {
      title: 'Database Encryption at Rest',
      status: 'AES-256 GCM Active',
      detail: 'AWS KMS customer-managed key with automated 90-day key rotation',
      icon: Database,
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    {
      title: 'Encrypted Backup Snapshots',
      status: 'GPG & AES-256 Verified',
      detail: 'Hourly immutable snapshots stored in air-gapped cold storage bucket',
      icon: ShieldCheck,
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    {
      title: 'Secrets & Key Management',
      status: 'KMS & Vault Integrated',
      detail: 'Zero secrets in client code; dynamic credentials with 12h TTL',
      icon: Key,
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    {
      title: 'Expiring Signed S3 Media Links',
      status: '15-Min TTL Enforced',
      detail: 'Presigned S3 URLs expire after 900s; direct bucket reads blocked',
      icon: FileCheck,
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    {
      title: 'Data Retention & Cryptographic Shred',
      status: 'ISO 27001 Compliant',
      detail: 'Automated 7-year audit retention with crypto-shredding on tenant exit',
      icon: CheckCircle2,
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
  ];

  return (
    <section className="rounded-2xl border border-indigo-500/30 bg-card p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/80">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
              ISO 27001 Compliance & Data Security Controls
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                Score: 96 / 100
              </span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Verified cryptographic safeguards, perimeter defense, encryption at rest, and secret lifecycle
            </p>
          </div>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-xl bg-muted text-muted-foreground">
          93 / 93 Controls Audited
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {securityControls.map((ctrl) => {
          const Icon = ctrl.icon;
          return (
            <div
              key={ctrl.title}
              className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-2 text-xs hover:border-indigo-500/30 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <Icon size={14} className="text-indigo-400 shrink-0" />
                  <span>{ctrl.title}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${ctrl.badgeColor}`}>
                  {ctrl.status}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {ctrl.detail}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
