import React from "react";
import { Payment } from "../../types";

interface AdminPaymentsPageProps {
  payments: Payment[];
}

export default function AdminPaymentsPage({ payments }: AdminPaymentsPageProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="font-serif font-black text-sm text-gray-900">M-PESA Lipa Na M-PESA Secure Transactions</h3>
        <span className="text-[10px] bg-slate-50 border border-slate-200 text-slate-500 font-mono py-1 px-2.5 rounded font-bold uppercase">
          Total Transaction Records: {payments.length}
        </span>
      </div>

      <div className="overflow-x-auto border rounded-xl bg-white">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-[#F7F9F7] border-b border-gray-150">
            <tr className="text-[10px] uppercase font-bold tracking-wider text-gray-400 font-mono">
              <th className="p-4">Paid By</th>
              <th className="p-4">Safaricom Line</th>
              <th className="p-4">Transaction Code</th>
              <th className="p-4">Reference Target Name</th>
              <th className="p-4">Purpose Key</th>
              <th className="p-4">KES Price</th>
              <th className="p-4">Status Ledger</th>
              <th className="p-4">Date Registered</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payments.slice().reverse().map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-gray-900">{p.userName}</td>
                <td className="p-4 font-semibold font-mono text-[#1B6B3A]">{p.phone}</td>
                <td className="p-4 font-mono font-bold text-blue-700 uppercase">
                  {p.mpesaReceipt || p.checkoutRequestId.slice(-10)}
                </td>
                <td className="p-4 text-slate-600 font-medium truncate max-w-xs">{p.targetName}</td>
                <td className="p-4">
                  <span className="font-mono text-[9px] uppercase tracking-wider bg-slate-100 border px-2 py-0.5 rounded leading-none">
                    {p.purpose}
                  </span>
                </td>
                <td className="p-4 font-extrabold text-[#1B6B3A]">KES {p.amount.toLocaleString()}</td>
                <td className="p-4">
                  <span
                    className={`font-semibold text-[9px] uppercase px-2 py-0.5 rounded-full border ${
                      p.status === "completed"
                        ? "bg-green-135 border-green-400 text-green-700"
                        : p.status === "failed"
                        ? "bg-red-100 border-red-300 text-red-700"
                        : "bg-amber-100 border-amber-300 text-amber-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-4 text-gray-450 font-mono">{new Date(p.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={8} className="p-10 text-center text-xs text-slate-400 font-medium italic">
                  No payment ledger transactions found in the database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
