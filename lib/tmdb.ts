const getApiKey = () => {
    const key = process.env.TMDB_API_KEY;
    if (!key) {
        console.warn("DEBUG: TMDB_API_KEY is undefined in process.env");
    } else {
        console.log("DEBUG: TMDB_API_KEY is present (length: " + key.length + ")");
    }
    return key;
};
const BASE_URL = 'https://api.themoviedb.org/3';

async function fetchFromTMDB(endpoint: string, params: Record<string, string> = {}) {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', getApiKey() || '');
    url.searchParams.append('language', 'en-US');

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await fetch(url.toString(), {
        next: { revalidate: 86400 } // Cache for 24 hours
    });

    if (!response.ok) {
        throw new Error(`TMDb API Error: ${response.statusText}`);
    }

    return response.json();
}

export async function getPopularShows(page = 1) {
    return fetchFromTMDB('/discover/tv', {
        page: page.toString(),
        with_type: '2',
        'vote_count.gte': '1000',
        with_original_language: 'en',
        sort_by: 'popularity.desc'
    });
}

export async function searchShows(query: string) {
    if (!query) return { results: [] };
    // Disable caching for search so it's fresh
    const url = new URL(`${BASE_URL}/search/tv`);
    url.searchParams.append('api_key', getApiKey() || '');
    url.searchParams.append('query', query);
    url.searchParams.append('language', 'en-US');

    const response = await fetch(url.toString());
    return response.json();
}

export async function getShowDetails(seriesId: number) {
    return fetchFromTMDB(`/tv/${seriesId}`);
}

export async function getEpisodeDetails(seriesId: number, seasonNumber: number, episodeNumber: number) {
    return fetchFromTMDB(`/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}`);
}

export async function getSeasonDetails(seriesId: number, seasonNumber: number) {
    return fetchFromTMDB(`/tv/${seriesId}/season/${seasonNumber}`);
}

export async function getShowImages(seriesId: number) {
    return fetchFromTMDB(`/tv/${seriesId}/images`, { include_image_language: 'en,null' });
}

export async function getEpisodeImages(seriesId: number, seasonNumber: number, episodeNumber: number) {
    return fetchFromTMDB(`/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}/images`);
}
