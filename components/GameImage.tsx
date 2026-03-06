import Image from 'next/image';

interface GameImageProps {
    imageUrls: string[] | null;
    currentIndex: number;
    maxUnlockedIndex: number;
    onNavigate: (index: number) => void;
}

export default function GameImage({ imageUrls, currentIndex, maxUnlockedIndex, onNavigate }: GameImageProps) {
    // If guessCount goes beyond 5 (game over), we cap it at 5.
    const imageIndex = Math.min(currentIndex, 5);
    const currentImageUrl = imageUrls && imageUrls.length > 0 ? imageUrls[imageIndex] : null;

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-4">
            <div className="aspect-video relative rounded-xl overflow-hidden shadow-2xl bg-black border border-gray-800 flex items-center justify-center">
                {currentImageUrl ? (
                    <Image
                        src={currentImageUrl}
                        alt={`Episode Still ${imageIndex + 1}`}
                        fill
                        className={`object-cover transition-opacity duration-700 ease-in-out hover:scale-105`}
                        priority
                        sizes="(max-width: 768px) 100vw, 800px"
                    />
                ) : (
                    <div className="text-gray-500 font-bold uppercase tracking-widest">
                        No Image Available
                    </div>
                )}

                {/* Cinematic Vignette Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.8)_100%)]"></div>
            </div>

            <div className="flex justify-center gap-2 mt-2">
                {Array.from({ length: 6 }).map((_, idx) => {
                    const isUnlocked = idx <= maxUnlockedIndex;
                    const isActive = idx === imageIndex;

                    let buttonClasses = "w-10 h-10 rounded-full font-bold flex items-center justify-center transition-all ";

                    if (isActive) {
                        buttonClasses += "bg-white text-black ring-2 ring-white scale-110 shadow-lg";
                    } else if (isUnlocked) {
                        buttonClasses += "bg-gray-800 text-white hover:bg-gray-700 cursor-pointer";
                    } else {
                        buttonClasses += "bg-gray-900 border border-gray-800 text-gray-700 cursor-not-allowed";
                    }

                    return (
                        <button
                            key={idx}
                            disabled={!isUnlocked}
                            onClick={() => isUnlocked && onNavigate(idx)}
                            className={buttonClasses}
                            aria-label={`View image ${idx + 1}`}
                        >
                            {idx + 1}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
