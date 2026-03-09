import { seedRandom, getDailySeed, getDaysSinceEpoch } from './rng';
import { getShowDetails, getSeasonDetails, getEpisodeImages } from './tmdb';
import { SERIES_POOL } from './seriesPool';

export interface DailyPuzzle {
    showId: number;
    showName: string;
    imageUrls: string[];
    firstAirDate: string;
    genres: string[];
}

// Ensure the puzzle stays the same for a given day, or use manual seed/date for testing
export async function getDailyPuzzle(manualSeed?: number, dateStr?: string): Promise<DailyPuzzle> {
    const seed = manualSeed !== undefined ? manualSeed : getDailySeed(dateStr);
    const rng = seedRandom(seed);
    const dayOffset = getDaysSinceEpoch(dateStr);
    const baseIndex = dayOffset % SERIES_POOL.length;

    // Stage 1: Try to find a single episode with at least 6 stills
    // Since our pool is now pre-verified, the first show should almost always work.
    for (let i = 0; i < Math.min(SERIES_POOL.length, 10); i++) {
        const showId = SERIES_POOL[(baseIndex + i) % SERIES_POOL.length];

        try {
            const showDetails = await getShowDetails(showId);
            if (!showDetails || !showDetails.seasons) continue;

            const validSeasons = showDetails.seasons.filter((s: any) => s.season_number > 0 && s.episode_count > 0);
            if (validSeasons.length === 0) continue;

            const seasonIndex = Math.floor(rng() * validSeasons.length);
            const selectedSeason = validSeasons[seasonIndex];

            const seasonData = await getSeasonDetails(showId, selectedSeason.season_number);
            const episodesWithStills = seasonData.episodes.filter((ep: any) => ep.still_path);

            if (episodesWithStills.length === 0) continue;

            const episodeIndex = Math.floor(rng() * episodesWithStills.length);
            const selectedEpisode = episodesWithStills[episodeIndex];

            const imagesData = await getEpisodeImages(showId, selectedSeason.season_number, selectedEpisode.episode_number);
            const stills = imagesData.stills || [];

            if (stills.length >= 6) {
                const selectedStills: string[] = [];
                const indices = Array.from({ length: stills.length }, (_, i) => i);
                for (let j = 0; j < 6; j++) {
                    const idx = Math.floor(rng() * indices.length);
                    const stillIdx = indices.splice(idx, 1)[0];
                    selectedStills.push(`https://image.tmdb.org/t/p/original${stills[stillIdx].file_path}`);
                }
                return {
                    showId: showId,
                    showName: showDetails.name,
                    imageUrls: selectedStills,
                    firstAirDate: showDetails.first_air_date,
                    genres: showDetails.genres.map((g: any) => g.name),
                };
            }
        } catch (e) {
            console.error(`Error processing show ${showId}:`, e);
        }
    }

    // Stage 2: Fallback - Collect 6 stills from any episodes of the same show
    for (let i = 0; i < Math.min(SERIES_POOL.length, 5); i++) { // Try first 5 candidate shows for fallback
        const showId = SERIES_POOL[(baseIndex + i) % SERIES_POOL.length];

        try {
            const showDetails = await getShowDetails(showId);
            if (!showDetails || !showDetails.seasons) continue;

            const validSeasons = showDetails.seasons.filter((s: any) => s.season_number > 0 && s.episode_count > 0);
            if (validSeasons.length === 0) continue;

            const collectedStills: string[] = [];
            for (const s of validSeasons) {
                try {
                    const seasonData = await getSeasonDetails(showId, s.season_number);
                    for (const episode of seasonData.episodes) {
                        if (episode.still_path) {
                            collectedStills.push(`https://image.tmdb.org/t/p/original${episode.still_path}`);
                        }
                        if (collectedStills.length >= 6) break;
                    }
                } catch (e) { }
                if (collectedStills.length >= 6) break;
            }

            if (collectedStills.length >= 6) {
                return {
                    showId: showId,
                    showName: showDetails.name,
                    imageUrls: collectedStills,
                    firstAirDate: showDetails.first_air_date,
                    genres: showDetails.genres.map((g: any) => g.name),
                };
            }
        } catch (e) { }
    }

    throw new Error('Could not find enough high-quality stills from any show in the pool.');
}
