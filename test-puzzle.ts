import { loadEnvConfig } from '@next/env';
import { getDailyPuzzle } from './lib/gameLogic';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

async function test() {
  try {
    const puzzle = await getDailyPuzzle(undefined, '2026-03-20');
    console.log('SUCCESS:', puzzle);
  } catch (error) {
    console.error('FAILURE:', error);
  }
}

test();
