"use client";
import { motion } from "framer-motion";
import { DailyStreak } from "@/lib/storage";

interface StreakFlameProps {
  streak: DailyStreak;
  onClick: () => void;
}

function getFlameColor(streak: number) {
  if (streak >= 30) return { primary: "#FFD700", glow: "rgba(255,215,0,0.5)", label: "text-yellow-400" };
  if (streak >= 7)  return { primary: "#FF6B1A", glow: "rgba(255,107,26,0.5)", label: "text-orange-400" };
  return { primary: "#9CA3AF", glow: "rgba(156,163,175,0.2)", label: "text-gray-400" };
}

export default function StreakFlame({ streak, onClick }: StreakFlameProps) {
  const colors = getFlameColor(streak.streak);
  const isHot = streak.streak >= 7;

  return (
    <button
      onClick={onClick}
      id="streak-flame-btn"
      aria-label={`Daily streak: ${streak.streak} days. Click for details.`}
      className="flex items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 transition-all duration-200 group"
    >
      <motion.span
        animate={isHot ? { scale: [1, 1.12, 1], rotate: [-4, 4, -4, 0] } : { scale: 1 }}
        transition={isHot ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" } : {}}
        style={{ filter: isHot ? `drop-shadow(0 0 6px ${colors.glow})` : "none" }}
        className="text-xl leading-none select-none"
        aria-hidden="true"
      >
        🔥
      </motion.span>
      <motion.span
        key={streak.streak}
        initial={{ scale: 1.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "backOut" }}
        className={`text-sm font-black tabular-nums ${colors.label} group-hover:text-white transition-colors`}
      >
        {streak.streak}
      </motion.span>
    </button>
  );
}
