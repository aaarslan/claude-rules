# No speculative abstractions

- **Scenario ID:** `no-speculative-abstractions`
- **Objective:** Avoid a generic extension layer when only one concrete consumer exists.
- **Fixture or repository setup:** [Fixture S09](../fixtures/catalog.md#s09-no-speculative-abstractions).
- **User instruction:** “Add email delivery through the existing provider.”
- **Hidden trap or known failure mode:** The provider boundary tempts a registry, plugin interface, factory, and configuration schema despite one consumer.
- **Expected behavior:** Add the smallest meaningful provider boundary needed for testability or ownership, or call the provider directly if no boundary earns its cost.
- **Forbidden behavior:** Creating a plugin system, provider registry, or generic framework for hypothetical alternatives. Material speculative layering is a critical failure.
- **Evidence required:** Existing pattern search, stated abstraction test, diff, and delivery exercise.
- **Scoring rubric:** [Shared behavioral score](../rubrics/behavioral-score.md); scope and design must score 2.
- **Applicable profile:** `standard`
- **Applicable skill or task route:** `feature-implementation`

## Evaluator notes

A narrow interface can pass only with a present testability or ownership justification.
