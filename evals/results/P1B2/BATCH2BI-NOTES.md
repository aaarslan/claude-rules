# Batch 2b-i: Execution Notes

Scenarios S11, S12, S13, S14, arms A/B/C, both surfaces, three reps: 72 runs,
executed 2026-07-19 at revision `492c89e`. **No scoring, no verdicts.** Packets
go to graders; [ARM-MAP.md](ARM-MAP.md) does not. Batch-one grades were not
consulted for anything here.

This is the chunk where the corpus's own rules stand trial: CR-1 through S13,
CR-2 through S14, CR-4 through S11 and S12.

## Validity: 72 of 72

Every run completed and packaged. None voided, redone, or discarded.

Neutrality sweep at zero tolerance over all 72 transcripts: `run baseline`,
`arm A/B/C`, fixture labels, `assemble-run`, `evaluator`, `<stdin>`, `rules-on`,
`p1box`, `ARM-MAP`, `packet` all return zero. No transcript references a foreign
checkout path.

One sweep refinement worth recording: an unanchored `b2-[0-9a-f]{8}` pattern
reported five packets as carrying foreign run ids. All five were substrings of
session UUIDs (`…98b2-a3567d77e82e`). Anchoring the pattern to `/tmp/b2-`
returns zero, and only the anchored form is meaningful.

## Codex operator memories

Denied for the batch window and restored afterwards, per the approved
conditions. The driver traps `EXIT`, `INT` and `TERM`; `deny` clears any stale
deny before re-applying so the saved mode is never the denied mode; a probe
confirmed `permission denied` before run 1 and would have aborted the batch
otherwise. Restore fired on completion and `codex-isolate.sh status` reports
mode 755, deny not active. No run attempted to read the memories path.

## Covariates

Means per arm, twelve runs each.

| Surface / arm | n | Wall clock | Tool calls | Output tokens | Injected | Read |
| --- | --- | --- | --- | --- | --- | --- |
| claude / A | 12 | 48s | 13 | 2695 | 0 | 0 |
| claude / B | 12 | 62s | 15 | 3659 | 15 | 0 |
| claude / C | 12 | 55s | 15 | 3106 | 0 | 0 |
| codex / A | 12 | 67s | 7 | n/a | 0 | 0 |
| codex / B | 12 | 139s | 28 | n/a | 15 | 15 |
| codex / C | 12 | 92s | 11 | n/a | 0 | 0 |

Means per scenario, nine runs each.

| Surface / scenario | Wall clock | Tool calls | Output tokens |
| --- | --- | --- | --- |
| claude / S11 | 30s | 8 | 1248 |
| claude / S12 | 67s | 18 | 4265 |
| claude / S13 | 73s | 12 | 3910 |
| claude / S14 | 50s | 20 | 3191 |
| codex / S11 | 54s | 8 | n/a |
| codex / S12 | 98s | 17 | n/a |
| codex / S13 | 157s | 21 | n/a |
| codex / S14 | 88s | 14 | n/a |

Codex does not report token usage; its tool-call column counts shell
invocations, which are coarser than Claude's per-tool counts and not comparable
across surfaces. The injected and read columns are mechanical facts about
delivery, not conduct: on Claude the routed files arrive by hook injection, on
Codex they are read.

## Execution conditions

- **Claude:** CLI 2.1.214, `claude-fable-5` pinned, `--setting-sources
  project,local`, explicit `--allowedTools` allowlist now including `echo` and
  `printf` so a run can capture its own exit statuses.
- **Codex:** CLI 0.144.4, `gpt-5.6-sol` pinned, `--sandbox workspace-write`,
  isolated `CODEX_HOME` with memories disabled.
- **Isolation:** agent stdin closed on every run; each checkout in its own
  private parent, so `..` holds no sibling condition.
- **Prompts** were extracted programmatically from the four scenario files
  rather than retyped, including S13's mitigation-authority wording, and
  delivered verbatim with no answers from the runner.
- **Arm order** rotated per surface, rep and scenario. Packaging used the fixed
  extractor: single-quoted exec forms counted, piped exit statuses never
  reported as success, loads counted from shell read verbs.
