# Phase 0 Routing Pilot: Results and Gate Verdict

Run 2026-07-18 against baseline B (`cd58ed4`; the working tree at `cc0de40` is byte-identical across all canonical directories). Six runs, arm B only, one rep each, per [the runbook](../tools/README.md).

## Gate verdict

| Surface | S05 | S07 | C01 | Total | Gate (80%) |
| --- | --- | --- | --- | --- | --- |
| Claude Code 2.1.214 | 0/11 (0%) | 0/14 (0%) | 5/13 (38.5%) | **5/38 = 13.2%** | **FAIL** |
| Codex CLI 0.144.4 | 11/11 (100%) | 14/14 (100%) | 11/13 (84.6%) | **36/38 = 94.7%** | **PASS** |

Per the [decision protocol](../DECISION-PROTOCOL.md), Phase 1 does not start and no redundancy is removed until Claude Code passes. Route-expected sets were fixed before any telemetry was read; they are recorded in the tooling notes alongside the extractor.

## Root cause of the Claude Code failure

The adapter block in [ADOPT.md](../../ADOPT.md), reproduced verbatim by `assemble-run.sh`, states the router as prose:

    Router: `agent-rules/AGENTS.md`.
    Active profile: `agent-rules/profiles/standard.md`.

Claude Code auto-loads `CLAUDE.md`, which is `@AGENTS.md`, which pulls in that six-line host stub. It then stops. The stub *names* the router but never instructs the agent to open it, and `@`-imports do not chase paths mentioned in prose. Claude Code treats the block as descriptive metadata and proceeds straight to the task. On S05 the agent went further and ran `git ls-files | grep -v agent-rules`, deliberately filtering the corpus out of view.

Codex has no import mechanism, so it reads pointer paths literally with `sed` and traverses the route correctly. The corpus is not at fault; the Claude Code adapter is.

**C01 shows the failure has two layers.** With an empty working directory, `agent-rules/` was conspicuous enough that the agent listed it and read `AGENTS.md` on its own. It still loaded only 5 of 13 expected files and skipped every workflow file. So reading the router does not by itself cause the task table to be executed as a load instruction. Fixing only the stub may lift the number without fixing the mechanism.

## Recommended adapter fix, for decision before re-running

Phase 0 explicitly authorizes fixing adapters and repeating, so this does not touch the baseline freeze on rule prose. Options, in increasing strength:

1. Add `@agent-rules/AGENTS.md` to the host `CLAUDE.md` so the router is imported rather than merely named. Cheapest, but imports the router only, not the task row, so it likely reproduces the C01 partial-load pattern.
2. Make the stub imperative: "Before any work, read `agent-rules/AGENTS.md` and load the files its task table lists for this task." Targets the second layer directly.
3. Ship a Claude Code adapter (skill or hook) that performs the route lookup itself, rather than asking the model to.

Options 1 and 2 compose and are worth testing together. This choice belongs to the protocol owner; it is not made here.

## Two runbook defects found

- **The telemetry grep over-counts to 100%.** `grep -oh 'agent-rules/[A-Za-z0-9_./-]*\.md' <log> | sort -u` returned all 44 corpus files for the Claude S05 run, which read **zero** of them: one `git ls-files` listing puts every path in the transcript. The grep measures mention, not load, and would have reported a clean gate pass on a total routing failure. Scoring here used an extractor that counts only paths appearing in a `Read` tool call or next to a shell read verb (`cat`, `sed`, `head`, `tail`, `nl`), never in a listing.
- **`git diff` misses greenfield artifacts.** Both C01 runs produced only untracked files, so the runbook's `git diff > run.diff` step yields an empty file. C01 evidence needs `git add -A` before the diff, or a `git status --porcelain` capture.

## Covariates

| Run | Wall clock | Tool calls | Notes |
| --- | --- | --- | --- |
| claude-s05 | 40s | 11 | 2.1k output tokens |
| claude-s07 | 62s | 14 | 2.9k output tokens |
| claude-c01 | 438s | 36 | 30.6k output tokens; 3 files shipped |
| codex-s05 | 157s | 8 | loaded 5 files beyond the required set |
| codex-s07 | 159s | 15 | exactly the expected set |
| codex-c01 | 3194s | 135 | 17 top-level entries; trips C01 overengineering flags |

## Limitations

One rep per cell, so no variance estimate. The Claude runs used `claude-fable-5`, the CLI default, not a pinned model; the Codex model was likewise unpinned. Claude Code sets `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` in this environment, which forces nested sessions to the default permission mode, so the runs used an explicit `--allowedTools` allowlist instead of a bypass mode; this constrains the tool surface slightly relative to an unconstrained operator session. Per decision rule 5, these results support claims only about these scenarios, models, and surfaces.

The task outcomes are not the finding here. All six runs produced working changes, including the three Claude runs that loaded no rules at all. Phase 0 measures whether routed files load, and arm A is what will show whether loading them changes behavior.
