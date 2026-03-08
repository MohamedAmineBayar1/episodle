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

        const ids = data.results.map(r => r.id);
        showIds.push(...ids);
        console.log(`Done. Found ${ids.length} shows.`);
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
