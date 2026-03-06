"use client";

import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import GuessGrid from '@/components/GuessGrid';
import GameImage from '@/components/GameImage';
import ShareModal from '@/components/ShareModal';
import { DailyPuzzle } from '@/lib/gameLogic';

interface Guess {
  showName: string;
  isCorrect: boolean;
  hint?: string;
}

export default function Home() {
  const [puzzle, setPuzzle] = useState<DailyPuzzle | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    currentStreak: 0,
    maxStreak: 0,
    lastWonDate: null as string | null
  });

  // Load puzzle and state
  useEffect(() => {
    async function loadGame() {
      try {
        const res = await fetch('/api/puzzle');
        if (!res.ok) throw new Error("Failed to fetch puzzle");
        const data = await res.json();
        setPuzzle(data);

        // Load stats
        const savedStats = localStorage.getItem('episodle-stats');
        if (savedStats) {
          setStats(JSON.parse(savedStats));
        }

        // Check local storage for today's state
        const today = new Date().toISOString().split('T')[0];
        const savedState = localStorage.getItem(`episodle-${today}`);

        if (savedState) {
          const parsed = JSON.parse(savedState);
          setGuesses(parsed.guesses || []);
          setGameState(parsed.gameState || 'playing');
          setCurrentImageIndex(parsed.currentImageIndex !== undefined ? parsed.currentImageIndex : (parsed.guesses?.length || 0));
          if (parsed.gameState !== 'playing') {
            setIsModalOpen(true);
          }
        }
      } catch (err) {
        console.error("Error loading game", err);
      } finally {
        setLoading(false);
      }
    }
    loadGame();
  }, []);

  // Save state when it changes
  useEffect(() => {
    if (!puzzle) return;
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`episodle-${today}`, JSON.stringify({
      guesses,
      gameState,
      currentImageIndex
    }));
  }, [guesses, gameState, currentImageIndex, puzzle]);

  const handleGuess = (show: any) => {
    if (gameState !== 'playing' || !puzzle) return;

    const isCorrect = show.id === puzzle.showId;

    // Generate a simple hint
    let hint = '';
    if (!isCorrect) {
      // Show year or genre as a hint based on which guess number it is
      if (guesses.length === 0 && show.first_air_date) {
        hint = `Aired ${show.first_air_date.substring(0, 4)} vs ${puzzle.firstAirDate.substring(0, 4)}`;
      } else if (guesses.length === 2 && puzzle.genres.length > 0) {
        hint = `Genre: ${puzzle.genres[0]}`;
      } else {
        hint = "Try again!";
      }
    }

    const newGuess = { showName: show.name, isCorrect, hint };
    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);

    if (isCorrect) {
      setGameState('won');

      // Update Stats
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      const newStats = { ...stats };

      // Check if consecutive day
      if (stats.lastWonDate) {
        const lastDate = new Date(stats.lastWonDate);
        const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          newStats.currentStreak += 1;
        } else if (diffDays > 1) {
          newStats.currentStreak = 1;
        }
        // if diffDays === 0, they already won today (shouldn't happen with game state check but safe)
      } else {
        newStats.currentStreak = 1;
      }

      if (newStats.currentStreak > newStats.maxStreak) {
        newStats.maxStreak = newStats.currentStreak;
      }

      newStats.lastWonDate = todayStr;
      setStats(newStats);
      localStorage.setItem('episodle-stats', JSON.stringify(newStats));

      setTimeout(() => setIsModalOpen(true), 1500);
    } else if (newGuesses.length >= 6) {
      setGameState('lost');

      // Reset streak on loss
      const newStats = { ...stats, currentStreak: 0 };
      setStats(newStats);
      localStorage.setItem('episodle-stats', JSON.stringify(newStats));

      setTimeout(() => setIsModalOpen(true), 1500);
    } else {
      // Advance the image if the user hasn't lost yet
      setCurrentImageIndex(newGuesses.length);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white text-2xl animate-pulse">Loading target...</div>;
  }

  if (!puzzle) {
    return <div className="min-h-screen bg-black text-red-500 flex items-center justify-center text-2xl">Error loading puzzle. Check API key.</div>;
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-8 font-sans selection:bg-gray-800">
      <div className="max-w-3xl mx-auto space-y-8">

        <header className="text-center space-y-2">
          <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent drop-shadow-lg uppercase">
            Episodle
          </h1>
          <p className="text-gray-400 font-medium tracking-wide">
            Guess the show from the random episode
          </p>
        </header>

        <section className="relative group">
          <GameImage
            imageUrls={puzzle.imageUrls}
            currentIndex={currentImageIndex}
            maxUnlockedIndex={guesses.length}
            onNavigate={(index) => setCurrentImageIndex(index)}
          />
        </section>

        <section className="mt-8 transition-opacity duration-300">
          <SearchBar onGuess={handleGuess} disabled={gameState !== 'playing'} />
        </section>

        <section>
          <GuessGrid guesses={guesses} maxGuesses={6} />
        </section>

        {gameState !== 'playing' && (
          <div className="text-center mt-6 fade-in">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-gray-400 hover:text-white underline underline-offset-4 decoration-gray-600 font-medium"
            >
              View Results
            </button>
          </div>
        )}

      </div>

      {isModalOpen && gameState !== 'playing' && (
        <ShareModal
          isWinner={gameState === 'won'}
          guesses={guesses}
          dailyShowName={puzzle.showName}
          stats={stats}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </main>
  );
}
