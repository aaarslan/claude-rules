#!/usr/bin/env node
// Score observed rule-file loads against the pre-registered expected sets and
// apply the Phase 0 gate. Loads come from extract-loads.mjs, which counts only
// real reads; never feed this a path grep over a transcript.
// Usage: score-gate.mjs <claude|codex> <log-directory> [run-prefix]
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RUNS, GATE_PERCENT } from './expected-sets.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const [, , surface, logDirectory, prefix = 'p0'] = process.argv;
if (!surface || !logDirectory) {
  console.error('usage: score-gate.mjs <claude|codex> <log-directory> [run-prefix]');
  process.exit(2);
}

const percent = (part, whole) => (whole === 0 ? 0 : Math.round((part / whole) * 1000) / 10);
let totalLoaded = 0;
let totalRequired = 0;

console.log(`surface: ${surface}   expected sets: pre-registered in expected-sets.mjs\n`);

for (const run of RUNS) {
  const name = `${prefix}-${surface}-${run.id}`;
  // Claude Code emits stream-json on stdout; Codex logs to stderr.
  const candidates = [`${name}.transcript.jsonl`, `${name}.stderr`, `${name}.transcript.txt`];
  const transcript = candidates
    .map((candidate) => path.join(logDirectory, candidate))
    .find((candidate) => existsSync(candidate));

  if (!transcript) {
    console.log(`--- ${run.id} (${run.route}) --- NO TRANSCRIPT, run incomplete\n`);
    continue;
  }

  const output = execFileSync('node', [path.join(here, 'extract-loads.mjs'), surface, transcript], {
    encoding: 'utf8',
  }).trim();
  const loaded = new Set(output ? output.split('\n') : []);
  const hit = run.required.filter((rule) => loaded.has(rule));
  const missing = run.required.filter((rule) => !loaded.has(rule));
  const extra = [...loaded].filter((rule) => !run.required.includes(rule));

  totalLoaded += hit.length;
  totalRequired += run.required.length;

  console.log(`--- ${run.id} (${run.route}) --- ${hit.length}/${run.required.length} required`
    + ` = ${percent(hit.length, run.required.length)}%`);
  console.log(`  loaded:  ${hit.join(', ') || '(none)'}`);
  console.log(`  MISSING: ${missing.join(', ') || '(none)'}`);
  console.log(`  extra:   ${extra.join(', ') || '(none)'}\n`);
}

const overall = percent(totalLoaded, totalRequired);
const verdict = overall >= GATE_PERCENT ? 'PASS' : 'FAIL';
console.log(`${surface} surface total: ${totalLoaded}/${totalRequired} = ${overall}%`);
console.log(`gate (${GATE_PERCENT}% of route-expected files): ${verdict}`);
process.exit(verdict === 'PASS' ? 0 : 1);
