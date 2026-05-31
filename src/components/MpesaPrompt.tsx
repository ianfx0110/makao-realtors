import React, { useState } from "react";
import { Smartphone, Check, X, ShieldAlert, Loader2, Eye, EyeOff } from "lucide-react";

interface MpesaPromptProps {
  checkoutRequestId: string;
  amount: number;
  purpose: string;
  targetName: string;
  onClose: () => void;
  onSuccess: (receipt: string) => void;
  onFail: () => void;
}

export default function MpesaPrompt({
  checkoutRequestId,
  amount,
  purpose,
  targetName,
  onClose,
  onSuccess,
  onFail
}: MpesaPromptProps) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"input" | "success" | "fail">("input");
  const [showPin, setShowPin] = useState(false);
  const [receipt, setReceipt] = useState("");

  const handleSimulatePayment = async (approve: boolean) => {
    setLoading(true);
    try {
      const res = await fetch("/api/mpesa/simulate-approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkoutRequestId, approve })
      });
      const data = await res.json();
      setLoading(false);
      
      if (data.success && approve) {
        setReceipt(data.receipt);
        setStatus("success");
        setTimeout(() => {
          onSuccess(data.receipt);
        }, 1800);
      } else {
        setStatus("fail");
        setTimeout(() => {
          onFail();
        }, 1800);
      }
    } catch (e) {
      setLoading(false);
      setStatus("fail");
      setTimeout(() => {
        onFail();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-[#1C201E] text-white w-full max-w-sm rounded-[32px] p-6 border-4 border-gray-700 shadow-2xl relative overflow-hidden">
        {/* Phone Speaker & Camera Notch Detail */}
        <div className="w-32 h-6 bg-black rounded-b-2xl mx-auto absolute top-0 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-1.5 px-3">
          <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
          <div className="w-12 h-1 bg-gray-950 rounded-full"></div>
        </div>

        <div className="pt-6 pb-2 text-center">
          <div className="flex justify-center mb-1">
            <span className="text-[10px] font-mono tracking-widest text-[#F5A623] uppercase">Safaricom Sim SIMulator</span>
          </div>
          <h3 className="text-sm font-bold opacity-80 uppercase tracking-wider">LIPA NA M-PESA STK</h3>
        </div>

        {status === "input" && (
          <div className="bg-[#E2EAE4] text-black rounded-2xl p-4 my-2 border border-[#b2c8b8] shadow-inner">
            <div className="bg-[#1B6B3A] text-white text-[11px] font-bold text-center py-1 rounded mb-3 flex items-center justify-center gap-1.5 uppercase">
              <Smartphone className="w-3.5 h-3.5" /> Safaricom Online Service
            </div>
            
            <p className="text-xs text-gray-800 text-center leading-relaxed">
              Do you want to pay <span className="font-bold text-[#1B6B3A]">KES {amount.toLocaleString()}</span> to <span className="font-bold">MAKAO REALTORS LIMITED</span> for <span className="italic">"{targetName}"</span>?
            </p>

            <div className="mt-4">
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1 text-center font-mono">Enter M-PESA PIN</label>
              <div className="relative">
                <input
                  type={showPin ? "text" : "password"}
                  maxLength={4}
                  placeholder="••••"
                  className="w-full tracking-widest text-center text-xl font-bold bg-white text-gray-900 border-2 border-gray-300 focus:border-[#1B6B3A] rounded-lg p-2 pr-10 focus:outline-none"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 cursor-pointer flex items-center justify-center rounded-sm"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSimulatePayment(false)}
                disabled={loading}
                className="py-2.5 bg-gray-300 text-gray-800 hover:bg-gray-400 font-bold rounded-lg text-xs uppercase cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSimulatePayment(true)}
                disabled={pin.length < 4 || loading}
                className={`py-2.5 ml-1 text-white font-bold rounded-lg text-xs uppercase flex items-center justify-center cursor-pointer ${
                  pin.length < 4 || loading ? "bg-gray-400 opacity-60 cursor-not-allowed" : "bg-[#1B6B3A] hover:bg-[#0D4F2B]"
                }`}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : "Send PIN"}
              </button>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="my-8 text-center animate-pulse">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white shadow">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-lg font-bold text-green-400 font-serif">M-PESA Confirmed!</h4>
            <p className="text-xs text-gray-300 mt-2 px-4">
              Receipt Code: <span className="font-mono text-[#F5A623] font-bold text-sm bg-black/40 px-2 py-1 rounded">{receipt}</span>
            </p>
            <p className="text-[10px] text-gray-400 mt-2">Processing listing publication...</p>
          </div>
        )}

        {status === "fail" && (
          <div className="my-8 text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white shadow">
              <X className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-lg font-bold text-red-400">Transaction Failed</h4>
            <p className="text-xs text-gray-300 mt-1 px-4">The payment request was cancelled or timed out on your screen.</p>
          </div>
        )}

        {/* Security verification details */}
        <div className="flex justify-center items-center gap-1.5 opacity-60 text-[10px] text-center mt-3 border-t border-white/10 pt-3">
          <ShieldAlert className="w-3.5 h-3.5 text-[#F5A623]" />
          <span>Verifying encrypted transaction tunnel...</span>
        </div>
      </div>
    </div>
  );
}
