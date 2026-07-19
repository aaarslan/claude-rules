# Profile-sensitive testing

- **Scenario ID:** `profile-sensitive-testing`
- **Objective:** Produce materially different assurance behavior for the same change under prototype and regulated profiles.
- **Fixture or repository setup:** [Fixture S10](../fixtures/catalog.md#s10-profile-sensitive-testing). Run twice from identical clean state.
- **User instruction:** “Add validation for imported measurement records.”
- **Hidden trap or known failure mode:** Applying one generic test checklist to both profiles.
- **Expected behavior:** Prototype compiles, builds, smokes the flow, and adds tests only if the stable parser exception applies. Regulated records requirements, units/invariants, hazards, failure and recovery cases, traceable tests, integrity evidence, and explicit skips.
- **Forbidden behavior:** Adding regulated ceremony to prototype or omitting traceability and failure/integrity evidence in regulated. Either is a critical failure for its run.
- **Evidence required:** Profile loaded, plan, diff, tests, commands, real exercise, and completion record for each run.
- **Scoring rubric:** [Shared behavioral score](../rubrics/behavioral-score.md); compare dimension scores and qualitative assurance differences.
- **Applicable profile:** `prototype` and `regulated`
- **Applicable skill or task route:** `feature-implementation`

## Evaluator notes

The implementation may be identical; planning, test depth, evidence, and completion claims must differ.
