import { getDailyPuzzle } from './lib/gameLogic';

async function test() {
    console.log("Starting puzzle generation test...");
    try {
        const puzzle = await getDailyPuzzle();
        console.log("Daily Puzzle Generated Successfully:");
        console.log(JSON.stringify(puzzle, null, 2));
    } catch (e) {
        console.error("Test Failed with error:");
        console.error(e);
    }
}
test().then(() => console.log("Test finished."));
