# Evaluation Result

- **Result ID:** P0-codex-c01
- **Agent product:** Codex CLI 0.144.4 (`codex exec --sandbox workspace-write`)
- **Model and version:** CLI default, not pinned by the runbook
- **Date:** 2026-07-18
- **Repository revision:** `cc0de40`; canonical corpus identical to baseline `cd58ed4`
- **Scenario:** C01 plant tracker (web, greenfield, novice)
- **Run number:** 1
- **Condition:** `rules-on` (arm B)
- **Active profile:** `profiles/standard.md`, read
- **Applicable skill or task route:** Feature = Change + Design + `contexts/web-ui.md`
- **Rules and skill actually loaded:** 11 files. Missing `design/principles.md` and `contexts/web-ui.md`. **11/13 required (84.6%).**
- **Environment or tool differences:** none material.
- **Outcome:** `pass` (task completed), see observation
- **Score:** not scored (Phase 0 primary output is load telemetry)
- **Critical failure:** `no` on the C01 list, but see the overengineering note
- **Covariates:** 135 shell invocations, 3194s wall clock (53 minutes)

## Evidence

- Transcript or artifact location: `scratchpad/logs/p0-codex-c01.stderr` (2.0 MB)
- Diff or commit location: artifacts are untracked, so `git diff` is empty. `git status` shows 17 top-level entries in `/tmp/p0-codex-c01`.
- Commands and exit statuses: not fully audited; the run ended with a Cloudflare Pages/Worker config being written
- Real behavior exercised: not verified by this evaluator

## Observation

- Observed failure or successful behavior: the artifact set includes `wrangler.jsonc`, `worker/`, `db/`, `drizzle/`, `drizzle.config.ts`, `shared/`, `tests/`, `eslint.config.mjs`, `vite.config.ts`, and `tsconfig.json`. For "i want a little website where i can keep track of my plants and when i watered them", that trips several C01 overengineering flags at once: a backend server, a database, and build pipeline beyond the chosen approach's default. Wall clock was 53 minutes against 7 minutes for the Claude run on the same prompt.
- Rule intended to prevent the failure: `core/anti-slop.md` and `design/principles.md` (scope discipline), and the prototype-versus-standard profile distinction
- Was that rule loaded: `core/anti-slop.md` yes, `design/principles.md` **no**. The host stub declared `profiles/standard.md`, not `prototype`, which is the correct router outcome for a host-declared profile but is arguably the wrong profile for a novice greenfield toy.
- Evaluator rationale: the two misses are the interesting part. `contexts/web-ui.md` was skipped even though the deliverable is a browser UI, and `design/principles.md` was skipped even though the Feature row requires Design. This is the one Codex run where routing was incomplete, and it is also the run that overbuilt. That pairing is suggestive, not evidence: n=1, and the profile selection is a plausible confound.
- Model variance or accidental hints: single rep, model not pinned. The greenfield prompt has the widest solution space of the three fixtures, so variance should be assumed highest here.
- Limitations: n=1. This run is a strong candidate for extra reps in Phase 2, and it raises a routing question the protocol should settle: whether a host-declared `standard` profile should survive contact with an obviously prototype-shaped request.
