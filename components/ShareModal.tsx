import Countdown from './Countdown';

interface Guess {
    showName: string;
    isCorrect: boolean;
}

interface ShareModalProps {
    isWinner: boolean;
    guesses: Guess[];
    dailyShowName: string;
    onClose: () => void;
}

export default function ShareModal({ isWinner, guesses, dailyShowName, onClose }: ShareModalProps) {
    const generateShareText = () => {
        const today = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        const attemptCount = isWinner ? guesses.length : 'X';

        let emojiGrid = '';
        for (let i = 0; i < 6; i++) {
            if (i < guesses.length) {
                emojiGrid += guesses[i].isCorrect ? '🟩' : '🟥';
            } else {
                emojiGrid += '⬜';
            }
        }

        return `Episodle - ${today}\nScore: ${attemptCount}/6\n${emojiGrid}\n\nPlay at: [Your URL Here]`;
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

                <div className="text-2xl tracking-widest bg-black/30 py-3 rounded-xl border border-gray-800/50">
                    {guesses.map((g, i) => (
                        <span key={i}>{g.isCorrect ? '🟩' : '🟥'}</span>
                    ))}
                    {Array.from({ length: 6 - guesses.length }).map((_, i) => (
                        <span key={`empty-${i}`}>⬜</span>
                    ))}
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-2"></div>

                <Countdown />

                <div className="flex gap-4 mt-2">
                    <button
                        onClick={handleShare}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                        Share
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
