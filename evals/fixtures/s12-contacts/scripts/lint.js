// House style check. Kept small and dependency free on purpose.
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const roots = ['src', 'test', 'scripts'];
// Entrypoints and command-line scripts are expected to print.
const MAY_PRINT = ['src/main.js', 'scripts/'];
const problems = [];

function jsFilesIn(dir) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      found.push(...jsFilesIn(path));
    } else if (entry.endsWith('.js')) {
      found.push(path);
    }
  }
  return found;
}

function check(file) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, index) => {
    const at = `${file}:${index + 1}`;
    if (line.length > 100) {
      problems.push(`${at} line exceeds 100 characters`);
    }
    if (/\s+$/.test(line)) {
      problems.push(`${at} trailing whitespace`);
    }
    if (line.includes('\t')) {
      problems.push(`${at} tab indentation, use two spaces`);
    }
    if (/\bvar\s/.test(line)) {
      problems.push(`${at} use const or let instead of var`);
    }
    const mayPrint = MAY_PRINT.some((prefix) => file.startsWith(prefix));
    if (/\bconsole\.log\(/.test(line) && !mayPrint) {
      problems.push(`${at} stray console.log`);
    }
  });
}

for (const root of roots) {
  jsFilesIn(root).forEach(check);
}

if (problems.length > 0) {
  problems.forEach((problem) => console.error(problem));
  console.error(`lint: ${problems.length} problem(s)`);
  process.exit(1);
}
console.log('lint: clean');
