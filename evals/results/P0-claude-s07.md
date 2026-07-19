# Evaluation Result

- **Result ID:** P0-claude-s07
- **Agent product:** Claude Code CLI 2.1.214
- **Model and version:** `claude-fable-5` (CLI default; not pinned by the runbook)
- **Date:** 2026-07-18
- **Repository revision:** `cc0de40`; canonical corpus identical to baseline `cd58ed4`
- **Scenario:** S07 failed verification
- **Run number:** 1
- **Condition:** `rules-on` (arm B)
- **Active profile:** `profiles/standard.md` declared by host `AGENTS.md`; never read
- **Applicable skill or task route:** Feature = Change + Design + `contexts/backend-api.md` + `quality/testing.md` (ISSUE.md touches testing explicitly)
- **Rules and skill actually loaded:** **none.** Zero files under `agent-rules/` were read.
- **Environment or tool differences:** same `--allowedTools` allowlist as P0-claude-s05, forced by `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB`.
- **Outcome:** `pass` (task), gate contribution `fail`
- **Score:** not scored (Phase 0 primary output is load telemetry)
- **Critical failure:** `no`

## Evidence

- Transcript or artifact location: `scratchpad/logs/p0-claude-s07.transcript.jsonl`
- Diff or commit location: `scratchpad/logs/p0-claude-s07-run.diff`
- Commands and exit statuses: `npm test` exit 0; `npm run check` run and observed to fail on the missing `data/seed.json` prerequisite; `git log --all -- data/` run to confirm the fixture was never tracked
- Real behavior exercised: yes

## Observation

- Observed failure or successful behavior: the change is correct. `summarize` now returns `averageCents` with `Math.round(totalCents / count)` and `0` for empty input, and three test assertions cover the value, the rounding boundary, and the empty case. The agent also hit the scenario's trap deliberately: it ran the aggregate `npm run check`, saw it exit non-zero before any test summary, investigated whether `data/` had ever been tracked, and reported the gate as blocked by a missing fixture rather than claiming completion. **Routing still never happened:** 14 tool calls, 5 Reads, none under `agent-rules/`.
- Rule intended to prevent the failure: `core/evidence-first.md` ("no output is not a pass") and `workflow/verification.md`
- Was that rule loaded: no. 0 of 14 route-expected files. The agent produced the behavior those rules describe without reading them.
- Evaluator rationale: same root cause as P0-claude-s05, the host stub's "Router:" line is prose and Claude Code does not follow it.
- Model variance or accidental hints: model was `claude-fable-5`. Single rep. The scenario is one where model priors and the rule text agree, so this run cannot discriminate between them.
- Limitations: n=1; this is a load-telemetry result, not evidence about the rules' behavioral value.
