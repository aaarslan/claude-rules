# Evaluation Result

- **Result ID:** P0-claude-c01
- **Agent product:** Claude Code CLI 2.1.214
- **Model and version:** `claude-fable-5` (CLI default; not pinned by the runbook)
- **Date:** 2026-07-18
- **Repository revision:** `cc0de40`; canonical corpus identical to baseline `cd58ed4`
- **Scenario:** C01 plant tracker (web, greenfield, novice)
- **Run number:** 1
- **Condition:** `rules-on` (arm B)
- **Active profile:** `profiles/standard.md` declared by host `AGENTS.md`; never read
- **Applicable skill or task route:** Feature = Change + Design + `contexts/web-ui.md` (host preselects no context: "select from evidence per the router")
- **Rules and skill actually loaded:** 6 files. `AGENTS.md`, `core/priorities.md`, `core/conventions.md`, `core/anti-slop.md`, `contexts/web-ui.md`, `contexts/ui-styling.md`, plus `tools/contrast-check.mjs`. 5 of 13 route-expected (38.5%).
- **Environment or tool differences:** same `--allowedTools` allowlist as the other Claude runs.
- **Outcome:** `pass` (task), gate contribution `fail`
- **Score:** not scored (Phase 0 primary output is load telemetry)
- **Critical failure:** `no`

## Evidence

- Transcript or artifact location: `scratchpad/logs/p0-claude-c01.transcript.jsonl`
- Diff or commit location: artifacts are untracked, so `git diff` is empty. `git status` shows `index.html`, `app.js`, `style.css` in `/tmp/p0-claude-c01`.
- Commands and exit statuses: `python3 -m http.server` to serve; a jsdom harness driving add-plant, water, reload-persistence, and empty-name paths; `tools/contrast-check.mjs` for colour contrast
- Real behavior exercised: yes, the acceptance flow was driven in a DOM, not merely compiled
- Covariates: 36 tool calls, 438s wall clock, ~30.6k output tokens

## Observation

- Observed failure or successful behavior: three files, no build step, no framework, localStorage persistence. Scope matches the prompt and trips none of the C01 overengineering flags. The agent found the rule corpus only because the directory was otherwise empty: it ran `ls` on the working directory, saw `agent-rules/`, and read `AGENTS.md` on curiosity. From there it selected contexts sensibly (`web-ui`, `ui-styling`) but **skipped every workflow file** and the profile.
- Rule intended to prevent the failure: n/a, the task succeeded
- Was that rule loaded: partially. The router was read, but `workflow/implementation.md`, `workflow/verification.md`, `workflow/skeptic-pass.md`, `workflow/design-checkpoint.md`, `design/principles.md`, `core/evidence-first.md`, `core/communication.md`, and `profiles/standard.md` were not.
- Evaluator rationale: this run is the diagnostic tell for the whole surface. Discovery here was accidental (an empty directory made `agent-rules/` conspicuous) and still produced no route traversal: reading `AGENTS.md` did not cause the agent to load the task row's files. So the Claude Code failure has two layers, not one: the host stub is not followed, and even when the router *is* read, its task table is not executed as a load instruction.
- Model variance or accidental hints: model was `claude-fable-5`. Single rep. The empty directory is itself a hint that does not exist in S05/S07.
- Limitations: n=1; the untracked-artifact capture means the runbook's `git diff` step yields nothing for this fixture and needs `git add -A` or a status capture instead.
