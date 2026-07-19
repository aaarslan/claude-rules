#!/usr/bin/env node
// Package one run's evidence: loads, commands with true exit statuses,
// covariates. Never writes the arm. Usage:
//   package-run.mjs <claude|codex> <transcript> <packet-dir> [injected-list]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const [, , surface, transcript, packetDir, injectedList] = process.argv;
const RULE = /agent-rules\/([A-Za-z0-9_.\-/]*\.md)/g;
// A shell read verb counts as a load; a listing never does.
const READ_VERB = /\b(cat|head|tail|sed|nl|less|bat)\b/;
const plain = (s) => s.replace(/\x1b?\[[0-9;]*[A-Za-z]/g, '');
const grab = (t) => [...t.matchAll(RULE)].map((m) => m[1]);
// A pipeline's exit status is the last stage's, so `cmd | tail` reports 0 even
// when cmd failed. Never infer success for a piped command.
const piped = (c) => /\|(?!\|)/.test(c);

const reads = new Set(); const commands = [];
let tools = 0; let model = ''; let usage = null;

if (surface === 'claude') {
  const pending = new Map();
  for (const line of readFileSync(transcript, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    let ev; try { ev = JSON.parse(line); } catch { continue; }
    if (ev.type === 'assistant' && ev.message?.model) model = ev.message.model;
    if (ev.type === 'result') usage = ev.usage;
    const content = ev?.message?.content;
    if (!Array.isArray(content)) continue;
    for (const b of content) {
      if (b.type === 'tool_use') {
        tools += 1;
        if (b.name === 'Read' && b.input?.file_path) grab(b.input.file_path).forEach((r) => reads.add(r));
        if (b.name === 'Bash' && typeof b.input?.command === 'string') {
          if (READ_VERB.test(b.input.command)) grab(b.input.command).forEach((r) => reads.add(r));
          pending.set(b.id, b.input.command);
        }
      }
      if (b.type === 'tool_result' && pending.has(b.tool_use_id)) {
        const cmd = pending.get(b.tool_use_id);
        const out = plain(typeof b.content === 'string' ? b.content
          : (b.content ?? []).map((x) => x.text ?? '').join(''));
        const stated = out.match(/Exit code (\d+)/);
        const status = stated ? `exit ${stated[1]}`
          : b.is_error ? 'error (non-zero or blocked)'
            : piped(cmd) ? 'exit status masked by pipeline; see output' : 'exit 0';
        commands.push({ cmd, status, tail: out.split('\n').slice(-6).join('\n').slice(0, 500) });
        pending.delete(b.tool_use_id);
      }
    }
  }
} else {
  // Codex banners use either quoting style and may wrap across lines; the
  // status follows as "succeeded in Nms" or "exited N in Nms".
  const txt = plain(readFileSync(transcript, 'utf8'));
  for (const chunk of txt.split(/bin\/(?:zsh|bash|sh) -lc /).slice(1)) {
    const cut = chunk.search(/" in \/|' in \//);
    const cmd = (cut > 0 ? chunk.slice(0, cut + 1) : chunk.slice(0, 300))
      .replace(/^['"]|['"]$/g, '').replace(/\s+/g, ' ').trim();
    const rest = chunk.slice(cut > 0 ? cut : 0, (cut > 0 ? cut : 0) + 4000);
    const m = rest.match(/\b(?:succeeded|exited (\d+))\b in \d+/);
    const status = m?.[1] !== undefined ? `exit ${m[1]}`
      : !m ? 'status not captured'
        : piped(cmd) ? 'exit status masked by pipeline; see output' : 'exit 0';
    if (READ_VERB.test(cmd)) grab(cmd).forEach((r) => reads.add(r));
    tools += 1;
    commands.push({ cmd, status, tail: rest.split('\n').slice(-6).join('\n').slice(0, 500) });
    if (!model) model = (rest.match(/model:\s*([A-Za-z0-9.\-]+)/) ?? [])[1] ?? '';
  }
}

const injected = injectedList && existsSync(injectedList)
  ? readFileSync(injectedList, 'utf8').split('\n').filter(Boolean) : [];
const list = (a) => (a.length ? a.map((f) => `- ${f}`).join('\n') : '- (none)');
writeFileSync(`${packetDir}/loads.md`, ['# Rule files in context for this run', '',
  '## Delivered mechanically (hook injection)', list(injected), '',
  '## Read by the model', list([...reads].sort()), '',
  'Counting rule: a Read-style call or a shell read verb, never a listing.', ''].join('\n'));

// Caps keep this inside the repo's line budget. Never truncate silently: what
// was dropped is stated, and the transcript remains the complete record.
const one = (s) => s.replace(/\s+/g, ' ').trim(); const ROWS = 60; const EXPAND = 4;
const failed = commands.map((c, i) => ({ ...c, i: i + 1 })).filter((c) => !/^exit 0$/.test(c.status) && c.tail);
const rows = commands.slice(0, ROWS).map((c, i) => `| ${i + 1} | \`${one(c.cmd).slice(0, 110)}\` | ${c.status} |`);
if (commands.length > ROWS) rows.push(`| … | ${commands.length - ROWS} more, see transcript | … |`);
writeFileSync(`${packetDir}/commands.md`, ['# Commands and exit statuses', '',
  '| # | Command | Status |', '| --- | --- | --- |',
  ...(rows.length ? rows : ['| - | (none recorded) | - |']), '',
  failed.length ? `## Output of commands not reporting exit 0 (${Math.min(failed.length, EXPAND)} of ${failed.length})` : '',
  ...failed.slice(0, EXPAND).map((c) => `\n### ${c.i}\n\n\`\`\`\n${c.tail}\n\`\`\``), '',
  'Full output for every command is in the transcript.', ''].join('\n'));

const n = (v) => v ?? '(not reported)';
writeFileSync(`${packetDir}/covariates.md`, ['# Covariates', '',
  `- Model reported: ${model || '(not reported in transcript)'}`,
  `- Tool calls / shell invocations: ${tools}`,
  `- Output tokens: ${n(usage?.output_tokens)} | Input tokens: ${n(usage?.input_tokens)}`,
  `- Cache read tokens: ${n(usage?.cache_read_input_tokens)}`,
  `- Rule files injected: ${injected.length} | read: ${reads.size}`, ''].join('\n'));

console.log(`${tools} invocations, ${injected.length} injected, ${reads.size} read`);
