/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

export default function SettingsPage() {
  const [allowNotifications, setAllowNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const [dataSync, setDataSync] = useState(true);
  const [retentionLevel, setRetentionLevel] = useState('7 Years (Standard Retention)');

  const handleClearCache = () => {
    alert("Local workspace data cleared successfully. Your care profile will refresh on the next sync.");
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Clinical preferences saved successfully.");
  };

  return (
    <div className="space-y-6 text-left max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-[#c6c6cd] shadow-sm">
      {/* Settings Header */}
      <div className="border-b border-[#c6c6cd] pb-4">
        <h2 className="text-2xl font-bold text-[#0b1c30] tracking-tight">Care Preferences</h2>
        <p className="text-xs text-[#45464d] mt-1">Manage alerts, sign-in protection, data sharing, and record retention preferences.</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Toggle 1: Notifications */}
        <div className="flex items-center justify-between pb-4 border-b border-[#c6c6cd]">
          <div>
            <h3 className="text-sm font-bold text-[#0b1c30]">Emergency Alerts</h3>
            <p className="text-[11px] text-[#45464d] mt-0.5">Toggle push alerts regarding ICU admissions overflow or critical telemetry drops.</p>
          </div>
          <button
            type="button"
            onClick={() => setAllowNotifications(!allowNotifications)}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              allowNotifications ? 'bg-[#0051d5]' : 'bg-[#76777d]'
            }`}
          >
            <span className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
              allowNotifications ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Toggle 2: Two Factor */}
        <div className="flex items-center justify-between pb-4 border-b border-[#c6c6cd]">
          <div>
            <h3 className="text-sm font-bold text-[#0b1c30]">Two-Factor Authorization (2FA)</h3>
            <p className="text-[11px] text-[#45464d] mt-0.5">Mandated for off-campus networks accessing EHR patient data clusters.</p>
          </div>
          <button
            type="button"
            onClick={() => setTwoFactor(!twoFactor)}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              twoFactor ? 'bg-[#0051d5]' : 'bg-[#76777d]'
            }`}
          >
            <span className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
              twoFactor ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Toggle 3: Data Sync */}
        <div className="flex items-center justify-between pb-4 border-b border-[#c6c6cd]">
          <div>
            <h3 className="text-sm font-bold text-[#0b1c30]">Durable State Synchronization</h3>
            <p className="text-[11px] text-[#45464d] mt-0.5">Keep recent care information available when connectivity is unstable.</p>
          </div>
          <button
            type="button"
            onClick={() => setDataSync(!dataSync)}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              dataSync ? 'bg-[#0051d5]' : 'bg-[#76777d]'
            }`}
          >
            <span className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
              dataSync ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Selection Retention */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#45464d] uppercase block">Record Audit Retention Level</label>
          <select
            value={retentionLevel}
            onChange={(e) => setRetentionLevel(e.target.value)}
            className="w-full text-xs h-10 p-2 border border-[#c6c6cd] rounded-lg focus:ring-2 focus:ring-[#0051d5] bg-[#f8f9ff]"
          >
            <option>7 Years (Standard Retention)</option>
            <option>10 Years (Extended Case Studies)</option>
            <option>Indefinite Retention (Lifetime Care Archive)</option>
          </select>
          <p className="text-[10px] text-[#76777d] mt-1 font-semibold">Retention choices determine how long clinical history remains available.</p>
        </div>

        {/* Clear local workspace data */}
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-3">
          <h4 className="text-xs font-bold text-red-900 uppercase">Emergency Safety Zone</h4>
          <p className="text-[11px] text-red-800 leading-normal">
            Clearing local workspace data signs out active sessions and refreshes saved care information. Use this on shared devices.
          </p>
          <button
            type="button"
            onClick={handleClearCache}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-xs cursor-pointer transition-colors"
          >
            Clear Local Workspace
          </button>
        </div>

        {/* Confirm */}
        <div className="pt-4 flex justify-end gap-2 border-t border-[#c6c6cd]">
          <button
            type="button"
            className="px-4 py-2 bg-white hover:bg-[#eff4ff] border border-[#c6c6cd] text-xs font-bold rounded-lg cursor-pointer text-[#45464d]"
            onClick={() => alert("Discarding preference changes...")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-[#0051d5] text-white hover:bg-[#00174b] text-xs font-bold rounded-lg cursor-pointer transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
