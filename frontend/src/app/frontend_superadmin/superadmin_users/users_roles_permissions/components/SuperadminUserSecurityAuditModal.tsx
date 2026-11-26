'use client';

import React, { useState } from 'react';
import {
  X, ShieldAlert, KeyRound, Lock, CheckCircle2,
  Trash2, Globe, Monitor
} from 'lucide-react';
import type { UserSecurityAccount } from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/types/SuperadminRolesPermissionsManagementTypes';
import SuperadminUserSecurityControlsTab from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/components/SuperadminUserSecurityControlsTab';

interface SuperadminUserSecurityAuditModalProps {
  user: UserSecurityAccount;
  onClose: () => void;
  onToggleLock: (userId: string, reason?: string) => void;
  onTriggerPasswordReset: (userId: string) => string;
  onResetMfa: (userId: string) => void;
  onRevokeSession: (userId: string, sessionId: string) => void;
  onRevokeAllSessions: (userId: string) => void;
  onGrantTemporaryPermission: (userId: string, days: number, note: string) => void;
}

export default function SuperadminUserSecurityAuditModal({
  user,
  onClose,
  onToggleLock,
  onTriggerPasswordReset,
  onResetMfa,
  onRevokeSession,
  onRevokeAllSessions,
  onGrantTemporaryPermission,
}: SuperadminUserSecurityAuditModalProps) {
  const [activeTab, setActiveTab] = useState<'security_actions' | 'sessions' | 'login_history'>('security_actions');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-indigo-500/40 bg-[#0c0f28] p-5 sm:p-6 shadow-2xl text-white my-8 max-h-[90vh] flex flex-col">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer">
          <X size={18} />
        </button>

        {/* Profile Card Header */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-indigo-500/20 shrink-0">
          <div className={`p-3 rounded-xl border ${user.isLocked ? 'border-rose-500/40 bg-rose-500/20 text-rose-400' : 'border-indigo-500/40 bg-indigo-500/20 text-indigo-400'}`}>
            {user.isLocked ? <Lock size={22} /> : <KeyRound size={22} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{user.name}</h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${user.isLocked ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'}`}>
                {user.isLocked ? 'ACCOUNT LOCKED' : 'ACTIVE'}
              </span>
            </div>
            <p className="text-xs text-slate-400">{user.email} • {user.roleName} • Last Active: {user.lastActive}</p>
          </div>
        </div>

        {feedbackMsg && (
          <div className="my-3 p-2.5 rounded-xl border border-emerald-500/40 bg-emerald-950/60 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 size={14} className="shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-indigo-500/20 py-2.5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('security_actions')}
            className={`px-3 py-1.5 rounded-lg motion-safe:transition-all cursor-pointer ${activeTab === 'security_actions' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Security Controls
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sessions')}
            className={`px-3 py-1.5 rounded-lg motion-safe:transition-all cursor-pointer ${activeTab === 'sessions' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Active Sessions ({user.activeSessions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('login_history')}
            className={`px-3 py-1.5 rounded-lg motion-safe:transition-all cursor-pointer ${activeTab === 'login_history' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Login History ({user.loginHistory.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto my-3 flex-1 text-xs space-y-4 pr-1">
          {activeTab === 'security_actions' && (
            <SuperadminUserSecurityControlsTab
              user={user}
              onToggleLock={onToggleLock}
              onTriggerPasswordReset={onTriggerPasswordReset}
              onResetMfa={onResetMfa}
              onGrantTemporaryPermission={onGrantTemporaryPermission}
              showFeedback={showFeedback}
            />
          )}

          {activeTab === 'sessions' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-slate-400">Terminating a session revokes the JWT token immediately.</p>
                {user.activeSessions.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      onRevokeAllSessions(user.id);
                      showFeedback('All active sessions revoked.');
                    }}
                    className="inline-flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                  >
                    <Trash2 size={12} />
                    <span>Terminate All Sessions</span>
                  </button>
                )}
              </div>
              {user.activeSessions.map((session) => (
                <div key={session.sessionId} className="p-3 rounded-xl border border-indigo-500/20 bg-slate-900/40 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white flex items-center gap-2">
                      <Monitor size={14} className="text-indigo-400" />
                      {session.device} • {session.ip}
                      {session.isCurrent && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          Current Device
                        </span>
                      )}
                    </p>
                    <p className="text-slate-400 text-[11px] mt-0.5">{session.location} • Started {session.startedAt}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onRevokeSession(user.id, session.sessionId);
                      showFeedback(`Session on ${session.device} terminated.`);
                    }}
                    className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                    title="Terminate Session"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'login_history' && (
            <div className="space-y-2">
              {user.loginHistory.map((item) => (
                <div key={item.id} className="p-2.5 rounded-xl border border-indigo-500/10 bg-slate-900/30 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2.5">
                    <Globe size={14} className="text-slate-400" />
                    <div>
                      <span className="font-medium text-white">{item.ip}</span> ({item.browser})
                      <p className="text-slate-500">{item.device}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.status === 'SUCCESS'
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : 'bg-rose-500/15 text-rose-300'
                    }`}>
                      {item.status}
                    </span>
                    <p className="text-slate-400 mt-0.5">{item.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-indigo-500/20 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
