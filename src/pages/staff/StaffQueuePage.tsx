import React from "react";
import { ConnectionRequest, Payment } from "../../types";

interface StaffQueuePageProps {
  connections: ConnectionRequest[];
  payments: Payment[];
  onApproveConnection: (id: string) => void;
  onRejectConnection: (id: string) => void;
}

export default function StaffQueuePage({
  connections,
  payments,
  onApproveConnection,
  onRejectConnection
}: StaffQueuePageProps) {
  const pending = connections.filter((c) => c.status === "pending");
  const processed = connections.filter((c) => c.status !== "pending");

  return (
    <div className="space-y-6 text-xs text-slate-800">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-serif font-bold text-sm mb-3">Pending Verification Queue ({pending.length})</h3>
        <p className="text-gray-500 mb-4">
          Review M-PESA transactions and confirm landlord detail disclosures. Double-check incoming payments before releasing landlord details to buyers or renters.
        </p>

        <div className="space-y-4">
          {pending.length === 0 ? (
            <div className="p-8 text-center text-gray-400 bg-slate-50 border rounded-lg italic">
              Verification queue cleared! Everything approved.
            </div>
          ) : (
            pending.map((c) => {
              const matchingPay = payments.find((pay) => pay.id === c.paymentId);
              return (
                <div key={c.id} className="p-4 bg-[#F7F9F7] rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900">Renter: {c.renterName} &rarr; Landlord: {c.landlordName}</h4>
                    <p className="text-gray-500 mt-1">Listing: <b className="text-[#1B6B3A]">{c.propertyName}</b></p>
                    <div className="flex gap-4 mt-2 text-[10px] font-mono text-gray-500">
                      <span>Checkout ID: {matchingPay?.checkoutRequestId || "-"}</span>
                      <span>Receipt: {matchingPay?.mpesaReceipt || "-"}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onRejectConnection(c.id)}
                      className="py-1 px-3 border border-red-300 text-red-600 hover:bg-red-50 text-[10px] uppercase font-bold rounded cursor-pointer"
                    >
                      Reject Refund
                    </button>
                    <button
                      type="button"
                      onClick={() => onApproveConnection(c.id)}
                      className="py-1 px-3 bg-[#1B6B3A] hover:bg-[#0D4F2B] text-white text-[10px] uppercase font-bold rounded cursor-pointer"
                    >
                      Approve Release
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-serif font-semibold text-gray-700 text-xs mb-3 uppercase tracking-wider font-mono">Processed Connection History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="border-b text-[10px] uppercase text-gray-400 font-bold font-mono">
                <th className="pb-2">Renter ID</th>
                <th className="pb-2">Property</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Final Status</th>
              </tr>
            </thead>
            <tbody>
              {processed.map((pr) => (
                <tr key={pr.id} className="border-b border-slate-50 py-2">
                  <td className="py-2 font-medium">{pr.renterName}</td>
                  <td className="py-2 text-slate-600">{pr.propertyName}</td>
                  <td className="py-2 font-mono text-[#1B6B3A]">KES {pr.price.toLocaleString()}</td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${pr.status === "approved" ? "bg-green-105 text-green-700" : "bg-red-105 text-red-700"}`}>
                      {pr.status}
                    </span>
                  </td>
                </tr>
              ))}
              {processed.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-slate-400 italic">No historical traces processed.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
