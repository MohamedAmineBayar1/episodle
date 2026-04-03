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
    <>
      {/* 1. Floating Desktop Version */}
      <div className="hidden md:flex fixed bottom-6 right-6 z-50 group flex flex-col items-end translate-y-0 pointer-events-none">
        {/* Tooltip/Card */}
        <div className="mb-4 w-72 opacity-0 -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 transform-gpu">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl relative pointer-events-auto">
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
            <div className="absolute right-6 -bottom-2 w-4 h-4 bg-gray-900 border-r border-b border-gray-800 rotate-45 group-hover:block hidden"></div>
          </div>
        </div>

        {/* Main Trigger Button */}
        <div className="flex items-center gap-3 px-5 py-3.5 bg-white text-black rounded-full shadow-2xl transition-all duration-300 ring-4 ring-white/10 cursor-pointer select-none pointer-events-auto">
          <div className="p-1 px-1.5 bg-red-500 rounded-lg text-white">
            <Heart size={16} className="fill-current" />
          </div>
          <span className="font-black uppercase tracking-tighter text-[13px]">
            Support dev
          </span>
        </div>
      </div>

      {/* 2. Static Mobile Version */}
      <div className="flex md:hidden flex-col items-center justify-center mt-4 mb-20 px-4 w-full">
        <div className="w-full max-w-sm bg-gray-900/30 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-sm text-center relative overflow-hidden group/mobile">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/20 to-transparent"></div>
          
          <div className="inline-flex p-3 bg-red-500/10 rounded-2xl text-red-500 mb-4 items-center justify-center">
            <Heart size={24} className="fill-red-500/20" />
          </div>
          
          <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">Support the Dev</h3>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed font-medium">
            Love playing Episodle? Help keep the project alive with a small donation.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black px-2">
              <span>USDT (TRC20)</span>
              <span className="flex items-center gap-1 opacity-50"><Wallet size={10} /> TRON network</span>
            </div>
            
            <button 
              onClick={handleCopy}
              className={`w-full relative bg-white/${copied ? '100' : '5'} border ${copied ? 'border-green-500' : 'border-white/10'} rounded-2xl p-4 text-left transition-all duration-300 active:scale-[0.95]`}
            >
              <p className={`text-[12px] font-mono leading-relaxed break-all pr-10 font-bold ${copied ? 'text-black' : 'text-gray-300'}`}>
                {address}
              </p>
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {copied ? (
                  <Check size={18} className="text-green-600" />
                ) : (
                  <Copy size={18} className="text-gray-500" />
                )}
              </div>
            </button>
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest pt-2">
              {copied ? 'Copied! Thank you so much! ❤️' : 'Tap address above to copy'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
