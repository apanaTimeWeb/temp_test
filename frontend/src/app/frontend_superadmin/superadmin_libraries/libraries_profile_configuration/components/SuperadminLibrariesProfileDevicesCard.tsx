'use client';

import React from 'react';
import { Shield, Smartphone, Laptop } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function SuperadminLibrariesProfileDevicesCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Shield size={18} />
            </div>
            <div>
              <CardTitle>Two-Factor Authentication & Devices</CardTitle>
              <CardDescription>Multi-factor authentication security status and active device telemetry.</CardDescription>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Enforced
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3.5 p-4 rounded-xl border border-border/70 bg-background/50">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
              <Smartphone size={18} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-slate-200">Authenticator App (TOTP)</h4>
              <p className="text-xs text-slate-400">
                Google Authenticator or compatible RFC 6238 app configured for step-up verification.
              </p>
              <span className="inline-block mt-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Primary 2FA Method
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl border border-border/70 bg-background/50">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
              <Laptop size={18} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-slate-200">Current Active Device</h4>
              <p className="text-xs text-slate-400">
                Desktop Browser • Secure TLS 1.3 Session • IP Verification Active
              </p>
              <span className="inline-block mt-1 text-[11px] font-medium text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                Current Device
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
