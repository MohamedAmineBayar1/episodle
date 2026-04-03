"use client";

import { useState } from 'react';
import { Check, Heart, Wallet, Copy } from 'lucide-react';

export default function DonationWidget() {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const address = "TLQqxzW7pmUw8p5Uq6q9NX1SQ5FMK61QWG";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      // Wait a bit to show "Copied" then hide
      setTimeout(() => {
        setIsVisible(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:left-6 z-50 group flex flex-col items-end md:items-start translate-y-0">
      {/* Tooltip/Card */}
      <div className="mb-4 w-72 opacity-0 -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 transform-gpu">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-white">
              <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                <Heart size={18} className="fill-red-500/20" />
              </div>
              <h3 className="font-bold text-lg tracking-tight">Support dev</h3>
            </div>
            {copied && <span className="bg-green-500/20 text-green-500 text-[10px] font-black px-2 py-1 rounded-full animate-pulse uppercase tracking-widest">COPIED!</span>}
          </div>
          
          <p className="text-gray-400 text-xs mb-5 leading-relaxed font-medium">
            Love the game? Click the address below to copy and support the project.
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold px-1">
              <span>USDT (TRC20)</span>
              <span className="flex items-center gap-1 opacity-50"><Wallet size={10} /> TRON network</span>
            </div>
            
            <button 
              onClick={handleCopy}
              className={`w-full group/address relative bg-black/40 border ${copied ? 'border-green-500/50' : 'border-gray-800 hover:border-gray-600'} rounded-xl p-3 text-left transition-all duration-200 active:scale-[0.98] cursor-pointer`}
            >
              <p className={`text-[11px] font-mono leading-tight break-all pr-8 ${copied ? 'text-green-400' : 'text-gray-300'}`}>
                {address}
              </p>
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {copied ? (
                  <Check size={14} className="text-green-500" />
                ) : (
                  <Copy size={14} className="text-gray-500 group-hover/address:text-white transition-colors" />
                )}
              </div>
            </button>
          </div>

          <p className="mt-4 text-[9px] text-gray-600 text-center uppercase tracking-widest font-black">
            {copied ? 'Redirecting your gratitude... ❤️' : 'One-click to copy'}
          </p>

          {/* Pointer */}
          <div className="absolute right-6 md:right-auto md:left-6 -bottom-2 w-4 h-4 bg-gray-900 border-r border-b border-gray-800 rotate-45 group-hover:block hidden"></div>
        </div>
      </div>

      {/* Main Trigger Button */}
      <div className="flex items-center gap-3 px-4 py-4 md:px-5 md:py-3.5 bg-white text-black rounded-full shadow-2xl transition-all duration-300 ring-4 ring-white/10 cursor-pointer select-none">
        <div className="p-1 px-1.5 bg-red-500 rounded-lg text-white">
          <Heart size={16} className="fill-current" />
        </div>
        <span className="font-black uppercase tracking-tighter text-[13px] hidden md:inline">
          Support dev
        </span>
      </div>
    </div>

  );
}
