import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, Sparkles, Loader2, Minimize2, Maximize2 } from "lucide-react";

interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export default function AiAdvisor() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      parts: [{ text: "Jambo & Karibu! I am the MR Assistant, your secure Makao Realtors guide. 🇰🇪\n\nAsk me anything! For example:\n- \"Recommend an affordable apartment in Kiambu County\"\n- \"How does the 10% connection fee reveal work?\"\n- \"Recommend property listings with WiFi and Security.\"" }]
    }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      role: "user",
      parts: [{ text: input }]
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Map current chat history format
      const response = await fetch("/api/ai/discuss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          chatHistory: messages.slice(1) // skip initial greeting to keep clean context
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "model", parts: [{ text: data.text }] }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "model", parts: [{ text: "Jambo! I ran into an error while analyzing local files. Could you please rephrase or try again?" }] }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "model", parts: [{ text: "Jambo! I'm temporarily operating in offline standby mode. Let me know if there's any listing details I can clarify for you on board!" }] }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[#F5A623] hover:bg-[#d98b11] text-[#1B6B3A] p-4 rounded-full shadow-2xl z-40 flex items-center gap-2 group transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer font-bold"
      >
        <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: "3s" }} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap text-sm text-[13px] font-bold">Ask MR Assistant</span>
        <MessageSquare className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl z-40 border border-gray-200 overflow-hidden flex flex-col transition-all duration-300 max-h-[85vh]">
      {/* Sticky floating header close bar */}
      <div className="sticky top-0 z-30 bg-[#1B6B3A] text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#F5A623] flex items-center justify-center animate-pulse">
            <Bot className="w-5 h-5 text-[#1B6B3A]" />
          </div>
          <div>
            <h4 className="text-xs font-bold leading-none font-serif tracking-wide text-white" style={{ fontFamily: "Georgia, serif" }}>MR Assistant</h4>
            <span className="text-[9px] text-[#F5A623] uppercase tracking-widest font-bold block mt-0.5">Makao Realtors Copilot</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-white/85">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/15 rounded transition-all cursor-pointer flex items-center justify-center"
            title={isMinimized ? "Maximize Assistant" : "Minimize Assistant"}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4 text-white" /> : <Minimize2 className="w-4 h-4 text-white" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 bg-red-650 hover:bg-red-750 text-white rounded-lg transition-all cursor-pointer flex items-center justify-center border border-transparent hover:border-red-500"
            title="Close Assistant"
          >
            <X className="w-4 h-4 font-black" />
          </button>
        </div>
      </div>

      {/* Message Area */}
      {!isMinimized && (
        <>
          <div
            ref={scrollRef}
            className="flex-1 h-96 min-h-[300px] p-4 overflow-y-auto space-y-4 bg-[#F7F9F7] scroll-smooth"
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 max-w-[85%] ${
                  m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {m.role !== "user" && (
                  <div className="w-7 h-7 rounded-sm bg-[#1B6B3A]/10 text-[#1B6B3A] shrink-0 flex items-center justify-center text-[10px] font-bold">
                    MK
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl text-xs whitespace-pre-wrap leading-relaxed shadow-sm block ${
                    m.role === "user"
                      ? "bg-[#1B6B3A] text-white rounded-tr-none"
                      : "bg-white text-gray-800 border border-gray-100 rounded-tl-none font-sans"
                  }`}
                >
                  {m.parts[0].text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 italic">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1B6B3A]" />
                <span>Expert is analyzing properties...</span>
              </div>
            )}
          </div>

          {/* Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-gray-100 flex gap-2"
          >
            <input
              type="text"
              placeholder="Search or ask real estate queries..."
              className="flex-1 border border-gray-200 rounded-lg pl-3 pr-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/40"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-[#1B6B3A] hover:bg-[#0D4F2B] text-white p-2.5 rounded-lg shrink-0 flex items-center justify-center transition-all cursor-pointer"
              disabled={loading || !input.trim()}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
