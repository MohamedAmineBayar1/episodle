import { NextRequest, NextResponse } from 'next/server';
import { searchShows } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ results: [] });
    }

    try {
        const data = await searchShows(query);
        // Return only top 5 results to keep UI clean
        const results = (data.results || []).slice(0, 5).map((show: any) => ({
            id: show.id,
            name: show.name,
            first_air_date: show.first_air_date,
        }));
        return NextResponse.json({ results });
    } catch (error) {
        console.error("Search API Error:", error);
        return NextResponse.json({ error: "Failed to search" }, { status: 500 });
    }
}
