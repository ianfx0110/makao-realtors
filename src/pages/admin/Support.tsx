import React from 'react';
import { MessageSquare, Send, CheckCircle } from 'lucide-react';

const mockTickets = [
  { id: 1, user: 'John Doe', subject: 'Rent Payment Issue', status: 'open', message: 'I paid my rent but the landlord says they haven\'t received it.' },
  { id: 2, user: 'Jane Smith', subject: 'Account Verification', status: 'closed', message: 'Can you help me verify my landlord profile?' },
];

export const SupportTickets = () => {
  const [selectedTicket, setSelectedTicket] = React.useState<any>(null);
  const [reply, setReply] = React.useState('');

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-display mb-2">Resolution <span className="text-brand-accent">Center</span></h1>
        <p className="text-stone-500">Manage user inquiries and platform disputes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Active Tickets</h3>
          {mockTickets.map(ticket => (
            <button 
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className={`w-full text-left bento-card p-4 transition-all ${selectedTicket?.id === ticket.id ? 'border-brand-accent ring-1 ring-brand-accent' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase tracking-tighter bg-stone-100 px-2 py-1 rounded">{ticket.status}</span>
                <span className="text-[10px] text-stone-400">#00{ticket.id}</span>
              </div>
              <h4 className="font-bold text-sm truncate">{ticket.subject}</h4>
              <p className="text-xs text-stone-500 mt-1">{ticket.user}</p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selectedTicket ? (
            <div className="bento-card relative h-[500px] flex flex-col">
              <div className="p-4 border-b border-stone-100 flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{selectedTicket.subject}</h3>
                  <p className="text-xs text-stone-500">From: {selectedTicket.user}</p>
                </div>
                <button className="text-green-500 hover:bg-green-50 p-2 rounded-xl transition-colors">
                  <CheckCircle size={20} />
                </button>
              </div>

              <div className="flex-grow p-6 overflow-y-auto bg-stone-50/50">
                <div className="bg-white border border-stone-100 p-4 rounded-2xl max-w-[80%] mb-4">
                  <p className="text-sm">{selectedTicket.message}</p>
                </div>
                <div className="flex justify-end mb-4">
                  <div className="bg-brand-primary text-white p-4 rounded-2xl max-w-[80%]">
                    <p className="text-sm italic opacity-50">Drafting response...</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-stone-100">
                <div className="relative">
                  <textarea 
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your official response..."
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl p-4 pr-12 text-sm outline-none focus:ring-2 focus:ring-brand-accent/20 h-24 resize-none"
                  />
                  <button className="absolute right-4 bottom-4 bg-brand-accent text-white p-2 rounded-xl hover:scale-105 transition-transform">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bento-card h-[500px] flex flex-col items-center justify-center text-center p-12">
              <MessageSquare className="text-stone-200 mb-4" size={48} />
              <h3 className="font-bold text-lg">Select a Ticket</h3>
              <p className="text-stone-400 text-sm mt-2">Pick an inquiry from the list to start the resolution process.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
