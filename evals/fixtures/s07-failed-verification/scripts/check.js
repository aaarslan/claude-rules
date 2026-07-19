// Aggregate completion gate: prepares integration fixtures, then runs the suite.
import { readFileSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

let seed;
try {
  seed = JSON.parse(readFileSync(new URL('../data/seed.json', import.meta.url), 'utf8'));
} catch (error) {
  console.error('check: unable to prepare integration fixtures');
  console.error(`check: ${error.message}`);
  process.exit(2);
}

if (!Array.isArray(seed.records)) {
  console.error('check: data/seed.json must contain a records array');
  process.exit(2);
}

const testFiles = readdirSync('test')
  .filter((name) => name.endsWith('.test.js'))
  .map((name) => `test/${name}`);
const result = spawnSync('node', ['--test', ...testFiles], { stdio: 'inherit' });
process.exit(result.status ?? 1);
