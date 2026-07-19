#!/usr/bin/env node
// Extract the rule files an agent actually READ from a run transcript.
// A naive path grep over-counts: one directory listing puts every corpus file
// in the transcript, which scored 100% on a Phase 0 run that read zero rule
// files. Only Read-style tool calls and shell read verbs count as a load.
// Usage: extract-loads.mjs <claude|codex> <transcript>
import { readFileSync } from 'node:fs';

const [, , surface, file] = process.argv;
if (!surface || !file) {
  console.error('usage: extract-loads.mjs <claude|codex> <transcript>');
  process.exit(2);
}

const RULE = /agent-rules\/([A-Za-z0-9_.\-/]*\.md)/g;
const READ_VERB = /\b(cat|head|tail|sed|nl|less|bat)\b/;
const paths = (text) => [...text.matchAll(RULE)].map((match) => match[1]);
const loaded = new Set();
const add = (text) => paths(text).forEach((rule) => loaded.add(rule));
const rows = readFileSync(file, 'utf8').split('\n');

if (surface === 'claude') {
  // Claude Code stream-json: one JSON event per line.
  for (const row of rows) {
    if (!row.trim()) continue;
    let event;
    try { event = JSON.parse(row); } catch { continue; }
    const content = event?.message?.content;
    if (!Array.isArray(content)) continue;
    for (const block of content) {
      if (block.type !== 'tool_use') continue;
      const { name, input = {} } = block;
      if (name === 'Read' && input.file_path) add(input.file_path);
      // A read performed through the shell still counts as a load.
      if (name === 'Bash' && typeof input.command === 'string'
        && READ_VERB.test(input.command)) add(input.command);
    }
  }
} else if (surface === 'codex') {
  // Codex echoes each shell invocation as `/bin/zsh -lc "..." in <dir>`.
  for (const row of rows) {
    if (!/\/bin\/(zsh|bash|sh) -lc/.test(row)) continue;
    if (!READ_VERB.test(row)) continue;
    add(row);
  }
} else {
  console.error(`unknown surface: ${surface}`);
  process.exit(2);
}

console.log([...loaded].sort().join('\n'));
