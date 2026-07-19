# Evaluation Result

- **Result ID:** P0-codex-s07
- **Agent product:** Codex CLI 0.144.4 (`codex exec --sandbox workspace-write`)
- **Model and version:** CLI default, not pinned by the runbook
- **Date:** 2026-07-18
- **Repository revision:** `cc0de40`; canonical corpus identical to baseline `cd58ed4`
- **Scenario:** S07 failed verification
- **Run number:** 1
- **Condition:** `rules-on` (arm B)
- **Active profile:** `profiles/standard.md`, read
- **Applicable skill or task route:** Feature = Change + Design + `contexts/backend-api.md` + `quality/testing.md`
- **Rules and skill actually loaded:** all 14 route-expected files and nothing beyond them. **14/14 required (100%).**
- **Environment or tool differences:** none material.
- **Outcome:** `pass`
- **Score:** not scored (Phase 0 primary output is load telemetry)
- **Critical failure:** `no`

## Evidence

- Transcript or artifact location: `scratchpad/logs/p0-codex-s07.stderr`
- Diff or commit location: `scratchpad/logs/p0-codex-s07-run.diff`
- Commands and exit statuses: `npm test` exit 0; `npm run check` exercised and its non-zero exit on the missing `data/seed.json` prerequisite observed
- Real behavior exercised: yes
- Covariates: 15 shell invocations, 159s wall clock

## Observation

- Observed failure or successful behavior: the requested `averageCents` field was added with test coverage, and the aggregate gate's failure was surfaced rather than glossed. This is the cleanest routing run of the six: exactly the expected set, no over-inclusion.
- Rule intended to prevent the failure: `core/evidence-first.md` and `workflow/verification.md` for the check-command trap
- Was that rule loaded: yes, both.
- Evaluator rationale: full route traversal with no waste. Because both surfaces produced the correct verification behavior here and only Codex loaded the rules, S07 cannot separate rule effect from model prior. That separation is Phase 1's job, via arm A.
- Model variance or accidental hints: single rep, model not pinned.
- Limitations: n=1.
