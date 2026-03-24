"use client";

import Countdown from './Countdown';
import AdBanner from './AdBanner';
import { useRouter } from 'next/navigation';

interface Guess {
    showName: string;
    isCorrect: boolean;
}

interface ShareModalProps {
    isWinner: boolean;
    guesses: Guess[];
    dailyShowName: string;
    stats: {
        currentStreak: number;
        maxStreak: number;
    };
    onClose: () => void;
    onRefresh?: () => void;
    isArchive?: boolean;
}

export default function ShareModal({ isWinner, guesses, dailyShowName, stats, onClose, onRefresh, isArchive }: ShareModalProps) {
    const router = useRouter();

    const generateShareText = () => {
        const today = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        const attemptCount = isWinner ? guesses.length : 'X';
        const streakText = !isArchive && stats.currentStreak > 1 ? `\nStreak: ${stats.currentStreak} 🔥` : '';
        const titleText = isArchive ? `Episodle Archive Result` : `Episodle - ${today}`;

        let emojiGrid = '';
        for (let i = 0; i < 6; i++) {
            if (i < guesses.length) {
                emojiGrid += guesses[i].isCorrect ? '🟩' : '🟥';
            } else {
                emojiGrid += '⬜';
            }
        }

        return `${titleText}\nScore: ${attemptCount}/6${streakText}\n${emojiGrid}\n\nPlay at: [Your URL Here]`;
    };

    const handleShare = async () => {
        const text = generateShareText();
        try {
            await navigator.clipboard.writeText(text);
            alert('Copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <div className="bg-gray-900 border border-gray-700 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl flex flex-col gap-6">

                <h2 className={`text-4xl font-extrabold pb-2 ${isWinner ? 'text-green-400' : 'text-red-500'}`}>
                    {isWinner ? 'Winner!' : 'Game Over'}
                </h2>

                <div className="text-xl text-gray-300">
                    The show was: <span className="font-bold text-white block mt-2 text-2xl">{dailyShowName}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 my-2">
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                        <div className="text-3xl font-black text-white">{stats.currentStreak}</div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">Current Streak</div>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                        <div className="text-3xl font-black text-white">{stats.maxStreak}</div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">Max Streak</div>
                    </div>
                </div>

                <div className="text-2xl tracking-widest bg-black/30 py-3 rounded-xl border border-gray-800/50">
                    {guesses.map((g, i) => (
                        <span key={i}>{g.isCorrect ? '🟩' : '🟥'}</span>
                    ))}
                    {Array.from({ length: 6 - guesses.length }).map((_, i) => (
                        <span key={`empty-${i}`}>⬜</span>
                    ))}
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-1"></div>

                <Countdown onFinish={onRefresh} />

                <button
                    onClick={() => {
                        const randomDaysAgo = Math.floor(Math.random() * 30) + 1;
                        const d = new Date();
                        d.setDate(d.getDate() - randomDaysAgo);
                        const randomDate = d.toLocaleDateString('en-CA');
                        onClose();
                        router.push(`/archive/${randomDate}`);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-all transform active:scale-95"
                >
                    Play Random Show
                </button>

                <div className="flex gap-4 mt-2">
                    <button
                        onClick={handleShare}
                        className="flex-1 bg-white hover:bg-gray-200 text-black font-bold py-3 px-6 rounded-lg transition-all transform active:scale-95"
                    >
                        Share
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform active:scale-95"
                    >
                        Close
                    </button>
                </div>

                <AdBanner dataAdSlot="4480966445" />
            </div>
        </div>
    );
}
