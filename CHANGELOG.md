# Changelog

## 0.3.0 - 2026-07-19

### Released

- First public release. Baseline corpus frozen at `cd58ed4` and unchanged since; Claude Code mechanical delivery hook verified; behavioral evidence at 6 of 14 pre-registered scenarios (corpus 35/36 vs no-rules 27/36, two agent surfaces, two grader families) with full receipts under `evals/results/`. Measurement paused at interim findings; remaining grid, capability suite, and ablations are documented future work. MIT license added; README rewritten for adopters.

### Added

- Measurement pack: guardrail scenarios 11 to 14 with fixtures, an open-ended capability suite with hidden acceptance scripts and blinded pairwise grading, arm artifacts (minimal concrete kernel and abstract-paragraph negative control), a scenario-to-rule ablation map, and a pre-registered decision protocol with a candidate-revision ledger. No canonical rule prose changed.

### Changed

- Claude Code adapter, after the Phase 0 routing pilot failed its gate on that surface (13.2% routed-file load; Codex CLI passed at 94.7%): the ADOPT host block is now an imperative instruction to read the router and load its routed files, and Claude hosts import `@<path>/AGENTS.md` directly. Phase 0 runbook telemetry now counts only actual file loads and captures untracked artifacts. Canonical rule prose unchanged.
- Added `tools/route-hook.mjs`, mechanical route delivery for Claude Code hosts, after the Phase 0 rerun still failed its gate (33.3%) with the router fully in context: a `UserPromptSubmit` hook injects routed rule file contents directly, chunked under the context cap. `assemble-run.sh` wires it for arm B checkouts; ADOPT documents optional wiring for hosts. Evaluation runs must now isolate user-global agent memory.
- Route hook: greenfield context hints (web/UI and TypeScript/React prompts inject the matching context file without a host declaration), after Phase 0 round three passed its gate but showed greenfield context selection reaching neither injection nor reads. Isolation standard is `--setting-sources project,local`, probe-verified.

## 0.2.0 - 2026-07-18

### Added

- Agent-neutral `AGENTS.md`, thin Claude import, and seven repository Codex skills.
- Prototype, standard, and regulated delivery profiles.
- Dependency-free behavioral evaluations and structural validation.

### Changed

- Made `AGENTS.md` the sole compact router; README and skills no longer repeat routing policy.
- Reduced the universal core to priorities, evidence, and communication; code conventions and anti-slop load only for code work.
- Made concern rules and `related` links selective and non-recursive.
- Reclassified generic orphan, export, sink, and escaper scans as warnings or manual review.
- Enforced a 100-line file ceiling for rules and scripts plus prompt-facing word budgets.

### Adoption

- New hosts point `AGENTS.md` at the imported router, declare a profile and context allowlist, and optionally import it from `CLAUDE.md`.
- The repository may retain its current remote name. No tag, release, push, or remote setting change is included.
