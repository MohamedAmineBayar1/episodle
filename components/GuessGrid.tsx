interface Guess {
    showName: string;
    isCorrect: boolean;
    hint?: string;
}

interface GuessGridProps {
    guesses: Guess[];
    maxGuesses?: number;
}

export default function GuessGrid({ guesses, maxGuesses = 6 }: GuessGridProps) {
    const emptyRows = Math.max(0, maxGuesses - guesses.length);

    return (
        <div className="w-full max-w-md mx-auto my-6 grid gap-2">
            {guesses.map((guess, idx) => (
                <div
                    key={`guess-${idx}`}
                    className={`p-3 rounded-lg border-2 flex flex-col justify-center items-center font-bold text-center min-h-[50px]
            ${guess.isCorrect
                            ? 'bg-green-600/20 border-green-500 text-green-400'
                            : 'bg-red-600/20 border-red-500 text-red-400'}`}
                >
                    <span>{guess.showName}</span>
                    {guess.hint && !guess.isCorrect && (
                        <span className="text-xs text-gray-400 font-normal mt-1">Hint: {guess.hint}</span>
                    )}
                </div>
            ))}

            {Array.from({ length: emptyRows }).map((_, idx) => (
                <div
                    key={`empty-${idx}`}
                    className="p-3 rounded-lg border-2 border-gray-700 bg-gray-800/50 min-h-[50px]"
                />
            ))}
        </div>
    );
}
