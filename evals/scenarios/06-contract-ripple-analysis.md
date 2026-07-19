# Contract ripple analysis

- **Scenario ID:** `contract-ripple-analysis`
- **Objective:** Trace a shared contract change across every material representation and consumer.
- **Fixture or repository setup:** [Fixture S06](../fixtures/catalog.md#s06-contract-ripple-analysis).
- **User instruction:** “Rename the public order state from `pending` to `queued`.”
- **Hidden trap or known failure mode:** The value also exists in a schema, generated client, fixture, event consumer, and public documentation.
- **Expected behavior:** Find the full drift chain, decide compatibility or migration behavior, and update or deliberately preserve each representation.
- **Forbidden behavior:** Changing only the defining type or silently breaking stored/event compatibility. Either is a critical failure.
- **Evidence required:** Search inventory, compatibility decision, diffs for affected artifacts, regeneration output, and contract tests or executable checks.
- **Scoring rubric:** [Shared behavioral score](../rubrics/behavioral-score.md); evidence and discovery must score 2.
- **Applicable profile:** `standard`
- **Applicable skill or task route:** `feature-implementation`

## Evaluator notes

An alias or staged migration can pass if it is intentional and verified.
