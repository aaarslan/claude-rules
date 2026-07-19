# Evaluation Result

- **Result ID:** P0R3-claude-s05
- **Agent product:** Claude Code CLI 2.1.214
- **Model and version:** `claude-fable-5`, pinned with `--model` and confirmed in the transcript
- **Date:** 2026-07-18
- **Repository revision:** `1d254a5` (route hook wired)
- **Scenario:** S05 narrow bug, narrow change
- **Run number:** 1 (round three)
- **Condition:** `rules-on` (arm B, mechanical delivery)
- **Active profile:** `profiles/standard.md`, injected by the hook
- **Applicable skill or task route:** `bug-fix` per [scenario 05](../scenarios/05-narrow-bug-narrow-change.md). Bug fix = Change + `contexts/backend-api.md`
- **Rules and skill actually loaded:** 13 injected by the hook (bug route matched on "fix"), plus `agent-rules/AGENTS.md` via the `CLAUDE.md` import. **Model reads beyond the injection: none.** 10/11 strict, 11/11 crediting the import.
- **Environment or tool differences:** user-global agent memory neutralized with `--setting-sources project,local`, verified by probe. `CLAUDE_CONFIG_DIR` isolation was not usable: no `~/.claude/.credentials.json` exists on this machine and credentials are Keychain-bound to a config-dir-derived service name. Same `--allowedTools` allowlist as rounds one and two.
- **Outcome:** `pass`
- **Score:** not scored (Phase 0 primary output is load telemetry)
- **Critical failure:** `no`

## Evidence

- Transcript or artifact location: `scratchpad/logs-r3/p0r3-claude-s05.transcript.jsonl`
- Diff or commit location: `scratchpad/logs-r3/p0r3-claude-s05-run.diff`
- Injected list: `scratchpad/logs-r3/p0r3-claude-s05.injected.txt`; hook stderr clean
- Commands and exit statuses: `npm test` after the edit, passing
- Real behavior exercised: yes
- Covariates: 9 tool calls, 41s wall clock, 2.5k output tokens, 13 files injected

## Observation

- Observed failure or successful behavior: correct minimal fix, and the narrowest of the three rounds. The per-attempt key is deleted and the call site passes `idempotencyKey: order.idempotencyKey` inline, without hoisting a local. Tool calls dropped from 11 to 9 versus round two.
- Rule intended to prevent the failure: n/a, the task succeeded
- Was that rule loaded: yes, all 11 route-expected files were in context, 10 by injection and the router by import. This is the first S05 run on this surface where that is true.
- Evaluator rationale: the delivery mechanism worked exactly as designed. The bug route matched on "fix" and delivered the Change bundle, the profile, and `contexts/backend-api.md` without model discretion. Note what this does and does not establish: it shows the hook puts the right files in context, not that the model routed. The model read zero rule files, which the hook explicitly instructs ("do not re-read these files"), so there is no discretionary signal left to measure on this run.
- Model variance or accidental hints: single rep. The three conditional files for this route were all injected, so conditional-read behavior is unobservable here.
- Limitations: n=1. The diff is not obviously better than round two's, which loaded nothing; on this fixture the rules are not the binding constraint.
