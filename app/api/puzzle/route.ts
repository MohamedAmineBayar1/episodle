import { getDailyPuzzle } from '@/lib/gameLogic';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const seedStr = searchParams.get('seed');
        const dateStr = searchParams.get('date');
        const manualSeed = seedStr ? parseInt(seedStr) : undefined;

        if (dateStr) {
            // Validate YYYY-MM-DD
            if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
            }

            const [year, month, day] = dateStr.split('-').map(Number);
            const dateObj = new Date(year, month - 1, day);
            if (
                dateObj.getFullYear() !== year ||
                dateObj.getMonth() !== month - 1 ||
                dateObj.getDate() !== day
            ) {
                return NextResponse.json({ error: 'Invalid calendar date' }, { status: 400 });
            }

            // Allow dates up to the furthest timezone on Earth (UTC+14) to prevent timezone bugs
            // where a user is legitimately on the next day relative to the server's UTC time.
            const maxDateStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Pacific/Kiritimati' });
            if (dateStr > maxDateStr) {
                return NextResponse.json({ error: 'Date is in the future' }, { status: 400 });
            }
        }

        console.log("Fetching daily puzzle...", manualSeed ? `(Manual Seed: ${manualSeed})` : (dateStr ? `(Date: ${dateStr})` : ""));
        const puzzle = await getDailyPuzzle(manualSeed, dateStr || undefined);
        console.log("Successfully generated puzzle:", puzzle.showName);
        return NextResponse.json(puzzle);
    } catch (error: any) {
        console.error("Puzzle API Error Caught:", error);
        return NextResponse.json({ error: error.message || 'Failed to fetch puzzle' }, { status: 500 });
    }
}
