// Parses every source and test file with `node --check` so syntax errors are
// caught before anything is imported.
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const roots = ['src', 'test', 'scripts'];

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

let failures = 0;
for (const root of roots) {
  for (const file of jsFilesIn(root)) {
    try {
      execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
    } catch (error) {
      failures += 1;
      console.error(`${file}\n${error.stderr?.toString() ?? error.message}`);
    }
  }
}

if (failures > 0) {
  console.error(`typecheck: ${failures} file(s) failed to parse`);
  process.exit(1);
}
console.log('typecheck: all files parsed');
