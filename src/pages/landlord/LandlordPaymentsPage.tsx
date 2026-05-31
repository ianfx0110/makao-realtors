import React from "react";
import { Payment } from "../../types";

interface LandlordPaymentsPageProps {
  payments: Payment[];
  onAddToast: (msg: string, type: "success" | "error" | "info") => void;
}

export default function LandlordPaymentsPage({
  payments,
  onAddToast
}: LandlordPaymentsPageProps) {
  const landlordPayments = payments.filter((p) => p.purpose === "listing_fee");

  return (
    <div className="space-y-6 text-xs text-slate-800 font-sans">
      <div className="bg-gradient-to-br from-[#1B6B3A] to-[#124B28] p-6 rounded-2xl text-white shadow-xs">
        <h3 className="font-serif text-base font-bold text-slate-100">Landlord Escrow & Subscription Ledger</h3>
        <p className="text-emerald-100 mt-1 max-w-xl">
          Keep track of your standard promotional listing fee cash flows. Verified payments sync directly with Safaricom Lipa Na M-PESA API endpoints.
        </p>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h4 className="font-serif font-bold text-sm text-gray-800 mb-4">M-PESA Posting Transaction Ledger</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono">
            <thead>
              <tr className="border-b uppercase text-[10px] text-gray-400 tracking-wider">
                <th className="py-2.5">Date Created</th>
                <th className="py-2.5">Transaction ID</th>
                <th className="py-2.5">Purpose</th>
                <th className="py-2.5">Amount KES</th>
                <th className="py-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {landlordPayments.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 text-xs py-2">
                  <td className="py-2.5 text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="py-2.5 font-bold text-slate-800">{p.mpesaReceipt || p.checkoutRequestId}</td>
                  <td className="py-2.5 capitalize">{p.purpose.replace("_", " ")}</td>
                  <td className="py-2.5 font-bold text-[#1B6B3A]">KES {p.amount.toLocaleString()}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      p.status === "completed" ? "bg-green-105 text-green-700" : "bg-amber-105 text-amber-700"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
              {landlordPayments.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 italic">
                    No listing fee transactions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
