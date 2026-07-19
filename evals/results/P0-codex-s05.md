# Evaluation Result

- **Result ID:** P0-codex-s05
- **Agent product:** Codex CLI 0.144.4 (`codex exec --sandbox workspace-write`)
- **Model and version:** CLI default, not pinned by the runbook
- **Date:** 2026-07-18
- **Repository revision:** `cc0de40`; canonical corpus identical to baseline `cd58ed4`
- **Scenario:** S05 narrow bug, narrow change
- **Run number:** 1
- **Condition:** `rules-on` (arm B)
- **Active profile:** `profiles/standard.md`, read
- **Applicable skill or task route:** Bug fix = Change + `contexts/backend-api.md`
- **Rules and skill actually loaded:** 16 files. All 11 route-expected, plus `workflow/design-checkpoint.md`, `design/boundaries.md`, `design/errors-and-side-effects.md`, `quality/testing.md`, `quality/security.md`. **11/11 required (100%).**
- **Environment or tool differences:** none material. Codex reads pointer paths literally via `sed`, so no adapter was needed.
- **Outcome:** `pass`
- **Score:** not scored (Phase 0 primary output is load telemetry)
- **Critical failure:** `no`

## Evidence

- Transcript or artifact location: `scratchpad/logs/p0-codex-s05.stderr`
- Diff or commit location: `scratchpad/logs/p0-codex-s05-run.diff`
- Commands and exit statuses: `npm run repro` and `npm test`, 3 pass / 0 fail after the edit
- Real behavior exercised: yes
- Covariates: 8 shell invocations, 157s wall clock

## Observation

- Observed failure or successful behavior: correct minimal fix. The per-attempt key was deleted and the call now passes `idempotencyKey: order.idempotencyKey` directly. Note this is a narrower fix than the Claude run's `order.idempotencyKey ?? order.id`: it assumes the field is always present, which the fixture satisfies but which has no fallback if it is not. Worth a grader's attention rather than an automatic pass.
- Rule intended to prevent the failure: n/a, the task succeeded
- Was that rule loaded: yes, in full. Two batched `sed` reads pulled the router, profile, active context, and priorities first, then the four core files, the three workflow files, and four concern files.
- Evaluator rationale: routing worked exactly as designed on this surface. The agent read the host `AGENTS.md`, followed the "Router:" pointer to `agent-rules/AGENTS.md`, then loaded the baseline and the Bug fix task row. It also loaded five conditional files beyond the required set, which is over-inclusive but permitted, the router gates those on "when that concern is touched".
- Model variance or accidental hints: single rep, model not pinned.
- Limitations: n=1. Over-inclusive loading inflates instruction tokens and is a cost covariate worth tracking in Phase 1, not a routing defect.
