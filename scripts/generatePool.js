const fs = require('fs');

const API_KEY = '85e9c69c4ca390d9f14960b8c01ece60';
const BASE_URL = 'https://api.themoviedb.org/3';

async function fetchFromTMDB(endpoint, params = {}) {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', API_KEY);
    url.searchParams.append('language', 'en-US');
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`TMDb Error: ${response.statusText}`);
    return response.json();
}

async function generatePool() {
    console.log("Starting pool generation...");
    const showIds = [];
    const PAGES_TO_FETCH = 21; // 21 * 20 = 420 shows

    for (let page = 1; page <= PAGES_TO_FETCH; page++) {
        process.stdout.write(`Fetching page ${page}... `);
        const data = await fetchFromTMDB('/discover/tv', {
            page: page.toString(),
            with_type: '2', // Scripted
            'vote_count.gte': '100', // Lowered to get a larger pool (~400 shows)
            with_original_language: 'en',
            sort_by: 'popularity.desc'
        });

        for (const show of data.results) {
            process.stdout.write(`.`);
            try {
                // Check if the show has at least one episode with 6 stills
                const showDetails = await fetchFromTMDB(`/tv/${show.id}`);
                const validSeasons = showDetails.seasons.filter(s => s.season_number > 0 && s.episode_count > 0);

                let foundValid = false;
                let collectedTotal = 0;

                // Check up to 3 seasons for at least 6 stills total
                for (let sIdx = 0; sIdx < Math.min(validSeasons.length, 3); sIdx++) {
                    const season = validSeasons[sIdx];
                    const seasonData = await fetchFromTMDB(`/tv/${show.id}/season/${season.season_number}`);
                    for (const ep of seasonData.episodes) {
                        if (ep.still_path) collectedTotal++;
                        if (collectedTotal >= 6) {
                            foundValid = true;
                            break;
                        }
                    }
                    if (foundValid) break;
                }

                if (foundValid) {
                    showIds.push(show.id);
                }
            } catch (e) {
                // Skip on error
            }
        }
        console.log(` Done. Pool size: ${showIds.length}`);
    }

    // Deduplicate just in case
    const uniqueIds = [...new Set(showIds)];
    console.log(`Total unique high-quality shows found: ${uniqueIds.length}`);

    // Shuffle once to randomize the game sequence initial order
    for (let i = uniqueIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [uniqueIds[i], uniqueIds[j]] = [uniqueIds[j], uniqueIds[i]];
    }

    const output = `export const SERIES_POOL = ${JSON.stringify(uniqueIds, null, 2)};\n`;
    fs.writeFileSync('lib/seriesPool.ts', output);
    console.log("Saved to lib/seriesPool.ts");
}

generatePool().catch(console.error);
