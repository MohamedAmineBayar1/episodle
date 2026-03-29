export interface Stats {
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    maxStreak: number;
    guessDistribution: number[]; // [wins on 1, 2, 3, 4, 5, 6]
    lastWonDate?: string; // YYYY-MM-DD
    lastPlayedDate?: string; // YYYY-MM-DD
}

export interface DailyStreak {
    streak: number;           // Current consecutive days played (win or loss)
    lastPlayedDate: string;   // YYYY-MM-DD of last completed daily game
    restores: number;         // Shield restores remaining this month (max 3)
    lastRestoreMonth: string; // YYYY-MM to detect monthly refresh
}

const STATS_KEY = 'episodle-stats';
const GAME_STATE_PREFIX = 'episodle-';
const DAILY_STREAK_KEY = 'episodle-daily-streak';
const MAX_RESTORES = 3;

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

// ─── Daily Streak (win OR loss counts) ───────────────────────────────────────

const getCurrentMonth = (): string => {
    return new Date().toLocaleDateString('en-CA').substring(0, 7); // YYYY-MM
};

export const getInitialDailyStreak = (): DailyStreak => ({
    streak: 0,
    lastPlayedDate: '',
    restores: MAX_RESTORES,
    lastRestoreMonth: getCurrentMonth(),
});

export const getDailyStreak = (): DailyStreak => {
    if (typeof window === 'undefined') return getInitialDailyStreak();
    const saved = localStorage.getItem(DAILY_STREAK_KEY);
    let data: DailyStreak;
    if (!saved) {
        data = getInitialDailyStreak();
    } else {
        try {
            data = JSON.parse(saved);
        } catch (e) {
            data = getInitialDailyStreak();
        }
    }
    // Monthly restore refresh
    const thisMonth = getCurrentMonth();
    if (data.lastRestoreMonth !== thisMonth) {
        data.restores = MAX_RESTORES;
        data.lastRestoreMonth = thisMonth;
        localStorage.setItem(DAILY_STREAK_KEY, JSON.stringify(data));
    }
    return data;
};

/**
 * Call this when the daily game ends (win or loss, not archive).
 * Returns { streakBroken, missedDays } so the UI can prompt for a restore.
 */
export const recordDailyPlay = (date: string): { streakBroken: boolean; missedDays: number } => {
    if (typeof window === 'undefined') return { streakBroken: false, missedDays: 0 };
    const data = getDailyStreak();

    // Already recorded for this date — idempotent
    if (data.lastPlayedDate === date) return { streakBroken: false, missedDays: 0 };

    let streakBroken = false;
    let missedDays = 0;

    if (data.lastPlayedDate) {
        const last = new Date(data.lastPlayedDate);
        const current = new Date(date);
        const diffMs = current.getTime() - last.getTime();
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Perfect — consecutive day
            data.streak += 1;
        } else if (diffDays > 1) {
            // Gap detected
            streakBroken = true;
            missedDays = diffDays - 1;
            data.streak = 1; // Reset (restore can override this)
        }
        // diffDays <= 0 shouldn't happen for daily games, ignore
    } else {
        // First ever play
        data.streak = 1;
    }

    data.lastPlayedDate = date;
    localStorage.setItem(DAILY_STREAK_KEY, JSON.stringify(data));
    return { streakBroken, missedDays };
};

/**
 * Use one restore to bridge a missed day. Returns true if successful.
 * Call this BEFORE recordDailyPlay if a gap was detected and user chooses to restore.
 */
export const useStreakRestore = (): boolean => {
    if (typeof window === 'undefined') return false;
    const data = getDailyStreak();
    if (data.restores <= 0) return false;
    data.restores -= 1;
    // Undo the streak reset — bump back up by 1
    data.streak += 1;
    localStorage.setItem(DAILY_STREAK_KEY, JSON.stringify(data));
    return true;
};

export const saveDailyStreak = (data: DailyStreak): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(DAILY_STREAK_KEY, JSON.stringify(data));
};
