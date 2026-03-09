/**
 * Generates a seeded random number generator (Mulberry32).
 * @param seed A numerical seed (e.g. derived from Date for daily resets).
 */
export function seedRandom(seed: number) {
  return function () {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

/** Helper to get a seed string based on a specific date or today's local date */
export const getDailySeed = (dateStr?: string) => {
  if (dateStr && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [y, m, d] = dateStr.split('-');
    return parseInt(`${y}${m}${d}`);
  }

  const now = new Date();
  const y = now.getFullYear();
  const m = (now.getMonth() + 1).toString().padStart(2, '0');
  const d = now.getDate().toString().padStart(2, '0');
  return parseInt(`${y}${m}${d}`);
};

/** Helper to get days since a fixed epoch (e.g., 2024-01-01) for stable rotation */
export const getDaysSinceEpoch = (dateStr?: string) => {
  const epoch = Date.UTC(2024, 0, 1);
  let targetDate;

  if (dateStr && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [y, m, d] = dateStr.split('-').map(Number);
    targetDate = Date.UTC(y, m - 1, d);
  } else {
    const now = new Date();
    targetDate = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  }

  const diff = targetDate - epoch;
  return Math.round(diff / (1000 * 60 * 60 * 24));
};
