"use client";

import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import GuessGrid from '@/components/GuessGrid';
import GameImage from '@/components/GameImage';
import ShareModal from '@/components/ShareModal';
import StatsModal from '@/components/StatsModal';
import { DailyPuzzle } from '@/lib/gameLogic';
import { Stats, getStats, updateStats, saveGameState, getGameState } from '@/lib/storage';
import confetti from 'canvas-confetti';
import { BarChart3, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Guess {
  showId?: number;
  showName: string;
  isCorrect: boolean;
  hint?: string;
}

interface HomeProps {
  date?: string; // For archive mode
}

export default function Home({ date }: HomeProps) {
  const [puzzle, setPuzzle] = useState<DailyPuzzle | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>(getStats());
  const [unlockedImagesCount, setUnlockedImagesCount] = useState(0);

  const todayStr = date || new Date().toLocaleDateString('en-CA');
  const isArchive = !!date;

  // Load puzzle and state
  useEffect(() => {
    async function loadGame() {
      try {
        setLoading(true);
        const res = await fetch(`/api/puzzle?date=${todayStr}`);
        if (!res.ok) throw new Error("Failed to fetch puzzle");
        const data = await res.json();
        setPuzzle(data);

        // Load stats
        setStats(getStats());

        // Check local storage for today's state
        const savedState = getGameState(todayStr);

        if (savedState) {
          // Safety check: if showId exists and doesn't match current puzzle showId, and it's not archive mode
          // This handles cases where the show might have shifted mid-day due to ranking changes
          if (!isArchive && savedState.showId && data.showId && savedState.showId !== data.showId) {
            console.log("Show ID mismatch detected. Resetting current day state.");
            setGuesses([]);
            setGameState('playing');
            setUnlockedImagesCount(0);
            setCurrentImageIndex(0);
            setIsModalOpen(false);
          } else {
            setGuesses(savedState.guesses || []);
            setGameState(savedState.gameState || 'playing');
            setUnlockedImagesCount(savedState.unlockedImagesCount !== undefined ? savedState.unlockedImagesCount : (savedState.guesses?.length || 0));
            setCurrentImageIndex(savedState.currentImageIndex !== undefined ? savedState.currentImageIndex : (savedState.guesses?.length || 0));
            if (savedState.gameState !== 'playing') {
              setIsModalOpen(true);
            }
          }
        } else {
          // New day, reset current session state
          setGuesses([]);
          setGameState('playing');
          setUnlockedImagesCount(0);
          setCurrentImageIndex(0);
          setIsModalOpen(false);
        }
      } catch (err) {
        console.error("Error loading game", err);
      } finally {
        setLoading(false);
      }
    }
    loadGame();
  }, [todayStr]);

  // Save state when it changes
  useEffect(() => {
    if (!puzzle) return;
    saveGameState(todayStr, {
      guesses,
      gameState,
      currentImageIndex: currentImageIndex,
      unlockedImagesCount: unlockedImagesCount,
      showId: puzzle.showId
    });
  }, [guesses, gameState, currentImageIndex, unlockedImagesCount, puzzle, todayStr]);

  const triggerFireworks = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

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

    const newGuess = { showId: show.id, showName: show.name, isCorrect, hint };
    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);

    if (isCorrect) {
      setGameState('won');
      triggerFireworks();

      // Update Stats (only for non-archive games usually, but here we follow instructions)
      const updatedStats = updateStats(true, newGuesses.length);
      if (updatedStats) setStats(updatedStats);

      setTimeout(() => setIsModalOpen(true), 1500);
    } else if (newGuesses.length >= 6) {
      setGameState('lost');

      // Update Stats
      const updatedStats = updateStats(false, 6);
      if (updatedStats) setStats(updatedStats);

      setTimeout(() => setIsModalOpen(true), 1500);
    } else {
      // Advance the image if the user hasn't lost yet
      const nextUnlockedCount = Math.min(5, Math.max(unlockedImagesCount + 1, newGuesses.length));
      setUnlockedImagesCount(nextUnlockedCount);
      setCurrentImageIndex(nextUnlockedCount);
    }
  };

  const handleNavigate = (index: number) => {
    if (gameState === 'playing') {
      const nextUnlockedCount = Math.max(unlockedImagesCount, index);
      setUnlockedImagesCount(nextUnlockedCount);
    }
    setCurrentImageIndex(index);
  };

  const handleSkip = () => {
    if (gameState !== 'playing') return;

    if (unlockedImagesCount >= 5) {
      handleGiveUp();
    } else {
      const nextIndex = unlockedImagesCount + 1;
      setUnlockedImagesCount(nextIndex);
      setCurrentImageIndex(nextIndex);
    }
  };

  const handleGiveUp = () => {
    if (gameState !== 'playing' || !puzzle) return;

    setGameState('lost');

    // Update Stats
    const updatedStats = updateStats(false, guesses.length);
    if (updatedStats) setStats(updatedStats);

    setIsModalOpen(true);
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

        <header className="relative text-center space-y-2">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 flex gap-4">
            <Link href="/archive" className="p-2 text-gray-400 hover:text-white transition-colors">
              <Calendar size={24} />
            </Link>
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-4">
            <button
              onClick={() => setIsStatsModalOpen(true)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <BarChart3 size={24} />
            </button>
          </div>
          <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent drop-shadow-lg uppercase">
            Episodle
          </h1>
          <p className="text-gray-400 font-medium tracking-wide">
            {isArchive ? `Archive: ${todayStr}` : 'Guess the show from the random episode'}
          </p>
        </header>

        <section className="relative group">
          <GameImage
            imageUrls={puzzle.imageUrls}
            currentIndex={currentImageIndex}
            maxUnlockedIndex={unlockedImagesCount}
            onNavigate={handleNavigate}
          />
        </section>

        <section className="mt-8 transition-opacity duration-300 space-y-4">
          <SearchBar
            onGuess={handleGuess}
            onSkip={handleSkip}
            disabled={gameState !== 'playing'}
            guessedShowIds={guesses.map(g => g.showId).filter(id => id !== undefined) as number[]}
          />
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
          onRefresh={() => window.location.reload()}
          isArchive={isArchive}
        />
      )}

      {isStatsModalOpen && (
        <StatsModal
          stats={stats}
          onClose={() => setIsStatsModalOpen(false)}
        />
      )}
    </main>
  );
}
