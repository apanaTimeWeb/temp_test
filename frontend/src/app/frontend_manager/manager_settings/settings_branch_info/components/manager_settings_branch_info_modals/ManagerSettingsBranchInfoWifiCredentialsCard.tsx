'use client';

import { Check, Copy, Edit3, Eye, EyeOff, Radio } from 'lucide-react';
import React from 'react';

interface ManagerSettingsBranchInfoWifiCredentialsCardProps {
  ssid: string;
  setSsid: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  security: 'WPA' | 'WEP' | 'nopass';
  setSecurity: (val: 'WPA' | 'WEP' | 'nopass') => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  copiedKey: string | null;
  onCopy: (text: string, label: string, key: string) => void;
  onSaveEdit: (e: React.FormEvent) => void;
  onResetEdit: () => void;
}

/** Active Wi-Fi credential inspection and inline credential editor panel for standee modal. */
export function ManagerSettingsBranchInfoWifiCredentialsCard({
  ssid,
  setSsid,
  password,
  setPassword,
  security,
  setSecurity,
  showPassword,
  setShowPassword,
  isEditing,
  setIsEditing,
  copiedKey,
  onCopy,
  onSaveEdit,
  onResetEdit,
}: ManagerSettingsBranchInfoWifiCredentialsCardProps) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-3.5 space-y-2.5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
          <Radio size={13} className="text-amber-400" />
          <span>Active Wi-Fi Credentials</span>
        </span>
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
        >
          <Edit3 size={11} />
          <span>{isEditing ? 'Cancel Edit' : 'Edit Credentials'}</span>
        </button>
      </div>

      {!isEditing ? (
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800 border border-slate-700">
            <div>
              <span className="text-[10px] text-slate-400 block">Network Name (SSID)</span>
              <span className="font-mono font-bold text-amber-300 text-xs">{ssid}</span>
            </div>
            <button
              type="button"
              onClick={() => onCopy(ssid, 'Network Name', 'modal_ssid')}
              className="p-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white motion-safe:transition-colors cursor-pointer"
              title="Copy SSID"
            >
              {copiedKey === 'modal_ssid' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800 border border-slate-700">
            <div>
              <span className="text-[10px] text-slate-400 block">Wi-Fi Password</span>
              <span className="font-mono font-bold text-white text-xs">
                {showPassword ? password : '••••••••••••'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white motion-safe:transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button
                type="button"
                onClick={() => onCopy(password, 'Wi-Fi Password', 'modal_pwd')}
                className="p-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white motion-safe:transition-colors cursor-pointer"
                title="Copy Password"
              >
                {copiedKey === 'modal_pwd' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Security: <strong className="text-slate-200">{security}</strong></span>
            <span>Frequency: <strong className="text-slate-200">5 GHz &amp; 2.4 GHz</strong></span>
          </div>
        </div>
      ) : (
        <form onSubmit={onSaveEdit} className="space-y-3 pt-1">
          <div>
            <label className="text-[10px] text-slate-300 font-semibold block mb-1">
              Network Name (SSID) *
            </label>
            <input
              maxLength={30}
              type="text"
              value={ssid}
              onChange={(e) => setSsid(e.target.value)}
              className="w-full text-xs px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-hidden focus:border-amber-400 font-mono"
              placeholder="e.g. SmartLibrary_Student_5G"
              required
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-300 font-semibold block mb-1">
              Wi-Fi Password
            </label>
            <input
              maxLength={100}
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-hidden focus:border-amber-400 font-mono"
              placeholder="Leave blank for open network"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-300 font-semibold block mb-1">
              Security Encryption
            </label>
            <select
              value={security}
              onChange={(e) => setSecurity(e.target.value as 'WPA' | 'WEP' | 'nopass')}
              className="w-full text-xs px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-hidden focus:border-amber-400"
            >
              <option value="WPA">WPA / WPA2 / WPA3 (Recommended)</option>
              <option value="WEP">WEP</option>
              <option value="nopass">None (Open Network)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onResetEdit}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 text-white text-xs font-bold cursor-pointer shadow-md motion-safe:transition-all"
            >
              Apply &amp; Update QR
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
