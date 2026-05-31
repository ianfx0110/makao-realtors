import React from "react";
import { Payment } from "../../types";

interface SellerPaymentsPageProps {
  payments: Payment[];
}

export default function SellerPaymentsPage({ payments }: SellerPaymentsPageProps) {
  const sellerPayments = payments.filter((p) => p.purpose === "listing_fee");

  return (
    <div className="space-y-6 text-xs text-slate-800 font-sans">
      <div className="bg-[#1A2420] p-6 rounded-2xl text-white shadow-xs border border-slate-800">
        <h3 className="font-serif text-base font-bold text-[#F5A623]">Seller Listing Transactions</h3>
        <p className="text-slate-300 mt-1 max-w-xl">
          Review M-PESA payments completed to activate your advertised plots, houses, and lands. All activities are securely checked by Safaricom endpoints and backed by the local central ledger.
        </p>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h4 className="font-serif font-bold text-sm text-gray-800 mb-4">Safaricom Active Receipts List</h4>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left font-mono">
            <thead>
              <tr className="border-b uppercase text-[10px] text-gray-400 tracking-wider">
                <th className="py-2.5">Date Created</th>
                <th className="py-2.5">Transaction ID / Key</th>
                <th className="py-2.5">Purpose Type</th>
                <th className="py-2.5">Price KES</th>
                <th className="py-2.5">Safaricom State</th>
              </tr>
            </thead>
            <tbody>
              {sellerPayments.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 text-xs py-2">
                  <td className="py-2.5 text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="py-2.5 font-bold text-slate-800">{p.mpesaReceipt || p.checkoutRequestId}</td>
                  <td className="py-2.5 capitalize">{p.purpose.replace("_", " ")}</td>
                  <td className="py-2.5 font-bold text-[#1B6B3A]">KES {p.amount.toLocaleString()}</td>
                  <td className="py-2.5 text-[#1B6B3A] uppercase font-bold text-[9px]">
                    <span className="bg-green-105 border border-green-200 py-0.5 px-2 rounded-full">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
              {sellerPayments.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 italic">
                    No active payments lodged at the moment.
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
