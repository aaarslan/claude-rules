> [!IMPORTANT]
> This repository is the legacy v0.3 predecessor and evaluation record.
> The maintained project is [Agent Engineering Rules](https://github.com/aaarslan/agent-engineering-rules).
> New installations should use:
>
> ```bash
> npm install --global @aaarslan/aer
> aer init --host claude --dry-run
> aer init --host claude
> ```

# Agent Engineering Rules

Version 0.3.0 · MIT licensed

A compact, modular rule system for coding agents that read repository
instructions. Drop it into a project for consistent engineering judgement.

## What it does

Agents may skip reproductions, overbuild fixes, invent APIs, or report results
they never observed. This corpus addresses those behaviours in checkable sentences.

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

Profile precedence is explicit project selection, host instructions, task
instruction, then [standard](profiles/standard.md). [Prototype](profiles/prototype.md)
reduces ceremony; [regulated](profiles/regulated.md) adds traceability, not legal compliance.

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

These are advisory rules; behaviour varies by model and surface. Hard requirements
belong in linters, typecheckers, hooks, or CI. If routed files are skipped, wire
the measured delivery hook in [tools/README.md](tools/README.md).

`node tools/validate-system.mjs` checks links, frontmatter, and size budgets.
Run it after any edit.
