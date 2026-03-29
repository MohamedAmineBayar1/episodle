"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Flame, RotateCcw, Calendar } from "lucide-react";
import { DailyStreak, useStreakRestore, getDailyStreak } from "@/lib/storage";

interface StreakModalProps {
  streak: DailyStreak;
  onClose: () => void;
  onRestoreUsed: (updatedStreak: DailyStreak) => void;
  hadBreakToday?: boolean;
}

function ShieldIcon({ filled }: { filled: boolean }) {
  return (
    <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl border-2 transition-all ${
      filled
        ? "bg-orange-500/15 border-orange-500/50 text-orange-400"
        : "bg-gray-800/50 border-gray-700/30 text-gray-700"
    }`}>
      <Shield size={18} fill={filled ? "currentColor" : "none"} />
    </div>
  );
}

function getFlameIntensity(streak: number) {
  if (streak >= 30) return { label: "Legendary 🏆", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" };
  if (streak >= 14) return { label: "On Fire 🔥🔥", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" };
  if (streak >= 7)  return { label: "Heating Up 🔥", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" };
  if (streak >= 3)  return { label: "Getting Warm", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" };
  return { label: "Just Started", color: "text-gray-400", bg: "bg-gray-800/30", border: "border-gray-700/30" };
}

export default function StreakModal({ streak, onClose, onRestoreUsed, hadBreakToday }: StreakModalProps) {
  const intensity = getFlameIntensity(streak.streak);
  const canRestore = hadBreakToday && streak.restores > 0;
  const shields = [0, 1, 2].map(i => i < streak.restores);

  const handleRestore = () => {
    const success = useStreakRestore();
    if (success) {
      onRestoreUsed(getDailyStreak());
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-sm bg-gray-900 border border-gray-700 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-orange-600 via-amber-400 to-orange-600" />

          {/* Close button */}
          <button
            onClick={onClose}
            id="streak-modal-close"
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="p-7 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500/10 rounded-2xl">
                <Flame size={26} className="text-orange-400" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">Daily Streak</h2>
            </div>

            {/* Big streak number */}
            <div className={`flex flex-col items-center justify-center py-6 rounded-2xl border ${intensity.bg} ${intensity.border}`}>
              <motion.div
                key={streak.streak}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: "backOut" }}
                className={`text-7xl font-black ${intensity.color}`}
              >
                {streak.streak}
              </motion.div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">days</p>
              <p className={`text-sm font-semibold mt-2 ${intensity.color}`}>{intensity.label}</p>
            </div>

            {/* Last played */}
            {streak.lastPlayedDate && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar size={12} />
                <span>Last played: <span className="text-gray-300 font-semibold">{streak.lastPlayedDate}</span></span>
              </div>
            )}

            {/* Restores */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Monthly Restores</p>
                <span className="text-xs text-gray-600 font-medium">{streak.restores}/3 left</span>
              </div>
              <div className="flex gap-2">
                {shields.map((filled, i) => (
                  <ShieldIcon key={i} filled={filled} />
                ))}
                <div className="flex-1 flex items-center ml-2">
                  <p className="text-xs text-gray-600 leading-tight">
                    {streak.restores === 0
                      ? "Refills next month"
                      : "Save a missed day"}
                  </p>
                </div>
              </div>
            </div>

            {/* Use Restore button (only visible if applicable) */}
            {canRestore ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-4 space-y-3"
              >
                <p className="text-sm text-orange-300 font-medium leading-snug">
                  ⚠️ You missed yesterday! Use a restore to keep your streak alive.
                </p>
                <button
                  id="streak-use-restore-btn"
                  onClick={handleRestore}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-orange-500 hover:bg-orange-400 text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all active:scale-95"
                >
                  <RotateCcw size={14} />
                  Use Restore ({streak.restores} left)
                </button>
              </motion.div>
            ) : null}

            {/* How it works */}
            <div className="border-t border-gray-800 pt-4">
              <p className="text-xs text-gray-600 leading-relaxed">
                Play the daily game every day — <span className="text-gray-400">win or lose</span> — to grow your streak. Restores refill every 1st of the month.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
