"use client";

import { useState, useEffect } from 'react';

interface CountdownProps {
    onFinish?: () => void;
}

export default function Countdown({ onFinish }: CountdownProps) {
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();

            // Calculate next midnight local
            const nextMidnight = new Date();
            nextMidnight.setHours(24, 0, 0, 0);

            const diff = nextMidnight.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                if (onFinish) onFinish();
                return;
            }

            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / (1000 * 60)) % 60);
            const s = Math.floor((diff / 1000) % 60);

            setTimeLeft({ hours: h, minutes: m, seconds: s });
        }, 1000);

        return () => clearInterval(timer);
    }, [onFinish]);

    const format = (num: number) => num.toString().padStart(2, '0');

    return (
        <div className="flex flex-col items-center gap-1">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">Next Show In</span>
            <div className="flex gap-2 text-3xl font-black tabular-nums tracking-wider text-white">
                <div className="flex flex-col items-center">
                    <span>{format(timeLeft.hours)}</span>
                    <span className="text-[10px] text-gray-500 uppercase font-medium">hr</span>
                </div>
                <span className="text-gray-600 self-start mt-[-2px]">:</span>
                <div className="flex flex-col items-center">
                    <span>{format(timeLeft.minutes)}</span>
                    <span className="text-[10px] text-gray-500 uppercase font-medium">min</span>
                </div>
                <span className="text-gray-600 self-start mt-[-2px] text-opacity-50">:</span>
                <div className="flex flex-col items-center">
                    <span className="text-gray-400">{format(timeLeft.seconds)}</span>
                    <span className="text-[10px] text-gray-500 uppercase font-medium">sec</span>
                </div>
            </div>
        </div>
    );
}
