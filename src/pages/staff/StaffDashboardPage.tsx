import React from "react";
import { User, ConnectionRequest } from "../../types";

interface StaffDashboardPageProps {
  currentUser: User;
  connections: ConnectionRequest[];
  onApproveConnection: (id: string) => void;
  onRejectConnection: (id: string) => void;
}

export default function StaffDashboardPage({
  currentUser,
  connections,
  onApproveConnection,
  onRejectConnection
}: StaffDashboardPageProps) {
  const pending = connections.filter((c) => c.status === "pending");

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-850">
        <h3 className="font-serif text-lg font-bold text-amber-500">Jambo, {currentUser.name}!</h3>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          Welcome to the Makao Realtors Agent Assist Desk. Your primary role is to verify Lipa Na M-PESA connection payments and securely reveal landlord contact information to renters or buyers.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <h4 className="font-serif font-black text-xs uppercase tracking-wider text-gray-800">Operational Queue ({pending.length} pending reviews)</h4>
          <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold uppercase">
            ACTIVE ASSIST
          </span>
        </div>

        <div className="space-y-4">
          {pending.length === 0 ? (
            <p className="text-xs text-slate-400 p-8 text-center bg-slate-50/50 rounded-lg">
              Wonderful! Your review queue is completely empty. All connection parameters settled.
            </p>
          ) : (
            pending.map((c) => (
              <div key={c.id} className="p-4 bg-slate-50 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div>
                  <p className="font-bold text-gray-900 leading-snug">Renter {c.renterName} wants to connect to property {c.propertyName}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-slate-500 text-[10px]">
                    <span>📞 Phone: <b className="font-mono">{c.renterPhone}</b></span>
                    <span>💰 Amount: <b className="text-emerald-850 font-bold">KES {c.price.toLocaleString()}</b></span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onRejectConnection(c.id)}
                    className="py-1.5 px-3 rounded bg-red-50 hover:bg-red-600 text-red-650 hover:text-white border border-red-200 text-[10px] font-bold uppercase transition-all cursor-pointer"
                  >
                    Reject payment
                  </button>
                  <button
                    type="button"
                    onClick={() => onApproveConnection(c.id)}
                    className="py-1.5 px-3 rounded bg-[#1B6B3A] hover:bg-[#0D4F2B] text-white shadow-3xs text-[10px] font-bold uppercase transition-all cursor-pointer"
                  >
                    Approve and Reveal
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
