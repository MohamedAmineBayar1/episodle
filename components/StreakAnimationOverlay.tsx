"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface StreakAnimationOverlayProps {
  isVisible: boolean;
  streak: number;
  onComplete: () => void;
}

export default function StreakAnimationOverlay({ isVisible, streak, onComplete }: StreakAnimationOverlayProps) {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        onComplete();
      }, 3000); // Show for 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        >
          {/* Backdrop Glow Layers */}
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1.5, 1.2], opacity: [0, 0.5, 0.3] }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute w-80 h-80 bg-orange-600 rounded-full blur-[100px]"
          />
          <motion.div 
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: [0.2, 1.2, 1], opacity: [0, 0.8, 0.4] }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="absolute w-40 h-40 bg-yellow-400 rounded-full blur-[60px]"
          />

          <motion.div
            initial={{ scale: 0, rotate: -25, y: 50 }}
            animate={{ 
              scale: 1, 
              rotate: 0,
              y: 0
            }}
            exit={{ scale: 0, y: -100, opacity: 0, transition: { duration: 0.4, ease: "anticipate" } }}
            transition={{ 
              type: "spring",
              damping: 12,
              stiffness: 200,
            }}
            className="relative flex flex-col items-center"
          >
            {/* Fire Emoji with pulse/float */}
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                scale: [1, 1.1, 1],
                filter: [
                  "drop-shadow(0 0 20px rgba(255,107,26,0.6))",
                  "drop-shadow(0 0 40px rgba(255,107,26,0.9))",
                  "drop-shadow(0 0 20px rgba(255,107,26,0.6))"
                ]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="text-9xl md:text-[12rem] mb-6 select-none"
            >
              🔥
            </motion.div>

            {/* Streak Number Group */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
              className="text-center relative"
            >
              <div className="relative group">
                <span className="block text-7xl md:text-9xl font-black text-white italic tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] leading-none">
                  {streak}
                </span>
                {/* Glow effect for number */}
                <div className="absolute inset-0 bg-white blur-3xl opacity-20 -z-10 animate-pulse" />
              </div>
              
              <span className="block text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300 uppercase tracking-[0.3em] mt-4 drop-shadow-md">
                Day Streak
              </span>
            </motion.div>
            
            {/* Rapid Burst Ring */}
            <motion.div
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-4 border-orange-400 rounded-full"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
