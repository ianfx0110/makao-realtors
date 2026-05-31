import React from "react";
import { User } from "../../types";

interface StaffSettingsPageProps {
  currentUser: User;
  profileName: string;
  setProfileName: (val: string) => void;
  profileEmail: string;
  setProfileEmail: (val: string) => void;
  updatingProfile: boolean;
  onUpdateProfile: (e: React.FormEvent) => void;
  currentPassword: string;
  setCurrentPassword: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  updatingPassword: boolean;
  onUpdatePassword: (e: React.FormEvent) => void;
}

export default function StaffSettingsPage({
  currentUser,
  profileName,
  setProfileName,
  profileEmail,
  setProfileEmail,
  updatingProfile,
  onUpdateProfile,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  updatingPassword,
  onUpdatePassword
}: StaffSettingsPageProps) {
  return (
    <div className="space-y-6 max-w-2xl font-sans text-xs">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-serif font-bold text-gray-850 text-sm mb-4 uppercase tracking-wide text-[#1B6B3A]">Staff Profile Coordinates</h3>
          <form onSubmit={onUpdateProfile} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 font-mono">My Account Name</label>
              <input
                type="text"
                required
                className="w-full text-xs border p-2.5 bg-white rounded-sm"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 font-mono">Professional Email Address</label>
              <input
                type="email"
                required
                className="w-full text-xs border p-2.5 bg-white rounded-sm"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 font-mono">Operational Safaricom ID Key</label>
              <input
                type="text"
                className="w-full text-xs border p-2.5 bg-slate-50 text-gray-500 font-mono disabled rounded-sm"
                readOnly
                value={currentUser.phone}
              />
            </div>
            <button
              type="submit"
              disabled={updatingProfile}
              className="w-full py-2.5 bg-[#1B6B3A] text-white hover:bg-[#0D4F2B] rounded text-xs uppercase font-extrabold cursor-pointer"
            >
              {updatingProfile ? "Updating..." : "Save Staff Profile"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-serif font-bold text-gray-850 text-sm mb-4 uppercase tracking-wide text-amber-700">Change Staff PIN</h3>
          <form onSubmit={onUpdatePassword} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 font-mono">Current PIN</label>
              <input
                type="password"
                required
                placeholder="Enter current PIN"
                className="w-full text-xs border p-2.5 bg-white rounded-sm"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 font-mono">New PIN Access Code</label>
              <input
                type="password"
                required
                placeholder="Minimum 8 characters"
                className="w-full text-xs border p-2.5 bg-white rounded-sm"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={updatingPassword}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs uppercase font-extrabold cursor-pointer"
            >
              {updatingPassword ? "Changing..." : "Change PIN Code"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
