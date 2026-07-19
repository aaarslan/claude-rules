# Agent Engineering Rules

Version 0.3.0

A compact, modular rule system for Claude Code, OpenAI Codex CLI and IDE integrations, Codex Cloud, and other coding agents that follow repository instructions. Behaviorally tested: see the evidence section below.

## Start here

- Coding agents follow [AGENTS.md](AGENTS.md), the single task router.
- Claude Code reaches the router through the [CLAUDE.md](CLAUDE.md) import; if your agent skips routed files, wire the mechanical delivery hook per [tools/README.md](tools/README.md).
- Host repositories follow [ADOPT.md](ADOPT.md) and keep this directory read-only.

Do not load the whole repository. The router selects a small universal core, one delivery profile, one task route, and only evidence-matched technology contexts.

## Architecture

| Area | Authority |
| --- | --- |
| `core/` | Priorities, evidence, conventions, generated-code failure modes, communication |
| `workflow/` | Implementation, verification, autonomous work, review convergence, skeptic pass |
| `design/` and `architecture/` | Code and system design, loaded by concern |
| `quality/` | Testing, security, observability, performance |
| `contexts/` | Technology and workflow guidance, loaded only when present |
| `profiles/` | Delivery assurance independent of task type |

Shared policy appears once in these canonical directories; agent entrypoints and skills only route to it. Profile precedence: explicit project selection, host instructions, task instruction, then [standard](profiles/standard.md). [Prototype](profiles/prototype.md) reduces ceremony, never correctness; [regulated](profiles/regulated.md) adds traceability without establishing legal compliance. Repository-scoped Codex skills live under `.agents/skills/`.

## Evidence

These rules were tested under a pre-registered protocol ([evals/DECISION-PROTOCOL.md](evals/DECISION-PROTOCOL.md)): blinded runs across three arms (no rules, this corpus, a minimal-kernel control), two agent surfaces, two independent grader families. Interim results at 6 of 14 scenarios (108 runs): the corpus passed 35/36 guardrail runs against 27/36 for no rules (Fisher exact p = 0.014). The mechanism is sentence-level: concrete behavioral sentences (reproduce before editing, report commands with exit statuses) correspond with the conduct they name; the kernel control matched the corpus only where it carries the same sentences. Three candidate harms in the corpus's own rules were tested and rejected. Full receipts, reconciliations, and caveats live under `evals/results/`; claims extend only to the tested scenarios, models, and surfaces. Not yet measured: open-ended capability outcomes and additional model families. Measurement is paused, not abandoned.

## Tools

`node tools/validate-system.mjs` checks links, frontmatter, skill metadata, and instruction-size budgets. [tools/README.md](tools/README.md) documents the route-delivery hook and review scanners.

These rules are advisory and behavior varies by model and surface. Requirements that must never fail belong in repository-native linters, typecheckers, hooks, or CI gates.

MIT licensed. See [LICENSE](LICENSE).
