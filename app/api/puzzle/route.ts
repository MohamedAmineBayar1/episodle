import { getDailyPuzzle } from '@/lib/gameLogic';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const seedStr = searchParams.get('seed');
        const dateStr = searchParams.get('date');
        const manualSeed = seedStr ? parseInt(seedStr) : undefined;

        console.log("Fetching daily puzzle...", manualSeed ? `(Manual Seed: ${manualSeed})` : (dateStr ? `(Date: ${dateStr})` : ""));
        const puzzle = await getDailyPuzzle(manualSeed, dateStr || undefined);
        console.log("Successfully generated puzzle:", puzzle.showName);
        return NextResponse.json(puzzle);
    } catch (error: any) {
        console.error("Puzzle API Error Caught:", error);
        return NextResponse.json({ error: error.message || 'Failed to fetch puzzle' }, { status: 500 });
    }
}
