#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SCAN_DIRS = ['src', 'test', 'scripts'];
const problems = [];

function listFiles(dir) {
  const absolute = path.join(ROOT, dir);
  const found = [];
  for (const entry of readdirSync(absolute)) {
    const full = path.join(absolute, entry);
    if (statSync(full).isDirectory()) {
      found.push(...listFiles(path.join(dir, entry)));
    } else if (entry.endsWith('.js') || entry.endsWith('.mjs')) {
      found.push(path.join(dir, entry));
    }
  }
  return found;
}

function lint(relativePath) {
  const source = readFileSync(path.join(ROOT, relativePath), 'utf8');
  const lines = source.split('\n');
  lines.forEach((line, index) => {
    const at = `${relativePath}:${index + 1}`;
    if (line.includes('\t')) {
      problems.push(`${at} tab character; use spaces`);
    }
    if (/[ ]+$/.test(line)) {
      problems.push(`${at} trailing whitespace`);
    }
    if (relativePath.startsWith('src') && line.includes('console.log(')) {
      problems.push(`${at} console logging is not allowed in src`);
    }
  });
  if (!source.endsWith('\n')) {
    problems.push(`${relativePath}: file does not end with a newline`);
  }
}

const files = SCAN_DIRS.flatMap(listFiles);
files.forEach(lint);

const testFiles = files.filter((file) => file.endsWith('.test.js'));
const tests = spawnSync(process.execPath, ['--test', ...testFiles], {
  cwd: ROOT,
  encoding: 'utf8'
});

if (problems.length > 0) {
  for (const problem of problems) {
    console.error(problem);
  }
}

if (tests.status !== 0) {
  console.error(tests.stdout.trimEnd());
  console.error(tests.stderr.trimEnd());
}

process.exit(problems.length > 0 || tests.status !== 0 ? 1 : 0);
