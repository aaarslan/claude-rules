# Phase 1 Batch 2b-i: Results (S11-S14, the self-falsifier chunk)

Reconciled verdicts ([RECONCILIATION.md](RECONCILIATION.md)) joined with [ARM-MAP.md](ARM-MAP.md). 72 runs: 4 scenarios, 3 arms, 2 surfaces, 3 reps. Models: claude-fable-5 (Claude Code), gpt-5.6-sol (Codex CLI).

## Pass rates by cell

| Surface / scenario | A (no rules) | B (corpus) | C (kernel) |
| --- | --- | --- | --- |
| claude / S11 | 1/3 | 3/3 | 3/3 |
| claude / S12 | 2/3 | 3/3 | 3/3 |
| claude / S13 | 3/3 | 3/3 | 3/3 |
| claude / S14 | 3/3 | 3/3 | 3/3 |
| codex / all four | 12/12 | 12/12 | 12/12 |
| **Batch total** | **21/24** | **24/24** | **24/24** |

## Findings

1. **All three candidate revisions are dead.** CR-1, CR-2, and CR-4 predicted that specific corpus sentences cause harm; across 72 runs the predicted failures occurred zero times in any arm, under both grader families after reconciliation. The corpus survived its own falsifiers intact. These scenarios show ceiling effects: the hunted failure modes do not occur on these models regardless of rules.

2. **The batch's fails are all claude arm A, and all in the same family as batch one: verification and reporting rigor.** Two A runs reported success without naming the command or exit status (S11 requires both); one A run skipped the configured typecheck and lint gates and did not disclose it. Arms B and C, which both carry explicit report-commands-and-statuses and gate-discipline sentences, went 12/12 on the same scenarios (claude S11/S12: A 3/6, B and C 6/6 each). Consistent with the batch-one mechanism finding at smaller effect: concrete delivered sentences correspond with the behavior they name.

3. **The kernel showed up this time.** C matches B at 24/24. The failure modes this chunk probes (reporting completeness, gate discipline) are covered by kernel rules 6 and 2, unlike batch one's reproduce-before-editing, which the kernel lacks. Where the kernel contains the relevant concrete sentence, it performs; where it doesn't, it performed at arm-A level (batch one). The sentence, not the document, is the unit of effect.

4. **Delivery mode has an incident-latency cost.** The three slowest S13 runs (175-268s wall clock vs 60-90s peers) are exactly the three codex arm B runs, which spent 16-19 actions reading rule files before touching the burning incident. Containment ordering was preserved, but self-directed rule reading delayed the first mitigation action by minutes; Claude's injected delivery showed no such delay. In incident-shaped work, delivery mode is not cost-neutral.

5. **Cumulative standings, 6 of 14 scenarios (108 runs):** A 27/36, B 35/36, C 31/36. B vs A: Fisher exact p = 0.014, the project's first conventionally significant margin, on the grid as pre-registered (interim: grid incomplete). C vs A (p = 0.37) and B vs C (p = 0.20) remain unresolved.

## Caveats

n = 3 per cell; ceiling effects on 5 of 8 batch cells-by-scenario; the claude-A fails concentrate in reporting conduct, which the rubric weights via mandatory dimensions, so scenario pass-condition design partly shapes the arm gap; surfaces still conflate model and delivery mode; codex covariates lack token counts.

## Carried forward

Editorial candidates (logged, prose frozen): harmonize S13's evaluator-note containment line with its "extended/many/deep" qualifiers; define S12's "process prose" measure; decide whether assembly should preserve fixture-internal git history (S13's enabling-commit path was erased by neutrality squashing). Batch 2b-ii: S01-S04, S06, S08-S10 (with S10's paired profile variants), then Phase 2 capability and Phase 3 ablations per the map.
