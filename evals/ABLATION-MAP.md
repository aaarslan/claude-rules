# Ablation Map

Attribute rule value causally: run `B minus one element` against full B on the scenarios that element is hypothesized to drive. Comparing B to A alone cannot attribute value to an individual file.

## Protocol

- **Trigger.** Ablate an element only where full B outperformed A on its mapped scenario in at least 2 of 3 Phase 1 reps. Scenarios 11 to 14 invert this: they carry harm hypotheses, so ablate where B underperformed and test whether removal improves the result.
- **Cluster first, file second.** Ablate a whole cluster; only if the cluster's removal changes outcomes, ablate files within it.
- **One removal per arm.** Three reps per ablation arm, identical fixture revisions, same agent and model as the triggering runs.
- **Prune criteria.** Remove a file from B only if its ablation shows no degradation on all of its mapped scenarios and no regression on one capability spot-check (C05).
- **Routing dependency.** Do not ablate or trim any redundancy, including skill completion paragraphs, until the Phase 0 routing gate in the [decision protocol](DECISION-PROTOCOL.md) has passed.

## Clusters

- **discovery:** `core/conventions.md`, `core/evidence-first.md`
- **scope:** `core/priorities.md`, `workflow/implementation.md`, `design/principles.md`, `core/anti-slop.md`
- **assurance:** `workflow/verification.md`, `quality/testing.md`, `profiles/`
- **process:** `workflow/design-checkpoint.md`, `workflow/skeptic-pass.md`, `workflow/review-ledger.md`

## Scenario map

| Scenario | Hypothesized driver(s) | Direction |
| --- | --- | --- |
| S01 polyrepo preservation | `core/conventions.md` | value |
| S02 prototype scope | `profiles/prototype.md` | value |
| S03 no invented APIs | `core/conventions.md` (installed-version rule); `core/anti-slop.md` | value |
| S04 scaffold cleanup | `core/anti-slop.md` | value |
| S05 narrow bug | `core/priorities.md`; `workflow/implementation.md` | value |
| S06 contract ripple | `core/evidence-first.md`; `workflow/implementation.md` | value |
| S07 failed verification | `workflow/verification.md`; `core/evidence-first.md` | value |
| S08 rejected architecture | `core/conventions.md`; `architecture/decision-making.md` | value |
| S09 speculative abstraction | `design/principles.md`; `core/anti-slop.md` | value |
| S10 profile-sensitive testing | `profiles/prototype.md`; `profiles/regulated.md`; `quality/testing.md` | value |
| S11 trivial ceremony | `workflow/design-checkpoint.md` | harm |
| S12 medium ceremony | `workflow/design-checkpoint.md`; `workflow/verification.md` | harm |
| S13 mitigation first | `core/evidence-first.md` (root-cause clause) | harm |
| S14 silent success | `core/evidence-first.md` (no-output clause) | wording |

Expected cost: typically 4 to 8 triggered ablation arms at 3 reps each, roughly 12 to 24 runs beyond the main grid.
