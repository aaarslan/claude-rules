# Agent Engineering Rules

Version 0.3.0 · MIT licensed

A compact, modular rule system for coding agents that read repository
instructions: Claude Code, Codex CLI and IDE integrations, Codex Cloud, and
others. Drop it into a project and your agent gets consistent engineering
judgement instead of its defaults.

**New here? Go to [INSTALL.md](INSTALL.md).** It takes about five minutes.

## What it does

Agents left alone skip reproductions, overbuild small fixes, invent APIs they
half-remember, and report a green result they never observed. This corpus names
those behaviours in specific, checkable sentences.

The router loads a small universal core, one profile, one task route, and only
the technology contexts your repository shows evidence of: roughly 1,300 words
for a typical task, not the whole corpus.

## What is in it

| Area | Authority |
| --- | --- |
| `core/` | Priorities, evidence, conventions, generated-code failure modes, communication |
| `workflow/` | Implementation, verification, autonomous work, review convergence, skeptic pass |
| `design/`, `architecture/` | Code and system design, loaded by concern |
| `quality/` | Testing, security, observability, performance |
| `contexts/` | Technology guidance, loaded only when that technology is present |
| `profiles/` | Delivery assurance: prototype, standard, regulated |

[AGENTS.md](AGENTS.md) is the router and the authority on what loads when.
[ADOPT.md](ADOPT.md) is the integration procedure an agent follows.
[CLAUDE.md](CLAUDE.md) is the Claude Code adapter.

Profile precedence: explicit project selection, then host instructions, then task
instruction, otherwise [standard](profiles/standard.md).
[Prototype](profiles/prototype.md) reduces ceremony, never correctness.
[Regulated](profiles/regulated.md) adds traceability; it does not establish legal
compliance.

## Does it actually work

Tested under a pre-registered protocol: blinded runs across three arms (no rules,
this corpus, a minimal-kernel control), two agent surfaces, two independent
grader families. At 6 of 14 scenarios (108 runs) the corpus passed 35/36
guardrail runs against 27/36 for no rules (Fisher exact p = 0.014).

The mechanism is sentence-level: concrete sentences ("reproduce the failure
before editing") correspond with the conduct they name, abstract restatements
did not, and the kernel control matched only where it carried the same
sentences. Three candidate harms in these rules were tested and rejected.

Claims extend only to the tested scenarios, models, and surfaces. Protocol,
per-run findings, and caveats: [evals/](evals/). Paused at 6 of 14 scenarios.

## Honest limits

Advisory rules; behaviour varies by model and surface. Anything that must never
fail belongs in a linter, typechecker, hook, or CI gate, not in prose an agent
may or may not follow. If your agent skips routed files despite the router being
in context, wire the delivery hook in [tools/README.md](tools/README.md); that
failure mode is real and measured.

`node tools/validate-system.mjs` checks links, frontmatter, and size budgets.
Run it after any edit.
