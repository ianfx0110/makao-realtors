import React from "react";
import { User, SupportMessage } from "../../types";
import { Loader2 } from "lucide-react";

export interface StaffSupportPageProps {
  users: User[];
  messages: SupportMessage[];
  currentUser: User;
  supportRecipientId: string;
  setSupportRecipientId: (id: string) => void;
  supportReplyText: string;
  setSupportReplyText: (text: string) => void;
  sendingReply: boolean;
  onSendReply: (e: React.FormEvent) => void;
}

export default function StaffSupportPage({
  users,
  messages,
  currentUser,
  supportRecipientId,
  setSupportRecipientId,
  supportReplyText,
  setSupportReplyText,
  sendingReply,
  onSendReply
}: StaffSupportPageProps) {
  // Group messages for multi-conversation display
  const uniqueConversations = Array.from(
    new Set(messages.map((m) => (m.senderId === currentUser.id ? m.recipientId : m.senderId)))
  ).filter((id) => id !== "staff" && id !== currentUser.id);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-[400px]">
      {/* Conversations left sidebar list */}
      <div className="border-r pr-4 space-y-2">
        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#1B6B3A] mb-3 font-mono">
          Consumer Helplines
        </h4>
        <div className="space-y-1">
          {uniqueConversations.map((id) => {
            const u = users.find((user) => user.id === id);
            const lastMsg = messages
              .filter((m) => m.senderId === id || m.recipientId === id)
              .slice(-1)[0];
            return (
              <div
                key={id}
                onClick={() => setSupportRecipientId(id)}
                className={`p-3 rounded-lg text-xs cursor-pointer transition-all ${
                  supportRecipientId === id
                    ? "bg-[#1B6B3A]/10 border-l-4 border-[#1B6B3A] font-bold"
                    : "hover:bg-slate-50 border-b border-gray-50 bg-[#F7F9F7]/30"
                }`}
              >
                <p className="font-bold text-slate-800">{u?.name || "Client helpline id: " + id}</p>
                <p className="text-[10px] opacity-75 font-mono mb-1">
                  {u?.phone} ({u?.role})
                </p>
                <p className="text-[10px] text-gray-400 italic truncate">
                  {lastMsg ? lastMsg.message : "..."}
                </p>
              </div>
            );
          })}
          {uniqueConversations.length === 0 && (
            <p className="text-xs text-slate-400 italic p-3">No support conversations registered.</p>
          )}
        </div>
      </div>

      {/* Chat View Panel */}
      <div className="md:col-span-2 flex flex-col h-full bg-[#F7F9F7] rounded-xl p-4 min-h-96">
        {supportRecipientId ? (
          <>
            <div className="flex-1 overflow-y-auto space-y-3 pb-3 max-h-[300px]">
              {messages
                .filter((m) => m.senderId === supportRecipientId || m.recipientId === supportRecipientId)
                .map((m) => {
                  const isMe = m.senderId === currentUser.id;
                  return (
                    <div key={m.id} className={`flex max-w-[80%] ${isMe ? "ml-auto" : "mr-auto"}`}>
                      <div
                        className={`p-3 rounded-xl text-xs ${
                          isMe
                            ? "bg-[#1B6B3A] text-white rounded-tr-none"
                            : "bg-white border text-gray-800 rounded-tl-none"
                        }`}
                      >
                        <p className="text-[9px] opacity-70 font-mono mb-1">
                          {isMe ? "Staff Rep." : m.senderName}
                        </p>
                        <p className="leading-relaxed whitespace-pre-wrap">{m.message}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
            <form onSubmit={onSendReply} className="border-t pt-3 flex gap-2">
              <input
                type="text"
                required
                placeholder="Type reply to client..."
                className="flex-1 bg-white text-xs p-2.5 border rounded-lg focus:outline-none"
                value={supportReplyText}
                onChange={(e) => setSupportReplyText(e.target.value)}
              />
              <button
                type="submit"
                disabled={sendingReply}
                className="p-2.5 bg-[#1B6B3A] hover:bg-[#0D4F2B] text-white rounded-lg text-xs font-bold uppercase transition-all shrink-0 cursor-pointer flex items-center justify-center"
              >
                {sendingReply ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : "Respond"}
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs p-8 text-center">
            <p className="font-serif font-bold text-sm text-slate-700 mb-1">Moderator Portal</p>
            <p className="text-[11px] text-slate-400">
              Select a consumer helpline channel from the sidebar list to inspect recent conversations and resolve direct landlord contact complaints.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
