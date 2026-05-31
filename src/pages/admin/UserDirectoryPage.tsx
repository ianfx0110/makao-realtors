import React from "react";
import { User } from "../../types";

interface UserDirectoryPageProps {
  users: User[];
  userFilter: string;
  setUserFilter: (filter: string) => void;
  showStaffForm: boolean;
  setShowStaffForm: (show: boolean) => void;
  suspendingUserId: string | null;
  onToggleUserStatus: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  staffName: string;
  setStaffName: (val: string) => void;
  staffPhone: string;
  setStaffPhone: (val: string) => void;
  staffEmail: string;
  setStaffEmail: (val: string) => void;
  staffPassword: string;
  setStaffPassword: (val: string) => void;
  staffRole: string;
  setStaffRole: (val: string) => void;
  showStaffPassword: boolean;
  setShowStaffPassword: (show: boolean) => void;
  submittingStaff: boolean;
  onStaffSubmit: (e: React.FormEvent) => void;
}

export default function UserDirectoryPage({
  users,
  userFilter,
  setUserFilter,
  showStaffForm,
  setShowStaffForm,
  suspendingUserId,
  onToggleUserStatus,
  onDeleteUser,
  staffName,
  setStaffName,
  staffPhone,
  setStaffPhone,
  staffEmail,
  setStaffEmail,
  staffPassword,
  setStaffPassword,
  staffRole,
  setStaffRole,
  showStaffPassword,
  setShowStaffPassword,
  submittingStaff,
  onStaffSubmit
}: UserDirectoryPageProps) {
  const filteredUsers = users.filter((u) => {
    if (userFilter === "all") return true;
    return u.role === userFilter;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="flex flex-wrap gap-2">
          {["all", "admin", "staff", "landlord", "seller", "renter", "buyer"].map((role) => (
            <button
              type="button"
              key={role}
              onClick={() => setUserFilter(role)}
              className={`px-3 py-1 text-xs border rounded cursor-pointer uppercase font-mono ${
                userFilter === role ? "bg-[#1B6B3A] border-[#1B6B3A] text-white font-bold" : "border-gray-200 hover:bg-slate-50 text-slate-600"
              }`}
            >
              {role === "all" ? "All profiles" : role}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowStaffForm(!showStaffForm)}
          className="bg-[#1B6B3A] text-white px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:bg-[#0D4F2B]"
        >
          {showStaffForm ? "Hide Staff Form" : "+ Create staff / admin"}
        </button>
      </div>

      {showStaffForm && (
        <form onSubmit={onStaffSubmit} className="p-5 bg-slate-50 rounded-xl border border-gray-150 space-y-4">
          <h4 className="text-xs font-bold text-[#1B6B3A] uppercase font-mono tracking-wider">Register Admin/Staff Credentials</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Full Named Professional</label>
              <input
                type="text"
                required
                className="w-full text-xs p-2.5 border rounded-lg focus:outline-none bg-white"
                placeholder="e.g. Kipchoge Keino"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Kenyan Safaricom Phone</label>
              <input
                type="text"
                required
                className="w-full text-xs p-2.5 border rounded-lg focus:outline-none bg-white font-mono"
                placeholder="e.g. 0712345678"
                value={staffPhone}
                onChange={(e) => setStaffPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Email Coordinates</label>
              <input
                type="email"
                required
                className="w-full text-xs p-2.5 border rounded-lg focus:outline-none bg-white"
                placeholder="e.g. kip@makao.co.ke"
                value={staffEmail}
                onChange={(e) => setStaffEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Role Allocation</label>
              <select
                className="w-full text-xs p-2.5 border rounded-lg focus:outline-none bg-white font-mono"
                value={staffRole}
                onChange={(e) => setStaffRole(e.target.value)}
              >
                <option value="staff">Staff Intern</option>
                <option value="admin">Admin Overseer</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Access PIN Password</label>
              <div className="relative">
                <input
                  type={showStaffPassword ? "text" : "password"}
                  required
                  className="w-full text-xs p-2.5 pr-10 border rounded-lg focus:outline-none bg-white font-mono"
                  placeholder="Min 8 characters"
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowStaffPassword(!showStaffPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer text-[10px] font-bold"
                >
                  {showStaffPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 text-xs pt-2">
            <button
              type="button"
              onClick={() => setShowStaffForm(false)}
              className="py-2 px-4 border rounded-lg font-bold text-[#718096] bg-transparent hover:bg-slate-100 uppercase cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingStaff}
              className="py-2 px-5 bg-[#1B6B3A] text-white hover:bg-[#0D4F2B] font-bold rounded-lg uppercase tracking-wider shadow-xs transition-all cursor-pointer"
            >
              Save Credentials
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto border rounded-xl bg-white shadow-2xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-[#F7F9F7] border-b border-gray-150">
            <tr className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono">
              <th className="p-4">User Name</th>
              <th className="p-4">Safaricom Line</th>
              <th className="p-4">Email Details</th>
              <th className="p-4">Authority Role</th>
              <th className="p-4">Durable Status</th>
              <th className="p-4">Join Date</th>
              <th className="p-4 text-right">Moderations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-gray-900">{u.name}</td>
                <td className="p-4 font-semibold font-mono text-[#1B6B3A]">{u.phone}</td>
                <td className="p-4 text-slate-600 font-mono">{u.email || "-"}</td>
                <td className="p-4">
                  <span className="font-bold text-[9px] uppercase tracking-widest font-mono text-amber-850 px-2 py-0.5 rounded border border-amber-150 bg-amber-50">
                    {u.role}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border ${
                      u.status === "active" ? "bg-green-100 border-green-300 text-green-700" : "bg-red-100 border-red-300 text-red-700"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="p-4 text-gray-450 font-mono">{u.joinedDate || "N/A"}</td>
                <td className="p-4 text-right space-x-1 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onToggleUserStatus(u)}
                    disabled={suspendingUserId === u.id}
                    className="p-1 px-2.5 bg-slate-50 border border-gray-250 hover:bg-slate-100 text-[#718096] rounded text-[10px] font-bold uppercase cursor-pointer"
                  >
                    {suspendingUserId === u.id ? "Working..." : u.status === "suspended" ? "Reactivate" : "Suspend"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteUser(u.id)}
                    className="p-1 px-2.5 bg-red-50 hover:bg-red-650 hover:text-white text-red-600 rounded border border-red-200 text-[10px] font-bold uppercase cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
