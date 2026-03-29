"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ANNOUNCED_KEY = "streak-announced";

export default function StreakAnnouncement() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(ANNOUNCED_KEY)) {
      setShow(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(ANNOUNCED_KEY, "true");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm bg-gray-900 border border-orange-500/30 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Top gradient accent */}
            <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />

            <div className="p-7 space-y-5">
              {/* Header */}
              <div className="flex items-center gap-3">
                <span className="text-4xl" aria-hidden="true">🔥</span>
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Daily Streak is Here!</h2>
                  <p className="text-xs text-orange-400 font-semibold uppercase tracking-wider mt-0.5">New Feature</p>
                </div>
              </div>

              {/* Rules */}
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-base mt-0.5" aria-hidden="true">📅</span>
                  <span>Play the <strong className="text-white">Daily Game</strong> every day — win or lose — to grow your streak.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-base mt-0.5" aria-hidden="true">💀</span>
                  <span>Miss a full calendar day and your streak <strong className="text-white">resets to 0</strong>.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-base mt-0.5" aria-hidden="true">🛡️</span>
                  <span>You have <strong className="text-orange-400">3 Streak Restores</strong> per month. Use one to save a streak when life gets in the way.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-base mt-0.5" aria-hidden="true">🔄</span>
                  <span>Restores <strong className="text-white">refill automatically</strong> at the start of each month.</span>
                </li>
              </ul>

              {/* CTA */}
              <button
                id="streak-announcement-dismiss"
                onClick={handleDismiss}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-black uppercase tracking-widest rounded-2xl transition-all duration-200 active:scale-95 shadow-lg shadow-orange-500/20"
              >
                Let&apos;s Go! 🔥
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
