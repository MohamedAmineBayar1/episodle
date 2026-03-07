export interface Stats {
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    maxStreak: number;
    guessDistribution: number[]; // [wins on 1, 2, 3, 4, 5, 6]
    lastWonDate?: string; // YYYY-MM-DD
    lastPlayedDate?: string; // YYYY-MM-DD
}

const STATS_KEY = 'episodle-stats';
const GAME_STATE_PREFIX = 'episodle-';

export const getInitialStats = (): Stats => ({
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
});

export const getStats = (): Stats => {
    if (typeof window === 'undefined') return getInitialStats();
    const saved = localStorage.getItem(STATS_KEY);
    if (!saved) return getInitialStats();
    try {
        const stats = JSON.parse(saved);
        // Ensure guessDistribution exists for backward compatibility if needed
        if (!stats.guessDistribution) stats.guessDistribution = [0, 0, 0, 0, 0, 0];
        return stats;
    } catch (e) {
        return getInitialStats();
    }
};

export const updateStats = (win: boolean, guessCount: number) => {
    if (typeof window === 'undefined') return;
    const stats = getStats();
    const today = new Date().toLocaleDateString('en-CA');

    // Don't update if already played today (unless archive mode, but stats are usually for daily)
    // Actually, for archive mode, we might want separate stats or ignore them.
    // The request says "When a game ends (Win or Loss), update these stats immediately."
    // Typically Wordle stats only count the daily game once.

    if (stats.lastPlayedDate === today) return;

    stats.gamesPlayed += 1;
    stats.lastPlayedDate = today;

    if (win) {
        stats.gamesWon += 1;
        stats.guessDistribution[guessCount - 1] += 1;

        // Streak logic
        if (stats.lastWonDate) {
            const lastWon = new Date(stats.lastWonDate);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toLocaleDateString('en-CA');

            if (stats.lastWonDate === yesterdayStr) {
                stats.currentStreak += 1;
            } else {
                stats.currentStreak = 1;
            }
        } else {
            stats.currentStreak = 1;
        }

        if (stats.currentStreak > stats.maxStreak) {
            stats.maxStreak = stats.currentStreak;
        }
        stats.lastWonDate = today;
    } else {
        stats.currentStreak = 0;
    }

    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    return stats;
};

export const saveGameState = (date: string, state: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${GAME_STATE_PREFIX}${date}`, JSON.stringify(state));
};

export const getGameState = (date: string) => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem(`${GAME_STATE_PREFIX}${date}`);
    if (!saved) return null;
    try {
        return JSON.parse(saved);
    } catch (e) {
        return null;
    }
};

export const hasPlayedDate = (date: string): 'won' | 'lost' | null => {
    const state = getGameState(date);
    if (!state) return null;
    if (state.gameState === 'won') return 'won';
    if (state.gameState === 'lost') return 'lost';
    return null;
};
