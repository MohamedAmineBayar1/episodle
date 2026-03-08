import { seedRandom, getDailySeed } from './rng';
import { getPopularShows, getShowDetails, getSeasonDetails, getEpisodeImages } from './tmdb';

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

    // Fetch a larger pool of shows to ensure stability if rankings shift
    // We'll fetch 3 pages (60 shows) and sort them by ID
    let allPopularShows: any[] = [];
    try {
        const pages = [1, 2, 3];
        const results = await Promise.all(pages.map(p => getPopularShows(p)));
        allPopularShows = results.flatMap(r => r.results || []);
    } catch (e) {
        console.error("Error fetching popular shows for pool:", e);
    }

    if (allPopularShows.length === 0) {
        throw new Error('Could not fetch any popular shows.');
    }

    // Sort by ID to ensure a stable order regardless of TMDb's real-time ranking shifts
    allPopularShows.sort((a, b) => a.id - b.id);

    // Stage 1: Try to find a single episode with at least 6 stills from the pool
    // We'll shuffle the indices of our stable pool
    const poolIndices = Array.from({ length: allPopularShows.length }, (_, i) => i);
    // Fisher-Yates shuffle using our seeded RNG
    for (let i = poolIndices.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [poolIndices[i], poolIndices[j]] = [poolIndices[j], poolIndices[i]];
    }

    for (const itemIndex of poolIndices) {
        const selectedShow = allPopularShows[itemIndex];
        if (!selectedShow) continue;

        const showDetails = await getShowDetails(selectedShow.id);
        const validSeasons = showDetails.seasons.filter((s: any) => s.season_number > 0 && s.episode_count > 0);
        if (validSeasons.length === 0) continue;

        const seasonIndex = Math.floor(rng() * validSeasons.length);
        const selectedSeason = validSeasons[seasonIndex];

        try {
            const seasonData = await getSeasonDetails(selectedShow.id, selectedSeason.season_number);
            const episodesWithStills = seasonData.episodes.filter((ep: any) => ep.still_path);

            if (episodesWithStills.length === 0) continue;

            const episodeIndex = Math.floor(rng() * episodesWithStills.length);
            const selectedEpisode = episodesWithStills[episodeIndex];

            const imagesData = await getEpisodeImages(selectedShow.id, selectedSeason.season_number, selectedEpisode.episode_number);
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
                    showId: selectedShow.id,
                    showName: selectedShow.name,
                    imageUrls: selectedStills,
                    firstAirDate: showDetails.first_air_date,
                    genres: showDetails.genres.map((g: any) => g.name),
                };
            }
        } catch (e) { }
    }

    // Stage 2: Fallback - Collect 6 stills from any episodes of the same show (using the same stable pool)
    for (const itemIndex of poolIndices) {
        const selectedShow = allPopularShows[itemIndex];
        const showDetails = await getShowDetails(selectedShow.id);
        if (!showDetails || !showDetails.seasons) continue;

        const validSeasons = showDetails.seasons.filter((s: any) => s.season_number > 0 && s.episode_count > 0);
        if (validSeasons.length === 0) continue;

        const collectedStills: string[] = [];

        for (const s of validSeasons) {
            try {
                const seasonData = await getSeasonDetails(selectedShow.id, s.season_number);
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
                showId: selectedShow.id,
                showName: selectedShow.name,
                imageUrls: collectedStills,
                firstAirDate: showDetails.first_air_date,
                genres: showDetails.genres.map((g: any) => g.name),
            };
        }
    }

    throw new Error('Could not find enough high-quality stills from any show in the pool.');
}
