import React from "react";
import { ConnectionRequest } from "../../types";

interface RenterRevealsPageProps {
  myApprovedReveals: ConnectionRequest[];
}

export default function RenterRevealsPage({ myApprovedReveals }: RenterRevealsPageProps) {
  return (
    <div className="bg-white rounded-2xl border p-6 space-y-4 text-xs text-slate-800">
      <h3 className="font-serif font-bold text-gray-800 text-sm">Direct Approved Connection Ledger</h3>
      <p className="text-xs text-gray-500 max-w-lg mb-4">
        Below are all property landlord direct phone contacts where Lipa Na M-PESA escrow connection was approved by our support staff. Feel free to reach out directly. No broker fees!
      </p>

      {myApprovedReveals.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-400 italic">No approved landlord connections currently held on your ledger.</div>
      ) : (
        <div className="space-y-3">
          {myApprovedReveals.map((c) => (
            <div key={c.id} className="p-4 bg-green-50/40 rounded-xl border border-green-200 flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-4 text-xs font-sans">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-mono tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded font-extrabold mb-1 inline-block animate-pulse">Vetted landlord link unlocked</span>
                <h4 className="font-extrabold text-sm text-slate-800 tracking-wide">{c.propertyName}</h4>
                <p className="text-slate-500 mt-0.5 font-sans">Primary owner: <span className="font-bold">{c.landlordName}</span></p>
              </div>

              <div className="flex flex-col sm:items-end font-mono">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Kenyan Phone number:</span>
                <a href={`tel:${c.landlordContactPhone}`} className="text-sm font-bold text-[#1B6B3A] hover:underline font-semibold">{c.landlordContactPhone}</a>
                {c.landlordContactWhatsApp && (
                  <a href={`https://wa.me/${c.landlordContactWhatsApp.replace("+", "")}`} className="text-[10px] text-emerald-600 font-extrabold underline mt-1">
                    Direct WhatsApp Text Link
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
