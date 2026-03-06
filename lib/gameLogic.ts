import { seedRandom, getDailySeed } from './rng';
import { getPopularShows, getShowDetails, getSeasonDetails, getEpisodeImages } from './tmdb';

export interface DailyPuzzle {
    showId: number;
    showName: string;
    imageUrls: string[];
    firstAirDate: string;
    genres: string[];
}

// Ensure the puzzle stays the same for a given day, or use manual seed for testing
export async function getDailyPuzzle(manualSeed?: number): Promise<DailyPuzzle> {
    const seed = manualSeed !== undefined ? manualSeed : getDailySeed();
    const rng = seedRandom(seed);

    // Stage 1: Try to find a single episode with at least 6 stills
    for (let i = 0; i < 30; i++) {
        const page = Math.floor(rng() * 25) + 1;
        const itemIndex = Math.floor(rng() * 20);

        const popularShows = await getPopularShows(page);
        const selectedShow = popularShows.results[itemIndex];
        const showDetails = await getShowDetails(selectedShow.id);

        const validSeasons = showDetails.seasons.filter((s: any) => s.season_number > 0 && s.episode_count > 0);
        if (validSeasons.length === 0) continue;

        const seasonIndex = Math.floor(rng() * validSeasons.length);
        const selectedSeason = validSeasons[seasonIndex];

        try {
            // Fetch all episode details for the selected season
            const seasonData = await getSeasonDetails(selectedShow.id, selectedSeason.season_number);
            const episodesWithStills = seasonData.episodes.filter((ep: any) => ep.still_path);

            if (episodesWithStills.length === 0) continue;

            // Pick a random episode from those that have at least one still
            const episodeIndex = Math.floor(rng() * episodesWithStills.length);
            const selectedEpisode = episodesWithStills[episodeIndex];

            // Now, get all stills for this specific episode
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

    // Stage 2: Optimized Fallback - Collect 6 stills from any episodes of the same show
    for (let i = 0; i < 30; i++) {
        const page = Math.floor(rng() * 25) + 1;
        const itemIndex = Math.floor(rng() * 20);

        const popularShows = await getPopularShows(page);
        const selectedShow = popularShows.results[itemIndex];
        const showDetails = await getShowDetails(selectedShow.id);

        const validSeasons = showDetails.seasons.filter((s: any) => s.season_number > 0 && s.episode_count > 0);
        if (validSeasons.length === 0) continue;

        const collectedStills: string[] = [];

        // Check seasons until we have enough stills
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

    throw new Error('Could not find enough high-quality stills from any show/episode.');
}
