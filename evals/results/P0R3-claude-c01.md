# Evaluation Result

- **Result ID:** P0R3-claude-c01
- **Agent product:** Claude Code CLI 2.1.214
- **Model and version:** `claude-fable-5`, pinned with `--model` and confirmed in the transcript
- **Date:** 2026-07-18
- **Repository revision:** `1d254a5` (route hook wired)
- **Scenario:** C01 plant tracker (web, greenfield, novice)
- **Run number:** 1 (round three)
- **Condition:** `rules-on` (arm B, mechanical delivery)
- **Active profile:** `profiles/standard.md`, injected by the hook
- **Applicable skill or task route:** Feature = Change + Design + `contexts/web-ui.md`
- **Rules and skill actually loaded:** 15 injected, plus `agent-rules/AGENTS.md` via the import. **Model reads beyond the injection: none.** 11/13 strict, 12/13 crediting the import. Missing: `contexts/web-ui.md`.
- **Environment or tool differences:** same isolation and allowlist as the other round-three runs.
- **Outcome:** `pass`
- **Score:** not scored (Phase 0 primary output is load telemetry)
- **Critical failure:** `no`
- **Covariates:** 8 tool calls, 200s wall clock, 15.0k output tokens, 15 files injected

## Evidence

- Transcript or artifact location: `scratchpad/logs-r3/p0r3-claude-c01.transcript.jsonl`
- Diff or commit location: `scratchpad/logs-r3/p0r3-claude-c01-run.diff` (captured after `git add -A`)
- Injected list: `scratchpad/logs-r3/p0r3-claude-c01.injected.txt`; hook stderr clean
- Commands and exit statuses: `node --test` against a written `app.test.js`, then a DOM harness written to the session scratchpad and executed
- Real behavior exercised: yes
- Artifacts: `index.html`, `app.js`, `app.test.js`

## Observation

- Observed failure or successful behavior: three files, no framework, no build step, tripping none of the C01 overengineering flags, and this time with a checked-in test file. Two regressions from round two disappeared. The run did not write into `agent-rules/`; its verification harness went to the session scratchpad instead, so the read-only violation recorded in round two did not recur. Cost fell sharply: 8 tool calls against 51, 200s against 546s, 15.0k output tokens against 42.3k.
- **The one genuine routing gap:** `contexts/web-ui.md` was neither injected nor read. The hook derives contexts from the host `AGENTS.md` declaration lines, and the empty fixture's host block declares "none preselected; select from evidence per the router". So for a greenfield checkout the hook has no context to declare, and context selection falls back to model discretion, which produced nothing. Round two's model-driven run did read `contexts/web-ui.md` and `contexts/ui-styling.md`. Mechanical delivery is therefore strictly better on workflow files and strictly worse on context selection for greenfield work.
- Rule intended to prevent the failure: `contexts/web-ui.md` for the browser-UI concern
- Was that rule loaded: no
- Evaluator rationale: this is the only required-file miss in round three and the only one not attributable to the router-import bookkeeping. It is a real limitation of keyword-plus-declaration routing, not a hook execution failure: the hook did exactly what it was told, and there was nothing to tell it. Worth the protocol owner's attention before Phase 2, where five of six capability tasks are greenfield.
- Model variance or accidental hints: single rep, widest solution space of the three fixtures. The cost drop is confounded: less exploration may reflect the injected rules or may reflect ordinary variance on an open-ended prompt.
- Limitations: n=1. The acceptance script was not independently replayed by this evaluator.
