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
  const now = dateStr ? new Date(dateStr) : new Date();
  const y = now.getFullYear();
  const m = (now.getMonth() + 1).toString().padStart(2, '0');
  const d = now.getDate().toString().padStart(2, '0');
  return parseInt(`${y}${m}${d}`);
};
