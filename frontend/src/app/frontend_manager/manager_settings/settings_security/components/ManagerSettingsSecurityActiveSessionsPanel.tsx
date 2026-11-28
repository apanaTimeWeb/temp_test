'use client';

import { ButtonLoader } from '@/app/frontend_manager/components/ManagerLoader';
import {
AlertTriangle,
CheckCircle2,
Clock,
Globe,
Laptop,
LogOut,
MapPin,
Monitor,
Smartphone,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import type { ManagerActiveSession } from '@/app/frontend_manager/manager_settings/settings_security/types/ManagerSettingsSecurityTypes';

interface ManagerSettingsSecurityActiveSessionsPanelProps {
  sessions: ManagerActiveSession[];
  onRevokeSession: (sessionId: string) => void;
  onLogoutAllOtherSessions: () => void;
}

export function ManagerSettingsSecurityActiveSessionsPanel({
  sessions,
  onRevokeSession,
  onLogoutAllOtherSessions,
}: ManagerSettingsSecurityActiveSessionsPanelProps) {
  const [showLogoutAllModal, setShowLogoutAllModal] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const revokeTimerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (revokeTimerRef.current !== null) window.clearTimeout(revokeTimerRef.current);
  }, []);

  const getDeviceIcon = (session: ManagerActiveSession) => {
    if (session.deviceType === 'mobile') {
      return <Smartphone size={18} className="text-amber-400" />;
    }
    if (session.device.toLowerCase().includes('macbook') || session.device.toLowerCase().includes('laptop')) {
      return <Laptop size={18} className="text-indigo-400" />;
    }
    return <Monitor size={18} className="text-cyan-400" />;
  };

  const handleRevoke = (id: string, deviceName: string) => {
    setRevokingId(id);
    if (revokeTimerRef.current !== null) window.clearTimeout(revokeTimerRef.current);
    revokeTimerRef.current = window.setTimeout(() => {
      revokeTimerRef.current = null;
      onRevokeSession(id);
      setRevokingId(null);
      toast.success(`Session ended for ${deviceName}`, { id: `revoke-session-${id}` });
    }, 250);
  };

  const handleConfirmLogoutAll = () => {
    onLogoutAllOtherSessions();
    setShowLogoutAllModal(false);
    toast.success('All other devices have been logged out.', { id: 'logout-all-sessions' });
  };

  const otherSessionsCount = sessions.filter((s) => !s.isCurrent).length;

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Monitor size={18} className="text-amber-400" />
            <span>Active Signed-In Devices ({sessions.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Devices currently authorized to access your manager account.
          </p>
        </div>

        {otherSessionsCount > 0 && (
          <button
            type="button"
            onClick={() => setShowLogoutAllModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 motion-safe:transition-all cursor-pointer self-start sm:self-auto shrink-0"
          >
            <LogOut size={13} />
            <span>Log Out All Other Devices ({otherSessionsCount})</span>
          </button>
        )}
      </div>

      {/* Responsive Session Cards */}
      <div className="grid grid-cols-1 gap-2.5">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`rounded-xl border p-3.5 sm:p-4 motion-safe:transition-all ${
              session.isCurrent
                ? 'border-emerald-500/30 bg-emerald-500/5 shadow-xs'
                : 'mgr-sec-session-card'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Left Details */}
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    session.isCurrent
                      ? 'bg-emerald-500/15 border border-emerald-500/30'
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  {getDeviceIcon(session)}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {session.device}
                    </span>
                    {session.isCurrent ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.2 text-[10px] font-bold text-emerald-300">
                        <CheckCircle2 size={10} />
                        Current Device
                      </span>
                    ) : (
                      <span className="rounded-full bg-white/5 px-2 py-0.2 text-[10px] text-slate-400">
                        Remote Session
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-400">
                    <span className="text-slate-300">{session.browser} • {session.os}</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                      <Globe size={11} className="text-slate-500" />
                      {session.ip}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={11} className="text-slate-500" />
                      {session.location}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 text-amber-400/90 font-medium">
                      <Clock size={11} />
                      {session.lastActive}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Action */}
              <div className="self-end sm:self-center shrink-0">
                {session.isCurrent ? (
                  <span className="text-[11px] font-semibold text-emerald-400 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                    Online Now
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRevoke(session.id, session.device)}
                    disabled={revokingId === session.id}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 motion-safe:transition-all cursor-pointer disabled:opacity-50"
                  >
                    {revokingId === session.id ? <ButtonLoader icon="key-round" /> : <LogOut size={12} />}
                    <span>{revokingId === session.id ? 'Revoking...' : 'Revoke Session'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Log Out All Modal */}
      {showLogoutAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop backdrop-blur-xs p-4">
          <div className="mgr-sec-modal-surface w-full max-w-sm rounded-xl border p-5 space-y-4 shadow-xl">
            <div className="flex items-center gap-2.5 text-rose-400">
              <AlertTriangle size={20} />
              <h4 className="text-sm font-bold text-white">Log out all other devices?</h4>
            </div>
            <p className="text-xs text-slate-300">
              This will immediately sign out all other devices except this current session. Continue?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutAllModal(false)}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogoutAll}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white"
              >
                Yes, Terminate Other Sessions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
