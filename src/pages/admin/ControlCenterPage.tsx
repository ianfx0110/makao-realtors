import React from "react";
import { User, Property, Payment, ConnectionRequest } from "../../types";

interface ControlCenterPageProps {
  totalUsers: number;
  activeListings: number;
  properties: Property[];
  payments: Payment[];
  connections: ConnectionRequest[];
  pendingConnections: number;
  totalRevenue: number;
  onApproveConnection: (id: string) => void;
  onRejectConnection: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function ControlCenterPage({
  totalUsers,
  activeListings,
  properties,
  payments,
  connections,
  pendingConnections,
  totalRevenue,
  onApproveConnection,
  onRejectConnection,
  setActiveTab
}: ControlCenterPageProps) {
  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 font-mono">Customer Directory</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold">{totalUsers}</span>
            <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">ONLINE</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 font-mono">Active Listings</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-[#1B6B3A]">{activeListings}</span>
            <span className="text-[11px] text-gray-500">{properties.filter((p) => p.status === "pending").length} Drafts</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 font-mono">Total Revenue</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-serif font-bold tracking-tight">KES {totalRevenue.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#F5A623] shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#F5A623]/10 rounded-full translate-x-3 -translate-y-3"></div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 font-mono">Revealing Connections</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#F5A623] font-serif">{pendingConnections}</span>
            <span className="text-[11px] text-[#F5A623] font-bold underline decoration-dotted">Staff Reviews</span>
          </div>
        </div>
      </div>

      {/* Renter/Buyer connection verification table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col min-h-0">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 font-serif text-sm">Connection Requests (Intermediary Payments Screen)</h3>
          <span className="text-[10px] bg-amber-50 text-[#F5A623] border border-amber-200 font-bold uppercase px-2.5 py-1 rounded">Awaiting Staff Approvals</span>
        </div>

        <div className="overflow-x-auto">
          {connections.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">No active connection request payments registered.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F7F9F7] border-b border-gray-200">
                <tr className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono">
                  <th className="p-4">Renter / Buyer</th>
                  <th className="p-4">Requested Listing</th>
                  <th className="p-4">Charge Fee</th>
                  <th className="p-4">M-PESA checkout ID</th>
                  <th className="p-4">Operational Status</th>
                  <th className="p-4 text-right">Verification Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {connections.map((c) => {
                  const matchingPay = payments.find((pay) => pay.id === c.paymentId);
                  return (
                    <tr key={c.id} className="hover:bg-[#F7F9F7]/40 transition-colors text-xs">
                      <td className="p-4 font-bold">
                        <div>{c.renterName}</div>
                        <div className="text-[10px] text-gray-400 normal-case font-mono">{c.renterPhone}</div>
                      </td>
                      <td className="p-4 font-medium text-slate-700">{c.propertyName}</td>
                      <td className="p-4 font-bold text-[#1B6B3A]">KES {c.price.toLocaleString()}</td>
                      <td className="p-4 text-[11px] font-mono text-slate-500">
                        {matchingPay?.checkoutRequestId || c.paymentId}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                            c.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : c.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-[#F5A623]"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {c.status === "pending" ? (
                          <>
                            <button
                              type="button"
                              onClick={() => onRejectConnection(c.id)}
                              className="py-1 px-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded border border-red-200 text-[10px] font-bold uppercase cursor-pointer transition-all"
                            >
                              Reject Refund
                            </button>
                            <button
                              type="button"
                              onClick={() => onApproveConnection(c.id)}
                              className="py-1 px-3 bg-[#1B6B3A] text-white hover:bg-[#0D4F2B] rounded shadow-xs text-[10px] font-bold uppercase cursor-pointer ml-1 transition-all"
                            >
                              Approve Reveal
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] text-gray-400 italic font-medium">Actions locked ({c.status})</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Payments Webhook ledger stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col min-h-48">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
            <h4 className="text-xs font-bold text-[#1B6B3A] flex items-center gap-2 uppercase tracking-wider font-mono">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span> M-PESA Daraja Real-time Stream
            </h4>
            <span className="text-[9px] font-bold text-gray-400 uppercase font-mono tracking-widest">LIVE Webhook Ledger</span>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto max-h-56 pr-1">
            {payments.slice(-5).reverse().map((p) => (
              <div
                key={p.id}
                className={`flex items-center gap-4 text-xs p-2.5 rounded border-l-4 ${
                  p.status === "completed"
                    ? "bg-green-50/20 border-green-500"
                    : p.status === "failed"
                    ? "bg-red-50/20 border-red-500"
                    : "bg-amber-50/20 border-amber-500"
                }`}
              >
                <span className="font-mono text-[10px] text-gray-400 shrink-0">{new Date(p.createdAt).toLocaleTimeString()}</span>
                <span className="font-bold shrink-0">KES {p.amount.toLocaleString()}</span>
                <span className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0">
                  {p.mpesaReceipt || p.checkoutRequestId.slice(-8)}
                </span>
                <span className="text-gray-600 italic truncate flex-1 normal-case">
                  {p.purpose === "listing_fee" ? "Landlord Fee" : "Reveal Fee"}: "{p.targetName}"
                </span>
                <span
                  className={`font-bold uppercase text-[10px] shrink-0 ${
                    p.status === "completed" ? "text-green-600" : p.status === "failed" ? "text-red-600" : "text-amber-600"
                  }`}
                >
                  {p.status}
                </span>
              </div>
            ))}
            {payments.length === 0 && (
              <p className="text-xs text-center text-slate-400 p-4">No payments recorded in ledger stream</p>
            )}
          </div>
        </div>

        <div className="bg-[#1A2420] rounded-xl p-6 text-white flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#F5A623] mb-2 font-mono">Broadcasting System Channel</h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Send a rapid alert notification system banner immediately to all renters, buyers, and landlords.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab("broadcast")}
            className="w-full py-3 bg-[#F5A623] hover:bg-[#d98b11] text-[#1B6B3A] font-extrabold text-xs rounded-lg uppercase tracking-wider active:scale-95 transition-all cursor-pointer"
          >
            Draft System Broadcast
          </button>
        </div>
      </div>
    </div>
  );
}
