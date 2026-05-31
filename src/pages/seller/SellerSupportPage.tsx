import React from "react";
import { User, SupportMessage } from "../../types";
import { HelpCircle, Loader2 } from "lucide-react";

interface SellerSupportPageProps {
  currentUser: User;
  messages: SupportMessage[];
  supportText: string;
  setSupportText: (val: string) => void;
  submittingSupport: boolean;
  onPostSupportMessage: (e: React.FormEvent) => void;
}

export default function SellerSupportPage({
  currentUser,
  messages,
  supportText,
  setSupportText,
  submittingSupport,
  onPostSupportMessage
}: SellerSupportPageProps) {
  return (
    <div className="bg-white rounded-2xl border p-6 space-y-6 max-w-2xl font-sans text-xs text-slate-800">
      <div className="bg-[#F7F9F7] p-4 rounded-xl border flex gap-3 text-[#1B6B3A] text-xs leading-relaxed font-sans">
        <HelpCircle className="w-5 h-5 text-[#F5A623] shrink-0" />
        <div>
          <span className="font-extrabold uppercase font-mono text-[10px] tracking-wide block mb-1">Seller Helpdesk helpline</span>
          Receive technical assistance below regarding plot/bungalow listing verifications or payment triggers.
        </div>
      </div>

      <div className="border bg-slate-50 p-4 rounded-xl space-y-3 max-h-56 overflow-y-auto">
        {messages.map((m) => {
          const isMe = m.senderId === currentUser.id;
          return (
            <div key={m.id} className={`flex max-w-[85%] ${isMe ? "ml-auto" : "mr-auto"}`}>
              <div className={`p-3 rounded-xl text-xs leading-normal ${isMe ? "bg-[#1B6B3A] text-white rounded-tr-none" : "bg-white text-gray-800 border-l-4 border-amber-500 whitespace-pre-wrap font-sans"}`}>
                <span className="block text-[8px] font-bold tracking-wide opacity-75 uppercase mb-1 font-mono">{isMe ? "Sent by Me" : m.senderName}</span>
                {m.message}
              </div>
            </div>
          );
        })}
        {messages.length === 0 && <p className="text-center text-[11px] text-gray-400 italic">No messages sent yet. Ask something!</p>}
      </div>

      <form onSubmit={onPostSupportMessage} className="space-y-3">
        <textarea
          required
          rows={4}
          placeholder="Type support question or feedback details..."
          className="w-full text-xs border rounded-lg p-2.5 bg-white focus:outline-none"
          value={supportText}
          onChange={(e) => setSupportText(e.target.value)}
        />

        <button
          type="submit"
          disabled={submittingSupport}
          className="px-4 py-2 bg-[#1B6B3A] hover:bg-[#0D4F2B] text-white rounded text-xs font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer"
        >
          {submittingSupport ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : "Transmit Support Message"}
        </button>
      </form>
    </div>
  );
}
