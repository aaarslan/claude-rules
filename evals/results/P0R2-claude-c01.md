# Evaluation Result

- **Result ID:** P0R2-claude-c01
- **Agent product:** Claude Code CLI 2.1.214
- **Model and version:** `claude-fable-5`, pinned with `--model` and confirmed in the transcript
- **Date:** 2026-07-18
- **Repository revision:** `cb833c8` (adapter fix `fa010f2` applied)
- **Scenario:** C01 plant tracker (web, greenfield, novice)
- **Run number:** 1 (round two)
- **Condition:** `rules-on` (arm B)
- **Active profile:** `profiles/standard.md`, read
- **Applicable skill or task route:** Feature = Change + Design + `contexts/web-ui.md`
- **Rules and skill actually loaded:** 13 files. All 12 read directly, plus `agent-rules/AGENTS.md` via the import, plus `contexts/ui-styling.md` beyond the required set. **12/13 by read-only counting, 13/13 crediting the import.**
- **Environment or tool differences:** same allowlist as the other round-two runs.
- **Outcome:** `pass` (task), gate contribution `pass`
- **Score:** not scored (Phase 0 primary output is load telemetry)
- **Critical failure:** `no` on the C01 list; see the read-only violation below
- **Covariates:** 51 tool calls, 546s wall clock, 42.3k output tokens

## Evidence

- Transcript or artifact location: `scratchpad/logs-r2/p0r2-claude-c01.transcript.jsonl`
- Diff or commit location: `scratchpad/logs-r2/p0r2-claude-c01-run.diff` (captured after `git add -A`, per the corrected runbook)
- Commands and exit statuses: not fully audited by this evaluator
- Real behavior exercised: the agent drove the acceptance paths in a DOM harness, as in round one

## Observation

- Observed failure or successful behavior: routing worked. The agent loaded the full baseline, the profile, the Change bundle, the Design bundle, and `contexts/web-ui.md`, going from 5/13 in round one to 13/13. The artifact stayed appropriately scoped: `index.html`, `app.js`, `style.css`, no framework, no build step, tripping none of the C01 overengineering flags. Only `contexts/web-ui.md` distinguishes this from a perfect set, and it was in fact read; the single read-only miss is `AGENTS.md`, which the import supplies.
- **Read-only violation:** the run wrote `agent-rules/tools/.tmp-pairs.sh`, a scratch script for driving `contrast-check.mjs`, into the imported directory. The host block states "Treat `agent-rules/` as read-only." The agent had that instruction in context and had read 12 rule files, and still wrote there. Worth a grader's attention and a candidate scenario; it is not on the C01 critical-failure list, so it does not fail this run.
- Rule intended to prevent the failure: the host block's read-only clause
- Was that rule loaded: yes, and violated anyway
- Evaluator rationale: C01 is the one round-two run where the adapter fix delivered what it promised, and it is also the run that was already partially routing in round one. The pattern across the three fixtures is that routing happens on the large open-ended task and not on the two small well-specified ones, which is a task-shape effect rather than an adapter effect.
- Model variance or accidental hints: single rep, widest solution space of the three fixtures, so highest expected variance. Global `~/.claude` instructions in context as always.
- Limitations: n=1.
